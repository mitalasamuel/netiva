#!/bin/bash

# Android Setup Script for School Management App
# This script helps set up Android development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[ANDROID SETUP]${NC} $1"
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

print_status "Setting up Android Development Environment..."

# Check if Android Studio is installed
if [ -d "/Applications/Android Studio.app" ]; then
    print_success "Android Studio found"
else
    print_error "Android Studio not found!"
    print_warning "Please install Android Studio first:"
    print_warning "1. Go to https://developer.android.com/studio"
    print_warning "2. Download and install Android Studio"
    print_warning "3. Run this script again"
    exit 1
fi

# Check if Android SDK exists
if [ -d "$HOME/Library/Android/sdk" ]; then
    print_success "Android SDK found"
else
    print_warning "Android SDK not found. Please install it through Android Studio:"
    print_warning "1. Open Android Studio"
    print_warning "2. Go to Tools → SDK Manager"
    print_warning "3. Install Android SDK Platform 33 and 34"
    print_warning "4. Install Android SDK Build-Tools"
    print_warning "5. Install Android Emulator"
    exit 1
fi

# Set up environment variables
print_status "Setting up environment variables..."

# Create .zshrc if it doesn't exist
touch ~/.zshrc

# Add Android SDK to .zshrc
if ! grep -q "ANDROID_HOME" ~/.zshrc; then
    echo '' >> ~/.zshrc
    echo '# Android SDK' >> ~/.zshrc
    echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
    echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.zshrc
    echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
    echo 'export PATH=$PATH:$ANDROID_HOME/tools' >> ~/.zshrc
    echo 'export PATH=$PATH:$ANDROID_HOME/tools/bin' >> ~/.zshrc
    print_success "Environment variables added to ~/.zshrc"
else
    print_success "Environment variables already configured"
fi

# Set environment variables for current session
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# Verify installation
print_status "Verifying installation..."

if command -v adb &> /dev/null; then
    print_success "ADB found: $(adb version | head -n1)"
else
    print_error "ADB not found. Please check your Android SDK installation."
    exit 1
fi

if [ -d "$ANDROID_HOME/platforms" ]; then
    print_success "Android platforms found"
    ls -la "$ANDROID_HOME/platforms" | grep "android-"
else
    print_warning "No Android platforms found. Please install them through Android Studio."
fi

if [ -d "$ANDROID_HOME/build-tools" ]; then
    print_success "Android build tools found"
    ls -la "$ANDROID_HOME/build-tools"
else
    print_warning "No Android build tools found. Please install them through Android Studio."
fi

print_success "Android setup complete!"
print_status "Please restart your terminal and run: npm run android"
print_status "Or use EAS Build for cloud builds: npm run build:android"

print_warning "If you still have issues, try:"
print_warning "1. Restart your terminal"
print_warning "2. Run: source ~/.zshrc"
print_warning "3. Check: echo \$ANDROID_HOME"
print_warning "4. Use EAS Build instead: npm run build:android"
