import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Students from "../pages/Students/Students";
import Teacher from "../pages/Teachers/Teachers";
import Classes from "../pages/Classes/Classes";
import Divisions from "../pages/Division/Divisions";
import Attendance from "../pages/Attendance/Attendance";
import Profile from "../pages/Profile/Profile";
import NotFound from "../pages/Profile/NotFound";

import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";

function AppRoutes() {
  return (
    <Routes>

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Dashboard */}
      <Route element={<DashboardLayout />}>

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/divisions" element={<Divisions />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/profile" element={<Profile />} />

      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default AppRoutes;