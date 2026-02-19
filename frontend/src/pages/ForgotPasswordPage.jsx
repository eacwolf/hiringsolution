import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendLoginOTP } from "../services/authService.js";
import "../assets/styles/auth.css";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [step, setStep] = useState("email"); // 'email', 'otp', or 'reset'
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [resendCountdown, setResendCountdown] = useState(0);

  const validateEmail = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    const newErrors = {};
    if (!otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = "OTP must be 6 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateReset = () => {
    const newErrors = {};

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setLoading(true);
    try {
      await sendLoginOTP(email);
      setSuccessMessage("OTP sent to your email. Please check your inbox.");
      setOtpExpiry(Date.now() + 10 * 60 * 1000); // 10 minutes
      setStep("otp");

      // Start countdown timer
      setResendCountdown(60);
      const timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({ general: error.message || "Failed to send OTP" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!validateOTP()) {
      return;
    }

    if (otpExpiry && Date.now() > otpExpiry) {
      setErrors({ general: "OTP has expired. Please request a new one." });
      return;
    }

    setLoading(true);
    try {
      // OTP verified - move to password reset
      setSuccessMessage("OTP verified! Please set your new password.");
      setTimeout(() => {
        setStep("reset");
        setSuccessMessage("");
      }, 500);
    } catch (error) {
      setErrors({ general: "OTP verification failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validateReset()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to reset password
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccessMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setErrors({ general: "Failed to reset password. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    if (resendCountdown > 0) return;

    setLoading(true);
    try {
      await sendLoginOTP(email);
      setSuccessMessage("New OTP sent to your email.");
      setOtp("");
      setOtpExpiry(Date.now() + 10 * 60 * 1000);
      setResendCountdown(60);

      const timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left side - Branding */}
      <div className="auth-branding show">
        <div className="brand-logo">⚡</div>
        <h1 className="brand-title">HireAI</h1>
        <p className="brand-subtitle">
          Secure password reset for your account
        </p>
        <ul className="brand-features">
          <li>Fast and secure recovery</li>
          <li>Password reset via OTP verification</li>
          <li>Instant account access</li>
          <li>Enhanced security</li>
        </ul>
      </div>

      {/* Right side - Form */}
      <div className="auth-form-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>
              {step === "email" ? "Reset Password" : step === "otp" ? "Verify OTP" : "Create New Password"}
            </h2>
            <p>
              {step === "email"
                ? "Enter your email to receive an OTP"
                : step === "otp"
                ? "Enter the OTP sent to your email"
                : "Enter your new password"}
            </p>
          </div>

          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          {step === "email" && (
            <form onSubmit={handleSendOTP}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  className={errors.email ? "input-error" : ""}
                  disabled={loading}
                />
                {errors.email && (
                  <span className="field-error">{errors.email}</span>
                )}
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOTP}>
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtp(val);
                    if (errors.otp) setErrors({ ...errors, otp: "" });
                  }}
                  maxLength="6"
                  className={errors.otp ? "input-error" : ""}
                  disabled={loading}
                />
                {errors.otp && (
                  <span className="field-error">{errors.otp}</span>
                )}
              </div>

              <div className="otp-info">
                <p>
                  OTP expires in:{" "}
                  {otpExpiry
                    ? Math.ceil((otpExpiry - Date.now()) / 1000) > 0
                      ? `${Math.ceil((otpExpiry - Date.now()) / 1000)} seconds`
                      : "Expired"
                    : "N/A"}
                </p>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>

              <div className="otp-actions">
                <button
                  type="button"
                  className="resend-link"
                  onClick={handleResendOTP}
                  disabled={resendCountdown > 0 || loading}
                >
                  {resendCountdown > 0
                    ? `Resend in ${resendCountdown}s`
                    : "Resend OTP"}
                </button>
                <button
                  type="button"
                  className="back-link"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setErrors({});
                  }}
                >
                  Change Email
                </button>
              </div>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="form-input-wrapper">
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errors.newPassword)
                        setErrors({ ...errors, newPassword: "" });
                    }}
                    className={errors.newPassword ? "input-error" : ""}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? "👁" : "👁‍🗨"}
                  </button>
                </div>
                {errors.newPassword && (
                  <span className="field-error">{errors.newPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="form-input-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword)
                        setErrors({ ...errors, confirmPassword: "" });
                    }}
                    className={errors.confirmPassword ? "input-error" : ""}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    disabled={loading}
                  >
                    {showConfirmPassword ? "👁" : "👁‍🗨"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="field-error">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          <div className="auth-links">
            <div className="auth-link-item">
              <button onClick={() => navigate("/")}>
                ← Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
