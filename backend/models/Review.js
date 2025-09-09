import mongoose from 'mongoose';

// Review schema for storing user ratings and optional comments
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Ensure a user can have at most one review (update on resubmission)
reviewSchema.index({ user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;


