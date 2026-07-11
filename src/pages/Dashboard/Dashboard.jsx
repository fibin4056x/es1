import "./Dashboard.css";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/dashboardService";
import StatCard from "./StatCard";
import AttendanceChart from "./AttendanceChart";
import RecentTeachers from "./RecentTeachers";
import RecentStudents from "./RecentStudents";

function Dashboard() {
  const [stats, setStats] = useState({
  students: 0,
  teachers: 0,
  classes: 0,
  attendance: 0,
});
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

      <div className="cards">

<StatCard
  title="Students"
  value={stats.students}
  color="#2563eb"
/>

<StatCard
  title="Teachers"
  value={stats.teachers}
  color="#10b981"
/>

<StatCard
  title="Classes"
  value={stats.classes}
  color="#f59e0b"
/>

<StatCard
  title="Attendance"
  value={`${stats.attendance}%`}
  color="#ef4444"
/>
      </div>

      <div className="dashboard-grid">

        <AttendanceChart />

        <RecentTeachers />

      </div>

      <RecentStudents />

    </div>
  );
}

export default Dashboard;