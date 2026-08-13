import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";
import Loader from "../components/common/Loader/Loader";

export default function PublicRoutes() {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("token");

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader size="large" text="Checking session..." />
      </div>
    );
  }

  if (token && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

