import express from "express";
import {
  sendLoginOTP,
  verifyLoginOTP,
  register,
  verifyRegistration,
  sendRegistrationOTP,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * POST /api/auth/send-login-otp
 * Send OTP to email for login
 */
router.post("/send-login-otp", sendLoginOTP);

/**
 * POST /api/auth/verify-login-otp
 * Verify login OTP and get JWT token
 */
router.post("/verify-login-otp", verifyLoginOTP);

/**
 * POST /api/auth/register
 * Register new account
 */
router.post("/register", register);

/**
 * POST /api/auth/send-registration-otp
 * Send OTP for registration
 */
router.post("/send-registration-otp", sendRegistrationOTP);

/**
 * POST /api/auth/verify-registration
 * Verify registration OTP and create account
 */
router.post("/verify-registration", verifyRegistration);

export default router;
