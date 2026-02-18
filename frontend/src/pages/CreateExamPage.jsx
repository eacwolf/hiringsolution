import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import Loader from "../components/Loader";
import "../assets/styles/createExam.css";
import { generateQuestions } from "../services/aiService";

export default function CreateExamPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    domain: "Engineering",
    skill: "Java",
    difficulty: "Medium",
    numQuestions: 3,
    durationMinutes: 90,
    languages: ["javascript", "python"],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async () => {
    // show buffering UI on same page
    setLoading(true);
    try {
      // optimistic immediate UI - call service
      const payload = await generateQuestions(formData);
      // navigate to questions page once generation completes
      navigate("/questions", { state: { generated: true } });
    } catch (err) {
      // keep user on page and show a simple alert for now
      console.error(err);
      alert("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const domains = [
    "Engineering",
    "Computer Science",
    "IT",
    "Data Science",
    "Cloud Computing"
  ];

  const skills = {
    Engineering: ["Java", "Python", "JavaScript", "C++", "Go"],
    "Computer Science": ["Algorithms", "Data Structures", "DBMS", "OS"],
    IT: ["Network", "Security", "Linux", "Windows Server"],
    "Data Science": ["Python", "R", "SQL", "Machine Learning"],
    "Cloud Computing": ["AWS", "Azure", "GCP", "Kubernetes"],
  };

  const difficulties = ["Easy", "Medium", "Hard"];

  return (
    <AppShell>
      <div className="create-exam-wrapper">
        <div className="exam-header">
          <h1 className="page-title">Create Assessment</h1>
          <p className="page-subtitle">Configure and generate AI-powered technical questions</p>
        </div>

        <div className="exam-container">
          {loading ? (
            <Loader message="Generating AI questions and solutions..." />
          ) : (
            <div className="exam-form">
              <div className="exam-main">
                <div className="form-section">
                  <div className="section-title">
                    <h3>Assessment Title</h3>
                    <p>Give a clear name recruiters will recognize</p>
                  </div>
                  <div className="form-group">
                    <input
                      name="title"
                      placeholder="e.g. Backend Engineer Screening"
                      value={formData.title}
                      onChange={handleChange}
                      className="select-field"
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }} className="form-section">
                    <div className="section-title">
                      <h3>Assessment Domain</h3>
                      <p>Select the technical domain for evaluation</p>
                    </div>
                    <div className="form-group">
                      <select name="domain" value={formData.domain} onChange={handleChange} className="select-field">
                        {domains.map((domain) => (
                          <option key={domain} value={domain}>{domain}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ width: 200 }} className="form-section">
                    <div className="section-title"><h3>Skill</h3></div>
                    <div className="form-group">
                      <select name="skill" value={formData.skill} onChange={handleChange} className="select-field">
                        {skills[formData.domain]?.map((skill) => (
                          <option key={skill} value={skill}>{skill}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-title">
                    <h3>Difficulty Level</h3>
                    <p>Set the complexity of questions</p>
                  </div>
                  <div className="difficulty-selector">
                    {difficulties.map((level) => (
                      <button key={level} className={`difficulty-btn ${formData.difficulty === level ? "active" : ""}`} onClick={() => setFormData((prev) => ({ ...prev, difficulty: level }))}>
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-title">
                    <h3>Exam Length</h3>
                    <p>Number of questions and duration (minutes)</p>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label className="form-group">
                        <span style={{ display: "block", fontWeight: 700 }}>Questions</span>
                        <input type="number" min={1} max={20} name="numQuestions" value={formData.numQuestions} onChange={handleChange} className="select-field" />
                      </label>
                    </div>
                    <div style={{ width: 160 }}>
                      <label className="form-group">
                        <span style={{ display: "block", fontWeight: 700 }}>Duration</span>
                        <input type="number" min={10} max={480} name="durationMinutes" value={formData.durationMinutes} onChange={handleChange} className="select-field" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="exam-side">
                <div className="summary-card">
                  <h4>Assessment Configuration</h4>
                  <div className="summary-grid">
                    <div className="summary-item"><span className="summary-label">Domain</span><span className="summary-value">{formData.domain}</span></div>
                    <div className="summary-item"><span className="summary-label">Skill</span><span className="summary-value">{formData.skill}</span></div>
                    <div className="summary-item"><span className="summary-label">Difficulty</span><span className="summary-value">{formData.difficulty}</span></div>
                    <div className="summary-item"><span className="summary-label">Questions</span><span className="summary-value">{formData.numQuestions}</span></div>
                    <div className="summary-item"><span className="summary-label">Duration</span><span className="summary-value">{formData.durationMinutes}m</span></div>
                    <div className="summary-item"><span className="summary-label">Languages</span><span className="summary-value">{formData.languages.join(", ")}</span></div>
                  </div>
                </div>
              </div>

              <div className="exam-actions">
                <button className="btn btn-generate" onClick={handleGenerate}>Generate Assessment</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
