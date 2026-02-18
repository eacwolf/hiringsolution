import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalExams: 0,
    candidates: 0,
    activeExams: 0,
    avgScore: 0,
  });

  const [recent, setRecent] = useState([]);

  useEffect(() => {
    // placeholder: in real app fetch from API
    setStats({ totalExams: 12, candidates: 186, activeExams: 2, avgScore: 74 });
    setRecent([
      { id: "ex-1", title: "Backend Assessment", domain: "Engineering", date: "2026-02-10", status: "Published" },
      { id: "ex-2", title: "Frontend Skills Test", domain: "Frontend", date: "2026-02-12", status: "Draft" },
      { id: "ex-3", title: "Data Engineer Round", domain: "Data Science", date: "2026-02-14", status: "Published" },
    ]);
  }, []);

  return (
    <AppShell>
      <h2 className="page-title">Hiring Dashboard</h2>
      <p className="page-subtitle">Manage and create AI-powered hiring exams</p>

      <div className="stats-grid" style={{ marginBottom: 24, maxWidth: 1100 }}>
        <div className="stat-card">
          <div className="stat-label">Total Exams</div>
          <div className="stat-value">{stats.totalExams}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Candidates</div>
          <div className="stat-value">{stats.candidates}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Exams</div>
          <div className="stat-value">{stats.activeExams}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. Score</div>
          <div className="stat-value">{stats.avgScore}%</div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 1100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Recent Exams</h3>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn" onClick={() => navigate("/create-exam")}>+ Create New Exam</button>
            <button className="btn" onClick={() => navigate("/questions")}>View Generated Questions</button>
          </div>
        </div>

        <table className="recent-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Domain</th>
              <th>Date</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {recent.map((r) => (
              <tr key={r.id}>
                <td>{r.title}</td>
                <td>{r.domain}</td>
                <td>{r.date}</td>
                <td>{r.status}</td>
                <td>
                  <button className="action-btn" onClick={() => navigate("/exams/" + r.id)}>Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
