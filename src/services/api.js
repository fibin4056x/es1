import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================================================
   REQUEST INTERCEPTOR
============================================================ */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================================================
   TOKEN REFRESH QUEUE
============================================================ */

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

/* ============================================================
   RESPONSE INTERCEPTOR
============================================================ */

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // No response / network error
    if (!error.response) {
      error.userMessage = "Network connection issue. Please check your network or server status.";
      return Promise.reject(error);
    }

    const status = error.response.status;
    const data = error.response.data;

    const rawMessage = data?.message || data?.error || "";
    const isInternalError =
      typeof rawMessage === "string" &&
      (rawMessage.includes("next is not a function") ||
        rawMessage.includes("SyntaxError") ||
        rawMessage.includes("TypeError") ||
        rawMessage.includes("ReferenceError"));

    // Standardize user-facing error message
    error.userMessage = isInternalError
      ? "Server encountered an internal error. Please contact system administrator."
      : rawMessage ||
        (status === 401
          ? "Session expired or unauthorized."
          : status === 403
          ? "Access forbidden. You do not have permission."
          : status === 404
          ? "Requested resource not found."
          : status === 409
          ? "Conflict detected. Resource already exists."
          : status === 422
          ? "Validation error. Please check your inputs."
          : status === 429
          ? "Too many requests. Please try again later."
          : status >= 500
          ? "Server error. Please try again later."
          : "An error occurred.");

    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/refresh") ||
      originalRequest?.url?.includes("/auth/teacher/verify-otp") ||
      originalRequest?.url?.includes("/auth/forgot-password");

    const isLoginPage = typeof window !== "undefined" && window.location.pathname === "/login";
    const hasToken = typeof localStorage !== "undefined" && !!localStorage.getItem("token");

    // Skip token refreshing for auth endpoints, retry loops, or when unauthenticated on login page
    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint ||
      (isLoginPage && !hasToken)
    ) {
      return Promise.reject(error);
    }

    /* ========================================================
       ANOTHER REQUEST IS ALREADY REFRESHING
    ======================================================== */

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      })
        .then((token) => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        })
        .catch((refreshError) => {
          return Promise.reject(refreshError);
        });
    }

    /* ========================================================
       START TOKEN REFRESH
    ======================================================== */

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Direct refresh request using raw un-intercepted axios
      const refreshResponse = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const newToken =
        refreshResponse.data?.token ||
        refreshResponse.data?.data?.token ||
        refreshResponse.data?.data?.accessToken ||
        refreshResponse.data?.accessToken;

      if (newToken) {
        localStorage.setItem("token", newToken);
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(originalRequest);
      } else {
        processQueue(null, null);
        return api(originalRequest);
      }
    } catch (refreshError) {
      processQueue(refreshError, null);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

/**
 * Utility helper to extract user-facing error message safely without exposing raw code trace
 */
export const getApiErrorMessage = (error, fallbackMessage = "Operation failed. Please try again.") => {
  if (typeof error === "string" && !error.includes("next is not a function")) return error;
  if (error?.userMessage) return error.userMessage;
  const dataMsg = error?.response?.data?.message || error?.response?.data?.error;
  if (typeof dataMsg === "string" && dataMsg.length > 0 && !dataMsg.includes("next is not a function") && !dataMsg.includes("TypeError")) {
    return dataMsg;
  }
  if (typeof error?.message === "string" && !error.message.includes("next is not a function") && !error.message.includes("TypeError")) {
    return error.message;
  }
  return fallbackMessage;
};

export default api;