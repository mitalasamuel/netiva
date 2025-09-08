#!/bin/bash

# Auto-start script for School Management App
# This script ensures the backend is running when you open the project

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[AUTO-START]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if PM2 is available
if ! command -v pm2 &> /dev/null; then
    print_warning "PM2 not found. Installing PM2 globally..."
    npm install -g pm2
fi

# Check if backend is already running
if pm2 list | grep -q "school-management-server.*online"; then
    print_success "Backend server is already running"
    exit 0
fi

print_status "Starting backend server automatically..."

# Navigate to backend directory
cd backend

# Check if backend dependencies are installed
if [ ! -d "node_modules" ]; then
    print_status "Installing backend dependencies..."
    npm install
fi

# Start the backend with PM2
pm2 start ecosystem.config.js

# Wait a moment for the server to start
sleep 2

# Check if backend started successfully
if pm2 list | grep -q "school-management-server.*online"; then
    print_success "Backend server started successfully on port 3001"
else
    print_warning "Backend server may not have started properly. Check logs with: npm run backend:logs"
fi

# Go back to root directory
cd ..

print_status "Backend auto-start completed. You can now start the frontend with: npm start"
