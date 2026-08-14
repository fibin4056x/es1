import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import StatCard from "../../components/common/StatCard/StatCard";
import FilterBar from "../../components/common/FilterBar/FilterBar";
import Table from "../../components/common/Table/Table";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import Pagination from "../../components/common/pagination/Pagination";
import ReportComposeModal from "./ReportComposeModal";
import ReportViewModal from "./ReportViewModal";
import {
  getInboxReports,
  getSentReports,
  getSchoolAttendanceReport,
  getMonthlyAttendanceReport,
  getClassAttendanceReport,
  getDivisionAttendanceReport,
} from "../../services/reportService";
import { getClassList } from "../../services/ClassService";
import { getDivisionList } from "../../services/DivisionService";
import { useAuth } from "../../hooks/UseAuth";

import "./Reports.css";


function Reports() {
  const { user } = useAuth();

  // Tab State: "reports" | "analytics"
  const [activeTab, setActiveTab] = useState("reports");

  // Communication Reports State
  const [reportsList, setReportsList] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
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

  // Attendance Analytics Filter States
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [month, setMonth] = useState("all");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");

  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);

  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [reportData, setReportData] = useState({
    todayAttendancePct: 0,
    monthlyAttendancePct: 0,
    totalWorkingDays: 0,
    totalHolidays: 0,
    topClasses: [],
    lowestClasses: [],
    trendData: [],
    divisionComparison: [],
  });

  // Load Filter Options
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [clsRes, divRes] = await Promise.all([
          getClassList().catch(() => ({ data: [] })),
          getDivisionList().catch(() => ({ data: [] })),
        ]);
        const clsList = Array.isArray(clsRes.data) ? clsRes.data : Array.isArray(clsRes) ? clsRes : [];
        const divList = Array.isArray(divRes.data) ? divRes.data : Array.isArray(divRes) ? divRes : [];
        setClasses(clsList);
        setDivisions(divList);
      } catch (err) {
        console.error("Error loading report filters:", err);
        setClasses([]);
        setDivisions([]);
      }
    };
    loadFilters();
  }, []);

  // Fetch Reports List
  const fetchCommunicationReports = useCallback(async () => {
    if (activeTab !== "reports") return;

    setReportsLoading(true);
    try {
      const params = {
        page: reportsPagination.currentPage,
        limit: 15,
        search: reportsSearch.trim() || undefined,
      };

      // Query inbox or sent reports to get list of reports
      let res = null;
      try {
        res = await getInboxReports(params);
      } catch (e) {
        res = await getSentReports(params).catch(() => ({ data: [] }));
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
  }, [activeTab, reportsPagination.currentPage, reportsSearch]);

  useEffect(() => {
    let active = true;
    if (activeTab === "reports") {
      fetchCommunicationReports().then(() => {
        if (!active) return;
      });
    }
    return () => {
      active = false;
    };
  }, [fetchCommunicationReports, activeTab]);

  // Fetch Attendance Analytics
  const fetchAnalytics = useCallback(async () => {
    if (activeTab !== "analytics") return;

    setAnalyticsLoading(true);
    try {
      let resultData = null;

      if (selectedDivision) {
        const res = await getDivisionAttendanceReport(selectedDivision, { month, academicYear });
        resultData = res.data || res;
      } else if (selectedClass) {
        const res = await getClassAttendanceReport(selectedClass, { month, academicYear });
        resultData = res.data || res;
      } else if (month !== "all") {
        const res = await getMonthlyAttendanceReport({
          month,
          year: new Date().getFullYear(),
        });
        resultData = res.data || res;
      } else {
        const res = await getSchoolAttendanceReport();
        resultData = res.data || res;
      }

      if (resultData) {
        const summary = resultData.summary || {};
        const classItems = Array.isArray(resultData.classes)
          ? resultData.classes
          : Array.isArray(resultData.divisions)
          ? resultData.divisions
          : Array.isArray(resultData)
          ? resultData
          : [];

        const dailyItems = Array.isArray(resultData.dailyBreakdown)
          ? resultData.dailyBreakdown
          : Array.isArray(resultData)
          ? resultData
          : [];

        const sortedClasses = [...classItems].sort(
          (a, b) => (b.attendancePercentage || 0) - (a.attendancePercentage || 0)
        );

        setReportData({
          todayAttendancePct: summary.attendancePercentage || 0,
          monthlyAttendancePct: summary.attendancePercentage || 0,
          totalWorkingDays: summary.total || 0,
          totalHolidays: summary.absent || 0,

          topClasses: sortedClasses.slice(0, 5).map((c, i) => ({
            id: c.classId || c.divisionId || i,
            name: c.className || c.divisionName || `Class #${i + 1}`,
            teacher: c.teacherName || "Assigned Teacher",
            totalStudents: c.total || 0,
            attendancePct: c.attendancePercentage || 0,
          })),

          lowestClasses: [...sortedClasses].reverse().slice(0, 5).map((c, i) => ({
            id: c.classId || c.divisionId || i,
            name: c.className || c.divisionName || `Class #${i + 1}`,
            teacher: c.teacherName || "Assigned Teacher",
            totalStudents: c.total || 0,
            attendancePct: c.attendancePercentage || 0,
          })),

          trendData: dailyItems.slice(-7).map((d) => ({
            date: d.date ? new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }) : "Day",
            rate: d.attendancePercentage || 0,
          })),

          divisionComparison: classItems.map((c) => ({
            division: c.className || c.divisionName || "Item",
            rate: c.attendancePercentage || 0,
          })),
        });
      }
    } catch (err) {
      console.warn("Backend report fetch error:", err);
      toast.error(err.response?.data?.message || "Could not fetch report analytics from backend.");
    } finally {
      setAnalyticsLoading(false);
    }
  }, [activeTab, month, selectedClass, selectedDivision]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleOpenReportDetail = (report) => {
    setSelectedReportId(report._id);
    setViewModalOpen(true);
  };

  const handleResetAnalytics = () => {
    setAcademicYear("2025-2026");
    setMonth("all");
    setSelectedClass("");
    setSelectedDivision("");
  };

  const topColumns = [
    { key: "name", title: "Class / Division" },
    { key: "teacher", title: "Class Teacher" },
    { key: "totalStudents", title: "Total Records" },
    {
      key: "attendancePct",
      title: "Attendance Rate",
      render: (val) => (
        <span className="rate-badge rate-high">
          {val}%
        </span>
      ),
    },
  ];

  const lowestColumns = [
    { key: "name", title: "Class / Division" },
    { key: "teacher", title: "Class Teacher" },
    { key: "totalStudents", title: "Total Records" },
    {
      key: "attendancePct",
      title: "Attendance Rate",
      render: (val) => (
        <span className="rate-badge rate-low">
          {val}%
        </span>
      ),
    },
  ];

  return (
    <div className="reports-page animate-fade-in-up">
      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h1 className="page-title">School Reports</h1>
          <p className="page-subtitle">
            View and submit student academic, attendance, and behavioral reports.
          </p>
        </div>
      </div>

      {/* TAB NAVIGATION ROW */}
      <div className="reports-tab-nav">
        <button
          type="button"
          className={`reports-tab-btn ${activeTab === "reports" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("reports");
            setReportsPagination((prev) => ({ ...prev, currentPage: 1 }));
          }}
        >
          <span className="material-symbols-outlined">description</span>
          Reports
        </button>

        <button
          type="button"
          className={`reports-tab-btn ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          <span className="material-symbols-outlined">analytics</span>
          Attendance Analytics
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

      {/* 1. REPORTS VIEW */}
      {activeTab === "reports" && (
        <div className="reports-inbox-card">
          {/* Toolbar & Filters */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
            {/* Search Input */}
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
      )}

      {/* 2. ATTENDANCE ANALYTICS VIEW */}
      {activeTab === "analytics" && (
        <>
          {/* STAT CARDS */}
          <div className="summary-cards-grid">
            <StatCard
              title="Attendance Rate"
              value={`${reportData.todayAttendancePct}%`}
              subtitle="Real-time attendance metric"
              icon="today"
              iconBg="var(--primary-light)"
              iconColor="var(--primary)"
              trend={reportData.todayAttendancePct > 85 ? "+Good" : "-Needs Attention"}
              trendType={reportData.todayAttendancePct > 85 ? "up" : "down"}
              loading={analyticsLoading}
            />
            <StatCard
              title="Monthly Average"
              value={`${reportData.monthlyAttendancePct}%`}
              subtitle="Monthly attendance percentage"
              icon="analytics"
              iconBg="var(--success-light)"
              iconColor="var(--success)"
              loading={analyticsLoading}
            />
            <StatCard
              title="Total Evaluated Records"
              value={reportData.totalWorkingDays}
              subtitle={`Academic Year ${academicYear}`}
              icon="date_range"
              iconBg="var(--warning-light)"
              iconColor="var(--warning)"
              loading={analyticsLoading}
            />
            <StatCard
              title="Total Absent Records"
              value={reportData.totalHolidays}
              subtitle="Unexcused absences"
              icon="event_busy"
              iconBg="rgba(239, 68, 68, 0.15)"
              iconColor="var(--danger)"
              loading={analyticsLoading}
            />
          </div>

          {/* FILTER BAR */}
          <FilterBar
            activeCount={(month !== "all" ? 1 : 0) + (selectedClass ? 1 : 0) + (selectedDivision ? 1 : 0)}
            onReset={handleResetAnalytics}
          >
            <select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
              <option value="2025-2026">2025-2026</option>
              <option value="2024-2025">2024-2025</option>
            </select>

            <select value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="all">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>

            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedDivision("");
              }}
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>{cls.name}</option>
              ))}
            </select>

            <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)}>
              <option value="">All Divisions</option>
              {divisions.map((div) => (
                <option key={div._id} value={div._id}>{div.name}</option>
              ))}
            </select>
          </FilterBar>

          {/* VISUAL CHARTS DASHBOARD */}
          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Attendance Trend (Daily Breakdown)</h3>
                <span className="material-symbols-outlined chart-icon">show_chart</span>
              </div>
              <div className="bar-chart-container">
                {reportData.trendData.length === 0 ? (
                  <p className="no-data-chart">No daily breakdown metrics found for current selection.</p>
                ) : (
                  reportData.trendData.map((item, idx) => (
                    <div key={idx} className="chart-bar-group">
                      <div className="chart-bar-track">
                        <div
                          className="chart-bar-fill fill-primary"
                          style={{ height: `${Math.min(item.rate, 100)}%` }}
                        >
                          <span className="bar-tooltip">{item.rate}%</span>
                        </div>
                      </div>
                      <span className="chart-bar-label">{item.date}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Class / Division Comparison</h3>
                <span className="material-symbols-outlined chart-icon">bar_chart</span>
              </div>
              <div className="bar-chart-container">
                {reportData.divisionComparison.length === 0 ? (
                  <p className="no-data-chart">No breakdown metrics found for current selection.</p>
                ) : (
                  reportData.divisionComparison.map((item, idx) => (
                    <div key={idx} className="chart-bar-group">
                      <div className="chart-bar-track">
                        <div
                          className="chart-bar-fill fill-success"
                          style={{ height: `${Math.min(item.rate, 100)}%` }}
                        >
                          <span className="bar-tooltip">{item.rate}%</span>
                        </div>
                      </div>
                      <span className="chart-bar-label">{item.division}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* TABLES */}
          <div className="tables-grid">
            <div className="table-card">
              <div className="table-card-header">
                <span className="material-symbols-outlined header-icon icon-success">workspace_premium</span>
                <h3>Highest Attendance Performance</h3>
              </div>
              {reportData.topClasses.length === 0 ? (
                <EmptyState title="No class rankings" description="Record attendance to see performance rankings." />
              ) : (
                <Table columns={topColumns} data={reportData.topClasses} />
              )}
            </div>

            <div className="table-card">
              <div className="table-card-header">
                <span className="material-symbols-outlined header-icon icon-warning">report_problem</span>
                <h3>Lowest Attendance Performance</h3>
              </div>
              {reportData.lowestClasses.length === 0 ? (
                <EmptyState title="No class rankings" description="Record attendance to see performance rankings." />
              ) : (
                <Table columns={lowestColumns} data={reportData.lowestClasses} />
              )}
            </div>
          </div>
        </>
      )}

      {/* COMPOSE REPORT MODAL */}
      <ReportComposeModal
        isOpen={composeOpen}
        onClose={() => setComposeOpen(false)}
        onReportSent={fetchCommunicationReports}
      />

      {/* VIEW REPORT MODAL */}
      <ReportViewModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedReportId(null);
        }}
        reportId={selectedReportId}
        onReportDeleted={fetchCommunicationReports}
      />
    </div>
  );
}

export default Reports;
