import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialStudents = [
  {
    admissionNumber: "ET-2023-0492",
    name: "Amara Okafor",
    className: "Comp Sci",
    attendance: 92,
    status: "ACTIVE",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSvFOd8bpm70of2RpwHRk_K6gc05_at9gxxwLdiXxe7U-CpdTcjD69yYiU24cS6H50rfhASkjTK3GZgDep3_XMc9jBZR9ffAaKobHCEuWoxJNka9QFn_tTWg37ngQQogOVf0ZS_KWTGeVmRVZd493waZqi5N5t-UFQLa6-XAzjfF10tT48lsL6CY1jcOdKFFOehjy-RB7RQG-yPYFf7XyfBkqMy1xs_jNHchC7qRPtf7eO5TDYMGJriQT0M8lAGeqcTTJp5CKFvyPS",
  },
  {
    admissionNumber: "ET-2023-0118",
    name: "Liam Chen",
    className: "Mech Eng",
    attendance: 48,
    status: "PROBATION",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBePxykzM4JlSaypbllJACiWEkYOt9raeX4HKWQgamxj9IqnY-MtdfYdIymq1bC0DGIX87f7uQfA7pQQIYvUI_WJK_T5FvS9j0L1F9IceLCUwa5wXvy0lORHuk766Dx3btgvYX2nX0c2suJD3d-8DcEyOSH4-3Yr4jyjOrRCIT0r-ZZ9zWUpH_7ApA2N9WT87WimK9NR7iWwICuiG9r6ya8NqKMiapV1QNpVbuNWZJaUywE1Y-MGCMEGwxXYbSDKnxdhdl4N3N01BdV",
  },
];

function RecentStudents() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("Name");

  // Local Sort Implementation
  const sortedStudents = [...initialStudents].sort((a, b) => {
    if (sortBy === "Name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "Progress") {
      return b.attendance - a.attendance; // Highest progress first
    }
    return 0;
  });

  return (
    <div className="glass-card" style={{ padding: "32px", textAlign: "left" }}>
      <style>{`
        .recent-students-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        .sort-select-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
        }
        .sort-select-input {
          background: rgba(0, 0, 0, 0.05);
          border: none;
          border-radius: var(--radius-xl);
          padding: 8px 36px 8px 16px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          cursor: pointer;
          outline: none;
          appearance: none;
          -webkit-appearance: none;
          transition: all 0.3s ease;
        }
        .dark .sort-select-input {
          background: rgba(255, 255, 255, 0.05);
        }
        .sort-select-input:focus {
          box-shadow: 0 0 0 1px rgba(192, 193, 255, 0.5);
        }
        .sort-select-arrow {
          position: absolute;
          right: 12px;
          font-size: 16px !important;
          color: var(--text-muted);
          pointer-events: none;
        }
        .students-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }
        .students-data-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 12px;
        }
        .students-data-table th {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-main);
        }
        .students-data-table td {
          padding: 16px;
          background: rgba(0, 0, 0, 0.02);
          transition: background 0.3s ease;
        }
        .dark .students-data-table td {
          background: rgba(255, 255, 255, 0.02);
        }
        .student-row-group {
          cursor: pointer;
        }
        .student-row-group:hover td {
          background: rgba(0, 0, 0, 0.05);
        }
        .dark .student-row-group:hover td {
          background: rgba(255, 255, 255, 0.05);
        }
        .student-cell-left {
          border-top-left-radius: var(--radius-2xl);
          border-bottom-left-radius: var(--radius-2xl);
        }
        .student-cell-right {
          border-top-right-radius: var(--radius-2xl);
          border-bottom-right-radius: var(--radius-2xl);
          text-align: right;
        }
        .student-avatar-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .student-avatar-wrapper {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-main);
          padding: 2px;
          overflow: hidden;
        }
        .student-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: var(--radius-full);
          object-fit: cover;
        }
        .student-name-label {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-main);
        }
        .student-admission-label {
          font-size: 10px;
          color: var(--text-muted);
          font-weight: 500;
        }
        .student-progress-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 160px;
        }
        .student-progress-bg {
          height: 6px;
          flex: 1;
          background: rgba(0, 0, 0, 0.05);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .dark .student-progress-bg {
          background: rgba(255, 255, 255, 0.1);
        }
        .student-progress-fill {
          height: 100%;
          border-radius: var(--radius-full);
        }
        .student-progress-fill.status-primary {
          background-color: var(--primary);
        }
        .student-progress-fill.status-error {
          background-color: #ef4444;
        }
        .student-progress-pct {
          font-size: 12px;
          font-weight: 700;
        }
        .student-progress-pct.status-primary {
          color: var(--primary);
        }
        .student-progress-pct.status-error {
          color: #ef4444;
        }
        .status-badge {
          display: inline-flex;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .status-badge.badge-active {
          background: rgba(74, 222, 128, 0.1);
          color: var(--success-accent);
        }
        .status-badge.badge-probation {
          background: rgba(255, 180, 171, 0.1);
          color: #ef4444;
        }
      `}</style>

      <div className="recent-students-header">
        <h4 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-main)" }}>Recent Students</h4>
        
        <div className="sort-select-wrapper">
          <select 
            className="sort-select-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="Name">Sort by: Name</option>
            <option value="Progress">Sort by: Progress</option>
          </select>
          <span className="material-symbols-outlined sort-select-arrow">expand_more</span>
        </div>
      </div>

      <div className="students-table-wrapper">
        <table className="students-data-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: "16px", textAlign: "left" }}>Admission Number</th>
              <th style={{ textAlign: "left" }}>Name</th>
              <th style={{ textAlign: "left" }}>Class</th>
              <th style={{ textAlign: "left" }}>Attendance %</th>
              <th style={{ paddingRight: "16px", textAlign: "right" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student, index) => {
              const isPrimary = student.attendance >= 75;
              return (
                <tr 
                  key={index} 
                  className="student-row-group"
                  onClick={() => navigate("/students")}
                >
                  <td className="student-cell-left">
                    <span className="student-admission-label">{student.admissionNumber}</span>
                  </td>
                  <td>
                    <div className="student-avatar-group">
                      <div className="student-avatar-wrapper">
                        <img 
                          className="student-avatar-img" 
                          src={student.avatar} 
                          alt={student.name}
                        />
                      </div>
                      <span className="student-name-label">{student.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="student-name-label" style={{ fontSize: "12px" }}>{student.className}</span>
                  </td>
                  <td>
                    <div className="student-progress-wrapper">
                      <div className="student-progress-bg">
                        <div 
                          className={`student-progress-fill ${isPrimary ? "status-primary" : "status-error"}`}
                          style={{ width: `${student.attendance}%` }}
                        ></div>
                      </div>
                      <span className={`student-progress-pct ${isPrimary ? "status-primary" : "status-error"}`}>
                        {student.attendance}%
                      </span>
                    </div>
                  </td>
                  <td className="student-cell-right">
                    <span 
                      className={`status-badge ${student.status === "ACTIVE" ? "badge-active" : "badge-probation"}`}
                    >
                      {student.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentStudents;