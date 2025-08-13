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
            </div>
          </q-card-section>

          <!-- Chat Messages -->
          <q-card-section class="chat-messages">
            <!-- Bot Message 1 -->
            <div class="message-row">
              <q-avatar size="32px" class="bot-avatar">
                <q-icon name="extension" size="16px" />
              </q-avatar>
              <div class="message-bubble bot-message">
                <div class="message-text">
                  Xin chào! Tôi là EnglishBot. Tôi sẽ đưa ra các câu hỏi tiếng Anh định kỳ để các
                  bạn trả lời.
                </div>
                <div class="message-time">21:23</div>
              </div>
            </div>

            <!-- Bot Message 2 -->
            <div class="message-row">
              <q-avatar size="32px" class="bot-avatar">
                <q-icon name="extension" size="16px" />
              </q-avatar>
              <div class="message-bubble bot-message">
                <div class="message-text">Dịch từ "Intelligent" sang tiếng Việt</div>
                <div class="message-time">21:23</div>
                <div class="message-participants">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/94861390f9be0eb42544493a89935a3e8537e779?width=38"
                    alt="User 1"
                    class="participant-avatar"
                  />
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/808cc85b683761b4f2649b219713e811950b7da6?width=38"
                    alt="User 2"
                    class="participant-avatar"
                  />
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/d0b0d0d7bf9e895d63b544b8849b7b88a157a184?width=38"
                    alt="User 3"
                    class="participant-avatar"
                  />
                </div>
              </div>
            </div>

            <!-- Correct Answer Display -->
            <div class="answer-display">
              <div class="correct-answer">
                Đáp án đúng là: "thông minh"
                <div class="answer-time">21:23</div>
              </div>
            </div>

            <!-- Bot Message 3 -->
            <div class="message-row">
              <q-avatar size="32px" class="bot-avatar">
                <q-icon name="extension" size="16px" />
              </q-avatar>
              <div class="message-bubble bot-message">
                <div class="message-text">Dịch từ "Amazing" sang tiếng Việt</div>
                <div class="message-time">21:23</div>
                <div class="message-participants">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/afd6b1f2255dd111fa11b26060334ab2b8550b68?width=34"
                    alt="User 1"
                    class="participant-avatar"
                  />
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/57601513ec477a7832bf1a848cd546ad59d68b24?width=34"
                    alt="User 2"
                    class="participant-avatar"
                  />
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/a799c61d39d6c04d560750f802eb88c5ea24ee80?width=34"
                    alt="User 3"
                    class="participant-avatar"
                  />
                </div>
              </div>
            </div>

            <!-- Answer Display 2 -->
            <div class="answer-display">
              <div class="correct-answer">
                Đáp án đúng là: "tuyệt vời"
                <div class="answer-time">21:24</div>
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
              />
              <q-btn icon="send" color="primary" class="send-btn" @click="sendMessage" />
            </div>

            <div class="status-indicator">
              <q-icon name="fiber_manual_record" color="green" size="8px" />
              <span class="status-text">Đăng nhập với tên: Người dùng</span>
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
            <div class="header-subtitle">20 câu hỏi gần nhất</div>
          </q-card-section>

          <q-card-section class="history-content">
            <!-- History Item 1 -->
            <div class="history-item">
              <div class="question-title">Dịch từ "Beautiful" sang tiếng Việt</div>
              <div class="question-meta">
                <span class="answer">Đáp án: " đẹp "</span>
                <span class="time">10:30 - 26/07/2024</span>
              </div>
              <div class="question-stats">
                <div class="stats-left">
                  <q-icon name="people" size="12px" />
                  <span class="correct-count">15 đúng</span>
                  <span class="separator">/</span>
                  <span class="total-count">23 trả lời</span>
                </div>
                <q-btn-dropdown
                  class="details-dropdown"
                  flat
                  no-caps
                  size="sm"
                  label="▼ Top 5 nhanh nhất"
                >
                  <div class="top-answerers-dropdown">
                    <div class="dropdown-title">Top 5 người trả lời nhanh nhất</div>
                    <div
                      v-for="(answerer, index) in getTopAnswerers(1)"
                      :key="answerer.id"
                      class="answerer-item-dropdown"
                      :class="{ 'current-user': answerer.name === 'Người dùng' }"
                    >
                      <div class="rank-badge">{{ index + 1 }}</div>
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

            <!-- History Item 2 -->
            <div class="history-item">
              <div class="question-title">Dịch từ "Happy" sang tiếng Việt</div>
              <div class="question-meta">
                <span class="answer">Đáp án: " hạnh phúc "</span>
                <span class="time">10:25 - 26/07/2024</span>
              </div>
              <div class="question-stats">
                <div class="stats-left">
                  <q-icon name="people" size="12px" />
                  <span class="correct-count">12 đúng</span>
                  <span class="separator">/</span>
                  <span class="total-count">18 trả lời</span>
                </div>
                <q-btn-dropdown
                  class="details-dropdown"
                  flat
                  no-caps
                  size="sm"
                  label="▼ Top 5 nhanh nhất"
                >
                  <div class="top-answerers-dropdown">
                    <div class="dropdown-title">Top 5 người trả lời nhanh nhất</div>
                    <div
                      v-for="(answerer, index) in getTopAnswerers(1)"
                      :key="answerer.id"
                      class="answerer-item-dropdown"
                      :class="{ 'current-user': answerer.name === 'Người dùng' }"
                    >
                      <div class="rank-badge">{{ index + 1 }}</div>
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

            <!-- History Item 3 -->
            <div class="history-item">
              <div class="question-title">Dịch từ "Wonderful" sang tiếng Việt</div>
              <div class="question-meta">
                <span class="answer">Đáp án: " tuyệt vời "</span>
                <span class="time">10:20 - 26/07/2024</span>
              </div>
              <div class="question-stats">
                <div class="stats-left">
                  <q-icon name="people" size="12px" />
                  <span class="correct-count">18 đúng</span>
                  <span class="separator">/</span>
                  <span class="total-count">25 trả lời</span>
                </div>
                <q-btn-dropdown
                  class="details-dropdown"
                  flat
                  no-caps
                  size="sm"
                  label="▼ Top 5 nhanh nhất"
                >
                  <div class="top-answerers-dropdown">
                    <div class="dropdown-title">Top 5 người trả lời nhanh nhất</div>
                    <div
                      v-for="(answerer, index) in getTopAnswerers(1)"
                      :key="answerer.id"
                      class="answerer-item-dropdown"
                      :class="{ 'current-user': answerer.name === 'Người dùng' }"
                    >
                      <div class="rank-badge">{{ index + 1 }}</div>
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
              <q-icon name="trending_up" size="16px" class="trend-icon" />
            </div>

            <div class="leaderboard-tabs">
              <q-btn
                flat
                size="sm"
                :class="['tab-btn', { active: activeTab === 'total' }]"
                no-caps
                @click="switchTab('total')"
                >Tổng</q-btn
              >
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
            <!-- Dynamic Leaderboard Items -->
            <div
              v-for="(player, index) in getCurrentLeaderboard()"
              :key="player.id"
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
                :style="index === 1 ? 'opacity: 0.2' : ''"
              />
              <q-avatar
                size="32px"
                :class="[
                  'rank-avatar',
                  index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'blue',
                ]"
              >
                {{ player.avatar }}
              </q-avatar>
              <div class="player-info">
                <div class="player-name">{{ player.name }}</div>
                <div class="player-streak">Streak: {{ player.streak }}</div>
              </div>
              <div class="player-score">
                <div class="score-number">{{ player.score.toLocaleString() }}</div>
                <div class="score-label">Câu đúng</div>
              </div>
            </div>

            <!-- Current User -->
            <div class="current-user-rank">
              <div class="user-rank-content">
                <q-avatar size="32px" class="user-avatar">ND</q-avatar>
                <div class="user-info">
                  <div class="user-title">Hạng của bạn: # 45</div>
                  <div class="user-subtitle">523 câu đúng • Top 4 %</div>
                </div>
                <div class="user-stats">
                  <div class="user-score">523</div>
                  <div class="user-total">/ 1,250 người chơi</div>
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
import { ref } from 'vue'

const messageInput = ref('')
const activeTab = ref('total')

const sendMessage = () => {
  if (messageInput.value.trim()) {
    console.log('Sending message:', messageInput.value)
    messageInput.value = ''
  }
}

const switchTab = (tab) => {
  activeTab.value = tab
  console.log('Switched to tab:', tab)
  // In a real app, you would fetch new data here
}

// Sample data for top answerers by question
const questionTopAnswerers = ref({
  1: [
    { id: 1, name: 'Minh Anh', avatar: 'MA', time: '1.2s', correct: true },
    { id: 2, name: 'Thành Hòa', avatar: 'TH', time: '1.8s', correct: true },
    { id: 3, name: 'Văn Nam', avatar: 'VN', time: '2.1s', correct: true },
    { id: 4, name: 'Thu Trang', avatar: 'TT', time: '2.5s', correct: false },
    { id: 5, name: 'Người dùng', avatar: 'ND', time: '3.2s', correct: true },
  ],
  2: [
    { id: 1, name: 'Thu Trang', avatar: 'TT', time: '0.9s', correct: true },
    { id: 2, name: 'Minh Anh', avatar: 'MA', time: '1.5s', correct: true },
    { id: 3, name: 'Người dùng', avatar: 'ND', time: '2.1s', correct: true },
    { id: 4, name: 'Văn Nam', avatar: 'VN', time: '2.8s', correct: true },
    { id: 5, name: 'Thành Hòa', avatar: 'TH', time: '3.1s', correct: false },
  ],
  3: [
    { id: 1, name: 'Văn Nam', avatar: 'VN', time: '1.1s', correct: true },
    { id: 2, name: 'Người dùng', avatar: 'ND', time: '1.4s', correct: true },
    { id: 3, name: 'Minh Anh', avatar: 'MA', time: '1.9s', correct: true },
    { id: 4, name: 'Thu Trang', avatar: 'TT', time: '2.3s', correct: true },
    { id: 5, name: 'Thành Hòa', avatar: 'TH', time: '2.7s', correct: true },
  ],
})

// Get top answerers for specific question
const getTopAnswerers = (questionId) => {
  return questionTopAnswerers.value[questionId] || []
}

// Sample leaderboard data by time period
const leaderboardData = ref({
  total: [
    { id: 1, name: 'Minh Anh', avatar: 'MA', streak: 15, score: 2456, rank: 1 },
    { id: 2, name: 'Thành Hòa', avatar: 'TH', streak: 23, score: 2195, rank: 2 },
    { id: 3, name: 'Văn Nam', avatar: 'VN', streak: 12, score: 1957, rank: 3 },
    { id: 4, name: 'Thu Trang', avatar: 'TT', streak: 8, score: 1834, rank: 4 },
  ],
  week: [
    { id: 1, name: 'Thu Trang', avatar: 'TT', streak: 8, score: 156, rank: 1 },
    { id: 2, name: 'Minh Anh', avatar: 'MA', streak: 15, score: 142, rank: 2 },
    { id: 3, name: 'Văn Nam', avatar: 'VN', streak: 12, score: 138, rank: 3 },
    { id: 4, name: 'Thành Hòa', avatar: 'TH', streak: 23, score: 125, rank: 4 },
  ],
  month: [
    { id: 1, name: 'Thành Hòa', avatar: 'TH', streak: 23, score: 487, rank: 1 },
    { id: 2, name: 'Minh Anh', avatar: 'MA', streak: 15, score: 445, rank: 2 },
    { id: 3, name: 'Văn Nam', avatar: 'VN', streak: 12, score: 398, rank: 3 },
    { id: 4, name: 'Thu Trang', avatar: 'TT', streak: 8, score: 367, rank: 4 },
  ],
  year: [
    { id: 1, name: 'Minh Anh', avatar: 'MA', streak: 15, score: 2456, rank: 1 },
    { id: 2, name: 'Thành Hòa', avatar: 'TH', streak: 23, score: 2195, rank: 2 },
    { id: 3, name: 'Văn Nam', avatar: 'VN', streak: 12, score: 1957, rank: 3 },
    { id: 4, name: 'Thu Trang', avatar: 'TT', streak: 8, score: 1834, rank: 4 },
  ],
})

// Get current leaderboard data
const getCurrentLeaderboard = () => {
  return leaderboardData.value[activeTab.value] || leaderboardData.value.total
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

.message-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
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
  margin: 16px 24px;
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

.details-link {
  font-size: 12px;
  color: #2563eb;
  cursor: pointer;
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

@media (max-width: 1024px) {
  .dashboard-container {
    flex-direction: column;
    max-width: 1024px;
    margin: 0 auto;
    padding: 0;
  }

  .sidebar-section {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 16px;
  }

  .dashboard-container {
    gap: 16px;
  }

  .chat-header,
  .chat-messages,
  .chat-input {
    padding: 12px 16px;
  }

  .sidebar-section {
    order: -1;
  }
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

/* Top Answerers Dropdown */
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

/* Responsive modal styles */
@media (max-width: 1024px) {
  .dashboard-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .chat-section {
    order: 1; /* Đưa chat lên đầu */
  }

  .sidebar-section {
    order: 2; /* Sidebar xuống dưới */
  }
}

@media (max-width: 768px) {
  .details-dropdown .q-btn__content {
    font-size: 11px;
  }

  .top-answerers-dropdown {
    min-width: 250px;
  }

  .dropdown-title {
    font-size: 13px;
  }

  .answerer-mini-name {
    font-size: 12px;
  }

  .answerer-mini-time {
    font-size: 10px;
  }

  .chat-card {
    height: 600px;
  }
}
</style>
