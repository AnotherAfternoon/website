import { useState, useRef, useEffect } from "react";
import { Send, Upload, Image, X, Clock, CheckCircle, Loader2 } from "lucide-react";
import { SignInButton, UserButton, SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

// ---- Header auth (inline for this page) ----
function HeaderAuth({ onCreateProject, hasEnoughInfo, isCreating }) {
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
          <button
            onClick={onCreateProject}
            disabled={!hasEnoughInfo || isCreating}
            className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
              hasEnoughInfo && !isCreating
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50"
                : "bg-gray-600 cursor-not-allowed opacity-50"
            }`}
          >
            {isCreating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Create Project
              </>
            )}
          </button>
          <UserButton appearance={{ elements: { avatarBox: "ring-2 ring-purple-500/50 rounded-full" } }} />
        </div>
      </SignedIn>
    </>
  );
}

export default function NewProject() {
  // --- Navigation ---
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [projectInfo, setProjectInfo] = useState({
    title: "New Home Project",
    description: "",
    difficulty: "Medium",
    estimatedTime: "2–4 hours",
    status: "Planning",
  });
  const [steps, setSteps] = useState([]);

  // --- Center: collect user input (no API calls) ---
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatEndRef = useRef(null);

  // --- Right: media ---
  const [uploadedImages, setUploadedImages] = useState([]);
  const fileInputRef = useRef(null);

  // Check if user has provided enough information to create project
  const hasEnoughInfo = messages.length > 0 || uploadedImages.length > 0;

  // Track if project is being created
  const [isCreating, setIsCreating] = useState(false);


  // autoscroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // revoke object URLs on unmount / change
  useEffect(() => {
    return () => {
      uploadedImages.forEach((i) => URL.revokeObjectURL(i.url));
    };
  }, [uploadedImages]);

  // Simply collect user messages - no API calls
  const handleSendMessage = () => {
    const text = inputMessage.trim();
    if (!text) return;

    const userMsg = { role: "user", content: text, timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInputMessage("");
  };

  // Handle Create Project button click
  const handleCreateProject = async () => {
    setIsCreating(true);

    try {
      // Get authentication token
      const token = await getToken?.();
      const API_BASE = import.meta.env.VITE_API_BASE_URL;

      // Collect all user input
      const projectData = {
        projectInfo,
        messages: messages.map(({ role, content }) => ({ role, content })),
        uploadedImages: uploadedImages.map(img => ({
          id: img.id,
          name: img.name,
          url: img.url
        })),
      };

      console.log("Sending project data to LLM:", projectData);

      // Call LLM API to generate project plan
      const res = await fetch(`${API_BASE}/v1/projects/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(projectData),
      });

      if (!res.ok) {
        throw new Error(`Failed to create project: ${res.status}`);
      }

      const responseData = await res.json();
      console.log("LLM Response:", responseData);

      // Expected response format:
      // {
      //   projectId: string,
      //   projectInfo: { title, description, difficulty, estimatedTime, status, ... },
      //   steps: [{ id, title, details, completed }],
      //   images: [{ id, url, name, caption }],
      //   safetyChecklist: [{ id, item, checked }]
      // }

      // Navigate to ProjectDetails page with the generated project data
      navigate(`/projects/${responseData.projectId}`, {
        state: {
          projectInfo: responseData.projectInfo,
          steps: responseData.steps,
          images: responseData.images || uploadedImages,
          safetyChecklist: responseData.safetyChecklist,
        },
      });
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newImages = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setUploadedImages((imgs) => [...imgs, ...newImages]);
  };

  const removeImage = (id) => {
    const img = uploadedImages.find((i) => i.id === id);
    if (img) URL.revokeObjectURL(img.url);
    setUploadedImages((imgs) => imgs.filter((i) => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg z-50 border-b border-purple-500/20">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AnotherAfternoon.com
          </div>
          <HeaderAuth onCreateProject={handleCreateProject} hasEnoughInfo={hasEnoughInfo} isCreating={isCreating} />
        </div>
      </nav>

      {/* Main content grid – responsive */}
      <div className="pt-24 px-6 pb-6">
        <div
          className="
            max-w-[1800px] mx-auto gap-6 h-[calc(100vh-120px)]
            grid grid-rows-[auto_1fr_auto] lg:grid-rows-1
            grid-cols-1 lg:grid-cols-[20rem_1fr_20rem]
          "
        >
          {/* LEFT: Summary + Steps (tabs could be added later) */}
          <aside className="order-2 lg:order-none overflow-y-auto flex flex-col gap-6">
            {/* Summary */}
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold mb-4 text-purple-300">Project Summary</h2>
              <div className="space-y-3">
                <div>
                  <label htmlFor="title" className="text-sm text-gray-400">Title</label>
                  <input
                    id="title"
                    type="text"
                    value={projectInfo.title}
                    onChange={(e) => setProjectInfo((p) => ({ ...p, title: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>
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
                <div>
                  <label className="text-sm text-gray-400">Est. Time</label>
                  <div className="mt-1 text-sm">{projectInfo.estimatedTime}</div>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold mb-4 text-purple-300">Project Steps</h2>
              {steps.length === 0 ? (
                <p className="text-gray-400 text-sm">Steps will appear as we outline your project…</p>
              ) : (
                <div className="space-y-3">
                  {steps.map((step, idx) => (
                    <div key={step.id} className="bg-slate-700/30 rounded-lg p-4 border border-purple-500/10">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                          <p className="text-xs text-gray-400">{step.details}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* CENTER: Notes / chat-like composer */}
          <main className="order-1 lg:order-none bg-slate-800/50 backdrop-blur rounded-2xl border border-purple-500/20 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-purple-500/20">
              <h1 className="text-2xl font-bold">Project Notes</h1>
              <p className="text-sm text-gray-400 mt-1">
                Describe your project goals and context. Upload photos for reference.
              </p>
              <SignedOut>
                <div className="mt-3 text-xs text-gray-400">
                  You can write notes and upload photos now. <span className="text-purple-300">Sign in to create your project.</span>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="mt-3 text-xs text-purple-300">
                  Add your project details below, then click "Create Project" to continue.
                </div>
              </SignedIn>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm">Start by describing your project...</p>
                  <p className="text-xs mt-2">What do you want to build or accomplish?</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600"
                          : "bg-slate-700/50 border border-purple-500/20"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <span className="text-xs opacity-60 mt-2 block">
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Composer */}
            <div className="p-6 border-t border-purple-500/20">
              <div className="flex gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-slate-700/50 border border-purple-500/30 rounded-full hover:bg-slate-700 transition-colors"
                  title="Upload images"
                  aria-label="Upload images"
                >
                  <Upload size={20} />
                </button>

                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Describe your project or add notes…"
                  className="flex-1 px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-full focus:border-purple-500 focus:outline-none"
                />

                <button
                  onClick={handleSendMessage}
                  className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </main>

          {/* RIGHT: Media */}
          <aside className="order-3 lg:order-none bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-purple-500/20 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-purple-300">Project Media</h2>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 border-2 border-dashed border-purple-500/30 rounded-xl hover:border-purple-500/50 transition-colors mb-4 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-gray-300"
            >
              <Image size={18} />
              Upload Photos
            </button>

            {uploadedImages.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                <Image size={48} className="mx-auto mb-3 opacity-30" />
                <p>No images uploaded yet</p>
                <p className="text-xs mt-1">Upload photos to visualize your project</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-32 object-cover rounded-lg border border-purple-500/20"
                    />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploadedImages.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-3 text-gray-300">Visual Previews</h3>
                <div className="space-y-3">
                  <div className="h-32 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30 flex items-center justify-center">
                    <span className="text-xs text-gray-400">Generating preview…</span>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
