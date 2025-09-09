import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../App';
import Navbar from '../Components/Navbar';
import HeroSection from '../Components/HeroSection';
import AboutSection from '../Components/AboutSection';
import HowToPlaySection from '../Components/HowToPlaySection';
import Footer from '../Components/Footer';
import RatingDisplay from '../Components/RatingDisplay';
import ReviewForm from '../Components/ReviewForm';

function LandingPage() {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state;
    if (state && state.scrollTo === 'reviews') {
      const el = document.getElementById('reviews');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Clear state so refresh won't scroll again
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <HowToPlaySection />
      {/* Ratings & Reviews Section */}
      <section id="reviews" className={`w-full py-12 sm:py-16 bg-gradient-to-br ${
        isDarkMode ? 'from-gray-900 via-gray-900 to-black' : 'from-white via-indigo-50 to-blue-50'
      }`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left: Rating summary */}
            <div className={`rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col justify-center border ${
              isDarkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white border-indigo-100'
            }`}>
              <div className="mb-4">
                <span className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full ${
                  isDarkMode ? 'text-indigo-300 bg-gray-700' : 'text-indigo-700 bg-indigo-50'
                }`}>
                  ★ User Satisfaction
                </span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Players love BingoV
              </h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                We’re continuously improving the experience. Here’s what the community thinks right now:
              </p>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <RatingDisplay />
                </div>
                <div className="hidden sm:block w-px h-10 bg-gray-200 mx-6"></div>
                <div className="text-right hidden sm:block">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your voice matters</p>
                  <p className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Rate and help us improve</p>
                </div>
              </div>
            </div>
            {/* Right: Review form */}
            <div className={`rounded-2xl shadow-xl border p-6 sm:p-8 ${
              isDarkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white border-indigo-100'
            }`}>
              <ReviewForm />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default LandingPage;