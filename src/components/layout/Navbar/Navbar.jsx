import "./Navbar.css";
import ThemeToggle from "../../common/ThemeToggle/ThemeToggle";

function Navbar({ onMenuToggle , user}) {

  console.log("user from navbar"+ user)
  return (
    <header className="navbar-header glass-panel">
      {/* Search and Mobile toggle */}
      <div className="navbar-left">
        <button 
          className="mobile-menu-btn btn-press" 
          onClick={onMenuToggle}
          aria-label="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="search-container">
         
            <p>Dashboard</p>
       </div>
      </div>

      {/* User Actions */}
      <div className="navbar-right">
        {/* Reusable Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <div className="notifications-btn btn-press">
          <span className="material-symbols-outlined">notifications</span>
          <span className="notification-badge-dot"></span>
        </div>

        <div className="navbar-divider"></div>

        {/* User Profile */}
        <div className="user-profile-group">
          <div className="user-profile-details">
            <p className="user-profile-name">
              {user?.name || "User"}</p>
            <p className="user-profile-role">
              {user?.role === "principal"
                ? "Principal"
                : user?.role === "teacher"
                ? "Teacher"
                : "Member"}
            </p>
          </div>
          <div className="user-avatar-wrapper">
                            <img
                  className="user-avatar-img"
                  src={
                    user?.profileImage ||
                    "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(user?.name || "User") +
                      "&background=2563eb&color=fff"
                  }
                  alt={user?.name || "User Avatar"}
                />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
