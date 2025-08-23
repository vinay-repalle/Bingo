import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: function() {
      return !this.isGoogleUser; // Password not required for Google users
    },
    minlength: [6, 'Password must be at least 6 characters long']
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
    index: true
  },
  avatar: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationOTP: {
    type: String,
    default: null
  },
  emailVerificationExpires: {
    type: Date,
    default: null
  },
  stats: {
    gamesPlayed: {
      type: Number,
      default: 0
    },
    gamesWon: {
      type: Number,
      default: 0
    },
    totalScore: {
      type: Number,
      default: 0
    },
    bestTime: {
      type: Number,
      default: null
    },
    averageTime: {
      type: Number,
      default: 0
    },
    winRate: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    soundEnabled: {
      type: Boolean,
      default: true
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to handle Google users better
userSchema.index({ email: 1, isGoogleUser: 1 });
userSchema.index({ username: 1, isGoogleUser: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.isGoogleUser) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.isGoogleUser) {
    return false; // Google users don't have passwords
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update stats
userSchema.methods.updateStats = function(gameResult) {
  this.stats.gamesPlayed += 1;
  
  if (gameResult.won) {
    this.stats.gamesWon += 1;
  }
  
  this.stats.totalScore += gameResult.score || 0;
  
  if (gameResult.time) {
    if (!this.stats.bestTime || gameResult.time < this.stats.bestTime) {
      this.stats.bestTime = gameResult.time;
    }
    
    // Update average time
    const totalGames = this.stats.gamesPlayed;
    const currentTotal = this.stats.averageTime * (totalGames - 1);
    this.stats.averageTime = (currentTotal + gameResult.time) / totalGames;
  }
  
  // Update win rate
  this.stats.winRate = (this.stats.gamesWon / this.stats.gamesPlayed) * 100;
  
  this.lastActive = new Date();
  return this.save();
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    avatar: this.avatar,
    isVerified: this.isVerified,
    stats: this.stats,
    preferences: this.preferences,
    createdAt: this.createdAt
  };
};

// Static method to find or create Google user
userSchema.statics.findOrCreateGoogleUser = async function(googleProfile) {
  try {
    // First try to find by googleId
    let user = await this.findOne({ googleId: googleProfile.id });
    if (user) {
      // Update last active
      user.lastActive = new Date();
      await user.save();
      return user;
    }

    // Then try to find by email (for users who might have signed up with email first)
    user = await this.findOne({ email: googleProfile.emails[0].value });
    if (user) {
      // Link existing user to Google account
      user.googleId = googleProfile.id;
      user.isGoogleUser = true;
      user.avatar = googleProfile.photos[0].value;
      user.lastActive = new Date();
      await user.save();
      return user;
    }

    // Create new user with unique username
    let username = googleProfile.displayName;
    let counter = 1;
    
    // Ensure username is unique
    while (await this.findOne({ username })) {
      username = `${googleProfile.displayName}${counter}`;
      counter++;
    }

    user = new this({
      googleId: googleProfile.id,
      username: username,
      email: googleProfile.emails[0].value,
      avatar: googleProfile.photos[0].value,
      isGoogleUser: true,
      isVerified: true // Google users are automatically verified
    });

    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

// Virtual for win rate
userSchema.virtual('winRatePercentage').get(function() {
  if (this.stats.gamesPlayed === 0) return 0;
  return ((this.stats.gamesWon / this.stats.gamesPlayed) * 100).toFixed(1);
});

const User = mongoose.model('User', userSchema);

export default User; 