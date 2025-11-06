import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Clock, Loader2, Plus, FolderOpen } from "lucide-react";
import NavBar from "../components/NavBar";

export default function Projects() {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = await getToken?.();
      const API_BASE = import.meta.env.VITE_API_BASE_URL;

      const res = await fetch(`${API_BASE}/v1/projects`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch projects: ${res.status}`);
      }

      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "hard":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-400 bg-green-400/10";
      case "in progress":
        return "text-blue-400 bg-blue-400/10";
      case "planning":
        return "text-purple-400 bg-purple-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Content */}
      <div className="pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                My Projects
              </h1>
              <p className="text-gray-400 mt-2">
                {projects.length} {projects.length === 1 ? "project" : "projects"}
              </p>
            </div>
            <button
              onClick={() => navigate("/new-project")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all font-medium"
            >
              <Plus size={20} />
              New Project
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={48} className="animate-spin text-purple-400" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
              <p className="text-red-400">Failed to load projects: {error}</p>
              <button
                onClick={fetchProjects}
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && projects.length === 0 && (
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-purple-500/20 p-12 text-center">
              <FolderOpen size={64} className="mx-auto mb-4 text-gray-500" />
              <h2 className="text-2xl font-semibold mb-2 text-gray-300">No projects yet</h2>
              <p className="text-gray-400 mb-6">
                Start your first home improvement project!
              </p>
              <button
                onClick={() => navigate("/new-project")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all font-medium"
              >
                <Plus size={20} />
                Create Your First Project
              </button>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.projectId}
                  onClick={() => navigate(`/projects/${project.projectId}`)}
                  className="bg-slate-800/50 backdrop-blur rounded-2xl border border-purple-500/20 p-6 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer group"
                >
                  {/* Project Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-purple-300 transition-colors line-clamp-2 mb-2">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full border ${getDifficultyColor(project.difficulty)}`}>
                        {project.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock size={16} className="flex-shrink-0" />
                      <span>{project.estimatedTime}</span>
                    </div>
                    <div className="text-xs text-gray-500 border-t border-purple-500/10 pt-3">
                      Created {formatDate(project.createdAt)}
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="mt-4 pt-4 border-t border-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm text-purple-400">View Project →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
