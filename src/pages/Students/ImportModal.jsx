/* eslint-disable */
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { downloadImportTemplate, importStudents } from "../../services/importService";

function ImportModal({ open, onClose, reload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [importSummary, setImportSummary] = useState(null);

  const fileInputRef = useRef(null);

  if (!open) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const isAllowed = selectedFile.name.match(/\.(csv|xlsx|xls)$/i);
      if (!isAllowed) {
        toast.error("Only CSV and Excel (.xlsx, .xls) files are supported.");
        return;
      }
      setFile(selectedFile);
      setImportSummary(null);
    }
  };

  const handleDownloadTemplate = async (format) => {
    setDownloadingTemplate(true);
    try {
      await downloadImportTemplate(format);
      toast.success(`Downloaded ${format.toUpperCase()} import template.`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download import template.");
    } finally {
      setDownloadingTemplate(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.warning("Please select a file to import.");
      return;
    }

    setLoading(true);
    setImportSummary(null);

    try {
      const res = await importStudents(file);
      const summaryData = res.data || res;
      setImportSummary(summaryData);
      toast.success("Student import completed successfully!");

      if (reload) {
        reload();
      }
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || "Failed to import students.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setImportSummary(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "var(--surface, #18181b)",
          border: "1px solid var(--border-main, rgba(255, 255, 255, 0.12))",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "var(--text-main, #f8fafc)" }}>
              Import Students
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--text-muted, #94a3b8)" }}>
              Upload CSV or Excel files to bulk add students.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted, #94a3b8)",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Template Download Section */}
        <div
          style={{
            background: "var(--surface-light, rgba(255, 255, 255, 0.04))",
            border: "1px dashed var(--border-main, rgba(255, 255, 255, 0.15))",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary, #cbd5e1)", marginBottom: "8px" }}>
            1. Download Sample Import Template:
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={() => handleDownloadTemplate("csv")}
              disabled={downloadingTemplate}
              style={templateBtnStyle}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#10b981" }}>csv</span>
              Template (.csv)
            </button>
            <button
              type="button"
              onClick={() => handleDownloadTemplate("xlsx")}
              disabled={downloadingTemplate}
              style={templateBtnStyle}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#3b82f6" }}>table_chart</span>
              Template (.xlsx)
            </button>
          </div>
        </div>

        {/* File Upload Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary, #cbd5e1)", marginBottom: "8px" }}>
              2. Select File to Upload:
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="student-file-input"
            />

            <label
              htmlFor="student-file-input"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "24px",
                borderRadius: "12px",
                border: "2px dashed #3b82f6",
                background: "rgba(59, 130, 246, 0.05)",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "#3b82f6" }}>
                upload_file
              </span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main, #f8fafc)" }}>
                {file ? file.name : "Click to select CSV or Excel file"}
              </span>
              {file && (
                <span style={{ fontSize: "12px", color: "var(--text-muted, #94a3b8)" }}>
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              )}
            </label>
          </div>

          {/* Import Summary Details */}
          {importSummary && (
            <div
              style={{
                background: importSummary.failedCount > 0 ? "rgba(239, 68, 68, 0.08)" : "rgba(16, 185, 129, 0.08)",
                border: `1px solid ${importSummary.failedCount > 0 ? "rgba(239, 68, 68, 0.25)" : "rgba(16, 185, 129, 0.2)"}`,
                borderRadius: "10px",
                padding: "14px",
                fontSize: "13px",
                color: importSummary.failedCount > 0 ? "#f87171" : "#10b981",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "6px" }}>Import Results</div>
              <div>Total Rows: {importSummary.totalRows ?? importSummary.totalProcessed ?? 0}</div>
              <div style={{ color: "#10b981", fontWeight: 600 }}>Successfully Added: {importSummary.successCount ?? 0}</div>
              {importSummary.failedCount > 0 && (
                <div style={{ color: "#ef4444", fontWeight: 600, marginTop: "2px" }}>
                  Failed: {importSummary.failedCount}
                </div>
              )}

              {/* Detailed Error List */}
              {importSummary.errors && importSummary.errors.length > 0 && (
                <div style={{ marginTop: "12px", borderTop: "1px solid rgba(239, 68, 68, 0.2)", paddingTop: "8px" }}>
                  <div style={{ fontWeight: 700, marginBottom: "6px", color: "#f87171", fontSize: "12px" }}>
                    Failure Reasons:
                  </div>
                  <div style={{ maxHeight: "140px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {importSummary.errors.map((err, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "rgba(0, 0, 0, 0.3)",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          color: "#fca5a5",
                        }}
                      >
                        <strong>Row {err.row}</strong> (Adm: {err.admissionNumber}): {err.reason}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                background: "transparent",
                color: "var(--text-secondary, #cbd5e1)",
                border: "1px solid var(--border-main, rgba(255,255,255,0.12))",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !file}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                background: "#3b82f6",
                color: "#ffffff",
                border: "none",
                cursor: loading || !file ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: 600,
                opacity: loading || !file ? 0.6 : 1,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {loading && <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>progress_activity</span>}
              {loading ? "Importing..." : "Upload & Import"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const templateBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 14px",
  borderRadius: "8px",
  background: "var(--surface-light, #27272a)",
  color: "var(--text-main, #f8fafc)",
  border: "1px solid var(--border-main, rgba(255, 255, 255, 0.12))",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
};

export default ImportModal;
