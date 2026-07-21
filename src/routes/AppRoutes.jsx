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
      {/* Authentication */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Layout */}
      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["principal", "teacher"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Principal Only */}
        <Route
          path="/teachers"
          element={
            <PrivateRoute allowedRoles={["principal"]}>
              <Teachers />
            </PrivateRoute>
          }
        />

        <Route
          path="/classes"
          element={
            <PrivateRoute allowedRoles={["principal"]}>
              <Classes />
            </PrivateRoute>
          }
        />

        <Route
          path="/divisions"
          element={
            <PrivateRoute allowedRoles={["principal"]}>
              <Divisions />
            </PrivateRoute>
          }
        />

        {/* Principal & Teacher */}
        <Route
          path="/students"
          element={
            <PrivateRoute allowedRoles={["principal", "teacher"]}>
              <Students />
            </PrivateRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <PrivateRoute allowedRoles={["principal", "teacher"]}>
              <Attendance />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={["principal", "teacher"]}>
              <Profile />
            </PrivateRoute>
          }
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;