import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { rankSubmissions } from "../services/codeEvaluationService";
import "../assets/styles/ranking.css";

export default function SubmissionsRankingPage() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [rankedSubmissions, setRankedSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [sortBy, setSortBy] = useState("rank");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [filterLanguage, setFilterLanguage] = useState("all");

  useEffect(() => {
    // Get submissions from localStorage
    const allSubmissions = JSON.parse(localStorage.getItem("candidate_submissions") || "[]");
    setSubmissions(allSubmissions);

    // Rank submissions
    const ranked = rankSubmissions(allSubmissions);
    setRankedSubmissions(ranked);
  }, []);

  const getFilteredSubmissions = () => {
    return rankedSubmissions.filter((submission) => {
      if (filterDifficulty !== "all" && submission.difficulty !== filterDifficulty) {
        return false;
      }
      if (filterLanguage !== "all" && submission.language !== filterLanguage) {
        return false;
      }
      return true;
    });
  };

  const getSortedSubmissions = () => {
    const filtered = getFilteredSubmissions();
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.finalScore - a.finalScore;
        case "tests":
          return b.testsPassed - a.testsPassed;
        case "time":
          return a.submissionTime.localeCompare(b.submissionTime);
        case "rank":
        default:
          return a.rank - b.rank;
      }
    });
    return sorted;
  };

  const displayedSubmissions = getSortedSubmissions();

  const getStatistics = () => {
    if (rankedSubmissions.length === 0) {
      return { avgScore: 0, avgTestPass: 0, bestScore: 0 };
    }

    const avgScore = (rankedSubmissions.reduce((sum, s) => sum + s.finalScore, 0) / rankedSubmissions.length).toFixed(1);
    const avgTestPass = (rankedSubmissions.reduce((sum, s) => sum + (s.testsPassed / s.totalTests * 100), 0) / rankedSubmissions.length).toFixed(1);
    const bestScore = Math.max(...rankedSubmissions.map(s => s.finalScore));

    return { avgScore, avgTestPass, bestScore };
  };

  const stats = getStatistics();

  if (rankedSubmissions.length === 0) {
    return (
      <AppShell>
        <div className="ranking-container">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h2>No Submissions Yet</h2>
            <p>Start an assessment to see ranked submissions</p>
            <button className="btn-primary" onClick={() => navigate("/assessment")}>
              Start Assessment
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="ranking-container">
        {/* Header */}
        <div className="ranking-header">
          <div>
            <h1>Leaderboard</h1>
            <p>Candidate Performance Rankings</p>
          </div>
          <button className="btn-primary" onClick={() => navigate("/assessment")}>
            New Assessment
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-label">Total Submissions</div>
              <div className="stat-value">{rankedSubmissions.length}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <div className="stat-label">Average Score</div>
              <div className="stat-value">{stats.avgScore}%</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <div className="stat-label">Avg Test Pass Rate</div>
              <div className="stat-value">{stats.avgTestPass}%</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <div className="stat-label">Best Score</div>
              <div className="stat-value">{stats.bestScore}%</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Sort By:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
              <option value="rank">Rank</option>
              <option value="score">Final Score</option>
              <option value="tests">Tests Passed</option>
              <option value="time">Recent First</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Difficulty:</label>
            <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} className="filter-select">
              <option value="all">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Language:</label>
            <select value={filterLanguage} onChange={(e) => setFilterLanguage(e.target.value)} className="filter-select">
              <option value="all">All Languages</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="leaderboard-section">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th className="col-rank">Rank</th>
                <th className="col-name">Candidate</th>
                <th className="col-question">Question</th>
                <th className="col-difficulty">Difficulty</th>
                <th className="col-language">Language</th>
                <th className="col-tests">Tests</th>
                <th className="col-score">Score</th>
                <th className="col-percentile">Percentile</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedSubmissions.map((submission, index) => (
                <tr key={submission.id} className={index % 2 === 0 ? "even" : "odd"}>
                  <td className="col-rank">
                    <div className="rank-badge">
                      {submission.rank <= 3 && (
                        <span className={`medal medal-${submission.rank}`}>
                          {submission.rank === 1 ? "🥇" : submission.rank === 2 ? "🥈" : "🥉"}
                        </span>
                      )}
                      <span>#{submission.rank}</span>
                    </div>
                  </td>
                  <td className="col-name">
                    <div className="candidate-info">
                      <div className="candidate-name">{submission.candidateName}</div>
                      <div className="candidate-email">{submission.candidateEmail}</div>
                    </div>
                  </td>
                  <td className="col-question">{submission.questionTitle}</td>
                  <td className="col-difficulty">
                    <span className={`difficulty-tag ${submission.difficulty.toLowerCase()}`}>
                      {submission.difficulty}
                    </span>
                  </td>
                  <td className="col-language">
                    <span className="language-tag">{submission.language.toUpperCase()}</span>
                  </td>
                  <td className="col-tests">
                    <span className={`tests-badge ${submission.testsPassed === submission.totalTests ? "perfect" : ""}`}>
                      {submission.testsPassed}/{submission.totalTests}
                    </span>
                  </td>
                  <td className="col-score">
                    <div className="score-container">
                      <span className="score-value">{submission.finalScore}%</span>
                      <div className="score-bar">
                        <div className="score-fill" style={{ width: `${submission.finalScore}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="col-percentile">
                    <span className="percentile-badge">{submission.percentile.toFixed(1)}%</span>
                  </td>
                  <td className="col-actions">
                    <button
                      className="btn-view"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <div className="modal-overlay" onClick={() => setSelectedSubmission(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submission Details</h2>
              <button className="close-btn" onClick={() => setSelectedSubmission(null)}>×</button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Submission Info</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Candidate:</span>
                    <span className="detail-value">{selectedSubmission.candidateName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Question:</span>
                    <span className="detail-value">{selectedSubmission.questionTitle}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Language:</span>
                    <span className="detail-value">{selectedSubmission.language}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Final Score:</span>
                    <span className="detail-value">{selectedSubmission.finalScore}%</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Test Results</h3>
                <div className="test-results">
                  <div className="test-stat">
                    <span className="stat-label">Tests Passed:</span>
                    <span className="stat-value">{selectedSubmission.testsPassed}/{selectedSubmission.totalTests}</span>
                  </div>
                  <div className="test-stat">
                    <span className="stat-label">Success Rate:</span>
                    <span className="stat-value">
                      {((selectedSubmission.testsPassed / selectedSubmission.totalTests) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {selectedSubmission.testResults.results && (
                  <div className="test-cases">
                    {selectedSubmission.testResults.results.map((result, idx) => (
                      <div key={idx} className={`test-case-detail ${result.passed ? "pass" : "fail"}`}>
                        <div className="test-case-header">
                          <span className="test-case-status">{result.passed ? "✓" : "✗"}</span>
                          <span className="test-case-title">Test Case {idx + 1}</span>
                        </div>
                        <div className="test-case-content">
                          <div><strong>Input:</strong> <code>{result.input}</code></div>
                          <div><strong>Expected:</strong> <code>{result.expected}</code></div>
                          {result.actual && <div><strong>Got:</strong> <code>{result.actual}</code></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="detail-section">
                <h3>Code Quality Analysis</h3>
                <div className="quality-metrics">
                  <div className="metric">
                    <span className="metric-label">Code Length:</span>
                    <span className="metric-value">{selectedSubmission.codeComparison.codeLength} chars</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Complexity:</span>
                    <span className="metric-value">{selectedSubmission.codeComparison.complexity}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Similarity to Reference:</span>
                    <span className="metric-value">{selectedSubmission.codeComparison.similarities}%</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Code Formatting:</span>
                    <span className="metric-value">
                      {selectedSubmission.codeComparison.isWellFormatted ? "✓ Good" : "✗ Needs improvement"}
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Comments:</span>
                    <span className="metric-value">
                      {selectedSubmission.codeComparison.hasComments ? "✓ Present" : "✗ Missing"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Submitted Code</h3>
                <pre className="code-display">{selectedSubmission.submittedCode}</pre>
              </div>

              <div className="detail-section">
                <h3>Reference Solution</h3>
                <pre className="code-display reference">{selectedSubmission.referenceCode}</pre>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedSubmission(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
