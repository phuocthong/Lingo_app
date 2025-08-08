// API Base URL - adjust for your backend
const isCloudEnvironment =
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1'

const API_BASE = isCloudEnvironment
  ? 'https://your-backend-url.com/api' // Backend not available in cloud demo
  : 'http://localhost:3001/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE
  }

  // Mock response handler for demo mode
  async getMockResponse(endpoint, options = {}) {
    const { getMockLeaderboard, getMockQuestions, getMockTasks, mockSubmitAnswer } = await import(
      './mockData.js'
    )

    // Parse endpoint and return appropriate mock data
    if (endpoint.includes('/progress/leaderboard')) {
      const params = new URLSearchParams(endpoint.split('?')[1] || '')
      const period = params.get('period') || 'week'
      const limit = parseInt(params.get('limit') || '10')
      return getMockLeaderboard(period, limit)
    }

    if (endpoint.includes('/vocabulary/questions')) {
      const params = new URLSearchParams(endpoint.split('?')[1] || '')
      return getMockQuestions({
        count: params.get('count') || 1,
        difficulty: params.get('difficulty'),
        type: params.get('type'),
      })
    }

    if (endpoint === '/tasks') {
      return getMockTasks()
    }

    if (endpoint.includes('/vocabulary/questions/') && endpoint.includes('/answer')) {
      const questionId = endpoint.split('/')[3]
      const answerData = options.body ? JSON.parse(options.body) : {}
      return mockSubmitAnswer(questionId, answerData)
    }

    // Default success response for other endpoints
    return {
      success: true,
      message: 'Demo mode - feature not implemented',
      data: null,
    }
  }

  // Get authorization header
  getAuthHeader() {
    const token = localStorage.getItem('user_token') || sessionStorage.getItem('user_session')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers,
      },
      ...options,
    }

    try {
      // In cloud environment, return mock data for demo
      if (isCloudEnvironment) {
        console.log(`Demo mode: API call to ${endpoint}`)
        return await this.getMockResponse(endpoint, options)
      }

      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'API request failed')
      }

      return data
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      throw error
    }
  }

  // Authentication endpoints
  async login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' })
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/user/profile')
  }

  async updateProfile(profileData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }

  async changePassword(passwordData) {
    return this.request('/user/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    })
  }

  async getUserStats() {
    return this.request('/user/stats')
  }

  // Vocabulary endpoints
  async getVocabulary(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/vocabulary${query ? `?${query}` : ''}`)
  }

  async getQuestions(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/vocabulary/questions${query ? `?${query}` : ''}`)
  }

  async submitAnswer(questionId, answerData) {
    return this.request(`/vocabulary/questions/${questionId}/answer`, {
      method: 'POST',
      body: JSON.stringify(answerData),
    })
  }

  // Room endpoints
  async getRooms(status = 'waiting') {
    return this.request(`/rooms?status=${status}`)
  }

  async createRoom(roomData) {
    return this.request('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    })
  }

  async getRoom(roomId) {
    return this.request(`/rooms/${roomId}`)
  }

  async joinRoom(roomId) {
    return this.request(`/rooms/${roomId}/join`, { method: 'POST' })
  }

  async leaveRoom(roomId) {
    return this.request(`/rooms/${roomId}/leave`, { method: 'DELETE' })
  }

  // Task endpoints
  async getTasks() {
    return this.request('/tasks')
  }

  async claimTaskReward(taskId) {
    return this.request(`/tasks/${taskId}/claim`, { method: 'POST' })
  }

  async updateTaskProgress(taskId, increment = 1) {
    return this.request(`/tasks/${taskId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ increment }),
    })
  }

  // Friend endpoints
  async getFriends() {
    return this.request('/friends')
  }

  async getFriendRequests() {
    return this.request('/friends/requests')
  }

  async searchUsers(query) {
    return this.request('/friends/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    })
  }

  async addFriend(userId) {
    return this.request('/friends/add', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    })
  }

  async acceptFriend(friendshipId) {
    return this.request(`/friends/accept/${friendshipId}`, { method: 'POST' })
  }

  async removeFriend(friendshipId) {
    return this.request(`/friends/${friendshipId}`, { method: 'DELETE' })
  }

  // Reward endpoints
  async getRewards(category) {
    const query = category ? `?category=${category}` : ''
    return this.request(`/rewards${query}`)
  }

  async redeemReward(rewardId) {
    return this.request(`/rewards/${rewardId}/redeem`, { method: 'POST' })
  }

  async getTransactions(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/rewards/transactions${query ? `?${query}` : ''}`)
  }

  // Progress endpoints
  async getProgress(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/progress${query ? `?${query}` : ''}`)
  }

  async recordProgress(progressData) {
    return this.request('/progress/record', {
      method: 'POST',
      body: JSON.stringify(progressData),
    })
  }

  async getLeaderboard(period = 'week', limit = 10) {
    return this.request(`/progress/leaderboard?period=${period}&limit=${limit}`)
  }
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService
