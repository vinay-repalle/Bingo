import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  gameType: {
    type: String,
    enum: ['bingo', 'practice', 'tournament'],
    default: 'bingo'
  },
  result: {
    type: String,
    enum: ['win', 'loss', 'draw'],
    required: true
  },
  opponent: {
    type: String,
    enum: ['computer', 'player'],
    default: 'computer'
  },
  score: {
    userLines: { type: Number, default: 0 },
    opponentLines: { type: Number, default: 0 },
    totalMoves: { type: Number, default: 0 }
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  achievements: [{
    type: String,
    enum: [
      'first_win',
      'winning_streak_3',
      'winning_streak_5',
      'winning_streak_10',
      'quick_win',
      'perfect_game',
      'comeback_king',
      'speed_demon',
      'strategist',
      'bingo_master'
    ]
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
gameSchema.index({ userId: 1, completedAt: -1 });
gameSchema.index({ userId: 1, result: 1 });
gameSchema.index({ userId: 1, gameType: 1 });

// Static method to get user statistics
gameSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalGames: { $sum: 1 },
        wins: { $sum: { $cond: [{ $eq: ['$result', 'win'] }, 1, 0] } },
        losses: { $sum: { $cond: [{ $eq: ['$result', 'loss'] }, 1, 0] } },
        draws: { $sum: { $cond: [{ $eq: ['$result', 'draw'] }, 1, 0] } },
        totalLines: { $sum: '$score.userLines' },
        totalMoves: { $sum: '$score.totalMoves' },
        totalDuration: { $sum: '$duration' },
        averageScore: { $avg: '$score.userLines' },
        averageMoves: { $avg: '$score.totalMoves' },
        averageDuration: { $avg: '$duration' }
      }
    }
  ]);

  if (stats.length === 0) {
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winRate: 0,
      totalLines: 0,
      totalMoves: 0,
      totalDuration: 0,
      averageScore: 0,
      averageMoves: 0,
      averageDuration: 0
    };
  }

  const stat = stats[0];
  return {
    totalGames: stat.totalGames,
    wins: stat.wins,
    losses: stat.losses,
    draws: stat.draws,
    winRate: Math.round((stat.wins / stat.totalGames) * 100),
    totalLines: stat.totalLines,
    totalMoves: stat.totalMoves,
    totalDuration: stat.totalDuration,
    averageScore: Math.round(stat.averageScore * 100) / 100,
    averageMoves: Math.round(stat.averageMoves * 100) / 100,
    averageDuration: Math.round(stat.averageDuration * 100) / 100
  };
};

// Static method to get recent games
gameSchema.statics.getRecentGames = async function(userId, limit = 5) {
  return await this.find({ userId })
    .sort({ completedAt: -1 })
    .limit(limit)
    .select('result opponent score duration completedAt achievements gameType');
};

// Static method to get all games with pagination
gameSchema.statics.getAllGames = async function(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  const [games, total] = await Promise.all([
    this.find({ userId })
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('result opponent score duration completedAt achievements gameType'),
    this.countDocuments({ userId })
  ]);

  return {
    games,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1
  };
};

// Static method to get achievement statistics
gameSchema.statics.getAchievementStats = async function(userId) {
  const achievements = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $unwind: '$achievements' },
    {
      $group: {
        _id: '$achievements',
        count: { $sum: 1 },
        lastEarned: { $max: '$completedAt' }
      }
    },
    { $sort: { lastEarned: -1 } }
  ]);

  return achievements;
};

const Game = mongoose.model('Game', gameSchema);

export default Game; 