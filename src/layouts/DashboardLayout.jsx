import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar/Sidebar.jsx";
import Navbar from "../components/layout/Navbar/Navbar.jsx";

import "./DashboardLayout.css";

function DashboardLayout() {

  return (

    <div className="dashboard">

      <Sidebar />

      <div className="content">

        <Navbar />

        <main>

          <Outlet />

        </main>

      </div>

    </div>

  );

}

export default DashboardLayout;