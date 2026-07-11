import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Students from "../pages/Students/Students";
import Teachers from "../pages/Teachers/Teachers";
import Classes from "../pages/Classes/Classes";
import Divisions from "../pages/Division/Divisions";
import Attendance from "../pages/Attendance/Attendance";
import Profile from "../pages/Profile/Profile";
import NotFound from "../pages/NotFound/NotFound";

import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";

import PrivateRoute from "./PrivateRoute";

function AppRoutes() {
  return (
    <Routes>

      {/* Login */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Dashboard */}
      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/students" element={<Students />} />
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