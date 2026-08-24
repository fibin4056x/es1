import "./Dashboard.css";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../services/dashboardService";
import { getUpcomingEvents } from "../../services/academicCalendarService";
import StatCard from "./StatCard";
import AttendanceChart from "./AttendanceChart";
import RecentTeachers from "./RecentTeachers";
import RecentStudents from "./RecentStudents";
import { useAuth } from "../../hooks/UseAuth";
import Loader from "../../components/common/Loader/Loader";
import { getApiErrorMessage } from "../../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPrincipal = user?.role === "principal";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    attendance: {
      totalStudents: 0,
      present: 0,
      absent: 0,
      late: 0,
      percentage: 0,
    },
    attendanceChart: {
      weekly: [],
      monthly: [],
    },
    recentTeachers: [],
    recentStudents: [],
  });

  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [res, eventsRes] = await Promise.all([
        getDashboardStats().catch((err) => {
          console.error("Dashboard Stats API error:", err);
          return { data: null, error: err };
        }),
        getUpcomingEvents(5).catch((err) => {
          console.error("Upcoming Events API error:", err);
          return { data: [] };
        }),
      ]);

      if (res.data) {
        setStats(res.data);
      } else if (res.error && (isPrincipal || res.error?.response?.status !== 403)) {
        setError(getApiErrorMessage(res.error, "Failed to load dashboard statistics from server."));
      }

      setUpcomingEvents(eventsRes.data || eventsRes || []);
    } catch (err) {
      console.error("Dashboard Global Error:", err);
      setError(getApiErrorMessage(err, "An error occurred while loading the dashboard."));
    } finally {
      setLoading(false);
    }
  }, [isPrincipal]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="dashboard-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <Loader size="large" text="Fetching institution statistics..." />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Dashboard Top Header Section */}
      <div className="dashboard-header-section animate-fade-in-up">
        <div className="dashboard-title-group">
          <h2>Welcome Back, {user?.name || "User"} 👋</h2>
          <p>Here's today's real-time overview of your institution.</p>
        </div>
        <div className="header-actions">
          <button className="date-filter-btn btn-press" type="button">
            <span className="material-symbols-outlined">calendar_today</span>
            <span>{today}</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
            padding: "16px 20px",
            borderRadius: "12px",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="material-symbols-outlined">warning</span>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchDashboard}
            style={{
              background: "rgba(239, 68, 68, 0.25)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#ffffff",
              padding: "6px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* QUICK ACTIONS BANNER */}
      <div className="quick-actions-bar">
        <span className="quick-label">Quick Actions:</span>
        <button
          type="button"
          className="quick-action-btn"
          onClick={() => navigate("/attendance")}
        >
          <span className="material-symbols-outlined">how_to_reg</span>
          Mark Attendance
        </button>

        <button
          type="button"
          className="quick-action-btn"
          onClick={() => navigate("/academic-calendar")}
        >
          <span className="material-symbols-outlined">event</span>
          Academic Calendar
        </button>

        <button
          type="button"
          className="quick-action-btn"
          onClick={() => navigate("/students")}
        >
          <span className="material-symbols-outlined">group_add</span>
          Manage Students
        </button>

        <button
          type="button"
          className="quick-action-btn"
          onClick={() => navigate("/reports")}
        >
          <span className="material-symbols-outlined">insights</span>
          View Reports
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="cards-grid">
        <StatCard
          title="Total Students"
          value={stats.students ?? stats.studentStats?.total ?? stats.studentStats?.active ?? 0}
          icon="groups"
          trendText={stats.studentsTrend ? `${stats.studentsTrend}%` : null}
          trendType={stats.studentsTrend ? (stats.studentsTrend > 0 ? "up" : "down") : null}
          variant="primary"
        />

        <StatCard
          title="Total Teachers"
          value={stats.teachers ?? stats.teacherStats?.total ?? stats.teacherStats?.active ?? 0}
          icon="school"
          trendText={stats.teachersTrend ? `${stats.teachersTrend}%` : null}
          trendType={stats.teachersTrend ? (stats.teachersTrend > 0 ? "up" : "down") : null}
          variant="secondary"
        />

        <StatCard
          title="Total Classes"
          value={stats.classes || 0}
          icon="class"
          variant="blue"
        />

        <StatCard
          title="Attendance Rate"
          value={stats.attendance?.percentage || 0}
          isPercentage={true}
          icon="verified"
          variant="success"
        />
      </div>

      {/* Main Grid: Chart & Activity / Upcoming Events */}
      <div className={`dashboard-body-grid ${!isPrincipal ? "teacher-dashboard" : ""}`}>
        <div className="chart-column">
          <AttendanceChart
            weekly={stats.attendanceChart?.weekly || []}
            monthly={stats.attendanceChart?.monthly || []}
          />
        </div>

        {/* SIDEBAR WIDGET: UPCOMING EVENTS & RECENT TEACHERS */}
        <div className="activity-column">
          {/* UPCOMING HOLIDAYS & EVENTS CARD */}
          <div className="dashboard-events-card">
            <div className="card-header-sm">
              <span className="material-symbols-outlined">event_note</span>
              <h3>Upcoming Holidays & Events</h3>
            </div>

            <div className="dash-events-list">
              {upcomingEvents.length === 0 ? (
                <p className="no-events-sm">No upcoming events scheduled.</p>
              ) : (
                upcomingEvents.slice(0, 4).map((ev) => {
                  const evDate = ev.startDate ? new Date(ev.startDate) : null;
                  const dayNum = evDate ? evDate.getDate() : "-";
                  const monthName = evDate
                    ? evDate.toLocaleString("default", { month: "short" })
                    : "Event";

                  return (
                    <div key={ev._id || ev.id} className="dash-event-item">
                      <div className="event-date-pill">
                        <span>{dayNum}</span>
                        <small>{monthName}</small>
                      </div>
                      <div className="event-item-info">
                        <h4>{ev.title}</h4>
                        <span className={`badge-cat category-${ev.category || "event"}`}>
                          {ev.category || "Event"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {isPrincipal && (
            <RecentTeachers teachers={stats.recentTeachers || []} />
          )}
        </div>
      </div>

      {/* Bottom Enrollment Table */}
      <RecentStudents students={stats.recentStudents || []} />
    </div>
  );
}

export default Dashboard;
