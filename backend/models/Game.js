import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameType: {
    type: String,
    enum: ['classic', 'speed', 'challenge'],
    default: 'classic'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },
  board: {
    type: [[Number]],
    required: true
  },
  calledNumbers: {
    type: [Number],
    default: []
  },
  markedNumbers: {
    type: [Number],
    default: []
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    default: null
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  won: {
    type: Boolean,
    default: false
  },
  moves: [{
    number: Number,
    timestamp: {
      type: Date,
      default: Date.now
    },
    action: {
      type: String,
      enum: ['call', 'mark', 'unmark'],
      required: true
    }
  }],
  patterns: {
    type: [String],
    default: []
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Index for better query performance
gameSchema.index({ player: 1, createdAt: -1 });
gameSchema.index({ status: 1 });
gameSchema.index({ gameType: 1 });

// Method to calculate duration
gameSchema.methods.calculateDuration = function() {
  if (this.endTime && this.startTime) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  }
  return this.duration;
};

// Method to end game
gameSchema.methods.endGame = function(won, finalScore = 0) {
  this.endTime = new Date();
  this.won = won;
  this.score = finalScore;
  this.status = 'completed';
  this.calculateDuration();
  return this.save();
};

// Method to add move
gameSchema.methods.addMove = function(number, action) {
  this.moves.push({
    number,
    action,
    timestamp: new Date()
  });
  return this.save();
};

// Method to get game progress
gameSchema.methods.getProgress = function() {
  const totalNumbers = this.board.flat().length;
  const markedCount = this.markedNumbers.length;
  return {
    marked: markedCount,
    total: totalNumbers,
    percentage: Math.round((markedCount / totalNumbers) * 100)
  };
};

// Static method to get leaderboard
gameSchema.statics.getLeaderboard = async function(limit = 10) {
  return await this.aggregate([
    { $match: { status: 'completed', won: true } },
    { $group: {
      _id: '$player',
      bestTime: { $min: '$duration' },
      totalWins: { $sum: 1 },
      averageScore: { $avg: '$score' }
    }},
    { $sort: { bestTime: 1 } },
    { $limit: limit },
    { $lookup: {
      from: 'users',
      localField: '_id',
      foreignField: '_id',
      as: 'player'
    }},
    { $unwind: '$player' },
    { $project: {
      username: '$player.username',
      avatar: '$player.avatar',
      bestTime: 1,
      totalWins: 1,
      averageScore: 1
    }}
  ]);
};

const Game = mongoose.model('Game', gameSchema);

export default Game; 