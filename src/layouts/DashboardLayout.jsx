import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar/Sidebar.jsx";
import Navbar from "../components/layout/Navbar/Navbar.jsx";
import "./DashboardLayout.css";
import {useAuth} from '../context/AuthContext.jsx'

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
 console.log("user form dashboarlayout "+ user.role)
  return (
    <div className="dashboard-layout">
      {/* Ambient background blob */}
      <div id="bg-blob" aria-hidden="true"></div>

            <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          user={user}
        />

      <div className="layout-content">
        <Navbar onMenuToggle={toggleSidebar}
        user={user} />

        <main className="layout-main">
          <Outlet />
        </main>
      </div>

      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
}

export default DashboardLayout;
