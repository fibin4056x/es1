import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./authContextInstance";
import { getMe, logoutUser } from "../services/authService";

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const fetchUser = useCallback(async () => {
    const isLoginPage = typeof window !== "undefined" && window.location.pathname === "/login";

    try {
      const res = await getMe();
      const userData = res.data?.user || res.user || res.data;
      if (userData && userData._id) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (err) {
      // Unauthenticated or expired session
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = (userData) => {
    if (userData) {
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
      localStorage.removeItem("user");
      setUser(null);
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
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