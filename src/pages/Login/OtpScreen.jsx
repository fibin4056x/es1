import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "./OtpScreen.css";

export default function OtpScreen({
  email,
  onVerify,
  onResend,
  onBack,
  isLoading,
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // Countdown timer: 5 minutes (300 seconds) for OTP expiration
  const [expirySeconds, setExpirySeconds] = useState(300);
  // Cooldown timer: 60 seconds before user can resend
  const [cooldownSeconds, setCooldownSeconds] = useState(60);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Expiry countdown
  useEffect(() => {
    if (expirySeconds <= 0) return;
    const timer = setInterval(() => {
      setExpirySeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [expirySeconds]);

  // Resend cooldown countdown
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Take last entered character if multiple typed
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) {
      toast.error("Please paste a valid 6-digit numeric OTP code.");
      return;
    }

    const digits = pastedData.split("");
    setOtp(digits);
    inputRefs.current[5]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter complete 6-digit OTP verification code.");
      return;
    }
    if (expirySeconds <= 0) {
      toast.error("Verification code has expired. Please request a new code.");
      return;
    }

    onVerify(otpCode);
  };

  const handleResendClick = async () => {
    if (cooldownSeconds > 0) return;
    try {
      await onResend();
      setExpirySeconds(300);
      setCooldownSeconds(60);
      setOtp(["", "", "", "", "", ""]);
      toast.success("Verification code re-sent to your email.");
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend verification code.");
    }
  };

  return (
    <div className="otp-screen-wrapper animate-fade-in-up">
      <div className="otp-header">
        <div className="otp-icon-circle">
          <span className="material-symbols-outlined">mark_email_read</span>
        </div>
        <h2 className="otp-title">Verify Your Email</h2>
        <p className="otp-subtitle">
          We sent a 6-digit verification code to <br />
          <span className="otp-email-highlight">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="otp-inputs-grid" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className={`otp-input-box ${digit ? "has-value" : ""}`}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              disabled={isLoading}
            />
          ))}
        </div>

        <div className="otp-timer-row">
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>timer</span>
          {expirySeconds > 0 ? (
            <span>
              Code expires in <strong className="otp-timer-text">{formatTime(expirySeconds)}</strong>
            </span>
          ) : (
            <span className="otp-timer-expired">Verification code expired</span>
          )}
        </div>

        <div className="login-btn-wrapper">
          <button
            type="submit"
            className="login-btn-gradient"
            disabled={isLoading || otp.join("").length !== 6 || expirySeconds <= 0}
          >
            {isLoading ? (
              <>
                <span>Verifying Code...</span>
                <div className="login-loading-spinner"></div>
              </>
            ) : (
              <>
                <span>Verify & Continue</span>
                <span className="material-symbols-outlined">verified</span>
              </>
            )}
          </button>
        </div>

        <div className="otp-resend-row">
          Didn't receive code?
          <button
            type="button"
            className="otp-resend-btn"
            disabled={cooldownSeconds > 0 || isLoading}
            onClick={handleResendClick}
          >
            {cooldownSeconds > 0 ? `Resend in ${cooldownSeconds}s` : "Resend OTP"}
          </button>
        </div>
      </form>

      {onBack && (
        <button type="button" className="otp-back-btn" onClick={onBack}>
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Login
        </button>
      )}
    </div>
  );
}
