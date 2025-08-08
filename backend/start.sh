#!/bin/bash

echo "🚀 Khởi động Lingo Challenge Backend Server"
echo "============================================"

# Check if bun is available
if command -v bun &> /dev/null; then
    echo "✅ Phát hiện Bun runtime"
    RUNTIME="bun"
else
    echo "✅ Sử dụng Node.js runtime"
    RUNTIME="npm"
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Tạo file .env từ template..."
    cp .env.example .env
fi

# Install dependencies
echo "📦 Cài đặt dependencies..."
if [ "$RUNTIME" = "bun" ]; then
    bun install
else
    npm install
fi

# Generate database migrations
echo "🗄️  Tạo database migrations..."
if [ "$RUNTIME" = "bun" ]; then
    bun run db:generate
else
    npm run db:generate
fi

# Run migrations
echo "🔧 Chạy database migrations..."
if [ "$RUNTIME" = "bun" ]; then
    bun run db:migrate
else
    npm run db:migrate
fi

# Seed database
echo "🌱 Seed database với dữ liệu mẫu..."
if [ "$RUNTIME" = "bun" ]; then
    bun run db:seed
else
    npm run db:seed
fi

# Start server
echo "🚀 Khởi động server..."
echo ""
echo "📋 Server sẽ chạy tại: http://localhost:3001"
echo "📚 API Documentation: http://localhost:3001/swagger"
echo ""
echo "🧪 Tài khoản demo:"
echo "   - Username: admin, Password: password123"
echo "   - Username: minhanh, Password: password123"
echo "   - Username: thanhhoa, Password: password123"
echo ""

if [ "$RUNTIME" = "bun" ]; then
    bun run dev
else
    npm run dev
fi
