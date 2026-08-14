import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "../../components/common/Modal/Modal";
import FileUpload from "../../components/common/FileUpload/FileUpload";
import { createReport } from "../../services/reportService";
import { getStudents } from "../../services/StudentService";
import { getTeachers } from "../../services/TeacherService";
import { useAuth } from "../../hooks/UseAuth";

const extractArray = (res, keys = []) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (res.data && Array.isArray(res.data)) return res.data;
  for (const k of keys) {
    if (res[k] && Array.isArray(res[k])) return res[k];
    if (res.data && res.data[k] && Array.isArray(res.data[k])) return res.data[k];
  }
  return [];
};

export default function ReportComposeModal({ isOpen, onClose, onReportSent }) {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [recipients, setRecipients] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Load students & potential recipients (teachers/principals)
  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      try {
        const [studRes, teachRes] = await Promise.all([
          getStudents({ limit: 100 }).catch(() => ({ data: [] })),
          getTeachers().catch(() => ({ data: [] })),
        ]);

        const studentList = extractArray(studRes, ["students", "items"]);
        const teacherList = extractArray(teachRes, ["teachers", "items"]);

        setStudents(studentList);
        setRecipients(teacherList);
      } catch (err) {
        console.error("Failed to load compose options:", err);
        setStudents([]);
        setRecipients([]);
      }
    };
    loadData();
  }, [isOpen]);

  const handleFileSelect = (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    setFiles((prev) => [...prev, ...(Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles])]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!studentId) {
      toast.error("Please select a student for this report.");
      return false;
    }
    if (!recipientId) {
      toast.error("Please select a recipient.");
      return false;
    }
    if (!subject.trim()) {
      toast.error("Please enter a report title / subject.");
      return false;
    }
    if (!body.trim()) {
      toast.error("Please enter the report message body.");
      return false;
    }
    return true;
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;
    if (loading) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("recipientId", recipientId);
      formData.append("subject", subject.trim());
      formData.append("body", body.trim());

      files.forEach((file) => {
        formData.append("attachments", file);
      });

      await createReport(formData);
      toast.success("Report submitted and sent successfully.");

      // Reset form
      setStudentId("");
      setRecipientId("");
      setSubject("");
      setBody("");
      setFiles([]);
      setPreviewOpen(false);

      if (onReportSent) onReportSent();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send report.");
    } finally {
      setLoading(false);
    }
  };

  const safeStudents = Array.isArray(students) ? students : [];
  const safeRecipients = Array.isArray(recipients) ? recipients : [];

  const selectedStudent = safeStudents.find((s) => s._id === studentId);
  const selectedRecipient = safeRecipients.find((r) => r._id === recipientId);

  return (
    <>
      <Modal
        isOpen={isOpen && !previewOpen}
        onClose={onClose}
        title="Compose Student Report"
        maxWidth="680px"
      >
        <form onSubmit={handleSend} className="report-compose-form">
          {/* Student Selector */}
          <div className="report-form-group">
            <label className="report-form-label">
              Student <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            >
              <option value="">-- Select Student --</option>
              {safeStudents.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.nameEnglish || s.name} ({s.admissionNumber || "No Adm No"})
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Selector */}
          <div className="report-form-group">
            <label className="report-form-label">
              Recipient <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              required
            >
              <option value="">-- Select Recipient --</option>
              {safeRecipients.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name || r.fullName} ({r.role ? r.role.toUpperCase() : "Teacher"})
                </option>
              ))}
            </select>
          </div>

          {/* Subject / Title */}
          <div className="report-form-group">
            <label className="report-form-label">
              Report Title / Subject <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Attendance Concern - July 2026"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={200}
              required
            />
          </div>

          {/* Body Text */}
          <div className="report-form-group">
            <label className="report-form-label">
              Message / Report Content <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              rows={5}
              placeholder="Write your detailed message or report here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={5000}
              required
            />
          </div>

          {/* File Attachments */}
          <div className="report-form-group">
            <label className="report-form-label">
              Attachments (PDF, JPG, JPEG, PNG)
            </label>

            {files.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "8px" }}>
                {files.map((file, idx) => (
                  <div key={idx} className="report-file-item">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="material-symbols-outlined" style={{ color: "#6366f1", fontSize: "20px" }}>attach_file</span>
                      <span style={{ fontSize: "0.875rem" }}>{file.name}</span>
                      <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button type="button" onClick={() => handleRemoveFile(idx)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <FileUpload
              accept=".pdf,.jpg,.jpeg,.png"
              maxSizeMB={10}
              onFileSelect={handleFileSelect}
              label="Click or drag PDF/Images to attach"
            />
          </div>

          {/* Action Buttons */}
          <div className="report-modal-actions">
            <button
              type="button"
              className="report-btn-secondary btn-press"
              onClick={() => {
                if (validateForm()) setPreviewOpen(true);
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>visibility</span>
              Preview
            </button>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                className="report-btn-secondary btn-press"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="report-btn-primary btn-press"
                disabled={loading}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                  {loading ? "progress_activity" : "send"}
                </span>
                <span>{loading ? "Sending..." : "Send Report"}</span>
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* PREVIEW MODAL */}
      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Report Preview"
        maxWidth="600px"
      >
        <div style={{ padding: "4px 0" }}>
          <div className="report-detail-card">
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1.125rem", fontWeight: 700 }}>{subject}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.875rem", opacity: 0.8, marginBottom: "12px" }}>
              <div><strong>Student:</strong> {selectedStudent?.nameEnglish || selectedStudent?.name || "Selected Student"}</div>
              <div><strong>Recipient:</strong> {selectedRecipient?.name || selectedRecipient?.fullName || "Selected Recipient"}</div>
              <div><strong>Sender:</strong> {user?.name} ({user?.role})</div>
              <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
            </div>
            <div className="report-detail-body">
              {body}
            </div>
          </div>

          {files.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <span style={{ fontSize: "0.8125rem", opacity: 0.8, fontWeight: 600 }}>Attachments ({files.length}):</span>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" }}>
                {files.map((f, i) => (
                  <span key={i} style={{ padding: "4px 10px", background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)", borderRadius: "6px", fontSize: "0.8125rem", color: "#818cf8" }}>
                    📎 {f.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="report-modal-actions" style={{ justifyContent: "flex-end" }}>
            <button
              type="button"
              className="report-btn-secondary btn-press"
              onClick={() => setPreviewOpen(false)}
            >
              Back to Edit
            </button>
            <button
              type="button"
              className="report-btn-primary btn-press"
              onClick={() => handleSend()}
              disabled={loading}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                {loading ? "progress_activity" : "send"}
              </span>
              <span>{loading ? "Sending..." : "Confirm & Send"}</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
