<template>
  <q-layout view="lHh lpr lFf">
    <!-- Header for logged-in users -->
    <q-header class="dashboard-header" elevated>
      <q-toolbar class="dashboard-toolbar">
        <!-- Logo -->
        <div class="header-logo">
          <q-icon name="extension" class="logo-icon" />

          <div class="logo-text">Lingo</div>

          <div class="logo-text">Lingo-Challenge</div>

        </div>

        <!-- Navigation -->
        <div class="header-nav" v-if="!$q.screen.lt.md">
          <q-btn flat no-caps class="nav-btn" @click="$router.push('/dashboard')">
            Trang chủ
          </q-btn>
          <q-btn flat no-caps class="nav-btn" @click="$router.push('/dashboard/introduction')">
            Giới thiệu
          </q-btn>
          <q-btn flat no-caps class="nav-btn" @click="$router.push('/dashboard/challenges')">
            Thử thách
          </q-btn>
        </div>

        <q-space />

        <!-- User Stats -->
        <div class="user-stats">
          <div class="stat-item">
            <q-icon name="emoji_events" class="stat-icon" />
            <span class="stat-text"># 45</span>
          </div>
          <div class="stat-item">
            <span class="stat-number correct">523</span>
            <span class="stat-label">đúng</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Streak:</span>
            <span class="stat-number streak">7</span>
          </div>
        </div>

        <!-- User Profile -->
        <div class="user-profile">
          <q-avatar
            class="user-avatar clickable"
            size="32px"
            @click="$router.push('/dashboard/profile')"
          >
            ND
          </q-avatar>
          <span class="user-name clickable" @click="$router.push('/dashboard/profile')">
            Người dùng
          </span>

          <q-btn flat dense class="logout-btn" @click="logout">
            <q-icon name="logout" size="16px" class="q-mr-xs" />
            Đăng xuất
          </q-btn>

          <!-- Mobile menu -->
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleMobileMenu"
            v-if="$q.screen.lt.md"
            class="mobile-menu-btn"
          />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Main content -->
    <q-page-container class="dashboard-container">
      <router-view />
    </q-page-container>

    <!-- Mobile Menu Drawer -->
    <q-drawer
      v-model="mobileMenuOpen"
      side="right"
      overlay
      behavior="mobile"
      width="250"
      class="mobile-drawer"
    >
      <div class="mobile-menu">
        <q-list>
          <q-item clickable @click="$router.push('/dashboard')" v-close-popup>
            <q-item-section>
              <q-item-label>Trang chủ</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable @click="$router.push('/dashboard/introduction')" v-close-popup>
            <q-item-section>
              <q-item-label>Giới thiệu</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable @click="$router.push('/dashboard/challenges')" v-close-popup>
            <q-item-section>
              <q-item-label>Thử thách</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item clickable @click="logout" v-close-popup>
            <q-item-section>
              <q-item-label>Đăng xuất</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../utils/auth.js'

const router = useRouter()
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Auto-login for demo purposes
// Authentication is now handled by router guards

const logout = () => {
  // Handle logout logic
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.dashboard-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
}

.dashboard-toolbar {
  padding: 0 24px;
  min-height: 73px;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  background: #6d28d9;
  color: white;
  padding: 8px;
  border-radius: 8px;
  font-size: 24px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.header-nav {
  display: flex;
  gap: 24px;
  margin-left: 148px;
}

.nav-btn {
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 8px;
}

.nav-btn:hover {
  color: #2563eb;
}

.user-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-icon {
  color: #6b7280;
  font-size: 16px;
}

.stat-text {
  color: #4b5563;
  font-size: 14px;
}

.stat-number {
  font-size: 14px;
  font-weight: 500;
}

.stat-number.correct {
  color: #16a34a;
}

.stat-number.streak {
  color: #2563eb;
}

.stat-label {
  color: #4b5563;
  font-size: 14px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
}

.user-avatar {
  background: #6d28d9;
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.user-name {
  color: #111827;
  font-size: 16px;
  font-weight: 500;
}

.clickable {
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.clickable:hover {
  opacity: 0.8;
}

.logout-btn {
  color: #000;
  font-size: 12px;
  font-weight: 500;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-left: 8px;
}

.logout-btn:hover {
  background: #f9fafb;
}

.dashboard-container {
  background: #f5f3ff;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-nav {
    margin-left: 48px;
    gap: 16px;
  }

  .user-stats {
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .dashboard-toolbar {
    padding: 0 16px;
    min-height: 64px;
  }

  .header-nav {
    display: none;
  }

  .user-stats {
    display: none;
  }

  .stat-item {
    font-size: 12px;
  }

  .user-name {
    display: none;
  }

  .logout-btn {
    display: none;
  }
}
</style>
