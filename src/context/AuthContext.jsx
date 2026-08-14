import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./authContextInstance";
import { getMe, logoutUser } from "../services/authService";

const isValidToken = (token) => {
  return (
    typeof token === "string" &&
    token.trim().length > 0 &&
    token !== "undefined" &&
    token !== "null"
  );
};

const extractUserData = (res) => {
  if (!res) return null;
  return res.data?.user || res.user || res.data?.data?.user || res.data?.data || res.data || null;
};

const isValidUser = (userData) => {
  return Boolean(
    userData &&
      typeof userData === "object" &&
      (userData._id || userData.id || userData.email || userData.role)
  );
};

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("accessToken");
      if (storedUser && isValidToken(token)) {
        const parsed = JSON.parse(storedUser);
        return isValidUser(parsed) ? parsed : null;
      }
      return null;
    } catch {
      return null;
    }
  });

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("accessToken");

    if (!isValidToken(token)) {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setLoading(false);
      return;
    }

    try {
      const res = await getMe();
      const userData = extractUserData(res);

      if (isValidUser(userData)) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } catch (err) {
      // Clear session only on explicit authentication failure (401 or 403)
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = (userData, accessToken, refreshToken) => {
    if (isValidToken(accessToken)) {
      localStorage.setItem("accessToken", accessToken);
    }
    if (isValidToken(refreshToken)) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    if (isValidUser(userData)) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    setLoading(false);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // Ignore API logout error
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    if (isValidUser(userData)) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
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

