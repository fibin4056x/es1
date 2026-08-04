import { useState } from "react";
import {
  uploadAttendanceDocuments,
  deleteAttendanceDocument,
} from "../../services/attendanceService";

export default function AttendanceDetailsModal({
  open,
  onClose,
  attendanceRecord,
  isTeacher = false,
  onUpdateRecord,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!open || !attendanceRecord) return null;

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("document", selectedFile);

      const response = await uploadAttendanceDocuments(
        attendanceRecord._id,
        formData
      );

      onUpdateRecord?.(response.data.data);
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Failed to upload document."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      setLoading(true);

      const response = await deleteAttendanceDocument(
        attendanceRecord._id,
        documentId
      );

      onUpdateRecord?.(response.data.data);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Failed to delete document."
      );
    } finally {
      setLoading(false);
    }
  };

  const documents = attendanceRecord.documents || [];

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>
            {isTeacher
              ? "Manage Documents"
              : "View Documents"}
          </h2>

          <button
            type="button"
            className="close-modal-btn"
            onClick={onClose}
          >
            ✖
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-row">
            <strong>Student:</strong>{" "}
            {attendanceRecord.studentId?.nameEnglish}
          </div>

          <div className="detail-row">
            <strong>Status:</strong>{" "}
            {attendanceRecord.status}
          </div>

          <div className="detail-row">
            <strong>Reason:</strong>{" "}
            {attendanceRecord.reason || "None"}
          </div>

          <hr />

          <h3>Documents</h3>

          {documents.length === 0 ? (
            <p>No documents uploaded.</p>
          ) : (
            documents.map((doc) => (
              <div
                key={doc._id}
                className="document-item"
              >
                <span>{doc.fileName}</span>

                <div className="document-actions">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>

                  {isTeacher && (
                    <button
                      onClick={() =>
                        handleDelete(doc._id)
                      }
                      disabled={loading}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

          {isTeacher && (
            <div className="upload-section">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setSelectedFile(
                    e.target.files[0]
                  )
                }
              />

              <button
                onClick={handleUpload}
                disabled={
                  !selectedFile || loading
                }
              >
                {loading
                  ? "Uploading..."
                  : "Upload PDF"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}