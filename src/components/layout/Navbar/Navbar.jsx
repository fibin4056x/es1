import "./Navbar.css";
import ThemeToggle from "../../common/ThemeToggle/ThemeToggle";

function Navbar({ onMenuToggle, user }) {
  const roleLabel =
    user?.role === "principal"
      ? "Principal"
      : user?.role === "teacher"
      ? "Teacher"
      : "Member";

  const avatar =
    user?.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User"
    )}&background=8b5cf6&color=ffffff`;

  return (
    <header className="navbar-header glass-panel">
      {/* =========================
          LEFT
      ========================= */}

      <div className="navbar-left">
        <button
          type="button"
          className="mobile-menu-btn btn-press"
          onClick={onMenuToggle}
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined">
            menu
          </span>
        </button>

        <div className="navbar-page-title">
          <h3>Dashboard</h3>
          <p>Welcome back 👋</p>
        </div>
      </div>

      {/* =========================
          RIGHT
      ========================= */}

      <div className="navbar-right">
        {/* Theme Toggle */}

        <ThemeToggle />

        {/* Notifications */}

        <button
          type="button"
          className="notifications-btn btn-press"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined">
            notifications
          </span>

          <span className="notification-badge-dot"></span>
        </button>

        <div className="navbar-divider"></div>

        {/* User */}

        <div className="user-profile-group">
          <div className="user-profile-details">
            <p className="user-profile-name">
              {user?.name || "User"}
            </p>

            <p className="user-profile-role">
              {roleLabel}
            </p>
          </div>

          <div className="user-avatar-wrapper">
            <img
              className="user-avatar-img"
              src={avatar}
              alt={`${user?.name || "User"} Avatar`}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;