import { getAdminHeaders } from "./adminAuth";

const LEGACY_INTERVIEW_API_BASE =
  "https://farrandly-interalar-talon.ngrok-free.dev/api/interview";
const DEFAULT_INTERVIEW_TIME_FALLBACK = "10:00:00";
const DEFAULT_INTERVIEW_MODE_FALLBACK = "Online";
const DEFAULT_INTERVIEW_LINK_FALLBACK = "https://meet.link";
const DEFAULT_INTERVIEW_NOTES_FALLBACK = "Initial Screening";

const normalizeUrl = (value) => String(value || "").trim().replace(/\/+$/, "");
const normalizeInterviewMode = (value) =>
  String(value || "").toLowerCase() === "offline" ? "Offline" : "Online";
const normalizeInterviewTime = (value) => {
  const [hours = "00", minutes = "00", seconds = "00"] = String(value || "").split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
};
const formatInterviewDateForApi = (value) => {
  if (!value) {
    return new Date().toISOString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
};

const getRuntimeApiOrigin = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const { origin, port } = window.location;
  return port === "5173" || port === "4173" ? "" : origin;
};

const joinUrl = (base, path) => {
  const normalizedBase = normalizeUrl(base);
  const normalizedPath = String(path || "").replace(/^\/+/, "");

  if (!normalizedBase) {
    return "";
  }

  return `${normalizedBase}/${normalizedPath}`;
};

const getConfiguredInterviewApiBase = () =>
  normalizeUrl(import.meta.env.VITE_INTERVIEW_API_BASE) ||
  normalizeUrl(import.meta.env.VITE_INTERVIEWS_API_BASE) ||
  joinUrl(normalizeUrl(import.meta.env.VITE_API_BASE_URL), "/api/interview") ||
  LEGACY_INTERVIEW_API_BASE;

const getInterviewApiBases = () => {
  const exactBases = [
    normalizeUrl(import.meta.env.VITE_INTERVIEW_API_BASE),
    normalizeUrl(import.meta.env.VITE_INTERVIEWS_API_BASE),
  ].filter(Boolean);
  const originCandidates = [
    normalizeUrl(import.meta.env.VITE_API_BASE_URL),
    normalizeUrl(getRuntimeApiOrigin()),
    "https://localhost:5001",
    "http://localhost:5000",
    LEGACY_INTERVIEW_API_BASE.replace(/\/api\/interview$/i, ""),
  ].filter(Boolean);
  const derivedBases = originCandidates.flatMap((origin) => [
    joinUrl(origin, "/api/interview"),
    joinUrl(origin, "/api/interviews"),
  ]);

  return [...new Set([...exactBases, ...derivedBases].filter(Boolean))];
};

export const INTERVIEW_API_BASES = getInterviewApiBases();
export const INTERVIEW_API_BASE = getConfiguredInterviewApiBase();
export const INTERVIEW_SCHEDULE_API =
  normalizeUrl(import.meta.env.VITE_INTERVIEW_SCHEDULE_API) ||
  `${INTERVIEW_API_BASE}/schedule`;
export const DEFAULT_INTERVIEW_MANAGER_ID = (() => {
  const parsed = Number.parseInt(import.meta.env.VITE_DEFAULT_INTERVIEW_MANAGER_ID, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
})();
export const DEFAULT_INTERVIEW_TIME =
  String(import.meta.env.VITE_DEFAULT_INTERVIEW_TIME || "").trim() ||
  DEFAULT_INTERVIEW_TIME_FALLBACK;
export const DEFAULT_INTERVIEW_MODE =
  String(import.meta.env.VITE_DEFAULT_INTERVIEW_MODE || "").trim() ||
  DEFAULT_INTERVIEW_MODE_FALLBACK;
export const DEFAULT_INTERVIEW_MEETING_LINK =
  String(import.meta.env.VITE_DEFAULT_INTERVIEW_MEETING_LINK || "").trim() ||
  DEFAULT_INTERVIEW_LINK_FALLBACK;
export const DEFAULT_INTERVIEW_NOTES =
  String(import.meta.env.VITE_DEFAULT_INTERVIEW_NOTES || "").trim() ||
  DEFAULT_INTERVIEW_NOTES_FALLBACK;

export const buildInterviewCreatePayload = ({ applicationId, application } = {}) => {
  const resolvedApplicationId = applicationId || application?.id || null;
  const details =
    application?.interviewDetails ||
    application?.interview ||
    application?.scheduledInterview ||
    {};
  const mode = normalizeInterviewMode(details.mode || DEFAULT_INTERVIEW_MODE);

  return {
    applicationId: resolvedApplicationId,
    managerId: DEFAULT_INTERVIEW_MANAGER_ID,
    interviewDate: formatInterviewDateForApi(details.date || details.interviewDate),
    interviewTime: normalizeInterviewTime(details.time || details.interviewTime || DEFAULT_INTERVIEW_TIME),
    mode,
    meetingLink:
      mode === "Online"
        ? String(details.meetingLink || DEFAULT_INTERVIEW_MEETING_LINK).trim()
        : "",
    notes: String(details.notes || DEFAULT_INTERVIEW_NOTES).trim(),
  };
};

const getCreateInterviewAttempts = (payload) => {
  const attempts = INTERVIEW_API_BASES.map((base) => ({
    url: base,
    body: payload,
  }));
  const seen = new Set();

  return attempts.filter((attempt) => {
    const key = `${attempt.url}::${JSON.stringify(attempt.body)}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

const getCreateInterviewNetworkMessage = () =>
  "Candidate moved to Shortlisted, but the interview record could not be created automatically. Check that the interviews API is running and configured for this frontend origin.";

export const requestCreateInterview = async ({ applicationId, application, token }) => {
  const headers = getAdminHeaders(token);

  if (!headers) {
    return {
      ok: false,
      unauthorized: true,
      message: "Session expired. Please login again.",
    };
  }

  const payload = buildInterviewCreatePayload({ applicationId, application });

  if (!payload.applicationId) {
    return {
      ok: false,
      message: "Unable to create interview record without an application id.",
      payload,
    };
  }

  const attempts = getCreateInterviewAttempts(payload);
  const networkErrors = [];
  let fallbackFailure = null;

  for (const attempt of attempts) {
    try {
      const response = await fetch(attempt.url, {
        method: "POST",
        headers,
        body: JSON.stringify(attempt.body),
      });
      const responseData = await response.json().catch(() => null);

      if (response.status === 401) {
        return {
          ok: false,
          unauthorized: true,
          message: "Unauthorized",
          data: responseData,
        };
      }

      if (response.ok) {
        return {
          ok: true,
          data: responseData,
          endpoint: attempt.url,
          payload: attempt.body,
        };
      }

      const message =
        responseData?.message ||
        responseData?.error ||
        responseData?.title ||
        "Unable to create interview record.";

      if ([400, 404, 405, 415].includes(response.status)) {
        fallbackFailure = {
          ok: false,
          message,
          data: responseData,
          status: response.status,
          endpoint: attempt.url,
          payload: attempt.body,
        };
        continue;
      }

      return {
        ok: false,
        message,
        data: responseData,
        status: response.status,
        endpoint: attempt.url,
        payload: attempt.body,
      };
    } catch (error) {
      networkErrors.push({
        url: attempt.url,
        message: error.message || "Network error",
      });
    }
  }

  if (networkErrors.length === attempts.length) {
    return {
      ok: false,
      message: getCreateInterviewNetworkMessage(),
      data: { networkErrors },
      payload,
    };
  }

  return (
    fallbackFailure || {
      ok: false,
      message: "Unable to create interview record.",
      data: { networkErrors },
      payload,
    }
  );
};
