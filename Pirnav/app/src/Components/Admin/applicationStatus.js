import { getAdminHeaders } from "./adminAuth";

const LEGACY_JOB_APPLICATIONS_API_BASE =
  "https://farrandly-interalar-talon.ngrok-free.dev/api/JobApplications";

const normalizeUrl = (value) => String(value || "").trim().replace(/\/+$/, "");

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

const getConfiguredJobApplicationsApiBase = () =>
  normalizeUrl(import.meta.env.VITE_JOB_APPLICATIONS_API_BASE) ||
  joinUrl(normalizeUrl(import.meta.env.VITE_API_BASE_URL), "/api/JobApplications") ||
  LEGACY_JOB_APPLICATIONS_API_BASE;

const getCandidateApiBases = () => {
  const configuredJobApplicationsBase = normalizeUrl(
    import.meta.env.VITE_JOB_APPLICATIONS_API_BASE
  );
  const configuredCandidatesBase = normalizeUrl(
    import.meta.env.VITE_CANDIDATES_API_BASE
  );
  const configuredApiOrigin = normalizeUrl(import.meta.env.VITE_API_BASE_URL);
  const runtimeOrigin = normalizeUrl(getRuntimeApiOrigin());
  const originCandidates = [
    configuredApiOrigin,
    runtimeOrigin,
    "https://localhost:5001",
    "http://localhost:5000",
    LEGACY_JOB_APPLICATIONS_API_BASE.replace(/\/api\/JobApplications$/i, ""),
  ].filter(Boolean);

  const exactBases = [
    configuredJobApplicationsBase,
    configuredCandidatesBase,
  ].filter(Boolean);

  const derivedBases = originCandidates.flatMap((origin) => [
    joinUrl(origin, "/api/JobApplications"),
    joinUrl(origin, "/api/candidates"),
  ]);

  return [...new Set([...exactBases, ...derivedBases].filter(Boolean))];
};

export const JOB_APPLICATIONS_API_BASES = getCandidateApiBases();
export const JOB_APPLICATIONS_API_BASE = getConfiguredJobApplicationsApiBase();

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

const getStatusUpdateAttempts = (applicationId, statusLabel) => {
  const attempts = JOB_APPLICATIONS_API_BASES.flatMap((base) => {
    const prefersCandidatesShape = /\/api\/candidates$/i.test(base);

    const candidateRouteAttempts = [
      {
        url: `${base}/${applicationId}/status`,
        body: { status: statusLabel },
      },
      {
        url: `${base}/${applicationId}/status`,
        body: { applicationId, status: statusLabel },
      },
    ];

    const jobApplicationsRouteAttempt = {
      url: `${base}/status`,
      body: { applicationId, status: statusLabel },
    };

    return prefersCandidatesShape
      ? [...candidateRouteAttempts, jobApplicationsRouteAttempt]
      : [jobApplicationsRouteAttempt, ...candidateRouteAttempts];
  });

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

const getStatusUpdateNetworkMessage = () =>
  "Unable to reach the status update API. Check that the backend is running, the port matches your API server instead of the Vite dev server, and CORS allows this frontend origin. You can set VITE_API_BASE_URL, VITE_JOB_APPLICATIONS_API_BASE, or VITE_CANDIDATES_API_BASE to point to the correct backend.";

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
  const statusLabel = formatApplicationStatusForApi(normalizedStatus);
  const attempts = getStatusUpdateAttempts(applicationId, statusLabel);
  const networkErrors = [];
  let fallbackFailure = null;

  console.log("[ApplicationStatus] Status update attempts:", {
    applicationId,
    nextStatus: statusLabel,
    attempts: attempts.map((attempt) => ({
      url: attempt.url,
      body: attempt.body,
    })),
  });

  for (const attempt of attempts) {
    try {
      const response = await fetch(attempt.url, {
        method: "PUT",
        headers,
        body: JSON.stringify(attempt.body),
      });
      const responseData = await response.json().catch(() => null);

      console.log(
        "[ApplicationStatus] Status update response:",
        responseData ?? { ok: response.ok, status: response.status, url: attempt.url }
      );

      if (response.status === 401) {
        return {
          ok: false,
          unauthorized: true,
          message: "Unauthorized",
          data: responseData,
        };
      }

      if (response.ok) {
        return { ok: true, data: responseData, endpoint: attempt.url };
      }

      const message =
        responseData?.message ||
        responseData?.error ||
        responseData?.title ||
        "Status update failed";

      if ([400, 404, 405, 415].includes(response.status)) {
        fallbackFailure = {
          ok: false,
          message,
          data: responseData,
          status: response.status,
          endpoint: attempt.url,
        };
        continue;
      }

      return {
        ok: false,
        message,
        data: responseData,
        status: response.status,
        endpoint: attempt.url,
      };
    } catch (error) {
      console.error("[ApplicationStatus] Status update network error:", {
        url: attempt.url,
        error: error.message || error,
      });
      networkErrors.push({
        url: attempt.url,
        message: error.message || "Network error",
      });
    }
  }

  if (networkErrors.length === attempts.length) {
    return {
      ok: false,
      message: getStatusUpdateNetworkMessage(),
      data: { networkErrors },
    };
  }

  return (
    fallbackFailure || {
      ok: false,
      message: "Status update failed",
      data: { networkErrors },
    }
  );
};
