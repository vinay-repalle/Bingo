import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../App';
import { useAuth } from '../App';

function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700' 
        : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className={`text-2xl font-bold tracking-wider ${
                isDarkMode 
                  ? 'text-cyan-400' 
                  : 'text-blue-600'
              }`}>
                <span className="text-red-500">⚡</span> BINGO <span className="text-green-500">GAME</span>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
            }`}>
              Home
            </Link>
            <Link to="/#about" className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
            }`}>
              About
            </Link>
            <Link to="/#how-to-play" className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
            }`}>
              How to Play
            </Link>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            
            {/* Authentication/User Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25'
                }`}>
                  🏠 Dashboard
                </Link>
                <Link to="/game" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25'
                }`}>
                  🎮 Play Game
                </Link>
                <div className={`px-3 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-800 text-cyan-400' 
                    : 'bg-gray-100 text-blue-600'
                }`}>
                  👤 {user?.username || 'Player'}
                </div>
                <button
                  onClick={handleLogout}
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-red-400 hover:bg-gray-800' 
                      : 'text-gray-700 hover:text-red-600 hover:bg-gray-100'
                  }`}
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode 
                    ? 'border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900' 
                    : 'border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
                }`}>
                  🔑 Login
                </Link>
                <Link to="/signup" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25'
                }`}>
                  📝 Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button className={`p-2 rounded-lg transition-all duration-300 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
            }`}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 