import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecentStudents.css";

function RecentStudents({ students = [] }) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("Name");

  const sortedStudents = [...students].sort((a, b) => {
    if (sortBy === "Name") {
      return (a.nameEnglish || a.name || "").localeCompare(b.nameEnglish || b.name || "");
    }

    if (sortBy === "Progress") {
      return (b.attendance ?? 0) - (a.attendance ?? 0);
    }

    return 0;
  });

  return (
    <div className="glass-card recent-students-card">
      <div className="recent-students-header">
        <h4 className="recent-students-title">Recent Students</h4>

        {sortedStudents.length > 0 && (
          <div className="sort-select-wrapper">
            <select
              className="sort-select-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Name">Sort by: Name</option>
              <option value="Progress">Sort by: Attendance</option>
            </select>

            <span className="material-symbols-outlined sort-select-arrow">
              expand_more
            </span>
          </div>
        )}
      </div>

      {sortedStudents.length === 0 ? (
        <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted, #94a3b8)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "36px", marginBottom: "8px" }}>
            person_off
          </span>
          <p>No recent student records available.</p>
        </div>
      ) : (
        <div className="students-table-wrapper" style={{ overflowX: "auto" }}>
          <table className="students-data-table">
            <thead>
              <tr>
                <th className="student-th-left">Admission Number</th>
                <th className="student-th">Name</th>
                <th className="student-th">Class</th>
                <th className="student-th">Attendance %</th>
                <th className="student-th-right">Status</th>
              </tr>
            </thead>

            <tbody>
              {sortedStudents.map((student) => {
                const studentName = student.nameEnglish || student.name || "Student";
                const attendance = student.attendance ?? 0;
                const isPrimary = attendance >= 75;

                return (
                  <tr
                    key={student._id}
                    className="student-row-group"
                    onClick={() => navigate("/students")}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="student-cell-left">
                      <span className="student-admission-label">
                        {student.admissionNumber || "-"}
                      </span>
                    </td>

                    <td>
                      <div className="student-avatar-group">
                        <div className="student-avatar-wrapper">
                          <img
                            className="student-avatar-img"
                            src={
                              student.photo ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}`
                            }
                            alt={studentName}
                          />
                        </div>

                        <span className="student-name-label">
                          {studentName}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="student-class-label">
                        {student.classId?.name || (typeof student.classId === "string" ? student.classId : "-")}
                      </span>
                    </td>

                    <td>
                      <div className="student-progress-wrapper">
                        <div className="student-progress-bg">
                          <div
                            className={`student-progress-fill ${
                              isPrimary ? "status-primary" : "status-error"
                            }`}
                            style={{
                              width: `${Math.min(100, Math.max(0, attendance))}%`,
                            }}
                          />
                        </div>

                        <span
                          className={`student-progress-pct ${
                            isPrimary ? "status-primary" : "status-error"
                          }`}
                        >
                          {attendance}%
                        </span>
                      </div>
                    </td>

                    <td className="student-cell-right">
                      <span
                        className={`status-badge ${
                          (student.status || "active").toLowerCase() === "active"
                            ? "badge-active"
                            : "badge-probation"
                        }`}
                      >
                        {(student.status || "active").toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecentStudents;