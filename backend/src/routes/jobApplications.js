import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import multer from "multer";
import { fileURLToPath } from "url";
import { commit, getStore, nextId } from "../storage/store.js";
import { requireAdminAuth } from "../middleware/auth.js";

const router = express.Router();

const BACKEND_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const RESUME_DIR = path.join(BACKEND_ROOT, "uploads", "resumes");

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

ensureDir(RESUME_DIR);

const normalizeApplicationStatus = (value) => {
  const v = String(value || "").trim().toLowerCase();
  if (v === "pending") return "pending";
  if (v === "shortlisted") return "shortlisted";
  if (v === "selected") return "selected";
  if (v === "rejected") return "rejected";
  // Accept label forms like "Pending"/"Selected"
  if (v === "short listed") return "shortlisted";
  return "pending";
};

const buildPublicApplication = (application) => {
  const interview = getStore().interviews.find(
    (i) => String(i.applicationId) === String(application.id)
  );

  const interviewScheduled = Boolean(interview);

  return {
    id: application.id,
    jobId: application.jobId,
    name: application.name,
    email: application.email,
    jobTitle: application.jobTitle,
    status: application.status,
    appliedDate: application.appliedDate,
    selectedDate: application.selectedDate || "",
    interviewScheduled,
    interviewDetails: interview
      ? {
          date: interview.interviewDate,
          time: interview.interviewTime,
          mode: interview.mode,
          meetingLink: interview.meetingLink,
          managerName: interview.managerName || "",
          managerId: interview.managerId,
          notes: interview.notes,
        }
      : null,
  };
};

const resumeUpload = multer({
  storage: multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, RESUME_DIR);
    },
    filename: function (_req, file, cb) {
      const ext = path.extname(file.originalname || "") || "";
      const safeExt = ext.replace(/[^.a-zA-Z0-9]/g, "");
      const unique = crypto.randomBytes(12).toString("hex");
      cb(null, `${Date.now()}-${unique}${safeExt}`);
    },
  }),
  limits: {
    fileSize: 6 * 1024 * 1024, // allow a little overhead beyond the UI's 5MB check
  },
});

// -----------------------------------
// Public job applications (multipart)
// -----------------------------------
router.post("/", resumeUpload.single("Resume"), (req, res) => {
  const store = getStore();
  const file = req.file;

  if (!file) {
    return res.status(400).send("Resume is required");
  }

  const jobId = Number(req.body.JobId);
  const job = store.jobs.find((j) => Number(j.id) === jobId);
  if (!job) {
    return res.status(400).send("Invalid JobId");
  }

  const id = nextId("application");
  const now = new Date().toISOString();

  const application = {
    id,
    jobId,
    jobTitle: job.jobTitle,

    name: String(req.body.Name || "").trim(),
    email: String(req.body.Email || "").trim(),
    phoneNumber: String(req.body.PhoneNumber || "").trim(),
    dateOfBirth: String(req.body.DateOfBirth || "").trim(),
    gender: String(req.body.Gender || "").trim(),
    highestQualification: String(req.body.HighestQualification || "").trim(),
    totalExperience: String(req.body.TotalExperience || "").trim(),
    currentCompany: String(req.body.CurrentCompany || "").trim(),
    currentCTC: String(req.body.CurrentCTC || "").trim(),
    expectedCTC: String(req.body.ExpectedCTC || "").trim(),
    noticePeriod: String(req.body.NoticePeriod || "").trim(),
    currentLocation: String(req.body.CurrentLocation || "").trim(),
    linkedInUrl: String(req.body.LinkedInUrl || "").trim(),

    resume: {
      filename: file.filename,
      originalName: file.originalname || "resume",
      mime: file.mimetype || "application/octet-stream",
    },

    appliedDate: now,
    status: "pending",
    selectedDate: "",
  };

  store.jobApplications.push(application);
  commit();

  return res.status(201).json({ id: application.id, status: application.status });
});

// -----------------------------------
// Admin: list applications
// -----------------------------------
router.get("/", requireAdminAuth, (req, res) => {
  const { jobApplications } = getStore();
  const list = jobApplications
    .slice()
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .map(buildPublicApplication);

  return res.json(list);
});

// -----------------------------------
// Admin: status updates
// -----------------------------------
function updateApplicationStatus(applicationId, statusRaw) {
  const store = getStore();
  const application = store.jobApplications.find(
    (a) => String(a.id) === String(applicationId)
  );
  if (!application) return null;

  const nextStatus = normalizeApplicationStatus(statusRaw);
  application.status = nextStatus;
  application.selectedDate = nextStatus === "selected" ? new Date().toISOString() : "";

  // Interview scheduling depends on status, but we keep interview data as-is.
  commit();
  return application;
}

router.put("/status", requireAdminAuth, (req, res) => {
  const body = req.body || {};
  const applicationId = Number(body.applicationId);
  const statusRaw = body.status;

  if (!applicationId || !statusRaw) {
    return res.status(400).json({ message: "applicationId and status are required" });
  }

  const updated = updateApplicationStatus(applicationId, statusRaw);
  if (!updated) return res.status(404).json({ message: "Application not found" });

  return res.json(buildPublicApplication(updated));
});

router.put("/:id/status", requireAdminAuth, (req, res) => {
  const body = req.body || {};
  const applicationId = Number(req.params.id);
  const statusRaw = body.status;

  if (!applicationId || !statusRaw) {
    return res.status(400).json({ message: "id and status are required" });
  }

  const updated = updateApplicationStatus(applicationId, statusRaw);
  if (!updated) return res.status(404).json({ message: "Application not found" });

  return res.json(buildPublicApplication(updated));
});

// -----------------------------------
// Admin: resume download
// -----------------------------------
router.get("/download/:id", requireAdminAuth, (req, res) => {
  const store = getStore();
  const id = Number(req.params.id);
  const application = store.jobApplications.find((a) => Number(a.id) === id);
  if (!application) return res.status(404).json({ message: "Application not found" });

  const fileInfo = application.resume || {};
  const filePath = path.join(RESUME_DIR, fileInfo.filename);
  if (!fileInfo.filename || !fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Resume file not found" });
  }

  res.setHeader("Content-Type", fileInfo.mime || "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="resume.pdf"`
  );
  return res.sendFile(filePath);
});

export default router;

