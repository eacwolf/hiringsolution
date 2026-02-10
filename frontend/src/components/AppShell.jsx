import { useNavigate } from "react-router-dom";

export default function AppShell({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // later we will clear auth token here
    navigate("/");
  };

  return (
    <div className="app-shell">
      <div className="topbar">
        <h1>AI Hiring Platform</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="content">{children}</div>
    </div>
  );
}
