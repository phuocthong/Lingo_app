<template>
  <q-page class="rewards-page">
    <div class="rewards-container">
      <!-- ProfileSidebar -->
      <ProfileSidebar />

      <!-- Main Content -->
      <div class="rewards-content">
        <div class="page-header">
          <h1 class="page-title">Đổi điểm</h1>
          <div class="user-points">
            <div class="points-display">
              <q-icon name="stars" class="points-icon" />
              <span class="points-amount">{{ userPoints }}</span>
              <span class="points-label">điểm</span>
            </div>
          </div>
        </div>

        <!-- Categories -->
        <div class="categories-section">
          <div class="category-tabs">
            <button
              v-for="category in categories"
              :key="category.id"
              class="category-tab"
              :class="{ active: activeCategory === category.id }"
              @click="activeCategory = category.id"
            >
              <q-icon :name="category.icon" />
              {{ category.name }}
            </button>
          </div>
        </div>

        <!-- Rewards Grid -->
        <div class="rewards-grid">
          <div
            v-for="reward in filteredRewards"
            :key="reward.id"
            class="reward-card"
            :class="{ 'out-of-stock': reward.stock === 0, affordable: userPoints >= reward.cost }"
          >
            <div class="reward-image">
              <img :src="reward.image" :alt="reward.name" />
              <div v-if="reward.stock === 0" class="out-of-stock-overlay">
                <span>Hết hàng</span>
              </div>
            </div>

            <div class="reward-info">
              <h3 class="reward-name">{{ reward.name }}</h3>
              <p class="reward-description">{{ reward.description }}</p>

              <div class="reward-details">
                <div class="reward-cost">
                  <q-icon name="stars" class="cost-icon" />
                  <span class="cost-amount">{{ reward.cost }}</span>
                  <span class="cost-label">điểm</span>
                </div>

                <div class="reward-stock">
                  <span class="stock-label">Còn lại:</span>
                  <span class="stock-amount">{{ reward.stock }}</span>
                </div>
              </div>

              <q-btn
                class="redeem-btn"
                :class="{
                  'can-afford': userPoints >= reward.cost && reward.stock > 0,
                  'cannot-afford': userPoints < reward.cost || reward.stock === 0,
                }"
                :disable="userPoints < reward.cost || reward.stock === 0"
                @click="redeemReward(reward)"
              >
                <span v-if="reward.stock === 0">Hết hàng</span>
                <span v-else-if="userPoints < reward.cost">Không đủ điểm</span>
                <span v-else>Đổi ngay</span>
              </q-btn>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="transactions-section">
          <h2 class="section-title">Lịch sử đổi điểm</h2>
          <div class="transactions-list">
            <div
              v-for="transaction in recentTransactions"
              :key="transaction.id"
              class="transaction-item"
            >
              <div class="transaction-image">
                <img :src="transaction.image" :alt="transaction.name" />
              </div>

              <div class="transaction-info">
                <div class="transaction-name">{{ transaction.name }}</div>
                <div class="transaction-date">{{ transaction.date }}</div>
              </div>

              <div class="transaction-cost">
                <span class="cost">-{{ transaction.cost }} điểm</span>
              </div>

              <div class="transaction-status">
                <span class="status" :class="transaction.status">
                  {{ getStatusText(transaction.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProfileSidebar from '../components/ProfileSidebar.vue'

// User points
const userPoints = ref(1250)

// Categories
const categories = ref([
  { id: 'all', name: 'Tất cả', icon: 'grid_view' },
  { id: 'vouchers', name: 'Voucher', icon: 'card_giftcard' },
  { id: 'books', name: 'Sách', icon: 'menu_book' },
  { id: 'accessories', name: 'Phụ kiện', icon: 'headphones' },
  { id: 'courses', name: 'Khóa học', icon: 'school' },
])

const activeCategory = ref('all')

// Rewards data
const rewards = ref([
  {
    id: 1,
    name: 'Voucher Shopee 50K',
    description: 'Phiếu mua hàng Shopee trị giá 50.000đ',
    cost: 500,
    stock: 25,
    category: 'vouchers',
    image: 'https://via.placeholder.com/200x150/FF6B35/FFFFFF?text=Shopee',
  },
  {
    id: 2,
    name: 'Sách "English Grammar"',
    description: 'Sách học ngữ pháp tiếng Anh cơ bản',
    cost: 800,
    stock: 10,
    category: 'books',
    image: 'https://via.placeholder.com/200x150/4285F4/FFFFFF?text=Book',
  },
  {
    id: 3,
    name: 'Tai nghe Bluetooth',
    description: 'Tai nghe không dây chất lượng cao',
    cost: 1200,
    stock: 5,
    category: 'accessories',
    image: 'https://via.placeholder.com/200x150/34A853/FFFFFF?text=Headphones',
  },
  {
    id: 4,
    name: 'Khóa học IELTS Online',
    description: 'Khóa học IELTS trực tuyến 3 tháng',
    cost: 2000,
    stock: 3,
    category: 'courses',
    image: 'https://via.placeholder.com/200x150/EA4335/FFFFFF?text=IELTS',
  },
  {
    id: 5,
    name: 'Voucher Grab Food 30K',
    description: 'Phiếu ăn uống Grab Food trị giá 30.000đ',
    cost: 300,
    stock: 0,
    category: 'vouchers',
    image: 'https://via.placeholder.com/200x150/00BFA5/FFFFFF?text=Grab',
  },
  {
    id: 6,
    name: 'Từ điển Oxford',
    description: 'Từ điển tiếng Anh Oxford bản đặc biệt',
    cost: 1500,
    stock: 8,
    category: 'books',
    image: 'https://via.placeholder.com/200x150/9C27B0/FFFFFF?text=Oxford',
  },
])

// Recent transactions
const recentTransactions = ref([
  {
    id: 1,
    name: 'Voucher Shopee 50K',
    cost: 500,
    date: '15/01/2025',
    status: 'completed',
    image: 'https://via.placeholder.com/40x40/FF6B35/FFFFFF?text=S',
  },
  {
    id: 2,
    name: 'Sách "English Grammar"',
    cost: 800,
    date: '10/01/2025',
    status: 'processing',
    image: 'https://via.placeholder.com/40x40/4285F4/FFFFFF?text=B',
  },
  {
    id: 3,
    name: 'Voucher Grab Food 30K',
    cost: 300,
    date: '05/01/2025',
    status: 'completed',
    image: 'https://via.placeholder.com/40x40/00BFA5/FFFFFF?text=G',
  },
])

// Computed
const filteredRewards = computed(() => {
  if (activeCategory.value === 'all') {
    return rewards.value
  }
  return rewards.value.filter((reward) => reward.category === activeCategory.value)
})

// Methods
const redeemReward = (reward) => {
  if (userPoints.value >= reward.cost && reward.stock > 0) {
    userPoints.value -= reward.cost
    reward.stock -= 1

    // Add to recent transactions
    recentTransactions.value.unshift({
      id: Date.now(),
      name: reward.name,
      cost: reward.cost,
      date: new Date().toLocaleDateString('vi-VN'),
      status: 'processing',
      image: reward.image.replace('200x150', '40x40'),
    })

    console.log(`Redeemed: ${reward.name} for ${reward.cost} points`)
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return 'Hoàn thành'
    case 'processing':
      return 'Đang xử lý'
    case 'cancelled':
      return 'Đã hủy'
    default:
      return 'Không xác định'
  }
}
</script>

<style scoped>
.rewards-page {
  display: flex;
  min-height: 100vh;
  background: #ffffff;
  max-width: 100%;
  margin: 0 auto;
}

.rewards-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.rewards-content {
  flex: 1;
  padding: 20px 32px;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #000;
  margin: 0;
}

.user-points {
  display: flex;
  align-items: center;
}

.points-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  font-weight: 600;
}

.points-icon {
  font-size: 24px;
  color: #fbbf24;
}

.points-amount {
  font-size: 20px;
  font-weight: 700;
}

.points-label {
  font-size: 14px;
}

/* Categories */
.categories-section {
  margin-bottom: 32px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.category-tab:hover {
  background: #e5e7eb;
}

.category-tab.active {
  background: #2563eb;
  color: white;
}

/* Rewards Grid */
.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.reward-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.reward-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.reward-card.affordable {
  border-color: #10b981;
}

.reward-card.out-of-stock {
  opacity: 0.6;
}

.reward-image {
  position: relative;
  height: 150px;
  overflow: hidden;
}

.reward-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.out-of-stock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.reward-info {
  padding: 16px;
}

.reward-name {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin: 0 0 8px 0;
}

.reward-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.reward-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.reward-cost {
  display: flex;
  align-items: center;
  gap: 4px;
}

.cost-icon {
  font-size: 16px;
  color: #fbbf24;
}

.cost-amount {
  font-size: 16px;
  font-weight: 700;
  color: #059669;
}

.cost-label {
  font-size: 12px;
  color: #6b7280;
}

.reward-stock {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.stock-label {
  color: #6b7280;
}

.stock-amount {
  font-weight: 600;
  color: #374151;
}

.redeem-btn {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.redeem-btn.can-afford {
  background: #10b981;
  color: white;
}

.redeem-btn.can-afford:hover {
  background: #059669;
}

.redeem-btn.cannot-afford {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

/* Transactions */
.transactions-section {
  margin-top: 40px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #000;
  margin-bottom: 20px;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  gap: 16px;
}

.transaction-image {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.transaction-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.transaction-info {
  flex: 1;
}

.transaction-name {
  font-size: 14px;
  font-weight: 600;
  color: #000;
  margin-bottom: 2px;
}

.transaction-date {
  font-size: 12px;
  color: #6b7280;
}

.transaction-cost {
  font-size: 14px;
  font-weight: 600;
  color: #ef4444;
}

.transaction-status {
  min-width: 100px;
  text-align: right;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status.completed {
  background: #d1fae5;
  color: #065f46;
}

.status.processing {
  background: #fef3c7;
  color: #92400e;
}

.status.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .rewards-container {
    flex-direction: column;
  }

  .rewards-content {
    max-width: 100%;
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .rewards-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }

  .section-title {
    font-size: 20px;
  }

  .category-tabs {
    gap: 4px;
  }

  .category-tab {
    padding: 8px 12px;
    font-size: 13px;
  }

  .rewards-grid {
    grid-template-columns: 1fr;
  }

  .transaction-item {
    padding: 12px;
    gap: 12px;
  }

  .transaction-cost {
    font-size: 13px;
  }

  .points-display {
    padding: 8px 12px;
  }

  .points-amount {
    font-size: 18px;
  }
  .rewards-page {
    padding: 0px !important;
  }
}
</style>
