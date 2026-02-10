import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <h2 className="page-title">Hiring Dashboard</h2>
      <p className="page-subtitle">
        Manage and create AI-powered hiring exams
      </p>

      <div className="card">
        <button
          className="btn"
          onClick={() => navigate("/create-exam")}
        >
          + Create New Exam
        </button>
      </div>
    </AppShell>
  );
}
