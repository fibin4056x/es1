export default function Loader({ message = "Loading..." }) {
  return (
    <div
      className="common-loader-wrapper"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        gap: "0.75rem",
        color: "var(--text-muted, #94a3b8)",
      }}
    >
      <span className="material-symbols-outlined spin-animation">
        progress_activity
      </span>
      <span>{message}</span>
    </div>
  );
}
