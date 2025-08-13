<template>
  <q-page class="tasks-page">
    <div class="tasks-container">
      <!-- ProfileSidebar -->
      <ProfileSidebar />

      <!-- Main Content -->
      <div class="tasks-content">
        <div class="page-header">
          <h1 class="page-title">Nhiệm vụ</h1>
          <p class="page-subtitle">Hoàn thành các nhiệm vụ để nhận điểm thưởng</p>
        </div>

        <!-- Daily Tasks -->
        <div class="task-section">
          <h2 class="section-title">Nhiệm vụ hàng ngày</h2>
          <div class="tasks-grid">
            <div v-for="task in dailyTasks" :key="task.id" class="task-card">
              <div class="task-icon">
                <q-icon :name="task.icon" :class="task.iconClass" />
              </div>
              <div class="task-info">
                <h3 class="task-title">{{ task.title }}</h3>
                <p class="task-description">{{ task.description }}</p>
                <div class="task-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: task.progress + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ task.current }}/{{ task.target }}</span>
                </div>
              </div>
              <div class="task-reward">
                <div class="reward-amount">+{{ task.reward }} XP</div>
                <q-btn v-if="task.completed" class="claim-btn completed" disable>
                  Đã hoàn thành
                </q-btn>
                <q-btn v-else-if="task.canClaim" class="claim-btn" @click="claimReward(task.id)">
                  Nhận thưởng
                </q-btn>
                <q-btn v-else class="claim-btn disabled" disable> Chưa hoàn thành </q-btn>
              </div>
            </div>
          </div>
        </div>

        <!-- Weekly Tasks -->
        <div class="task-section">
          <h2 class="section-title">Nhiệm vụ tuần</h2>
          <div class="tasks-grid">
            <div v-for="task in weeklyTasks" :key="task.id" class="task-card weekly">
              <div class="task-icon">
                <q-icon :name="task.icon" :class="task.iconClass" />
              </div>
              <div class="task-info">
                <h3 class="task-title">{{ task.title }}</h3>
                <p class="task-description">{{ task.description }}</p>
                <div class="task-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: task.progress + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ task.current }}/{{ task.target }}</span>
                </div>
              </div>
              <div class="task-reward">
                <div class="reward-amount">+{{ task.reward }} XP</div>
                <q-btn v-if="task.completed" class="claim-btn completed" disable>
                  Đã hoàn thành
                </q-btn>
                <q-btn v-else-if="task.canClaim" class="claim-btn" @click="claimReward(task.id)">
                  Nhận thưởng
                </q-btn>
                <q-btn v-else class="claim-btn disabled" disable> Chưa hoàn thành </q-btn>
              </div>
            </div>
          </div>
        </div>

        <!-- Achievement Tasks -->
        <div class="task-section">
          <h2 class="section-title">Thành tựu</h2>
          <div class="tasks-grid">
            <div v-for="task in achievementTasks" :key="task.id" class="task-card achievement">
              <div class="task-icon">
                <q-icon :name="task.icon" :class="task.iconClass" />
              </div>
              <div class="task-info">
                <h3 class="task-title">{{ task.title }}</h3>
                <p class="task-description">{{ task.description }}</p>
                <div class="task-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: task.progress + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ task.current }}/{{ task.target }}</span>
                </div>
              </div>
              <div class="task-reward">
                <div class="reward-amount">+{{ task.reward }} XP</div>
                <q-btn v-if="task.completed" class="claim-btn completed" disable>
                  Đã hoàn thành
                </q-btn>
                <q-btn v-else-if="task.canClaim" class="claim-btn" @click="claimReward(task.id)">
                  Nhận thưởng
                </q-btn>
                <q-btn v-else class="claim-btn disabled" disable> Chưa hoàn thành </q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import ProfileSidebar from '../components/ProfileSidebar.vue'

// Mock tasks data
const dailyTasks = ref([
  {
    id: 1,
    title: 'Hoàn thành 5 câu hỏi',
    description: 'Trả lời đúng 5 câu hỏi từ vựng',
    current: 3,
    target: 5,
    progress: 60,
    reward: 50,
    icon: 'quiz',
    iconClass: 'text-blue-500',
    canClaim: false,
    completed: false,
  },
  {
    id: 2,
    title: 'Đăng nhập hàng ngày',
    description: 'Đăng nhập vào ứng dụng',
    current: 1,
    target: 1,
    progress: 100,
    reward: 25,
    icon: 'login',
    iconClass: 'text-green-500',
    canClaim: true,
    completed: false,
  },
  {
    id: 3,
    title: 'Thử thách bạn bè',
    description: 'Tham gia 1 trận thử thách với bạn bè',
    current: 0,
    target: 1,
    progress: 0,
    reward: 75,
    icon: 'people',
    iconClass: 'text-purple-500',
    canClaim: false,
    completed: false,
  },
])

const weeklyTasks = ref([
  {
    id: 4,
    title: 'Streak 7 ngày',
    description: 'Duy trì chuỗi học tập 7 ngày liên tiếp',
    current: 5,
    target: 7,
    progress: 71,
    reward: 200,
    icon: 'local_fire_department',
    iconClass: 'text-orange-500',
    canClaim: false,
    completed: false,
  },
  {
    id: 5,
    title: 'Hoàn thành 50 câu hỏi',
    description: 'Trả lời đúng 50 câu hỏi trong tuần',
    current: 42,
    target: 50,
    progress: 84,
    reward: 300,
    icon: 'quiz',
    iconClass: 'text-blue-600',
    canClaim: false,
    completed: false,
  },
])

const achievementTasks = ref([
  {
    id: 6,
    title: 'Người học tích cực',
    description: 'Hoàn thành 1000 câu hỏi',
    current: 523,
    target: 1000,
    progress: 52,
    reward: 1000,
    icon: 'star',
    iconClass: 'text-yellow-500',
    canClaim: false,
    completed: false,
  },
  {
    id: 7,
    title: 'Bậc thầy từ vựng',
    description: 'Học được 500 từ mới',
    current: 350,
    target: 500,
    progress: 70,
    reward: 800,
    icon: 'auto_stories',
    iconClass: 'text-indigo-500',
    canClaim: false,
    completed: false,
  },
])

const claimReward = (taskId) => {
  // Find task in all arrays
  const allTasks = [...dailyTasks.value, ...weeklyTasks.value, ...achievementTasks.value]
  const task = allTasks.find((t) => t.id === taskId)

  if (task && task.canClaim) {
    task.completed = true
    task.canClaim = false
    console.log(`Claimed reward for task: ${task.title}, +${task.reward} XP`)
  }
}
</script>

<style scoped>
.tasks-page {
  display: flex;
  min-height: 100vh;
  background: #ffffff;
  max-width: 100%;
  margin: 0 auto;
}

.tasks-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.tasks-content {
  flex: 1;
  padding: 20px 32px;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #000;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.task-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #000;
  margin-bottom: 20px;
}

.tasks-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.task-card {
  display: flex;
  align-items: center;
  padding: 24px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.task-card.weekly {
  border-left: 4px solid #2563eb;
}

.task-card.achievement {
  border-left: 4px solid #7c3aed;
}

.task-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 12px;
  margin-right: 20px;
  flex-shrink: 0;
}

.task-icon .q-icon {
  font-size: 28px;
}

.task-info {
  flex: 1;
  margin-right: 20px;
}

.task-title {
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin: 0 0 4px 0;
}

.task-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
}

.task-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  min-width: 40px;
}

.task-reward {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.reward-amount {
  font-size: 16px;
  font-weight: 700;
  color: #059669;
}

.claim-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.claim-btn:not(.disabled):not(.completed) {
  background: #2563eb;
  color: white;
}

.claim-btn:not(.disabled):not(.completed):hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.claim-btn.completed {
  background: #10b981;
  color: white;
}

.claim-btn.disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .tasks-container {
    flex-direction: column;
  }

  .tasks-content {
    padding: 16px;
  }

  .task-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .task-icon {
    margin-right: 0;
  }

  .task-info {
    margin-right: 0;
  }

  .task-progress {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }

  .section-title {
    font-size: 20px;
  }

  .task-card {
    padding: 20px;
  }

  .task-title {
    font-size: 16px;
  }

  .task-description {
    font-size: 13px;
  }

  .claim-btn {
    min-width: 100px;
    padding: 6px 12px;
    font-size: 13px;
  }

  .tasks-page {
    padding: 0px !important;
  }

  .tasks-content {
    margin: 0px;
  }
}
</style>
