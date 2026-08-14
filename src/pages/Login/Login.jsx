import "./Login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  verifyTeacherOtp,
  completeFirstLogin,
} from "../../services/authService";
import { useAuth } from "../../hooks/UseAuth";
import { toast } from "react-toastify";

import useMouseParallax from "./useMouseParallax";
import ThemeToggle from "../../components/common/ThemeToggle/ThemeToggle";
import OtpScreen from "./OtpScreen";
import PasswordSetupScreen from "./PasswordSetupScreen";
import ForgotPasswordModal from "./ForgotPasswordModal";
import api, { getApiErrorMessage } from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [authView, setAuthView] = useState("login"); // "login" | "otp" | "password_setup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupToken, setSetupToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [previewStats, setPreviewStats] = useState(null);

  // Custom hook for mouse movement parallax effect on left panel
  const parallax = useMouseParallax(20);

  useEffect(() => {
    let isMounted = true;
    const fetchPreviewStats = async () => {
      try {
        const response = await api.get("/dashboard/preview");
        if (isMounted && response.data && response.data.success && response.data.data) {
          setPreviewStats(response.data.data);
        }
      } catch (err) {
        // Silently catch preview error when unauthenticated
      }
    };
    fetchPreviewStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await loginUser(email, password);

      const resData = res?.data || res;
      const userObj = resData?.user || res?.user || resData;

      // Check if backend requires first-time teacher verification
      if (resData?.requiresVerification || res?.requiresVerification) {
        setIsLoading(false);
        setAuthView("otp");
        toast.info("Verification required for first-time teacher login. OTP sent to your email.");
        return;
      }

      if (userObj && (userObj.role || userObj._id || userObj.email)) {
        setIsSuccess(true);
        setTimeout(() => {
          login(userObj);
          navigate("/dashboard");
        }, 800);
      } else {
        setIsLoading(false);
        toast.error("Login failed. Invalid account details returned from server.");
      }
    } catch (error) {
      setIsLoading(false);
      const userMsg = getApiErrorMessage(error, "Login failed. Please verify your email and password.");
      toast.error(userMsg);
    }
  };

  const handleVerifyTeacherOtp = async (otpCode) => {
    setIsLoading(true);
    try {
      const response = await verifyTeacherOtp(email, otpCode);
      const resData = response?.data || response;
      const token = resData?.setupToken || response?.setupToken;

      if (token) {
        setSetupToken(token);
        setAuthView("password_setup");
        toast.success("OTP verified. Please set your permanent account password.");
      } else {
        toast.error("Verification failed. Setup token missing from response.");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Invalid or expired OTP verification code."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteFirstLogin = async (newPassword, confirmPassword) => {
    setIsLoading(true);
    try {
      const response = await completeFirstLogin(setupToken, newPassword, confirmPassword);
      const resData = response?.data || response;
      const userObj = resData?.user || response?.user || resData;

      toast.success("Account activated successfully! Logging you in...");
      setTimeout(() => {
        login(userObj);
        navigate("/dashboard");
      }, 600);
    } catch (error) {
      setIsLoading(false);
      toast.error(getApiErrorMessage(error, "Failed to complete account setup."));
    }
  };

  // Fallback defaults in case backend preview stats are loading or unavailable
  const defaultStats = {
    studentsCount: 1248,
    teachersCount: 84,
    classesCount: 24,
    attendance: {
      percentage: 94.2,
      present: 1175,
      total: 1248,
    },
    studentsList: [
      { name: "Alex Johnson", grade: "Grade 10-A" },
      { name: "Sophia Williams", grade: "Grade 12-C" },
      { name: "Ryan Garcia", grade: "Grade 9-B" },
    ],
    classesSchedule: [
      { time: "09:30 AM", subject: "Advanced Mathematics", teacher: "Dr. Ethan Hunt • Room A4" },
      { time: "10:15 AM", subject: "Physics Lab Experiments", teacher: "Prof. Sarah Connor • Lab B" },
    ],
    activityLogs: [
      { type: "blue", text: "Report cards generated for <strong>Grade 10B</strong>", time: "2 mins ago" },
      { type: "green", text: "Leave application filed by <strong>Anna's Parents</strong>", time: "10 mins ago" },
    ],
  };

  const stats = previewStats || defaultStats;
  const studentsCount = Number(stats?.studentsCount ?? defaultStats.studentsCount);
  const teachersCount = Number(stats?.teachersCount ?? defaultStats.teachersCount);
  const attendancePresent = Number(stats?.attendance?.present ?? defaultStats.attendance.present);
  const attendanceTotal = Number(stats?.attendance?.total ?? defaultStats.attendance.total);
  const attendanceRate = Number(stats?.attendance?.percentage ?? defaultStats.attendance.percentage);
  const studentsList = Array.isArray(stats?.studentsList) ? stats.studentsList : defaultStats.studentsList;
  const classesSchedule = Array.isArray(stats?.classesSchedule) ? stats.classesSchedule : defaultStats.classesSchedule;
  const activityLogs = Array.isArray(stats?.activityLogs) ? stats.activityLogs : defaultStats.activityLogs;

  const strokeDashoffset = 201 - (201 * attendanceRate) / 100;

  return (
    <div className="login-page-container">
      {/* LEFT SIDE: IMMERSIVE ANIMATED WORKSPACE (60%) */}
      <section className="login-left-panel" aria-hidden="true">
        {/* Animated Aurora backgrounds */}
        <div className="aurora-bg"></div>
        <div className="light-rays"></div>

        {/* Soft Glowing Particles */}
        <div className="particles-container">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
        </div>

        {/* Floating Abstract Glass Shapes */}
        <div className="floating-shapes">
          <div className="abstract-shape shape-1"></div>
          <div className="abstract-shape shape-2"></div>
        </div>

        {/* Layered Interactive Glass Dashboard Widgets */}
        <div 
          className="widgets-container" 
          style={{
            "--parallax-x": parallax.x,
            "--parallax-y": parallax.y,
          }}
        >
          {/* 1. Student Management Card */}
          <div className="glass-widget widget-students">
            <header className="widget-header">
              <div className="widget-icon-box">
                <span className="material-symbols-outlined">group</span>
              </div>
              <div>
                <h3 className="widget-title">Student Intake</h3>
                <p className="widget-subtitle">Academic Year 2026</p>
              </div>
            </header>
            <div className="student-stat-row">
              <span className="student-stat-num">{studentsCount.toLocaleString()}</span>
              <span className="student-stat-trend">
                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>trending_up</span>
                +4.8%
              </span>
            </div>
            <div className="student-list">
              {studentsList.slice(0, 3).map((student, i) => (
                <div className="student-item" key={i}>
                  <span className="student-name">{student.name}</span>
                  <span className="student-class">{student.grade}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Attendance Analytics Widget */}
          <div className="glass-widget widget-attendance">
            <header className="widget-header">
              <div className="widget-icon-box">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <div>
                <h3 className="widget-title">Daily Attendance</h3>
                <p className="widget-subtitle">All Classes</p>
              </div>
            </header>
            <div className="attendance-ring-container">
              <div className="attendance-svg-box">
                <svg width="70" height="70" viewBox="0 0 70 70">
                  <defs>
                    <linearGradient id="attendanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06B6D4" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                  <circle className="attendance-svg-ring-bg" cx="35" cy="35" r="32" />
                  <circle 
                    className="attendance-svg-ring-fill" 
                    cx="35" 
                    cy="35" 
                    r="32" 
                    style={{ strokeDashoffset }}
                  />
                </svg>
                <div className="attendance-percentage-text">{Math.round(attendanceRate)}%</div>
              </div>
              <div className="attendance-info-box">
                <span className="attendance-label">Present Today</span>
                <span className="attendance-value">
                  {attendancePresent.toLocaleString()} / {attendanceTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Class Overview / Schedules Widget */}
          <div className="glass-widget widget-classes">
            <header className="widget-header">
              <div className="widget-icon-box">
                <span className="material-symbols-outlined">school</span>
              </div>
              <div>
                <h3 className="widget-title">Ongoing Classes</h3>
                <p className="widget-subtitle">Period 3 Active Schedule</p>
              </div>
            </header>
            <div className="schedule-grid">
              {classesSchedule.slice(0, 2).map((schedule, i) => (
                <div className="schedule-item" key={i}>
                  <div className="schedule-time-box">{schedule.time}</div>
                  <div className="schedule-details">
                    <span className="schedule-subject">{schedule.subject}</span>
                    <span className="schedule-teacher">{schedule.teacher}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Teacher Statistics Widget */}
          <div className="glass-widget widget-teachers">
            <header className="widget-header">
              <div className="widget-icon-box">
                <span className="material-symbols-outlined">badge</span>
              </div>
              <div>
                <h3 className="widget-title">Faculty Roster</h3>
                <p className="widget-subtitle">Teacher Check-ins</p>
              </div>
            </header>
            <div className="teacher-grid">
              <div className="teacher-grid-item">
                <div className="teacher-grid-num">{teachersCount}</div>
                <div className="teacher-grid-label">Total</div>
              </div>
              <div className="teacher-grid-item">
                <div className="teacher-grid-num">
                  {Math.max(1, Math.round(teachersCount * 0.9))}
                </div>
                <div className="teacher-grid-label">On Duty</div>
              </div>
            </div>
          </div>

          {/* 5. Live Notifications / Activity Feed */}
          <div className="glass-widget widget-notifications">
            <header className="widget-header">
              <div className="widget-icon-box">
                <span className="material-symbols-outlined">notifications</span>
              </div>
              <div>
                <h3 className="widget-title">Activity Logs</h3>
                <p className="widget-subtitle">Real-time system events</p>
              </div>
            </header>
            <div className="activity-list">
              {activityLogs.slice(0, 2).map((log, i) => (
                <div className="activity-item" key={i}>
                  <span className={`activity-dot dot-${log.type}`}></span>
                  <div className="activity-content">
                    <p 
                      className="activity-text" 
                      dangerouslySetInnerHTML={{ __html: log.text }}
                    />
                    <span className="activity-time">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ambient Brand Overlay Footer */}
        <div className="left-panel-footer">
          <div className="brand-trust-badge">
            <span className="material-symbols-outlined trust-icon">verified_user</span>
            <span>Enterprise SLMS • Next-Gen Education Management</span>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE: AUTHENTICATION CONTAINER (40%) */}
      <section className="login-right-panel">
        <div className="theme-toggle-fixed-position">
          <ThemeToggle />
        </div>

        <div className="auth-card-wrapper animate-fade-in-up">
          {/* BRAND HEADER */}
          <header className="auth-header">
            <div className="auth-logo-badge">
              <span className="material-symbols-outlined logo-symbol">school</span>
            </div>
            <h1 className="auth-brand-title">EduTrack</h1>
            <p className="auth-brand-subtitle">School Learning Management System</p>
          </header>

          {/* AUTH VIEW RENDERER */}
          {authView === "login" && (
            <div className="auth-form-container">
              <div className="welcome-text-box">
                <h2>Welcome Back</h2>
                <p>Enter your credentials to access your portal.</p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                {/* Email Field */}
                <div className="form-group">
                  <label htmlFor="login-email">Email Address</label>
                  <div className="input-field-wrapper">
                    <span className="material-symbols-outlined field-icon">mail</span>
                    <input
                      id="login-email"
                      type="email"
                      required
                      placeholder="name@school.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <div className="label-with-action">
                    <label htmlFor="login-password">Password</label>
                    <button
                      type="button"
                      className="forgot-password-link"
                      onClick={() => setForgotPasswordOpen(true)}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="input-field-wrapper">
                    <span className="material-symbols-outlined field-icon">lock</span>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                      autoComplete="current-password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="toggle-password-btn"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Options Row */}
                <div className="form-options-row">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="checkbox-label">Keep me signed in</span>
                  </label>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className={`submit-auth-btn btn-press ${isSuccess ? "success-state" : ""}`}
                  disabled={isLoading || isSuccess}
                >
                  {isLoading ? (
                    <span className="btn-spinner-wrapper">
                      <span className="login-loading-spinner"></span>
                      <span>Authenticating...</span>
                    </span>
                  ) : isSuccess ? (
                    <span className="btn-success-wrapper">
                      <span className="material-symbols-outlined">check_circle</span>
                      <span>Success! Redirecting...</span>
                    </span>
                  ) : (
                    <span>Sign In to Portal</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {authView === "otp" && (
            <OtpScreen
              email={email}
              onVerify={handleVerifyTeacherOtp}
              onBack={() => setAuthView("login")}
              isLoading={isLoading}
            />
          )}

          {authView === "password_setup" && (
            <PasswordSetupScreen
              onComplete={handleCompleteFirstLogin}
              isLoading={isLoading}
            />
          )}

          {/* Security Footer */}
          <footer className="auth-footer">
            <p>Protected by Enterprise Role Authentication & Session Management</p>
          </footer>
        </div>
      </section>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
    </div>
  );
}
