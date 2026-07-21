import "./Dashboard.css";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/dashboardService";
import StatCard from "./StatCard";
import AttendanceChart from "./AttendanceChart";
import RecentTeachers from "./RecentTeachers";
import RecentStudents from "./RecentStudents";
import {useAuth} from "../../context/AuthContext"
function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    attendance: 0,
  });
  const { user } = useAuth();
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getDashboardStats();

      console.log("Dashboard Response:", res);
      console.log("Dashboard Data:", res.data);

      setStats(res.data);
    } catch (error) {
      console.error("Dashboard Error:", error.response?.data || error.message);
    }
  };

  console.log("Stats State:", stats);

  return (
    <div className="dashboard-page">
      {/* Dashboard Top Header Section */}
      <div className="dashboard-header-section animate-fade-in-up">
        <div className="dashboard-title-group">
          <h2>Welcome Back, {user?.name || "User"} 👋</h2>
          <p>Here's today's overview of your institution.</p>
        </div>
        <div>
          <button className="date-filter-btn btn-press">
            <span className="material-symbols-outlined">calendar_today</span>
            <span>Aug 24 - Sep 24</span>
          </button>
        </div>
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
          value={stats.attendance}
          isPercentage={true}
          icon="verified"
          trendText="-0.8%"
          trendType="down"
          variant="success"
        />
      </div>

      {/* Main Grid: Chart & Activity */}
      <div className="dashboard-body-grid">
        <div className="chart-column">
          <AttendanceChart />
        </div>
        <div className="activity-column">
          <RecentTeachers />
        </div>
      </div>

      {/* Bottom Enrollment Table */}
      <RecentStudents />
    </div>
  );
}

export default Dashboard;
