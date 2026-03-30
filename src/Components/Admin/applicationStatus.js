import { getAdminHeaders } from "./adminAuth";
import {
  API_ROUTES,
  getApiErrorMessage,
  parseJsonSafely,
} from "../../lib/api.js";

export const JOB_APPLICATIONS_API_BASE = API_ROUTES.jobApplications;

export const applicationStatusLabels = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  selected: "Selected",
  rejected: "Rejected",
};

export const applicationStatusOptions = Object.keys(applicationStatusLabels);

export const normalizeApplicationStatus = (status) => {
  const normalized = String(status || "").toLowerCase();
  return applicationStatusOptions.includes(normalized) ? normalized : "pending";
};

export const formatApplicationStatusForApi = (status) =>
  applicationStatusLabels[normalizeApplicationStatus(status)];

const getStatusUpdateNetworkMessage = () =>
  "Unable to reach the status update API. Check that the backend is running and the frontend can reach /api.";

export const getApplicationSelectedDate = (application) =>
  application?.selectedDate ||
  application?.dateSelected ||
  application?.statusUpdatedAt ||
  application?.updatedAt ||
  application?.updatedDate ||
  application?.lastModifiedDate ||
  application?.modifiedAt ||
  application?.lastUpdated ||
  application?.appliedDate ||
  application?.createdDate ||
  "";

export const requestApplicationStatusUpdate = async ({
  applicationId,
  nextStatus,
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

  const normalizedStatus = normalizeApplicationStatus(nextStatus);
  const endpoint = `${JOB_APPLICATIONS_API_BASE}/${applicationId}/status`;

  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        status: formatApplicationStatusForApi(normalizedStatus),
      }),
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
        endpoint,
      };
    }

    return {
      ok: false,
      message: getApiErrorMessage(responseData, "Status update failed."),
      data: responseData,
      status: response.status,
      endpoint,
    };
  } catch (error) {
    return {
      ok: false,
      message: getStatusUpdateNetworkMessage(),
      data: { message: error.message || "Network error" },
      endpoint,
    };
  }
};
