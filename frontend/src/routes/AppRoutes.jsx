import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import DashboardPage from "../pages/DashboardPage";
import CreateExamPage from "../pages/CreateExamPage";
import GeneratedQuestionsPage from "../pages/GeneratedQuestionsPage";
import CandidateAssessmentPage from "../pages/CandidateAssessmentPage";
import SubmissionsRankingPage from "../pages/SubmissionsRankingPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/create-exam" element={<CreateExamPage />} />
      <Route path="/questions" element={<GeneratedQuestionsPage />} />
      <Route path="/assessment" element={<CandidateAssessmentPage />} />
      <Route path="/assessment/:questionId" element={<CandidateAssessmentPage />} />
      <Route path="/submissions-ranking" element={<SubmissionsRankingPage />} />
    </Routes>
  );
}
