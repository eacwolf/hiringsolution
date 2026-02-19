import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import { getLatest } from "../services/aiService";
import { executeCodeOnServer, calculateFinalScore, compareSolutions } from "../services/codeEvaluationService";
import Loader from "../components/Loader";
import "../assets/styles/assessment.css";

export default function CandidateAssessmentPage() {
  const navigate = useNavigate();
  const { questionId } = useParams();
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [noQuestions, setNoQuestions] = useState(false);

  useEffect(() => {
    const latest = getLatest();
    if (latest && latest.questions && latest.questions.length > 0) {
      setQuestions(latest.questions);
    } else {
      setNoQuestions(true);
    }
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleRunCode = async () => {
    if (!code.trim()) {
      alert("Please write some code first");
      return;
    }

    setLoading(true);
    try {
      const result = await executeCodeOnServer(code, language, currentQuestion?.testCases || []);
      setTestResults(result);
      setShowResults(true);
    } catch (error) {
      alert("Error executing code: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSolution = () => {
    if (!code.trim()) {
      alert("Please write some code first");
      return;
    }

    if (!testResults || !testResults.success) {
      alert("Please run the code successfully first before submitting");
      return;
    }

    const comparison = compareSolutions(code, currentQuestion?.referenceSolution || "");
    const finalScore = calculateFinalScore(testResults, comparison);

    const submission = {
      id: Date.now(),
      candidateName: candidateName || "Anonymous",
      candidateEmail: candidateEmail || "not-provided@email.com",
      questionId: currentQuestion?.id || currentQuestionIndex,
      questionTitle: currentQuestion?.title,
      difficulty: currentQuestion?.difficulty,
      language,
      submittedCode: code,
      referenceCode: currentQuestion?.referenceSolution,
      testResults: testResults || { score: 0, results: [] },
      codeComparison: {
        codeLength: comparison.codeLength.submitted,
        complexity: comparison.complexity,
        similarities: comparison.similarities,
        hasComments: comparison.hasComments,
        isWellFormatted: comparison.isWellFormatted,
      },
      finalScore,
      testsPassed: testResults?.passedTests || 0,
      totalTests: testResults?.totalTests || 0,
      submissionTime: new Date().toISOString(),
      timeSpent: calculateTimeSpent(),
    };

    // Store submission
    const allSubmissions = JSON.parse(localStorage.getItem("candidate_submissions") || "[]");
    allSubmissions.push(submission);
    localStorage.setItem("candidate_submissions", JSON.stringify(allSubmissions));
    setSubmissions([...submissions, submission]);

    alert(`Solution submitted! Score: ${finalScore}%`);
    
    // Move to next question or show ranking
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCode("");
      setTestResults(null);
      setShowResults(false);
    } else {
      navigate("/submissions-ranking");
    }
  };

  const handleStartAssessment = () => {
    if (!candidateName.trim() || !candidateEmail.trim()) {
      alert("Please enter your name and email");
      return;
    }
    setAssessmentStarted(true);
  };

  const calculateTimeSpent = () => {
    // In production, track actual time
    return Math.floor(Math.random() * 30) + 5; // 5-35 minutes
  };

  if (!assessmentStarted) {
    if (noQuestions) {
      return (
        <AppShell>
          <div className="assessment-container">
            <div className="empty-state">
              <h2>No questions available</h2>
              <p>Please generate questions first</p>
              <button
                className="btn-primary"
                onClick={() => navigate("/create-exam")}
              >
                Create Assessment
              </button>
            </div>
          </div>
        </AppShell>
      );
    }

    return (
      <AppShell>
        <div className="assessment-intro">
          <div className="intro-card">
            <h1>Technical Coding Assessment</h1>
            <p>Test your coding skills with AI-generated questions</p>

            <div className="intro-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="intro-stats">
                <div className="stat">
                  <span className="stat-value">{questions.length}</span>
                  <span className="stat-label">Questions</span>
                </div>
                <div className="stat">
                  <span className="stat-value">90</span>
                  <span className="stat-label">Minutes</span>
                </div>
                <div className="stat">
                  <span className="stat-value">Auto</span>
                  <span className="stat-label">Evaluated</span>
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={handleStartAssessment}
                style={{ marginTop: "30px", fontSize: "16px", padding: "12px 30px" }}
              >
                Start Assessment
              </button>

              <div className="intro-note">
                <h4>Assessment Rules:</h4>
                <ul>
                  <li>Write working code in Java or Python</li>
                  <li>Your code will be tested against multiple test cases</li>
                  <li>Passing all tests will give you full marks</li>
                  <li>Code quality and efficiency are also evaluated</li>
                  <li>You can submit once per question</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!currentQuestion) {
    return (
      <AppShell>
        <div className="assessment-container">
          <div className="empty-state">
            <h2>Assessment Complete!</h2>
            <p>All questions answered. View your ranking.</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/submissions-ranking")}
            >
              View Rankings
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="assessment-container">
        {/* Header */}
        <div className="assessment-header">
          <div className="header-info">
            <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
            <span className="difficulty-badge" style={{
              backgroundColor: currentQuestion.difficulty === "Easy" ? "#10b981" : 
                             currentQuestion.difficulty === "Medium" ? "#f59e0b" : "#ef4444"
            }}>
              {currentQuestion.difficulty}
            </span>
          </div>
          <div className="header-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
              }}></div>
            </div>
            <span className="progress-text">
              {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
            </span>
          </div>
        </div>

        <div className="assessment-body">
          {/* Left: Question Panel */}
          <div className="question-panel">
            <div className="question-content">
              <h3>{currentQuestion.title}</h3>
              <p className="question-description">{currentQuestion.description}</p>
              
              {currentQuestion.problemStatement && (
                <div className="problem-section">
                  <h4>Problem Statement</h4>
                  <p>{currentQuestion.problemStatement}</p>
                </div>
              )}

              {currentQuestion.constraints && (
                <div className="constraints-section">
                  <h4>Constraints</h4>
                  <p className="constraints-text">{currentQuestion.constraints}</p>
                </div>
              )}

              <div className="test-cases-section">
                <h4>Test Cases:</h4>
                <div className="test-cases-list">
                  {currentQuestion.testCases?.map((tc, idx) => (
                    <div key={idx} className="test-case">
                      <span className="test-label">Test {idx + 1}:</span>
                      <div className="test-io">
                        <div>Input: <code>{tc.input}</code></div>
                        <div>Output: <code>{tc.expected}</code></div>
                        {tc.explanation && <div className="explanation">{tc.explanation}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {currentQuestion.hints && (
                <details className="hints-section">
                  <summary>View Hints</summary>
                  <ul>
                    {currentQuestion.hints.map((hint, idx) => (
                      <li key={idx}>{hint}</li>
                    ))}
                  </ul>
                </details>
              )}

              <details className="reference-solution">
                <summary>View Reference Solution (Hint)</summary>
                <pre className="code-preview">{currentQuestion.referenceSolution}</pre>
                {currentQuestion.solutionExplanation && (
                  <p className="solution-explanation">{currentQuestion.solutionExplanation}</p>
                )}
              </details>
            </div>
          </div>

          {/* Right: Code Editor Panel */}
          <div className="editor-panel">
            <div className="editor-header">
              <label>Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="language-select"
                disabled={showResults}
              >
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>
            </div>

            <textarea
              className="code-editor"
              placeholder={language === "java" 
                ? `public class Solution {
    public int solution(String input) {
        // Write your solution here
        int result = 0;
        // TODO: Implement the solution
        return result;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        // Test your solution
    }
}`
                : `def solution(input_str):
    """
    Solve the problem here
    Input: input_str (string)
    Return: the expected output
    """
    # TODO: Implement the solution
    result = 0
    return result

# Test your solution
if __name__ == "__main__":
    test_input = "input"
    print(solution(test_input))`
              }
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={showResults}
            />

            <div className="editor-actions">
              <button
                className="btn-run"
                onClick={handleRunCode}
                disabled={loading || showResults}
              >
                {loading ? "Running..." : "Run Code"}
              </button>
              <button
                className="btn-submit"
                onClick={handleSubmitSolution}
                disabled={loading || !testResults?.success}
              >
                Submit Solution
              </button>
              {showResults && (
                <button
                  className="btn-reset"
                  onClick={() => {
                    setCode("");
                    setTestResults(null);
                    setShowResults(false);
                  }}
                >
                  Reset
                </button>
              )}
            </div>

            {/* Test Results */}
            {showResults && testResults && (
              <div className="results-section">
                <div className="results-header">
                  <h4>Test Results</h4>
                  <span className={`score-badge ${testResults.success ? "success" : "error"}`}>
                    {testResults.success 
                      ? `${testResults.passedTests}/${testResults.totalTests} Passed` 
                      : "Error"}
                  </span>
                </div>

                {testResults.success ? (
                  <div className="results-list">
                    {testResults.results?.map((result, idx) => (
                      <div key={idx} className={`result-item ${result.passed ? "pass" : "fail"}`}>
                        <div className="result-status">
                          <span className="status-icon">{result.passed ? "✓" : "✗"}</span>
                          <span>Test Case {idx + 1}</span>
                        </div>
                        <div className="result-details">
                          <div>Input: <code>{result.input}</code></div>
                          <div>Expected: <code>{result.expected}</code></div>
                          {result.actual && <div>Got: <code>{result.actual}</code></div>}
                          {result.error && <div className="error-text">{result.error}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="error-message">{testResults.error}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="assessment-footer">
          <button
            className="btn-secondary"
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
          >
            Previous Question
          </button>
          <span className="question-counter">{currentQuestionIndex + 1} / {questions.length}</span>
          <button
            className="btn-secondary"
            onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next Question
          </button>
        </div>
      </div>
    </AppShell>
  );
}
