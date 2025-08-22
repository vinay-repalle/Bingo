import express from 'express';
import User from '../models/User.js';
import Game from '../models/Game.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: 'Something went wrong'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { username, avatar } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (avatar) updateData.avatar = avatar;

    // Check if username is already taken
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          error: 'Username already taken',
          message: 'This username is already in use'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: 'Something went wrong'
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Failed to get statistics',
      message: 'Something went wrong'
    });
  }
});

// @desc    Get user game history
// @route   GET /api/users/games
// @access  Private
router.get('/games', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { player: req.user._id };
    if (status) query.status = status;

    const games = await Game.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('player', 'username avatar');

    const total = await Game.countDocuments(query);

    res.json({
      success: true,
      data: {
        games,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({
      error: 'Failed to get game history',
      message: 'Something went wrong'
    });
  }
});

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
router.get('/leaderboard', optionalAuth, async (req, res) => {
  try {
    const { type = 'time', limit = 10 } = req.query;
    
    let leaderboard;
    
    switch (type) {
      case 'time':
        leaderboard = await Game.getLeaderboard(parseInt(limit));
        break;
      case 'wins':
        leaderboard = await User.aggregate([
          { $sort: { 'stats.gamesWon': -1 } },
          { $limit: parseInt(limit) },
          { $project: {
            username: 1,
            avatar: 1,
            'stats.gamesWon': 1,
            'stats.gamesPlayed': 1,
            'stats.winRate': 1
          }}
        ]);
        break;
      case 'score':
        leaderboard = await User.aggregate([
          { $sort: { 'stats.totalScore': -1 } },
          { $limit: parseInt(limit) },
          { $project: {
            username: 1,
            avatar: 1,
            'stats.totalScore': 1,
            'stats.gamesPlayed': 1
          }}
        ]);
        break;
      default:
        return res.status(400).json({
          error: 'Invalid leaderboard type',
          message: 'Type must be time, wins, or score'
        });
    }

    res.json({
      success: true,
      data: {
        leaderboard,
        type
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      error: 'Failed to get leaderboard',
      message: 'Something went wrong'
    });
  }
});

// @desc    Get user by ID (public profile)
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user',
      message: 'Something went wrong'
    });
  }
});

export default router; 