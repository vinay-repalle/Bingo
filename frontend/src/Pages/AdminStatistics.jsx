import React, { useState } from 'react';

const API_BASE = '/api/admin';

function AdminStatistics() {
  const [auth, setAuth] = useState({ username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userGames, setUserGames] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to get Basic Auth header
  const getAuthHeader = () => {
    return 'Basic ' + btoa(`${auth.username}:${auth.password}`);
  };

  // Admin login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Try to fetch users as login test
      const res = await fetch(`${API_BASE}/users`, {
        headers: { Authorization: getAuthHeader() },
      });
      if (!res.ok) throw new Error('Invalid admin credentials');
      setIsLoggedIn(true);
      fetchAllData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all admin data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Users
      const usersRes = await fetch(`${API_BASE}/users`, {
        headers: { Authorization: getAuthHeader() },
      });
      const usersData = await usersRes.json();
      setUsers(usersData.users || []);
      // Leaderboard
      const lbRes = await fetch(`${API_BASE}/leaderboard`, {
        headers: { Authorization: getAuthHeader() },
      });
      const lbData = await lbRes.json();
      setLeaderboard(lbData.leaderboard || []);
      // Stats
      const statsRes = await fetch(`${API_BASE}/stats`, {
        headers: { Authorization: getAuthHeader() },
      });
      const statsData = await statsRes.json();
      setStats(statsData.stats || null);
      // Reviews
      const reviewsRes = await fetch(`${API_BASE}/reviews`, {
        headers: { Authorization: getAuthHeader() },
      });
      const reviewsData = await reviewsRes.json();
      setReviews(reviewsData.reviews || []);
    } catch (err) {
      setError('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch games for a user
  const fetchUserGames = async (userId) => {
    setLoading(true);
    setUserGames([]);
    setSelectedUser(userId);
    try {
      const res = await fetch(`${API_BASE}/user/${userId}/games`, {
        headers: { Authorization: getAuthHeader() },
      });
      const data = await res.json();
      setUserGames(data.games || []);
    } catch (err) {
      setError('Failed to fetch user games');
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user and all their games?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/user/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: getAuthHeader() },
      });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(users.filter(u => u._id !== userId));
      setUserGames([]);
      setSelectedUser(null);
      fetchAllData();
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  // Login form
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Username</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={auth.username} onChange={e => setAuth({ ...auth, username: e.target.value })} required />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Password</label>
            <input type="password" className="w-full border rounded px-3 py-2" value={auth.password} onChange={e => setAuth({ ...auth, password: e.target.value })} required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Statistics & Management</h1>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        {loading && <div className="text-center mb-4">Loading...</div>}
        {/* Stats summary */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded shadow p-4 text-center">
              <div className="text-lg font-semibold">Total Users</div>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </div>
            <div className="bg-white rounded shadow p-4 text-center">
              <div className="text-lg font-semibold">Total Games</div>
              <div className="text-2xl font-bold">{stats.totalGames}</div>
            </div>
            <div className="bg-white rounded shadow p-4 text-center">
              <div className="text-lg font-semibold">Recent Signups</div>
              <ul className="text-sm mt-2">
                {stats.recentUsers.map(u => <li key={u._id}>{u.username} ({new Date(u.createdAt).toLocaleDateString()})</li>)}
              </ul>
            </div>
            <div className="bg-white rounded shadow p-4 text-center">
              <div className="text-lg font-semibold">Most Active Users</div>
              <ul className="text-sm mt-2">
                {stats.mostActive.map(u => <li key={u._id}>{u.username} ({u.stats?.gamesPlayed || 0} games)</li>)}
              </ul>
            </div>
          </div>
        )}
        {/* Users table */}
        <div className="bg-white rounded shadow p-4 mb-8 overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">All Users</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3">Username</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Verified</th>
                <th className="py-2 px-3">Games Played</th>
                <th className="py-2 px-3">Wins</th>
                <th className="py-2 px-3">Joined</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium">{u.username}</td>
                  <td className="py-2 px-3">{u.email}</td>
                  <td className="py-2 px-3">{u.isVerified ? '✅' : '❌'}</td>
                  <td className="py-2 px-3">{u.stats?.gamesPlayed || 0}</td>
                  <td className="py-2 px-3">{u.stats?.gamesWon || 0}</td>
                  <td className="py-2 px-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 px-3 space-x-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={() => fetchUserGames(u._id)}>Games</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Games for selected user */}
        {selectedUser && (
          <div className="bg-white rounded shadow p-4 mb-8">
            <h2 className="text-xl font-bold mb-4">Games for User: {users.find(u => u._id === selectedUser)?.username}</h2>
            <button className="mb-4 text-blue-600 underline" onClick={() => { setSelectedUser(null); setUserGames([]); }}>Back to Users</button>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3">Game Type</th>
                  <th className="py-2 px-3">Result</th>
                  <th className="py-2 px-3">Opponent</th>
                  <th className="py-2 px-3">Score</th>
                  <th className="py-2 px-3">Duration (s)</th>
                  <th className="py-2 px-3">Completed At</th>
                  <th className="py-2 px-3">Achievements</th>
                </tr>
              </thead>
              <tbody>
                {userGames.map(g => (
                  <tr key={g._id} className="border-b">
                    <td className="py-2 px-3">{g.gameType}</td>
                    <td className="py-2 px-3">{g.result}</td>
                    <td className="py-2 px-3">{g.opponent}</td>
                    <td className="py-2 px-3">{g.score?.userLines || 0} - {g.score?.opponentLines || 0}</td>
                    <td className="py-2 px-3">{g.duration}</td>
                    <td className="py-2 px-3">{new Date(g.completedAt).toLocaleString()}</td>
                    <td className="py-2 px-3">{g.achievements?.join(', ') || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Reviews */}
        <div className="bg-white rounded shadow p-4 mb-8 overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">User Reviews & Ratings</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3">User</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Rating</th>
                <th className="py-2 px-3">Comment</th>
                <th className="py-2 px-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r._id} className="border-b">
                  <td className="py-2 px-3">{r.user?.username || '-'}</td>
                  <td className="py-2 px-3">{r.user?.email || '-'}</td>
                  <td className="py-2 px-3">{r.rating} / 5</td>
                  <td className="py-2 px-3">{r.comment || '-'}</td>
                  <td className="py-2 px-3">{new Date(r.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Leaderboard */}
        <div className="bg-white rounded shadow p-4 mb-8">
          <h2 className="text-xl font-bold mb-4">Leaderboard (Top 20)</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3">Username</th>
                <th className="py-2 px-3">Total Wins</th>
                <th className="py-2 px-3">Total Games</th>
                <th className="py-2 px-3">Average Score</th>
                <th className="py-2 px-3">Best Score</th>
                <th className="py-2 px-3">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((l, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2 px-3 font-medium">{l.username}</td>
                  <td className="py-2 px-3">{l.totalWins}</td>
                  <td className="py-2 px-3">{l.totalGames}</td>
                  <td className="py-2 px-3">{l.averageScore?.toFixed(2)}</td>
                  <td className="py-2 px-3">{l.bestScore}</td>
                  <td className="py-2 px-3">{l.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminStatistics;
