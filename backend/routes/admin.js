import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import User from '../models/User.js';
import Game from '../models/Game.js';
import Review from '../models/Review.js';

const router = express.Router();

// Protect all routes with adminAuth
router.use(adminAuth);

// GET /api/admin/users - List all users with details
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password -emailVerificationOTP').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', message: error.message });
  }
});

// GET /api/admin/user/:id/games - Get all games played by a user
router.get('/user/:id/games', async (req, res) => {
  try {
    const { id } = req.params;
    const games = await Game.find({ userId: id }).sort({ completedAt: -1 });
    res.json({ success: true, games });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games', message: error.message });
  }
});

// GET /api/admin/leaderboard - Get leaderboard (top 20)
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Game.aggregate([
      { $match: { result: 'win' } },
      { $group: {
        _id: '$userId',
        totalWins: { $sum: 1 },
        totalGames: { $sum: 1 },
        averageScore: { $avg: '$score.userLines' },
        bestScore: { $max: '$score.userLines' },
        totalPoints: { $sum: '$score.userLines' }
      } },
      { $sort: { totalWins: -1, averageScore: -1 } },
      { $limit: 20 },
      { $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      } },
      { $unwind: '$user' },
      { $project: {
        username: '$user.username',
        avatar: '$user.avatar',
        totalWins: 1,
        totalGames: 1,
        averageScore: 1,
        bestScore: 1,
        totalPoints: 1
      } }
    ]);
    res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard', message: error.message });
  }
});

// DELETE /api/admin/user/:id - Delete a user and their games
router.delete('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Game.deleteMany({ userId: id });
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: 'User and their games deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', message: error.message });
  }
});

// GET /api/admin/stats - Get overall statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGames = await Game.countDocuments();
    const recentUsers = await User.find({}, '-password -emailVerificationOTP').sort({ createdAt: -1 }).limit(5);
    const mostActive = await User.find({}, '-password -emailVerificationOTP').sort({ 'stats.gamesPlayed': -1 }).limit(5);
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalGames,
        recentUsers,
        mostActive
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats', message: error.message });
  }
});

// GET /api/admin/reviews - List all reviews with user info
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({}).populate('user', 'username email avatar').sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews', message: error.message });
  }
});

export default router;
