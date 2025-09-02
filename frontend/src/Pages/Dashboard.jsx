import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../App';
import { useAuth } from '../App';
import Navbar from '../Components/Navbar';
import UserStatistics from '../Components/UserStatistics';
import Leaderboard from '../Components/Leaderboard';
import apiService from '../services/api';

function Dashboard() {
  const { isDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [editing, setEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const { login } = useAuth();

  const hasRefreshed = useRef(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!hasRefreshed.current) {
      refreshUserData();
      hasRefreshed.current = true;
    }
  }, [user?.id, navigate]);

  // Function to refresh user data from backend
  const refreshUserData = async () => {
    try {
      const response = await apiService.getUserStats();
      if (response.success && response.data.stats) {
        // Update user context only if values actually changed
        const nextCoins = response.data.stats.coins ?? user.coins;
        const nextLevel = response.data.stats.level ?? user.level;
        const nextTotalPoints = response.data.stats.totalPoints ?? user.totalPoints;

        if (
          nextCoins !== user.coins ||
          nextLevel !== user.level ||
          nextTotalPoints !== user.totalPoints
        ) {
          const updatedUser = {
            ...user,
            coins: nextCoins,
            level: nextLevel,
            totalPoints: nextTotalPoints
          };
          login(updatedUser);
        }
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStartGame = () => {
    navigate('/game');
  };

  const handleEditClick = () => {
    setEditing(true);
    setEditUsername(user.username);
    setEditAvatar(user.avatar || '');
    setAvatarFile(null);
    setProfileError('');
    setProfileSuccess('');
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setProfileError('');
    setProfileSuccess('');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    try {
      let avatarToSend = editAvatar;
      // If a new file is selected, use its base64
      if (avatarFile) {
        avatarToSend = editAvatar;
      }
      const response = await apiService.updateUserProfile({
        username: editUsername,
        avatar: avatarToSend,
      });
      if (response.success) {
        login(response.data.user); // update context
        setProfileSuccess('Profile updated successfully!');
        setEditing(false);
      } else {
        setProfileError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome back, {user.username}! 🎯
            </h1>
            <p className={`text-xl ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Ready for another BingoV adventure?
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className={`flex rounded-lg p-1 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            } shadow-lg`}>
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'overview'
                    ? isDarkMode
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-blue-500 text-white shadow-lg'
                    : isDarkMode
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('statistics')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'statistics'
                    ? isDarkMode
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-blue-500 text-white shadow-lg'
                    : isDarkMode
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Statistics
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="max-w-4xl mx-auto">
              {/* User Info - moved to top */}
              <div className={`rounded-2xl p-8 shadow-2xl mb-8 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border border-gray-600 backdrop-blur-sm' 
                  : 'bg-white/50 border border-gray-200 backdrop-blur-sm'
              }`}>
                <h2 className={`text-3xl font-bold text-center mb-8 ${
                  isDarkMode ? 'text-cyan-400' : 'text-blue-600'
                }`}>
                  Your Profile
                </h2>
                <div className="flex justify-end mb-2">
                  {!editing && (
                    <button
                      className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all"
                      onClick={handleEditClick}
                    >
                      Edit
                    </button>
                  )}
                </div>
                {profileError && (
                  <div className="text-red-500 text-center mb-2">{profileError}</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      {editing ? (
                        <>
                          {editAvatar ? (
                            <img src={editAvatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                          ) : (
                            '👤'
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="mt-2 block mx-auto text-sm"
                            onChange={handleAvatarChange}
                          />
                        </>
                      ) : user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                      ) : (
                        '👤'
                      )}
                    </div>
                    {editing ? (
                      <input
                        type="text"
                        className={`text-2xl font-bold mb-2 w-full text-center rounded-lg px-2 py-1 ${
                          isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                        }`}
                        value={editUsername}
                        onChange={e => setEditUsername(e.target.value)}
                        maxLength={24}
                      />
                    ) : (
                      <h3 className={`text-2xl font-bold mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {user.username}
                      </h3>
                    )}
                    <p className={`${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {user.email}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Coins
                      </div>
                      <div className={`text-2xl font-bold flex items-center gap-2 ${
                        isDarkMode ? 'text-yellow-300' : 'text-yellow-600'
                      }`}>
                        <span>🪙</span> {user.coins ?? 0}
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Account Status
                      </div>
                      <div className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {user.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Member Since
                      </div>
                      <div className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {editing && (
                      <div className="flex space-x-2">
                        <button
                          className="px-4 py-2 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 transition-all"
                          onClick={handleProfileSave}
                        >
                          Save
                        </button>
                        <button
                          className="px-4 py-2 rounded-lg font-medium bg-gray-400 text-white hover:bg-gray-500 transition-all"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`rounded-2xl p-8 shadow-2xl mb-8 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border border-gray-600 backdrop-blur-sm' 
                  : 'bg-white/50 border border-gray-200 backdrop-blur-sm'
              }`}>
                <h2 className={`text-3xl font-bold text-center mb-8 ${
                  isDarkMode ? 'text-cyan-400' : 'text-blue-600'
                }`}>
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={handleStartGame}
                    className={`p-8 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25'
                    }`}
                  >
                    <div className="text-4xl mb-4">🎮</div>
                    <div className="text-xl font-bold mb-2">Start a new BingoV game</div>
                    <div className="text-sm opacity-90">Challenge the computer!</div>
                  </button>
                  <button
                    onClick={() => navigate('/multiplayer')}
                    className={`p-8 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 text-white shadow-lg shadow-green-500/25' 
                        : 'bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 text-white shadow-lg shadow-green-500/25'
                    }`}
                  >
                    <div className="text-4xl mb-4">🤝</div>
                    <div className="text-xl font-bold mb-2">Multiplayer Bingo</div>
                    <div className="text-sm opacity-90">Play with a friend in real time!</div>
                  </button>
                  <div className={`p-8 rounded-xl text-center ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <div className="text-4xl mb-4">🏆</div>
                    <div className={`text-xl font-bold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Leaderboard</div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>See top players below!</div>
                  </div>
                </div>
              </div>
              {/* Leaderboard */}
              <div className="container mx-auto px-4 pb-8">
                <Leaderboard />
              </div> 
            </div>
          )}

          {activeTab === 'statistics' && (
            <div className="max-w-4xl mx-auto">
              <UserStatistics />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;