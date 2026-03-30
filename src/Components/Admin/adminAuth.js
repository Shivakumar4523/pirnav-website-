import { JSON_HEADERS } from "../../lib/api.js";

export const ADMIN_TOKEN_KEY = "adminToken";

export const getAdminToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ADMIN_TOKEN_KEY);
};

export const saveAdminToken = (token) => {
  if (typeof window === "undefined" || !token) {
    return;
  }

  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const clearAdminToken = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
};

export const getAdminHeaders = (token = getAdminToken()) => {
  if (!token) {
    return null;
  }

  return {
    ...JSON_HEADERS,
    Authorization: `Bearer ${token}`,
  };
};
