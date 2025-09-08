#!/usr/bin/env node

/**
 * Store Readiness Verification Script
 * Checks if the app is ready for App Store and Google Play Store submission
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description}`, 'red');
    return false;
  }
}

function checkDirectory(dirPath, description) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description}`, 'red');
    return false;
  }
}

function checkJsonFile(filePath, description, requiredFields = []) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    
    let allFieldsPresent = true;
    requiredFields.forEach(field => {
      if (!json[field]) {
        log(`❌ ${description} - Missing field: ${field}`, 'red');
        allFieldsPresent = false;
      }
    });
    
    if (allFieldsPresent) {
      log(`✅ ${description}`, 'green');
      return true;
    }
    return false;
  } catch (error) {
    log(`❌ ${description} - Invalid JSON: ${error.message}`, 'red');
    return false;
  }
}

function main() {
  log('🚀 School Management App - Store Readiness Check', 'bright');
  log('================================================', 'bright');
  
  let allChecksPassed = true;
  
  // Check project structure
  log('\n📁 Project Structure:', 'cyan');
  allChecksPassed &= checkDirectory('./ios', 'iOS folder exists');
  allChecksPassed &= checkDirectory('./android', 'Android folder exists');
  allChecksPassed &= checkDirectory('./components', 'Components folder exists');
  allChecksPassed &= checkDirectory('./backend', 'Backend folder exists');
  allChecksPassed &= checkDirectory('./assets', 'Assets folder exists');
  
  // Check configuration files
  log('\n⚙️  Configuration Files:', 'cyan');
  allChecksPassed &= checkFile('./app.json', 'app.json exists');
  allChecksPassed &= checkFile('./eas.json', 'eas.json exists');
  allChecksPassed &= checkFile('./package.json', 'package.json exists');
  
  // Check app.json configuration
  log('\n📱 App Configuration:', 'cyan');
  try {
    const appJson = JSON.parse(fs.readFileSync('./app.json', 'utf8'));
    const expo = appJson.expo;
    
    // Check required fields
    const requiredFields = ['name', 'slug', 'version', 'icon', 'ios', 'android'];
    requiredFields.forEach(field => {
      if (expo[field]) {
        log(`✅ ${field}: ${expo[field]}`, 'green');
      } else {
        log(`❌ Missing required field: ${field}`, 'red');
        allChecksPassed = false;
      }
    });
    
    // Check iOS configuration
    if (expo.ios) {
      log(`✅ iOS Bundle ID: ${expo.ios.bundleIdentifier || 'Not set'}`, 'green');
      log(`✅ iOS Build Number: ${expo.ios.buildNumber || 'Not set'}`, 'green');
    }
    
    // Check Android configuration
    if (expo.android) {
      log(`✅ Android Package: ${expo.android.package || 'Not set'}`, 'green');
      log(`✅ Android Version Code: ${expo.android.versionCode || 'Not set'}`, 'green');
    }
    
  } catch (error) {
    log(`❌ Error reading app.json: ${error.message}`, 'red');
    allChecksPassed = false;
  }
  
  // Check iOS specific files
  log('\n🍎 iOS Specific:', 'cyan');
  allChecksPassed &= checkFile('./ios/SchoolManagementApp.xcworkspace', 'Xcode workspace exists');
  allChecksPassed &= checkFile('./ios/SchoolManagementApp.xcodeproj/project.pbxproj', 'Xcode project exists');
  allChecksPassed &= checkFile('./ios/SchoolManagementApp/Info.plist', 'Info.plist exists');
  allChecksPassed &= checkFile('./ios/Podfile', 'Podfile exists');
  
  // Check Android specific files
  log('\n🤖 Android Specific:', 'cyan');
  allChecksPassed &= checkFile('./android/build.gradle', 'Android build.gradle exists');
  allChecksPassed &= checkFile('./android/app/build.gradle', 'App build.gradle exists');
  allChecksPassed &= checkFile('./android/app/src/main/AndroidManifest.xml', 'AndroidManifest.xml exists');
  allChecksPassed &= checkFile('./android/gradle.properties', 'gradle.properties exists');
  
  // Check assets
  log('\n🎨 Assets:', 'cyan');
  allChecksPassed &= checkFile('./assets/images/icon.png', 'App icon exists');
  allChecksPassed &= checkFile('./assets/images/adaptive-icon.png', 'Android adaptive icon exists');
  allChecksPassed &= checkFile('./assets/images/splash-icon.png', 'Splash screen icon exists');
  
  // Check backend
  log('\n🔧 Backend:', 'cyan');
  allChecksPassed &= checkFile('./backend/server.js', 'Backend server exists');
  allChecksPassed &= checkFile('./backend/package.json', 'Backend package.json exists');
  allChecksPassed &= checkFile('./backend/.env', 'Backend .env file exists');
  
  // Check documentation
  log('\n📚 Documentation:', 'cyan');
  allChecksPassed &= checkFile('./STORE_SUBMISSION.md', 'Store submission guide exists');
  allChecksPassed &= checkFile('./DEPLOYMENT.md', 'Deployment guide exists');
  allChecksPassed &= checkFile('./README.md', 'README exists');
  
  // Check scripts
  log('\n🔨 Scripts:', 'cyan');
  allChecksPassed &= checkFile('./scripts/build.sh', 'Build script exists');
  allChecksPassed &= checkFile('./scripts/verify-store-readiness.js', 'Verification script exists');
  
  // Final result
  log('\n📊 Summary:', 'cyan');
  if (allChecksPassed) {
    log('🎉 All checks passed! Your app is ready for store submission.', 'green');
    log('\nNext steps:', 'yellow');
    log('1. Run: npm run build:all', 'blue');
    log('2. Run: npm run submit:all', 'blue');
    log('3. Follow the store submission guides', 'blue');
  } else {
    log('⚠️  Some checks failed. Please fix the issues above before submitting.', 'red');
    log('\nCommon fixes:', 'yellow');
    log('1. Run: npx expo prebuild', 'blue');
    log('2. Check your app.json configuration', 'blue');
    log('3. Ensure all required assets exist', 'blue');
  }
  
  log('\n================================================', 'bright');
  process.exit(allChecksPassed ? 0 : 1);
}

// Run the verification
main();
