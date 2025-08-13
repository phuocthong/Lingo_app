<template>
  <q-layout view="lHh lpr lFf">
    <!-- Header -->
    <q-header class="main-header" elevated>
      <q-toolbar class="main-toolbar">
        <!-- Logo -->
        <div class="header-logo" @click="$router.push('/')">
          <q-icon name="extension" class="logo-icon" />

          <div class="logo-text">Lingo</div>
        </div>

        <!-- Navigation -->
        <div class="header-nav" v-if="!$q.screen.lt.md">
          <q-btn flat no-caps class="nav-btn" @click="$router.push('/')"> Trang chủ </q-btn>
          <q-btn flat no-caps class="nav-btn" @click="$router.push('/introduction')">
            Giới thiệu
          </q-btn>
          <q-btn flat no-caps class="nav-btn"> Thử thách </q-btn>
        </div>

        <q-space />

        <!-- Call to action -->
        <div class="header-actions" v-if="!$q.screen.lt.md">
          <!-- Register button -->
          <q-btn
            outline
            color="purple"
            class="action-btn register-btn"
            size="md"
            no-caps
            @click="register"
          >
            <q-icon name="auto_awesome" size="16px" class="q-mr-xs" />
            Bắt Đầu Miễn Phí
            <q-icon name="arrow_forward" size="16px" class="q-ml-xs" />
          </q-btn>

          <!-- Login button -->
          <q-btn color="purple" class="action-btn login-btn" size="md" no-caps @click="login">
            <q-icon name="play_arrow" size="16px" class="q-mr-xs" />
            Đăng Nhập
          </q-btn>
        </div>

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
      </q-toolbar>
    </q-header>

    <!-- Main content -->
    <q-page-container class="main-container">
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
          <q-item clickable @click="$router.push('/')" v-close-popup>
            <q-item-section>
              <q-item-label>Trang chủ</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable @click="$router.push('/introduction')" v-close-popup>
            <q-item-section>
              <q-item-label>Giới thiệu</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup>
            <q-item-section>
              <q-item-label>Thử thách</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item clickable @click="register" v-close-popup>
            <q-item-section>
              <q-item-label>Bắt Đầu Miễn Phí</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable @click="login" v-close-popup>
            <q-item-section>
              <q-item-label>Đăng Nhập</q-item-label>
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

const router = useRouter()
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const register = () => {
  // Navigate to registration or challenges page
  router.push('/register')
}

const login = () => {
  // Navigate to dashboard
  router.push('/dashboard')
}
</script>

<style scoped>
.main-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
}

.main-toolbar {
  padding: 0 24px;
  min-height: 73px;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
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

.header-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  padding: 8px 32px;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

.register-btn {
  border: 2px solid #e9d5ff;
  background: white;
  color: #5b21b6;
}

.login-btn {
  background: linear-gradient(135deg, #2563eb 0%, #6d28d9 100%);
  color: white;
}

.mobile-menu-btn {
  color: #374151;
}

.main-container {
  background: #ffffff;
}

.mobile-drawer {
  background: white;
}

.mobile-menu {
  padding: 16px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-nav {
    margin-left: 48px;
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .main-toolbar {
    padding: 0 16px;
    min-height: 64px;
  }

  .header-nav {
    display: none;
  }

  .header-actions {
    display: none;
  }
}
</style>
