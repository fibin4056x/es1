import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "../../components/common/Modal/Modal";
import { changePassword } from "../../services/authService";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const isFormValid =
    currentPassword.length > 0 &&
    hasMinLength &&
    hasUppercase &&
    hasNumber &&
    hasSpecial &&
    passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      if (!passwordsMatch) {
        toast.error("New password and confirmation password do not match.");
      } else {
        toast.error("Please fill in all required fields and satisfy password requirements.");
      }
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword, confirmPassword);
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Password"
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit} className="premium-form">
        {/* Current Password */}
        <div className="login-input-wrapper" style={{ marginBottom: "16px" }}>
          <label className="login-input-label" htmlFor="profile-current-pw">Current Password</label>
          <div className="login-input-field-container">
            <span className="material-symbols-outlined login-input-icon">lock</span>
            <input
              id="profile-current-pw"
              className="login-input"
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowCurrent(!showCurrent)}
            >
              <span className="material-symbols-outlined">
                {showCurrent ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="login-input-wrapper" style={{ marginBottom: "16px" }}>
          <label className="login-input-label" htmlFor="profile-new-pw">New Password</label>
          <div className="login-input-field-container">
            <span className="material-symbols-outlined login-input-icon">key</span>
            <input
              id="profile-new-pw"
              className="login-input"
              type={showNew ? "text" : "password"}
              placeholder="Enter new password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowNew(!showNew)}
            >
              <span className="material-symbols-outlined">
                {showNew ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="login-input-wrapper" style={{ marginBottom: "20px" }}>
          <label className="login-input-label" htmlFor="profile-confirm-pw">Confirm New Password</label>
          <div className="login-input-field-container">
            <span className="material-symbols-outlined login-input-icon">key_off</span>
            <input
              id="profile-confirm-pw"
              className="login-input"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              <span className="material-symbols-outlined">
                {showConfirm ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="password-requirements-card" style={{ marginBottom: "20px" }}>
          <div className="password-requirements-title">Password Requirements</div>
          <div className="password-req-list">
            <div className={`password-req-item ${hasMinLength ? "met" : ""}`}>
              <span className="material-symbols-outlined">{hasMinLength ? "check_circle" : "cancel"}</span>
              Minimum 8 characters
            </div>
            <div className={`password-req-item ${hasUppercase ? "met" : ""}`}>
              <span className="material-symbols-outlined">{hasUppercase ? "check_circle" : "cancel"}</span>
              At least one uppercase letter (A-Z)
            </div>
            <div className={`password-req-item ${hasNumber ? "met" : ""}`}>
              <span className="material-symbols-outlined">{hasNumber ? "check_circle" : "cancel"}</span>
              At least one number (0-9)
            </div>
            <div className={`password-req-item ${hasSpecial ? "met" : ""}`}>
              <span className="material-symbols-outlined">{hasSpecial ? "check_circle" : "cancel"}</span>
              At least one special character (!@#$%^&*)
            </div>
            <div className={`password-req-item ${passwordsMatch ? "met" : ""}`}>
              <span className="material-symbols-outlined">{passwordsMatch ? "check_circle" : "cancel"}</span>
              Passwords match
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button
            type="button"
            className="btn-press"
            onClick={handleClose}
            disabled={loading}
            style={{ padding: "10px 18px", borderRadius: "8px", background: "transparent", color: "#94a3b8", border: "1px solid rgba(255, 255, 255, 0.15)", fontWeight: 600 }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-press"
            disabled={loading || !isFormValid}
            style={{ padding: "10px 22px", borderRadius: "8px", background: "var(--primary, #6366f1)", color: "#ffffff", border: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              {loading ? "progress_activity" : "lock_reset"}
            </span>
            <span>{loading ? "Updating..." : "Update Password"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
