import "./StatCard.css";

function StatCard({ title, value, color }) {
  return (
    <div className="stat-card">

      <div
        className="card-top"
        style={{ background: color }}
      >
        <h2>{value}</h2>
      </div>

      <div className="card-bottom">
        <h4>{title}</h4>
      </div>

    </div>
  );
}

export default StatCard;