import { isSameStudent } from "../../util/helpers";
import "./AttendanceRow.css";

function AttendanceRow({
  student,
  attendance,
  setAttendance,
  isTeacher,
  onManageDocuments,
  onDeleteAttendance,
  loading,
}) {
  /* =========================================
     CURRENT ATTENDANCE
  ========================================= */

  const currentAttendance =
    attendance.find(
      (item) => isSameStudent(item.studentId, student._id)
    ) || {
      _id: null,
      studentId: student._id,
      status: "present",
      reason: "",
      documents: [],
    };

  /* =========================================
     STATUS CHANGE
  ========================================= */

  const handleStatusChange = (status) => {
    setAttendance((prev) => {
      const exists = prev.some((item) => isSameStudent(item.studentId, student._id));
      if (exists) {
        return prev.map((item) =>
          isSameStudent(item.studentId, student._id)
            ? {
                ...item,
                status,
        reason:
  status === "present"
    ? ""
    : item.reason || "",
              }
            : item
        );
      }
      return [
        ...prev,
        {
          _id: null,
          studentId: student._id,
          status,
          reason: "",
          documents: [],
        },
      ];
    });
  };

  /* =========================================
     REASON CHANGE
  ========================================= */

  const handleReasonChange = (reason) => {
    setAttendance((prev) => {
      const exists = prev.some((item) => isSameStudent(item.studentId, student._id));
      if (exists) {
        return prev.map((item) =>
          isSameStudent(item.studentId, student._id)
            ? {
                ...item,
                reason,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          _id: null,
          studentId: student._id,
          status: "present",
          reason,
          documents: [],
        },
      ];
    });
  };

 const hasRecordId =
  currentAttendance?._id != null;
 const docCount = Array.isArray(currentAttendance.documents)
  ? currentAttendance.documents.length
  : 0;
  return (
    <tr className="attendance-row">
      {/* Admission */}

      <td className="student-admission">
        {student.admissionNumber}
      </td>

      {/* Name */}

      <td className="student-name">
        {student.nameEnglish}
      </td>

      {/* Status */}

      <td className="attendance-status">
        <select
          className={`attendance-select status-${currentAttendance.status}`}
          value={currentAttendance.status}
          onChange={(e) =>
            handleStatusChange(e.target.value)
          }
         
        >
          <option value="present">
            🟢 Present
          </option>

          <option value="absent">
            🔴 Absent
          </option>

          <option value="late">
            🟡 Late
          </option>

          <option value="leave">
            🔵 Leave
          </option>
        </select>
      </td>

      {/* Reason */}

      <td className="attendance-reason">
        <input
          type="text"
          className="attendance-reason-input"
          placeholder={
            currentAttendance.status === "present"
              ? "Reason not required"
              : "Enter reason..."
          }
          value={currentAttendance.reason}
          onChange={(e) =>
            handleReasonChange(e.target.value)
          }
          disabled={
            currentAttendance.status === "present" ||
            !isTeacher ||
            loading
          }
        />
      </td>

      {/* PDF */}

      <td className="attendance-document">
        <button
          type="button"
          className={`attendance-document-btn ${hasRecordId ? "enabled" : ""}`}
          onClick={() => onManageDocuments?.(currentAttendance)}
          disabled={!hasRecordId}
          title={
            hasRecordId
              ? isTeacher
                ? `Manage Documents (${docCount})`
                : `View Documents (${docCount})`
              : "Save attendance first to manage documents"
          }
        >
          <span className="material-symbols-outlined document-btn-icon">
            description
          </span>
          {docCount > 0 && (
            <span className="doc-count-badge">{docCount}</span>
          )}
        </button>
      </td>

      {/* Actions */}

      <td className="attendance-actions">
        <button
          type="button"
          className={`attendance-action-delete-btn ${isTeacher && hasRecordId ? "active" : ""}`}
          onClick={() => onDeleteAttendance?.(currentAttendance._id, student._id)}
          disabled={!isTeacher || !hasRecordId || loading}
          title={
            !isTeacher
              ? "Only teachers can delete attendance records"
              : !hasRecordId
              ? "Attendance record not saved yet"
              : "Delete attendance record"
          }
        >
          <span className="material-symbols-outlined">
            delete
          </span>
        </button>
      </td>
    </tr>
  );
}

export default AttendanceRow;