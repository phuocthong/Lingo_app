# Use Bun official runtime image
FROM oven/bun:1.1.34-alpine AS base

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json bun.lock* ./

# Install dependencies with production flag
RUN bun install --frozen-lockfile --production

# Copy source code
COPY . .

# Create database directory
RUN mkdir -p /app/data

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=./lingo-challenge.db

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Create a startup script that handles DB setup
RUN echo '#!/bin/sh\nif [ ! -f "./lingo-challenge.db" ]; then\n  echo "Setting up database..."\n  bun run db:migrate\n  bun run db:seed\nfi\necho "Starting server..."\nexec bun run src/index.js' > /app/start.sh && \
    chmod +x /app/start.sh

# Start the application
CMD ["/app/start.sh"]
