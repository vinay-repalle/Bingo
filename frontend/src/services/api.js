// Environment-aware API configuration
const getApiBaseUrl = () => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Check if we're in development (localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return '/api'; // Use relative path for development
  }
  
  // Production: use Render backend
  return 'https://bingov-backend.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Helper method to handle responses
  async handleResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    let parsed;
    try {
      if (contentType.includes('application/json')) {
        parsed = await response.json();
      } else {
        const text = await response.text();
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = { message: text };
        }
      }
    } catch (e) {
      // Fallback when body can't be read
      parsed = { message: response.statusText || 'Unexpected response' };
    }

    if (!response.ok) {
      const message = parsed?.message || response.statusText || `Request failed with status ${response.status}`;
      const err = new Error(message);
      err.status = response.status;
      err.data = parsed;
      throw err;
    }

    return parsed;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      credentials: 'include',
      ...options
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async sendOTP(email, purpose = 'verification') {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email, purpose })
    });
  }

  async verifyOTP(email, otp, username, password) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, username, password })
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  // Password reset
  async resetPassword(email, otp, newPassword) {
    try {
      const response = await fetch(`${this.baseURL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST'
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updatePreferences(preferences) {
    return this.request('/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  }

  // User methods
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Statistics API methods
  async getUserStats() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseURL}/statistics/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch statistics');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getUserGames(page = 1, limit = 10) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseURL}/statistics/games?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch games');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getUserAchievements() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseURL}/statistics/achievements`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch achievements');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getLeaderboard(limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}/statistics/leaderboard?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch leaderboard');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async saveGameResult(gameData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseURL}/statistics/game`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save game result');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Game methods
  async startGame(gameData = {}) {
    return this.request('/games/start', {
      method: 'POST',
      body: JSON.stringify(gameData)
    });
  }

  async getCurrentGame() {
    return this.request('/games/current');
  }

  async makeMove(gameId, moveData) {
    return this.request(`/games/${gameId}/move`, {
      method: 'POST',
      body: JSON.stringify(moveData)
    });
  }

  async endGame(gameId, endData = {}) {
    return this.request(`/games/${gameId}/end`, {
      method: 'POST',
      body: JSON.stringify(endData)
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Google OAuth
  getGoogleAuthUrl() {
    return `${this.baseURL}/auth/google`;
  }

  // Handle Google OAuth callback
  handleGoogleCallback(token) {
    if (token) {
      localStorage.setItem('token', token);
      return true;
    }
    return false;
  }

  // Reviews & Ratings
  async getAverageRating() {
    return this.request('/reviews/average');
  }

  async submitReview({ rating, comment }) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify({ rating, comment })
    });
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService; 