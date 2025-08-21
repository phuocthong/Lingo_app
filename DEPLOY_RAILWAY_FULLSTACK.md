# 🚀 Deploy Fullstack Lingo Challenge lên Railway

## Tổng quan

Ứng dụng này đã được cấu hình để deploy như một **single container** chứa cả frontend và backend, giúp đơn giản hóa quá trình deploy và quản lý.

## 🏗️ Cấu trúc Deploy

- **Frontend**: Quasar Vue.js app (build thành static files)
- **Backend**: Bun/Node.js API server
- **Database**: SQLite (tự động migrate và seed)
- **Web Server**: Nginx (serve frontend + proxy API)
- **Container**: Một Docker container duy nhất

## 📋 Hướng dẫn Deploy

### Bước 1: Chuẩn bị Repository

1. Đảm bảo tất cả code đã được commit và push lên GitHub
2. Kiểm tra file `railway.json` đã được cấu hình đúng

### Bước 2: Tạo Project trên Railway

1. Truy cập [railway.app](https://railway.app)
2. Đăng nhập và click **"New Project"**
3. Chọn **"Deploy from GitHub repo"**
4. Chọn repository của bạn
5. Railway sẽ tự động detect `railway.json` và sử dụng `Dockerfile.fullstack`

### Bước 3: Cấu hình Environment Variables

Trong Railway dashboard, thêm các environment variables sau:

```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-123456789
CORS_ORIGIN=*
DATABASE_URL=./lingo-challenge.db
```

### Bước 4: Deploy và Kiểm tra

1. Railway sẽ tự động build và deploy
2. Quá trình build sẽ:
   - Build frontend Quasar app
   - Setup backend với Bun
   - Cấu hình Nginx để serve frontend và proxy API
   - Chạy database migration và seeding

3. Kiểm tra deployment:
   - **Health check**: `https://your-app.railway.app/health`
   - **Frontend**: `https://your-app.railway.app`
   - **API**: `https://your-app.railway.app/api/`

## 🔧 Cấu trúc Routing

Nginx được cấu hình để:

- **`/`**: Serve frontend static files (Quasar SPA)
- **`/api/*`**: Proxy tới backend server (port 3000)
- **`/health`**: Health check endpoint

## 🐳 Test Local với Docker

Để test deployment locally:

```bash
# Build Docker image
npm run docker:build

# Run container
npm run docker:run

# Truy cập app tại http://localhost
```

## 🛠️ Development

Để phát triển local:

```bash
# Setup ban đầu
npm run setup

# Chạy fullstack development
npm run dev:fullstack

# Hoặc chạy riêng biệt
npm run dev:full
```

## 📊 Monitoring và Logs

Trong Railway dashboard:

1. **Logs**: Xem logs real-time của cả frontend và backend
2. **Metrics**: Monitor CPU, memory, network usage
3. **Database**: SQLite database persist trong Railway volume

## 🔒 Security Notes

1. **JWT_SECRET**: Đổi thành giá trị an toàn trong production
2. **CORS**: Cấu hình CORS_ORIGIN cụ thể nếu cần thiết
3. **Database**: SQLite data được persist, backup định kỳ nếu cần

## 🚨 Troubleshooting

### Build Fails

- Kiểm tra logs trong Railway dashboard
- Đảm bảo `index.html` và `quasar.config.js` tồn tại
- Verify tất cả dependencies trong `package.json`

### App không load

- Kiểm tra health endpoint: `/health`
- Xem logs để debug
- Verify environment variables

### API không hoạt động

- Kiểm tra backend logs
- Verify database migration đã chạy thành công
- Test API endpoints trực tiếp: `/api/health`

### Database Issues

- Railway volume persist SQLite database
- Logs sẽ hiển thị migration và seeding status
- Database tự động tạo nếu không tồn tại

## 🎯 Production Ready

Deployment này đã sẵn sàng cho production với:

- ✅ Multi-stage Docker build optimization
- ✅ Nginx serving static assets với caching
- ✅ Health checks và monitoring
- ✅ Database auto-migration
- ✅ Security headers
- ✅ Gzip compression
- ✅ Process management

## 📞 Support

Nếu gặp vấn đề:

1. Kiểm tra Railway logs
2. Verify environment variables
3. Test local với Docker
4. Liên hệ support nếu cần thiết
