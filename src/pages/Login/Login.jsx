import "./Login.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  loginUser,
  verifyTeacherOtp,
  resendOtp,
  completeFirstLogin,
} from "../../services/authService";

import { useAuth } from "../../hooks/UseAuth";
import { toast } from "react-toastify";

import useMouseParallax from "./useMouseParallax";
import ThemeToggle from "../../components/common/ThemeToggle/ThemeToggle";

import OtpScreen from "./OtpScreen";
import PasswordSetupScreen from "./PasswordSetupScreen";
import ForgotPasswordModal from "./ForgotPasswordModal";

import { getApiErrorMessage } from "../../services/api";

export default function Login() {
  const navigate = useNavigate();

  const {
    user,
    login,
    startOtpVerification,
    clearOtpVerification,
    pendingOtpEmail,
  } = useAuth();

  /* ============================================================
     AUTO-REDIRECT IF ALREADY LOGGED IN
  ============================================================ */

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  /* ============================================================
     AUTH STATE
  ============================================================ */

  const [authView, setAuthView] = useState(
    () => (pendingOtpEmail ? "otp" : "login")
  );

  const [email, setEmail] = useState(
    () => pendingOtpEmail || ""
  );

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [forgotPasswordOpen, setForgotPasswordOpen] =
    useState(false);

  const [previewStats] =
    useState(null);

  /* ============================================================
     PARALLAX
  ============================================================ */

  const parallax = useMouseParallax(20);

  /* ============================================================
     RESTORE OTP STATE
  ============================================================ */

  useEffect(() => {
    if (pendingOtpEmail) {
      setEmail(pendingOtpEmail);
      setAuthView("otp");
    }
  }, [pendingOtpEmail]);

  /* ============================================================
     LOGIN
     
     Backend flow:
     
     email + password
          ↓
     backend sends OTP
          ↓
     frontend opens OTP screen
  ============================================================ */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading || isSuccess) {
      return;
    }

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      await loginUser(
        cleanEmail,
        password
      );

      /*
       * IMPORTANT:
       *
       * The backend intentionally does NOT return
       * authentication tokens here.
       *
       * It sends the OTP instead.
       */

      startOtpVerification(cleanEmail);

      setAuthView("otp");

      toast.success(
        "Verification code sent to your registered email."
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Login failed. Please check your email and password."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ============================================================
     VERIFY LOGIN / TEACHER OTP
     
     IMPORTANT:
     
     Backend stores:
     
     Normal login:
       accessToken → HttpOnly cookie
       refreshToken → HttpOnly cookie
     
     Teacher first login:
       setupToken → HttpOnly cookie
     
     Therefore frontend NEVER reads those tokens.
  ============================================================ */

const handleVerifyTeacherOtp = async (otpCode) => {
  if (isLoading) return;

  const cleanEmail = email.trim();

  if (!cleanEmail) {
    toast.error("Email session is missing. Please start again.");
    return;
  }

  if (!otpCode || String(otpCode).trim().length !== 6) {
    toast.error("Please enter the 6-digit verification code.");
    return;
  }

  setIsLoading(true);

  try {
    const response = await verifyTeacherOtp(
      cleanEmail,
      String(otpCode).trim()
    );

    /*
     * IMPORTANT
     *
     * Axios:
     *
     * response
     *   └── response.data       <- ApiResponse
     *         └── data          <- actual backend payload
     *
     * Therefore we need response.data.data.
     */
    const payload =
      response?.data?.data ||
      response?.data ||
      response ||
      {};

    /*
     * Teacher first login:
     *
     * Backend returns:
     *
     * {
     *   requiresPasswordSetup: true,
     *   setupToken: "...",
     *   user: {...}
     * }
     *
     * setupToken is stored as an HttpOnly cookie.
     */
    const requiresPasswordSetup = Boolean(
      payload?.requiresPasswordSetup ||
      payload?.firstLogin ||
      payload?.isFirstLogin ||
      payload?.setupRequired
    );

    if (requiresPasswordSetup) {
      /*
       * DO NOT:
       *
       * - call login()
       * - call /auth/me
       * - navigate to dashboard
       *
       * User must create permanent password first.
       */
      setAuthView("password_setup");

      toast.success(
        "Email verified. Please create your permanent password."
      );

      return;
    }

    /*
     * Normal login OTP
     *
     * At this point backend should have created:
     *
     * accessToken cookie
     * refreshToken cookie
     *
     * Now we can fetch the authenticated user.
     */
    await login(payload);

    clearOtpVerification();

    setIsSuccess(true);

    toast.success("Login successful.");

    setTimeout(() => {
      navigate("/dashboard", {
        replace: true,
      });
    }, 500);
  } catch (error) {
    toast.error(
      getApiErrorMessage(
        error,
        "Invalid or expired verification code."
      )
    );
  } finally {
    setIsLoading(false);
  }
};

  /* ============================================================
     RESEND OTP
  ============================================================ */

  const handleResendOtp = async () => {
    if (isLoading) {
      return;
    }

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      toast.error(
        "Email session is missing. Please start again."
      );
      return;
    }

    try {
      await resendOtp(cleanEmail);

      toast.success(
        "A new verification code has been sent."
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to resend verification code."
        )
      );

      throw error;
    }
  };

  /* ============================================================
     COMPLETE TEACHER FIRST LOGIN
     
     IMPORTANT:
     
     DO NOT SEND setupToken.
     
     Backend reads:
       req.cookies.setupToken
  ============================================================ */

  const handleCompleteFirstLogin = async (
    newPassword,
    confirmPassword
  ) => {
    if (isLoading) {
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error(
        "Please enter and confirm your new password."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "Passwords do not match."
      );
      return;
    }

    setIsLoading(true);

    try {
      /*
       * setupToken is automatically sent through the
       * HttpOnly cookie because api.js uses withCredentials.
       */

      await completeFirstLogin(
        newPassword,
        confirmPassword
      );

      /*
       * Backend has now created the authentication cookies.
       *
       * AuthContext fetches the user using /auth/me.
       */

      await login(null);

      clearOtpVerification();

      setIsSuccess(true);

      toast.success(
        "Account setup completed successfully."
      );

      setTimeout(() => {
        navigate("/dashboard", {
          replace: true,
        });
      }, 500);
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to complete account setup."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ============================================================
     PREVIEW DATA
  ============================================================ */

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
      {
        name: "Alex Johnson",
        grade: "Grade 10-A",
      },
      {
        name: "Sophia Williams",
        grade: "Grade 12-C",
      },
      {
        name: "Ryan Garcia",
        grade: "Grade 9-B",
      },
    ],

    classesSchedule: [
      {
        time: "09:30 AM",
        subject: "Advanced Mathematics",
        teacher:
          "Dr. Ethan Hunt • Room A4",
      },
      {
        time: "10:15 AM",
        subject: "Physics Lab Experiments",
        teacher:
          "Prof. Sarah Connor • Lab B",
      },
    ],

    activityLogs: [
      {
        type: "blue",
        text:
          "Report cards generated for <strong>Grade 10B</strong>",
        time: "2 mins ago",
      },
      {
        type: "green",
        text:
          "Leave application filed by <strong>Anna's Parents</strong>",
        time: "10 mins ago",
      },
    ],
  };

  const stats =
    previewStats || defaultStats;

  const studentsCount = Number(
    stats?.studentsCount ??
      defaultStats.studentsCount
  );

  const teachersCount = Number(
    stats?.teachersCount ??
      defaultStats.teachersCount
  );

  const attendancePresent = Number(
    stats?.attendance?.present ??
      defaultStats.attendance.present
  );

  const attendanceTotal = Number(
    stats?.attendance?.total ??
      defaultStats.attendance.total
  );

  const attendanceRate = Number(
    stats?.attendance?.percentage ??
      defaultStats.attendance.percentage
  );

  const studentsList =
    Array.isArray(stats?.studentsList)
      ? stats.studentsList
      : defaultStats.studentsList;

  const classesSchedule =
    Array.isArray(stats?.classesSchedule)
      ? stats.classesSchedule
      : defaultStats.classesSchedule;

  const activityLogs =
    Array.isArray(stats?.activityLogs)
      ? stats.activityLogs
      : defaultStats.activityLogs;

  const safeAttendanceRate = Math.min(
    100,
    Math.max(0, attendanceRate)
  );

  const strokeDashoffset =
    201 -
    (201 * safeAttendanceRate) /
      100;

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="login-page-container">

      {/* ========================================================
          LEFT PANEL
      ======================================================== */}

      <section
        className="login-left-panel"
        aria-hidden="true"
      >
        <div className="aurora-bg" />

        <div className="light-rays" />

        <div className="particles-container">
          <div className="particle particle-1" />
          <div className="particle particle-2" />
          <div className="particle particle-3" />
          <div className="particle particle-4" />
        </div>

        <div className="floating-shapes">
          <div className="abstract-shape shape-1" />
          <div className="abstract-shape shape-2" />
        </div>

        <div
          className="widgets-container"
          style={{
            "--parallax-x": `${parallax.x}px`,
            "--parallax-y": `${parallax.y}px`,
          }}
        >

          {/* STUDENTS */}

          <div className="glass-widget widget-students">

            <header className="widget-header">

              <div className="widget-icon-box">
                <span className="material-symbols-outlined">
                  group
                </span>
              </div>

              <div>
                <h3 className="widget-title">
                  Student Intake
                </h3>

                <p className="widget-subtitle">
                  Academic Year 2026
                </p>
              </div>

            </header>

            <div className="student-stat-row">

              <span className="student-stat-num">
                {studentsCount.toLocaleString()}
              </span>

              <span className="student-stat-trend">
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "14px",
                  }}
                >
                  trending_up
                </span>

                +4.8%
              </span>

            </div>

            <div className="student-list">

              {studentsList
                .slice(0, 3)
                .map((student, index) => (
                  <div
                    className="student-item"
                    key={`${student.name}-${index}`}
                  >
                    <span className="student-name">
                      {student.name}
                    </span>

                    <span className="student-class">
                      {student.grade}
                    </span>
                  </div>
                ))}

            </div>

          </div>

          {/* ATTENDANCE */}

          <div className="glass-widget widget-attendance">

            <header className="widget-header">

              <div className="widget-icon-box">
                <span className="material-symbols-outlined">
                  analytics
                </span>
              </div>

              <div>
                <h3 className="widget-title">
                  Daily Attendance
                </h3>

                <p className="widget-subtitle">
                  All Classes
                </p>
              </div>

            </header>

            <div className="attendance-ring-container">

              <div className="attendance-svg-box">

                <svg
                  width="70"
                  height="70"
                  viewBox="0 0 70 70"
                >

                  <defs>
                    <linearGradient
                      id="attendanceGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor="#06B6D4"
                      />

                      <stop
                        offset="100%"
                        stopColor="#6366F1"
                      />
                    </linearGradient>
                  </defs>

                  <circle
                    className="attendance-svg-ring-bg"
                    cx="35"
                    cy="35"
                    r="32"
                  />

                  <circle
                    className="attendance-svg-ring-fill"
                    cx="35"
                    cy="35"
                    r="32"
                    style={{
                      strokeDashoffset,
                    }}
                  />

                </svg>

                <div className="attendance-percentage-text">
                  {Math.round(
                    safeAttendanceRate
                  )}
                  %
                </div>

              </div>

              <div className="attendance-info-box">

                <span className="attendance-label">
                  Present Today
                </span>

                <span className="attendance-value">
                  {attendancePresent.toLocaleString()}{" "}
                  /{" "}
                  {attendanceTotal.toLocaleString()}
                </span>

              </div>

            </div>

          </div>

          {/* CLASSES */}

          <div className="glass-widget widget-classes">

            <header className="widget-header">

              <div className="widget-icon-box">
                <span className="material-symbols-outlined">
                  school
                </span>
              </div>

              <div>
                <h3 className="widget-title">
                  Ongoing Classes
                </h3>

                <p className="widget-subtitle">
                  Period 3 Active Schedule
                </p>
              </div>

            </header>

            <div className="schedule-grid">

              {classesSchedule
                .slice(0, 2)
                .map((schedule, index) => (
                  <div
                    className="schedule-item"
                    key={`${schedule.subject}-${index}`}
                  >

                    <div className="schedule-time-box">
                      {schedule.time}
                    </div>

                    <div className="schedule-details">

                      <span className="schedule-subject">
                        {schedule.subject}
                      </span>

                      <span className="schedule-teacher">
                        {schedule.teacher}
                      </span>

                    </div>

                  </div>
                ))}

            </div>

          </div>

          {/* TEACHERS */}

          <div className="glass-widget widget-teachers">

            <header className="widget-header">

              <div className="widget-icon-box">
                <span className="material-symbols-outlined">
                  badge
                </span>
              </div>

              <div>
                <h3 className="widget-title">
                  Faculty Roster
                </h3>

                <p className="widget-subtitle">
                  Teacher Check-ins
                </p>
              </div>

            </header>

            <div className="teacher-grid">

              <div className="teacher-grid-item">

                <div className="teacher-grid-num">
                  {teachersCount}
                </div>

                <div className="teacher-grid-label">
                  Total
                </div>

              </div>

              <div className="teacher-grid-item">

                <div className="teacher-grid-num">
                  {Math.max(
                    1,
                    Math.round(
                      teachersCount * 0.9
                    )
                  )}
                </div>

                <div className="teacher-grid-label">
                  On Duty
                </div>

              </div>

            </div>

          </div>

          {/* ACTIVITY */}

          <div className="glass-widget widget-notifications">

            <header className="widget-header">

              <div className="widget-icon-box">
                <span className="material-symbols-outlined">
                  notifications
                </span>
              </div>

              <div>
                <h3 className="widget-title">
                  Activity Logs
                </h3>

                <p className="widget-subtitle">
                  Real-time system events
                </p>
              </div>

            </header>

            <div className="activity-list">

              {activityLogs
                .slice(0, 2)
                .map((log, index) => (
                  <div
                    className="activity-item"
                    key={`${log.time}-${index}`}
                  >

                    <span
                      className={`activity-dot dot-${log.type}`}
                    />

                    <div className="activity-content">

                      <p
                        className="activity-text"
                        dangerouslySetInnerHTML={{
                          __html: log.text,
                        }}
                      />

                      <span className="activity-time">
                        {log.time}
                      </span>

                    </div>

                  </div>
                ))}

            </div>

          </div>

        </div>

        <div className="left-panel-footer">

          <div className="brand-trust-badge">

            <span className="material-symbols-outlined trust-icon">
              verified_user
            </span>

            <span>
              Enterprise SLMS • Next-Gen Education Management
            </span>

          </div>

        </div>

      </section>

      {/* ========================================================
          RIGHT AUTH PANEL
      ======================================================== */}

      <section className="login-right-panel">

        <div className="theme-toggle-fixed-position">
          <ThemeToggle />
        </div>

        <div className="auth-card-wrapper animate-fade-in-up">

          {/* BRAND */}

          <header className="auth-header">

            <div className="auth-logo-badge">

              <span className="material-symbols-outlined logo-symbol">
                school
              </span>

            </div>

            <h1 className="auth-brand-title">
              EduTrack
            </h1>

            <p className="auth-brand-subtitle">
              School Learning Management System
            </p>

          </header>

          {/* ====================================================
              LOGIN
          ==================================================== */}

          {authView === "login" && (
            <div className="auth-form-container">

              <div className="welcome-text-box">

                <h2>
                  Welcome Back
                </h2>

                <p>
                  Enter your credentials to access your portal.
                </p>

              </div>

              <form
                onSubmit={handleSubmit}
                className="auth-form"
                noValidate
              >

                {/* EMAIL */}

                <div className="form-group">

                  <label htmlFor="login-email">
                    Email Address
                  </label>

                  <div className="input-field-wrapper">

                    <span className="material-symbols-outlined field-icon">
                      mail
                    </span>

                    <input
                      id="login-email"
                      type="email"
                      placeholder="name@school.edu"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value
                        )
                      }
                      className="form-input"
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck="false"
                      disabled={isLoading}
                      required
                    />

                  </div>

                </div>

                {/* PASSWORD */}

                <div className="form-group">

                  <div className="label-with-action">

                    <label htmlFor="login-password">
                      Password
                    </label>

                    <button
                      type="button"
                      className="forgot-password-link"
                      onClick={() =>
                        setForgotPasswordOpen(true)
                      }
                      disabled={isLoading}
                    >
                      Forgot Password?
                    </button>

                  </div>

                  <div className="input-field-wrapper">

                    <span className="material-symbols-outlined field-icon">
                      lock
                    </span>

                    <input
                      id="login-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      className="form-input"
                      autoComplete="current-password"
                      disabled={isLoading}
                      required
                    />

                    <button
                      type="button"
                      className="toggle-password-btn"
                      onClick={() =>
                        setShowPassword(
                          (previous) =>
                            !previous
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      disabled={isLoading}
                    >

                      <span className="material-symbols-outlined">
                        {showPassword
                          ? "visibility_off"
                          : "visibility"}
                      </span>

                    </button>

                  </div>

                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  className={`submit-auth-btn btn-press ${
                    isSuccess
                      ? "success-state"
                      : ""
                  }`}
                  disabled={
                    isLoading ||
                    isSuccess
                  }
                  aria-busy={isLoading}
                >

                  {isSuccess ? (
                    <span className="btn-success-wrapper">

                      <span className="material-symbols-outlined">
                        check_circle
                      </span>

                      <span>
                        Success! Redirecting...
                      </span>

                    </span>
                  ) : isLoading ? (
                    <span className="btn-spinner-wrapper">

                      <span className="login-loading-spinner" />

                      <span>
                        Sending verification code...
                      </span>

                    </span>
                  ) : (
                    <span>
                      Continue to Verification
                    </span>
                  )}

                </button>

              </form>

            </div>
          )}

          {/* ====================================================
              OTP
          ==================================================== */}

          {authView === "otp" && (
            <OtpScreen
              email={email}
              onVerify={
                handleVerifyTeacherOtp
              }
              onResend={
                handleResendOtp
              }
              onBack={() => {
                clearOtpVerification();
                setAuthView("login");
                setPassword("");
                setIsSuccess(false);
              }}
              isLoading={isLoading}
            />
          )}

          {/* ====================================================
              FIRST LOGIN PASSWORD SETUP
          ==================================================== */}

          {authView === "password_setup" && (
            <PasswordSetupScreen
              onComplete={
                handleCompleteFirstLogin
              }
              isLoading={isLoading}
            />
          )}

          {/* ====================================================
              FOOTER
          ==================================================== */}

          <footer className="auth-footer">

            <p>
              Protected by Enterprise Role Authentication & Session Management
            </p>

          </footer>

        </div>

      </section>

      {/* ========================================================
          FORGOT PASSWORD
      ======================================================== */}

      <ForgotPasswordModal
        open={forgotPasswordOpen}
        onClose={() =>
          setForgotPasswordOpen(false)
        }
      />

    </div>
  );
}