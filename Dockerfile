# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Set npm config to avoid warnings and optimize
RUN npm config set fund false && \
    npm config set audit false

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with optimizations
RUN npm ci --omit=dev --omit=optional --no-audit --no-fund --maxsockets 1

# Copy source code
COPY . .

# Build the application with memory limit
ENV NODE_OPTIONS="--max-old-space-size=1024"
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built files from builder stage
COPY --from=builder /app/dist/spa /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
