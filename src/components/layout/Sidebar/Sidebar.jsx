import { NavLink, useNavigate } from "react-router-dom";
import { NAVIGATION } from "../../../constants/navigation.js";
import { useAuth } from "../../../hooks/UseAuth";

import "./Sidebar.css";

function Sidebar({ isOpen, onClose, user }) {
  const navItems = NAVIGATION[user?.role] ?? [];
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`sidebar sidebar-transition ${
        isOpen ? "" : "sidebar-collapsed"
      }`}
      aria-label="Sidebar Navigation"
    >
      {/* =========================
          BRAND
      ========================= */}

      <div className="sidebar-logo-container">
        <div className="logo-icon-wrapper">
          <span className="material-symbols-outlined material-fill logo-icon">
            school
          </span>
        </div>

        <div className="sidebar-brand">
          <h1 className="sidebar-title">
            EduTrack
          </h1>

          <p className="sidebar-subtitle">
            School Management System
          </p>
        </div>
      </div>

      {/* =========================
          NAVIGATION
      ========================= */}

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "sidebar-active" : ""
              }`
            }
          >
            <span className="material-symbols-outlined nav-icon">
              {item.icon}
            </span>

            <span className="nav-label">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* =========================
          LOGOUT
      ========================= */}

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-link logout-button"
          onClick={handleLogout}
        >
          <span className="material-symbols-outlined nav-icon">
            logout
          </span>

          <span className="nav-label">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;