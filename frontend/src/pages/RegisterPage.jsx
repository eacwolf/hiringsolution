import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/auth.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!companyName.trim()) {
      newErrors.companyName = "Company name is required";
    } else if (companyName.length < 2) {
      newErrors.companyName = "Company name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccessMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setErrors({ general: "Registration failed. Please try again." });
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
          Join thousands of companies using AI for smarter hiring
        </p>
        <ul className="brand-features">
          <li>30-day free trial</li>
          <li>No credit card required</li>
          <li>Setup takes 5 minutes</li>
          <li>24/7 customer support</li>
        </ul>
      </div>

      {/* Right side - Form */}
      <div className="auth-form-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Start automating your technical hiring</p>
          </div>

          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="company">Company Name</label>
              <input
                id="company"
                type="text"
                placeholder="Your company name"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  if (errors.companyName) setErrors({ ...errors, companyName: "" });
                }}
              />
              {errors.companyName && (
                <span className="field-error">{errors.companyName}</span>
              )}
            </div>

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

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="form-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
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
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirm">Confirm Password</label>
              <div className="form-input-wrapper">
                <input
                  id="confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                  }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "👁" : "👁‍🗨"}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="remember-me" style={{ marginTop: "15px", marginBottom: "20px" }}>
              <input
                id="terms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => {
                  setAgreeToTerms(e.target.checked);
                  if (errors.terms) setErrors({ ...errors, terms: "" });
                }}
              />
              <label htmlFor="terms">
                I agree to the terms & conditions and privacy policy
              </label>
            </div>
            {errors.terms && (
              <span className="field-error" style={{ display: "block", marginBottom: "15px" }}>
                {errors.terms}
              </span>
            )}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="auth-links">
            <div className="auth-link-item">
              Already have an account?{" "}
              <button onClick={() => navigate("/")}>
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
