# Multi-stage build for production deployment
FROM node:18-alpine AS frontend-builder

# Install frontend dependencies and build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Backend runtime stage
FROM node:18-alpine AS runtime

# Install basic tools
RUN apk add --no-cache python3 make g++ bash

# Set working directory
WORKDIR /app

# Copy and install backend dependencies
COPY backend/package.json backend/
WORKDIR /app/backend

# Install dependencies without using ci (to avoid lock file issues)
RUN npm install --production --no-optional

# Copy backend source
COPY backend/ .

# Try to setup database (non-blocking)
RUN npm run db:migrate:node || true
RUN npm run db:seed:node || true

# Copy frontend build
COPY --from=frontend-builder /app/dist ./public

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start:node"]
