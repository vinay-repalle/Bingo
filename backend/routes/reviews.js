import express from 'express';
import Review from '../models/Review.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// POST /api/reviews - create or update a review by the authenticated user
router.post('/', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
    }

    const update = { rating, comment: comment?.trim() || undefined };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const review = await Review.findOneAndUpdate({ user: req.user._id }, update, options);
    return res.status(200).json({ message: 'Review saved', review });
  } catch (error) {
    console.error('Error saving review:', error);
    return res.status(500).json({ message: 'Failed to save review' });
  }
});

// GET /api/reviews/average - get average rating and total count
router.get('/average', async (req, res) => {
  try {
    const result = await Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const average = result[0]?.averageRating || 0;
    const count = result[0]?.totalReviews || 0;

    return res.status(200).json({ average: Number(average.toFixed(2)), count });
  } catch (error) {
    console.error('Error fetching average rating:', error);
    return res.status(500).json({ message: 'Failed to fetch average rating' });
  }
});

export default router;


