import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../App';
import { useAuth } from '../App';

function HeroSection() {
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <section id="home" className={`relative min-h-screen overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Gaming-themed background elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 left-10 w-20 h-20 rounded-full opacity-20 animate-pulse ${
          isDarkMode ? 'bg-cyan-400' : 'bg-blue-400'
        }`}></div>
        <div className={`absolute top-40 right-20 w-16 h-16 rounded-full opacity-20 animate-bounce ${
          isDarkMode ? 'bg-red-500' : 'bg-red-400'
        }`}></div>
        <div className={`absolute bottom-20 left-1/4 w-12 h-12 rounded-full opacity-20 animate-ping ${
          isDarkMode ? 'bg-green-500' : 'bg-green-400'
        }`}></div>
        <div className={`absolute bottom-40 right-1/3 w-24 h-24 rounded-full opacity-20 animate-bounce ${
          isDarkMode ? 'bg-purple-500' : 'bg-purple-400'
        }`}></div>
        
        {/* Grid pattern overlay */}
        <div className={`absolute inset-0 opacity-5 ${
          isDarkMode ? 'bg-cyan-400' : 'bg-blue-400'
        }`} style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <span className={`block transform hover:scale-105 transition duration-500 ${
                isDarkMode ? 'text-cyan-400' : 'text-blue-600'
              }`}>
                ⚡ BINGO
              </span>
              <span className={`block transform hover:scale-105 transition duration-500 ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                GAME
              </span>
            </h1>
            <p className={`text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Experience the ultimate digital Bingo adventure! 
              Compete with players worldwide, unlock achievements, and dominate the leaderboard.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <>
                <Link to="/game" className={`px-8 py-4 rounded-lg text-lg font-bold transform hover:scale-105 transition duration-300 shadow-lg ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/25' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-blue-500/25'
                }`}>
                  🚀 Start Playing Now
                </Link>
                <Link to="/dashboard" className={`px-8 py-4 rounded-lg text-lg font-semibold transform hover:scale-105 transition duration-300 border-2 ${
                  isDarkMode 
                    ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900' 
                    : 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
                }`}>
                  🏠 Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup" className={`px-8 py-4 rounded-lg text-lg font-bold transform hover:scale-105 transition duration-300 shadow-lg ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/25' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-blue-500/25'
                }`}>
                  🚀 Start Playing Now
                </Link>
                <Link to="/login" className={`px-8 py-4 rounded-lg text-lg font-semibold transform hover:scale-105 transition duration-300 border-2 ${
                  isDarkMode 
                    ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900' 
                    : 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
                }`}>
                  🔑 Sign In
                </Link>
              </>
            )}
          </div>
          
          {/* Gaming stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`rounded-xl p-6 border-2 transform hover:scale-105 transition duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm' 
                : 'bg-white/50 border-gray-200 backdrop-blur-sm'
            }`}>
              <div className="text-4xl mb-4">🎮</div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Single Player</h3>
              <p className={`${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Play against the computer</p>
            </div>
            <div className={`rounded-xl p-6 border-2 transform hover:scale-105 transition duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm' 
                : 'bg-white/50 border-gray-200 backdrop-blur-sm'
            }`}>
              <div className="text-4xl mb-4">🏆</div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Achievements</h3>
              <p className={`${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Unlock badges and climb rankings</p>
            </div>
            <div className={`rounded-xl p-6 border-2 transform hover:scale-105 transition duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm' 
                : 'bg-white/50 border-gray-200 backdrop-blur-sm'
            }`}>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Fast & Fun</h3>
              <p className={`${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Quick matches with instant results</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection; 