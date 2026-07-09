import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo">
        <h2>EduTrack</h2>
      </div>

      <nav>

        <NavLink to="/dashboard">Dashboard</NavLink>

        <NavLink to="/teachers">Teachers</NavLink>

        <NavLink to="/students">Students</NavLink>

        <NavLink to="/classes">Classes</NavLink>

        <NavLink to="/divisions">Divisions</NavLink>

        <NavLink to="/attendance">Attendance</NavLink>

        <NavLink to="/profile">Profile</NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;