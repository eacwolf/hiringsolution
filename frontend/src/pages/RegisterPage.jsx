import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/auth.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("form"); // form, verify
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [generatedOTP, setGeneratedOTP] = useState(""); // Store generated OTP locally

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

  // Generate 6-digit OTP
  function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Generate OTP locally
      const newOTP = generateOTP();
      setGeneratedOTP(newOTP);

      setSuccessMessage(`✓ Account details saved! OTP: ${newOTP} (sent to ${email})`);

      setOtpExpiry(Date.now() + 10 * 60 * 1000); // 10 minutes
      setStep("verify");

      setTimeout(() => setSuccessMessage(""), 4000);

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
    } catch (error) {
      setErrors({ general: error.message });
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

    // Check if entered OTP matches generated OTP
    if (otp !== generatedOTP) {
      setErrors({ general: "❌ Incorrect OTP. Please try again." });
      return;
    }

    setLoading(true);
    try {
      // Store user credentials in localStorage
      const storedUsers = JSON.parse(localStorage.getItem("hireai_users") || "{}");
      storedUsers[email] = {
        companyName,
        email,
        password,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("hireai_users", JSON.stringify(storedUsers));

      setSuccessMessage(`🎉 Welcome ${companyName}! Your account has been created successfully. Redirecting to login...`);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    if (resendCountdown > 0) return;

    setLoading(true);
    try {
      const newOTP = generateOTP();
      setGeneratedOTP(newOTP);
      setSuccessMessage(`✓ New OTP generated: ${newOTP}. Check above!`);
      setOtp("");
      setOtpExpiry(Date.now() + 10 * 60 * 1000);
      setResendCountdown(60);

      setTimeout(() => setSuccessMessage(""), 4000);

      const timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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
            <h2>
              {step === "form" ? "Create Account" : "Verify Email"}
            </h2>
            <p>
              {step === "form"
                ? "Start automating your technical hiring"
                : "Enter the OTP shown above"}
            </p>
          </div>

          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          {step === "form" && (
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
                  disabled={loading}
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
                  disabled={loading}
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
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
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
                  disabled={loading}
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
          )}

          {step === "verify" && (
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
                  "Verify & Create Account"
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
                    : "Generate New OTP"}
                </button>
                <button
                  type="button"
                  className="back-link"
                  onClick={() => {
                    setStep("form");
                    setOtp("");
                    setErrors({});
                  }}
                >
                  Back
                </button>
              </div>
            </form>
          )}

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

