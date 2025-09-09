import React, { useState } from 'react';
import apiService from '../services/api';
import { useAuth, useTheme } from '../App';

function ReviewForm() {
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setMessage('Please login to submit a review.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await apiService.submitReview({ rating: Number(rating), comment });
      setMessage('Thanks! Your review has been saved.');
      setComment('');
    } catch (e) {
      setMessage(e?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${
      isDarkMode ? 'bg-gray-900/40' : 'bg-white/60'
    } backdrop-blur rounded-lg p-4 shadow`}>
      <h3 className="text-lg font-semibold mb-3">Leave a Review</h3>
      {message && (
        <div className={`mb-2 text-sm ${message.includes('Thanks') ? 'text-green-500' : 'text-red-500'}`}>{message}</div>
      )}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Rating</label>
        <select className={`border rounded px-3 py-2 w-full ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`} value={rating} onChange={e => setRating(e.target.value)}>
          {[5,4,3,2,1].map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Comment (optional)</label>
        <textarea className={`border rounded px-3 py-2 w-full ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : ''}`} rows="3" value={comment} onChange={e => setComment(e.target.value)} placeholder="What did you like?" />
      </div>
      <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-60">
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

export default ReviewForm;


