import express from 'express';
import { protect } from '../middleware/auth.js';
import Game from '../models/Game.js';
import Achievement from '../models/Achievement.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get user statistics
// @route   GET /api/statistics/user
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user stats
    const stats = await Game.getUserStats(userId);
    
    // Get recent games
    const recentGames = await Game.getRecentGames(userId, 5);
    
    // Get achievement stats
    const achievementStats = await Game.getAchievementStats(userId);
    
    // Get achievement details
    const achievementNames = achievementStats.map(a => a._id);
    const achievementDetails = await Achievement.getAchievementDetails(achievementNames);
    
    // Combine achievement stats with details
    const achievements = achievementStats.map(stat => {
      const detail = achievementDetails.find(d => d.name === stat._id);
      return {
        ...detail.toObject(),
        count: stat.count,
        lastEarned: stat.lastEarned
      };
    });
    
    // Calculate total achievement points
    const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);
    
    // In GET /user, include coins in response
    const user = await User.findById(userId);

    res.json({
      success: true,
      data: {
        stats,
        recentGames,
        achievements,
        totalPoints,
        level: Math.floor(totalPoints / 100) + 1,
        progressToNextLevel: totalPoints % 100,
        coins: user.coins || 0
      }
    });
  } catch (error) {
    console.error('Get user statistics error:', error);
    res.status(500).json({
      error: 'Failed to get statistics',
      message: 'Something went wrong while fetching statistics'
    });
  }
});

// @desc    Get user's all games with pagination
// @route   GET /api/statistics/games
// @access  Private
router.get('/games', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const gamesData = await Game.getAllGames(userId, page, limit);
    
    res.json({
      success: true,
      data: gamesData
    });
  } catch (error) {
    console.error('Get user games error:', error);
    res.status(500).json({
      error: 'Failed to get games',
      message: 'Something went wrong while fetching games'
    });
  }
});

// @desc    Get user achievements
// @route   GET /api/statistics/achievements
// @access  Private
router.get('/achievements', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all achievements
    const allAchievements = await Achievement.find().sort({ category: 1, rarity: 1 });
    
    // Get user's earned achievements
    const userAchievements = await Game.getAchievementStats(userId);
    const earnedNames = userAchievements.map(a => a._id);
    
    // Mark achievements as earned or not
    const achievements = allAchievements.map(achievement => {
      const userAchievement = userAchievements.find(ua => ua._id === achievement.name);
      return {
        ...achievement.toObject(),
        earned: !!userAchievement,
        count: userAchievement ? userAchievement.count : 0,
        lastEarned: userAchievement ? userAchievement.lastEarned : null
      };
    });
    
    // Group by category
    const groupedAchievements = achievements.reduce((acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = [];
      }
      acc[achievement.category].push(achievement);
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: {
        achievements: groupedAchievements,
        totalEarned: earnedNames.length,
        totalAvailable: allAchievements.length
      }
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      error: 'Failed to get achievements',
      message: 'Something went wrong while fetching achievements'
    });
  }
});

// @desc    Get leaderboard
// @route   GET /api/statistics/leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const leaderboard = await Game.aggregate([
      { $match: { result: 'win' } },
      {
        $group: {
          _id: '$userId',
          totalWins: { $sum: 1 },
          totalGames: { $sum: 1 },
          averageScore: { $avg: '$score.userLines' },
          bestScore: { $max: '$score.userLines' },
          totalPoints: { $sum: '$score.userLines' }
        }
      },
      { $sort: { totalWins: -1, averageScore: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          username: '$user.username',
          avatar: '$user.avatar',
          totalWins: 1,
          totalGames: 1,
          averageScore: { $round: ['$averageScore', 2] },
          bestScore: 1,
          totalPoints: 1,
          winRate: { $round: [{ $multiply: [{ $divide: ['$totalWins', '$totalGames'] }, 100] }, 1] }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      error: 'Failed to get leaderboard',
      message: 'Something went wrong while fetching leaderboard'
    });
  }
});

// @desc    Save game result
// @route   POST /api/statistics/game
// @access  Private
router.post('/game', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { result, opponent, score, duration, achievements = [] } = req.body;
    
    // Validate required fields
    if (!result || !score) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Result and score are required'
      });
    }
    
    // Create new game record
    const game = new Game({
      userId,
      result,
      opponent: opponent || 'computer',
      score,
      duration: duration || 0,
      achievements
    });
    
    await game.save();
    
    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $inc: {
        'stats.totalGames': 1,
        'stats.totalWins': result === 'win' ? 1 : 0,
        'stats.totalLosses': result === 'loss' ? 1 : 0
      }
    });
    
    // In POST /game, update coins only for computer games
    // Award coins for all computer games to encourage continued play
    if (opponent === 'computer' || !opponent) {
      // Award coins: 10 for win, 3 for loss, 5 for draw
      let coinsToAdd = 0;
      if (result === 'win') {
        coinsToAdd = 10;
      } else if (result === 'loss') {
        coinsToAdd = 3;
      } else if (result === 'draw') {
        coinsToAdd = 5;
      }
      
      if (coinsToAdd > 0) {
        await User.findByIdAndUpdate(userId, { $inc: { coins: coinsToAdd } });
      }
    }
    
    res.json({
      success: true,
      message: 'Game result saved successfully',
      data: { gameId: game._id }
    });
  } catch (error) {
    console.error('Save game result error:', error);
    res.status(500).json({
      error: 'Failed to save game result',
      message: 'Something went wrong while saving game result'
    });
  }
});

export default router;
