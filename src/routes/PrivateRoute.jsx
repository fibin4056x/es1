import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";
import Loader from "../components/common/Loader/Loader";

function PrivateRoute({ children, allowedRoles }) {
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
        <Loader size="large" text="Verifying authentication session..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PrivateRoute;