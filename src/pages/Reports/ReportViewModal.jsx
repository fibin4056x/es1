import { useEffect, useState } from "react";
import Modal from "../../components/common/Modal/Modal";
import { getReportById, markReportRead, deleteReport } from "../../services/reportService";
import { toast } from "react-toastify";

export default function ReportViewModal({ isOpen, onClose, reportId, onReportDeleted }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !reportId) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await getReportById(reportId);
        const reportData = res.data || res.report || res;
        setReport(reportData);
      } catch {
        toast.error("Failed to load report details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [isOpen, reportId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await deleteReport(reportId);
      toast.success("Report deleted successfully.");
      if (onReportDeleted) onReportDeleted();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete report.");
    }
  };

  const handleToggleRead = async () => {
    if (!report) return;
    const newStatus = !report.isRead;
    try {
      await markReportRead(reportId, newStatus);
      setReport((prev) => (prev ? { ...prev, isRead: newStatus } : prev));
      toast.success(`Marked report as ${newStatus ? "read" : "unread"}.`);
    } catch {
      toast.error("Failed to update read status.");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report Details"
      maxWidth="680px"
    >
      {loading ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8" }}>
          <div className="login-loading-spinner" style={{ margin: "0 auto 12px" }}></div>
          Loading report content...
        </div>
      ) : !report ? (
        <div style={{ padding: "24px 0", textAlign: "center", color: "#ef4444" }}>
          Failed to load report information.
        </div>
      ) : (
        <div className="report-detail-wrapper" style={{ padding: "4px 0" }}>
          {/* Header Info Card */}
          <div style={{ background: "rgba(15, 23, 42, 0.6)", borderRadius: "10px", padding: "18px", border: "1px solid rgba(255, 255, 255, 0.1)", marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "1.25rem", fontWeight: 700 }}>
                {report.subject}
              </h2>
              <span style={{ fontSize: "0.75rem", padding: "4px 10px", borderRadius: "12px", background: report.isRead ? "rgba(16, 185, 129, 0.15)" : "rgba(99, 102, 241, 0.15)", color: report.isRead ? "#10b981" : "#818cf8", border: `1px solid ${report.isRead ? "rgba(16, 185, 129, 0.3)" : "rgba(99, 102, 241, 0.3)"}`, fontWeight: 600 }}>
                {report.isRead ? "Read" : "Unread"}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.875rem", color: "#94a3b8" }}>
              <div>
                <strong style={{ color: "#f8fafc" }}>Student:</strong>{" "}
                {report.studentId?.nameEnglish || report.studentId?.name || "Student"} ({report.studentId?.admissionNumber || "N/A"})
              </div>
              <div>
                <strong style={{ color: "#f8fafc" }}>Date:</strong>{" "}
                {report.createdAt ? new Date(report.createdAt).toLocaleString() : "Date"}
              </div>
              <div>
                <strong style={{ color: "#f8fafc" }}>From:</strong>{" "}
                {report.senderId?.name || report.senderId?.fullName || "Sender"} ({report.senderId?.role || "User"})
              </div>
              <div>
                <strong style={{ color: "#f8fafc" }}>To:</strong>{" "}
                {report.recipientId?.name || report.recipientId?.fullName || "Recipient"} ({report.recipientId?.role || "User"})
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div style={{ background: "rgba(30, 41, 59, 0.4)", borderRadius: "10px", padding: "18px", border: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: "20px", color: "#f8fafc", fontSize: "0.9375rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {report.body}
          </div>

          {/* Attachments Section */}
          {report.attachments && report.attachments.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#f8fafc", fontSize: "0.875rem", fontWeight: 600 }}>
                Attachments ({report.attachments.length})
              </h4>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {report.attachments.map((att, idx) => (
                  <a
                    key={att._id || idx}
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 14px", borderRadius: "8px", background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)", color: "#818cf8", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>description</span>
                    <span>{att.originalName || `Attachment ${idx + 1}`}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Actions Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <button
              type="button"
              className="btn-press"
              onClick={handleDelete}
              style={{ padding: "8px 16px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
              Delete Report
            </button>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="btn-press"
                onClick={handleToggleRead}
                style={{ padding: "8px 16px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.08)", color: "#f8fafc", border: "1px solid rgba(255, 255, 255, 0.15)", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                  {report.isRead ? "mark_email_unread" : "drafts"}
                </span>
                {report.isRead ? "Mark Unread" : "Mark Read"}
              </button>

              <button
                type="button"
                className="btn-press"
                onClick={onClose}
                style={{ padding: "8px 18px", borderRadius: "8px", background: "var(--primary, #6366f1)", color: "#ffffff", border: "none", fontWeight: 600 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
