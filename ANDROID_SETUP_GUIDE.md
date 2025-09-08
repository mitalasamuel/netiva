# 🤖 Android Development Setup Guide
## Complete Solution for Android SDK and Development Environment

### 🚨 **Current Issue**
The error you're seeing indicates that the Android SDK is not installed or properly configured:
```
Failed to resolve the Android SDK path. Default install location not found: /Users/mitala/Library/Android/sdk
Error: spawn adb ENOENT
```

---

## 🛠️ **Solution 1: Install Android Studio (Recommended)**

### **Step 1: Download Android Studio**
1. Go to [Android Studio Download](https://developer.android.com/studio)
2. Download Android Studio for macOS
3. Install the `.dmg` file

### **Step 2: Install Android Studio**
1. Open the downloaded `.dmg` file
2. Drag Android Studio to Applications folder
3. Launch Android Studio from Applications
4. Follow the setup wizard

### **Step 3: Install Android SDK**
1. In Android Studio, go to **Tools** → **SDK Manager**
2. Install the following:
   - **Android SDK Platform 33** (API Level 33)
   - **Android SDK Platform 34** (API Level 34)
   - **Android SDK Build-Tools 33.0.0**
   - **Android SDK Build-Tools 34.0.0**
   - **Android Emulator**
   - **Android SDK Platform-Tools**

### **Step 4: Set Environment Variables**
Add these lines to your `~/.zshrc` file:

```bash
# Android SDK
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

### **Step 5: Reload Shell Configuration**
```bash
source ~/.zshrc
```

---

## 🚀 **Solution 2: Quick Setup with Homebrew (Alternative)**

### **Step 1: Install Android SDK via Homebrew**
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Android SDK
brew install --cask android-studio

# Install Android SDK tools
brew install android-sdk
```

### **Step 2: Set Environment Variables**
```bash
# Add to ~/.zshrc
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/tools' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/tools/bin' >> ~/.zshrc

# Reload configuration
source ~/.zshrc
```

---

## 🔧 **Solution 3: Manual SDK Installation**

### **Step 1: Create Android Directory**
```bash
mkdir -p ~/Library/Android/sdk
```

### **Step 2: Download Command Line Tools**
1. Go to [Android Command Line Tools](https://developer.android.com/studio#command-tools)
2. Download "Command line tools only" for macOS
3. Extract to `~/Library/Android/sdk/cmdline-tools/latest/`

### **Step 3: Install SDK Components**
```bash
# Set temporary environment variable
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# Accept licenses
yes | sdkmanager --licenses

# Install required components
sdkmanager "platform-tools" "platforms;android-33" "platforms;android-34" "build-tools;33.0.0" "build-tools;34.0.0" "emulator"
```

---

## ✅ **Verification Steps**

### **Step 1: Check Android SDK Installation**
```bash
# Check ANDROID_HOME
echo $ANDROID_HOME

# Check adb
adb version

# Check SDK components
ls $ANDROID_HOME/platforms
ls $ANDROID_HOME/build-tools
```

### **Step 2: Test React Native Android**
```bash
# Navigate to your project
cd /Users/mitala/Documents/SchoolManagementApp

# Test Android build
npm run android
```

---

## 🎯 **Quick Fix Script**

I'll create a script to automatically set up the Android environment:

```bash
#!/bin/bash
# Android Setup Script

echo "🤖 Setting up Android Development Environment..."

# Check if Android Studio is installed
if [ -d "/Applications/Android Studio.app" ]; then
    echo "✅ Android Studio found"
else
    echo "❌ Android Studio not found. Please install it first."
    echo "Download from: https://developer.android.com/studio"
    exit 1
fi

# Set up environment variables
echo "🔧 Setting up environment variables..."

# Create .zshrc if it doesn't exist
touch ~/.zshrc

# Add Android SDK to .zshrc
if ! grep -q "ANDROID_HOME" ~/.zshrc; then
    echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
    echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.zshrc
    echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
    echo 'export PATH=$PATH:$ANDROID_HOME/tools' >> ~/.zshrc
    echo 'export PATH=$PATH:$ANDROID_HOME/tools/bin' >> ~/.zshrc
    echo "✅ Environment variables added to ~/.zshrc"
else
    echo "✅ Environment variables already configured"
fi

# Reload shell configuration
source ~/.zshrc

echo "🎉 Android setup complete!"
echo "Please restart your terminal and run: npm run android"
```

---

## 🚨 **Troubleshooting Common Issues**

### **Issue 1: "adb: command not found"**
**Solution**: Add Android SDK platform-tools to PATH
```bash
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### **Issue 2: "Android SDK not found"**
**Solution**: Set ANDROID_HOME environment variable
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
```

### **Issue 3: "No Android SDK found"**
**Solution**: Install Android SDK through Android Studio
1. Open Android Studio
2. Go to Tools → SDK Manager
3. Install Android SDK Platform 33 and 34

### **Issue 4: "Emulator not found"**
**Solution**: Install Android Emulator
```bash
sdkmanager "emulator"
```

---

## 📱 **Alternative: Use EAS Build Instead**

If you don't want to set up local Android development, you can use EAS Build for cloud builds:

### **Step 1: Install EAS CLI**
```bash
npm install -g @expo/eas-cli
```

### **Step 2: Login to Expo**
```bash
eas login
```

### **Step 3: Build for Android**
```bash
# Build for Android (cloud build)
npm run build:android

# This will build in the cloud and you can download the APK/AAB
```

---

## 🎯 **Recommended Approach**

For your School Management App, I recommend:

1. **Install Android Studio** (Solution 1) - Most reliable
2. **Set up environment variables** properly
3. **Test with EAS Build** for production builds
4. **Use local emulator** for development

---

## 🚀 **Next Steps After Setup**

1. **Install Android Studio** following Solution 1
2. **Set up environment variables**
3. **Test the setup** with `npm run android`
4. **Build for production** with `npm run build:android`

---

## 📞 **Need Help?**

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Restart your terminal after making changes
4. Use EAS Build as an alternative for production builds

**Your app will work perfectly once the Android SDK is properly installed!** 🚀
