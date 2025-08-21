#!/bin/bash
set -e

echo "Deploying Lingo Challenge to Render..."

# Backend setup
echo "Setting up backend..."
cd backend
rm -f package-lock.json
npm install
npm run db:migrate || true
npm run db:seed || true
cd ..

# Frontend setup
echo "Building frontend..."
npm install
npm run build

echo "Deployment preparation complete!"
