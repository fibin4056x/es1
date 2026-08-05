import { useState } from "react";
import {
  uploadAttendanceDocuments,
  deleteAttendanceDocument,
} from "../../services/AttendanceService";
import { useAuth } from "../../hooks/UseAuth";

const getDocumentUrl = (url) => {
  if (!url) return "#";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) {
    return url;
  }
  const backendBase = "http://localhost:5000";
  return `${backendBase}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function AttendanceDetailsModal({
  open,
  onClose,
  attendanceRecord,
  isTeacher = true,
  canEditAttendance,
  onUpdateRecord,
}) {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();
  const canEdit =
    canEditAttendance !== undefined
      ? canEditAttendance
      : role === "teacher" || role === "principal" || role === "admin" || isTeacher;

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!open || !attendanceRecord) return null;

  const handleUpload = async () => {
    if (!selectedFile) return;

    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name?.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      alert("Only PDF files are allowed.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("document", selectedFile);

      const response = await uploadAttendanceDocuments(
        attendanceRecord._id,
        formData
      );

      const updatedData = response.data?.data || response.data || response;
      onUpdateRecord?.(updatedData);
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

      const updatedData = response.data?.data || response.data || response;
      onUpdateRecord?.(updatedData);
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
            {canEdit
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
                    href={getDocumentUrl(doc.url)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>

                  {canEdit && (
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

          {canEdit && (
            <div className="upload-section">
              <input
                type="file"
                accept=".pdf,application/pdf"
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