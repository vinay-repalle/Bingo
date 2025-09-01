import React from 'react';
import LogoDark from '../assets/BingoV Logo Symbol Only - Dark Mode.png';
import LogoLight from '../assets/BingoV Logo Symbol Only - Light Mode.png';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../App';
import { useAuth } from '../App';
import { useState, useEffect } from 'react';

function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAuthenticated, handleLogoutClick } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMobileMenuToggle = () => setMobileMenuOpen((open) => !open);
  const handleMobileMenuClose = () => setMobileMenuOpen(false);

  // Handle scroll effect for desktop only
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Overlay Navbar (lg and up) */}
      <nav 
        className={`hidden lg:block fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
          isDarkMode 
            ? 'bg-gray-900/90 backdrop-blur-md border border-gray-700' 
            : 'bg-white/90 backdrop-blur-md border border-gray-200'
        } rounded-2xl shadow-2xl`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: isScrolled && !isHovered ? (isAuthenticated ? '170px' : '200px') : 'auto',
          minWidth: isScrolled && !isHovered ? (isAuthenticated ? '170px' : '200px') : 'auto'
        }}
      >
        <div className={`px-6 py-3 transition-all duration-500 ${
          isScrolled && !isHovered ? 'px-4' : 'px-6'
        }`}>
          <div className={`flex justify-between items-center transition-all duration-500 ${
            isScrolled ? 'h-10 lg:h-12' : 'h-12'
          }`}>
            <div className="flex items-center">
              <div className={`flex-shrink-0 flex items-center gap-1 transition-all duration-500 ${
                isScrolled && !isHovered ? 'gap-1' : 'gap-1'
              }`}>
                <Link to="/" className="group">
                  <img
                    src={isDarkMode ? LogoDark : LogoLight}
                    alt="BingoV Logo"
                    className={`transition-all duration-500 ${
                      isScrolled && !isHovered ? 'h-5 w-auto' : 'h-8 w-auto'
                    }`}
                  />
                </Link>
                <Link to="/" className={`font-bold tracking-wider transition-all duration-500 ${
                  isScrolled && !isHovered 
                    ? 'text-lg' 
                    : 'text-xl'
                } ${
                  isDarkMode 
                    ? 'text-cyan-400' 
                    : 'text-blue-600'
                }`}>
                  BingoV
                </Link>
              </div>
            </div>

            {/* Shrunk state content - always visible when scrolled and not hovered */}
            {isScrolled && !isHovered && (
              <div className="flex items-center space-x-2 transition-all duration-500">
                {isAuthenticated ? (
                  // Authenticated users: show nothing extra (just logo + BingoV)
                  <div></div>
                ) : (
                  // Non-authenticated users: show login button with text
                  <div className="flex items-center space-x-2 ml-8">
                    <Link to="/login" className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                      isDarkMode 
                        ? 'border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900' 
                        : 'border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
                    }`}>
                      Login
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Desktop Nav - Full navbar at top, collapsed when scrolled */}
            <div className={`flex items-center space-x-4 ml-12 transition-all duration-500 ${
              isScrolled && !isHovered ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}>
              <Link to="/" className={`px-3 py-2 rounded-lg text-sm font-medium transition duration-300 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
              }`} onClick={handleMobileMenuClose}>
                Home
              </Link>
              <Link to="/about" className={`px-3 py-2 rounded-lg text-sm font-medium transition duration-300 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
              }`} onClick={handleMobileMenuClose}>
                About Us
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
                <div className="flex items-center space-x-3">
                  <Link to="/dashboard" className={`px-3 py-1 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25'
                  }`} onClick={handleMobileMenuClose}>
                    🏠 Dashboard
                  </Link>
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-800 text-cyan-400' 
                      : 'bg-gray-100 text-blue-600'
                  }`}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-6 h-6 rounded-full object-cover border border-gray-300" />
                    ) : (
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-300 text-gray-600 text-sm">👤</span>
                    )}
                    <span className="text-sm">{user?.username || 'Player'}</span>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                      isDarkMode 
                        ? 'text-gray-300 hover:text-red-400 hover:bg-gray-800' 
                        : 'text-gray-700 hover:text-red-600 hover:bg-gray-100'
                    }`}
                  >
                    🚪 Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                    isDarkMode 
                      ? 'border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900' 
                      : 'border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
                  }`} onClick={handleMobileMenuClose}>
                    🔑 Login
                  </Link>
                  <Link to="/signup" className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25'
                  }`} onClick={handleMobileMenuClose}>
                    📝 Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Sticky Navbar (below lg) */}
      <nav className={`lg:hidden sticky top-0 z-50 transition-all duration-300 ${
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

            {/* Mobile menu button and theme toggle */}
            <div className="flex items-center space-x-2 w-auto">
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
              
              {/* Centered user icon - only show when authenticated */}
              {isAuthenticated && (
                <div className="flex-1 flex justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-gray-300" />
                  ) : (
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-600 text-lg">👤</span>
                  )}
                </div>
              )}
              
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
        </div>
        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className={`fixed inset-0 z-50 flex`} onClick={handleMobileMenuClose}>
            {/* Overlay */}
            <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/70' : 'bg-black/30'}`}></div>
            {/* Drawer - match dashboard background */}
            <div className={`relative ml-auto w-72 h-[80vh] mt-2 mr-2 rounded-2xl shadow-2xl transition-all duration-300 ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'
                : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900'
            } flex flex-col p-8 space-y-8`} onClick={e => e.stopPropagation()}>
              
              {/* Header with close button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-cyan-400' : 'text-blue-600'
                }`}>
                  Menu
                </h2>
                <button 
                  className={`text-3xl focus:outline-none transition-colors ${
                    isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-500 hover:text-blue-600'
                  }`} 
                  onClick={handleMobileMenuClose} 
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>

              {/* User Profile Section */}
              {isAuthenticated && (
                <div className={`p-4 rounded-xl border-2 ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-600' 
                    : 'bg-white/50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-blue-500" />
                    ) : (
                      <span className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white text-xl">👤</span>
                    )}
                    <div>
                      <p className={`font-semibold text-lg ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {user?.username || 'Player'}
                      </p>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Welcome back!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-4">
                <Link 
                  to="/" 
                  className={`block px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 ${
                    isDarkMode 
                      ? 'text-cyan-300 hover:bg-gray-800 hover:text-cyan-400' 
                      : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'
                  }`} 
                  onClick={handleMobileMenuClose}
                >
                  🏠 Home
                </Link>
                <Link 
                  to="/about" 
                  className={`block px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 ${
                    isDarkMode 
                      ? 'text-cyan-300 hover:bg-gray-800 hover:text-cyan-400' 
                      : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'
                  }`} 
                  onClick={handleMobileMenuClose}
                >
                  ℹ️ About Us
                </Link>
                
                {/* Authentication Section - Integrated with navigation for consistent spacing */}
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      className={`block px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 ${
                        isDarkMode 
                          ? 'text-cyan-300 hover:bg-gray-800 hover:text-cyan-400' 
                          : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'
                      }`} 
                      onClick={handleMobileMenuClose}
                    >
                      📊 Dashboard
                    </Link>
                    <button 
                      onClick={() => { handleLogoutClick(); handleMobileMenuClose(); }} 
                      className={`block w-full px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 text-center ${
                        isDarkMode 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-red-100 hover:bg-red-200 text-red-700'
                      }`}
                    >
                      🚪 Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className={`block px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 ${
                        isDarkMode 
                          ? 'text-cyan-300 hover:bg-gray-800 hover:text-cyan-400' 
                          : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'
                      }`} 
                      onClick={handleMobileMenuClose}
                    >
                      🔑 Login
                    </Link>
                    <Link 
                      to="/signup" 
                      className={`block px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 ${
                        isDarkMode 
                          ? 'text-cyan-300 hover:bg-gray-800 hover:text-cyan-400' 
                          : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'
                      }`} 
                      onClick={handleMobileMenuClose}
                    >
                      📝 Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar; 