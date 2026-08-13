import "./Login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  requestTeacherOtp,
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
import api from "../../services/api";

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
    const fetchPreviewStats = async () => {
      try {
        const response = await api.get("/dashboard/preview");
        if (response.data && response.data.success) {
          setPreviewStats(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard preview stats:", err);
      }
    };
    fetchPreviewStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await loginUser(email.trim(), password);

      // Check if backend requires first-time teacher verification
      if (response.data?.requiresVerification) {
        setIsLoading(false);
        setAuthView("otp");
        toast.info("Verification required for first-time teacher login. OTP sent to your email.");
        return;
      }

      setIsSuccess(true);
      
      // Delay navigation slightly to show success status animation
      setTimeout(() => {
        login(response.data.user, response.data.token);
        navigate("/dashboard");
      }, 800);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  const handleVerifyTeacherOtp = async (otpCode) => {
    setIsLoading(true);
    try {
      const response = await verifyTeacherOtp(email.trim(), otpCode);
      if (response.data?.setupToken) {
        setSetupToken(response.data.setupToken);
        setAuthView("password_setup");
        toast.success("OTP verified. Please set your permanent account password.");
      } else {
        toast.error("Verification failed. Setup token missing.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteFirstLogin = async (newPassword, confirmPassword) => {
    setIsLoading(true);
    try {
      const response = await completeFirstLogin(setupToken, newPassword, confirmPassword);
      toast.success("Account activated successfully! Logging you in...");
      setTimeout(() => {
        login(response.data.user, response.data.token);
        navigate("/dashboard");
      }, 600);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Failed to complete account setup.");
    }
  };

  // Fallback defaults in case backend is loading or unavailable
  const defaultStats = {
    studentsCount: 1248,
    teachersCount: 84,
    classesCount: 24,
    attendance: {
      percentage: 94.2,
      present: 1175,
      total: 1248
    },
    studentsList: [
      { name: "Alex Johnson", grade: "Grade 10-A" },
      { name: "Sophia Williams", grade: "Grade 12-C" },
      { name: "Ryan Garcia", grade: "Grade 9-B" }
    ],
    classesSchedule: [
      { time: "09:30 AM", subject: "Advanced Mathematics", teacher: "Dr. Ethan Hunt • Room A4" },
      { time: "10:15 AM", subject: "Physics Lab Experiments", teacher: "Prof. Sarah Connor • Lab B" }
    ],
    activityLogs: [
      { type: "blue", text: "Report cards generated for <strong>Grade 10B</strong>", time: "2 mins ago" },
      { type: "green", text: "Leave application filed by <strong>Anna's Parents</strong>", time: "10 mins ago" }
    ]
  };

  const stats = previewStats || defaultStats;
  const attendanceRate = stats.attendance?.percentage || 94.2;
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
            "--parallax-y": parallax.y
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
              <span className="student-stat-num">{stats.studentsCount.toLocaleString()}</span>
              <span className="student-stat-trend">
                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>trending_up</span>
                +4.8%
              </span>
            </div>
            <div className="student-list">
              {stats.studentsList.slice(0, 3).map((student, i) => (
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
                  {stats.attendance.present.toLocaleString()} / {stats.attendance.total.toLocaleString()}
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
              {stats.classesSchedule.slice(0, 2).map((schedule, i) => (
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
                <div className="teacher-grid-num">{stats.teachersCount}</div>
                <div className="teacher-grid-label">Total</div>
              </div>
              <div className="teacher-grid-item">
                <div className="teacher-grid-num">
                  {Math.max(1, Math.round(stats.teachersCount * 0.9))}
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
            <div className="notif-list">
              {stats.activityLogs.slice(0, 2).map((log, i) => (
                <div className="notif-item" key={i}>
                  <span className={`notif-indicator ${log.type}`}></span>
                  <div className="notif-text-box">
                    <span className="notif-text" dangerouslySetInnerHTML={{ __html: log.text }}></span>
                    <span className="notif-time">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE: FLOATING GLASS LOGIN CARD (40%) */}
      <section className="login-right-panel">
        {/* Theme Toggle container */}
        <div className="login-theme-toggle">
          <ThemeToggle />
        </div>

        {/* Main Floating Glass Login Card */}
        <div className="login-card-wrapper">
          <div className="login-glass-card">
            {/* Branding Header */}
            <div className="login-logo-group">
              <div className="login-logo-mark">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <h1 className="login-logo-text">EduTrack</h1>
            </div>

            {authView === "otp" ? (
              <OtpScreen
                email={email}
                onVerify={handleVerifyTeacherOtp}
                onResend={() => requestTeacherOtp(email.trim())}
                onBack={() => setAuthView("login")}
                isLoading={isLoading}
              />
            ) : authView === "password_setup" ? (
              <PasswordSetupScreen
                onSubmit={handleCompleteFirstLogin}
                isLoading={isLoading}
              />
            ) : (
              <>
                <div className="login-welcome-text">
                  <h2 className="login-welcome-title">Welcome Back</h2>
                  <p className="login-welcome-subtitle">
                    Enter your credentials to access the School Management System
                  </p>
                </div>

                {/* Login Credentials Form */}
                <form className="login-form-group" onSubmit={handleSubmit}>
                  {/* Email Input */}
                  <div className="login-input-wrapper">
                    <label className="login-input-label" htmlFor="login-email">Email Address</label>
                    <div className="login-input-field-container">
                      <span className="material-symbols-outlined login-input-icon">alternate_email</span>
                      <input
                        className="login-input"
                        id="login-email"
                        type="email"
                        placeholder="teacher@edutrack.edu"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="login-input-wrapper">
                    <label className="login-input-label" htmlFor="login-password">Password</label>
                    <div className="login-input-field-container">
                      <span className="material-symbols-outlined login-input-icon">key</span>
                      <input
                        className="login-input"
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        className="login-password-toggle"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <span className="material-symbols-outlined">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Options Row (Remember Me & Forgot Password) */}
                  <div className="login-options-row">
                    <label className="login-checkbox-label">
                      <input
                        className="login-hidden-checkbox"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <div className="login-custom-checkbox">
                        <span className="material-symbols-outlined login-check-icon">check</span>
                      </div>
                      <span className="login-checkbox-text">Remember me</span>
                    </label>
                    <a
                      href="#forgot"
                      className="login-forgot-link"
                      onClick={(e) => {
                        e.preventDefault();
                        setForgotPasswordOpen(true);
                      }}
                    >
                      Forgot Password?
                    </a>
                  </div>

                  {/* Gradient Submit Button */}
                  <div className="login-btn-wrapper">
                    <button
                      type="submit"
                      className="login-btn-gradient"
                      disabled={isLoading || isSuccess}
                    >
                      {isLoading ? (
                        <>
                          <span>{isSuccess ? "Access Approved" : "Validating..."}</span>
                          <div className="login-loading-spinner"></div>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Footer Information */}
                <div className="login-card-footer">
                  <p className="login-footer-text">
                    Authorized access only.{" "}
                    <a href="#request" className="login-footer-link" onClick={(e) => e.preventDefault()}>
                      Request Account
                    </a>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Global Copyright / Privacy Footer */}
      <footer className="login-global-footer">
        <span className="login-global-footer-text">© 2026 EDUTRACK. ALL RIGHTS RESERVED.</span>
        <div className="login-global-footer-links">
          <a href="#privacy" className="login-global-footer-link" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          <a href="#security" className="login-global-footer-link" onClick={(e) => e.preventDefault()}>Security Matrix</a>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
    </div>
  );
}

