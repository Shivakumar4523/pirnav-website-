import express from "express";
import { commit, getStore, nextId } from "../storage/store.js";
import { requireAdminAuth } from "../middleware/auth.js";

const router = express.Router();

const normalizeJobStatus = (value) => {
  const v = String(value || "").trim().toLowerCase();
  if (v === "open") return "open";
  if (v === "closed") return "closed";
  return "open";
};

router.get("/public", (req, res) => {
  const { jobs } = getStore();
  const openJobs = jobs.filter((j) => normalizeJobStatus(j.status) === "open");
  return res.json(openJobs);
});

router.get("/public/:id", (req, res) => {
  const { jobs } = getStore();
  const id = Number(req.params.id);
  const job = jobs.find((j) => Number(j.id) === id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  return res.json(job);
});

// --------------------------
// Admin jobs (CRUD)
// --------------------------
router.get("/", requireAdminAuth, (req, res) => {
  return res.json(getStore().jobs);
});

router.post("/", requireAdminAuth, (req, res) => {
  const payload = req.body || {};

  const id = nextId("job");
  const now = new Date().toISOString();

  const job = {
    id,
    jobTitle: String(payload.jobTitle || "").trim(),
    workLocation: String(payload.workLocation || "").trim(),
    jobType: String(payload.jobType || "full-time").trim(),
    status: normalizeJobStatus(payload.status),
    experience: String(payload.experience || "").trim(),
    ctc: String(payload.ctc || "").trim(),
    highestQualification: String(payload.highestQualification || "").trim(),
    jobDescription: String(payload.jobDescription || "").trim(),
    mandatorySkills: String(payload.mandatorySkills || "").trim(),
    createdAt: now,
    updatedAt: now,
  };

  getStore().jobs.push(job);
  commit();

  return res.status(201).json(job);
});

router.put("/:id", requireAdminAuth, (req, res) => {
  const { jobs } = getStore();
  const id = Number(req.params.id);
  const job = jobs.find((j) => Number(j.id) === id);

  if (!job) return res.status(404).json({ message: "Job not found" });

  const payload = req.body || {};
  Object.assign(job, {
    jobTitle: String(payload.jobTitle ?? job.jobTitle).trim(),
    workLocation: String(payload.workLocation ?? job.workLocation).trim(),
    jobType: String(payload.jobType ?? job.jobType).trim(),
    status: normalizeJobStatus(payload.status ?? job.status),
    experience: String(payload.experience ?? job.experience).trim(),
    ctc: String(payload.ctc ?? job.ctc).trim(),
    highestQualification: String(payload.highestQualification ?? job.highestQualification).trim(),
    jobDescription: String(payload.jobDescription ?? job.jobDescription).trim(),
    mandatorySkills: String(payload.mandatorySkills ?? job.mandatorySkills).trim(),
    updatedAt: new Date().toISOString(),
  });

  commit();
  return res.json(job);
});

router.delete("/:id", requireAdminAuth, (req, res) => {
  const { jobs } = getStore();
  const id = Number(req.params.id);
  const idx = jobs.findIndex((j) => Number(j.id) === id);
  if (idx === -1) return res.status(404).json({ message: "Job not found" });

  jobs.splice(idx, 1);
  commit();
  return res.status(204).send();
});

export default router;

