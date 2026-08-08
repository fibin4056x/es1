import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import StatCard from "../../components/common/StatCard/StatCard";
import FilterBar from "../../components/common/FilterBar/FilterBar";
import Table from "../../components/common/Table/Table";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import {
  getSchoolAttendanceReport,
  getMonthlyAttendanceReport,
  getClassAttendanceReport,
  getDivisionAttendanceReport,
} from "../../services/reportService";
import { getClassList } from "../../services/ClassService";
import { getDivisionList } from "../../services/DivisionService";
import { getTeacherList } from "../../services/TeacherService";
import { useAuth } from "../../hooks/UseAuth";

import "./Reports.css";

function Reports() {
  const { user } = useAuth();
  const isPrincipal = user?.role === "principal";

  // Filter States
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [month, setMonth] = useState("all");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(true);
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
        const [clsRes, divRes, teachRes] = await Promise.all([
          getClassList().catch(() => ({ data: [] })),
          getDivisionList().catch(() => ({ data: [] })),
          getTeacherList().catch(() => ({ data: [] })),
        ]);
        setClasses(clsRes.data || clsRes || []);
        setDivisions(divRes.data || divRes || []);
        setTeachers(teachRes.data || teachRes || []);
      } catch (err) {
        console.error("Error loading report filters:", err);
      }
    };
    loadFilters();
  }, []);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      let resultData = null;

      // 1. Division Level Report if division selected
      if (selectedDivision) {
        const res = await getDivisionAttendanceReport(selectedDivision);
        resultData = res.data || res;
      }
      // 2. Class Level Report if class selected
      else if (selectedClass) {
        const res = await getClassAttendanceReport(selectedClass);
        resultData = res.data || res;
      }
      // 3. Monthly Report if month selected
      else if (month !== "all") {
        const res = await getMonthlyAttendanceReport({
          month,
          year: new Date().getFullYear(),
        });
        resultData = res.data || res;
      }
      // 4. School Overall Report (Default)
      else {
        const res = await getSchoolAttendanceReport();
        resultData = res.data || res;
      }

      if (resultData) {
        const summary = resultData.summary || {};
        const classItems = resultData.classes || resultData.divisions || [];
        const dailyItems = resultData.dailyBreakdown || [];

        // Sort top and lowest classes
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
      toast.error(err.response?.data?.message || "Could not fetch report data from backend.");
    } finally {
      setLoading(false);
    }
  }, [academicYear, month, selectedClass, selectedDivision, selectedTeacher]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const activeCount =
    (month !== "all" ? 1 : 0) +
    (selectedClass ? 1 : 0) +
    (selectedDivision ? 1 : 0) +
    (selectedTeacher ? 1 : 0);

  const handleReset = () => {
    setAcademicYear("2025-2026");
    setMonth("all");
    setSelectedClass("");
    setSelectedDivision("");
    setSelectedTeacher("");
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
    <div className="reports-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Enterprise Reports & Analytics</h1>
          <p className="page-subtitle">
            Comprehensive attendance statistics, division comparison, and performance rankings.
          </p>
        </div>
      </div>

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
          loading={loading}
        />
        <StatCard
          title="Monthly Average"
          value={`${reportData.monthlyAttendancePct}%`}
          subtitle="Monthly attendance percentage"
          icon="analytics"
          iconBg="var(--success-light)"
          iconColor="var(--success)"
          loading={loading}
        />
        <StatCard
          title="Total Evaluated Records"
          value={reportData.totalWorkingDays}
          subtitle={`Academic Year ${academicYear}`}
          icon="date_range"
          iconBg="var(--warning-light)"
          iconColor="var(--warning)"
          loading={loading}
        />
        <StatCard
          title="Total Absent Records"
          value={reportData.totalHolidays}
          subtitle="Unexcused absences"
          icon="event_busy"
          iconBg="rgba(239, 68, 68, 0.15)"
          iconColor="var(--danger)"
          loading={loading}
        />
      </div>

      {/* FILTER BAR */}
      <FilterBar activeCount={activeCount} onReset={handleReset}>
        <select
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
        >
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
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>

        <select
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
        >
          <option value="">All Divisions</option>
          {divisions.map((div) => (
            <option key={div._id} value={div._id}>
              {div.name}
            </option>
          ))}
        </select>

        {isPrincipal && (
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            <option value="">All Teachers</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name || t.fullName}
              </option>
            ))}
          </select>
        )}
      </FilterBar>

      {/* VISUAL CHARTS DASHBOARD */}
      <div className="charts-grid">
        {/* ATTENDANCE TREND CHART CARD */}
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
                      title={`${item.date}: ${item.rate}%`}
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

        {/* DIVISION COMPARISON CHART CARD */}
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
                      title={`${item.division}: ${item.rate}%`}
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

      {/* TABLES: TOP & LOWEST ATTENDANCE */}
      <div className="tables-grid">
        <div className="table-card">
          <div className="table-card-header">
            <span className="material-symbols-outlined header-icon icon-success">
              workspace_premium
            </span>
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
            <span className="material-symbols-outlined header-icon icon-warning">
              report_problem
            </span>
            <h3>Lowest Attendance Performance</h3>
          </div>
          {reportData.lowestClasses.length === 0 ? (
            <EmptyState title="No class rankings" description="Record attendance to see performance rankings." />
          ) : (
            <Table columns={lowestColumns} data={reportData.lowestClasses} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;
