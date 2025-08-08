# 🚀 Hướng Dẫn Khởi Chạy Ứng Dụng Lingo Challenge

Ứng dụng học t�� vựng tiếng Anh với chat bot thời gian thực và tính năng thách đấu!

## 📋 Yêu Cầu Hệ Thống

- **Node.js** 18+ hoặc **Bun** 1.0+
- **npm** hoặc **yarn** hoặc **bun**
- **Git** (để clone repository)

## 🎯 Khởi Chạy Nhanh

### Bước 1: Khởi chạy Backend API

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install
# hoặc nếu có Bun:
# bun install

# Tạo file environment
cp .env.example .env

# Tạo database schema
npm run db:generate

# Chạy migrations
npm run db:migrate

# Seed dữ liệu mẫu (users, vocabulary, questions, etc.)
npm run db:seed

# Khởi động backend server
npm run dev
```

**Backend sẽ chạy tại:** `http://localhost:3001`  
**API Documentation:** `http://localhost:3001/swagger`

### Bước 2: Khởi chạy Frontend

Mở terminal mới:

```bash
# Di chuyển về thư mục gốc
cd ..

# Cài đặt dependencies (nếu chưa có)
npm install

# Khởi động frontend
npm run dev
```

**Frontend sẽ chạy tại:** `http://localhost:9000`

## 🎮 Sử Dụng Ứng Dụng

### 1. Đăng Nhập

Truy cập `http://localhost:9000` và đăng nhập bằng:

**Tài khoản demo:**

- **Admin**: `admin` / `password123`
- **Minh Anh**: `minhanh` / `password123`
- **Thành Hòa**: `thanhhoa` / `password123`

### 2. Tính Năng Chính

#### 🤖 Chat Bot Thời Gian Thực

- Nhấn **"Bắt đầu"** để chat bot bắt đầu đưa ra câu hỏi
- Bot sẽ tự động hỏi mỗi 30-60 giây
- Trả lời câu hỏi và xem kết quả ngay lập tức
- Theo dõi lịch sử câu hỏi và thống kê

#### 🏆 Bảng Xếp Hạng

- Xem top players theo tuần/tháng/năm
- So sánh điểm XP và độ chính xác
- Theo dõi hạng của bạn

#### 👥 Quản Lý Bạn Bè

- Tìm kiếm và kết bạn
- Thách đấu với bạn bè
- Xem hoạt động của bạn bè

#### 🎯 Thử Thách Multiplayer

- Tạo phòng thách đấu
- Tham gia phòng của người khác
- Thi đấu real-time

#### 🏅 Hệ Thống Nhiệm Vụ

- Hoàn thành task hàng ngày
- Nhận XP và phần thưởng
- Mở khóa achievement

#### 🎁 Cửa Hàng Phần Thưởng

- Đổi XP lấy voucher
- Mua premium features
- Unlock nội dung đặc biệt

## 🔧 Tùy Chỉnh

### Environment Variables

Chỉnh sửa file `backend/.env`:

```env
PORT=3001                    # Port của backend
JWT_SECRET=your-secret-key   # JWT secret key
NODE_ENV=development         # Environment mode
```

### API Base URL

N��u backend chạy trên port khác, cập nhật `src/services/api.js`:

```javascript
const API_BASE = 'http://localhost:YOUR_PORT/api'
```

## 📊 Database Management

### Xem Database

```bash
cd backend
npm run db:studio
```

### Reset Database

```bash
cd backend
rm lingo-challenge.db
npm run db:migrate
npm run db:seed
```

### Backup Database

```bash
cd backend
cp lingo-challenge.db lingo-challenge-backup.db
```

## 🌐 Deploy Production

### Backend Deployment

**Railway/Render:**

1. Push code lên GitHub
2. Connect repository tại Railway/Render
3. Set environment variables
4. Deploy tự động

**Vercel:**

```bash
cd backend
vercel --prod
```

**Docker:**

```bash
cd backend
docker build -t lingo-backend .
docker run -p 3001:3001 lingo-backend
```

### Frontend Deployment

**Netlify/Vercel:**

```bash
npm run build
# Upload dist/ folder
```

**GitHub Pages:**

```bash
npm run build
# Push dist/ to gh-pages branch
```

## 🐛 Troubleshooting

### Backend không khởi động được

1. **Kiểm tra port:** Đảm bảo port 3001 không bị chiếm
2. **Dependencies:** Chạy lại `npm install`
3. **Database:** Reset database nếu có lỗi migration
4. **Node version:** Đảm bảo Node.js 18+

### Frontend không kết nối Backend

1. **CORS:** Kiểm tra backend đã khởi động
2. **API URL:** Xác nhận đúng port trong `api.js`
3. **Network:** Check developer tools cho lỗi network

### Database lỗi

```bash
cd backend
rm lingo-challenge.db
npm run db:generate
npm run db:migrate
npm run db:seed
```

## 📝 Development Notes

### Thêm Vocabulary Mới

Chỉnh sửa `backend/src/scripts/seed.js` và chạy:

```bash
npm run db:seed
```

### Thêm API Endpoint

1. Tạo route trong `backend/src/routes/`
2. Import vào `backend/src/index.js`
3. Thêm function vào `src/services/api.js`

### Thêm Tính Năng Frontend

1. Tạo component trong `src/components/`
2. Thêm route trong `src/router/routes.js`
3. Integrate với API service

## 🎉 Features Hoàn Thành

### ✅ Backend API

- JWT Authentication
- User Management
- Vocabulary & Questions
- Real-time Chat Bot
- Leaderboard System
- Friend Management
- Rewards & Transactions
- Progress Tracking
- Auto-generated API docs

### ✅ Frontend

- Modern Vue 3 + Quasar UI
- Real-time Chat Interface
- Dynamic Leaderboard
- API Integration
- Error Handling & Notifications
- Responsive Design
- Demo Mode (works without backend)

### ✅ Database

- SQLite với Drizzle ORM
- Auto-migrations
- Seed data
- Backup/restore

## 🚀 Tính Năng Sắp Tới

- [ ] WebSocket cho real-time multiplayer
- [ ] Voice pronunciation check
- [ ] AI-powered question generation
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Social media integration

## 🆘 Hỗ Trợ

- **Documentation:** Đọc file README.md
- **API Docs:** http://localhost:3001/swagger
- **Issues:** Tạo GitHub issue nếu gặp bug
- **Questions:** Mở GitHub discussion

---

**Chúc bạn học tiếng Anh vui vẻ! 🎯📚**
