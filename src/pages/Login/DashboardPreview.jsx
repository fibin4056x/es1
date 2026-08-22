import { useEffect, useState } from "react";
import api from "../../services/api";
import "./DashboardPreview.css";

function DashboardPreview() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchPreview = async () => {
      try {
        // Public dashboard preview endpoint.
        // Do NOT use /dashboard/stats here.
        const response = await api.get("/dashboard/preview");

        const data =
          response?.data?.data ??
          response?.data ??
          null;

        if (mounted) {
          setDashboard(data);
        }
      } catch (error) {
        console.error("Dashboard preview failed:", error);

        if (mounted) {
          setDashboard(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPreview();

    return () => {
      mounted = false;
    };
  }, []);

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div className="dashboard-preview dashboard-preview-loading">
        <aside className="preview-sidebar">
          <div className="preview-logo">
            <span className="preview-logo-mark">E</span>
          </div>

          <div className="sidebar-item active">
            <span />
          </div>

          <div className="sidebar-item">
            <span />
          </div>

          <div className="sidebar-item">
            <span />
          </div>

          <div className="sidebar-item">
            <span />
          </div>

          <div className="sidebar-item">
            <span />
          </div>
        </aside>

        <section className="preview-content">
          <header className="preview-navbar">
            <div className="preview-page-title">
              Dashboard
            </div>

            <div className="preview-navbar-right">
              <div className="nav-search">
                <span />
              </div>

              <div className="nav-avatar">
                A
              </div>
            </div>
          </header>

          <div className="preview-cards">
            <div className="card preview-skeleton" />
            <div className="card preview-skeleton" />
            <div className="card preview-skeleton" />
            <div className="card preview-skeleton" />
          </div>

          <div className="preview-table preview-skeleton-table">
            <div className="table-header" />
            <div className="table-row" />
            <div className="table-row" />
            <div className="table-row" />
          </div>
        </section>
      </div>
    );
  }

  /* ============================================================
     ERROR
  ============================================================ */

  if (!dashboard) {
    return (
      <div className="dashboard-preview dashboard-preview-error">
        <div className="preview-error-content">
          <span className="preview-error-icon">!</span>

          <p>
            Dashboard preview unavailable
          </p>
        </div>
      </div>
    );
  }

  /* ============================================================
     EXACT BACKEND DATA
     
     Backend:
       studentsCount
       teachersCount
       classesCount
       attendance
       studentsList
       classesSchedule
       activityLogs
  ============================================================ */

  const students =
    Number.isFinite(Number(dashboard.studentsCount))
      ? Number(dashboard.studentsCount)
      : 0;

  const teachers =
    Number.isFinite(Number(dashboard.teachersCount))
      ? Number(dashboard.teachersCount)
      : 0;

  const classes =
    Number.isFinite(Number(dashboard.classesCount))
      ? Number(dashboard.classesCount)
      : 0;

  /*
   * Backend currently returns attendance.percentage = null
   * for the public preview.
   *
   * Therefore DO NOT invent/fake an attendance percentage.
   */
  const attendancePercentage =
    dashboard.attendance?.percentage;

  const studentsList =
    Array.isArray(dashboard.studentsList)
      ? dashboard.studentsList
      : [];

  const classesSchedule =
    Array.isArray(dashboard.classesSchedule)
      ? dashboard.classesSchedule
      : [];

  const activityLogs =
    Array.isArray(dashboard.activityLogs)
      ? dashboard.activityLogs
      : [];

  return (
    <div className="dashboard-preview">

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside className="preview-sidebar">

        <div className="preview-logo">
          <span className="preview-logo-mark">
            E
          </span>
        </div>

        <div
          className="sidebar-item active"
          aria-label="Dashboard"
        >
          <span />
        </div>

        <div
          className="sidebar-item"
          aria-label="Teachers"
        >
          <span />
        </div>

        <div
          className="sidebar-item"
          aria-label="Students"
        >
          <span />
        </div>

        <div
          className="sidebar-item"
          aria-label="Classes"
        >
          <span />
        </div>

        <div
          className="sidebar-item"
          aria-label="Attendance"
        >
          <span />
        </div>

      </aside>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <section className="preview-content">

        {/* ====================================================
            NAVBAR
        ==================================================== */}

        <header className="preview-navbar">

          <div className="preview-page-title">
            Dashboard
          </div>

          <div className="preview-navbar-right">

            <div
              className="nav-search"
              aria-hidden="true"
            >
              <span />
            </div>

            <div
              className="nav-avatar"
              aria-label="Admin"
            >
              A
            </div>

          </div>

        </header>

        {/* ====================================================
            STATISTICS
        ==================================================== */}

        <div className="preview-cards">

          <div className="card">
            <div className="card-label">
              Students
            </div>

            <div className="card-value">
              {students}
            </div>

            <div className="card-indicator" />
          </div>

          <div className="card">
            <div className="card-label">
              Teachers
            </div>

            <div className="card-value">
              {teachers}
            </div>

            <div className="card-indicator" />
          </div>

          <div className="card">
            <div className="card-label">
              Classes
            </div>

            <div className="card-value">
              {classes}
            </div>

            <div className="card-indicator" />
          </div>

          <div className="card">
            <div className="card-label">
              Attendance
            </div>

            <div className="card-value">
              {attendancePercentage !== null &&
              attendancePercentage !== undefined
                ? `${attendancePercentage}%`
                : "—"}
            </div>

            <div className="card-indicator" />
          </div>

        </div>

        {/* ====================================================
            DATA AREA
        ==================================================== */}

        <div className="preview-table">

          <div className="table-header">
            <span>
              School Overview
            </span>

            <span>
              Live Data
            </span>
          </div>

          {/* STUDENTS */}

          <div className="table-row">
            <span>
              Total Students
            </span>

            <strong>
              {students}
            </strong>
          </div>

          {/* TEACHERS */}

          <div className="table-row">
            <span>
              Active Teachers
            </span>

            <strong>
              {teachers}
            </strong>
          </div>

          {/* CLASSES */}

          <div className="table-row">
            <span>
              Active Classes
            </span>

            <strong>
              {classes}
            </strong>
          </div>

          {/* ATTENDANCE */}

          <div className="table-row">
            <span>
              Today's Attendance
            </span>

            <strong>
              {attendancePercentage !== null &&
              attendancePercentage !== undefined
                ? `${attendancePercentage}%`
                : "—"}
            </strong>
          </div>

        </div>

        {/* ====================================================
            REAL STUDENT PREVIEW DATA
        ==================================================== */}

        {studentsList.length > 0 && (
          <div className="preview-table preview-secondary-table">

            <div className="table-header">
              <span>
                Recent Students
              </span>

              <span>
                Live Data
              </span>
            </div>

            {studentsList.map((student, index) => (
              <div
                className="table-row"
                key={
                  student?._id ||
                  student?.id ||
                  `${student?.name}-${index}`
                }
              >
                <span>
                  {student?.name || "Student"}
                </span>

                <strong>
                  {student?.grade || "—"}
                </strong>
              </div>
            ))}

          </div>
        )}

        {/* ====================================================
            REAL CLASS SCHEDULE
        ==================================================== */}

        {classesSchedule.length > 0 && (
          <div className="preview-table preview-secondary-table">

            <div className="table-header">
              <span>
                Class Schedule
              </span>

              <span>
                Live Data
              </span>
            </div>

            {classesSchedule.map((item, index) => (
              <div
                className="table-row"
                key={`${item?.time}-${index}`}
              >
                <span>
                  {item?.subject || "Class"}
                </span>

                <strong>
                  {item?.time || "—"}
                </strong>
              </div>
            ))}

          </div>
        )}

        {/* ====================================================
            ACTIVITY
        ==================================================== */}

        {activityLogs.length > 0 && (
          <div className="preview-table preview-secondary-table">

            <div className="table-header">
              <span>
                Recent Activity
              </span>

              <span>
                Live Data
              </span>
            </div>

            {activityLogs.slice(0, 3).map((activity, index) => (
              <div
                className="table-row"
                key={index}
              >
                <span>
                  {activity?.message ||
                    activity?.text ||
                    "Activity"}
                </span>

                <strong>
                  {activity?.time || ""}
                </strong>
              </div>
            ))}

          </div>
        )}

      </section>
    </div>
  );
}

export default DashboardPreview;