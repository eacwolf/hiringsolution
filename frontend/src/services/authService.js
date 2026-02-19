const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Send login OTP to email
 */
export async function sendLoginOTP(email) {
  const response = await fetch(`${API_URL}/api/auth/send-login-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to send OTP");
  }

  return response.json();
}

/**
 * Verify login OTP and get token
 */
export async function verifyLoginOTP(email, otp) {
  const response = await fetch(`${API_URL}/api/auth/verify-login-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to verify OTP");
  }

  return response.json();
}

/**
 * Register new account
 */
export async function registerAccount(companyName, email, password) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ companyName, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Registration failed");
  }

  return response.json();
}

/**
 * Send registration OTP
 */
export async function sendRegistrationOTP(email) {
  const response = await fetch(`${API_URL}/api/auth/send-registration-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to send OTP");
  }

  return response.json();
}

/**
 * Verify registration and create account
 */
export async function verifyRegistration(email, otp) {
  const response = await fetch(`${API_URL}/api/auth/verify-registration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Verification failed");
  }

  return response.json();
}

/**
 * Save token to localStorage
 */
export function saveToken(token) {
  localStorage.setItem("authToken", token);
}

/**
 * Get token from localStorage
 */
export function getToken() {
  return localStorage.getItem("authToken");
}

/**
 * Remove token from localStorage
 */
export function removeToken() {
  localStorage.removeItem("authToken");
}

/**
 * Check if user is logged in
 */
export function isLoggedIn() {
  return !!getToken();
}
