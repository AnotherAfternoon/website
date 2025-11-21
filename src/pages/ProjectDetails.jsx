import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  Circle,
  AlertTriangle,
  Image,
  Edit2,
  ArrowLeft,
  Calendar,
  User,
  Loader2,
  ChevronDown,
  ChevronUp,
  Wrench,
  Package,
  ShieldAlert,
  Lightbulb,
  AlertCircle
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import NavBar from "../components/NavBar";
import { useCredits } from "../contexts/CreditsContext";

export default function ProjectDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const { getToken } = useAuth();
  const { refreshCredits } = useCredits();

  // Get data from navigation state (passed from NewProject page) - used as initial data
  const receivedData = location.state || {};

  // Loading and error states
  const [loading, setLoading] = useState(!receivedData.projectInfo);
  const [error, setError] = useState(null);

  // Helper function to safely format dates
  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString();
  };

  // Initialize state with received data or empty
  const [projectInfo, setProjectInfo] = useState(receivedData.projectInfo || null);
  const [steps, setSteps] = useState(receivedData.steps || []);
  const [images, setImages] = useState(receivedData.images || []);
  const [safetyChecklist, setSafetyChecklist] = useState(receivedData.safetyChecklist || []);
  const [isEditing, setIsEditing] = useState(false);

  // Step expansion state
  const [expandedSteps, setExpandedSteps] = useState({}); // { stepId: detailedData }
  const [loadingSteps, setLoadingSteps] = useState({}); // { stepId: true/false }
  const [expandErrors, setExpandErrors] = useState({}); // { stepId: errorMessage }

  // Fetch project data from API
  useEffect(() => {
    // If we already have data from navigation state, don't fetch
    if (receivedData.projectInfo) {
      setLoading(false);
      return;
    }

    // Fetch from API
    const fetchProject = async () => {
      try {
        setLoading(true);
        const token = await getToken?.();
        const API_BASE = import.meta.env.VITE_API_BASE_URL;

        const res = await fetch(`${API_BASE}/v1/projects/${projectId}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch project: ${res.status}`);
        }

        const data = await res.json();

        // Update all state with fetched data
        setProjectInfo(data.projectInfo);
        setSteps(data.steps || []);
        setImages(data.images || []);
        setSafetyChecklist(data.safetyChecklist || []);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, getToken, receivedData.projectInfo]);

  // Initialize expandedSteps from steps that already have expanded data
  useEffect(() => {
    const initialExpanded = {};
    steps.forEach(step => {
      if (step.expanded) {
        initialExpanded[step.id] = {
          stepId: step.id,
          title: step.title,
          ...step.expanded
        };
      }
    });
    if (Object.keys(initialExpanded).length > 0) {
      setExpandedSteps(initialExpanded);
    }
  }, [steps]);

  const toggleStepCompletion = (stepId) => {
    setSteps(steps.map(step =>
      step.id === stepId ? { ...step, completed: !step.completed } : step
    ));
  };

  const toggleSafetyItem = (itemId) => {
    setSafetyChecklist(safetyChecklist.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ));
  };

  const toggleStepExpansion = async (stepId) => {
    // If already expanded, collapse it
    if (expandedSteps[stepId]) {
      setExpandedSteps(prev => {
        const newState = { ...prev };
        delete newState[stepId];
        return newState;
      });
      return;
    }

    // Otherwise, expand it by fetching details
    setLoadingSteps(prev => ({ ...prev, [stepId]: true }));
    setExpandErrors(prev => {
      const newState = { ...prev };
      delete newState[stepId];
      return newState;
    });

    try {
      const token = await getToken?.();
      const API_BASE = import.meta.env.VITE_API_BASE_URL;

      const res = await fetch(`${API_BASE}/v1/projects/expand-step`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          projectId: projectId,
          stepId: stepId,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to expand step: ${res.status}`);
      }

      const detailedStep = await res.json();
      setExpandedSteps(prev => ({ ...prev, [stepId]: detailedStep }));

      // Refresh credit balance after successful expansion
      refreshCredits();
    } catch (err) {
      console.error("Error expanding step:", err);
      setExpandErrors(prev => ({ ...prev, [stepId]: err.message }));
    } finally {
      setLoadingSteps(prev => ({ ...prev, [stepId]: false }));
    }
  };

  const completedSteps = steps.filter(s => s.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const checkedSafetyItems = safetyChecklist.filter(i => i.checked).length;
  const safetyPercentage = (checkedSafetyItems / safetyChecklist.length) * 100;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <NavBar />
        <div className="pt-28 px-6 pb-6 flex items-center justify-center">
          <Loader2 size={48} className="animate-spin text-purple-400" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <NavBar />
        <div className="pt-28 px-6 pb-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
              <AlertTriangle size={48} className="mx-auto mb-4 text-red-400" />
              <h2 className="text-2xl font-bold mb-2 text-red-400">Failed to Load Project</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <button
                onClick={() => navigate("/projects")}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Back to Projects
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No project found
  if (!projectInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <NavBar />
        <div className="pt-28 px-6 pb-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-2 text-gray-300">Project Not Found</h2>
              <p className="text-gray-400 mb-6">This project doesn't exist or you don't have access to it.</p>
              <button
                onClick={() => navigate("/projects")}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Back to Projects
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation Bar */}
      <NavBar />

      {/* Back button bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-slate-900/60 backdrop-blur-sm border-b border-purple-500/10">
        <div className="max-w-[1800px] mx-auto px-6 py-2">
          <button
            onClick={() => navigate("/projects")}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-800/50 rounded-lg transition-colors text-gray-300 hover:text-purple-400"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Projects</span>
          </button>
        </div>
      </div>

      {/* Main content grid */}
      <div className="pt-28 px-6 pb-6">
        <div
          className="
            max-w-[1800px] mx-auto gap-6 h-[calc(100vh-120px)]
            grid grid-rows-[auto_1fr] lg:grid-rows-1
            grid-cols-1 lg:grid-cols-[20rem_1fr_20rem]
          "
        >
          {/* LEFT: Project Details & Safety */}
          <aside className="overflow-y-auto flex flex-col gap-6">
            {/* Project Details */}
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-purple-300">Project Details</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                  aria-label="Edit project"
                >
                  <Edit2 size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Title</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={projectInfo.title}
                      onChange={(e) => setProjectInfo({ ...projectInfo, title: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  ) : (
                    <div className="mt-1 font-semibold">{projectInfo.title}</div>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-400">Description</label>
                  {isEditing ? (
                    <textarea
                      value={projectInfo.description}
                      onChange={(e) => setProjectInfo({ ...projectInfo, description: e.target.value })}
                      rows={4}
                      className="w-full mt-1 px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-300 leading-relaxed">{projectInfo.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-400">Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={16} className="text-yellow-400" />
                      <span className="text-sm">{projectInfo.status}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Difficulty</label>
                    <div className="mt-1 text-sm">{projectInfo.difficulty}</div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Estimated Time</label>
                  <div className="mt-1 text-sm">{projectInfo.estimatedTime}</div>
                </div>

                <div className="pt-3 border-t border-purple-500/20">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <User size={14} />
                    <span>Created by {projectInfo.createdBy}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar size={14} />
                    <span>Last updated {formatDate(projectInfo.lastUpdated)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Checklist */}
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-purple-300">Safety Checklist</h2>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle size={16} className={safetyPercentage === 100 ? "text-green-400" : "text-yellow-400"} />
                  <span className="text-gray-400">{checkedSafetyItems}/{safetyChecklist.length}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      safetyPercentage === 100 
                        ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                        : "bg-gradient-to-r from-yellow-500 to-orange-500"
                    }`}
                    style={{ width: `${safetyPercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                {safetyChecklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleSafetyItem(item.id)}
                    className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg border border-purple-500/10 hover:bg-slate-700/50 transition-colors cursor-pointer"
                  >
                    <div className="mt-0.5">
                      {item.checked ? (
                        <CheckCircle size={18} className="text-green-400" />
                      ) : (
                        <Circle size={18} className="text-gray-500" />
                      )}
                    </div>
                    <span className={`text-sm flex-1 ${item.checked ? "text-gray-300 line-through" : "text-gray-200"}`}>
                      {item.item}
                    </span>
                  </div>
                ))}
              </div>

              {safetyPercentage === 100 && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-xs text-green-400 text-center">All safety items checked! Stay safe!</p>
                </div>
              )}
            </div>
          </aside>

          {/* CENTER: Project Steps */}
          <main className="bg-slate-800/50 backdrop-blur rounded-2xl border border-purple-500/20 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold">Project Steps</h1>
                <div className="text-sm text-gray-400">
                  {completedSteps} of {steps.length} completed
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">{Math.round(progressPercentage)}% complete</p>
              </div>
            </div>

            {/* Steps list */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {steps.map((step, idx) => {
                  const isExpanded = expandedSteps[step.id];
                  const isLoading = loadingSteps[step.id];
                  const hasError = expandErrors[step.id];

                  return (
                    <div
                      key={step.id}
                      className={`bg-slate-700/30 rounded-lg border transition-all ${
                        step.completed
                          ? "border-purple-500/30 opacity-75"
                          : "border-purple-500/10"
                      }`}
                    >
                      {/* Step Header */}
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          {/* Checkbox */}
                          <div
                            onClick={() => toggleStepCompletion(step.id)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                              step.completed
                                ? "bg-purple-600/40 ring-2 ring-purple-500/50"
                                : "bg-slate-700/50 border-2 border-purple-500/30 hover:border-purple-500/50"
                            }`}
                          >
                            {step.completed ? (
                              <CheckCircle size={18} className="text-purple-300" />
                            ) : (
                              <span className="text-sm font-semibold">{idx + 1}</span>
                            )}
                          </div>

                          {/* Step Content */}
                          <div className="flex-1">
                            <h3 className={`font-semibold mb-2 ${step.completed ? "line-through text-gray-400" : "text-gray-200"}`}>
                              {step.title}
                            </h3>
                            <p className={`text-sm leading-relaxed ${step.completed ? "text-gray-500" : "text-gray-400"}`}>
                              {step.details}
                            </p>
                          </div>

                          {/* Expand Button */}
                          <button
                            onClick={() => toggleStepExpansion(step.id)}
                            disabled={isLoading}
                            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                              isExpanded
                                ? "bg-purple-600/20 text-purple-300 hover:bg-purple-600/30"
                                : "bg-slate-600/50 text-gray-300 hover:bg-slate-600/70"
                            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                <span>Loading...</span>
                              </>
                            ) : isExpanded ? (
                              <>
                                <ChevronUp size={14} />
                                <span>Hide Details</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown size={14} />
                                <span>Show Details</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Error State */}
                      {hasError && (
                        <div className="px-5 pb-5">
                          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 flex items-start gap-2">
                            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                            <span>Failed to load details: {hasError}</span>
                          </div>
                        </div>
                      )}

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="px-5 pb-5 space-y-4 border-t border-slate-600/30 pt-4">
                          {/* Detailed Instructions */}
                          <div>
                            <h4 className="text-sm font-semibold text-purple-300 mb-2">Detailed Instructions</h4>
                            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                              {isExpanded.detailedInstructions}
                            </p>
                          </div>

                          {/* Substeps */}
                          {isExpanded.substeps && isExpanded.substeps.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-purple-300 mb-2">Step-by-Step</h4>
                              <ol className="space-y-2">
                                {isExpanded.substeps.map((substep, i) => (
                                  <li key={i} className="text-sm text-gray-300 flex gap-2">
                                    <span className="text-purple-400 font-semibold">{i + 1}.</span>
                                    <span>{substep}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}

                          {/* Tools & Materials Grid */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* Tools */}
                            {isExpanded.toolsNeeded && isExpanded.toolsNeeded.length > 0 && (
                              <div className="bg-slate-600/20 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Wrench size={14} className="text-purple-400" />
                                  <h4 className="text-xs font-semibold text-purple-300">Tools Needed</h4>
                                </div>
                                <ul className="space-y-1">
                                  {isExpanded.toolsNeeded.map((tool, i) => (
                                    <li key={i} className="text-xs text-gray-400">• {tool}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Materials */}
                            {isExpanded.materialsNeeded && isExpanded.materialsNeeded.length > 0 && (
                              <div className="bg-slate-600/20 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Package size={14} className="text-purple-400" />
                                  <h4 className="text-xs font-semibold text-purple-300">Materials Needed</h4>
                                </div>
                                <ul className="space-y-1">
                                  {isExpanded.materialsNeeded.map((material, i) => (
                                    <li key={i} className="text-xs text-gray-400">• {material}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Safety Precautions */}
                          {isExpanded.safetyPrecautions && isExpanded.safetyPrecautions.length > 0 && (
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <ShieldAlert size={14} className="text-yellow-400" />
                                <h4 className="text-xs font-semibold text-yellow-300">Safety Precautions</h4>
                              </div>
                              <ul className="space-y-1">
                                {isExpanded.safetyPrecautions.map((precaution, i) => (
                                  <li key={i} className="text-xs text-gray-300">• {precaution}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Common Mistakes */}
                          {isExpanded.commonMistakes && isExpanded.commonMistakes.length > 0 && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertCircle size={14} className="text-red-400" />
                                <h4 className="text-xs font-semibold text-red-300">Common Mistakes to Avoid</h4>
                              </div>
                              <ul className="space-y-1">
                                {isExpanded.commonMistakes.map((mistake, i) => (
                                  <li key={i} className="text-xs text-gray-300">• {mistake}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Pro Tips */}
                          {isExpanded.proTips && isExpanded.proTips.length > 0 && (
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb size={14} className="text-blue-400" />
                                <h4 className="text-xs font-semibold text-blue-300">Pro Tips</h4>
                              </div>
                              <ul className="space-y-1">
                                {isExpanded.proTips.map((tip, i) => (
                                  <li key={i} className="text-xs text-gray-300">• {tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Time Estimate */}
                          {isExpanded.estimatedTime && (
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Clock size={14} />
                              <span>Estimated time: {isExpanded.estimatedTime}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </main>

          {/* RIGHT: Project Media */}
          <aside className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-purple-500/20 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-purple-300">Project Media</h2>

            {images.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                <Image size={48} className="mx-auto mb-3 opacity-30" />
                <p>No images yet</p>
                <p className="text-xs mt-1">Add photos to document your progress</p>
              </div>
            ) : (
              <div className="space-y-4">
                {images.map((img) => (
                  <div key={img.id} className="group">
                    <div className="relative overflow-hidden rounded-lg border border-purple-500/20">
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="mt-2">
                      <h4 className="text-sm font-semibold text-gray-200">{img.name}</h4>
                      <p className="text-xs text-gray-400 mt-1">{img.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="w-full mt-6 py-3 border-2 border-dashed border-purple-500/30 rounded-xl hover:border-purple-500/50 transition-colors flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-gray-300">
              <Image size={18} />
              Add Photos
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}