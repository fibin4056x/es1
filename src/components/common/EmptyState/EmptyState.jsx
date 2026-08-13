import "./EmptyState.css";


function EmptyState({
  icon = "inbox",
  title = "No data found",
  description = "There are no records matching your criteria.",
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div className={`empty-state-card ${className}`}>
      <div className="empty-state-icon-wrapper">
        <span className="material-symbols-outlined empty-state-icon">
          {icon}
        </span>
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          className="empty-state-btn"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
