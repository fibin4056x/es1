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
        toast.error("Please satisfy all password complexity requirements.");
      }
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword, confirmPassword);
      toast.success("Password changed successfully!");
      handleClose();
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
      maxWidth="480px"
    >
      <form onSubmit={handleSubmit} className="change-pw-form">
        {/* Current Password */}
        <div className="change-pw-field">
          <label htmlFor="profile-current-pw">Current Password</label>
          <div className="change-pw-input-box">
            <span className="material-symbols-outlined pw-icon">lock</span>
            <input
              id="profile-current-pw"
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="pw-toggle-btn"
              onClick={() => setShowCurrent(!showCurrent)}
              aria-label={showCurrent ? "Hide password" : "Show password"}
            >
              <span className="material-symbols-outlined">
                {showCurrent ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="change-pw-field">
          <label htmlFor="profile-new-pw">New Password</label>
          <div className="change-pw-input-box">
            <span className="material-symbols-outlined pw-icon">key</span>
            <input
              id="profile-new-pw"
              type={showNew ? "text" : "password"}
              placeholder="Enter new password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="pw-toggle-btn"
              onClick={() => setShowNew(!showNew)}
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              <span className="material-symbols-outlined">
                {showNew ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="change-pw-field">
          <label htmlFor="profile-confirm-pw">Confirm New Password</label>
          <div className="change-pw-input-box">
            <span className="material-symbols-outlined pw-icon">key_off</span>
            <input
              id="profile-confirm-pw"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="pw-toggle-btn"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              <span className="material-symbols-outlined">
                {showConfirm ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="pw-req-card">
          <div className="pw-req-title">Password Requirements</div>
          <div className="pw-req-list">
            <div className={`pw-req-item ${hasMinLength ? "met" : ""}`}>
              <span className="material-symbols-outlined">
                {hasMinLength ? "check_circle" : "cancel"}
              </span>
              <span>Minimum 8 characters</span>
            </div>
            <div className={`pw-req-item ${hasUppercase ? "met" : ""}`}>
              <span className="material-symbols-outlined">
                {hasUppercase ? "check_circle" : "cancel"}
              </span>
              <span>At least one uppercase letter (A-Z)</span>
            </div>
            <div className={`pw-req-item ${hasNumber ? "met" : ""}`}>
              <span className="material-symbols-outlined">
                {hasNumber ? "check_circle" : "cancel"}
              </span>
              <span>At least one number (0-9)</span>
            </div>
            <div className={`pw-req-item ${hasSpecial ? "met" : ""}`}>
              <span className="material-symbols-outlined">
                {hasSpecial ? "check_circle" : "cancel"}
              </span>
              <span>At least one special character (!@#$%^&*)</span>
            </div>
            <div className={`pw-req-item ${passwordsMatch ? "met" : ""}`}>
              <span className="material-symbols-outlined">
                {passwordsMatch ? "check_circle" : "cancel"}
              </span>
              <span>Passwords match</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="change-pw-actions">
          <button
            type="button"
            className="change-pw-cancel"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="change-pw-submit"
            disabled={loading || !isFormValid}
          >
            <span className="material-symbols-outlined">
              {loading ? "progress_activity" : "lock_reset"}
            </span>
            <span>{loading ? "Updating..." : "Update Password"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
