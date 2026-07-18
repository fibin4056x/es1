import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import LivingCoreShader from "./LivingCoreShader";
import ThemeToggle from "../../components/common/ThemeToggle/ThemeToggle";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isSubmitHovered, setIsSubmitHovered] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await loginUser(email, password);
      
      // Simulate visual success confirmation matching design requirements
      setIsSuccess(true);
      setTimeout(() => {
        login(response.data.user, response.data.token);
          navigate("/dashboard");
        
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="login-page-container">
      {/* Left Side: Living Knowledge Core (60%) */}
      <section className="login-shader-panel" aria-hidden="true">
        <div className="shader-gradient-fade"></div>
        <div className="shader-vignette"></div>
        
        {/* WebGL Canvas Background */}
        <LivingCoreShader opacity={isEmailFocused ? 0.6 : 1.0} />

        {/* Branding Overlay */}
        <div className="shader-branding animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="brand-header-group">
            <div className="brand-icon-wrapper">
              <span 
                className="material-symbols-outlined brand-icon" 
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>
            <h2 className="brand-title">EduTrack</h2>
          </div>
          <p className="brand-description">
            The Dynamic Wisdom Core — where information blooms into intelligence.
          </p>
        </div>

        {/* Dynamic Energy Beam */}
        <div 
          id="energyBeam" 
          className={isSubmitHovered ? "beam-active" : ""}
        ></div>
      </section>

      {/* Right Side: Login Form (40%) */}
      <section className="login-form-panel">
        {/* Theme Toggle Button */}
        <div className="theme-toggle-container">
          <ThemeToggle />
        </div>

        <div className="form-wrapper">
          <div className="glass-card">
            {/* Form Header */}
            <header className="form-header">
              <div 
                className="portal-badge animate-fade-in-up" 
                style={{ animationDelay: "0.1s" }}
              >
                <span className="pulse-dot"></span>
                Principal &amp; Teacher Portal
              </div>
              <h1 
                className="form-title animate-fade-in-up" 
                style={{ animationDelay: "0.2s" }}
              >
                Welcome Back
              </h1>
              <p 
                className="form-subtitle animate-fade-in-up" 
                style={{ animationDelay: "0.3s" }}
              >
                Enter credentials to access your command center.
              </p>
            </header>

            {/* Login Form */}
            <form className="login-form" onSubmit={handleSubmit}>
              {/* Email Field */}
              <Input
                label="Work Email"
                id="email"
                type="email"
                autoComplete="email"
                icon="alternate_email"
                placeholder="name@institution.edu"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                className="animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
              />

              {/* Password Field */}
              <Input
                label="Security Key"
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                icon="key"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="animate-fade-in-up"
                style={{ animationDelay: "0.5s" }}
              >
                <button
                  className="password-toggle-btn"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide security key" : "Show security key"}
                  title={showPassword ? "Hide security key" : "Show security key"}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </Input>

              {/* Remember & Forgot */}
              <div 
                className="options-row animate-fade-in-up" 
                style={{ animationDelay: "0.6s" }}
              >
                <label className="remember-label">
                  <div className="checkbox-wrapper">
                    <input
                      className="hidden-checkbox"
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <div className="custom-checkbox" aria-hidden="true">
                      <span className="material-symbols-outlined check-icon">
                        check
                      </span>
                    </div>
                  </div>
                  <span className="remember-text">Keep me signed in</span>
                </label>
                <a className="forgot-link" href="#">
                  Forgot Key?
                </a>
              </div>

              {/* Sign In Button */}
              <div 
                className="submit-btn-wrapper animate-fade-in-up" 
                style={{ animationDelay: "0.7s" }}
              >
                <Button
                  type="submit"
                  variant="premium"
                  isLoading={isLoading}
                  isSuccess={isSuccess}
                  onMouseEnter={() => setIsSubmitHovered(true)}
                  onMouseLeave={() => setIsSubmitHovered(false)}
                >
                  {isLoading ? (
                    <>
                      <span>{isSuccess ? "Access Granted" : "Initializing..."}</span>
                      {!isSuccess && <div className="loading-spinner" aria-hidden="true"></div>}
                    </>
                  ) : (
                    <>
                      <span>Initialize Access</span>
                      <span className="material-symbols-outlined arrow-icon arrow-animate" aria-hidden="true">
                        north_east
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Footer Links */}
            <footer 
              className="form-footer animate-fade-in-up" 
              style={{ animationDelay: "0.8s" }}
            >
              <p className="footer-signup-text">
                New to the platform?{" "}
                <a className="footer-signup-link" href="#">
                  Request Access
                </a>
              </p>
              <div className="security-badge">
                <span className="material-symbols-outlined security-icon" aria-hidden="true">
                  shield
                </span>
                <span className="security-text">Quantum-Safe Encryption</span>
              </div>
            </footer>
          </div>
        </div>

        {/* Global Footer (Copyright) */}
        <div className="copyright-footer">
          <span className="copyright-text">© 2024 EDUTRACK ELITE</span>
          <div className="copyright-links">
            <a className="copyright-link" href="#">
              PRIVACY
            </a>
            <a className="copyright-link" href="#">
              SECURITY
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
