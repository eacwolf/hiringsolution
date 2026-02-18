# HireAI - AI-Powered Hiring Platform

A full-stack recruiting platform that uses AI (ChatGPT/OpenAI) to generate technical interview questions, evaluate candidate solutions, and rank candidates.

## Project Overview

### Features
- **Professional Login/Register System** - Secure authentication for recruiters
- **AI-Powered Question Generator** - Creates technical questions using ChatGPT/OpenAI
- **Test Case Generation** - Auto-generates test cases and reference solutions
- **Responsive UI** - Works seamlessly on desktop, tablet, and mobile
- **Fast Performance** - Buffering UI shows progress while generating
- **Question Storage** - Questions persist locally and can be shared

### Tech Stack

**Frontend:**
- React 18
- Vite (fast bundler)
- React Router (navigation)
- Modern CSS3

**Backend:**
- Node.js + Express.js
- OpenAI API (ChatGPT)
- CORS enabled

**Database:**
- localStorage (frontend caching)
- Ready for backend persistence

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository:**
```bash
cd c:\Users\akhil\hiring-platform
```

2. **Set up Frontend:**
```bash
cd frontend
npm install
```

3. **Set up Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Add your OPENAI_API_KEY to .env
```

### Running the Application

**Option 1: Run both frontend and backend together:**
```bash
npm run dev:all
```

**Option 2: Run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:backend
```

**Option 3: Run backend only (frontend uses mock mode):**
```bash
npm run dev:backend &
npm run dev
```

The app will be available at:
- **Frontend:** http://localhost:5174
- **Backend:** http://localhost:5000

## Project Structure

```
hireai-platform/
├── frontend/                    # React Vite app
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── CreateExamPage.jsx
│   │   │   └── GeneratedQuestionsPage.jsx
│   │   ├── components/         # Reusable components
│   │   ├── services/           # API integration
│   │   │   └── aiService.js   # ChatGPT service
│   │   ├── assets/styles/      # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env                    # API configuration
│
├── backend/                     # Express.js server
│   ├── src/
│   │   ├── server.js           # Express app
│   │   ├── routes/             # API routes
│   │   ├── controllers/        # Request handlers
│   │   └── services/           # Business logic
│   ├── package.json
│   ├── .env                    # OpenAI config
│   └── README.md
│
├── package.json                # Root scripts
└── README.md                   # This file
```

## Key Pages

### 1. **Login Page** (`/`)
- Email and password authentication
- Forgot password link
- Sign up option
- Remember me checkbox
- Professional gradient UI

### 2. **Register Page** (`/register`)
- Company name, email, password
- Terms & conditions acceptance
- Password confirmation
- Form validation

### 3. **Forgot Password Page** (`/forgot-password`)
- Two-step password reset
- Email verification
- New password creation

### 4. **Dashboard Page** (`/dashboard`)
- Welcome message
- Create exam button
- Company hiring overview

### 5. **Create Exam Page** (`/create-exam`)
- Domain selection (Engineering, CS, IT, etc.)
- Skill selection (Java, Python, etc.)
- Difficulty level (Easy, Medium, Hard)
- buffering UI shows progress
- Assessment configuration summary

### 6. **Generated Questions Page** (`/questions`)
- Displays AI-generated technical questions
- Shows reference solutions
- Test cases for every question
- Collapsible details view

## API Endpoints

### POST `/api/generate`
Generates technical interview questions.

**Request:**
```json
{
  "domain": "Engineering",
  "skill": "Java",
  "difficulty": "Medium"
}
```

**Response:**
```json
{
  "success": true,
  "metadata": { ... },
  "questions": [...]
}
```

## Configuration

### Frontend Environment (`.env`)
```
VITE_API_URL=http://localhost:5000
```

### Backend Environment (`.env`)
```
OPENAI_API_KEY=sk-your-key-here
PORT=5000
FRONTEND_URL=http://localhost:5174
NODE_ENV=development
```

## Features Implemented

✅ Professional authentication system
✅ CreateExamPage with form validation
✅ AI service with ChatGPT integration
✅ Mock generator fallback
✅ localStorage persistence
✅ Responsive design (desktop/mobile/tablet)
✅ Buffering UI during question generation
✅ Question display with solutions
✅ Express backend server
✅ CORS configuration
✅ Error handling and fallbacks

## Next Steps & Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication with JWT tokens
- [ ] Candidate exam interface
- [ ] Code execution sandbox for testing
- [ ] AI-based solution evaluation
- [ ] Candidate ranking and scoring
- [ ] Multiple interview stages
- [ ] Email notifications
- [ ] Admin dashboard for recruiters
- [ ] Analytics and reporting

## Development

### Local Testing

1. Start both servers:
```bash
npm run dev:all
```

2. Open browser to http://localhost:5174

3. Navigate through:
   - Login (click "Create one" to register)
   - Dashboard (click "Create New Exam")
   - CreateExam (fill form and click "Generate Assessment")
   - Questions (view generated questions)

### Testing Backend Only

```bash
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"domain":"Engineering","skill":"Java","difficulty":"Medium"}'
```

## Troubleshooting

**Backend not starting?**
- Check if OpenAI API key is set in `.env`
- Ensure port 5000 is not in use
- Run `npm install` in backend folder

**Frontend can't reach backend?**
- Check `VITE_API_URL` in frontend `.env`
- Ensure backend is running on port 5000
- Check browser console for CORS errors

**Questions not generating?**
- Verify OpenAI API key is valid
- Check network tab in browser DevTools
- Fall back to mock mode works automatically

## License

MIT

## Support

For issues or questions, refer to backend and frontend README files or check the repository issues.
