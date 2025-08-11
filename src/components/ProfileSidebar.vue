<template>
  <div class="profile-sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- Sidebar Header -->
    <div class="sidebar-header">
      <div class="sidebar-logo" v-show="!sidebarCollapsed">Menu</div>
      <button class="sidebar-toggle" @click="toggleSidebar">
        <q-icon :name="sidebarCollapsed ? 'menu' : 'close'" />
      </button>
    </div>

    <!-- Navigation -->
    <div class="sidebar-content" v-show="!sidebarCollapsed">
      <nav class="sidebar-nav">
        <a
          href="/dashboard/profile"
          class="nav-item"
          :class="{ active: activeTab === 'profile' }"
          @click.prevent="navigateToTab('profile', '/dashboard/profile')"
        >
          <div class="nav-icon">
            <q-icon name="person" />
          </div>
          <span class="nav-text">Hồ sơ</span>
          <div class="nav-indicator"></div>
        </a>
        <a
          href="/dashboard/friends"
          class="nav-item"
          :class="{ active: activeTab === 'friends' }"
          @click.prevent="navigateToTab('friends', '/dashboard/friends')"
        >
          <div class="nav-icon">
            <q-icon name="people" />
          </div>
          <span class="nav-text">Bạn bè</span>
          <div class="nav-indicator"></div>
        </a>
        <a
          href="/dashboard/add-friends"
          class="nav-item"
          :class="{ active: activeTab === 'add-friends' }"
          @click.prevent="navigateToTab('add-friends', '/dashboard/add-friends')"
        >
          <div class="nav-icon">
            <q-icon name="person_add" />
          </div>
          <span class="nav-text">Thêm bạn bè</span>
          <div class="nav-indicator"></div>
        </a>
        <a
          href="/dashboard/tasks"
          class="nav-item"
          :class="{ active: activeTab === 'tasks' }"
          @click.prevent="navigateToTab('tasks', '/dashboard/tasks')"
        >
          <div class="nav-icon">
            <q-icon name="task" />
          </div>
          <span class="nav-text">Nhiệm vụ</span>
          <div class="nav-indicator"></div>
        </a>
        <a
          href="/dashboard/rewards"
          class="nav-item"
          :class="{ active: activeTab === 'rewards' }"
          @click.prevent="navigateToTab('rewards', '/dashboard/rewards')"
        >
          <div class="nav-icon">
            <q-icon name="card_giftcard" />
          </div>
          <span class="nav-text">Đổi điểm</span>
          <div class="nav-indicator"></div>
        </a>
      </nav>
    </div>

    <!-- Sidebar Footer -->
    <div class="sidebar-footer" v-show="!sidebarCollapsed">
      <div class="user-mini-card">
        <q-avatar size="28px" class="user-mini-avatar">
          <img :src="userAvatar" alt="User" />
        </q-avatar>
        <div class="user-mini-info">
          <div class="user-mini-name">Người dùng</div>
          <div class="user-mini-status">Online</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const sidebarCollapsed = ref(false)
const activeTab = ref('profile')

const checkMobile = () => window.innerWidth <= 768

onMounted(() => {
  if (checkMobile()) {
    sidebarCollapsed.value = false
  }
})

window.addEventListener('resize', () => {
  if (checkMobile()) {
    sidebarCollapsed.value = false
  }
})

const userAvatar = ref(
  'https://cdn.builder.io/o/assets%2Ff046890c17ca436cab38cffc651fb9cb%2Fd0e1a2af26da485f8609e3080da7d7b8?alt=media&token=aca82dee-2b72-4297-9d9d-7921d490a327&apiKey=f046890c17ca436cab38cffc651fb9cb',
)

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const setActiveTab = (tab) => {
  activeTab.value = tab
}

const navigateToTab = (tab, routePath) => {
  // Ensure we can always click on navigation items
  setActiveTab(tab)

  // Use router.push with force navigation to prevent caching issues
  router.push(routePath).catch(() => {
    // Handle any navigation errors silently
  })
}

// Set active tab based on current route
const updateActiveTabFromRoute = () => {
  const currentPath = route.path
  if (currentPath.includes('/dashboard/friends')) {
    activeTab.value = 'friends'
  } else if (currentPath.includes('/dashboard/add-friends')) {
    activeTab.value = 'add-friends'
  } else if (currentPath.includes('/dashboard/tasks')) {
    activeTab.value = 'tasks'
  } else if (currentPath.includes('/dashboard/rewards')) {
    activeTab.value = 'rewards'
  } else if (currentPath.includes('/dashboard/profile')) {
    activeTab.value = 'profile'
  } else {
    // Default to profile for any other dashboard route
    activeTab.value = 'profile'
  }
}

// Watch for route changes
watch(route, () => {
  updateActiveTabFromRoute()
})

// Set initial active tab on mount
onMounted(() => {
  updateActiveTabFromRoute()
})
</script>

<style scoped>
/* Modern Sidebar */
.profile-sidebar {
  width: 280px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  flex-direction: column;
}

.sidebar-collapsed {
  width: 70px;
}

/* Sidebar Header */
.sidebar-header {
  padding: 20px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-logo {
  color: white;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.5px;
  line-height: 24px;
}

.sidebar-toggle {
  border: none;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

/* Navigation */
.sidebar-content {
  flex: 1;
  padding: 24px 16px;
  overflow-y: auto;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateX(4px);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateX(8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #fbbf24, #f59e0b);
  border-radius: 0 4px 4px 0;
}

.nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 20px;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}

.nav-item.active .nav-indicator {
  opacity: 1;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-mini-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
}

.user-mini-avatar {
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-mini-info {
  flex: 1;
  min-width: 0;
}

.user-mini-name {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-mini-status {
  font-size: 11px;
  color: #10b981;
  line-height: 1.2;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .profile-sidebar {
    width: 100%;
    height: auto;
  }
}

@media (max-width: 768px) {
  .profile-sidebar {
    width: 100%;
    height: auto;
  }

  .sidebar-header {
    display: none;
  }

  .sidebar-collapsed {
    width: 100%;
    height: 60px;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: row;
    gap: 4px;
    padding: 8px;
    overflow-x: auto;
  }

  .nav-item {
    flex-direction: column;
    gap: 4px;
    padding: 8px 12px;
    min-width: 60px;
  }

  .nav-text {
    font-size: 12px;
  }
}
</style>
