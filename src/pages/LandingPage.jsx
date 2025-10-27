import { useState } from "react";
import { ArrowRight, Play, Menu, X, Sparkles, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const demos = [
    { title: "Interactive Dashboard", description: "Real-time analytics and insights at your fingertips", thumbnail: "bg-gradient-to-br from-purple-500 to-pink-500", duration: "3:24" },
    { title: "Seamless Integration", description: "Connect with your favorite tools in minutes", thumbnail: "bg-gradient-to-br from-blue-500 to-cyan-500", duration: "2:45" },
    { title: "Advanced Automation", description: "Let AI handle the heavy lifting", thumbnail: "bg-gradient-to-br from-orange-500 to-red-500", duration: "4:12" }
  ];

  const features = [
    { icon: Sparkles, text: "Step-by-Step Clarity" },
    { icon: Zap,      text: "Customized for Your Home" },
    { icon: Shield,   text: "Every Project, Simplified" }
  ];

  const handleSubmit = () => {
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg z-50 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AnotherAfternoon.com
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {/* Shared link(s) */}
            <Link to="/about" className="hover:text-purple-400 transition-colors">About</Link>

            {/* Signed-out: show Sign in, hide Projects */}
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

            {/* Signed-in: show Projects/New Project + User menu */}
            <SignedIn>
              <Link to="/projects" className="hover:text-purple-400 transition-colors">Projects</Link>
              <Link
                to="/projects/new"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                New Project
              </Link>
              <UserButton appearance={{ elements: { avatarBox: "ring-2 ring-purple-500/50 rounded-full" } }} />
            </SignedIn>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile drawer */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-purple-500/20">
            <div className="flex flex-col gap-4 px-6 py-4">
              <Link to="/about" className="hover:text-purple-400" onClick={() => setIsMenuOpen(false)}>About</Link>

              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Link
                  to="/projects"
                  className="hover:text-purple-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Projects
                </Link>
                <Link
                  to="/projects/new"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  New Project
                </Link>
                {/* Optional: keep UserButton in mobile; it renders a sheet by default */}
                <div className="pt-2 pb-1">
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block mb-6 px-4 py-2 bg-purple-500/20 border border-purple-500/40 rounded-full text-sm">
            🛠️ Plan · Create · Overcome · Repeat
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            One <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">Afternoon</span> at a time.
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Whether you’re fixing, painting, or building, Another Afternoon turns big ideas into doable weekend projects — clear, visual, and safe.
          </p>

          {/* Primary CTA */}
          <div className="flex justify-center">
            <Link
              to="/projects/new"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
            >
              Start Planning
              <ArrowRight size={20} />
            </Link>
          </div>

          {/* Feature bullets */}
          <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <feature.icon size={16} className="text-purple-400" />
                {feature.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demos Section */}
      <section id="demos" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">See It In Action</h2>
            <p className="text-xl text-gray-300">Explore our demos and discover what's possible</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {demos.map((demo, idx) => (
              <div
                key={idx}
                className="group relative bg-slate-800/50 backdrop-blur rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-105 cursor-pointer"
              >
                <div className={`${demo.thumbnail} h-48 flex items-center justify-center relative`}>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                  <div className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={24} className="ml-1" />
                  </div>
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-sm">
                    {demo.duration}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{demo.title}</h3>
                  <p className="text-gray-400">{demo.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-slate-800 border border-purple-500/30 rounded-full font-semibold hover:bg-slate-700 transition-colors">
              View All Demos
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>© 2025 YourBrand. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
