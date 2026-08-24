import { useEffect, useState } from "react";
import Modal from "../../components/common/Modal/Modal";
import ConfirmModal from "../../components/common/Modal/ConfirmModal";
import { getReportById, markReportRead, deleteReport, deleteReportAttachment } from "../../services/reportService";
import { exportReportDetailPDF } from "../../util/pdfExport";
import { toast } from "react-toastify";

export default function ReportViewModal({ isOpen, onClose, reportId, onReportDeleted, onEditReport }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

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

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteReport(reportId);
      toast.success("Report deleted successfully.");
      if (onReportDeleted) onReportDeleted();
      setConfirmDeleteOpen(false);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete report.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteSingleAttachment = async (att, idx) => {
    if (!report) return;
    const attId = att._id || att.public_id || idx;
    try {
      await deleteReportAttachment(report._id, attId);
      setReport((prev) =>
        prev
          ? {
              ...prev,
              attachments: (prev.attachments || []).filter((item, i) => {
                const itemKey = item._id || item.public_id || i;
                return itemKey !== attId && i !== idx;
              }),
            }
          : prev
      );
      toast.success("Attachment removed successfully.");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to remove attachment.");
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

  const handleExportPDF = async () => {
    if (!report) return;
    try {
      setExporting(true);
      await exportReportDetailPDF(report);
      toast.success("PDF generated successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF.");
    } finally {
      setExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal
        isOpen={isOpen && !confirmDeleteOpen}
        onClose={onClose}
        title="Report Details"
        maxWidth="680px"
      >
        {loading ? (
          <div style={{ padding: "40px 0", textAlign: "center" }}>
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
            <div className="report-detail-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>
                  {report.subject}
                </h2>
                <span style={{ fontSize: "0.75rem", padding: "4px 10px", borderRadius: "12px", background: report.isRead ? "rgba(16, 185, 129, 0.15)" : "rgba(99, 102, 241, 0.15)", color: report.isRead ? "#10b981" : "#818cf8", border: `1px solid ${report.isRead ? "rgba(16, 185, 129, 0.3)" : "rgba(99, 102, 241, 0.3)"}`, fontWeight: 600 }}>
                  {report.isRead ? "Read" : "Unread"}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.875rem" }}>
                <div>
                  <strong>Student:</strong>{" "}
                  {report.studentId?.nameEnglish || report.studentId?.name || "Student"} ({report.studentId?.admissionNumber || "N/A"})
                </div>
                <div>
                  <strong>Date:</strong>{" "}
                  {report.createdAt ? new Date(report.createdAt).toLocaleString() : "Date"}
                </div>
                <div>
                  <strong>Submitted By:</strong>{" "}
                  {report.senderId?.name ||
                    report.senderId?.fullName ||
                    report.creatorId?.name ||
                    report.creatorId?.fullName ||
                    report.submittedBy?.name ||
                    report.submittedBy ||
                    "Staff"}{" "}
                  ({report.senderId?.role || report.creatorId?.role || "Teacher"})
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="report-detail-body">
              {report.body}
            </div>

            {/* Attachments Section */}
            {report.attachments && Array.isArray(report.attachments) && report.attachments.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "0.875rem", fontWeight: 600 }}>
                  Attachments ({report.attachments.length})
                </h4>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {report.attachments.map((att, idx) => {
                    const fileUrl = typeof att === "string" ? att : att?.url || att?.secure_url || att?.fileUrl || att?.path || "";
                    const fileName = typeof att === "object" ? att?.originalName || att?.name || att?.filename || `Attachment ${idx + 1}` : `Attachment ${idx + 1}`;
                    const isPdf = typeof att === "object" ? att?.format === "pdf" || att?.resource_type === "raw" || fileName.toLowerCase().endsWith(".pdf") || fileUrl.toLowerCase().endsWith(".pdf") : fileUrl.toLowerCase().endsWith(".pdf");

                    return (
                      <div key={att._id || att.public_id || idx} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 14px", borderRadius: "8px", background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)", color: "#818cf8", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}
                          title="View / Open Attachment"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                            {isPdf ? "picture_as_pdf" : "description"}
                          </span>
                          <span>{fileName}</span>
                        </a>
                        {fileUrl && (
                          <a
                            href={fileUrl}
                            download={fileName}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "8px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#f8fafc", textDecoration: "none" }}
                            title="Download Attachment"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>download</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteSingleAttachment(att, idx)}
                          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "8px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", cursor: "pointer" }}
                          title="Delete / Remove Attachment"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions Row */}
            <div className="report-modal-actions">
              <button
                type="button"
                className="report-btn-secondary btn-press"
                onClick={() => setConfirmDeleteOpen(true)}
                style={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
                Delete Report
              </button>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {onEditReport && (
                  <button
                    type="button"
                    className="report-btn-secondary btn-press"
                    onClick={() => {
                      onClose();
                      onEditReport(report);
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>edit</span>
                    Edit Report
                  </button>
                )}

                <button
                  type="button"
                  className="report-btn-secondary btn-press"
                  onClick={handleExportPDF}
                  disabled={exporting}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>picture_as_pdf</span>
                  {exporting ? "Exporting..." : "Export PDF"}
                </button>

                <button
                  type="button"
                  className="report-btn-secondary btn-press"
                  onClick={handleToggleRead}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                    {report.isRead ? "mark_email_unread" : "drafts"}
                  </span>
                  {report.isRead ? "Mark Unread" : "Mark Read"}
                </button>

                <button
                  type="button"
                  className="report-btn-primary btn-press"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Report"
        message="Are you sure you want to delete this report? This action cannot be undone."
        confirmText="Delete Report"
        type="danger"
        loading={deleting}
      />
    </>
  );
}
