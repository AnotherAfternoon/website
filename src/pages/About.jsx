import { Link } from 'react-router-dom';
import { Home, CheckCircle, Clock, Shield, FileText, Lightbulb } from 'lucide-react';
import NavBar from '../components/NavBar';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 py-16 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            About AnotherAfternoon
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your digital companion for managing home renovation projects with clarity, safety, and confidence.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12 border border-purple-500/30">
          <div className="flex items-start gap-4 mb-4">
            <Home className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                We created AnotherAfternoon to help homeowners manage their renovation projects effectively.
                This platform serves as a digital record of your home projects, providing a structured framework
                to plan, track, and document every step of your journey.
              </p>
            </div>
          </div>
        </div>

        {/* The Story */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            AnotherAfternoon was born from real-world experience in home renovation. Having completed numerous
            home projects firsthand, we intimately understand the challenges homeowners face:
          </p>

          <div className="space-y-4 mt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-300">
                <span className="font-semibold text-white">Unclear project scope</span> -
                What exactly needs to be done?
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-300">
                <span className="font-semibold text-white">Poorly defined steps</span> -
                How do I break this down into manageable tasks?
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-300">
                <span className="font-semibold text-white">Time estimation</span> -
                How long will this actually take?
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-300">
                <span className="font-semibold text-white">Progress tracking</span> -
                Where am I in the process?
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-300">
                <span className="font-semibold text-white">Safety checkpoints</span> -
                What precautions should I take?
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-300">
                <span className="font-semibold text-white">Documentation burden</span> -
                Keeping detailed records is time-consuming
              </p>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">What We Offer</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            AnotherAfternoon provides a comprehensive framework to keep track of your home renovation projects,
            addressing each of these pain points:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-500/20">
              <FileText className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Clear Project Definition
              </h3>
              <p className="text-gray-300 text-sm">
                AI-powered project planning that breaks down complex renovations into clear, actionable steps
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-500/20">
              <Clock className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Time Estimates
              </h3>
              <p className="text-gray-300 text-sm">
                Realistic time projections for each step, helping you plan your schedule effectively
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-500/20">
              <Shield className="w-8 h-8 text-red-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Safety First
              </h3>
              <p className="text-gray-300 text-sm">
                Built-in safety checklists and precautions specific to your project type
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-500/20">
              <Lightbulb className="w-8 h-8 text-yellow-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Expert Guidance
              </h3>
              <p className="text-gray-300 text-sm">
                Detailed instructions, pro tips, and common mistakes to avoid for each step
              </p>
            </div>
          </div>
        </div>

        {/* Our Commitment */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-8 mb-12 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">Our Commitment</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Our goal is to deliver <span className="text-purple-300 font-semibold">value</span> and{' '}
            <span className="text-blue-300 font-semibold">safety</span> to everyone who uses AnotherAfternoon.
            We believe that home renovation should be empowering, not overwhelming. By providing the right tools,
            guidance, and structure, we help you transform your vision into reality—one step at a time.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/new-project"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Start Your First Project
          </Link>
          <p className="text-gray-400 mt-4 text-sm">
            Get 10 free credits to explore the platform
          </p>
        </div>
      </div>
    </div>
  );
}
