import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "./OtpScreen.css";

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 300;
const RESEND_COOLDOWN_SECONDS = 60;

const EMPTY_OTP = Array(OTP_LENGTH).fill("");

export default function OtpScreen({
  email,
  onVerify,
  onResend,
  onBack,
  isLoading,
}) {
  const [otp, setOtp] = useState(EMPTY_OTP);
  const [expirySeconds, setExpirySeconds] = useState(
    OTP_EXPIRY_SECONDS
  );
  const [cooldownSeconds, setCooldownSeconds] = useState(
    RESEND_COOLDOWN_SECONDS
  );

  const inputRefs = useRef([]);

  /* ============================================================
     INITIAL FOCUS
  ============================================================ */

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  /* ============================================================
     OTP EXPIRY TIMER
  ============================================================ */

  useEffect(() => {
    if (expirySeconds <= 0) return;

    const timer = setInterval(() => {
      setExpirySeconds((previous) =>
        previous > 0 ? previous - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [expirySeconds]);

  /* ============================================================
     RESEND COOLDOWN
  ============================================================ */

  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timer = setInterval(() => {
      setCooldownSeconds((previous) =>
        previous > 0 ? previous - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  /* ============================================================
     HELPERS
  ============================================================ */

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const otpCode = otp.join("");
  const isComplete = otpCode.length === OTP_LENGTH;
  const isExpired = expirySeconds <= 0;

  /* ============================================================
     INPUT CHANGE
  ============================================================ */

  const handleChange = (index, value) => {
    if (isLoading || isExpired) return;

    // Keep numbers only.
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue) {
      const nextOtp = [...otp];
      nextOtp[index] = "";
      setOtp(nextOtp);
      return;
    }

    const digit = numericValue.slice(-1);

    const nextOtp = [...otp];
    nextOtp[index] = digit;

    setOtp(nextOtp);

    // Move to next input.
    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Optional auto-submit after final digit.
    if (
      index === OTP_LENGTH - 1 &&
      nextOtp.every(Boolean)
    ) {
      setTimeout(() => {
        handleVerify(nextOtp.join(""));
      }, 80);
    }
  };

  /* ============================================================
     KEYBOARD NAVIGATION
  ============================================================ */

  const handleKeyDown = (index, event) => {
    if (isLoading || isExpired) return;

    if (event.key === "Backspace") {
      if (otp[index]) {
        const nextOtp = [...otp];
        nextOtp[index] = "";
        setOtp(nextOtp);
        return;
      }

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowRight" &&
      index < OTP_LENGTH - 1
    ) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  /* ============================================================
     PASTE OTP
  ============================================================ */

  const handlePaste = (event) => {
    event.preventDefault();

    if (isLoading || isExpired) return;

    const pastedData = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (pastedData.length !== OTP_LENGTH) {
      toast.error("Please paste a valid 6-digit OTP.");
      return;
    }

    const digits = pastedData.split("");

    setOtp(digits);

    inputRefs.current[OTP_LENGTH - 1]?.focus();

    // Verify pasted OTP automatically.
    setTimeout(() => {
      handleVerify(pastedData);
    }, 80);
  };

  /* ============================================================
     VERIFY
  ============================================================ */

  const handleVerify = (code = otp.join("")) => {
    if (isLoading) return;

    if (code.length !== OTP_LENGTH) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    if (isExpired) {
      toast.error(
        "This verification code has expired. Please request a new one."
      );
      return;
    }

    onVerify(code);
  };

  /* ============================================================
     FORM SUBMIT
  ============================================================ */

  const handleSubmit = (event) => {
    event.preventDefault();
    handleVerify();
  };

  /* ============================================================
     RESEND
  ============================================================ */

  const handleResendClick = async () => {
    if (
      cooldownSeconds > 0 ||
      isLoading
    ) {
      return;
    }

    try {
      await onResend();

      setOtp(EMPTY_OTP);
      setExpirySeconds(OTP_EXPIRY_SECONDS);
      setCooldownSeconds(RESEND_COOLDOWN_SECONDS);

      toast.success(
        "A new verification code has been sent."
      );

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to resend verification code."
      );
    }
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="otp-screen-wrapper">
      {/* HEADER */}

      <div className="otp-header">
        <div className="otp-icon-circle">
          <span className="material-symbols-outlined">
            mark_email_read
          </span>
        </div>

        <h2 className="otp-title">
          Verify Your Email
        </h2>

        <p className="otp-subtitle">
          Enter the 6-digit verification code sent to
        </p>

        <span className="otp-email-highlight">
          {email}
        </span>
      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="otp-form"
        noValidate
      >
        {/* OTP INPUTS */}

        <div
          className="otp-inputs-grid"
          onPaste={handlePaste}
          role="group"
          aria-label="Verification code"
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              className={`otp-input-box ${
                digit ? "has-value" : ""
              } ${isExpired ? "is-expired" : ""}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              autoComplete={
                index === 0
                  ? "one-time-code"
                  : "off"
              }
              aria-label={`OTP digit ${index + 1}`}
              value={digit}
              onChange={(event) =>
                handleChange(
                  index,
                  event.target.value
                )
              }
              onKeyDown={(event) =>
                handleKeyDown(index, event)
              }
              disabled={isLoading || isExpired}
            />
          ))}
        </div>

        {/* TIMER */}

        <div
          className={`otp-timer-row ${
            isExpired ? "is-expired" : ""
          }`}
        >
          <span className="material-symbols-outlined">
            timer
          </span>

          {isExpired ? (
            <span className="otp-timer-expired">
              Verification code expired
            </span>
          ) : (
            <span>
              Code expires in{" "}
              <strong className="otp-timer-text">
                {formatTime(expirySeconds)}
              </strong>
            </span>
          )}
        </div>

        {/* VERIFY BUTTON */}

        <div className="login-btn-wrapper">
          <button
            type="submit"
            className="login-btn-gradient"
            disabled={
              isLoading ||
              !isComplete ||
              isExpired
            }
          >
            {isLoading ? (
              <>
                <span>Verifying Code...</span>

                <span className="login-loading-spinner" />
              </>
            ) : (
              <>
                <span>
                  Verify & Continue
                </span>

                <span className="material-symbols-outlined">
                  verified
                </span>
              </>
            )}
          </button>
        </div>

        {/* RESEND */}

        <div className="otp-resend-row">
          <span>Didn't receive the code?</span>

          <button
            type="button"
            className="otp-resend-btn"
            disabled={
              cooldownSeconds > 0 ||
              isLoading
            }
            onClick={handleResendClick}
          >
            {cooldownSeconds > 0
              ? `Resend in ${cooldownSeconds}s`
              : "Resend OTP"}
          </button>
        </div>
      </form>

      {/* BACK */}

      {onBack && (
        <button
          type="button"
          className="otp-back-btn"
          onClick={onBack}
          disabled={isLoading}
        >
          <span className="material-symbols-outlined">
            arrow_back
          </span>

          Back
        </button>
      )}
    </div>
  );
}