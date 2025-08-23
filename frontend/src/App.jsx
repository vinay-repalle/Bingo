import { useState, createContext, useContext, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import LoginPage from './Pages/LoginPage'
import SignupPage from './Pages/SignupPage'
import Dashboard from './Pages/Dashboard'
import GamePage from './Pages/GamePage'
import GoogleCallback from './Components/GoogleCallback'
import LogoutConfirmation from './Components/LogoutConfirmation'
import './App.css'
import React from 'react'
import apiService from './services/api'

// Create theme context
export const ThemeContext = createContext();
export const AuthContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setShowLogoutConfirm(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  // Check for existing user on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await apiService.getCurrentUser();
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth check error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <AuthContext.Provider value={{ user, isAuthenticated, login, logout, handleLogoutClick }}>
        <Router>
          <div className={`min-h-screen transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-900 text-white' 
              : 'bg-gray-50 text-gray-900'
          }`}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
              } />
              <Route path="/signup" element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <SignupPage />
              } />
              <Route path="/dashboard" element={
                isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
              } />
              <Route path="/game" element={
                isAuthenticated ? <GamePage /> : <Navigate to="/login" />
              } />
              <Route path="/auth/google/callback" element={<GoogleCallback />} />
            </Routes>
            
            {/* Logout Confirmation Modal */}
            <LogoutConfirmation
              isOpen={showLogoutConfirm}
              onConfirm={logout}
              onCancel={handleLogoutCancel}
            />
          </div>
        </Router>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  )
}

export default App
