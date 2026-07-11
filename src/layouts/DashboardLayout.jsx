import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

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