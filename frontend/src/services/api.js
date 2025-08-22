const API_BASE_URL = '/api';

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
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
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

  async getUserStats() {
    return this.request('/users/stats');
  }

  async getUserGames(page = 1, limit = 10, status) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    if (status) params.append('status', status);
    
    return this.request(`/users/games?${params}`);
  }

  async getLeaderboard(type = 'time', limit = 10) {
    const params = new URLSearchParams({
      type,
      limit: limit.toString()
    });
    
    return this.request(`/users/leaderboard?${params}`);
  }

  async getUserById(userId) {
    return this.request(`/users/${userId}`);
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
}

// Create singleton instance
const apiService = new ApiService();

export default apiService; 