rewards-pagerewards-page
<template>
  <q-page class="friends-page">
    <div class="friends-container">
      <!-- ProfileSidebar -->
      <ProfileSidebar />
      <!-- Main Content -->
      <div class="friends-content">
        <div class="page-header">
          <h1 class="page-title">Bạn bè</h1>
        </div>

        <!-- Search Bar -->
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
            <input type="text" placeholder="Tìm kiếm bạn bè" class="search-field" />
          </div>
        </div>

        <!-- Friends List -->
        <div class="friends-list">
          <div v-for="friend in friends" :key="friend.id" class="friend-item">
            <div class="friend-avatar">
              <img :src="friend.avatar" :alt="friend.name" />
              <div class="online-indicator"></div>
            </div>

            <div class="friend-info">
              <div class="friend-name">{{ friend.name }}</div>
              <div class="friend-username">{{ friend.username }}</div>
              <div class="friend-status">
                <svg
                  class="fire-icon"
                  width="11"
                  height="11"
                  viewBox="0 0 12 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.98088 0.500019C6.98088 2.73256 8.15792 3.85481 9.17185 4.92164C10.1417 5.94187 11.0649 6.91361 11.0649 8.76451C11.0649 11.795 8.70141 13.9601 5.67095 13.9601C2.63986 13.9601 0.0439453 11.8057 0.0439453 8.76451C0.0439453 7.48041 0.649785 6.2385 1.62404 5.67926C1.81612 5.56905 2.04725 5.68367 2.12975 5.8896C2.76015 7.4634 3.53729 7.43569 3.94034 7.03264C4.18469 6.78892 4.23633 6.32981 3.93782 5.73405C2.42322 2.70359 5.11109 0.520171 6.58286 0.158053C6.79447 0.106412 6.97017 0.282748 6.98088 0.500019ZM5.67095 13.0155C8.2272 13.0155 10.1203 11.2269 10.1203 8.76451C10.1203 7.29273 9.43195 6.56724 8.43376 5.51615L8.42054 5.50166C7.51367 4.5463 6.44368 3.3913 6.1225 1.37225C5.64698 1.6518 5.23667 2.0297 4.91901 2.48065C4.42338 3.20111 4.19666 4.13884 4.78298 5.31147C5.16273 6.07035 5.27231 7.03705 4.60853 7.70083C4.19477 8.11459 3.49887 8.39357 2.74692 8.06987C2.27334 7.86583 1.89484 7.46844 1.5894 6.94258C1.23232 7.3872 0.988603 8.03838 0.988603 8.76451C0.988603 11.1872 3.05929 13.0155 5.67095 13.0155Z"
                    fill="#FFFF00"
                  />
                </svg>
                <span class="status-text">{{ friend.streak }} ngày • {{ friend.status }}</span>
              </div>
            </div>

            <div class="friend-actions">
              <q-btn class="challenge-btn" color="primary">
                <svg
                  class="sword-icon"
                  width="22"
                  height="23"
                  viewBox="0 0 22 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.3479 19.506L14.5939 16.7574L12.6139 18.7374L12.3646 18.489C12.0886 18.213 11.9506 17.8719 11.9506 17.4657C11.9506 17.0595 12.0886 16.7184 12.3646 16.4424L16.0456 12.7614C16.3216 12.4854 16.6627 12.3474 17.0689 12.3474C17.4751 12.3474 17.8162 12.4854 18.0922 12.7614L18.3406 13.0107L16.3606 14.9907L19.1092 17.7447C19.255 17.8899 19.3279 18.0594 19.3279 18.2532C19.3279 18.447 19.255 18.6165 19.1092 18.7617L18.3649 19.506C18.2197 19.6512 18.0502 19.7238 17.8564 19.7238C17.6626 19.7238 17.4931 19.6512 17.3479 19.506ZM19.2928 5.80892L9.35499 15.7638L10.021 16.4253C10.297 16.7013 10.435 17.0424 10.435 17.4486C10.435 17.8548 10.297 18.1956 10.021 18.471L9.77169 18.7203L7.79169 16.7403L5.03769 19.4889C4.89249 19.6341 4.72299 19.7067 4.52919 19.7067C4.33539 19.7067 4.16589 19.6341 4.02069 19.4889L3.27639 18.7446C3.13119 18.5994 3.05859 18.4299 3.05859 18.2361C3.05859 18.0423 3.13119 17.8725 3.27639 17.7267L6.02499 14.9727L4.04499 12.9927L4.29429 12.7443C4.57029 12.4683 4.91109 12.3303 5.31669 12.3303C5.72289 12.3303 6.06399 12.4683 6.33999 12.7443L7.01859 13.4283L16.9735 3.48962H19.2928V5.80892ZM7.27059 10.0047L3.09279 5.80892V3.48962H5.41209L9.57279 7.66742L7.27059 10.0047Z"
                    fill="white"
                  />
                </svg>
                Thử thách
              </q-btn>

              <div class="menu-btn">•••</div>
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

// Mock friends data
const friends = ref([
  {
    id: 1,
    name: 'Người dùng',
    username: '@nguoidung',
    avatar: 'https://via.placeholder.com/55',
    streak: '15',
    status: 'Đang hoạt động',
  },
  {
    id: 2,
    name: 'Người dùng',
    username: '@nguoidung',
    avatar: 'https://via.placeholder.com/55',
    streak: '15',
    status: 'Đang hoạt động',
  },
  {
    id: 3,
    name: 'Người dùng',
    username: '@nguoidung',
    avatar: 'https://via.placeholder.com/55',
    streak: '15',
    status: 'Đang hoạt động',
  },
  {
    id: 4,
    name: 'Người dùng',
    username: '@nguoidung',
    avatar: 'https://via.placeholder.com/55',
    streak: '15',
    status: 'Đang hoạt động',
  },
  {
    id: 5,
    name: 'Người dùng',
    username: '@nguoidung',
    avatar: 'https://via.placeholder.com/55',
    streak: '15',
    status: 'Đang hoạt động',
  },
  {
    id: 6,
    name: 'Người dùng',
    username: '@nguoidung',
    avatar: 'https://via.placeholder.com/55',
    streak: '15',
    status: 'Đang hoạt động',
  },
])
</script>

<style scoped>
.friends-page {
  display: flex;
  min-height: 100vh;
  background: #ffffff;
  max-width: 100%;
  margin: 0 auto;
}

.friends-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.friends-content {
  flex: 1;
  padding: 20px 32px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  padding-top: 10px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #000;
  margin: 0;
}

.search-container {
  width: 100%;
  max-width: 895px;
}

.search-input {
  position: relative;
  width: 100%;
  height: 43px;
}

.search-field {
  width: 100%;
  height: 100%;
  padding: 0 32px 0 40px;
  border: 1px solid rgba(107, 114, 128, 0.3);
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  font-weight: 300;
  color: rgba(0, 0, 0, 0.5);
  outline: none;
}

.search-field::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.search-icon {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 21px;
  height: 21px;
}

.friends-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 895px;
}

.friend-item {
  display: flex;
  align-items: center;
  padding: 22px;
  background: #fff;
  border: 1px solid rgba(107, 114, 128, 0.3);
  border-radius: 8px;
  position: relative;
}

.friend-avatar {
  position: relative;
  margin-right: 18px;
}

.friend-avatar img {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: 1.6px solid #858597;
  object-fit: cover;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 9px;
  height: 9px;
  background: #24da67;
  border: 1px solid #fff;
  border-radius: 50%;
}

.friend-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.friend-name {
  font-size: 18px;
  font-weight: 500;
  color: #000;
  line-height: normal;
}

.friend-username {
  font-size: 16px;
  font-weight: 300;
  color: #000;
  line-height: normal;
}

.friend-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.fire-icon {
  width: 11px;
  height: 11px;
}

.status-text {
  font-size: 13px;
  font-weight: 400;
  color: #ffff00;
  line-height: 180%;
}

.friend-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.challenge-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #2563eb;
  color: #fff;
  border-radius: 5px;
  font-size: 15px;
  font-weight: 700;
  height: 36px;
  min-width: 143px;
}

.sword-icon {
  width: 22px;
  height: 22px;
}

.menu-btn {
  font-size: 18px;
  color: #ffff00;
  cursor: pointer;
  padding: 4px 8px;
  line-height: 180%;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .friends-container {
    flex-direction: column;
  }

  .friends-content {
    width: 100%;
    padding: 16px;
  }

  .page-title {
    font-size: 32px;
  }

  .friend-item {
    padding: 16px;
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .friend-actions {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }

  .challenge-btn {
    flex: 1;
    max-width: 200px;
  }
}

@media (max-width: 768px) {
  .friends-page {
    padding: 0px !important;
  }

  .friends-content {
    width: 100%;
  }
}
</style>
