import { getAdminHeaders } from "./adminAuth";
import {
  API_ROUTES,
  getApiErrorMessage,
  parseJsonSafely,
} from "../../lib/api.js";

const DEFAULT_INTERVIEW_TIME_FALLBACK = "10:00:00";
const DEFAULT_INTERVIEW_MODE_FALLBACK = "Online";
const DEFAULT_INTERVIEW_LINK_FALLBACK = "https://meet.link";
const DEFAULT_INTERVIEW_NOTES_FALLBACK = "Initial Screening";

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

export const INTERVIEW_API_BASE = API_ROUTES.interviews;

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
    interviewTime: normalizeInterviewTime(
      details.time || details.interviewTime || DEFAULT_INTERVIEW_TIME
    ),
    mode,
    meetingLink:
      mode === "Online"
        ? String(details.meetingLink || DEFAULT_INTERVIEW_MEETING_LINK).trim()
        : "",
    notes: String(details.notes || DEFAULT_INTERVIEW_NOTES).trim(),
  };
};

const getCreateInterviewNetworkMessage = () =>
  "Candidate moved to Shortlisted, but the interview record could not be created automatically. Check that the interviews API is running and configured for this frontend origin.";

export const requestCreateInterview = async ({
  applicationId,
  application,
  token,
}) => {
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

  try {
    const response = await fetch(INTERVIEW_API_BASE, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const responseData = await parseJsonSafely(response);

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
        endpoint: INTERVIEW_API_BASE,
        payload,
      };
    }

    return {
      ok: false,
      message: getApiErrorMessage(responseData, "Unable to create interview record."),
      data: responseData,
      status: response.status,
      endpoint: INTERVIEW_API_BASE,
      payload,
    };
  } catch (error) {
    return {
      ok: false,
      message: getCreateInterviewNetworkMessage(),
      data: { message: error.message || "Network error" },
      payload,
    };
  }
};
