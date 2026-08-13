import "./StatCard.css";


function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg = "var(--primary-light)",
  iconColor = "var(--primary)",
  trend,
  trendType = "up", // 'up' | 'down' | 'neutral'
  badge,
  loading = false,
  onClick,
}) {
  if (loading) {
    return (
      <div className="stat-card stat-card-skeleton">
        <div className="stat-card-header-skel">
          <div className="skel-bone skel-icon"></div>
          <div className="skel-bone skel-title"></div>
        </div>
        <div className="skel-bone skel-value"></div>
        <div className="skel-bone skel-sub"></div>
      </div>
    );
  }

  return (
    <div
      className={`stat-card ${onClick ? "stat-card-clickable" : ""}`}
      onClick={onClick}
    >
      <div className="stat-card-top">
        <div className="stat-card-info">
          <span className="stat-card-title">{title}</span>
          {badge && <span className="stat-card-badge">{badge}</span>}
        </div>
        {icon && (
          <div
            className="stat-card-icon-wrapper"
            style={{ backgroundColor: iconBg, color: iconColor }}
          >
            <span className="material-symbols-outlined">{icon}</span>
          </div>
        )}
      </div>

      <div className="stat-card-middle">
        <h3 className="stat-card-value">{value}</h3>
      </div>

      {(subtitle || trend) && (
        <div className="stat-card-bottom">
          {trend && (
            <span className={`stat-card-trend trend-${trendType}`}>
              <span className="material-symbols-outlined trend-icon">
                {trendType === "up"
                  ? "trending_up"
                  : trendType === "down"
                  ? "trending_down"
                  : "trending_flat"}
              </span>
              {trend}
            </span>
          )}
          {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}

export default StatCard;
