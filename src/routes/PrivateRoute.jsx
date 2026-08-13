import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";
import Loader from "../components/common/Loader/Loader";

function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("token");

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader size="large" text="Verifying authentication..." />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PrivateRoute;