import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";


export default function PublicRoutes() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  if (token && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
