import { useState } from "react";
import { toast } from "react-toastify";
import "./PasswordSetupScreen.css";

export default function PasswordSetupScreen({
  onSubmit,
  onComplete,
  isLoading,
}) {
  const submitHandler = onSubmit || onComplete;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Requirements checks
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const isFormValid =
    hasMinLength &&
    hasUppercase &&
    hasNumber &&
    hasSpecial &&
    passwordsMatch;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      if (!passwordsMatch) {
        toast.error("New password and confirm password do not match.");
      } else {
        toast.error("Please meet all password complexity requirements.");
      }
      return;
    }

    if (submitHandler) {
      submitHandler(newPassword, confirmPassword);
    }
  };

  return (
    <div className="password-setup-wrapper animate-fade-in-up">
      <div className="password-setup-header">
        <div className="password-setup-icon-circle">
          <span className="material-symbols-outlined">lock_reset</span>
        </div>
        <h2 className="login-welcome-title">Create Permanent Password</h2>
        <p className="login-welcome-subtitle">
          Please create a strong permanent password for your teacher account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        {/* New Password */}
        <div className="login-input-wrapper">
          <label className="login-input-label" htmlFor="setup-new-password">New Password</label>
          <div className="login-input-field-container">
            <span className="material-symbols-outlined login-input-icon">key</span>
            <input
              id="setup-new-password"
              className="login-input"
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              <span className="material-symbols-outlined">
                {showNewPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="login-input-wrapper">
          <label className="login-input-label" htmlFor="setup-confirm-password">Confirm Password</label>
          <div className="login-input-field-container">
            <span className="material-symbols-outlined login-input-icon">key_off</span>
            <input
              id="setup-confirm-password"
              className="login-input"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <span className="material-symbols-outlined">
                {showConfirmPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Password Requirements Checklist */}
        <div className="password-requirements-card">
          <div className="password-requirements-title">Password Requirements</div>
          <div className="password-req-list">
            <div className={`password-req-item ${hasMinLength ? "met" : ""}`}>
              <span className="material-symbols-outlined">
                {hasMinLength ? "check_circle" : "cancel"}
              </span>
              Minimum 8 characters
            </div>
            <div className={`password-req-item ${hasUppercase ? "met" : ""}`}>
              <span className="material-symbols-outlined">
                {hasUppercase ? "check_circle" : "cancel"}
              </span>
              At least one uppercase letter (A-Z)
            </div>
            <div className={`password-req-item ${hasNumber ? "met" : ""}`}>
              <span className="material-symbols-outlined">
                {hasNumber ? "check_circle" : "cancel"}
              </span>
              At least one number (0-9)
            </div>
            <div className={`password-req-item ${hasSpecial ? "met" : ""}`}>
              <span className="material-symbols-outlined">
                {hasSpecial ? "check_circle" : "cancel"}
              </span>
              At least one special character (!@#$%^&*)
            </div>
            <div className={`password-req-item ${passwordsMatch ? "met" : ""}`}>
              <span className="material-symbols-outlined">
                {passwordsMatch ? "check_circle" : "cancel"}
              </span>
              Passwords match
            </div>
          </div>
        </div>

        <div className="login-btn-wrapper">
          <button
            type="submit"
            className="login-btn-gradient"
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? (
              <>
                <span>Saving Password...</span>
                <div className="login-loading-spinner"></div>
              </>
            ) : (
              <>
                <span>Complete Account Setup</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
