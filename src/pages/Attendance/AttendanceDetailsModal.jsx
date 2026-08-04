export default function AttendanceDetailsModal({ open, onClose, attendanceRecord }) {
  if (!open || !attendanceRecord) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Attendance Details</h2>
          <button type="button" className="close-modal-btn" onClick={onClose}>
            ✖
          </button>
        </div>
        <div className="modal-body">
          <div className="detail-row">
            <strong>Student:</strong> {attendanceRecord.studentId?.nameEnglish || "Student"}
          </div>
          <div className="detail-row">
            <strong>Status:</strong> {attendanceRecord.status}
          </div>
          <div className="detail-row">
            <strong>Reason:</strong> {attendanceRecord.reason || "None"}
          </div>
          <div className="detail-row">
            <strong>Documents:</strong> {attendanceRecord.documents?.length || 0}
          </div>
        </div>
      </div>
    </div>
  );
}
