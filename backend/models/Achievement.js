import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['winning', 'speed', 'skill', 'special'],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  criteria: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  points: {
    type: Number,
    default: 10
  }
}, {
  timestamps: true
});

// Predefined achievements
achievementSchema.statics.initializeAchievements = async function() {
  const achievements = [
    {
      name: 'first_win',
      displayName: 'First Victory',
      description: 'Win your first game',
      category: 'winning',
      icon: '🏆',
      criteria: 'Win 1 game',
      rarity: 'common',
      points: 10
    },
    {
      name: 'winning_streak_3',
      displayName: 'Hot Streak',
      description: 'Win 3 games in a row',
      category: 'winning',
      icon: '🔥',
      criteria: 'Win 3 consecutive games',
      rarity: 'rare',
      points: 25
    },
    {
      name: 'winning_streak_5',
      displayName: 'Unstoppable',
      description: 'Win 5 games in a row',
      category: 'winning',
      icon: '⚡',
      criteria: 'Win 5 consecutive games',
      rarity: 'epic',
      points: 50
    },
    {
      name: 'winning_streak_10',
      displayName: 'Legendary',
      description: 'Win 10 games in a row',
      category: 'winning',
      icon: '👑',
      criteria: 'Win 10 consecutive games',
      rarity: 'legendary',
      points: 100
    },
    {
      name: 'quick_win',
      displayName: 'Speed Demon',
      description: 'Win a game in under 2 minutes',
      category: 'speed',
      icon: '🚀',
      criteria: 'Win in under 120 seconds',
      rarity: 'rare',
      points: 30
    },
    {
      name: 'perfect_game',
      displayName: 'Perfect Game',
      description: 'Win with 5 lines in minimum moves',
      category: 'skill',
      icon: '⭐',
      criteria: 'Win with 5 lines in 5 moves',
      rarity: 'epic',
      points: 75
    },
    {
      name: 'comeback_king',
      displayName: 'Comeback King',
      description: 'Win after opponent has 3+ lines',
      category: 'skill',
      icon: '🔄',
      criteria: 'Win when opponent has 3+ lines',
      rarity: 'epic',
      points: 60
    },
    {
      name: 'strategist',
      displayName: 'Master Strategist',
      description: 'Win 50 games',
      category: 'winning',
      icon: '🧠',
      criteria: 'Win 50 total games',
      rarity: 'rare',
      points: 40
    },
    {
      name: 'bingo_master',
      displayName: 'Bingo Master',
      description: 'Win 100 games',
      category: 'winning',
      icon: '🎯',
      criteria: 'Win 100 total games',
      rarity: 'legendary',
      points: 150
    }
  ];

  for (const achievement of achievements) {
    await this.findOneAndUpdate(
      { name: achievement.name },
      achievement,
      { upsert: true, new: true }
    );
  }
};

// Get achievement details by name
achievementSchema.statics.getAchievementDetails = async function(achievementNames) {
  return await this.find({ name: { $in: achievementNames } });
};

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;
