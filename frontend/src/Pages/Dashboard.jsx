import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../App';
import { useAuth } from '../App';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

function Dashboard() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user stats - in real app, this would come from API
  const userStats = {
    gamesPlayed: 15,
    gamesWon: 8,
    totalScore: 1250,
    bestTime: '2:34',
    winRate: 53.3,
    currentStreak: 3,
    longestStreak: 5,
    averageScore: 83.3
  };

  const recentGames = [
    { id: 1, result: 'Won', score: 95, time: '3:12', date: '2024-01-15' },
    { id: 2, result: 'Lost', score: 67, time: '4:05', date: '2024-01-14' },
    { id: 3, result: 'Won', score: 88, time: '2:45', date: '2024-01-13' },
    { id: 4, result: 'Won', score: 92, time: '2:58', date: '2024-01-12' },
    { id: 5, result: 'Lost', score: 71, time: '3:45', date: '2024-01-11' }
  ];

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
          : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className={`text-4xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome back, <span className={`${
              isDarkMode ? 'text-cyan-400' : 'text-blue-600'
            }`}>{user?.username || 'Player'}!</span> 🎮
            </h1>
            <p className={`text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Ready for another Bingo adventure?
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link to="/game" className={`p-6 rounded-xl border-2 transform hover:scale-105 transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm hover:border-cyan-500' 
                : 'bg-white/50 border-gray-200 backdrop-blur-sm hover:border-blue-500'
            }`}>
              <div className="text-center">
                <div className="text-4xl mb-4">🎮</div>
                <h3 className={`text-xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Play Game</h3>
                <p className={`${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Start a new Bingo game</p>
              </div>
            </Link>

            <div className={`p-6 rounded-xl border-2 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
                : 'bg-white/50 border-gray-200 backdrop-blur-sm'
            }`}>
              <div className="text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className={`text-xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Leaderboard</h3>
                <p className={`${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>View your ranking</p>
              </div>
            </div>

            <div className={`p-6 rounded-xl border-2 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
                : 'bg-white/50 border-gray-200 backdrop-blur-sm'
            }`}>
              <div className="text-center">
                <div className="text-4xl mb-4">⚙️</div>
                <h3 className={`text-xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Settings</h3>
                <p className={`${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Manage your account</p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className={`rounded-xl p-6 border-2 mb-8 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
              : 'bg-white/50 border-gray-200 backdrop-blur-sm'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Your Statistics</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  isDarkMode ? 'text-cyan-400' : 'text-blue-600'
                }`}>{userStats.gamesPlayed}</div>
                <div className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Games Played</div>
              </div>
              
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`}>{userStats.gamesWon}</div>
                <div className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Games Won</div>
              </div>
              
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>{userStats.winRate}%</div>
                <div className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Win Rate</div>
              </div>
              
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                }`}>{userStats.totalScore}</div>
                <div className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Total Score</div>
              </div>
            </div>
          </div>

          {/* Recent Games */}
          <div className={`rounded-xl p-6 border-2 mb-8 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
              : 'bg-white/50 border-gray-200 backdrop-blur-sm'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Recent Games</h2>
            
            <div className="space-y-4">
              {recentGames.map((game) => (
                <div key={game.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      game.result === 'Won' 
                        ? (isDarkMode ? 'bg-green-400' : 'bg-green-500')
                        : (isDarkMode ? 'bg-red-400' : 'bg-red-500')
                    }`}></div>
                    <div>
                      <div className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {game.result} - Score: {game.score}
                      </div>
                      <div className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Time: {game.time} • {game.date}
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    game.result === 'Won' 
                      ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                      : (isDarkMode ? 'text-red-400' : 'text-red-600')
                  }`}>
                    {game.result}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className={`rounded-xl p-6 border-2 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
              : 'bg-white/50 border-gray-200 backdrop-blur-sm'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Achievements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-4 rounded-lg border-2 ${
                isDarkMode 
                  ? 'bg-gray-700/50 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className={`font-semibold mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>First Win</h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Win your first game</p>
                  <div className={`mt-2 text-xs px-2 py-1 rounded ${
                    isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
                  }`}>
                    ✓ Completed
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border-2 ${
                isDarkMode 
                  ? 'bg-gray-700/50 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="text-center">
                  <div className="text-3xl mb-2">🔥</div>
                  <h3 className={`font-semibold mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Hot Streak</h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Win 5 games in a row</p>
                  <div className={`mt-2 text-xs px-2 py-1 rounded ${
                    isDarkMode ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    In Progress (3/5)
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border-2 ${
                isDarkMode 
                  ? 'bg-gray-700/50 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className={`font-semibold mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Speed Demon</h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Win in under 2 minutes</p>
                  <div className={`mt-2 text-xs px-2 py-1 rounded ${
                    isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                  }`}>
                    Locked
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Dashboard; 