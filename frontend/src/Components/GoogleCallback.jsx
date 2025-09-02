import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../App';
import apiService from '../services/api';

function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        console.error('Google OAuth error:', error);
        navigate('/login?error=google_auth_failed');
        return;
      }

      if (token) {
        try {
          // Store the token
          localStorage.setItem('token', token);
          
          // Get user data
          const response = await apiService.getCurrentUser();
          
          // Update auth context
          login(response.data.user);
          
          // Navigate to dashboard and clean query params
          navigate('/dashboard', { replace: true });
        } catch (error) {
          console.error('Google callback error:', error);
          navigate('/login?error=google_auth_failed');
        }
      } else {
        // Check if we're already on the callback route with token in URL
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        
        if (urlToken) {
          try {
            // Store the token
            localStorage.setItem('token', urlToken);
            
            // Get user data
            const response = await apiService.getCurrentUser();
            
            // Update auth context
            login(response.data.user);
            
            // Navigate to dashboard and clean query params
            navigate('/dashboard', { replace: true });
          } catch (error) {
            console.error('Google callback error:', error);
            navigate('/login?error=google_auth_failed');
          }
        } else {
          navigate('/login');
        }
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Completing sign in...
        </h2>
        <p className="text-gray-500">
          Please wait while we complete your Google sign-in.
        </p>
      </div>
    </div>
  );
}

export default GoogleCallback; 