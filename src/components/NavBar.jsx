import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Coins } from 'lucide-react';
import { useCredits } from '../contexts/CreditsContext';

export default function NavBar() {
  const { isSignedIn } = useUser();
  const { credits, loading } = useCredits();

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

                {/* Credit Balance */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  {loading ? (
                    <span className="text-sm text-gray-400">...</span>
                  ) : credits ? (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-white">
                        {credits.balance}
                      </span>
                      <span className="text-xs text-gray-400">credits</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">--</span>
                  )}
                </div>
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
