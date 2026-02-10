import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/auth.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setErrors({ general: "Login failed. Please try again." });
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
          AI-Powered Technical Recruitment & Assessment Platform
        </p>
        <ul className="brand-features">
          <li>Automated exam generation</li>
          <li>AI-driven candidate evaluation</li>
          <li>Instant ranking & insights</li>
          <li>Enterprise-grade security</li>
        </ul>
      </div>

      {/* Right side - Form */}
      <div className="auth-form-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your hiring dashboard</p>
          </div>

          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <form onSubmit={handleLogin}>
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
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="form-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className={errors.password ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁" : "👁‍🗨"}
                </button>
              </div>
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>

            <div className="remember-forgot">
              <div className="remember-me">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <button
                type="button"
                className="forgot-link"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="auth-links">
            <div className="auth-link-item">
              Don't have an account?{" "}
              <button onClick={() => navigate("/register")}>
                Create one
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}