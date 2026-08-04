   import "./AttendanceHistory.css";

function AttendanceHistory() {
  return (
    <div className="attendance-history-page">

      {/* Header */}

      <div className="history-header">
        <div>
          <h1>Attendance History</h1>

          <p>
            View attendance records,
            reasons and supporting documents.
          </p>
        </div>
      </div>

      {/* Filters */}

      <div className="history-card">

        <h3>Filters</h3>

        <div className="history-filter-grid">

          <select>
            <option>Select Class</option>
          </select>

          <select>
            <option>Select Division</option>
          </select>

          <select>
            <option>Select Student</option>
          </select>

          <input
            type="month"
          />

        </div>

      </div>

      {/* Student Details */}

      <div className="history-card">

        <h3>Student Information</h3>

        <div className="student-info-grid">

          <div>
            <span>Name</span>
            <strong>—</strong>
          </div>

          <div>
            <span>Admission No.</span>
            <strong>—</strong>
          </div>

          <div>
            <span>Class</span>
            <strong>—</strong>
          </div>

          <div>
            <span>Division</span>
            <strong>—</strong>
          </div>

          <div>
            <span>Attendance %</span>
            <strong>—</strong>
          </div>

        </div>

      </div>

      {/* Calendar */}

      <div className="history-card">

        <h3>Attendance Calendar</h3>

        <div className="calendar-placeholder">

          Calendar will be shown here

        </div>

      </div>

    </div>
  );
}

export default AttendanceHistory;