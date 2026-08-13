import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-main, #0b0f19)",
        color: "#ffffff",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(99, 102, 241, 0.15)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "42px", color: "#818cf8" }}
        >
          find_in_page
        </span>
      </div>

      <h1
        style={{
          fontSize: "4rem",
          fontWeight: 800,
          margin: 0,
          background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        404
      </h1>

      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginTop: "12px", marginBottom: "8px" }}>
        Page Not Found
      </h2>

      <p
        style={{
          color: "var(--text-muted, #94a3b8)",
          maxWidth: "440px",
          marginBottom: "32px",
          lineHeight: 1.6,
        }}
      >
        The page you are looking for does not exist or might have been moved.
      </p>

      <button
        type="button"
        className="btn-press"
        onClick={() => navigate("/dashboard")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 24px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
          color: "#ffffff",
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
        }}
      >
        <span className="material-symbols-outlined">dashboard</span>
        Back to Dashboard
      </button>
    </div>
  );
}

export default NotFound;