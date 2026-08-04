import AttendanceRow from "./AttendanceRow";

function AttendanceTable({
  students,
  attendance,
  setAttendance,
  isTeacher,
  onManageDocuments,
  onDeleteAttendance,
  loading,
}) {
  if (!students.length) {
    return (
      <div className="attendance-empty">
        <span className="material-symbols-outlined">
          groups
        </span>

        <h3>No Students Found</h3>

        <p>
          Select a class and division to
          load students.
        </p>
      </div>
    );
  }

  return (
    <div className="attendance-table-wrapper">
      <table className="attendance-table">
        <thead>
          <tr>
            <th width="140">
              Admission No.
            </th>

            <th>
              Student Name
            </th>

            <th width="180">
              Attendance Status
            </th>

            <th width="220">
              Reason
            </th>

            <th width="120">
              Documents
            </th>

            <th width="130">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <AttendanceRow
              key={student._id}
              student={student}
              attendance={attendance}
              setAttendance={setAttendance}
              isTeacher={isTeacher}
              onManageDocuments={onManageDocuments}
              onDeleteAttendance={onDeleteAttendance}
              loading={loading}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceTable;