// src/App.jsx
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NewProject from "./pages/NewProject";
import ProjectDetails from "./pages/ProjectDetails";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/projects/new" element={<NewProject />} />
      <Route path="/projects/:projectId" element={<ProjectDetails />} />
    </Routes>
  );
}
