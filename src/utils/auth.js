import { apiService } from '../services/api.js'

// Enhanced authentication utility with real API integration
export const auth = {
  // Real login with API
  login: async (username, password, rememberMe = false) => {
    try {
      const response = await apiService.login(username, password)

      if (response.success) {
        const { user, token } = response

        // Store token and user data
        if (rememberMe) {
          localStorage.setItem('user_token', token)
          localStorage.setItem('user_data', JSON.stringify(user))
        } else {
          sessionStorage.setItem('user_session', token)
          sessionStorage.setItem('user_data', JSON.stringify(user))
        }

        return { success: true, user, token }
      } else {
        return { success: false, message: response.message || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: error.message || 'Login failed' }
    }
  },

  // Real registration with API
  register: async (userData) => {
    try {
      const response = await apiService.register(userData)

      if (response.success) {
        const { user, token } = response

        // Auto-login after registration
        sessionStorage.setItem('user_session', token)
        sessionStorage.setItem('user_data', JSON.stringify(user))

        return { success: true, user, token }
      } else {
        return { success: false, message: response.message || 'Registration failed' }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, message: error.message || 'Registration failed' }
    }
  },

  // Real logout with API
  logout: async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.error('Logout API error:', error)
      // Continue with local logout even if API fails
    }

    // Clear local storage
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_data')
    sessionStorage.removeItem('user_session')
    sessionStorage.removeItem('user_data')

    return { success: true }
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!(localStorage.getItem('user_token') || sessionStorage.getItem('user_session'))
  },

  // Get current user data
  getCurrentUser: () => {
    const userData = localStorage.getItem('user_data') || sessionStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  },

  // Get current token
  getToken: () => {
    return localStorage.getItem('user_token') || sessionStorage.getItem('user_session')
  },

  // Real password reset with API
  forgotPassword: async (email) => {
    try {
      const response = await apiService.forgotPassword(email)
      return response
    } catch (error) {
      console.error('Password reset error:', error)
      return { success: false, message: error.message || 'Password reset failed' }
    }
  },

  // Refresh user data from API
  refreshUser: async () => {
    try {
      if (!auth.isLoggedIn()) {
        return { success: false, message: 'Not logged in' }
      }

      const response = await apiService.getUserProfile()

      if (response.success) {
        const { user } = response

        // Update stored user data
        if (localStorage.getItem('user_token')) {
          localStorage.setItem('user_data', JSON.stringify(user))
        } else {
          sessionStorage.setItem('user_data', JSON.stringify(user))
        }

        return { success: true, user }
      }

      return response
    } catch (error) {
      console.error('Refresh user error:', error)
      return { success: false, message: error.message || 'Failed to refresh user data' }
    }
  },

  // Auto-login for demo purposes (only in dashboard layout)
  autoLogin: () => {
    if (!auth.isLoggedIn()) {
      // For demo, create a mock session
      const demoUser = {
        id: 1,
        username: 'nguoidung',
        email: 'nguoidung@example.com',
        name: 'Người dùng',
        avatar:
          'https://cdn.builder.io/o/assets%2Ff046890c17ca436cab38cffc651fb9cb%2Fd0e1a2af26da485f8609e3080da7d7b8?alt=media&token=aca82dee-2b72-4297-9d9d-7921d490a327&apiKey=f046890c17ca436cab38cffc651fb9cb',
        level: 10,
        xp: 1000,
        streak: 15,
      }

      sessionStorage.setItem('user_session', 'demo_token_' + Date.now())
      sessionStorage.setItem('user_data', JSON.stringify(demoUser))
    }
  },

  // Update local user data
  updateLocalUser: (updatedUser) => {
    try {
      if (localStorage.getItem('user_token')) {
        localStorage.setItem('user_data', JSON.stringify(updatedUser))
      } else {
        sessionStorage.setItem('user_data', JSON.stringify(updatedUser))
      }
      return { success: true }
    } catch (error) {
      console.error('Update local user error:', error)
      return { success: false, message: 'Failed to update local user data' }
    }
  },
}

// Export individual functions for backward compatibility
export const login = auth.login
export const logout = auth.logout
export const isLoggedIn = auth.isLoggedIn
export const getCurrentUser = auth.getCurrentUser
export const getToken = auth.getToken
