import React from 'react';
import { useTheme } from '../App';

function AboutSection() {
  const { isDarkMode } = useTheme();

  return (
    <section id="about" className={`py-20 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black' 
        : 'bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            About Our <span className={`${
              isDarkMode ? 'text-cyan-400' : 'text-blue-600'
            }`}>Bingo Game</span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Experience the classic game of Bingo reimagined for the digital age with stunning graphics, 
            smooth animations, and exciting multiplayer features.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Interactive Bingo Board */}
          <div className="relative">
            <div className={`rounded-2xl p-8 border-2 transform hover:scale-105 transition duration-500 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
                : 'bg-white/50 border-gray-200 backdrop-blur-sm'
            }`}>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className={`aspect-square rounded-lg flex items-center justify-center font-bold text-sm transform hover:scale-110 transition duration-200 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white' 
                      : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                  }`}>
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Interactive 5x5 Bingo Board</p>
              </div>
            </div>
          </div>
          
          {/* Right side - Content */}
          <div className="space-y-8">
            <div className={`rounded-xl p-6 border-2 transform hover:scale-105 transition duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
                : 'bg-white/50 border-gray-200 backdrop-blur-sm'
            }`}>
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🎯</div>
                <h3 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Classic Gameplay</h3>
              </div>
              <p className={`leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Enjoy the traditional Bingo experience with our beautifully designed 5x5 grid. 
                Mark your numbers and shout "BINGO!" when you complete a line.
              </p>
            </div>
            
            <div className={`rounded-xl p-6 border-2 transform hover:scale-105 transition duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
                : 'bg-white/50 border-gray-200 backdrop-blur-sm'
            }`}>
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🌐</div>
                <h3 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Online Multiplayer</h3>
              </div>
              <p className={`leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Connect with friends and family from anywhere in the world. 
                Create private rooms or join public games with players worldwide.
              </p>
            </div>
            
            <div className={`rounded-xl p-6 border-2 transform hover:scale-105 transition duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
                : 'bg-white/50 border-gray-200 backdrop-blur-sm'
            }`}>
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🏆</div>
                <h3 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Achievements & Rewards</h3>
              </div>
              <p className={`leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Earn points, unlock achievements, and climb the leaderboard. 
                Special rewards await the most skilled Bingo players!
              </p>
            </div>
          </div>
        </div>
        
        {/* Gaming stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${
              isDarkMode ? 'text-cyan-400' : 'text-blue-600'
            }`}>10K+</div>
            <div className={`${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Active Players</div>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`}>50K+</div>
            <div className={`${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Games Played</div>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${
              isDarkMode ? 'text-purple-400' : 'text-purple-600'
            }`}>100+</div>
            <div className={`${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Countries</div>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${
              isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
            }`}>4.9★</div>
            <div className={`${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>User Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection; 