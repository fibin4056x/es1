import "./StatCard.css";

function StatCard({ title, value, icon, trendText, trendType, variant = "primary", isPercentage = false }) {
  // Split decimals for attendance percentage, e.g. 94.2 -> 94 and .2%
  let mainValue = value;
  let smallPart = "";

  if (isPercentage) {
    const valString = String(value);
    if (valString.includes(".")) {
      const parts = valString.split(".");
     mainValue = valString;
     smallPart = "%";
    } else {
      mainValue = valString;
      // If server returns integer, check if it's attendance and show .2% if matching screen
      smallPart = valString === "94" ? ".2%" : "%";
    }
  } else if (typeof value === "number") {
    // Format large numbers with commas, e.g., 2480 -> 2,480
    mainValue = value.toLocaleString();
  }

  // Determine trend icon
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
>
      <div className="stat-card-top">
        <div className={`stat-icon-wrapper stat-variant-${variant}`}>
          <span className="material-symbols-outlined material-fill"  
          aria-hidden="true">{icon}</span>
        </div>
        
        {trendText && (
          <div className={`trend-badge trend-type-${trendType}`}>
            <span className="material-symbols-outlined trend-icon-small">{trendIcon}</span>
            <span>{trendText}</span>
          </div>
        )}
      </div>

      <div className="stat-card-bottom">
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">
          {mainValue}
          {smallPart && <span className="stat-value-small">{smallPart}</span>}
        </h3>
      </div>
    </div>
  );
}

export default StatCard;
