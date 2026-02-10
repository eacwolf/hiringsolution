import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/auth.css";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [step, setStep] = useState("email"); // 'email' or 'reset'
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const validateReset = () => {
    const newErrors = {};

    if (!resetCode.trim()) {
      newErrors.resetCode = "Verification code is required";
    }

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

  const handleSendReset = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccessMessage(
        `Reset code sent to ${email}. Check your inbox and spam folder.`
      );
      setStep("reset");
      setSuccessMessage("");
    } catch (error) {
      setErrors({ general: "Failed to send reset code. Please try again." });
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
      // Simulate API call
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
          <li>Password reset via email</li>
          <li>Instant account access</li>
          <li>Enhanced security</li>
        </ul>
      </div>

      {/* Right side - Form */}
      <div className="auth-form-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>
              {step === "email" ? "Reset Password" : "Create New Password"}
            </h2>
            <p>
              {step === "email"
                ? "Enter your email to receive a reset code"
                : "Enter the code and your new password"}
            </p>
          </div>

          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          {step === "email" ? (
            <form onSubmit={handleSendReset}>
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
                />
                {errors.email && (
                  <span className="field-error">{errors.email}</span>
                )}
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>Sending...
                  </>
                ) : (
                  "Send Reset Code"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="code">Verification Code</label>
                <input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={resetCode}
                  onChange={(e) => {
                    setResetCode(e.target.value);
                    if (errors.resetCode)
                      setErrors({ ...errors, resetCode: "" });
                  }}
                />
                {errors.resetCode && (
                  <span className="field-error">{errors.resetCode}</span>
                )}
              </div>

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
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
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
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
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
                    <span className="spinner"></span>Resetting...
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