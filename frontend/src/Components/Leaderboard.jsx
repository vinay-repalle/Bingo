import React, { useState, useEffect } from 'react';
import { useTheme } from '../App';
import apiService from '../services/api';

function Leaderboard() {
  const { isDarkMode } = useTheme();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.getLeaderboard(10);
      if (response.success) {
        setLeaderboard(response.data);
      }
    } catch (error) {
      setError(error.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
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
    <div className={`${
      isDarkMode ? 'bg-gray-700' : 'bg-white'
    } rounded-xl p-6 shadow-lg`}>
      <h3 className={`text-xl font-bold mb-6 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        🏆 Leaderboard
      </h3>

      {leaderboard.length === 0 ? (
        <p className={`text-center py-8 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          No games played yet. Be the first to make it to the top!
        </p>
      ) : (
        <div className="space-y-4">
          {leaderboard.map((player, index) => (
            <div key={player._id} className={`flex items-center justify-between p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-600' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-500 text-white' :
                  'bg-gray-300 text-gray-700'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    {player.avatar ? (
                      <img src={player.avatar} alt="avatar" className="w-7 h-7 rounded-full object-cover border border-gray-300" />
                    ) : (
                      <span className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-300 text-gray-600 text-lg">👤</span>
                    )}
                    <span className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {player.username}
                    </span>
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {player.totalGames} games • {player.winRate}% win rate
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {player.totalWins} wins
                </div>
                <div className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Best: {player.bestScore} lines
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
