# HireAI Backend

Express.js backend server for the HireAI AI-powered hiring platform. Integrates with OpenAI/ChatGPT to generate technical interview questions.

## Setup

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- OpenAI API key

### Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
```

3. **Add your OpenAI API key to `.env`:**
```
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=5000
FRONTEND_URL=http://localhost:5174
```

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### POST `/api/generate`

Generate AI interview questions based on domain, skill, and difficulty.

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
  "metadata": {
    "generatedBy": "openai-api",
    "generatedAt": "2026-02-10T...",
    "form": { "domain": "Engineering", "skill": "Java", "difficulty": "Medium" }
  },
  "questions": [
    {
      "id": "q-...",
      "title": "...",
      "description": "...",
      "difficulty": "Medium",
      "testCases": [...],
      "referenceSolution": "...",
      "createdAt": "..."
    }
  ]
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-10T..."
}
```

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Node environment (development, production)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5174)

## Project Structure

```
backend/
├── src/
│   ├── server.js                 # Express app setup
│   ├── routes/
│   │   └── generateRoutes.js     # API routes
│   ├── controllers/
│   │   └── generateController.js # Request handlers
│   └── services/
│       └── chatgptService.js     # ChatGPT integration
├── package.json
├── .env.example
└── .gitignore
```

## Integration with Frontend

The frontend calls `POST /api/generate` from the CreateExamPage. The service automatically:
1. Sends request to backend with form data
2. Falls back to mock generator if backend unavailable
3. Saves results to localStorage
4. Navigates to questions page on success

## Error Handling

- Missing required fields return 400 Bad Request
- API failures fall back to mock generator
- Server errors return 500 with error details

## Future Enhancements

- Authentication and authorization
- Database persistence
- Question caching
- Multiple AI provider support (Claude, etc.)
- WebSocket for real-time updates
- Rate limiting and request queuing

## Support

For issues or questions, check the project repository or documentation.
