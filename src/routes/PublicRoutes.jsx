import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";
import Loader from "../components/common/Loader/Loader";

export default function PublicRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-main, #0b0f19)",
          color: "#ffffff",
        }}
      >
        <Loader size="large" text="Checking active session..." />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
