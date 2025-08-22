import React from 'react';
import { useTheme } from '../App';

function HowToPlaySection() {
  const { isDarkMode } = useTheme();

  return (
    <section id="how-to-play" className={`py-20 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            How to <span className={`${
              isDarkMode ? 'text-cyan-400' : 'text-blue-600'
            }`}>Play</span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Learn the rules and start playing in minutes! Our Bingo game is easy to understand 
            and fun for players of all ages.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className={`rounded-xl p-6 border-2 transform hover:scale-105 transition duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
              : 'bg-white/50 border-gray-200 backdrop-blur-sm'
          }`}>
            <div className="text-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-600'
              }`}>
                1
              </div>
              <h3 className={`text-xl font-bold mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Get Your Card</h3>
            </div>
            <p className={`text-center leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Each player receives a unique 5x5 Bingo card with random numbers from 1-75.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className={`rounded-xl p-6 border-2 transform hover:scale-105 transition duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
              : 'bg-white/50 border-gray-200 backdrop-blur-sm'
          }`}>
            <div className="text-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                  : 'bg-gradient-to-br from-green-500 to-emerald-600'
              }`}>
                2
              </div>
              <h3 className={`text-xl font-bold mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Listen for Numbers</h3>
            </div>
            <p className={`text-center leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Numbers are called out randomly. Pay attention and mark matching numbers on your card.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className={`rounded-xl p-6 border-2 transform hover:scale-105 transition duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
              : 'bg-white/50 border-gray-200 backdrop-blur-sm'
          }`}>
            <div className="text-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                  : 'bg-gradient-to-br from-purple-500 to-pink-600'
              }`}>
                3
              </div>
              <h3 className={`text-xl font-bold mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Mark Your Numbers</h3>
            </div>
            <p className={`text-center leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Click on matching numbers to mark them. Watch for patterns forming on your card.
            </p>
          </div>
          
          {/* Step 4 */}
          <div className={`rounded-xl p-6 border-2 transform hover:scale-105 transition duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
              : 'bg-white/50 border-gray-200 backdrop-blur-sm'
          }`}>
            <div className="text-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-red-500 to-orange-600' 
                  : 'bg-gradient-to-br from-red-500 to-orange-600'
              }`}>
                4
              </div>
              <h3 className={`text-xl font-bold mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Shout BINGO!</h3>
            </div>
            <p className={`text-center leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Complete a line (horizontal, vertical, or diagonal) and click "BINGO!" to win!
            </p>
          </div>
        </div>
        
        {/* Game patterns */}
        <div className="mt-16">
          <h3 className={`text-3xl font-bold text-center mb-8 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Winning Patterns</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`rounded-xl p-6 border-2 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
                : 'bg-white/50 border-gray-200 backdrop-blur-sm'
            }`}>
              <h4 className={`text-xl font-bold mb-4 text-center ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Horizontal Line</h4>
              <div className="grid grid-cols-5 gap-1 mb-4">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className={`aspect-square rounded flex items-center justify-center text-white font-bold text-xs ${
                    i < 5 
                      ? (isDarkMode ? 'bg-cyan-500' : 'bg-blue-500')
                      : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')
                  }`}>
                    {i + 1}
                  </div>
                ))}
              </div>
              <p className={`text-center text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Complete any row across</p>
            </div>
            
            <div className={`rounded-xl p-6 border-2 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
                : 'bg-white/50 border-gray-200 backdrop-blur-sm'
            }`}>
              <h4 className={`text-xl font-bold mb-4 text-center ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Vertical Line</h4>
              <div className="grid grid-cols-5 gap-1 mb-4">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className={`aspect-square rounded flex items-center justify-center text-white font-bold text-xs ${
                    i % 5 === 0 
                      ? (isDarkMode ? 'bg-green-500' : 'bg-green-500')
                      : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')
                  }`}>
                    {i + 1}
                  </div>
                ))}
              </div>
              <p className={`text-center text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Complete any column down</p>
            </div>
            
            <div className={`rounded-xl p-6 border-2 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
                : 'bg-white/50 border-gray-200 backdrop-blur-sm'
            }`}>
              <h4 className={`text-xl font-bold mb-4 text-center ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Diagonal Line</h4>
              <div className="grid grid-cols-5 gap-1 mb-4">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className={`aspect-square rounded flex items-center justify-center text-white font-bold text-xs ${
                    i % 6 === 0 
                      ? (isDarkMode ? 'bg-purple-500' : 'bg-purple-500')
                      : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')
                  }`}>
                    {i + 1}
                  </div>
                ))}
              </div>
              <p className={`text-center text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Complete diagonal line</p>
            </div>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="mt-16 text-center">
          <button className={`px-8 py-4 rounded-lg text-lg font-bold transform hover:scale-105 transition duration-300 shadow-lg ${
            isDarkMode 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/25' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-blue-500/25'
          }`}>
            🎮 Start Your First Game
          </button>
        </div>
      </div>
    </section>
  );
}

export default HowToPlaySection; 