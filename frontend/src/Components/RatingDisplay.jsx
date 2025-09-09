import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
import { useTheme } from '../App';

function RatingDisplay() {
  const { isDarkMode } = useTheme();
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchAvg = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiService.getAverageRating();
        if (!mounted) return;
        setAverage(data.average || 0);
        setCount(data.count || 0);
      } catch (e) {
        if (mounted) setError('Failed to load ratings');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAvg();
    return () => { mounted = false; };
  }, []);

  const fullStars = Math.floor(average);
  const halfStar = average - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      {loading ? (
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading ratings...</span>
      ) : error ? (
        <span className="text-sm text-red-500">{error}</span>
      ) : (
        <>
          <div className="flex items-center">
            {Array.from({ length: fullStars }).map((_, i) => (
              <span key={`full-${i}`} className="text-yellow-400 text-xl">★</span>
            ))}
            {halfStar && <span className="text-yellow-400 text-xl">☆</span>}
            {Array.from({ length: emptyStars }).map((_, i) => (
              <span key={`empty-${i}`} className="text-gray-300 text-xl">★</span>
            ))}
          </div>
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{average.toFixed(2)} / 5 ({count})</span>
        </>
      )}
    </div>
  );
}

export default RatingDisplay;


