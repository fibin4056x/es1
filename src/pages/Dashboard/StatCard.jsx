import "./StatCard.css";

function StatCard({
  title,
  value,
  icon,
  trendText,
  trendType,
  variant = "primary",
  isPercentage = false,
}) {
  // Format value
  let displayValue = value;

  if (typeof value === "number") {
    displayValue = isPercentage
      ? value.toFixed(1)
      : new Intl.NumberFormat().format(value);
  }

  // Trend icon
  const trendIcon =
    trendType === "down"
      ? "trending_down"
      : trendType === "neutral"
      ? "horizontal_rule"
      : "trending_up";

  return (
    <div
      className="glass-card stat-card"
      role="article"
      aria-label={title}
    >
      {/* Header */}
      <div className="stat-card-top">
        <div
          className={`stat-icon-wrapper stat-variant-${variant}`}
        >
          <span
            className="material-symbols-outlined material-fill"
            aria-hidden="true"
          >
            {icon}
          </span>
        </div>

        {trendText && trendType && (
          <div
            className={`trend-badge trend-type-${trendType}`}
          >
            <span className="material-symbols-outlined trend-icon-small">
              {trendIcon}
            </span>

            <span>{trendText}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="stat-card-bottom">
        <p className="stat-title">
          {title}
        </p>

        <h3 className="stat-value">
          {displayValue}
          {isPercentage && (
            <span className="stat-value-small">
              %
            </span>
          )}
        </h3>
      </div>
    </div>
  );
}

export default StatCard;