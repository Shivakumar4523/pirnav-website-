import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKEND_ROOT = path.resolve(__dirname, "..", "..");

const DATA_DIR = path.join(BACKEND_ROOT, "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function createEmptyStore() {
  return {
    adminUsers: [],
    jobs: [],
    jobApplications: [],
    interviews: [],
    contactMessages: [],
    counters: {
      admin: 0,
      job: 0,
      application: 0,
      interview: 0,
      message: 0,
    },
  };
}

function readStore() {
  ensureDir(DATA_DIR);
  if (!fs.existsSync(STORE_PATH)) return createEmptyStore();

  try {
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return {
      ...createEmptyStore(),
      ...parsed,
      counters: { ...createEmptyStore().counters, ...(parsed?.counters || {}) },
    };
  } catch {
    // If the store is corrupted, start fresh instead of crashing.
    return createEmptyStore();
  }
}

function persistStore(store) {
  ensureDir(DATA_DIR);
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export const store = readStore();

export function getStore() {
  return store;
}

export function commit() {
  persistStore(store);
}

export function nextId(counterKey) {
  const current = Number(store.counters[counterKey] || 0);
  const next = current + 1;
  store.counters[counterKey] = next;
  return next;
}

export function resetStore(newStore) {
  store.adminUsers = newStore.adminUsers || [];
  store.jobs = newStore.jobs || [];
  store.jobApplications = newStore.jobApplications || [];
  store.interviews = newStore.interviews || [];
  store.contactMessages = newStore.contactMessages || [];
  store.counters = newStore.counters || store.counters;
  commit();
}

