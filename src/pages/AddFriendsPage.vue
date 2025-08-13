<template>
  <q-page class="add-friends-page">
    <div class="add-friends-container">
      <!-- ProfileSidebar -->
      <ProfileSidebar />

      <!-- Main Content -->
      <div class="add-friends-content">
        <div class="page-header">
          <h1 class="page-title">Thêm bạn bè</h1>
        </div>

        <!-- Friend Requests List -->
        <div class="friend-requests-list">
          <div v-for="request in friendRequests" :key="request.id" class="friend-request-item">
            <div class="request-info">
              <div class="friend-avatar">
                <img :src="request.avatar" :alt="request.name" />
              </div>

              <div class="friend-details">
                <div class="friend-name">{{ request.name }}</div>
                <div class="friend-username">{{ request.username }}</div>
                <div class="mutual-friends">
                  <svg
                    class="friendship-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.3721 5.36194H4.37207C3.97437 5.36234 3.59307 5.5205 3.31185 5.80172C3.03063 6.08294 2.87247 6.46424 2.87207 6.86194V9.86194C2.87207 10.1272 2.97743 10.3815 3.16496 10.569C3.3525 10.7566 3.60685 10.8619 3.87207 10.8619V14.3619C3.87207 14.6272 3.97743 14.8815 4.16496 15.069C4.3525 15.2566 4.60685 15.3619 4.87207 15.3619H6.87207C7.13729 15.3619 7.39164 15.2566 7.57918 15.069C7.76671 14.8815 7.87207 14.6272 7.87207 14.3619V8.36194H6.87207V14.3619H4.87207V9.86194H3.87207V6.86194C3.87207 6.72933 3.92475 6.60215 4.01852 6.50839C4.11229 6.41462 4.23946 6.36194 4.37207 6.36194H13.3721C13.5047 6.36194 13.6319 6.41462 13.7256 6.50839C13.8194 6.60215 13.8721 6.72933 13.8721 6.86194V9.86194H12.8721V14.3619H10.8721V8.36194H9.87207V14.3619C9.87207 14.6272 9.97743 14.8815 10.165 15.069C10.3525 15.2566 10.6069 15.3619 10.8721 15.3619H12.8721C13.1373 15.3619 13.3916 15.2566 13.5792 15.069C13.7667 14.8815 13.8721 14.6272 13.8721 14.3619V10.8619C14.1373 10.8619 14.3916 10.7566 14.5792 10.569C14.7667 10.3815 14.8721 10.1272 14.8721 9.86194V6.86194C14.8717 6.46424 14.7135 6.08294 14.4323 5.80172C14.1511 5.5205 13.7698 5.36234 13.3721 5.36194ZM5.87207 4.86194C5.47651 4.86194 5.08983 4.74464 4.76093 4.52488C4.43203 4.30512 4.17569 3.99276 4.02431 3.62731C3.87294 3.26185 3.83333 2.85972 3.9105 2.47176C3.98767 2.0838 4.17815 1.72743 4.45786 1.44773C4.73756 1.16802 5.09393 0.977539 5.48189 0.900369C5.86985 0.823198 6.27199 0.862805 6.63744 1.01418C7.00289 1.16556 7.31525 1.4219 7.53501 1.7508C7.75477 2.0797 7.87207 2.46638 7.87207 2.86194C7.87154 3.39221 7.66066 3.90061 7.2857 4.27557C6.91074 4.65053 6.40234 4.86141 5.87207 4.86194ZM5.87207 1.86194C5.67429 1.86194 5.48095 1.92059 5.3165 2.03047C5.15205 2.14035 5.02388 2.29653 4.94819 2.47926C4.8725 2.66198 4.8527 2.86305 4.89128 3.05703C4.92987 3.25101 5.02511 3.42919 5.16496 3.56905C5.30482 3.7089 5.483 3.80414 5.67698 3.84272C5.87096 3.88131 6.07203 3.86151 6.25475 3.78582C6.43748 3.71013 6.59366 3.58196 6.70354 3.41751C6.81342 3.25306 6.87207 3.05972 6.87207 2.86194C6.87207 2.59672 6.76671 2.34237 6.57918 2.15483C6.39164 1.9673 6.13729 1.86194 5.87207 1.86194ZM11.8721 4.86194C11.4765 4.86194 11.0898 4.74464 10.7609 4.52488C10.432 4.30512 10.1757 3.99276 10.0243 3.62731C9.87294 3.26185 9.83333 2.85972 9.9105 2.47176C9.98767 2.0838 10.1782 1.72743 10.4579 1.44773C10.7376 1.16802 11.0939 0.977539 11.4819 0.900369C11.8699 0.823198 12.272 0.862805 12.6374 1.01418C13.0029 1.16556 13.3152 1.4219 13.535 1.7508C13.7548 2.0797 13.8721 2.46638 13.8721 2.86194C13.8715 3.39221 13.6607 3.90061 13.2857 4.27557C12.9107 4.65053 12.4023 4.86141 11.8721 4.86194ZM11.8721 1.86194C11.6743 1.86194 11.481 1.92059 11.3165 2.03047C11.152 2.14035 11.0239 2.29653 10.9482 2.47926C10.8725 2.66198 10.8527 2.86305 10.8913 3.05703C10.9299 3.25101 11.0251 3.42919 11.165 3.56905C11.3048 3.7089 11.483 3.80414 11.677 3.84272C11.871 3.88131 12.072 3.86151 12.2548 3.78582C12.4375 3.71013 12.5937 3.58196 12.7035 3.41751C12.8134 3.25306 12.8721 3.05972 12.8721 2.86194C12.8721 2.59672 12.7667 2.34237 12.5792 2.15483C12.3916 1.9673 12.1373 1.86194 11.8721 1.86194Z"
                      fill="black"
                    />
                  </svg>
                  <span class="mutual-count">{{ request.mutualFriends }} bạn chung</span>
                </div>
              </div>
            </div>

            <div class="request-actions">
              <q-btn class="accept-btn" @click="acceptRequest(request.id)"> Đồng ý </q-btn>
              <q-btn class="decline-btn" @click="declineRequest(request.id)"> Từ chối </q-btn>
            </div>
          </div>
        </div>

        <!-- Search Section -->
        <div class="search-section">
          <h2 class="section-title">Tìm kiếm bạn bè</h2>
          <div class="search-container">
            <div class="search-input">
              <svg
                class="search-icon"
                width="21"
                height="21"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.75597 17.2396C13.6344 17.2396 16.7785 14.0955 16.7785 10.217C16.7785 6.33857 13.6344 3.19446 9.75597 3.19446C5.87751 3.19446 2.7334 6.33857 2.7334 10.217C2.7334 14.0955 5.87751 17.2396 9.75597 17.2396Z"
                  stroke="black"
                  stroke-opacity="0.3"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18.5343 18.9953L14.7158 15.1767"
                  stroke="black"
                  stroke-opacity="0.3"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Tìm kiếm bạn bè bằng tên hoặc email"
                class="search-field"
              />
            </div>
            <q-btn class="search-btn" @click="searchUsers">Tìm kiếm</q-btn>
          </div>

          <!-- Search Results -->
          <div v-if="searchResults.length > 0" class="search-results">
            <div v-for="user in searchResults" :key="user.id" class="search-result-item">
              <div class="user-info">
                <div class="user-avatar">
                  <img :src="user.avatar" :alt="user.name" />
                </div>
                <div class="user-details">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-username">{{ user.username }}</div>
                </div>
              </div>
              <q-btn class="add-friend-btn" @click="sendFriendRequest(user.id)">
                Gửi lời mời
              </q-btn>
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

// Mock friend requests data
const friendRequests = ref([
  {
    id: 1,
    name: 'Người dùng A',
    username: '@nguoidungA',
    avatar: 'https://via.placeholder.com/55',
    mutualFriends: 3,
  },
  {
    id: 2,
    name: 'Người dùng B',
    username: '@nguoidungB',
    avatar: 'https://via.placeholder.com/55',
    mutualFriends: 5,
  },
  {
    id: 3,
    name: 'Người dùng C',
    username: '@nguoidungC',
    avatar: 'https://via.placeholder.com/55',
    mutualFriends: 2,
  },
])

// Search functionality
const searchQuery = ref('')
const searchResults = ref([])

const acceptRequest = (requestId) => {
  console.log('Accepting friend request:', requestId)
  friendRequests.value = friendRequests.value.filter((req) => req.id !== requestId)
}

const declineRequest = (requestId) => {
  console.log('Declining friend request:', requestId)
  friendRequests.value = friendRequests.value.filter((req) => req.id !== requestId)
}

const searchUsers = () => {
  // Mock search results
  if (searchQuery.value.trim()) {
    searchResults.value = [
      {
        id: 10,
        name: 'Kết quả tìm kiếm',
        username: '@ketqua',
        avatar: 'https://via.placeholder.com/55',
      },
    ]
  } else {
    searchResults.value = []
  }
}

const sendFriendRequest = (userId) => {
  console.log('Sending friend request to:', userId)
  // Remove from search results after sending request
  searchResults.value = searchResults.value.filter((user) => user.id !== userId)
}
</script>

<style scoped>
.add-friends-page {
  display: flex;
  min-height: 100vh;
  background: #ffffff;
  max-width: 100%;
  margin: 0 auto;
}

.add-friends-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.add-friends-content {
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
  margin: 0;
}

/* Friend Requests */
.friend-requests-list {
  margin-bottom: 40px;
}

.friend-request-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.request-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.friend-avatar,
.user-avatar {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e2e8f0;
}

.friend-avatar img,
.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.friend-details,
.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.friend-name,
.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #000;
}

.friend-username,
.user-username {
  font-size: 14px;
  color: #6b7280;
}

.mutual-friends {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.friendship-icon {
  opacity: 0.6;
}

.mutual-count {
  font-size: 12px;
  color: #6b7280;
}

.request-actions {
  display: flex;
  gap: 12px;
}

.accept-btn {
  background: #10b981;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.accept-btn:hover {
  background: #059669;
}

.decline-btn {
  background: #ef4444;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.decline-btn:hover {
  background: #dc2626;
}

/* Search Section */
.search-section {
  margin-top: 40px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #000;
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.search-input {
  position: relative;
  flex: 1;
  height: 48px;
}

.search-field {
  width: 100%;
  height: 100%;
  padding: 0 16px 0 44px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  color: #374151;
  outline: none;
  transition: all 0.2s ease;
}

.search-field:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-field::placeholder {
  color: #9ca3af;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
}

.search-btn {
  background: #2563eb;
  color: white;
  padding: 0 24px;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 48px;
}

.search-btn:hover {
  background: #1d4ed8;
}

/* Search Results */
.search-results {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.add-friend-btn {
  background: #2563eb;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-friend-btn:hover {
  background: #1d4ed8;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .add-friends-container {
    flex-direction: column;
  }

  .add-friends-content {
    padding: 16px;
  }

  .friend-request-item,
  .search-result-item {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .request-actions {
    width: 100%;
    justify-content: center;
  }

  .search-container {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .page-header {
    margin-bottom: 0px;
  }

  .page-title {
    font-size: 24px;
  }

  .section-title {
    font-size: 20px;
    margin: 0px;
  }

  .friend-request-item {
    padding: 16px;
  }

  .add-friends-content {
    width: 100%;
  }

  .friend-requests-list {
    margin-bottom: 0px;
  }

  .accept-btn,
  .decline-btn,
  .add-friend-btn {
    padding: 6px 12px;
    font-size: 14px;
  }

  .add-friends-page {
    padding: 0px !important;
  }

  .search-section {
    margin-top: 0;
  }

  .search-field {
    height: 30px;
  }
}
</style>
