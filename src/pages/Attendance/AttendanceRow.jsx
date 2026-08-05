import { isSameStudent } from "../../util/helpers";
import "./AttendanceRow.css";

function AttendanceRow({
  student,
  attendance = [],
  setAttendance,
  canEditAttendance,
  onManageDocuments,
  onDeleteAttendance,
  loading,
}) {
  /* =========================================
     CURRENT ATTENDANCE
  ========================================= */

  const currentAttendance =
    attendance.find((item) =>
      isSameStudent(item.studentId, student._id)
    ) ?? {
      _id: null,
      studentId: student._id,
      status: "present",
      reason: "",
      documents: [],
    };

  const hasRecordId = Boolean(currentAttendance?._id);
  const docCount = currentAttendance.documents?.length ?? 0;

  /* =========================================
     STATUS CHANGE
  ========================================= */

  const getDefaultReason = (status, currentReason) => {
    if (status === "present") return "";
    if (currentReason && currentReason.trim()) return currentReason;
    if (status === "leave") return "On Leave";
    if (status === "absent") return "Absent";
    if (status === "late") return "Late";
    return "Leave Application";
  };

  const handleStatusChange = (status) => {
    if (!canEditAttendance || loading) return;

    setAttendance((prev) => {
      const exists = prev.some((item) =>
        isSameStudent(item.studentId, student._id)
      );

      if (exists) {
        return prev.map((item) =>
          isSameStudent(item.studentId, student._id)
            ? {
                ...item,
                status,
                reason: getDefaultReason(status, item.reason),
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
          reason: getDefaultReason(status, ""),
          documents: [],
        },
      ];
    });
  };

  /* =========================================
     REASON CHANGE
  ========================================= */

  const handleReasonChange = (reason) => {
    if (!canEditAttendance || loading) return;

    setAttendance((prev) => {
      const exists = prev.some((item) =>
        isSameStudent(item.studentId, student._id)
      );

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

  /* =========================================
     DELETE
  ========================================= */

  const handleDelete = () => {
    if (!canEditAttendance || !hasRecordId || loading) return;

    onDeleteAttendance?.(currentAttendance._id, student._id);
  };

  /* =========================================
     DOCUMENTS
  ========================================= */

  const handleDocuments = () => {
    if ((!hasRecordId && !canEditAttendance) || loading) return;

    onManageDocuments?.(currentAttendance);
  };

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
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={!canEditAttendance || loading}
        >
          <option value="present">🟢 Present</option>
          <option value="absent">🔴 Absent</option>
          <option value="late">🟡 Late</option>
          <option value="leave">🔵 Leave</option>
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
          onChange={(e) => handleReasonChange(e.target.value)}
          disabled={
            currentAttendance.status === "present" ||
            !canEditAttendance ||
            loading
          }
        />
      </td>

      {/* Documents */}
      <td className="attendance-document">
        <button
          type="button"
          className={`attendance-document-btn ${
            hasRecordId || canEditAttendance ? "enabled" : ""
          } ${currentAttendance.status === "leave" ? "is-leave" : ""}`}
          onClick={handleDocuments}
          disabled={(!hasRecordId && !canEditAttendance) || loading}
          title={
            hasRecordId
              ? canEditAttendance
                ? `Manage Documents (${docCount})`
                : `View Documents (${docCount})`
              : canEditAttendance
              ? "Click to manage documents (will save attendance)"
              : "No attendance record saved yet"
          }
        >
          <span className="material-symbols-outlined document-btn-icon">
            {currentAttendance.status === "leave" ? "upload_file" : "description"}
          </span>

          {currentAttendance.status === "leave" ? (
            <span>{docCount > 0 ? `PDF (${docCount})` : "Attach PDF"}</span>
          ) : (
            docCount > 0 && (
              <span className="doc-count-badge">
                {docCount}
              </span>
            )
          )}
        </button>
      </td>

      {/* Actions */}
      <td className="attendance-actions">
        <button
          type="button"
          className={`attendance-action-delete-btn ${
            canEditAttendance && hasRecordId ? "active" : ""
          }`}
          onClick={handleDelete}
          disabled={!canEditAttendance || !hasRecordId || loading}
          title={
            !canEditAttendance
              ? "You don't have permission to delete attendance records"
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