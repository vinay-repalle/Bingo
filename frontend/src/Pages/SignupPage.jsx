import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../App';
import { useAuth } from '../App';
import Navbar from '../Components/Navbar';
import OTPVerification from '../Components/OTPVerification';
import apiService from '../services/api';

function SignupPage() {
  const { isDarkMode } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpUsername, setOtpUsername] = useState('');

  // Check for Google OAuth errors
  useEffect(() => {
    const googleError = searchParams.get('error');
    if (googleError === 'google_auth_failed') {
      setError('Google sign-up failed. Please try again or use email/password.');
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleSignup = () => {
    setError(''); // Clear any previous errors
    window.location.href = apiService.getGoogleAuthUrl();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please provide all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Send OTP for verification
      const response = await apiService.sendOTP(formData.email, 'verification');
      
      if (response.success) {
        setOtpEmail(formData.email);
        setOtpUsername(formData.username);
        setShowOTP(true);
      }
    } catch (error) {
      setError(error.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = (data) => {
    // User account created and verified successfully
    login(data.user);
    navigate('/dashboard');
  };

  const handleOTPCancel = () => {
    setShowOTP(false);
    setOtpEmail('');
    setOtpUsername('');
  };

  if (showOTP) {
    return (
      <OTPVerification
        email={otpEmail}
        username={otpUsername}
        purpose="verification"
        onSuccess={handleOTPSuccess}
        onCancel={handleOTPCancel}
        password={formData.password} // Pass the password from signup form
      />
    );
  }

  return (
    <>
      <Navbar />
      <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className={`max-w-md w-full space-y-8 rounded-2xl p-8 border-2 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
            : 'bg-white/50 border-gray-200 backdrop-blur-sm'
        }`}>
          <div className="text-center">
            <h2 className={`text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
                Join the Adventure! 🚀            
            </h2>
            <p className={`mt-2 text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Create your account and start playing BingoV
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className={`p-3 rounded-lg text-sm ${
                isDarkMode 
                  ? 'bg-red-900/50 border border-red-500 text-red-300' 
                  : 'bg-red-100 border border-red-300 text-red-700'
              }`}>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className={`block text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className={`block text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className={`block text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25'
                }`}
              >
                {loading ? 'Sending Code...' : '📝 Create Account'}
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-300'
                  }`} />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${
                    isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-500'
                  }`}>
                    Or continue with
                  </span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleGoogleSignup}
                className={`w-full flex justify-center items-center py-3 px-4 border rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode 
                    ? 'border-gray-600 text-white hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="text-center">
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Already have an account?{' '}
                <Link to="/login" className={`font-medium transition duration-300 ${
                  isDarkMode 
                    ? 'text-cyan-400 hover:text-cyan-300' 
                    : 'text-blue-600 hover:text-blue-500'
                }`}>
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignupPage; 