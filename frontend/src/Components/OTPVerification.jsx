import React, { useState, useEffect } from 'react';
import { useTheme } from '../App';
import apiService from '../services/api';

function OTPVerification({ 
  email, 
  username, 
  purpose = 'verification', 
  onSuccess, 
  onCancel,
  onResend,
  password // Add password prop for signup verification
}) {
  const { isDarkMode } = useTheme();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState(''); // Renamed to avoid conflict
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameInput, setUsernameInput] = useState(username || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Auto-focus next input when typing
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[data-index="${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      setLoading(true);
      setError('');
      
      await apiService.sendOTP(email, purpose);
      
      setSuccess('OTP resent successfully!');
      setCountdown(60); // Start countdown
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerify = async () => {
    try {
      setLoading(true);
      setError('');
      
      const otpString = otp.join('');
      
      if (otpString.length !== 6) {
        setError('Please enter the complete 6-digit OTP');
        return;
      }

      if (purpose === 'verification') {
        // For signup verification, we don't need password fields
        // The password was already provided in the signup form
        if (!usernameInput) {
          setError('Please enter a username');
          return;
        }

        // Verify OTP and create account (password will be sent from SignupPage)
        const response = await apiService.verifyOTP(email, otpString, usernameInput, password);
        
        if (response.success) {
          setSuccess('Account created successfully!');
          setTimeout(() => {
            onSuccess(response.data);
          }, 1500);
        }
      } else if (purpose === 'password_reset') {
        if (!newPassword || !confirmPassword) {
          setError('Please fill in all fields');
          return;
        }

        if (newPassword !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        if (newPassword.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }

        // Reset password
        const response = await apiService.resetPassword(email, otpString, newPassword);
        
        if (response.success) {
          setSuccess('Password reset successfully!');
          setTimeout(() => {
            onSuccess(response.data);
          }, 1500);
        }
      }
    } catch (error) {
      setError(error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Countdown effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Start initial countdown
  useEffect(() => {
    setCountdown(60);
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
      isDarkMode ? 'bg-black/50' : 'bg-black/30'
    }`}>
      <div className={`relative max-w-md w-full rounded-2xl shadow-2xl transform transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800 border border-gray-600' 
          : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b ${
          isDarkMode ? 'border-gray-600' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {purpose === 'verification' ? 'Verify Email' : 'Reset Password'}
            </h2>
            <button
              onClick={onCancel}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              ✕
            </button>
          </div>
          <p className={`mt-2 text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {purpose === 'verification' 
              ? 'Enter the 6-digit code sent to your email'
              : 'Enter the 6-digit code to reset your password'
            }
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Email Display */}
          <div className={`mb-6 p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <p className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Code sent to: <span className="font-semibold">{email}</span>
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-3 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              6-Digit OTP
            </label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  data-index={index}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  maxLength={1}
                  className={`w-12 h-12 text-center text-xl font-bold rounded-lg border-2 transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                  placeholder="0"
                />
              ))}
            </div>
          </div>

          {/* Username Field (for verification only) */}
          {purpose === 'verification' && (
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Username
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                }`}
                placeholder="Choose a username"
              />
            </div>
          )}

          {/* Password Fields (for password reset only) */}
          {purpose === 'password_reset' && (
            <>
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                  placeholder="Confirm new password"
                />
              </div>
            </>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleVerify}
              disabled={loading || otp.join('').length !== 6}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25'
              }`}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </div>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            <button
              onClick={handleResend}
              disabled={loading || countdown > 0}
              className={`text-sm transition-colors ${
                countdown > 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : isDarkMode
                    ? 'text-cyan-400 hover:text-cyan-300'
                    : 'text-blue-600 hover:text-blue-500'
              }`}
            >
              {countdown > 0 
                ? `Resend in ${countdown}s` 
                : 'Resend OTP'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OTPVerification;
