function StudentStats({
  students,
}) {
  const total =
    students.length;

  const active =
    students.filter(
      (student) =>
        student.status ===
        "active"
    ).length;

  const boys =
    students.filter(
      (student) =>
        student.gender ===
        "male"
    ).length;

  const girls =
    students.filter(
      (student) =>
        student.gender ===
        "female"
    ).length;

  return (
    <div className="student-stats">

      <div className="stat-card">
        <h4>Total Students</h4>
        <h2>{total}</h2>
      </div>

      <div className="stat-card">
        <h4>Active</h4>
        <h2>{active}</h2>
      </div>

      <div className="stat-card">
        <h4>Boys</h4>
        <h2>{boys}</h2>
      </div>

      <div className="stat-card">
        <h4>Girls</h4>
        <h2>{girls}</h2>
      </div>

    </div>
  );
}

export default StudentStats; 