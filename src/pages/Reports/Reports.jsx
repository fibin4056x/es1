import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import Pagination from "../../components/common/pagination/Pagination";
import ReportComposeModal from "./ReportComposeModal";
import ReportViewModal from "./ReportViewModal";
import { getReports, getInboxReports, getSentReports } from "../../services/reportService";
import { useAuth } from "../../hooks/UseAuth";
import { exportReportsListPDF } from "../../util/pdfExport";

import "./Reports.css";

function Reports() {
  const { user } = useAuth();

  // Communication Reports State
  const [reportsList, setReportsList] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [reportsPagination, setReportsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
  });
  const [reportsSearch, setReportsSearch] = useState("");

  // Modals
  const [composeOpen, setComposeOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const handleExportPDF = () => {
    if (reportsList.length === 0) {
      toast.warning("No reports available to export.");
      return;
    }
    try {
      setIsExporting(true);
      exportReportsListPDF(reportsList, reportsSearch);
      toast.success("PDF report generated successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF document.");
    } finally {
      setIsExporting(false);
    }
  };

  // Fetch Reports List
  const fetchReports = useCallback(async () => {
    setReportsLoading(true);
    try {
      const params = {
        page: reportsPagination.currentPage,
        limit: 15,
        search: reportsSearch.trim() || undefined,
      };

      // Query main reports endpoint with inbox/sent fallbacks
      let res = null;
      try {
        res = await getReports(params);
      } catch {
        try {
          res = await getInboxReports(params);
        } catch {
          res = await getSentReports(params).catch(() => ({ data: [] }));
        }
      }

      let items = Array.isArray(res?.data?.items)
        ? res.data.items
        : Array.isArray(res?.items)
        ? res.items
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];

      if (items.length === 0) {
        const sentRes = await getSentReports(params).catch(() => ({ data: [] }));
        const sentItems = Array.isArray(sentRes?.data?.items)
          ? sentRes.data.items
          : Array.isArray(sentRes?.items)
          ? sentRes.items
          : Array.isArray(sentRes?.data)
          ? sentRes.data
          : Array.isArray(sentRes)
          ? sentRes
          : [];
        if (sentItems.length > 0) items = sentItems;
      }

      const pag = res?.data?.pagination || res?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalRecords: items.length,
      };

      setReportsList(items);
      setReportsPagination({
        currentPage: pag.currentPage || 1,
        totalPages: pag.totalPages || 1,
        totalRecords: pag.totalRecords || items.length,
      });
    } catch (err) {
      console.error("Fetch reports error:", err);
      toast.error(err.response?.data?.message || "Failed to fetch reports.");
      setReportsList([]);
    } finally {
      setReportsLoading(false);
    }
  }, [reportsPagination.currentPage, reportsSearch]);

  useEffect(() => {
    let active = true;
    fetchReports().then(() => {
      if (!active) return;
    });
    return () => {
      active = false;
    };
  }, [fetchReports]);

  const handleOpenReportDetail = (report) => {
    setSelectedReportId(report._id);
    setViewModalOpen(true);
  };

  return (
    <div className="reports-page animate-fade-in-up">
      {/* PAGE HEADER */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 className="page-title">School Reports</h1>
          <p className="page-subtitle">
            View and submit student academic, attendance, and behavioral reports.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            className="btn-press"
            onClick={handleExportPDF}
            disabled={isExporting || reportsList.length === 0}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              borderRadius: "8px",
              background: "var(--surface-light, #1e293b)",
              color: "var(--text-main, #f8fafc)",
              border: "1px solid var(--border-main, rgba(255, 255, 255, 0.12))",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>picture_as_pdf</span>
            {isExporting ? "Exporting..." : "Export PDF"}
          </button>
          <button
            type="button"
            className="reports-tab-btn compose-tab-btn btn-press"
            onClick={() => setComposeOpen(true)}
          >
            <span className="material-symbols-outlined">add</span>
            Create Report
          </button>
        </div>
      </div>

      {/* REPORTS LIST CONTAINER */}
      <div className="reports-inbox-card">
        {/* Toolbar & Search */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <div className="students-search-wrapper" style={{ flex: 1, minWidth: "260px" }}>
            <span className="material-symbols-outlined">search</span>
            <input
              type="search"
              className="students-search-input"
              placeholder="Search report subject or student..."
              value={reportsSearch}
              onChange={(e) => {
                setReportsSearch(e.target.value);
                setReportsPagination((prev) => ({ ...prev, currentPage: 1 }));
              }}
            />
          </div>
        </div>

        {/* Reports List Table */}
        {reportsLoading ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8" }}>
            <div className="login-loading-spinner" style={{ margin: "0 auto 12px" }}></div>
            Loading reports...
          </div>
        ) : reportsList.length === 0 ? (
          <EmptyState
            title="No reports submitted yet"
            description="Click '+ Create Report' to submit a report for a student."
          />
        ) : (
          <div className="table-responsive">
            <table className="reports-list-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Submitted By</th>
                  <th>Date</th>
                  <th>Attachment</th>
                </tr>
              </thead>
              <tbody>
                {reportsList.map((r) => {
                  const studentName = r.studentId?.nameEnglish || r.studentId?.name || "Student";
                  const submittedBy =
                    r.senderId?.name ||
                    r.senderId?.fullName ||
                    r.creatorId?.name ||
                    r.creatorId?.fullName ||
                    r.submittedBy?.name ||
                    r.submittedBy ||
                    (user?.role === "teacher" ? user.name : "Teacher");

                  return (
                    <tr
                      key={r._id}
                      className="reports-list-row"
                      onClick={() => handleOpenReportDetail(r)}
                    >
                      <td>
                        <strong style={{ color: "#ffffff" }}>{studentName}</strong>
                      </td>
                      <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.subject || r.title || "No Subject"}
                      </td>
                      <td>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#818cf8" }}>person</span>
                          <span>{submittedBy}</span>
                        </span>
                      </td>
                      <td style={{ color: "#94a3b8", fontSize: "0.8125rem" }}>
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                      </td>
                      <td>
                        {r.attachments && r.attachments.length > 0 ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 8px", background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)", borderRadius: "6px", fontSize: "0.75rem", color: "#818cf8" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>attach_file</span>
                            <span>{r.attachments.length > 1 ? `${r.attachments.length} Files` : "PDF"}</span>
                          </span>
                        ) : (
                          <span style={{ color: "#64748b", fontSize: "0.75rem" }}>None</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {reportsPagination.totalPages > 1 && (
          <div style={{ marginTop: "16px" }}>
            <Pagination
              currentPage={reportsPagination.currentPage}
              totalPages={reportsPagination.totalPages}
              setCurrentPage={(page) =>
                setReportsPagination((prev) => ({ ...prev, currentPage: page }))
              }
            />
          </div>
        )}
      </div>

      {/* COMPOSE REPORT MODAL */}
      <ReportComposeModal
        isOpen={composeOpen}
        onClose={() => setComposeOpen(false)}
        onReportSent={fetchReports}
      />

      {/* VIEW REPORT MODAL */}
      <ReportViewModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedReportId(null);
        }}
        reportId={selectedReportId}
        onReportDeleted={fetchReports}
      />
    </div>
  );
}

export default Reports;
