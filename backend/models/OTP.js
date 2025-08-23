import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  otp: {
    type: String,
    required: true,
    length: 6
  },
  purpose: {
    type: String,
    enum: ['verification', 'password_reset'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function() {
      // OTP expires in 10 minutes
      return new Date(Date.now() + 10 * 60 * 1000);
    }
  },
  isUsed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
otpSchema.index({ email: 1, purpose: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Static method to generate OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Static method to create OTP
otpSchema.statics.createOTP = async function(email, purpose) {
  // Delete any existing OTPs for this email and purpose
  await this.deleteMany({ email, purpose });
  
  // Generate new OTP
  const otp = this.generateOTP();
  
  // Create and save OTP
  const otpDoc = new this({
    email,
    otp,
    purpose
  });
  
  await otpDoc.save();
  return otp;
};

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function(email, otp, purpose) {
  const otpDoc = await this.findOne({
    email,
    otp,
    purpose,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  });
  
  if (!otpDoc) {
    return false;
  }
  
  // Mark OTP as used
  otpDoc.isUsed = true;
  await otpDoc.save();
  
  return true;
};

// Static method to clean expired OTPs
otpSchema.statics.cleanExpired = async function() {
  return await this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
};

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
