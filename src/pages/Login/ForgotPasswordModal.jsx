import { useState } from "react";
import { toast } from "react-toastify";
import {
  requestForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
} from "../../services/authService";
import OtpScreen from "./OtpScreen";
import PasswordSetupScreen from "./PasswordSetupScreen";
import Modal from "../../components/common/Modal/Modal";

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password, 4: Success
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      toast.error("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);
    try {
      await requestForgotPasswordOtp(email.trim());
      toast.success("If an account exists for this email, an OTP code has been dispatched.");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to request OTP code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otpCode) => {
    setIsLoading(true);
    try {
      const res = await verifyForgotPasswordOtp(email.trim(), otpCode);
      if (res.data?.resetToken) {
        setResetToken(res.data.resetToken);
        setStep(3);
        toast.success("OTP verified successfully. Please enter your new password.");
      } else {
        toast.error("Verification failed. Missing reset token.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (newPassword, confirmPassword) => {
    setIsLoading(true);
    try {
      await resetPassword(resetToken, newPassword, confirmPassword);
      setStep(4);
      toast.success("Password reset successfully. You can now login with your new password.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail("");
    setResetToken("");
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 4 ? "Password Reset Complete" : "Reset Password"}
      maxWidth="480px"
    >
      <div style={{ padding: "8px 4px" }}>
        {step === 1 && (
          <form onSubmit={handleRequestOtp}>
            <div className="login-welcome-text" style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "1.125rem", color: "#f8fafc", fontWeight: 600, marginBottom: "6px" }}>
                Forgot Your Password?
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.5 }}>
                Enter your account email address below. We will send you a 6-digit OTP code to verify your identity.
              </p>
            </div>

            <div className="login-input-wrapper" style={{ marginBottom: "24px" }}>
              <label className="login-input-label" htmlFor="forgot-email">Registered Email Address</label>
              <div className="login-input-field-container">
                <span className="material-symbols-outlined login-input-icon">alternate_email</span>
                <input
                  id="forgot-email"
                  className="login-input"
                  type="email"
                  placeholder="user@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="login-btn-wrapper">
              <button
                type="submit"
                className="login-btn-gradient"
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? (
                  <>
                    <span>Requesting Code...</span>
                    <div className="login-loading-spinner"></div>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <span className="material-symbols-outlined">send</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <OtpScreen
            email={email}
            onVerify={handleVerifyOtp}
            onResend={() => requestForgotPasswordOtp(email.trim())}
            onBack={() => setStep(1)}
            isLoading={isLoading}
          />
        )}

        {step === 3 && (
          <PasswordSetupScreen
            onSubmit={handleResetPassword}
            isLoading={isLoading}
          />
        )}

        {step === 4 && (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                color: "#10b981",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "36px" }}>check_circle</span>
            </div>
            <h3 style={{ fontSize: "1.25rem", color: "#f8fafc", fontWeight: 700, marginBottom: "8px" }}>
              Password Reset Successfully!
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#94a3b8", marginBottom: "24px" }}>
              Your password has been updated. You may now return to the login screen and sign in with your new credentials.
            </p>
            <button
              type="button"
              className="login-btn-gradient"
              onClick={handleClose}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
