import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppShell from "../components/AppShell";
import { getLatest } from "../services/aiService";

export default function GeneratedQuestionsPage() {
  const loc = useLocation();
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    const latest = getLatest();
    if (latest) {
      setPayload(latest);
      return;
    }
    setPayload({ metadata: null, questions: [] });
  }, [loc.state]);

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    alert("Copied to clipboard");
  };

  return (
    <AppShell>
      <h2 className="page-title">AI Generated Questions</h2>
      <p className="page-subtitle">Review and publish the generated interview questions</p>

      <div className="card" style={{ maxWidth: 1100 }}>
        {!payload ? (
          <p>Loading questions...</p>
        ) : payload.questions && payload.questions.length ? (
          <div className="questions-list">
            {payload.questions.map((q, idx) => (
              <div key={q.id || idx} className="question-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <h3 style={{ margin: "0 0 6px 0" }}>{q.title || `Question ${idx + 1}`}</h3>
                    <div className="meta">Difficulty: {q.difficulty || "Medium"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="action-btn" onClick={() => handleCopy(q.referenceSolution || "")}>Copy Solution</button>
                    <button className="action-btn" onClick={() => alert("Publish flow not implemented yet")}>Publish</button>
                  </div>
                </div>

                <p style={{ marginTop: 12 }}>{q.description}</p>

                <details style={{ marginTop: 12 }}>
                  <summary>Reference solution & test cases</summary>
                  <pre style={{ whiteSpace: "pre-wrap", background: "#f8fafc", padding: 12, borderRadius: 6, marginTop: 8 }}>{q.referenceSolution}</pre>
                  <h5>Test cases</h5>
                  <ul>
                    {q.testCases && q.testCases.length ? q.testCases.map((t, i) => (
                      <li key={i}>{`${t.input} → ${t.expected}`}</li>
                    )) : <li>No testcases provided</li>}
                  </ul>
                </details>
              </div>
            ))}
          </div>
        ) : (
          <p>No questions found. Please generate an assessment first.</p>
        )}
      </div>
    </AppShell>
  );
}
