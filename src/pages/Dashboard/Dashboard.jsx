import "./Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../services/dashboardService";
import { getUpcomingEvents } from "../../services/academicCalendarService";
import StatCard from "./StatCard";
import AttendanceChart from "./AttendanceChart";
import RecentTeachers from "./RecentTeachers";
import RecentStudents from "./RecentStudents";
import { useAuth } from "../../hooks/UseAuth";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPrincipal = user?.role === "principal";

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

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const [res, eventsRes] = await Promise.all([
          getDashboardStats().catch(() => ({ data: {} })),
          getUpcomingEvents(5).catch(() => ({ data: [] })),
        ]);

        if (isMounted) {
          if (res.data) setStats(res.data);
          setUpcomingEvents(eventsRes.data || eventsRes || []);
        }
      } catch (error) {
        console.error("Dashboard Error:", error);
      }
    };

    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, []);


  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="dashboard-page">
      {/* Dashboard Top Header Section */}
      <div className="dashboard-header-section animate-fade-in-up">
        <div className="dashboard-title-group">
          <h2>Welcome Back, {user?.name || "User"} 👋</h2>
          <p>Here's today's overview of your institution.</p>
        </div>
        <div className="header-actions">
          <button className="date-filter-btn btn-press">
            <span className="material-symbols-outlined">calendar_today</span>
            <span>{today}</span>
          </button>
        </div>
      </div>

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
          value={stats.students}
          icon="groups"
          trendText="+12.5%"
          trendType="up"
          variant="primary"
        />

        <StatCard
          title="Total Teachers"
          value={stats.teachers}
          icon="school"
          trendText="+4.2%"
          trendType="up"
          variant="secondary"
        />

        <StatCard
          title="Total Classes"
          value={stats.classes}
          icon="class"
          trendText="0%"
          trendType="neutral"
          variant="blue"
        />

        <StatCard
          title="Attendance Rate"
          value={stats.attendance?.percentage || 0}
          isPercentage={true}
          icon="verified"
          trendText="+1.2%"
          trendType="up"
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
                <p className="no-events-sm">No upcoming events this week.</p>
              ) : (
                upcomingEvents.slice(0, 4).map((ev) => (
                  <div key={ev._id} className="dash-event-item">
                    <div className="event-date-pill">
                      <span>{new Date(ev.startDate).getDate()}</span>
                      <small>
                        {new Date(ev.startDate).toLocaleString("default", {
                          month: "short",
                        })}
                      </small>
                    </div>
                    <div className="event-item-info">
                      <h4>{ev.title}</h4>
                      <span className={`badge-cat category-${ev.category}`}>
                        {ev.category}
                      </span>
                    </div>
                  </div>
                ))
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
