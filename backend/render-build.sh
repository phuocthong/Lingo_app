#!/bin/bash
set -e

echo "Starting Render build for backend..."

# Remove any existing lock files
rm -f package-lock.json
rm -f yarn.lock

# Clear npm cache
npm cache clean --force

# Install dependencies without creating lock file
npm install --no-package-lock --production

# Try to setup database
npm run db:migrate:node || echo "Migration failed, continuing..."
npm run db:seed:node || echo "Seeding failed, continuing..."

echo "Backend build complete!"
