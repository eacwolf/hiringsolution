import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send OTP email for login/verification
 */
export async function sendOTPEmail(email, otp) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your HireAI Login OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px;">
            <h1 style="color: white; margin: 0;">HireAI</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border: 1px solid #dee2e6;">
            <h2 style="color: #333;">Your Login OTP</h2>
            <p style="color: #666; font-size: 16px;">Enter this OTP to verify your email and complete your login:</p>
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h1 style="color: #667eea; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #999; font-size: 14px;">This OTP will expire in 10 minutes.</p>
            <p style="color: #999; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          </div>
          <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>© 2026 HireAI. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
}

/**
 * Send welcome email for new account
 */
export async function sendWelcomeEmail(email, companyName) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to HireAI - Your Account is Ready!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px;">
            <h1 style="color: white; margin: 0;">HireAI</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border: 1px solid #dee2e6;">
            <h2 style="color: #333;">Welcome to HireAI, ${companyName}!</h2>
            <p style="color: #666; font-size: 16px;">Your account has been successfully created. You're now ready to:</p>
            <ul style="color: #666; line-height: 1.8;">
              <li>Generate AI-powered technical interviews</li>
              <li>Evaluate candidates automatically</li>
              <li>Track candidate performance</li>
              <li>Streamline your hiring process</li>
            </ul>
            <div style="margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a>
            </div>
            <p style="color: #999; font-size: 14px;">Need help? Contact us at ${process.env.SUPPORT_EMAIL || 'support@hireai.com'}</p>
          </div>
          <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>© 2026 HireAI. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
}

/**
 * Send account confirmation email
 */
export async function sendConfirmationEmail(email, confirmationLink) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your HireAI Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px;">
            <h1 style="color: white; margin: 0;">HireAI</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border: 1px solid #dee2e6;">
            <h2 style="color: #333;">Verify Your Email Address</h2>
            <p style="color: #666; font-size: 16px;">Click the button below to confirm your email address:</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${confirmationLink}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">Verify Email</a>
            </div>
            <p style="color: #999; font-size: 14px;">Or copy this link: <br/><small>${confirmationLink}</small></p>
            <p style="color: #999; font-size: 14px;">This link will expire in 24 hours.</p>
          </div>
          <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>© 2026 HireAI. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw new Error("Failed to send confirmation email");
  }
}
