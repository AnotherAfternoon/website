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
  User
} from "lucide-react";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";

// Header component
function HeaderAuth() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            aria-label="Sign in"
          >
            Sign in
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-3">
          <UserButton appearance={{ elements: { avatarBox: "ring-2 ring-purple-500/50 rounded-full" } }} />
        </div>
      </SignedIn>
    </>
  );
}

export default function ProjectDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from navigation state (passed from NewProject page)
  const receivedData = location.state || {};

  // Helper function to safely format dates
  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString();
  };

  // Sample project data - used as fallback if no data is passed
  const defaultProjectInfo = {
    title: "Kitchen Cabinet Refresh",
    description: "Refinishing and painting kitchen cabinets to give them a modern farmhouse look. Includes removing hardware, sanding, priming, and applying a fresh coat of paint.",
    difficulty: "Medium",
    estimatedTime: "2-4 hours",
    status: "In Progress",
    createdBy: "John Doe",
    createdDate: new Date("2025-10-15"),
    lastUpdated: new Date("2025-10-28")
  };

  const defaultSteps = [
    {
      id: 1,
      title: "Remove all cabinet doors and hardware",
      details: "Use a screwdriver to carefully remove hinges and handles. Label each door for easy reinstallation.",
      completed: true
    },
    {
      id: 2,
      title: "Clean and degrease all surfaces",
      details: "Use TSP cleaner or a degreaser to remove any grease, grime, and buildup from cabinet surfaces.",
      completed: true
    },
    {
      id: 3,
      title: "Sand all surfaces thoroughly",
      details: "Use 120-grit sandpaper to rough up the existing finish. This helps the primer adhere better.",
      completed: true
    },
    {
      id: 4,
      title: "Apply primer coat",
      details: "Use a high-quality bonding primer. Apply thin, even coats and let dry completely (4-6 hours).",
      completed: false
    },
    {
      id: 5,
      title: "Apply first coat of paint",
      details: "Use a foam roller for smooth surfaces and a brush for edges. Allow 24 hours to dry.",
      completed: false
    },
    {
      id: 6,
      title: "Light sanding between coats",
      details: "Lightly sand with 220-grit sandpaper to smooth any imperfections.",
      completed: false
    },
    {
      id: 7,
      title: "Apply second coat of paint",
      details: "Apply final coat ensuring even coverage. Let cure for 48 hours before handling.",
      completed: false
    },
    {
      id: 8,
      title: "Reinstall hardware and doors",
      details: "Once fully cured, reattach all hinges, handles, and cabinet doors.",
      completed: false
    }
  ];

  const defaultImages = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400",
      name: "Before - Cabinet condition",
      caption: "Original cabinet state"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400",
      name: "Hardware removed",
      caption: "All doors and hardware removed"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
      name: "Sanding progress",
      caption: "After sanding surfaces"
    }
  ];

  const defaultSafetyChecklist = [
    {
      id: 1,
      item: "Wear safety goggles when sanding",
      checked: true
    },
    {
      id: 2,
      item: "Use respirator mask in well-ventilated area",
      checked: true
    },
    {
      id: 3,
      item: "Wear gloves when handling chemicals and primers",
      checked: false
    },
    {
      id: 4,
      item: "Keep work area clear of tripping hazards",
      checked: false
    },
    {
      id: 5,
      item: "Store paint and chemicals away from heat sources",
      checked: false
    },
    {
      id: 6,
      item: "Have fire extinguisher nearby",
      checked: true
    }
  ];

  // Initialize state with received data or defaults
  const [projectInfo, setProjectInfo] = useState(receivedData.projectInfo || defaultProjectInfo);
  const [steps, setSteps] = useState(receivedData.steps || defaultSteps);
  const [images, setImages] = useState(receivedData.images || defaultImages);
  const [safetyChecklist, setSafetyChecklist] = useState(receivedData.safetyChecklist || defaultSafetyChecklist);
  const [isEditing, setIsEditing] = useState(false);

  // Update state when navigation data changes
  useEffect(() => {
    if (receivedData.projectInfo) {
      setProjectInfo(receivedData.projectInfo);
    }
    if (receivedData.steps) {
      setSteps(receivedData.steps);
    }
    if (receivedData.images) {
      setImages(receivedData.images);
    }
    if (receivedData.safetyChecklist) {
      setSafetyChecklist(receivedData.safetyChecklist);
    }
  }, [receivedData]);

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

  const completedSteps = steps.filter(s => s.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const checkedSafetyItems = safetyChecklist.filter(i => i.checked).length;
  const safetyPercentage = (checkedSafetyItems / safetyChecklist.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg z-50 border-b border-purple-500/20">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-800/50 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AnotherAfternoon.com
            </div>
          </div>
          <HeaderAuth />
        </div>
      </nav>

      {/* Main content grid */}
      <div className="pt-24 px-6 pb-6">
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
                {steps.map((step, idx) => (
                  <div
                    key={step.id}
                    onClick={() => toggleStepCompletion(step.id)}
                    className={`bg-slate-700/30 rounded-lg p-5 border transition-all cursor-pointer ${
                      step.completed
                        ? "border-purple-500/30 opacity-75"
                        : "border-purple-500/10 hover:border-purple-500/30"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        step.completed 
                          ? "bg-purple-600/40 ring-2 ring-purple-500/50" 
                          : "bg-slate-700/50 border-2 border-purple-500/30"
                      }`}>
                        {step.completed ? (
                          <CheckCircle size={18} className="text-purple-300" />
                        ) : (
                          <span className="text-sm font-semibold">{idx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-2 ${step.completed ? "line-through text-gray-400" : "text-gray-200"}`}>
                          {step.title}
                        </h3>
                        <p className={`text-sm leading-relaxed ${step.completed ? "text-gray-500" : "text-gray-400"}`}>
                          {step.details}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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