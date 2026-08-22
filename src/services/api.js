import axios from "axios";

/* ============================================================
   API CONFIGURATION
============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://slms-txsf.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================================================
   REFRESH STATE
============================================================ */

let isRefreshing = false;
let failedQueue = [];

/* ============================================================
   PROCESS QUEUED REQUESTS
============================================================ */

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
   AUTH ENDPOINT CHECK
============================================================ */

const isAuthEndpoint = (url = "") => {
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/verify-otp") ||
    url.includes("/auth/resend-otp") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/logout") ||
    url.includes("/auth/teacher/") ||
    url.includes("/auth/forgot-password/")
  );
};

/* ============================================================
   REQUEST INTERCEPTOR
============================================================ */

api.interceptors.request.use(
  (config) => {
    let token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("setupToken") ||
      sessionStorage.getItem("accessToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("setupToken");

    if (!token) {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          token = parsed?.accessToken || parsed?.token || parsed?.setupToken;
        }
      } catch {
        // ignore parse error
      }
    }

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================================================
   RESPONSE INTERCEPTOR
============================================================ */

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    /* --------------------------------------------------------
       NETWORK ERROR
    -------------------------------------------------------- */

    if (!error.response) {
      error.userMessage =
        "Network connection issue. Please check your internet connection or server status.";

      return Promise.reject(error);
    }

    const status = error.response.status;
    const data = error.response.data;

    /* --------------------------------------------------------
       USER-FRIENDLY ERROR
    -------------------------------------------------------- */

    const rawMessage =
      data?.message ||
      data?.error ||
      "";

    const isInternalError =
      typeof rawMessage === "string" &&
      (
        rawMessage.includes("next is not a function") ||
        rawMessage.includes("SyntaxError") ||
        rawMessage.includes("TypeError") ||
        rawMessage.includes("ReferenceError")
      );

    error.userMessage = isInternalError
      ? "Server encountered an internal error. Please contact the system administrator."
      : rawMessage ||
        (
          status === 401
            ? "Session expired or unauthorized."
            : status === 403
            ? "Access forbidden. You do not have permission."
            : status === 404
            ? "Requested resource was not found."
            : status === 409
            ? "Conflict detected."
            : status === 422
            ? "Validation error. Please check your inputs."
            : status === 429
            ? "Too many requests. Please try again later."
            : status >= 500
            ? "Server error. Please try again later."
            : "An error occurred."
        );

    /* --------------------------------------------------------
       INVALID REQUEST CONFIG
    -------------------------------------------------------- */

    if (!originalRequest) {
      return Promise.reject(error);
    }

    /* --------------------------------------------------------
       ONLY HANDLE 401
    -------------------------------------------------------- */

    if (status !== 401) {
      return Promise.reject(error);
    }

    /* --------------------------------------------------------
       NEVER REFRESH AUTH ENDPOINTS
    -------------------------------------------------------- */

    if (isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    /* --------------------------------------------------------
       NEVER RETRY SAME REQUEST MORE THAN ONCE
    -------------------------------------------------------- */

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    /* --------------------------------------------------------
       LOGIN PAGE
    -------------------------------------------------------- */

    const isLoginPage =
      typeof window !== "undefined" &&
      window.location.pathname === "/login";

    if (isLoginPage) {
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
        .then(() => {
          return api(originalRequest);
        })
        .catch((refreshError) => {
          return Promise.reject(refreshError);
        });
    }

    /* ========================================================
       START REFRESH
    ======================================================== */

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      /*
       * IMPORTANT:
       *
       * Do NOT send refreshToken in request body.
       *
       * Backend reads it from:
       *
       * req.cookies.refreshToken
       *
       * Browser sends it automatically because
       * withCredentials = true.
       */

      await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      /*
       * Backend has already:
       *
       * - validated old refresh token
       * - rotated refresh token
       * - created new refresh session
       * - set new refreshToken cookie
       * - set new accessToken cookie
       *
       * Nothing needs to be stored in localStorage.
       */

      processQueue(null);

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      /*
       * Browser cannot manually remove HTTP-only cookies.
       *
       * Ask backend to clear them.
       */
      try {
        await axios.post(
          `${API_BASE_URL}/auth/logout`,
          {},
          {
            withCredentials: true,
            timeout: 10000,
          }
        );
      } catch {
        // Ignore logout cleanup failure.
      }

      /*
       * Clear frontend application state and token cache.
       */
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("token");
        localStorage.removeItem("setupToken");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

/* ============================================================
   ERROR MESSAGE HELPER
============================================================ */

export const getApiErrorMessage = (
  error,
  fallbackMessage = "Operation failed. Please try again."
) => {
  if (
    typeof error === "string" &&
    !error.includes("next is not a function")
  ) {
    return error;
  }

  if (error?.userMessage) {
    return error.userMessage;
  }

  const dataMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error;

  if (
    typeof dataMessage === "string" &&
    dataMessage.length > 0 &&
    !dataMessage.includes("next is not a function") &&
    !dataMessage.includes("TypeError")
  ) {
    return dataMessage;
  }

  if (
    typeof error?.message === "string" &&
    !error.message.includes("next is not a function") &&
    !error.message.includes("TypeError")
  ) {
    return error.message;
  }

  return fallbackMessage;
};

export default api;