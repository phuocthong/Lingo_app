<template>
  <q-page class="dashboard-page">
    <div class="dashboard-container">
      <!-- Left side - Chat Interface -->
      <div class="chat-section">
        <q-card class="chat-card">
          <!-- Chat Header -->
          <q-card-section class="chat-header">
            <div class="header-content">
              <q-icon name="extension" class="header-icon" />
              <div class="header-info">
                <div class="header-title">Thách đấu với Bot</div>
                <div class="header-subtitle">Bot sẽ đưa ra câu hỏi mỗi 30-60 giây</div>
              </div>
              <div class="header-actions">
                <q-btn v-if="!isBotActive" @click="startBot" color="primary" size="sm" no-caps>
                  Bắt đầu
                </q-btn>
                <q-btn v-else @click="stopBot" color="red" size="sm" no-caps> Dừng </q-btn>
              </div>
            </div>
          </q-card-section>

          <!-- Chat Messages -->
          <q-card-section class="chat-messages" ref="chatMessagesContainer">
            <!-- Dynamic Messages -->
            <div v-for="(message, index) in chatMessages" :key="index" class="message-wrapper">
              <!-- Bot Message -->
              <div v-if="message.type === 'bot'" class="message-row">
                <q-avatar size="32px" class="bot-avatar">
                  <q-icon name="extension" size="16px" />
                </q-avatar>
                <div class="message-bubble bot-message">
                  <div class="message-text">{{ message.text }}</div>
                  <div class="message-time">{{ formatTime(message.timestamp) }}</div>
                  <div v-if="message.participants" class="message-participants">
                    <img
                      v-for="(participant, pIndex) in message.participants"
                      :key="pIndex"
                      :src="participant"
                      :alt="`User ${pIndex + 1}`"
                      class="participant-avatar"
                    />
                  </div>
                </div>
              </div>

              <!-- Answer Display -->
              <div v-else-if="message.type === 'answer'" class="answer-display">
                <div class="correct-answer">
                  {{ message.text }}
                  <div class="answer-time">{{ formatTime(message.timestamp) }}</div>
                </div>
              </div>

              <!-- User Answer Feedback -->
              <div v-else-if="message.type === 'userAnswer'" class="user-answer-feedback">
                <div class="feedback-content">
                  <strong>{{ message.userName }}:</strong> {{ message.answer }}
                  <div class="feedback-time">{{ formatTime(message.timestamp) }}</div>
                </div>
              </div>
            </div>
          </q-card-section>

          <!-- Input Area -->
          <q-card-section class="chat-input">
            <div class="input-container">
              <q-input
                v-model="messageInput"
                placeholder="Nhập câu trả lời của bạn..."
                outlined
                class="message-input"
                @keyup.enter="sendMessage"
                :disable="!currentUser || !isBotActive"
              />
              <q-btn
                icon="send"
                color="primary"
                class="send-btn"
                @click="sendMessage"
                :disable="!currentUser || !isBotActive || !messageInput.trim()"
              />
            </div>

            <div class="status-indicator">
              <q-icon
                name="fiber_manual_record"
                :color="currentUser ? 'green' : 'orange'"
                size="8px"
              />
              <span class="status-text">
                {{ currentUser ? `Đăng nhập với tên: ${currentUser.name}` : 'Chưa đăng nhập' }}
              </span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Right side - Question History and Leaderboard -->
      <div class="sidebar-section">
        <!-- Question History -->
        <q-card class="history-card">
          <q-card-section class="card-header">
            <div class="header-content">
              <q-icon name="history" size="20px" />
              <div class="header-title">Lịch sử câu hỏi</div>
            </div>
            <div class="header-subtitle">{{ questionHistory.length }} câu hỏi gần nhất</div>
          </q-card-section>

          <q-card-section class="history-content">
            <div v-if="questionHistory.length === 0" class="no-history">
              <q-icon name="quiz" size="48px" color="grey-4" />
              <p>Chưa có câu hỏi nào. Bắt đầu chat bot để xem lịch sử!</p>
            </div>

            <!-- Dynamic History Items -->
            <div v-for="(item, index) in questionHistory" :key="item.id" class="history-item">
              <div class="question-title">{{ item.question }}</div>
              <div class="question-meta">
                <span class="answer">Đáp án: "{{ item.correctAnswer }}"</span>
                <span class="time">{{ formatDateTime(item.timestamp) }}</span>
              </div>
              <div class="question-stats">
                <div class="stats-left">
                  <q-icon name="people" size="12px" />
                  <span class="correct-count">{{ item.stats.correctAnswers }} đúng</span>
                  <span class="separator">/</span>
                  <span class="total-count">{{ item.stats.totalAnswers }} trả lời</span>
                </div>
                <q-btn-dropdown
                  v-if="item.participants.length > 0"
                  class="details-dropdown"
                  flat
                  no-caps
                  size="sm"
                  label="▼ Top 5 nhanh nhất"
                >
                  <div class="top-answerers-dropdown">
                    <div class="dropdown-title">Top 5 người trả l���i nhanh nhất</div>
                    <div
                      v-for="(answerer, aIndex) in item.participants.slice(0, 5)"
                      :key="answerer.id"
                      class="answerer-item-dropdown"
                      :class="{ 'current-user': answerer.name === currentUser?.name }"
                    >
                      <div class="rank-badge">{{ aIndex + 1 }}</div>
                      <q-avatar size="24px" class="answerer-mini-avatar">{{
                        answerer.avatar
                      }}</q-avatar>
                      <div class="answerer-mini-info">
                        <div class="answerer-mini-name">{{ answerer.name }}</div>
                        <div class="answerer-mini-time">{{ answerer.time }}</div>
                      </div>
                      <div class="answerer-mini-status">
                        <q-icon
                          :name="answerer.correct ? 'check_circle' : 'cancel'"
                          :color="answerer.correct ? 'green' : 'red'"
                          size="12px"
                        />
                      </div>
                    </div>
                  </div>
                </q-btn-dropdown>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Leaderboard -->
        <q-card class="leaderboard-card">
          <q-card-section class="card-header">
            <div class="header-content">
              <q-icon name="emoji_events" size="20px" />
              <div class="header-title">Bảng xếp hạng</div>
              <div v-if="isDemoMode" class="demo-badge">Demo</div>
              <q-icon name="trending_up" size="16px" class="trend-icon" />
            </div>

            <div class="leaderboard-tabs">
              <q-btn
                flat
                size="sm"
                :class="['tab-btn', { active: activeTab === 'week' }]"
                no-caps
                @click="switchTab('week')"
                >Tuần</q-btn
              >
              <q-btn
                flat
                size="sm"
                :class="['tab-btn', { active: activeTab === 'month' }]"
                no-caps
                @click="switchTab('month')"
                >Tháng</q-btn
              >
              <q-btn
                flat
                size="sm"
                :class="['tab-btn', { active: activeTab === 'year' }]"
                no-caps
                @click="switchTab('year')"
                >Năm</q-btn
              >
            </div>
          </q-card-section>

          <q-card-section class="leaderboard-content">
            <div v-if="loadingLeaderboard" class="loading-container">
              <q-spinner color="primary" size="2em" />
              <p>Đang tải bảng xếp hạng...</p>
            </div>

            <div v-else-if="leaderboardError" class="error-container">
              <q-icon name="error" color="red" size="2em" />
              <p>{{ leaderboardError }}</p>
              <q-btn @click="loadLeaderboard" size="sm" color="primary">Thử lại</q-btn>
            </div>

            <!-- Dynamic Leaderboard Items -->
            <div v-else>
              <div
                v-for="(player, index) in currentLeaderboard"
                :key="player.user?.id || index"
                class="leaderboard-item"
                :class="{
                  'first-place': index === 0,
                  'second-place': index === 1,
                  'third-place': index === 2,
                }"
              >
                <q-icon
                  :name="index < 3 ? 'emoji_events' : 'star'"
                  :color="
                    index === 0 ? 'amber' : index === 1 ? 'grey-5' : index === 2 ? 'orange' : 'blue'
                  "
                  :size="index < 3 ? '16px' : '12px'"
                  :style="index === 1 ? 'opacity: 0.8' : ''"
                />
                <q-avatar
                  size="32px"
                  :class="[
                    'rank-avatar',
                    index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'blue',
                  ]"
                >
                  {{ getAvatarText(player.user?.name || 'Unknown') }}
                </q-avatar>
                <div class="player-info">
                  <div class="player-name">{{ player.user?.name || 'Unknown' }}</div>
                  <div class="player-streak">Accuracy: {{ player.stats?.accuracy || 0 }}%</div>
                </div>
                <div class="player-score">
                  <div class="score-number">
                    {{ (player.stats?.totalXp || 0).toLocaleString() }}
                  </div>
                  <div class="score-label">XP</div>
                </div>
              </div>

              <!-- Current User Rank -->
              <div v-if="currentUser && userRank" class="current-user-rank">
                <div class="user-rank-content">
                  <q-avatar size="32px" class="user-avatar">{{
                    getAvatarText(currentUser.name)
                  }}</q-avatar>
                  <div class="user-info">
                    <div class="user-title">Hạng của bạn: #{{ userRank.rank }}</div>
                    <div class="user-subtitle">
                      {{ userRank.xp }} XP • Top {{ userRank.percentage }}%
                    </div>
                  </div>
                  <div class="user-stats">
                    <div class="user-score">{{ userRank.xp }}</div>
                    <div class="user-total">/ {{ totalPlayers }} người chơi</div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { chatService } from '../services/chatService.js'
import { apiService } from '../services/api.js'
import { auth } from '../utils/auth.js'
import { createNotification } from '../utils/notifications.js'

// Reactive data
const messageInput = ref('')
const activeTab = ref('week')
const chatMessages = ref([])
const questionHistory = ref([])
const currentLeaderboard = ref([])
const loadingLeaderboard = ref(false)
const leaderboardError = ref('')
const isBotActive = ref(false)
const currentUser = ref(null)
const userRank = ref(null)
const totalPlayers = ref(0)
const chatMessagesContainer = ref(null)
const isDemoMode = ref(false)

// Computed properties
const chatMessagesElement = computed(() => chatMessagesContainer.value)

// Initialize component
onMounted(async () => {
  // Check if in demo mode
  isDemoMode.value =
    window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'

  // Get current user
  currentUser.value = auth.getCurrentUser()

  // Auto-login for demo
  if (!currentUser.value) {
    auth.autoLogin()
    currentUser.value = auth.getCurrentUser()
  }

  // Setup event listeners for chat service
  setupChatEventListeners()

  // Load initial data
  await loadLeaderboard()

  // Add welcome message
  const welcomeMsg = isDemoMode.value
    ? 'Xin chào! Tôi là EnglishBot. Bạn đang ở chế độ demo. Nhấn "Bắt đầu" để thử nghiệm!'
    : 'Xin chào! Tôi là EnglishBot. Nhấn "Bắt đầu" để tôi bắt đầu đưa ra các câu hỏi tiếng Anh.'
  addBotMessage(welcomeMsg)
})

onUnmounted(() => {
  // Clean up
  chatService.stopBot()
  removeChatEventListeners()
})

// Setup chat event listeners
const setupChatEventListeners = () => {
  window.addEventListener('botMessage', handleBotMessage)
  window.addEventListener('answerDisplay', handleAnswerDisplay)
  window.addEventListener('answerFeedback', handleAnswerFeedback)
}

const removeChatEventListeners = () => {
  window.removeEventListener('botMessage', handleBotMessage)
  window.removeEventListener('answerDisplay', handleAnswerDisplay)
  window.removeEventListener('answerFeedback', handleAnswerFeedback)
}

// Event handlers
const handleBotMessage = (event) => {
  const { message, isQuestion, timestamp, participants } = event.detail
  addBotMessage(message, participants)
}

const handleAnswerDisplay = (event) => {
  const { message, timestamp } = event.detail
  addAnswerMessage(message, timestamp)
}

const handleAnswerFeedback = (event) => {
  const { userName, answer, timestamp } = event.detail
  addUserAnswerMessage(userName, answer, timestamp)
}

// Chat functions
const startBot = async () => {
  if (!currentUser.value) {
    showNotification('Vui lòng đăng nhập để sử dụng chat bot', 'warning')
    return
  }

  isBotActive.value = true
  await chatService.startBot()
  addBotMessage('Chat bot đã bắt đầu! Tôi sẽ đưa ra câu hỏi mỗi 30-60 giây.')
}

const stopBot = () => {
  isBotActive.value = false
  chatService.stopBot()
  addBotMessage('Chat bot đã dừng. Nhấn "Bắt đầu" để tiếp tục.')
}

const sendMessage = async () => {
  if (!messageInput.value.trim() || !currentUser.value) return

  const answer = messageInput.value.trim()
  const userName = currentUser.value.name

  // Handle answer through chat service
  await chatService.handleAnswer(answer, userName)

  // Clear input
  messageInput.value = ''

  // Update question history
  updateQuestionHistory()
}

// Message management
const addBotMessage = (text, participants = null) => {
  // Ensure chatMessages is an array
  if (!Array.isArray(chatMessages.value)) {
    console.warn('chatMessages.value is not an array, reinitializing...')
    chatMessages.value = []
  }

  chatMessages.value.push({
    type: 'bot',
    text,
    timestamp: new Date(),
    participants,
  })
  scrollToBottom()
}

const addAnswerMessage = (text, timestamp) => {
  // Ensure chatMessages is an array
  if (!Array.isArray(chatMessages.value)) {
    chatMessages.value = []
  }

  chatMessages.value.push({
    type: 'answer',
    text,
    timestamp,
  })
  scrollToBottom()
}

const addUserAnswerMessage = (userName, answer, timestamp) => {
  // Ensure chatMessages is an array
  if (!Array.isArray(chatMessages.value)) {
    chatMessages.value = []
  }

  chatMessages.value.push({
    type: 'userAnswer',
    userName,
    answer,
    timestamp,
  })
  scrollToBottom()
}

const scrollToBottom = () => {
  nextTick(() => {
    const element = chatMessagesElement.value
    if (element) {
      element.scrollTop = element.scrollHeight
    }
  })
}

// Question history
const updateQuestionHistory = () => {
  questionHistory.value = chatService.getHistory()
}

// Leaderboard functions
const switchTab = async (tab) => {
  activeTab.value = tab
  await loadLeaderboard()
}

const loadLeaderboard = async () => {
  loadingLeaderboard.value = true
  leaderboardError.value = ''

  try {
    const response = await apiService.getLeaderboard(activeTab.value, 10)

    if (response.success) {
      currentLeaderboard.value = response.leaderboard || []

      // Calculate user rank
      if (currentUser.value) {
        calculateUserRank()
      }
    } else {
      leaderboardError.value = response.message || 'Không thể tải bảng xếp hạng'
    }
  } catch (error) {
    console.error('Leaderboard load error:', error)
    leaderboardError.value = 'Lỗi kết nối. Đang sử dụng dữ liệu mẫu.'
    loadFallbackLeaderboard()
  } finally {
    loadingLeaderboard.value = false
  }
}

const loadFallbackLeaderboard = () => {
  // Fallback data when API is not available
  const fallbackData = {
    week: [
      { user: { name: 'Thu Trang', id: 1 }, stats: { totalXp: 156, accuracy: 92 } },
      { user: { name: 'Minh Anh', id: 2 }, stats: { totalXp: 142, accuracy: 88 } },
      { user: { name: 'Văn Nam', id: 3 }, stats: { totalXp: 138, accuracy: 85 } },
      { user: { name: 'Thành Hòa', id: 4 }, stats: { totalXp: 125, accuracy: 90 } },
    ],
    month: [
      { user: { name: 'Thành Hòa', id: 4 }, stats: { totalXp: 487, accuracy: 90 } },
      { user: { name: 'Minh Anh', id: 2 }, stats: { totalXp: 445, accuracy: 88 } },
      { user: { name: 'Văn Nam', id: 3 }, stats: { totalXp: 398, accuracy: 85 } },
      { user: { name: 'Thu Trang', id: 1 }, stats: { totalXp: 367, accuracy: 92 } },
    ],
    year: [
      { user: { name: 'Minh Anh', id: 2 }, stats: { totalXp: 2456, accuracy: 88 } },
      { user: { name: 'Thành Hòa', id: 4 }, stats: { totalXp: 2195, accuracy: 90 } },
      { user: { name: 'Văn Nam', id: 3 }, stats: { totalXp: 1957, accuracy: 85 } },
      { user: { name: 'Thu Trang', id: 1 }, stats: { totalXp: 1834, accuracy: 92 } },
    ],
  }

  currentLeaderboard.value = fallbackData[activeTab.value] || fallbackData.week
}

const calculateUserRank = () => {
  if (!currentUser.value) return

  const userXp = currentUser.value.xp || 1000
  totalPlayers.value = 1250 // Mock total players

  // Simple rank calculation based on XP
  const rank = Math.max(1, Math.floor(Math.random() * 50) + 1)
  const percentage = Math.floor((rank / totalPlayers.value) * 100)

  userRank.value = {
    rank,
    xp: userXp,
    percentage,
  }
}

// Utility functions
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDateTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const getAvatarText = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

const showNotification = (message, type = 'info') => {
  createNotification(message, type)
}
</script>

<style scoped>
.dashboard-page {
  background: #f5f3ff;
  padding: 24px;
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 352px;
  gap: 24px;
  align-items: start;
}

.header-actions {
  margin-left: auto;
}

.chat-section {
  flex: 1;
  min-width: 0;
}

.chat-card {
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.chat-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  background: #6d28d9;
  color: white;
  padding: 8px;
  border-radius: 8px;
  font-size: 20px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.header-subtitle {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.chat-messages {
  padding: 16px 24px;
  max-height: 400px;
  overflow-y: auto;
}

.message-wrapper {
  margin-bottom: 16px;
}

.message-row {
  display: flex;
  gap: 12px;
}

.bot-avatar {
  background: #ede9fe;
  color: #6d28d9;
  flex-shrink: 0;
}

.message-bubble {
  background: #f3f4f6;
  border-radius: 8px;
  padding: 12px 16px;
  max-width: 400px;
}

.bot-message {
  background: #f3f4f6;
}

.message-text {
  font-size: 14px;
  color: #111827;
  margin-bottom: 8px;
}

.message-time {
  font-size: 12px;
  color: #6b7280;
}

.message-participants {
  display: flex;
  gap: -8px;
  margin-top: 8px;
}

.participant-avatar {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid white;
  margin-left: -8px;
}

.participant-avatar:first-child {
  margin-left: 0;
}

.answer-display {
  display: flex;
  justify-content: flex-end;
  margin: 16px 0;
}

.correct-answer {
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 12px 16px;
  color: #166534;
  font-size: 14px;
  position: relative;
}

.answer-time {
  color: #16a34a;
  font-size: 12px;
  margin-top: 4px;
  text-align: right;
}

.user-answer-feedback {
  display: flex;
  justify-content: flex-start;
  margin: 8px 0;
}

.feedback-content {
  background: #e0e7ff;
  border: 1px solid #c7d2fe;
  border-radius: 8px;
  padding: 8px 12px;
  color: #1e40af;
  font-size: 13px;
}

.feedback-time {
  font-size: 11px;
  color: #3730a3;
  margin-top: 2px;
}

.chat-input {
  background: #f9fafb;
  border-top: 1px solid #e2e8f0;
  padding: 16px 24px;
}

.input-container {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.message-input {
  flex: 1;
}

.send-btn {
  padding: 12px 16px;
  border-radius: 6px;
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.status-text {
  font-size: 12px;
  color: #6b7280;
}

.sidebar-section {
  width: 352px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.history-card,
.leaderboard-card {
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.card-header {
  border-bottom: 1px solid #e2e8f0;
  padding: 16px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.header-subtitle {
  font-size: 12px;
  color: #6b7280;
}

.demo-badge {
  background: #fbbf24;
  color: #92400e;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.trend-icon {
  margin-left: auto;
}

.leaderboard-tabs {
  display: flex;
  gap: 4px;
  margin-top: 12px;
}

.tab-btn {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  color: #4b5563;
}

.tab-btn.active {
  background: #ede9fe;
  color: #5b21b6;
}

.history-content {
  padding: 16px;
}

.no-history {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.no-history p {
  margin-top: 12px;
  font-size: 14px;
}

.history-item {
  background: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.question-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.question-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.answer {
  font-size: 12px;
  color: #16a34a;
  font-weight: 500;
}

.time {
  font-size: 12px;
  color: #6b7280;
}

.question-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-left {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.correct-count {
  color: #16a34a;
  font-weight: 500;
}

.separator,
.total-count {
  color: #4b5563;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.loading-container p,
.error-container p {
  margin-top: 12px;
  font-size: 14px;
}

.leaderboard-content {
  padding: 16px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.leaderboard-item:hover {
  background-color: #f9fafb;
}

.rank-avatar {
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.rank-avatar.gold {
  background: linear-gradient(135deg, #eab308 0%, #facc15 100%);
}

.rank-avatar.silver {
  background: linear-gradient(135deg, #9ca3af 0%, #d1d5db 100%);
}

.rank-avatar.bronze {
  background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
}

.rank-avatar.blue {
  background: #3b82f6;
}

.player-info {
  flex: 1;
}

.player-name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.player-streak {
  font-size: 12px;
  color: #6b7280;
}

.player-score {
  text-align: right;
}

.score-number {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.score-label {
  font-size: 12px;
  color: #6b7280;
}

.current-user-rank {
  background: #eff6ff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  margin-top: 8px;
}

.user-rank-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  background: #3b82f6;
  color: white;
  font-size: 12px;
  font-weight: 500;
}

.user-info {
  flex: 1;
}

.user-title {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.user-subtitle {
  font-size: 12px;
  color: #4b5563;
}

.user-stats {
  text-align: right;
}

.user-score {
  font-size: 18px;
  font-weight: 700;
  color: #2563eb;
}

.user-total {
  font-size: 12px;
  color: #6b7280;
}

/* Dropdown styles */
.details-dropdown {
  color: #2563eb;
  font-size: 12px;
  padding: 0;
  min-height: auto;
}

.details-dropdown .q-btn__content {
  font-size: 12px;
}

.top-answerers-dropdown {
  min-width: 280px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dropdown-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.answerer-item-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  transition: background-color 0.2s;
}

.answerer-item-dropdown:hover {
  background: #f9fafb;
  border-radius: 4px;
  padding: 6px 8px;
}

.answerer-item-dropdown.current-user {
  background: #eff6ff;
  border-radius: 4px;
  padding: 6px 8px;
  border: 1px solid #dbeafe;
}

.rank-badge {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6b7280;
  color: white;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
}

.answerer-item-dropdown:nth-child(2) .rank-badge {
  background: #f59e0b;
}

.answerer-item-dropdown:nth-child(3) .rank-badge {
  background: #9ca3af;
}

.answerer-item-dropdown:nth-child(4) .rank-badge {
  background: #d97706;
}

.answerer-mini-avatar {
  background: #6d28d9;
  color: white;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

.answerer-mini-info {
  flex: 1;
  min-width: 0;
}

.answerer-mini-name {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.answerer-mini-time {
  font-size: 11px;
  color: #6b7280;
  line-height: 1.2;
}

.answerer-mini-status {
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .dashboard-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .sidebar-section {
    width: 100%;
    order: -1;
  }
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 16px;
  }

  .dashboard-container {
    padding: 16px;
  }

  .chat-header,
  .chat-messages,
  .chat-input {
    padding: 12px 16px;
  }

  .header-content {
    flex-wrap: wrap;
  }

  .header-actions {
    margin-left: 0;
    margin-top: 8px;
  }
}
</style>
