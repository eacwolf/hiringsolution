# Email & OTP Authentication Setup Guide

This guide explains how to set up the email OTP authentication system for the HireAI platform.

## Overview

The authentication system uses One-Time Passwords (OTP) sent via email for secure login and registration:

- **Login**: Users enter their email → receive OTP → verify OTP to login
- **Registration**: Users fill account details → receive OTP → verify to create account
- **Email Notifications**: Welcome emails sent upon successful registration

## Backend Setup

### 1. Install Dependencies

The backend dependencies have already been added to `package.json`. Install them:

```bash
cd backend
npm install
```

This installs:
- `nodemailer`: Email service library
- `jsonwebtoken`: JWT token generation
- `bcryptjs`: Password hashing
- `mongoose`: MongoDB support (for future use)

### 2. Configure Email Service

Edit `backend/.env` and set up Gmail SMTP:

```env
# Email Configuration (Gmail SMTP)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SUPPORT_EMAIL=support@hireai.com

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production

# Frontend URL
FRONTEND_URL=http://localhost:5174
```

#### Setting up Gmail App Password:

1. Go to [Google Account Settings](https://myaccount.google.com)
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **App passwords**
4. Select "Mail" and "Windows Computer"
5. Google will generate a 16-character password
6. Use this password in `EMAIL_PASSWORD` in `.env`

**Note**: Do NOT use your main Gmail password. App passwords are more secure.

### 3. Update .env Files

**Backend (.env):**
```env
# OpenAI Configuration
OPENAI_API_KEY=your-key-here

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5174

# Email Configuration (Gmail SMTP)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SUPPORT_EMAIL=support@hireai.com

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
```

**Frontend (.env or .env.local):**
```env
VITE_API_URL=http://localhost:5000
```

## API Endpoints

### Authentication Routes

#### 1. Send Login OTP
```
POST /api/auth/send-login-otp
Body: { email: "user@example.com" }
Response: { success: true, message: "OTP sent to your email", email }
```

#### 2. Verify Login OTP
```
POST /api/auth/verify-login-otp
Body: { email: "user@example.com", otp: "123456" }
Response: { success: true, token: "jwt-token", user: { email, company } }
```

#### 3. Register Account
```
POST /api/auth/register
Body: { companyName: "Company", email: "user@example.com", password: "password123" }
Response: { success: true, message: "Account details saved. Please verify your email." }
```

#### 4. Send Registration OTP
```
POST /api/auth/send-registration-otp
Body: { email: "user@example.com" }
Response: { success: true, message: "OTP sent to your email" }
```

#### 5. Verify Registration
```
POST /api/auth/verify-registration
Body: { email: "user@example.com", otp: "123456" }
Response: { success: true, token: "jwt-token", user: { email, company } }
```

## Frontend Implementation

### Login Flow

1. User enters email
2. Click "Send OTP" → OTP sent to email
3. User receives email with 6-digit OTP
4. User enters OTP on page
5. Click "Verify OTP" → Login successful
6. User redirected to dashboard

### Registration Flow

1. User fills form (company name, email, password)
2. Click "Create Account"
3. Account details saved, OTP sent to email
4. User receives email with OTP
5. User enters OTP
6. Click "Verify & Create Account"
7. Account created and user redirected to dashboard

## Email Templates

### Login OTP Email
- Professional branded email
- 6-digit OTP displayed prominently
- 10-minute expiry notice
- HireAI branding

### Registration Confirmation Email
- Welcome message with company name
- Features list
- Dashboard link
- Support contact

### Account Created Email
- Congratulatory message
- Account activation confirmation
- Dashboard access link
- Feature overview

## Security Notes

1. **OTP Expiry**: OTP expires in 10 minutes
2. **Token Expiry**: JWT tokens expire in 7 days
3. **Password Requirements**: Minimum 8 characters
4. **Data Storage**: Using in-memory storage (replace with database in production)
5. **HTTPS**: Always use HTTPS in production
6. **JWT Secret**: Change `JWT_SECRET` in production to a strong key

## Testing

### Test Email Sending

```bash
# Start backend server
cd backend
npm run dev
```

### Test OTP Login Flow

1. Go to `http://localhost:5174/` (login page)
2. Enter your test email
3. Click "Send OTP"
4. Check your email for OTP
5. Enter OTP and verify

### Test Registration Flow

1. Go to `http://localhost:5174/register`
2. Fill in company name, email, password
3. Click "Create Account"
4. Check email for OTP
5. Enter OTP and verify
6. Should be redirected to dashboard

## Troubleshooting

### OTP Not Received
- Check email spam folder
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` are correct
- Check app password (not main Gmail password)
- Ensure 2-factor authentication is enabled

### Error: "Failed to send OTP"
- Check backend .env file has email credentials
- Verify internet connection
- Check Gmail app password is correct
- Ensure app password begins with lowercase letters

### Token Issues
- Clear browser localStorage
- Check `JWT_SECRET` in .env
- Verify token hasn't expired

## Production Considerations

1. **Database**: Replace in-memory storage with MongoDB/PostgreSQL
2. **Email Service**: Consider SendGrid, Mailgun, or AWS SES for production
3. **Environment Variables**: Use secure vault like AWS Secrets Manager
4. **Rate Limiting**: Add rate limiting to prevent OTP brute force
5. **HTTPS Only**: Enforce HTTPS in production
6. **CORS**: Update CORS configuration for production domains
7. **Monitoring**: Add logging and monitoring for failed OTP attempts

## File Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── authController.js (handles auth logic)
│   ├── services/
│   │   └── emailService.js (email sending)
│   ├── routes/
│   │   └── authRoutes.js (auth endpoints)
│   └── server.js (Express server)
└── .env (configuration)

frontend/
├── src/
│   ├── services/
│   │   └── authService.js (API calls)
│   ├── pages/
│   │   ├── LoginPage.jsx (OTP login)
│   │   └── RegisterPage.jsx (OTP registration)
│   └── assets/styles/
│       └── auth.css (styling for OTP)
└── .env (configuration)
```

## Next Steps

1. Configure email credentials in `.env`
2. Install dependencies: `npm install`
3. Start backend: `npm run dev`
4. Start frontend: `npm run dev`
5. Test the authentication flows
6. Update database to persistent storage
7. Deploy to production

## Support

For issues or questions about the authentication system, check:
- Backend logs for API errors
- Browser console for frontend errors
- Email server logs for delivery issues
- .env file configuration
