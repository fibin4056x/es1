import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://slms-txsf.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================================================
   REQUEST INTERCEPTOR
============================================================ */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (
      typeof token === "string" &&
      token.trim().length > 0 &&
      token !== "undefined" &&
      token !== "null"
    ) {
      config.headers = config.headers || {};
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

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
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
      originalRequest?.url?.includes("/auth/logout") ||
      originalRequest?.url?.includes("/auth/refresh") ||
      originalRequest?.url?.includes("/auth/me") ||
      originalRequest?.url?.includes("/auth/teacher/verify-otp") ||
      originalRequest?.url?.includes("/auth/forgot-password");

    const isLoginPage = typeof window !== "undefined" && window.location.pathname === "/login";

    // Skip token refreshing for auth endpoints, retry loops, or when on login page
    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint ||
      isLoginPage
    ) {
      return Promise.reject(error);
    }

    /* ========================================================
       ANOTHER REQUEST IS ALREADY REFRESHING
    ======================================================== */

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((refreshError) => Promise.reject(refreshError));
    }

    /* ========================================================
       START TOKEN REFRESH
    ======================================================== */

    originalRequest._retry = true;
    isRefreshing = true;

    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (
      typeof storedRefreshToken !== "string" ||
      storedRefreshToken.trim().length === 0 ||
      storedRefreshToken === "undefined" ||
      storedRefreshToken === "null"
    ) {
      isRefreshing = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      return Promise.reject(error);
    }

    try {
      const refreshResponse = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken: storedRefreshToken },
        { withCredentials: true }
      );

      const resData = refreshResponse.data?.data || refreshResponse.data;
      const newAccessToken = resData?.accessToken || resData?.token;
      const newRefreshToken = resData?.refreshToken;

      if (newAccessToken && typeof newAccessToken === "string") {
        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken && typeof newRefreshToken === "string") {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null);
        return api(originalRequest);
      } else {
        throw new Error("No token returned from refresh");
      }
    } catch (refreshError) {
      processQueue(refreshError);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
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
