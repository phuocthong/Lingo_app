# Use Node.js LTS as base image
FROM node:20-alpine AS base

# Install necessary dependencies
RUN apk add --no-cache libc6-compat sqlite

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci --only=production

# Copy backend source
COPY backend ./backend

# Copy frontend source
COPY . .

# Build frontend
RUN npm run build

# Set up database
WORKDIR /app/backend
RUN npm run db:migrate && npm run db:seed

# Expose port
EXPOSE 3000

# Start the application
WORKDIR /app
CMD ["npm", "run", "backend:dev:npm"]
