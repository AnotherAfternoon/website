import { useState, useRef, useEffect } from "react";
import { Send, Upload, Image, X, Clock } from "lucide-react";
import { SignInButton, UserButton, useUser, SignedIn, SignedOut } from "@clerk/clerk-react";

// ---- Header auth (inline for this page) ----
function HeaderAuth() {
  const { isSignedIn } = useUser();

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
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Save Project
          </button>
          <UserButton appearance={{ elements: { avatarBox: "ring-2 ring-purple-500/50 rounded-full" } }} />
        </div>
      </SignedIn>
    </>
  );
}

export default function NewProject() {
  // --- Left: project info + steps ---
  const [projectInfo, setProjectInfo] = useState({
    title: "New Home Project",
    description: "",
    difficulty: "Medium",
    estimatedTime: "2–4 hours",
    status: "Planning",
  });
  const [steps, setSteps] = useState([]);

  // --- Center: notes/chat-like input (no AI wiring yet) ---
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome! Describe what you'd like to build or fix, and upload a few photos. We'll outline the steps on the left.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // --- Right: media ---
  const [uploadedImages, setUploadedImages] = useState([]);
  const fileInputRef = useRef(null);

  // autoscroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // revoke object URLs on unmount / change
  useEffect(() => {
    return () => {
      uploadedImages.forEach((i) => URL.revokeObjectURL(i.url));
    };
  }, [uploadedImages]);

  // mock “assist” for demo – updates steps based on keywords
  const maybeUpdatePlan = (text) => {
    const t = text.toLowerCase();
    if (t.includes("paint")) {
      setProjectInfo((p) => ({
        ...p,
        title: "Interior Painting",
        description: "Walls and trim refresh",
        difficulty: "Easy–Medium",
        estimatedTime: "1–2 afternoons",
      }));
      setSteps([
        { id: 1, title: "Prep the room", details: "Move furniture, cover floors", status: "pending" },
        { id: 2, title: "Surface prep", details: "Clean, fill holes, sand lightly", status: "pending" },
        { id: 3, title: "Prime & paint", details: "Cut-in, roll, let dry, second coat", status: "pending" },
      ]);
    }
  };

  const handleSendMessage = () => {
    const text = inputMessage.trim();
    if (!text) return;

    const userMsg = { role: "user", content: text, timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    // fake assistant reply (placeholder)
    setTimeout(() => {
      const reply = {
        role: "assistant",
        content:
          "Noted. I’ve updated the plan where possible. Upload photos for better guidance.",
        timestamp: new Date(),
      };
      setMessages((m) => [...m, reply]);
      setIsTyping(false);
      maybeUpdatePlan(text);
    }, 800);
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
          <HeaderAuth />
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
                Describe your goal and context. Upload photos for clarity.
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => (
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
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-700/50 border border-purple-500/20 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full animate-bounce bg-purple-400" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full animate-bounce bg-purple-400" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full animate-bounce bg-purple-400" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
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
