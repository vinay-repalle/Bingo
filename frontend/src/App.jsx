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
import apiService from './services/api'
import MultiplayerGame from './Pages/MultiplayerGame';
import AdminStatistics from './Pages/AdminStatistics';
import AboutUs from './Pages/AboutUs';

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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light');
      } catch {}
      return next;
    });
  };

  // Keep <html> class in sync for any global dark styles
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    // Optimistic client-side logout and redirect
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowLogoutConfirm(false);
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
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
      setLoading(true);
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
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-6"></div>
          <div className="text-2xl font-bold text-indigo-700 mb-2">Bingo Game</div>
          <div className="text-lg font-medium text-gray-600">Checking authentication...</div>
        </div>
      </div>
    );
  }

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
              <Route path="/about" element={<AboutUs />} />
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
              <Route path="/multiplayer" element={
                isAuthenticated ? <MultiplayerGame /> : <Navigate to="/login" />
              } />
              <Route path="/auth/google/callback" element={<GoogleCallback />} />
              <Route path="/admin/statistics" element={
                isAuthenticated ? <AdminStatistics /> : <Navigate to="/login" />
              } />
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
