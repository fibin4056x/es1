import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./authContextInstance";
import { getMe, logoutUser } from "../services/authService";

/* ============================================================
   HELPERS
============================================================ */

const extractUserData = (res) => {
  if (!res) return null;

  return (
    res.user ||
    res.data?.user ||
    res.data?.data?.user ||
    res.data?.data ||
    res.data ||
    res
  );
};

const extractToken = (res) => {
  if (!res) return null;
  if (typeof res === "string") return res;

  return (
    res.accessToken ||
    res.token ||
    res.setupToken ||
    res.data?.accessToken ||
    res.data?.token ||
    res.data?.setupToken ||
    res.data?.data?.accessToken ||
    res.data?.data?.token ||
    res.data?.data?.setupToken ||
    res.user?.accessToken ||
    res.user?.token ||
    null
  );
};

const isValidUser = (userData) => {
  return Boolean(
    userData &&
      typeof userData === "object" &&
      (userData._id ||
        userData.id ||
        userData.email ||
        userData.role)
  );
};

/* ============================================================
   AUTH PROVIDER
============================================================ */

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);

  const [pendingOtpEmail, setPendingOtpEmailState] = useState(() => {
    try {
      return sessionStorage.getItem("pendingOtpEmail") || "";
    } catch {
      return "";
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      const parsed = JSON.parse(storedUser);

      if (isValidUser(parsed)) {
        const token = extractToken(parsed);
        if (token && !localStorage.getItem("accessToken")) {
          localStorage.setItem("accessToken", token);
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  /* ==========================================================
     OTP STATE
  ========================================================== */

  const startOtpVerification = (email) => {
    const cleanEmail = (email || "").trim();

    setPendingOtpEmailState(cleanEmail);

    try {
      if (cleanEmail) {
        sessionStorage.setItem(
          "pendingOtpEmail",
          cleanEmail
        );
      } else {
        sessionStorage.removeItem(
          "pendingOtpEmail"
        );
      }
    } catch {
      // Ignore sessionStorage errors.
    }
  };

  const clearOtpVerification = () => {
    setPendingOtpEmailState("");

    try {
      sessionStorage.removeItem(
        "pendingOtpEmail"
      );
    } catch {
      // Ignore sessionStorage errors.
    }
  };

  /* ==========================================================
     FETCH CURRENT USER
  ========================================================== */

  const fetchUser = useCallback(async () => {
    try {
      const res = await getMe();

      const userData = extractUserData(res);
      const token = extractToken(res);

      if (token) {
        localStorage.setItem("accessToken", token);
      }

      if (isValidUser(userData)) {
        setUser(userData);

        localStorage.setItem(
          "user",
          JSON.stringify(userData)
        );
      } else {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      }
    } catch (error) {
      console.warn("Session check fallback:", error);
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (isValidUser(parsed)) {
            setUser(parsed);
            return;
          }
        }
      } catch {
        // ignore
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ==========================================================
     INITIAL AUTH CHECK
  ========================================================== */

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  /* ==========================================================
     LOGIN
  ========================================================== */

  const login = async (userOrRes) => {
    let userData = extractUserData(userOrRes);
    const token = extractToken(userOrRes);

    if (token) {
      localStorage.setItem("accessToken", token);
    }

    if (!isValidUser(userData)) {
      try {
        const res = await getMe();
        userData = extractUserData(res);
        const resToken = extractToken(res);
        if (resToken) {
          localStorage.setItem("accessToken", resToken);
        }
      } catch (error) {
        console.error("Failed to fetch user during login:", error);
      }
    }

    if (isValidUser(userData)) {
      setUser(userData);

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      const userToken = extractToken(userData);
      if (userToken && !localStorage.getItem("accessToken")) {
        localStorage.setItem("accessToken", userToken);
      }
    }

    clearOtpVerification();
    setLoading(false);
  };

  /* ==========================================================
     LOGOUT
  ========================================================== */

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore cleanup error
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      localStorage.removeItem("setupToken");

      clearOtpVerification();

      setUser(null);
      setLoading(false);
    }
  };

  /* ==========================================================
     UPDATE USER
  ========================================================== */

  const updateUser = (userData) => {
    if (!isValidUser(userData)) {
      return;
    }

    setUser(userData);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );
  };

  /* ==========================================================
     CONTEXT
  ========================================================== */

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        pendingOtpEmail,

        otpPending:
          Boolean(pendingOtpEmail),

        startOtpVerification,
        clearOtpVerification,

        login,
        logout,

        updateUser,

        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;