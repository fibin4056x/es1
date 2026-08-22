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

const extractResponseData = (response) => {
  if (!response) return null;

  // Axios response:
  // response.data
  //
  // ApiResponse:
  // response.data.data
  //
  // Support both safely.
  return (
    response?.data?.data ??
    response?.data ??
    response
  );
};

const extractResetToken = (response) => {
  const data = extractResponseData(response);

  return (
    data?.resetToken ??
    data?.token ??
    data?.data?.resetToken ??
    data?.data?.token ??
    null
  );
};

const getErrorMessage = (error, fallback) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.userMessage;

  return typeof message === "string" && message.trim()
    ? message
    : fallback;
};

export default function ForgotPasswordModal({
  isOpen,
  open,
  onClose,
}) {
  const showModal = isOpen !== undefined ? isOpen : open;
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");

  const [resetToken, setResetToken] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isResending, setIsResending] = useState(false);

  /* ============================================================
     REQUEST FORGOT PASSWORD OTP
  ============================================================ */

  const handleRequestOtp = async (event) => {
    event.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);

    try {
      await requestForgotPasswordOtp(cleanEmail);

      setEmail(cleanEmail);
      setStep(2);

      /*
       * Do not reveal whether an account exists.
       * This is safer against account enumeration.
       */
      toast.success(
        "If an account exists for this email, a verification code has been sent."
      );
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Unable to request the verification code. Please try again."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ============================================================
     VERIFY OTP
  ============================================================ */

  const handleVerifyOtp = async (otpCode) => {
    const cleanOtp = String(otpCode || "").trim();

    if (!/^\d{6}$/.test(cleanOtp)) {
      toast.error("Please enter the 6-digit verification code.");
      return;
    }

    if (!email.trim()) {
      toast.error("Email address is missing. Please start again.");
      setStep(1);
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyForgotPasswordOtp(
        email.trim().toLowerCase(),
        cleanOtp
      );

      const token = extractResetToken(response);

      if (!token) {
        console.error(
          "Forgot-password verification response did not contain reset token:",
          response
        );

        toast.error(
          "Verification succeeded, but the reset session could not be created."
        );

        return;
      }

      setResetToken(token);
      setStep(3);

      toast.success(
        "Verification successful. Create your new password."
      );
    } catch (error) {
      toast.error(
        getErrorMessage(
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
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Email address is missing.");
      setStep(1);
      return;
    }

    if (isLoading || isResending) return;

    setIsResending(true);

    try {
      await requestForgotPasswordOtp(cleanEmail);

      toast.success(
        "If the account exists, a new verification code has been sent."
      );
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Unable to resend the verification code."
        )
      );
    } finally {
      setIsResending(false);
    }
  };

  /* ============================================================
     RESET PASSWORD
  ============================================================ */

  const handleResetPassword = async (
    newPassword,
    confirmPassword
  ) => {
    if (!resetToken) {
      toast.error(
        "Your password reset session has expired. Please start again."
      );

      setStep(1);
      setResetToken("");

      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error("Please enter and confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(
        resetToken,
        newPassword,
        confirmPassword
      );

      setResetToken("");
      setStep(4);

      toast.success(
        "Password reset successfully. You can now sign in."
      );
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Unable to reset your password. Please try again."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ============================================================
     BACK TO EMAIL
  ============================================================ */

  const handleBackToEmail = () => {
    if (isLoading || isResending) return;

    setStep(1);
    setResetToken("");
  };

  /* ============================================================
     CLOSE / RESET MODAL
  ============================================================ */

  const handleClose = () => {
    if (isLoading || isResending) return;

    setStep(1);
    setEmail("");
    setResetToken("");
    setIsLoading(false);
    setIsResending(false);

    onClose();
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <Modal
      isOpen={showModal}
      onClose={handleClose}
      title={
        step === 4
          ? "Password Reset Complete"
          : "Reset Password"
      }
      maxWidth="480px"
    >
      <div className="forgot-password-modal-content">

        {/* ======================================================
            STEP 1 — EMAIL
        ====================================================== */}

        {step === 1 && (
          <form
            onSubmit={handleRequestOtp}
            noValidate
          >
            <div className="forgot-password-intro">
              <div className="forgot-password-icon">
                <span className="material-symbols-outlined">
                  lock_reset
                </span>
              </div>

              <h3>Forgot your password?</h3>

              <p>
                Enter your registered email address and
                we'll send you a 6-digit verification code.
              </p>
            </div>

            <div className="login-input-wrapper">
              <label
                className="login-input-label"
                htmlFor="forgot-email"
              >
                Registered Email Address
              </label>

              <div className="login-input-field-container">
                <span className="material-symbols-outlined login-input-icon">
                  alternate_email
                </span>

                <input
                  id="forgot-email"
                  className="login-input"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-btn-gradient"
              disabled={
                isLoading ||
                !email.trim()
              }
            >
              {isLoading ? (
                <>
                  <span>Sending code...</span>

                  <span className="login-loading-spinner" />
                </>
              ) : (
                <>
                  <span>Send Verification Code</span>

                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ======================================================
            STEP 2 — OTP
        ====================================================== */}

        {step === 2 && (
          <OtpScreen
            email={email}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
            onBack={handleBackToEmail}
            isLoading={isLoading || isResending}
          />
        )}

        {/* ======================================================
            STEP 3 — NEW PASSWORD
        ====================================================== */}

        {step === 3 && (
          <PasswordSetupScreen
            onSubmit={handleResetPassword}
            isLoading={isLoading}
          />
        )}

        {/* ======================================================
            STEP 4 — SUCCESS
        ====================================================== */}

        {step === 4 && (
          <div className="forgot-password-success">

            <div className="forgot-password-success-icon">
              <span className="material-symbols-outlined">
                check_circle
              </span>
            </div>

            <h3>
              Password Reset Successfully
            </h3>

            <p>
              Your password has been updated successfully.
              You can now sign in using your new password.
            </p>

            <button
              type="button"
              className="login-btn-gradient"
              onClick={handleClose}
            >
              <span>Back to Login</span>

              <span className="material-symbols-outlined">
                login
              </span>
            </button>

          </div>
        )}

      </div>
    </Modal>
  );
}