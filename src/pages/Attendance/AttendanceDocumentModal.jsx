import { useState, useRef } from "react";
import {
  uploadAttendanceDocuments,
  replaceAttendanceDocument,
  deleteAttendanceDocument,
} from "../../services/AttendanceService";
import { toast } from "react-toastify";
import "./AttendanceDocumentModal.css";

function AttendanceDocumentModal({
  open,
  onClose,
  attendanceRecord,
  isTeacher,
  onUpdateRecord,
}) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [replacingDocId, setReplacingDocId] = useState(null);
  
  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);

  if (!open || !attendanceRecord) return null;

  const attendanceId = attendanceRecord._id;
  const documents = attendanceRecord.documents || [];

  /* =========================================
     FILE SELECTION & UPLOAD
  ========================================= */

  const handleFileChange = async (e, replaceId = null) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      e.target.value = "";
      return;
    }

    await uploadFile(file, replaceId);
    e.target.value = "";
  };

  const uploadFile = async (file, replaceId = null) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("document", file);

      let res;
      if (replaceId) {
        res = await replaceAttendanceDocument(attendanceId, replaceId, formData);
        toast.success("Document replaced successfully.");
      } else {
        res = await uploadAttendanceDocuments(attendanceId, formData);
        toast.success("Document uploaded successfully.");
      }

      if (res && res.data) {
        onUpdateRecord(res.data);
      }
      setReplacingDocId(null);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to process document upload."
      );
    } finally {
      setUploading(false);
    }
  };

  /* =========================================
     DELETE DOCUMENT
  ========================================= */

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      setUploading(true);
      const res = await deleteAttendanceDocument(attendanceId, docId);
      toast.success("Document deleted successfully.");
      
      if (res && res.data) {
        onUpdateRecord(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to delete document."
      );
    } finally {
      setUploading(false);
    }
  };

  /* =========================================
     DRAG AND DROP HANDLERS
  ========================================= */

  const handleDragOver = (e) => {
    e.preventDefault();
    if (isTeacher) setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragging(false);

    if (!isTeacher) return;

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    await uploadFile(file);
  };

  const triggerFileInput = () => {
    if (isTeacher && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const triggerReplaceInput = (docId) => {
    if (isTeacher) {
      setReplacingDocId(docId);
      if (replaceInputRef.current) {
        replaceInputRef.current.click();
      }
    }
  };


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isTeacher ? "Manage Documents" : "View Documents"}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <div className="modal-body">
          {/* Student Meta Details */}
          <div className="student-meta">
            <div className="student-meta-grid">
              <div className="meta-item">
                <span className="meta-label">Student</span>
                <span className="meta-value">
                  {attendanceRecord.studentId?.nameEnglish || "Student"}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Date</span>
                <span className="meta-value">
                  {new Date(attendanceRecord.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* List of Documents */}
          <div className="documents-section">
            <h3>Uploaded Documents ({documents.length}/10)</h3>
            {documents.length === 0 ? (
              <div className="empty-documents">
                <span className="material-symbols-outlined empty-doc-icon">
                  folder_open
                </span>
                <p>No documents uploaded yet.</p>
              </div>
            ) : (
              <div className="document-list">
                {documents.map((doc) => (
                  <div className="document-item" key={doc._id}>
                    <div className="document-info">
                      <span className="material-symbols-outlined document-icon">
                        picture_as_pdf
                      </span>
                      <div className="document-details">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="document-name"
                          title="Click to view PDF"
                        >
                          {doc.fileName}
                        </a>
                        <span className="document-meta-text">
                          Uploaded on{" "}
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="document-actions">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="doc-action-btn"
                        title="View PDF"
                      >
                        <span className="material-symbols-outlined">visibility</span>
                      </a>

                      {isTeacher && (
                        <>
                          <button
                            type="button"
                            className="doc-action-btn"
                            onClick={() => triggerReplaceInput(doc._id)}
                            disabled={uploading}
                            title="Replace PDF"
                          >
                            <span className="material-symbols-outlined">
                              cached
                            </span>
                          </button>
                          <button
                            type="button"
                            className="doc-action-btn delete"
                            onClick={() => handleDelete(doc._id)}
                            disabled={uploading}
                            title="Delete PDF"
                          >
                            <span className="material-symbols-outlined">
                              delete
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Area for Teachers */}
          {isTeacher && documents.length < 10 && (
            <div className="upload-section">
              <h3>Upload New Document</h3>
              
              <div
                className={`file-dropzone ${dragging ? "dragging" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <span className="material-symbols-outlined dropzone-icon">
                  cloud_upload
                </span>
                <span className="dropzone-text">
                  {uploading
                    ? "Uploading..."
                    : "Drag & drop PDF here, or click to browse"}
                </span>
                <span className="dropzone-subtext">PDF only (Max 10MB)</span>
              </div>

              <input
                type="file"
                className="file-select-input"
                accept=".pdf,application/pdf"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e)}
                disabled={uploading}
              />
            </div>
          )}
        </div>

        {/* Hidden replacement file selector */}
        {isTeacher && (
          <input
            type="file"
            className="file-select-input"
            accept=".pdf,application/pdf"
            ref={replaceInputRef}
            onChange={(e) => handleFileChange(e, replacingDocId)}
            disabled={uploading}
          />
        )}
      </div>
    </div>
  );
}

export default AttendanceDocumentModal;
