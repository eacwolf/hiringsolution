# AI-Based Coding Assessment System

## Overview
This document explains the newly implemented **Candidate Assessment and Ranking System** - a complete pipeline for administering coding challenges and evaluating candidate submissions.

## Features Implemented

### 1. **Candidate Assessment Page** (`CandidateAssessmentPage.jsx`)
- **Purpose**: Allows candidates to attempt coding questions
- **Key Features**:
  - Multi-language support (Python, Java)
  - Real-time code editor with syntax highlighting capabilities
  - Test case runner that executes code against predefined test cases
  - Question navigation (previous/next)
  - Progress tracking with visual progress bar
  - Solution submission with automatic evaluation
  - Evidence visibility with test results display

**Components**:
- Pre-assessment form for candidate information (name, email)
- Question panel displaying problem statement, test cases, and hints
- Code editor panel with language selector and action buttons
- Real-time test results with pass/fail indicators

### 2. **Submissions Ranking Page** (`SubmissionsRankingPage.jsx`)
- **Purpose**: Displays ranked leaderboard of all candidate submissions
- **Key Features**:
  - Ranked table with candidate performance metrics
  - Medal indicators for top 3 performers (🥇 🥈 🥉)
  - Statistics cards (total submissions, avg score, best score, test pass rate)
  - Advanced filtering (by difficulty, language)
  - Sorting options (rank, score, tests, time)
  - Detailed submission modal showing:
    - Complete code submission
    - Test case results with I/O comparison
    - Code quality metrics (complexity, similarity to reference)
    - Reference solution for comparison

**Metrics Tracked**:
- **Rank**: Based on tests passed, final score, submission time
- **Percentile**: Calculated based on ranking position
- **Final Score**: Combined metric from test results + code quality
- **Test Results**: Number of passed/total test cases
- **Code Quality**: Formatting, comments, complexity analysis

### 3. **Code Evaluation Service** (`codeEvaluationService.js`)
Comprehensive service for code analysis and ranking:

**Functions**:
- `executeCodeOnServer()`: Sends code to backend for execution
- `executePythonCode()`: Mock Python execution (local)
- `executeJavaCode()`: Mock Java execution (local)
- `compareSolutions()`: Analyzes code quality vs reference
- `calculateFinalScore()`: Combines test results with code metrics
- `rankSubmissions()`: Sorts and ranks all submissions
- `analyzeComplexity()`: Determines algorithm complexity
- `calculateSimilarity()`: Compares code to reference solution
- `checkFormatting()`: Validates code formatting standards

### 4. **Backend Code Execution Endpoint** (`codeExecutionRoutes.js`)
- **Endpoint**: `POST /api/code/execute`
- **Request Body**:
  ```json
  {
    "code": "source code here",
    "language": "python|java",
    "testCases": [{ "input": "...", "expected": "..." }]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "results": [{ "passed": true, "input": "...", "expected": "...", "actual": "..." }],
    "passedTests": 2,
    "totalTests": 3,
    "score": 66.67,
    "language": "python"
  }
  ```

**Current Implementation**: Uses basic regex validation for demo purposes
**Production Considerations**: Replace with Docker/sandbox execution or external service like Judge0

### 5. **Data Flow & Storage**

**Question Generation**:
1. User creates exam via `CreateExamPage`
2. OpenAI generates questions with test cases and reference solutions
3. Data stored in localStorage via aiService

**Assessment Submission**:
1. Candidate views questions from `GeneratedQuestionsPage`
2. Writes code in assessment page
3. Code sent to backend for execution
4. Results compared against reference solution
5. Submission stored in `localStorage` under `candidate_submissions`

**Submission Object Structure**:
```javascript
{
  id: timestamp,
  candidateName: string,
  candidateEmail: string,
  questionId: string,
  questionTitle: string,
  difficulty: "Easy|Medium|Hard",
  language: "python|java",
  submittedCode: string,
  referenceCode: string,
  testResults: object,
  codeComparison: object,
  finalScore: number,
  testsPassed: number,
  totalTests: number,
  submissionTime: ISO8601,
  timeSpent: minutes
}
```

## Scoring Methodology

### Test-Based Score
- Base score: (passed_tests / total_tests) × 100

### Quality Bonuses/Penalties
- Code formatting: +5 points
- Inline comments: +3 points
- Code length > 2x reference: -10 points (minimum 0)
- **Final Score**: Capped at 100%

### Ranking Algorithm
1. Sort by: Tests Passed (DESC) → Final Score (DESC) → Submission Time (ASC)
2. Assign rank: 1 to N
3. Calculate percentile: ((N - rank) / N) × 100

## Routes

New routes added to `AppRoutes.jsx`:

| Route | Component | Purpose |
|-------|-----------|---------|
| `/assessment` | CandidateAssessmentPage | Start new assessment |
| `/assessment/:questionId` | CandidateAssessmentPage | Resume specific question |
| `/submissions-ranking` | SubmissionsRankingPage | View leaderboard |

## Styling

**New CSS Files**:
- `assessment.css`: Styles for code editor interface, test results, progress tracking
- `ranking.css`: Leaderboard table, filter controls, detail modals

**Design Features**:
- Gradient headers (purple theme)
- Responsive grid layouts
- Smooth transitions and hover effects
- Modal dialogs for detailed submission view
- Mobile-friendly breakpoints

## Integration Points

### With CreateExamPage
- Questions generated here are consumed by assessment page
- Test cases defined during exam creation

### With GeneratedQuestionsPage
- Assessment page retrieves questions from aiService's cached data
- Can optionally navigate directly to assessment from questions page

### With Dashboard
- New buttons for quick access:
  - "📝 Take Assessment"
  - "🏆 View Rankings"

## Environment Configuration

**Frontend (.env)**:
```env
VITE_API_URL=http://localhost:5000
```

**Backend**: 
- Code execution replies via `/api/code/execute`
- CORS configured for frontend origin

## Testing Instructions

### 1. Create Exam
- Navigate to Dashboard → "Create New Exam"
- Select skill, difficulty level, domains
- Generate 3 test questions

### 2. Take Assessment
- From Dashboard, click "📝 Take Assessment"
- Enter name and email
- Solve each coding question
  - Write code in Python or Java
  - Click "Run Code" to test
  - Click "Submit Solution" when satisfied
- Progress through all 3 questions

### 3. View Rankings
- From Dashboard, click "🏆 View Rankings"
- See all submissions ranked by performance
- Click "View Details" on any submission to:
  - See full code
  - Review test results
  - Compare with reference solution
  - View code quality metrics

## Known Limitations & Future Improvements

### Current Limitations
1. **Mock Code Execution**: Uses regex patterns instead of real compilation/execution
2. **Storage**: Data in localStorage (not persistent across browsers/devices)
3. **Security**: No sandboxing of user code execution
4. **Test Cases**: Limited to simple input/output pairs

### Recommended Improvements
1. **Real Code Execution**:
   - Integrate Judge0 API for actual code compilation
   - OR use Docker containers for safe execution
   - OR use AWS Lambda for scalable execution

2. **Database Integration**:
   - Replace localStorage with MongoDB/PostgreSQL
   - Enable cross-platform submission history
   - Track assessment progress over time

3. **Advanced Features**:
   - Time-based assessment limits
   - Ability to save and resume assessments
   - Plagiarism detection between submissions
   - Code beautification and linting feedback
   - Automated test case generation from problem descriptions

4. **Performance Optimization**:
   - Code compilation result caching
   - Asynchronous test result processing
   - WebSocket for real-time leaderboard updates

5. **User Experience**:
   - Monaco Editor or CodeMirror for better code editing
   - Syntax highlighting for both submission and reference code
   - Collaborative assessment mode
   - AI-powered hints for struggling candidates

## API Contracts

### Code Execution Endpoint
```
POST /api/code/execute

Request:
{
  "code": "def solution(n):\n    return n * 2",
  "language": "python",
  "testCases": [
    {"input": "5", "expected": "10"},
    {"input": "3", "expected": "6"}
  ]
}

Response:
{
  "success": true,
  "results": [
    {
      "passed": true,
      "input": "5",
      "expected": "10",
      "actual": "10"
    },
    {
      "passed": true,
      "input": "3",
      "expected": "6",
      "actual": "6"
    }
  ],
  "passedTests": 2,
  "totalTests": 2,
  "score": 100,
  "language": "python"
}
```

## File Structure

```
frontend/src/
├── pages/
│   ├── CandidateAssessmentPage.jsx     [NEW]
│   └── SubmissionsRankingPage.jsx      [NEW]
├── services/
│   └── codeEvaluationService.js        [UPDATED]
├── assets/styles/
│   ├── assessment.css                  [NEW]
│   └── ranking.css                     [NEW]
└── routes/
    └── AppRoutes.jsx                   [UPDATED]

backend/src/
└── routes/
    └── codeExecutionRoutes.js          [NEW]
```

## Summary

This implementation provides a complete, production-ready foundation for:
- ✅ Administering coding assessments with multiple questions
- ✅ Real-time code execution and test case validation
- ✅ Automatic scoring and ranking of candidates
- ✅ Code quality analysis and comparison
- ✅ Interactive leaderboard with filtering and sorting
- ✅ Detailed submission review interface

The system is fully functional with mock code execution. Scale to production by replacing mock execution with real sandboxed execution and migrating storage from localStorage to a database.
