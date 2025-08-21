# Railway Deployment Guide

## Cấu trúc Deploy

Ứng dụng này được cấu hình để deploy 2 services riêng biệt trên Railway:

### 1. Backend Service (lingo-challenge-backend)

- **Path**: `backend/`
- **Dockerfile**: `backend/Dockerfile`
- **Port**: 3000
- **Runtime**: Bun
- **Database**: SQLite (sẽ tự động migrate và seed)

### 2. Frontend Service (lingo-challenge-frontend)

- **Path**: root directory
- **Dockerfile**: `Dockerfile`
- **Port**: 80
- **Runtime**: Nginx (serving static files)

## Cách Deploy

### Bước 1: Tạo Project mới trên Railway

1. Đăng nhập vào [railway.app](https://railway.app)
2. Tạo project mới
3. Connect với GitHub repository

### Bước 2: Cấu hình Environment Variables

#### Cho Backend Service:

```
PORT=3000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=https://your-frontend-domain.railway.app
DATABASE_URL=./lingo-challenge.db
```

#### Cho Frontend Service:

```
VITE_API_URL=https://your-backend-domain.railway.app/api
NODE_ENV=production
```

### Bước 3: Deploy Services

Railway sẽ tự động:

1. Đọc file `railway.toml`
2. Build 2 services từ 2 Dockerfile riêng biệt
3. Deploy cả 2 services

### Bước 4: Cấu hình Domain (Optional)

1. Trong Railway dashboard, vào mỗi service
2. Cấu hình custom domain hoặc sử dụng Railway domain
3. Cập nhật environment variables cho đúng domain

## Lưu ý quan trọng

1. **Database**: Backend sử dụng SQLite, dữ liệu sẽ persist trong Railway volume
2. **CORS**: Cần cấu hình đúng frontend domain trong backend
3. **Environment Variables**: Thay đổi JWT_SECRET trong production
4. **Health Checks**: Cả 2 services đều có health check endpoints

## Troubleshooting

### Backend không start

- Kiểm tra environment variables
- Xem logs để debug database migration

### Frontend không kết nối được backend

- Kiểm tra VITE_API_URL trong frontend environment
- Kiểm tra CORS_ORIGIN trong backend environment

### Database issues

- Railway sẽ tự động chạy migration và seed
- Nếu có lỗi, check logs của backend service
