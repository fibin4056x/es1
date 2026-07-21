import { NavLink } from "react-router-dom";
import  { NAVIGATION } from  "../../../constants/navigation.js"
import "./Sidebar.css";

function Sidebar({ isOpen, onClose, user }) {
const navItems = NAVIGATION[user?.role] ?? [];
console.log("Sidebar User:", user);
  return (
    <aside className={`sidebar sidebar-transition ${isOpen ? "" : "sidebar-collapsed"}`}>
      {/* Branding */}
      <div className="sidebar-logo-container">
        <div className="logo-icon-wrapper">
          <span className="material-symbols-outlined logo-icon material-fill">school</span>
        </div>
        <div>
          <h1 className="sidebar-title">EduTrack</h1>
          <p className="sidebar-subtitle">School Management System</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-active" : ""}`
            }
            onClick={onClose}
          >
            <span className="material-symbols-outlined nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}

export default Sidebar;
