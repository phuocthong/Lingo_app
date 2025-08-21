# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json ./

# Clear npm cache and install dependencies
RUN npm cache clean --force
RUN npm install --production --no-optional --legacy-peer-deps

# Copy source code
COPY . .

# Generate and migrate database
RUN npm run db:generate:npm || true
RUN npm run db:migrate:node || true

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start:node"]
