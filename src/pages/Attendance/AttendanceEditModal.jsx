import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "../../components/common/Modal/Modal";
import FileUpload from "../../components/common/FileUpload/FileUpload";
import {
  updateAttendance,
  markAttendance,
  uploadAttendanceDocuments,
  deleteAttendanceDocument,
} from "../../services/AttendanceService";
import { getStudentId } from "../../util/helpers";
import "./AttendanceDocumentModal.css";


export default function AttendanceEditModal({
  open,
  onClose,
  student,
  attendanceRecord,
  date,
  classId,
  divisionId,
  canEditAttendance,
  onRecordSaved,
}) {
  const currentRecord = attendanceRecord || {};
  const recordId = currentRecord._id;
  const documents = currentRecord.documents || [];

  const [status, setStatus] = useState(() => currentRecord.status || "present");
  const [reason, setReason] = useState(() => currentRecord.reason || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!canEditAttendance) return;

    if (status !== "present" && !reason.trim()) {
      toast.error(`Reason is required when status is set to '${status}'.`);
      return;
    }

    setSaving(true);
    try {
      let savedRecord = null;
      if (recordId) {
        // Individual single student PATCH endpoint
        const res = await updateAttendance(recordId, {
          status,
          reason: status === "present" ? "" : reason.trim(),
        });
        savedRecord = res.data;
        toast.success("Student attendance updated successfully.");
      } else {
        // Initial mark attendance for this student
        const studentId = student?._id || currentRecord.studentId;
        const res = await markAttendance({
          date,
          classId,
          divisionId,
          students: [
            {
              studentId: getStudentId(studentId),
              status,
              reason: status === "present" ? "" : reason.trim(),
            },
          ],
        });
        const createdRecords = res.data?.data || res.data || [];
        savedRecord = Array.isArray(createdRecords) ? createdRecords[0] : createdRecords;
        toast.success("Attendance created for student.");
      }

      if (onRecordSaved) {
        onRecordSaved(savedRecord);
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save student attendance.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    const targetRecordId = recordId;
    if (!targetRecordId) {
      toast.error("Please save the attendance record first before attaching documents.");
      return;
    }

    const file = files[0];
    const formData = new FormData();
    formData.append("document", file);

    setUploading(true);
    try {
      const res = await uploadAttendanceDocuments(targetRecordId, formData);
      toast.success("Document uploaded successfully.");
      if (onRecordSaved) {
        onRecordSaved(res.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDoc = async (docId) => {
    if (!recordId) return;
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    setUploading(true);
    try {
      const res = await deleteAttendanceDocument(recordId, docId);
      toast.success("Document deleted.");
      if (onRecordSaved) {
        onRecordSaved(res.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete document.");
    } finally {
      setUploading(false);
    }
  };

  const studentName = student?.nameEnglish || currentRecord.studentName || "Student";
  const admissionNum = student?.admissionNumber || currentRecord.admissionNumber || "";

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Edit Student Attendance"
      maxWidth="540px"
    >
      <form onSubmit={handleSave} className="att-modal-body">
        {/* Student Info Box */}
        <div style={{ background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "10px", padding: "14px 16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "var(--primary, #6366f1)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.1rem" }}>
            {studentName.charAt(0)}
          </div>
          <div>
            <h4 style={{ margin: 0, color: "#f8fafc", fontSize: "1rem", fontWeight: 600 }}>{studentName}</h4>
            <span style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>
              Admission No: {admissionNum || "N/A"}
            </span>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="form-group" style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.875rem", color: "#f8fafc" }}>
            Attendance Status <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <select
            className={`attendance-select status-${status}`}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={!canEditAttendance || saving}
          >
            <option value="present">🟢 Present</option>
            <option value="absent">🔴 Absent</option>
            <option value="late">🟡 Late</option>
            <option value="leave">🔵 Leave</option>
          </select>
        </div>

        {/* Reason Input */}
        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.875rem", color: "#f8fafc" }}>
            Reason / Remarks {status !== "present" && <span style={{ color: "#ef4444" }}>*</span>}
          </label>
          <input
            type="text"
            className="attendance-reason-input"
            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
            placeholder={status === "present" ? "Reason not required" : "Enter reason (required)..."}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={status === "present" || !canEditAttendance || saving}
          />
        </div>

        {/* Documents Section */}
        <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: 600, fontSize: "0.875rem", color: "#f8fafc" }}>
            Documents & Certificates (PDF, JPG, PNG)
          </label>

          {documents.length > 0 && (
            <div className="document-list" style={{ marginBottom: "16px" }}>
              {documents.map((doc) => (
                <div key={doc._id || doc.url} className="document-item">
                  <div className="document-info">
                    <span className="material-symbols-outlined doc-icon">description</span>
                    <div className="doc-meta">
                      <span className="doc-name">{doc.originalName || "Document"}</span>
                      <span className="doc-size">
                        {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : "File Attachment"}
                      </span>
                    </div>
                  </div>
                  <div className="doc-actions">
                    <a href={doc.url} target="_blank" rel="noreferrer" className="doc-view-btn" title="View Document">
                      <span className="material-symbols-outlined">visibility</span>
                    </a>
                    {canEditAttendance && (
                      <button type="button" className="doc-delete-btn" onClick={() => handleDeleteDoc(doc._id)} title="Delete Document">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {canEditAttendance && recordId && (
            <FileUpload
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={5 * 1024 * 1024}
              onFileSelect={handleFileUpload}
              disabled={uploading}
              label={uploading ? "Uploading..." : "Click or drag files here to upload medical certificate"}
            />
          )}

          {!recordId && canEditAttendance && (
            <p style={{ fontSize: "0.8125rem", color: "#94a3b8", fontStyle: "italic" }}>
              Note: Save attendance first to enable document attachments.
            </p>
          )}
        </div>

        {/* Modal Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
          <button type="button" className="btn-press" onClick={onClose} disabled={saving} style={{ padding: "10px 18px", borderRadius: "8px", background: "transparent", color: "#94a3b8", border: "1px solid rgba(255, 255, 255, 0.15)", fontWeight: 600 }}>
            Cancel
          </button>
          {canEditAttendance && (
            <button type="submit" className="btn-press" disabled={saving} style={{ padding: "10px 22px", borderRadius: "8px", background: "var(--primary, #6366f1)", color: "#ffffff", border: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                {saving ? "progress_activity" : "save"}
              </span>
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
