import React, { useState, useEffect } from 'react';
import { useTheme } from '../App';
import apiService from '../services/api';

function UserStatistics() {
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [recentGames, setRecentGames] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAllGames, setShowAllGames] = useState(false);
  const [allGames, setAllGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.getUserStats();
      if (response.success) {
        setStats(response.data.stats);
        setRecentGames(response.data.recentGames);
        setAchievements(response.data.achievements);
      }
    } catch (error) {
      setError(error.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const loadAllGames = async (page = 1) => {
    try {
      const response = await apiService.getUserGames(page, 10);
      if (response.success) {
        setAllGames(response.data.games);
        setTotalPages(response.data.totalPages);
        setCurrentPage(page);
      }
    } catch (error) {
      setError(error.message || 'Failed to load games');
    }
  };

  const handleShowAllGames = () => {
    setShowAllGames(true);
    loadAllGames(1);
  };

  const handlePageChange = (page) => {
    loadAllGames(page);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getResultIcon = (result) => {
    switch (result) {
      case 'win': return '🏆';
      case 'loss': return '❌';
      case 'draw': return '🤝';
      default: return '❓';
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'win': return 'text-green-600';
      case 'loss': return 'text-red-600';
      case 'draw': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center p-8 ${
        isDarkMode ? 'text-white' : 'text-gray-700'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 text-center ${
        isDarkMode ? 'text-red-400' : 'text-red-600'
      }`}>
        {error}
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-8 ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Header */}
      <div className="text-center">
        <h2 className={`text-3xl font-bold mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Your Statistics 📊
        </h2>
        <p className={`text-lg ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Track your progress and achievements
        </p>
      </div>

      {/* Main Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`p-6 rounded-xl text-center ${
            isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
          }`}>
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalGames}</div>
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Total Games</div>
          </div>
          
          <div className={`p-6 rounded-xl text-center ${
            isDarkMode ? 'bg-gray-700' : 'bg-green-50'
          }`}>
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.wins}</div>
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Wins</div>
          </div>
          
          <div className={`p-6 rounded-xl text-center ${
            isDarkMode ? 'bg-gray-700' : 'bg-red-50'
          }`}>
            <div className="text-3xl font-bold text-red-600 mb-2">{stats.losses}</div>
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Losses</div>
          </div>
          
          <div className={`p-6 rounded-xl text-center ${
            isDarkMode ? 'bg-gray-700' : 'bg-purple-50'
          }`}>
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.winRate}%</div>
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Win Rate</div>
          </div>
        </div>
      )}

      {/* Detailed Stats */}
      {stats && (
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
        } p-6 rounded-xl`}>
          <div className="text-center">
            <div className={`text-2xl font-bold mb-1 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {stats.averageScore}
            </div>
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Avg Lines per Game</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold mb-1 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {formatDuration(stats.averageDuration)}
            </div>
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Avg Game Duration</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold mb-1 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {stats.totalLines}
            </div>
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Total Lines Completed</div>
          </div>
        </div>
      )}

      {/* Recent Games */}
      <div className={`${
        isDarkMode ? 'bg-gray-700' : 'bg-white'
      } rounded-xl p-6 shadow-lg`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Recent Games 🎮
          </h3>
          <button
            onClick={handleShowAllGames}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Show All
          </button>
        </div>

        {recentGames.length === 0 ? (
          <p className={`text-center py-8 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No games played yet. Start playing to see your statistics!
          </p>
        ) : (
          <div className="space-y-4">
            {recentGames.map((game, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-600' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{getResultIcon(game.result)}</span>
                  <div>
                    <div className={`font-semibold ${getResultColor(game.result)}`}>
                      {game.result.toUpperCase()}
                    </div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      vs {game.opponent}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {game.score.userLines} - {game.score.opponentLines}
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {formatDuration(game.duration)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Games Modal */}
      {showAllGames && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          isDarkMode ? 'bg-black/50' : 'bg-black/30'
        }`}>
          <div className={`relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <h3 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  All Games
                </h3>
                <button
                  onClick={() => setShowAllGames(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {allGames.length === 0 ? (
                <p className={`text-center py-8 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  No games found.
                </p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {allGames.map((game, index) => (
                      <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl">{getResultIcon(game.result)}</span>
                          <div>
                            <div className={`font-semibold ${getResultColor(game.result)}`}>
                              {game.result.toUpperCase()}
                            </div>
                            <div className={`text-sm ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              vs {game.opponent} • {formatDate(game.completedAt)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {game.score.userLines} - {game.score.opponentLines}
                          </div>
                          <div className={`text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {formatDuration(game.duration)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === 1
                            ? 'opacity-50 cursor-not-allowed'
                            : isDarkMode
                              ? 'bg-gray-600 hover:bg-gray-500 text-white'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        Previous
                      </button>
                      
                      <span className={`px-3 py-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Page {currentPage} of {totalPages}
                      </span>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === totalPages
                            ? 'opacity-50 cursor-not-allowed'
                            : isDarkMode
                              ? 'bg-gray-600 hover:bg-gray-500 text-white'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className={`${
        isDarkMode ? 'bg-gray-700' : 'bg-white'
      } rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-6 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Achievements 🏅
        </h3>

        {achievements.length === 0 ? (
          <p className={`text-center py-8 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No achievements earned yet. Keep playing to unlock them!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${
                achievement.earned
                  ? isDarkMode 
                    ? 'border-yellow-500 bg-yellow-500/10' 
                    : 'border-yellow-400 bg-yellow-50'
                  : isDarkMode 
                    ? 'border-gray-600 bg-gray-600/20' 
                    : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <div className={`font-semibold ${
                      achievement.earned
                        ? isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {achievement.displayName}
                    </div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {achievement.description}
                    </div>
                    {achievement.earned && (
                      <div className={`text-xs mt-1 ${
                        isDarkMode ? 'text-yellow-300' : 'text-yellow-500'
                      }`}>
                        Earned {formatDate(achievement.lastEarned)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserStatistics;
