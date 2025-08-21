<template>
  <div class="login-page">
    <div class="login-container">
      <!-- App Logo Section -->
      <div class="app-logo-section">
        <div class="app-logo">
          <img src="../assets/thumbnail.png" alt="English Vocabulary App" class="logo-image" />
        </div>
      </div>

      <!-- Auth Form Section -->
      <div class="auth-section">
        <div class="page-header">
          <h1 class="page-title">Đăng nhập</h1>
        </div>

        <!-- Tab Navigation -->
        <div class="auth-tabs">
          <button class="tab-button active" @click="$router.push('/login')">Đăng nhập</button>
          <button class="tab-button" @click="$router.push('/register')">Đăng ký</button>
        </div>

        <!-- Auth Form -->
        <div class="auth-form">
          <!-- Welcome Message -->
          <p class="welcome-message">Hãy cùng chúng tôi thử thách từ vựng, kết nối bạn bè.</p>

          <!-- Username Field -->
          <div class="form-group">
            <label class="form-label">Tên đăng nhập</label>
            <div class="input-wrapper">
              <input
                v-model="loginForm.username"
                type="text"
                placeholder="Nhập tên đăng nhập của bạn"
                class="form-input"
                :class="{ error: errors.username }"
                @keyup.enter="handleLogin"
                :disabled="loading"
              />
            </div>
            <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label class="form-label">Mật khẩu</label>
            <div class="input-wrapper">
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Nhập mật khẩu"
                class="form-input"
                :class="{ error: errors.password }"
                @keyup.enter="handleLogin"
                :disabled="loading"
              />
              <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g v-if="!showPassword" clip-path="url(#clip0_13_410)">
                    <path
                      d="M8.86304 6.14936L11.4397 8.72604L11.452 8.59107C11.452 7.23728 10.3518 6.13708 8.99801 6.13708L8.86304 6.14936Z"
                      fill="black"
                    />
                    <path
                      d="M8.99795 4.50103C11.2556 4.50103 13.0879 6.33335 13.0879 8.59102C13.0879 9.11863 12.9816 9.6217 12.7976 10.0839L15.1902 12.4765C16.4254 11.4458 17.3988 10.1125 18 8.59102C16.5808 5.00003 13.092 2.45605 8.99798 2.45605C7.85278 2.45605 6.75669 2.66054 5.73828 3.02864L7.50515 4.79141C7.96727 4.61146 8.47034 4.50103 8.99795 4.50103Z"
                      fill="black"
                    />
                    <path
                      d="M0.817983 2.27207L2.68301 4.1371L3.05521 4.5093C1.70552 5.56452 0.638037 6.96739 0 8.59109C1.41515 12.1821 4.90798 14.7261 8.99797 14.7261C10.2659 14.7261 11.4765 14.4807 12.5849 14.0348L12.9326 14.3825L15.317 16.771L16.36 15.7322L1.86093 1.22913L0.817983 2.27207ZM5.34153 6.79151L6.60533 8.05531C6.56852 8.2312 6.54398 8.40704 6.54398 8.59109C6.54398 9.94488 7.64417 11.0451 8.99797 11.0451C9.18202 11.0451 9.3579 11.0205 9.52968 10.9837L10.7935 12.2475C10.2495 12.5175 9.64421 12.6811 8.99797 12.6811C6.7403 12.6811 4.90798 10.8488 4.90798 8.59109C4.90798 7.94488 5.07159 7.33955 5.34153 6.79151Z"
                      fill="black"
                    />
                  </g>
                  <g v-else>
                    <path
                      d="M9 2.25C13.5 2.25 17.25 6 17.25 9C17.25 12 13.5 15.75 9 15.75C4.5 15.75 0.75 12 0.75 9C0.75 6 4.5 2.25 9 2.25ZM9 4.5C7.5 4.5 6.375 5.625 6.375 7.125V10.875C6.375 12.375 7.5 13.5 9 13.5C10.5 13.5 11.625 12.375 11.625 10.875V7.125C11.625 5.625 10.5 4.5 9 4.5Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_13_410">
                      <rect width="18" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="form-options">
            <label class="checkbox-wrapper">
              <input v-model="loginForm.rememberMe" type="checkbox" class="checkbox-input" />
              <span class="checkbox-text">Nhớ tài khoản này</span>
            </label>
            <button
              type="button"
              class="forgot-password-link"
              @click="$router.push('/forgot-password')"
            >
              Quên mật khẩu
            </button>
          </div>

          <!-- Login Button -->
          <button type="submit" class="login-button" :disabled="loading" @click="handleLogin">
            <q-spinner v-if="loading" size="20px" color="white" />
            <span v-if="loading">Đang đăng nhập...</span>
            <span v-else>Đăng nhập</span>
          </button>


          <!-- Backend Status -->
          <div class="backend-status">
            <div
              class="status-indicator"
              :class="{ online: backendOnline, offline: !backendOnline }"
            >
              <q-icon
                :name="backendOnline ? 'cloud_done' : 'cloud_off'"
                :color="backendOnline ? 'green' : 'orange'"
                size="16px"
              />
              <span> Backend: {{ backendOnline ? 'Đã kết nối' : 'Chưa kết nối' }} </span>
              <q-btn
                v-if="!backendOnline"
                @click="checkBackendStatus"
                size="xs"
                flat
                no-caps
                color="primary"
              >
                Kiểm tra
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../utils/auth.js'
// import { apiService } from '../services/api.js' // Temporarily unused
import { createNotification } from '../utils/notifications.js'

// Simple notification fallback
const showSimpleNotification = (message, type = 'info') => {
  createNotification(message, type)
}

const router = useRouter()

// Form state
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false,
})

const showPassword = ref(false)
const loading = ref(false)
const backendOnline = ref(false)
const errors = reactive({
  username: '',
  password: '',
})

// Check if user is already logged in
onMounted(async () => {
  if (auth.isLoggedIn()) {
    router.push('/dashboard')
    return
  }

  // Check backend status
  await checkBackendStatus()
})

// Check backend connectivity
const checkBackendStatus = async () => {
  try {
    console.log('=== BACKEND STATUS CHECK ===')
    console.log('Current hostname:', window.location.hostname)

    // In cloud environment, backend won't be available at localhost
    // So we'll skip the check and default to demo mode
    const isCloudEnvironment =
      window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'

    console.log('Is cloud environment:', isCloudEnvironment)

    if (isCloudEnvironment) {
      backendOnline.value = false
      console.log('Cloud environment detected, using demo mode')
      return
    }

    // Only check localhost backend when running locally
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    const response = await fetch('http://localhost:3003/', {
      method: 'GET',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log('Backend response status:', response.status, response.statusText)

    if (response.ok) {
      backendOnline.value = true
      console.log('✅ Backend is ONLINE - will use real authentication')
      showSimpleNotification('Backend đã kết nối thành công! ✅', 'success')
    } else {
      backendOnline.value = false
      console.log('❌ Backend offline - response not ok')
    }
  } catch (error) {
    backendOnline.value = false
    console.log('❌ Backend not available, using demo mode. Error:', error.message)
  }
}

// Validation
const validateForm = () => {
  errors.username = ''
  errors.password = ''

  let isValid = true

  if (!loginForm.username.trim()) {
    errors.username = 'Vui lòng nhập tên đăng nhập'
    isValid = false
  }

  if (!loginForm.password.trim()) {
    errors.password = 'Vui lòng nhập mật khẩu'
    isValid = false
  } else if (loginForm.password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    isValid = false
  }

  return isValid
}

// Handle login
const handleLogin = async () => {
  console.log('=== LOGIN ATTEMPT ===')
  console.log('Form data:', { username: loginForm.username, password: '***' })
  console.log('Backend online status:', backendOnline.value)

  if (!validateForm()) {
    console.log('Form validation failed')
    return
  }

  loading.value = true

  try {
    let result

    if (backendOnline.value) {
      console.log('🔑 Attempting real API login...')
      // Try real API login
      result = await auth.login(loginForm.username, loginForm.password, loginForm.rememberMe)
      console.log('Login result:', result)
    } else {
      console.log('🎭 Using demo mode login...')
      // Demo mode login
      result = await simulateLogin()
    }

    if (result.success) {
      showSimpleNotification(`Chào mừng ${result.user.name}! 🎉`, 'success')

      // Small delay for better UX
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
    } else {
      showSimpleNotification(result.message || 'Đăng nhập thất bại', 'error')
      errors.password = result.message || 'Đăng nhập thất bại'
    }
  } catch (error) {
    console.error('Login error:', error)

    if (error.message.includes('fetch')) {
      showSimpleNotification('Không thể kết nối đến server. Đang sử dụng chế độ demo.', 'error')
      backendOnline.value = false

      // Try demo login as fallback
      const result = await simulateLogin()
      if (result.success) {
        showSimpleNotification('Đang sử dụng chế độ demo', 'info')
        setTimeout(() => router.push('/dashboard'), 500)
      }
    } else {
      showSimpleNotification(error.message || 'Đăng nhập thất bại', 'error')
    }
  } finally {
    loading.value = false
  }
}

// Simulate login for demo mode
const simulateLogin = async () => {
  // Check demo credentials
  const demoAccounts = {
    admin: { name: 'Admin', level: 10, xp: 2500, streak: 15 },
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const account = demoAccounts[loginForm.username.toLowerCase()]

  if (account && loginForm.password === 'password123') {
    // Simulate successful login
    const user = {
      id: Date.now(),
      username: loginForm.username,
      email: `${loginForm.username}@example.com`,
      name: account.name,
      avatar:
        'https://cdn.builder.io/o/assets%2Ff046890c17ca436cab38cffc651fb9cb%2Fd0e1a2af26da485f8609e3080da7d7b8?alt=media&token=aca82dee-2b72-4297-9d9d-7921d490a327&apiKey=f046890c17ca436cab38cffc651fb9cb',
      level: account.level,
      xp: account.xp,
      streak: account.streak,
    }

    const token = 'demo_token_' + Date.now()

    // Store token and user data
    if (loginForm.rememberMe) {
      localStorage.setItem('user_token', token)
      localStorage.setItem('user_data', JSON.stringify(user))
    } else {
      sessionStorage.setItem('user_session', token)
      sessionStorage.setItem('user_data', JSON.stringify(user))
    }

    return { success: true, user, token }
  } else {
    return {
      success: false,
      message: 'Tên đăng nhập hoặc mật khẩu không đúng',
    }
  }
}

</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #fffefc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  min-height: 700px;
  gap: 40px;
  align-items: center;
}

/* App Logo Section */
.app-logo-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-image {
  width: 100%;
  max-width: 680px;
  height: auto;
  border-radius: 29px;
  object-fit: cover;
}

/* Auth Section */
.auth-section {
  width: 100%;
  max-width: 454px;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 20px;
}

.page-title {
  color: #000;
  font-family: 'Poppins', sans-serif;
  font-size: 25px;
  font-weight: 400;
  margin: 0;
}

/* Tab Navigation */
.auth-tabs {
  display: flex;
  background: rgba(37, 99, 235, 0.6);
  border-radius: 33px;
  padding: 4px;
  margin-bottom: 30px;
  height: 59px;
  align-items: center;
}

.tab-button {
  flex: 1;
  height: 40px;
  border: none;
  border-radius: 20px;
  background: transparent;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button.active {
  background: #2563eb;
  font-weight: 500;
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.tab-button.active:hover {
  background: #2563eb;
}

/* Form Styles */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.welcome-message {
  color: #5b5b5b;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  margin: 0 0 20px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  color: #000;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 400;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  height: 54px;
  padding: 0 20px;
  border: 1px solid #2563eb;
  border-radius: 40px;
  background: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 300;
  color: #000;
  outline: none;
  transition: all 0.3s ease;
}

.form-input::placeholder {
  color: #acacac;
}

.form-input:focus {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input.error {
  border-color: #ef4444;
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.password-toggle {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-message {
  color: #ef4444;
  font-size: 12px;
  font-family: 'Poppins', sans-serif;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-input {
  width: 15px;
  height: 15px;
  border: 1px solid #000;
  background: #fff;
  cursor: pointer;
}

.checkbox-text {
  color: #000;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 300;
}

.forgot-password-link {
  color: #000;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 300;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}

.forgot-password-link:hover {
  color: #2563eb;
}

/* Login Button */
.login-button {
  width: 100%;
  height: 49px;
  background: #2563eb;
  border: none;
  border-radius: 36px;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-button:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}


/* Backend Status */
.backend-status {
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.status-indicator.online {
  color: #059669;
}

.status-indicator.offline {
  color: #d97706;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .login-container {
    flex-direction: column;
    gap: 20px;
  }

  .app-logo-section {
    max-width: 400px;
  }

  .auth-section {
    max-width: 100%;
  }

  .logo-image {
    display: none;
  }
}

@media (max-width: 768px) {
  .login-page {
    padding: 10px;
  }

  .login-container {
    min-height: auto;
  }

  .logo-image {
    max-width: 300px;
  }

  .auth-section {
    padding: 0 10px;
  }

  .welcome-message {
    font-size: 14px;
  }

  .form-label {
    font-size: 14px;
  }

  .form-input {
    height: 48px;
    font-size: 14px;
  }

  .auth-tabs {
    height: 50px;
  }

  .tab-button {
    font-size: 14px;
    height: 36px;
  }

  .demo-accounts {
    gap: 6px;
  }
}

@media (max-width: 480px) {
  .auth-tabs {
    flex-direction: column;
    height: auto;
    gap: 8px;
    padding: 8px;
  }

  .tab-button {
    width: 100%;
    height: 40px;
  }

  .form-options {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
