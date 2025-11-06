import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';

export default function NavBar() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 border-b border-purple-500/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={isSignedIn ? "/projects" : "/"}
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 transition-all duration-300"
          >
            AA
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {isSignedIn && (
              <>
                <Link
                  to="/projects"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium"
                >
                  Projects
                </Link>
                <Link
                  to="/new-project"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium"
                >
                  New Project
                </Link>
              </>
            )}

            {/* User Button */}
            {isSignedIn && (
              <div className="ml-2">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 ring-2 ring-purple-500/50 hover:ring-purple-400/70 transition-all"
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
