import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppShell from "../components/AppShell";
import { getLatest } from "../services/aiService";

export default function GeneratedQuestionsPage() {
  const loc = useLocation();
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    // Prefer location state, otherwise read latest from localStorage
    const latest = getLatest();
    if (latest) {
      setPayload(latest);
      return;
    }
    // fallback: show empty placeholder
    setPayload({ metadata: null, questions: [] });
  }, [loc.state]);

  return (
    <AppShell>
      <h2 className="page-title">AI Generated Questions</h2>
      <p className="page-subtitle">Review the generated interview questions</p>

      <div className="card">
        {!payload ? (
          <p>Loading questions...</p>
        ) : payload.questions && payload.questions.length ? (
          <div className="questions-list">
            {payload.questions.map((q) => (
              <div key={q.id} className="question-card">
                <h3>{q.title}</h3>
                <p>{q.description}</p>
                <div className="meta">Difficulty: {q.difficulty}</div>
                <details>
                  <summary>Reference solution & test cases</summary>
                  <pre style={{ whiteSpace: "pre-wrap" }}>{q.referenceSolution}</pre>
                  <h5>Test cases</h5>
                  <ul>
                    {q.testCases.map((t, i) => (
                      <li key={i}>{`${t.input} → ${t.expected}`}</li>
                    ))}
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
