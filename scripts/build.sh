#!/bin/bash

# School Management App Build Script
# This script helps build the app for iOS and Android

set -e

echo "🚀 School Management App Build Script"
echo "======================================"

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

# Check if EAS CLI is installed
check_eas_cli() {
    if ! command -v eas &> /dev/null; then
        print_error "EAS CLI is not installed. Installing now..."
        npm install -g @expo/eas-cli
        print_success "EAS CLI installed successfully"
    else
        print_success "EAS CLI is already installed"
    fi
}

# Check if user is logged in to EAS
check_eas_login() {
    if ! eas whoami &> /dev/null; then
        print_warning "You are not logged in to EAS. Please login:"
        eas login
    else
        print_success "Logged in to EAS"
    fi
}

# Build for iOS
build_ios() {
    print_status "Building for iOS..."
    eas build --platform ios --profile production
    print_success "iOS build completed"
}

# Build for Android
build_android() {
    print_status "Building for Android..."
    eas build --platform android --profile production
    print_success "Android build completed"
}

# Build for both platforms
build_all() {
    print_status "Building for both platforms..."
    eas build --platform all --profile production
    print_success "Build completed for both platforms"
}

# Show help
show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  ios       Build for iOS only"
    echo "  android   Build for Android only"
    echo "  all       Build for both platforms"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 ios        # Build for iOS"
    echo "  $0 android    # Build for Android"
    echo "  $0 all        # Build for both platforms"
}

# Main script logic
main() {
    case "${1:-help}" in
        ios)
            check_eas_cli
            check_eas_login
            build_ios
            ;;
        android)
            check_eas_cli
            check_eas_login
            build_android
            ;;
        all)
            check_eas_cli
            check_eas_login
            build_all
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Invalid option: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
