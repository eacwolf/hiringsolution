import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail, sendWelcomeEmail } from "../services/emailService.js";

// In-memory storage (replace with database in production)
const users = new Map();
const otpStore = new Map(); // email -> { otp, expiresAt }
const pendingRegistrations = new Map(); // email -> { companyName, password, hash }

/**
 * Generate random 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send Login OTP
 */
export async function sendLoginOTP(req, res) {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(email, { otp, expiresAt });

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.json({
      success: true,
      message: "OTP sent to your email",
      email,
    });
  } catch (error) {
    console.error("Error in sendLoginOTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}

/**
 * Verify Login OTP and issue token
 */
export async function verifyLoginOTP(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const storedOTP = otpStore.get(email);

    if (!storedOTP) {
      return res.status(400).json({ error: "No OTP found for this email. Request a new one." });
    }

    if (Date.now() > storedOTP.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ error: "OTP has expired. Request a new one." });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // OTP verified successfully
    otpStore.delete(email);

    // Create or get user
    let user = users.get(email) || {
      email,
      company: "Company Name",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    user.lastLogin = new Date().toISOString();
    users.set(email, user);

    // Generate JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        email: user.email,
        company: user.company,
      },
    });
  } catch (error) {
    console.error("Error in verifyLoginOTP:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
}

/**
 * Register new account
 */
export async function register(req, res) {
  try {
    const { companyName, email, password } = req.body;

    if (!companyName || !email || !password) {
      return res.status(400).json({
        error: "Company name, email, and password are required",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Check if user already exists
    if (users.has(email)) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Store pending registration
    pendingRegistrations.set(email, {
      companyName,
      password: passwordHash,
      createdAt: new Date().toISOString(),
    });

    // Generate verification token
    const verificationToken = jwt.sign(
      { email, type: "register" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    const confirmationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // Send confirmation email
    await sendOTPEmail(email, generateOTP()); // You can use this or the confirmation email approach

    res.json({
      success: true,
      message: "Registration initiated. Please check your email for verification.",
      email,
    });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ error: "Registration failed" });
  }
}

/**
 * Verify registration and create account
 */
export async function verifyRegistration(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const storedOTP = otpStore.get(email);

    if (!storedOTP) {
      return res.status(400).json({ error: "No OTP found for this email" });
    }

    if (Date.now() > storedOTP.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ error: "OTP has expired" });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const pendingReg = pendingRegistrations.get(email);

    if (!pendingReg) {
      return res.status(400).json({ error: "No pending registration for this email" });
    }

    // Create user account
    const user = {
      email,
      company: pendingReg.companyName,
      passwordHash: pendingReg.password,
      verified: true,
      createdAt: new Date().toISOString(),
    };

    users.set(email, user);
    pendingRegistrations.delete(email);
    otpStore.delete(email);

    // Generate JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "Account verified and created successfully",
      token,
      user: {
        email: user.email,
        company: user.company,
      },
    });
  } catch (error) {
    console.error("Error in verifyRegistration:", error);
    res.status(500).json({ error: "Verification failed" });
  }
}

/**
 * Send registration OTP
 */
export async function sendRegistrationOTP(req, res) {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    if (users.has(email)) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(email, { otp, expiresAt });

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.json({
      success: true,
      message: "OTP sent to your email",
      email,
    });
  } catch (error) {
    console.error("Error in sendRegistrationOTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}
