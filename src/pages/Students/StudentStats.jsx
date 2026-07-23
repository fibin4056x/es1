import "../Dashboard/StatCard.css";

function StudentStats({
  students,
}) {
  const total = students.length;

  const active = students.filter(
    (student) => student.status === "active"
  ).length;

  const boys = students.filter(
    (student) => student.gender === "male"
  ).length;

  const girls = students.filter(
    (student) => student.gender === "female"
  ).length;

  return (
    <div className="student-stats animate-fade-in-up">
      <div className="glass-card stat-card">
        <div className="stat-card-top">
          <div className="stat-icon-wrapper stat-variant-primary">
            <span className="material-symbols-outlined material-fill">groups</span>
          </div>
        </div>
        <div className="stat-card-bottom">
          <p className="stat-title">Total Students</p>
          <h3 className="stat-value">{total}</h3>
        </div>
      </div>

      <div className="glass-card stat-card">
        <div className="stat-card-top">
          <div className="stat-icon-wrapper stat-variant-success">
            <span className="material-symbols-outlined material-fill">verified</span>
          </div>
        </div>
        <div className="stat-card-bottom">
          <p className="stat-title">Active Students</p>
          <h3 className="stat-value">{active}</h3>
        </div>
      </div>

      <div className="glass-card stat-card">
        <div className="stat-card-top">
          <div className="stat-icon-wrapper stat-variant-secondary">
            <span className="material-symbols-outlined material-fill">boy</span>
          </div>
        </div>
        <div className="stat-card-bottom">
          <p className="stat-title">Boys</p>
          <h3 className="stat-value">{boys}</h3>
        </div>
      </div>

      <div className="glass-card stat-card">
        <div className="stat-card-top">
          <div className="stat-icon-wrapper stat-variant-blue">
            <span className="material-symbols-outlined material-fill">girl</span>
          </div>
        </div>
        <div className="stat-card-bottom">
          <p className="stat-title">Girls</p>
          <h3 className="stat-value">{girls}</h3>
        </div>
      </div>
    </div>
  );
}

export default StudentStats; 