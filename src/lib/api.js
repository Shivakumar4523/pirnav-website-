export const API_PREFIX = "/api";

export const API_ROUTES = Object.freeze({
  admin: `${API_PREFIX}/Admin`,
  adminLogin: `${API_PREFIX}/Admin/login`,
  contact: `${API_PREFIX}/Contact`,
  jobs: `${API_PREFIX}/Jobs`,
  publicJobs: `${API_PREFIX}/Jobs/public`,
  jobApplications: `${API_PREFIX}/JobApplications`,
  interviews: `${API_PREFIX}/interviews`,
});

export const JSON_HEADERS = Object.freeze({
  "Content-Type": "application/json",
});

export const parseJsonSafely = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json().catch(() => null);
};

export const getApiErrorMessage = (
  responseData,
  fallbackMessage = "Request failed."
) => {
  const validationErrors = Object.values(responseData?.errors || {})
    .flat()
    .filter(Boolean);

  if (validationErrors.length > 0) {
    return validationErrors.join(" ");
  }

  return (
    responseData?.message ||
    responseData?.error ||
    responseData?.title ||
    fallbackMessage
  );
};
