import express from "express";
import jwt from "jsonwebtoken";
import { commit, getStore, nextId } from "../storage/store.js";
import { requireAdminAuth } from "../middleware/auth.js";
import { hashPassword, verifyPassword } from "../storage/auth.js";

const router = express.Router();

const seedDefaultAdminIfNeeded = () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;

  const store = getStore();
  const exists = store.adminUsers.some((u) => String(u.email).toLowerCase() === String(ADMIN_EMAIL).toLowerCase());
  if (exists) return;

  const { salt, hash } = hashPassword(String(ADMIN_PASSWORD), null);
  store.adminUsers.push({
    id: nextId("admin"),
    email: String(ADMIN_EMAIL).trim(),
    password: { salt, hash },
  });
  commit();
};

router.post("/login", (req, res) => {
  seedDefaultAdminIfNeeded();

  const payload = req.body || {};
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const store = getStore();
  const adminUser = store.adminUsers.find((u) => String(u.email).toLowerCase() === email);
  if (!adminUser || !verifyPassword(password, adminUser.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const secret = process.env.ADMIN_JWT_SECRET || "dev-secret-change-me";
  const token = jwt.sign(
    {
      email: adminUser.email,
    },
    secret,
    {
      subject: String(adminUser.id),
      expiresIn: "7d",
    }
  );

  return res.json({ token });
});

router.get("/dashboard-summary", requireAdminAuth, (req, res) => {
  const { jobs, jobApplications, contactMessages } = getStore();

  const selectedCandidates = jobApplications.filter((a) => String(a.status).toLowerCase() === "selected").length;
  const pendingApplications = jobApplications.filter((a) => String(a.status).toLowerCase() === "pending").length;
  const openPositions = jobs.filter((j) => String(j.status).toLowerCase() === "open").length;
  const unreadMessages = contactMessages.filter((m) => String(m.status).toLowerCase() === "unread").length;

  return res.json({
    data: {
      selectedCandidates,
      unreadMessages,
      openPositions,
      pendingApplications,
    },
  });
});

router.get("/recent-messages", requireAdminAuth, (req, res) => {
  const list = [...getStore().contactMessages]
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    .slice(0, 5)
    .map((m) => ({
      id: m.id,
      name: m.name,
      subject: m.subject,
      message: m.message,
      date: m.createdDate,
    }));

  return res.json(list);
});

router.get("/recent-applications", requireAdminAuth, (req, res) => {
  const list = [...getStore().jobApplications]
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      name: a.name,
      position: a.jobTitle,
      status: a.status,
      appliedDate: a.appliedDate,
    }));

  return res.json(list);
});

export default router;

