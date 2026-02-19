# Quick Start Guide - Email OTP Authentication

## 5-Minute Setup

### Step 1: Get Gmail App Password
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Enable 2-Step Verification (Security tab)
3. Go to "App passwords" → Select Mail & Windows Computer
4. Copy the 16-character password generated

### Step 2: Update Backend .env
```bash
cd backend
```

Edit `.env`:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=paste-16-char-password-here
JWT_SECRET=change-this-to-something-secure
FRONTEND_URL=http://localhost:5174
```

### Step 3: Install & Run
```bash
# Install dependencies
npm install

# Start backend
npm run dev
```

### Step 4: Start Frontend
In a new terminal:
```bash
cd frontend
npm run dev
```

### Step 5: Test

**Login Test:**
1. Open http://localhost:5174/
2. Enter your email
3. Click "Send OTP"
4. Check your email for OTP
5. Enter OTP and verify

**Registration Test:**
1. Go to http://localhost:5174/register
2. Fill form and click "Create Account"
3. Enter OTP from email
4. Account created!

## What's New

✅ OTP-based authentication (no passwords for login)
✅ Email verification for registration
✅ Automatic email sending (OTP + welcome emails)
✅ 10-minute OTP expiry
✅ Resend OTP functionality
✅ Beautiful UI with OTP input

## Files Updated/Created

**Backend:**
- `src/controllers/authController.js` - OTP logic
- `src/services/emailService.js` - Email sending
- `src/routes/authRoutes.js` - Auth endpoints
- `.env` - Email config

**Frontend:**
- `pages/LoginPage.jsx` - OTP login flow
- `pages/RegisterPage.jsx` - OTP registration flow
- `services/authService.js` - API integration
- `assets/styles/auth.css` - OTP styling

## API Endpoints

```
POST /api/auth/send-login-otp
POST /api/auth/verify-login-otp
POST /api/auth/register
POST /api/auth/send-registration-otp
POST /api/auth/verify-registration
```

## Key Features

- ✅ Secure OTP-based authentication
- ✅ Email OTP delivery
- ✅ Welcome email on registration
- ✅ JWT token generation
- ✅ OTP countdown timer
- ✅ Resend OTP with cooldown
- ✅ Error handling
- ✅ Responsive design

## Troubleshooting

**Email not received?**
- Check spam folder
- Verify app password (use 16-char password, not Gmail password)
- Check .env EMAIL_USER and EMAIL_PASSWORD
- Restart backend after env changes

**OTP not working?**
- OTP expires after 10 minutes
- Max 6 digits
- Check backend logs for errors
- Clear browser localStorage

**Can't connect to backend?**
- Ensure backend runs on port 5000
- Check FRONTEND_URL in backend .env
- Verify no port conflicts

## Next Steps

1. ✅ Email OTP authentication working
2. Next: Integrate with database (MongoDB/PostgreSQL)
3. Next: Add forgot password flow
4. Next: Add 2FA support
5. Next: Deploy to production

For detailed setup, see `AUTH_SETUP_GUIDE.md`
