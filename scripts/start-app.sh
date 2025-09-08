#!/bin/bash

# School Management App Startup Script
# This script ensures the backend is running before starting the frontend

set -e  # Exit on any error

echo "🚀 Starting School Management App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_error "PM2 is not installed. Installing PM2 globally..."
    npm install -g pm2
    if [ $? -ne 0 ]; then
        print_error "Failed to install PM2. Please install it manually: npm install -g pm2"
        exit 1
    fi
    print_success "PM2 installed successfully"
fi

# Check if concurrently is installed
if [ ! -d "node_modules/concurrently" ]; then
    print_status "Installing concurrently..."
    npm install
fi

# Navigate to backend directory
cd backend

# Check if backend dependencies are installed
if [ ! -d "node_modules" ]; then
    print_status "Installing backend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    print_success "Backend dependencies installed"
fi

# Stop any existing PM2 processes for this app
print_status "Stopping any existing backend processes..."
pm2 stop school-management-server 2>/dev/null || true
pm2 delete school-management-server 2>/dev/null || true

# Start the backend with PM2
print_status "Starting backend server..."
pm2 start ecosystem.config.js

# Wait for backend to be ready
print_status "Waiting for backend to be ready..."
sleep 3

# Check if backend is running
if pm2 list | grep -q "school-management-server.*online"; then
    print_success "Backend server is running on port 3001"
else
    print_error "Backend server failed to start"
    pm2 logs school-management-server --lines 20
    exit 1
fi

# Go back to root directory
cd ..

# Start the frontend
print_status "Starting frontend..."
print_success "Both backend and frontend are now running!"
print_status "Backend: http://localhost:3001"
print_status "Frontend: Check your Expo CLI for the frontend URL"
print_status ""
print_status "To stop the backend: npm run backend:stop"
print_status "To view backend logs: npm run backend:logs"
print_status "To restart backend: npm run backend:restart"
print_status ""

# Start Expo
expo start
