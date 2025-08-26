import React from 'react';
import LogoDark from '../assets/BingoV Logo Symbol Only - Light Mode.png';
import LogoLight from '../assets/BingoV Logo Symbol Only - Dark Mode.png';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../App';
import { useAuth } from '../App';
import { useState } from 'react';

function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAuthenticated, handleLogoutClick } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => setMobileMenuOpen((open) => !open);
  const handleMobileMenuClose = () => setMobileMenuOpen(false);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700' 
        : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Link to="/">
                <img
                  src={isDarkMode ? LogoDark : LogoLight}
                  alt="BingoV Logo"
                  className="h-10 w-auto"
                  style={{ marginRight: '0.5rem' }}
                />
              </Link>
              <Link to="/" className={`text-2xl font-bold tracking-wider ${
                isDarkMode 
                  ? 'text-cyan-400' 
                  : 'text-blue-600'
              }`}>
                BingoV
              </Link>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
            }`} onClick={handleMobileMenuClose}>
              Home
            </Link>
            <Link to="/#about" className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
            }`} onClick={handleMobileMenuClose}>
              About
            </Link>
            <Link to="/#how-to-play" className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
            }`} onClick={handleMobileMenuClose}>
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
                }`} onClick={handleMobileMenuClose}>
                  🏠 Dashboard
                </Link>
                <Link to="/game" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25'
                }`} onClick={handleMobileMenuClose}>
                  🎮 Play Game
                </Link>
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-800 text-cyan-400' 
                    : 'bg-gray-100 text-blue-600'
                }`}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-7 h-7 rounded-full object-cover border border-gray-300" />
                  ) : (
                    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-300 text-gray-600 text-lg">👤</span>
                  )}
                  <span>{user?.username || 'Player'}</span>
                </div>
                <button
                  onClick={handleLogoutClick}
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
                }`} onClick={handleMobileMenuClose}>
                  🔑 Login
                </Link>
                <Link to="/signup" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25'
                }`} onClick={handleMobileMenuClose}>
                  📝 Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center space-x-2 w-auto">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            {/* Centered user icon */}
            <div className="flex-1 flex justify-center">
              {isAuthenticated ? (
                user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-gray-300" />
                ) : (
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-600 text-lg">👤</span>
                )
              ) : null}
            </div>
            <button
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
              }`}
              onClick={handleMobileMenuToggle}
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className={`md:hidden fixed inset-0 z-50 flex`} onClick={handleMobileMenuClose}>
            {/* Overlay */}
            <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/70' : 'bg-black/30'}`}></div>
            {/* Drawer - match dashboard background */}
            <div className={`relative ml-auto w-64 h-[64vh] mt-2 mr-2 rounded-2xl shadow-2xl transition-all duration-300 ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'
                : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900'
            } flex flex-col p-6 space-y-6`} onClick={e => e.stopPropagation()}>
              <button className={`self-end mb-4 text-2xl focus:outline-none ${isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-500 hover:text-blue-600'}`} onClick={handleMobileMenuClose} aria-label="Close menu">×</button>
              <Link to="/" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isDarkMode ? 'text-cyan-300 hover:bg-gray-800 hover:text-cyan-400' : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'}`} onClick={handleMobileMenuClose}>Home</Link>
              <Link to="/#about" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isDarkMode ? 'text-cyan-300 hover:bg-gray-800 hover:text-cyan-400' : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'}`} onClick={handleMobileMenuClose}>About</Link>
              <Link to="/#how-to-play" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isDarkMode ? 'text-cyan-300 hover:bg-gray-800 hover:text-cyan-400' : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'}`} onClick={handleMobileMenuClose}>How to Play</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isDarkMode ? 'text-cyan-300 hover:bg-gray-800 hover:text-cyan-400' : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'}`} onClick={handleMobileMenuClose}>🏠 Dashboard</Link>
                  <Link to="/game" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isDarkMode ? 'text-cyan-300 hover:bg-gray-800 hover:text-cyan-400' : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'}`} onClick={handleMobileMenuClose}>🎮 Play Game</Link>
                  {/* User info removed from drawer */}
                  <button onClick={() => { handleLogoutClick(); handleMobileMenuClose(); }} className={`block w-full px-3 py-2 rounded-md text-base font-medium transition-colors text-center ${isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}>🚪 Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isDarkMode ? 'text-cyan-300 hover:bg-gray-800 hover:text-cyan-400' : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'}`} onClick={handleMobileMenuClose}>🔑 Login</Link>
                  <Link to="/signup" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isDarkMode ? 'text-cyan-300 hover:bg-gray-800 hover:text-cyan-400' : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'}`} onClick={handleMobileMenuClose}>📝 Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 