#!/bin/bash
set -e

echo "Starting Render build for backend..."

# Remove existing lock file to avoid conflicts
rm -f package-lock.json

# Install dependencies with legacy peer deps to avoid conflicts
npm install --legacy-peer-deps --production

# Try to setup database
npm run db:migrate:node || echo "Migration failed, continuing..."
npm run db:seed:node || echo "Seeding failed, continuing..."

echo "Backend build complete!"
