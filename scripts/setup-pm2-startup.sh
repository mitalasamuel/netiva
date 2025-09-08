#!/bin/bash

# Setup PM2 to start automatically on system boot
# This script configures PM2 to automatically start the backend server

set -e

echo "🔧 Setting up PM2 startup configuration..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_status "PM2 is not installed. Installing PM2 globally..."
    npm install -g pm2
    print_success "PM2 installed successfully"
fi

# Generate PM2 startup script
print_status "Generating PM2 startup script..."
pm2 startup

# Save current PM2 processes
print_status "Saving current PM2 process list..."
pm2 save

print_success "PM2 startup configuration completed!"
print_status "The backend server will now start automatically when your system boots up."
print_status "To disable auto-startup, run: pm2 unstartup"
