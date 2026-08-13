import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loader from "../components/common/Loader/Loader";

import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import PrivateRoute from "./PrivateRoute";

const Login = lazy(() => import("../pages/Login/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Students = lazy(() => import("../pages/Students/Students"));
const Teachers = lazy(() => import("../pages/Teachers/Teachers"));
const Classes = lazy(() => import("../pages/Classes/Classes"));
const Divisions = lazy(() => import("../pages/Division/Divisions"));
const Attendance = lazy(() => import("../pages/Attendance/Attendance"));
const AttendanceCalendar = lazy(() => import("../pages/Attendance/AttendanceCalendar"));
const AcademicCalendar = lazy(() => import("../pages/AcademicCalendar/AcademicCalendar"));
const Reports = lazy(() => import("../pages/Reports/Reports"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

const PageLoader = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px", width: "100%" }}>
    <Loader size="medium" text="Loading module..." />
  </div>
);

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
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

          {/* Academic Calendar */}
          <Route
            path="/academic-calendar"
            element={
              <PrivateRoute allowedRoles={["principal", "teacher"]}>
                <AcademicCalendar />
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
            path="/attendance-calendar"
            element={
              <PrivateRoute allowedRoles={["principal", "teacher"]}>
                <AttendanceCalendar />
              </PrivateRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <PrivateRoute allowedRoles={["principal", "teacher"]}>
                <Reports />
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
    </Suspense>
  );
}

export default AppRoutes;