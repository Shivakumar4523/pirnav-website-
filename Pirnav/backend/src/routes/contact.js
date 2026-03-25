import express from "express";
import { commit, getStore, nextId } from "../storage/store.js";
import { requireAdminAuth } from "../middleware/auth.js";

const router = express.Router();

const normalizeMessageStatus = (value) => {
  const v = String(value || "").trim().toLowerCase();
  if (v === "read") return "Read";
  return "Unread";
};

router.post("/", (req, res) => {
  const payload = req.body || {};

  const id = nextId("message");
  const now = new Date().toISOString();

  const message = {
    id,
    name: String(payload.name || "").trim(),
    email: String(payload.email || "").trim(),
    purposeOfContact: String(payload.purposeOfContact || "").trim(),
    subject: String(payload.subject || payload.purposeOfContact || "").trim(),
    message: String(payload.message || "").trim(),
    status: "Unread",
    createdDate: now,
  };

  const { contactMessages } = getStore();
  contactMessages.push(message);
  commit();

  return res.status(201).json(message);
});

router.get("/", requireAdminAuth, (req, res) => {
  return res.json(getStore().contactMessages);
});

router.get("/unread-count", requireAdminAuth, (req, res) => {
  const unread = getStore().contactMessages.filter((m) => normalizeMessageStatus(m.status) === "Unread").length;
  return res.json({ unread });
});

router.get("/:id", requireAdminAuth, (req, res) => {
  const id = Number(req.params.id);
  const message = getStore().contactMessages.find((m) => Number(m.id) === id);
  if (!message) return res.status(404).json({ message: "Message not found" });
  return res.json(message);
});

router.put("/mark-read/:id", requireAdminAuth, (req, res) => {
  const id = Number(req.params.id);
  const message = getStore().contactMessages.find((m) => Number(m.id) === id);
  if (!message) return res.status(404).json({ message: "Message not found" });

  message.status = "Read";
  commit();
  return res.json(message);
});

router.delete("/:id", requireAdminAuth, (req, res) => {
  const id = Number(req.params.id);
  const list = getStore().contactMessages;
  const idx = list.findIndex((m) => Number(m.id) === id);
  if (idx === -1) return res.status(404).json({ message: "Message not found" });

  list.splice(idx, 1);
  commit();
  return res.status(204).send();
});

export default router;

