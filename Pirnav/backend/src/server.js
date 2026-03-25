import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import jobsRouter from "./routes/jobs.js";
import contactRouter from "./routes/contact.js";
import adminRouter from "./routes/admin.js";
import jobApplicationsRouter from "./routes/jobApplications.js";
import interviewsRouter from "./routes/interviews.js";
import { commit, getStore, nextId } from "./storage/store.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOriginsEnv = process.env.CORS_ORIGINS || "";
const corsOrigins = corsOriginsEnv
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "2mb" }));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Routes
app.use("/api/Jobs", jobsRouter);
app.use("/api/Contact", contactRouter);
app.use("/api/Admin", adminRouter);

// Job applications / candidates (alias)
app.use("/api/JobApplications", jobApplicationsRouter);
app.use("/api/candidates", jobApplicationsRouter);

// Interviews / interview (aliases)
app.use("/api/interview", interviewsRouter);
app.use("/api/interviews", interviewsRouter);

// Seed sample data for first run
function seedSampleJobs() {
  const store = getStore();
  if (store.jobs.length > 0) return;

  const now = new Date().toISOString();
  const sampleJobs = [
    {
      jobTitle: "Software Engineer",
      workLocation: "Hyderabad",
      jobType: "full-time",
      status: "open",
      experience: "3-5 years",
      ctc: "10 LPA",
      highestQualification: "B.Tech",
      jobDescription:
        "Work on full-stack applications and platform modernization. Collaborate with cross-functional teams.",
      mandatorySkills: "React, Node.js, SQL",
    },
    {
      jobTitle: "QA Automation Engineer",
      workLocation: "Bangalore",
      jobType: "full-time",
      status: "open",
      experience: "2-4 years",
      ctc: "8 LPA",
      highestQualification: "B.E/B.Tech",
      jobDescription:
        "Build reliable test automation pipelines and ensure quality across web and API layers.",
      mandatorySkills: "Playwright, Jest, CI/CD",
    },
    {
      jobTitle: "DevOps Engineer",
      workLocation: "Remote",
      jobType: "remote",
      status: "open",
      experience: "4-7 years",
      ctc: "14 LPA",
      highestQualification: "Bachelor's Degree",
      jobDescription:
        "Own infrastructure reliability, deployment automation, and observability for critical services.",
      mandatorySkills: "Docker, Kubernetes, Terraform",
    },
  ];
  for (const j of sampleJobs) {
    store.jobs.push({
      id: nextId("job"),
      ...j,
      createdAt: now,
      updatedAt: now,
    });
  }
  commit();
}

seedSampleJobs();

const port = Number(process.env.PORT || 5001);
app.listen(port, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log(`[pirnav-backend] listening on port ${port}`);
});

