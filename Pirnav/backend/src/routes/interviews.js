import express from "express";
import path from "path";
import { commit, getStore, nextId } from "../storage/store.js";
import { requireAdminAuth } from "../middleware/auth.js";

const router = express.Router();

const normalizeInterviewStatus = (value) => {
  const v = String(value || "").trim().toLowerCase();
  if (v === "completed") return "Completed";
  if (v === "cancelled" || v === "canceled") return "Cancelled";
  // default / scheduled
  return "Scheduled";
};

const normalizeMode = (value) => {
  const v = String(value || "").trim().toLowerCase();
  return v === "offline" ? "Offline" : "Online";
};

function buildInterviewRow(interview) {
  const store = getStore();
  const application = store.jobApplications.find(
    (a) => String(a.id) === String(interview.applicationId)
  );

  const candidateName = application?.name || "";
  const email = application?.email || "";
  const jobTitle = application?.jobTitle || "";
  const applicationStatus = application?.status || "pending";

  return {
    id: interview.id,
    applicationId: interview.applicationId,

    candidateName,
    name: candidateName, // alias for robustness
    email,
    jobTitle,
    position: jobTitle, // alias

    interviewDate: interview.interviewDate,
    date: interview.interviewDate, // alias
    interviewTime: interview.interviewTime,
    time: interview.interviewTime, // alias
    mode: interview.mode,

    status: interview.status,

    managerId: interview.managerId,
    managerName: interview.managerName || `Manager #${interview.managerId}`,

    meetingLink: interview.meetingLink,
    notes: interview.notes,

    applicationStatus,
    selectedDate: application?.selectedDate || "",
    application: {
      id: application?.id || interview.applicationId,
      status: applicationStatus,
      selectedDate: application?.selectedDate || "",
      name: candidateName,
      email,
      jobTitle,
    },
  };
}

// --------------------------
// Admin: list interviews
// --------------------------
router.get("/", requireAdminAuth, (req, res) => {
  const { interviews } = getStore();
  const list = interviews
    .slice()
    .sort((a, b) => new Date(b.interviewDate).getTime() - new Date(a.interviewDate).getTime())
    .map(buildInterviewRow);

  return res.json(list);
});

// --------------------------
// Admin: create interview
// --------------------------
router.post("/", requireAdminAuth, (req, res) => {
  const payload = req.body || {};
  const applicationId = Number(payload.applicationId);

  if (!applicationId) return res.status(400).json({ message: "applicationId is required" });

  const store = getStore();
  const application = store.jobApplications.find((a) => Number(a.id) === applicationId);
  if (!application) return res.status(404).json({ message: "Application not found" });

  const id = nextId("interview");
  const interview = {
    id,
    applicationId,
    managerId: Number(payload.managerId) || null,
    managerName: `Manager #${payload.managerId || ""}`.trim(),

    interviewDate: payload.interviewDate,
    interviewTime: payload.interviewTime,
    mode: normalizeMode(payload.mode),
    meetingLink: String(payload.meetingLink || "").trim(),
    notes: String(payload.notes || "").trim(),

    status: normalizeInterviewStatus(payload.status || "Scheduled"),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.interviews.push(interview);
  commit();

  // For applicationsContext.extractInterviewDetails
  return res.status(201).json({
    interviewScheduled: true,
    interviewDetails: {
      date: interview.interviewDate,
      time: interview.interviewTime,
      mode: interview.mode,
      meetingLink: interview.meetingLink,
      managerName: interview.managerName,
      managerId: interview.managerId,
      notes: interview.notes,
    },
  });
});

// --------------------------
// Admin: update interview
// --------------------------
router.put("/:id", requireAdminAuth, (req, res) => {
  const payload = req.body || {};
  const id = Number(req.params.id);
  const { interviews, jobApplications } = getStore();

  const interview = interviews.find((i) => Number(i.id) === id);
  if (!interview) return res.status(404).json({ message: "Interview not found" });

  interview.interviewDate = payload.interviewDate ?? interview.interviewDate;
  interview.interviewTime = payload.interviewTime ?? interview.interviewTime;
  interview.mode = normalizeMode(payload.mode ?? interview.mode);
  const meetingLink = payload.meetingLink ?? interview.meetingLink;
  interview.meetingLink = String(meetingLink || "").trim();
  const notes = payload.notes ?? interview.notes;
  interview.notes = String(notes || "").trim();
  interview.managerId = payload.managerId ?? interview.managerId;
  interview.managerName = `Manager #${interview.managerId || ""}`.trim();
  interview.status = normalizeInterviewStatus(payload.status ?? interview.status);
  interview.updatedAt = new Date().toISOString();

  commit();

  return res.json(buildInterviewRow(interview));
});

export default router;

