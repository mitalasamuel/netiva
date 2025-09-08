#!/usr/bin/env node

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
    log(`❌ ${description} - Missing: ${filePath}`, 'red');
    return false;
  }
}

function checkJsonFile(filePath, description, requiredFields = []) {
  if (!fs.existsSync(filePath)) {
    log(`❌ ${description} - Missing: ${filePath}`, 'red');
    return false;
  }

  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let isValid = true;

    requiredFields.forEach(field => {
      if (!content[field]) {
        log(`❌ ${description} - Missing field: ${field}`, 'red');
        isValid = false;
      }
    });

    if (isValid) {
      log(`✅ ${description}`, 'green');
    }
    return isValid;
  } catch (error) {
    log(`❌ ${description} - Invalid JSON: ${error.message}`, 'red');
    return false;
  }
}

function checkAppJson() {
  log('\n📱 Checking app.json configuration...', 'blue');
  
  const appJsonPath = path.join(process.cwd(), 'app.json');
  if (!fs.existsSync(appJsonPath)) {
    log('❌ app.json not found', 'red');
    return false;
  }

  try {
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    let isValid = true;

    // Check required fields
    const requiredFields = [
      'expo.name',
      'expo.slug',
      'expo.version',
      'expo.orientation',
      'expo.icon',
      'expo.scheme',
      'expo.ios.bundleIdentifier',
      'expo.android.package',
      'expo.ios.buildNumber',
      'expo.android.versionCode'
    ];

    requiredFields.forEach(field => {
      const keys = field.split('.');
      let value = appJson;
      for (const key of keys) {
        value = value?.[key];
      }
      if (!value) {
        log(`❌ Missing required field: ${field}`, 'red');
        isValid = false;
      }
    });

    // Check project ID
    if (appJson.expo?.extra?.eas?.projectId === 'your-project-id-here') {
      log('⚠️  EAS Project ID not configured - Update in app.json', 'yellow');
    }

    // Check iOS configuration
    if (appJson.expo?.ios) {
      log('✅ iOS configuration present', 'green');
    } else {
      log('❌ iOS configuration missing', 'red');
      isValid = false;
    }

    // Check Android configuration
    if (appJson.expo?.android) {
      log('✅ Android configuration present', 'green');
    } else {
      log('❌ Android configuration missing', 'red');
      isValid = false;
    }

    return isValid;
  } catch (error) {
    log(`❌ Invalid app.json: ${error.message}`, 'red');
    return false;
  }
}

function checkEasJson() {
  log('\n⚙️  Checking eas.json configuration...', 'blue');
  
  const easJsonPath = path.join(process.cwd(), 'eas.json');
  if (!fs.existsSync(easJsonPath)) {
    log('❌ eas.json not found', 'red');
    return false;
  }

  try {
    const easJson = JSON.parse(fs.readFileSync(easJsonPath, 'utf8'));
    let isValid = true;

    // Check build profiles
    if (!easJson.build) {
      log('❌ Build profiles not configured', 'red');
      isValid = false;
    } else {
      if (easJson.build.production) {
        log('✅ Production build profile configured', 'green');
      } else {
        log('❌ Production build profile missing', 'red');
        isValid = false;
      }
    }

    // Check submit configuration
    if (!easJson.submit) {
      log('⚠️  Submit configuration missing - Will need manual setup', 'yellow');
    } else {
      log('✅ Submit configuration present', 'green');
    }

    return isValid;
  } catch (error) {
    log(`❌ Invalid eas.json: ${error.message}`, 'red');
    return false;
  }
}

function checkPackageJson() {
  log('\n📦 Checking package.json scripts...', 'blue');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ package.json not found', 'red');
    return false;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    let isValid = true;

    const requiredScripts = [
      'build:ios',
      'build:android',
      'build:all',
      'submit:ios',
      'submit:android',
      'submit:all'
    ];

    requiredScripts.forEach(script => {
      if (packageJson.scripts?.[script]) {
        log(`✅ Script found: ${script}`, 'green');
      } else {
        log(`❌ Script missing: ${script}`, 'red');
        isValid = false;
      }
    });

    return isValid;
  } catch (error) {
    log(`❌ Invalid package.json: ${error.message}`, 'red');
    return false;
  }
}

function checkAssets() {
  log('\n🖼️  Checking app assets...', 'blue');
  
  const assetsDir = path.join(process.cwd(), 'assets', 'images');
  let isValid = true;

  const requiredAssets = [
    'icon.png',
    'adaptive-icon.png',
    'splash-icon.png',
    'favicon.png'
  ];

  requiredAssets.forEach(asset => {
    const assetPath = path.join(assetsDir, asset);
    if (fs.existsSync(assetPath)) {
      log(`✅ Asset found: ${asset}`, 'green');
    } else {
      log(`❌ Asset missing: ${asset}`, 'red');
      isValid = false;
    }
  });

  return isValid;
}

function checkNativeFolders() {
  log('\n📱 Checking native project folders...', 'blue');
  
  const iosPath = path.join(process.cwd(), 'ios');
  const androidPath = path.join(process.cwd(), 'android');
  
  let isValid = true;

  if (fs.existsSync(iosPath)) {
    log('✅ iOS folder exists', 'green');
    
    // Check for key iOS files
    const iosFiles = [
      'SchoolManagementApp.xcworkspace',
      'SchoolManagementApp.xcodeproj',
      'SchoolManagementApp/Info.plist'
    ];
    
    iosFiles.forEach(file => {
      const filePath = path.join(iosPath, file);
      if (fs.existsSync(filePath)) {
        log(`✅ iOS file found: ${file}`, 'green');
      } else {
        log(`❌ iOS file missing: ${file}`, 'red');
        isValid = false;
      }
    });
  } else {
    log('❌ iOS folder missing - Run: npm run prebuild:ios', 'red');
    isValid = false;
  }

  if (fs.existsSync(androidPath)) {
    log('✅ Android folder exists', 'green');
    
    // Check for key Android files
    const androidFiles = [
      'app/build.gradle',
      'build.gradle',
      'settings.gradle'
    ];
    
    androidFiles.forEach(file => {
      const filePath = path.join(androidPath, file);
      if (fs.existsSync(filePath)) {
        log(`✅ Android file found: ${file}`, 'green');
      } else {
        log(`❌ Android file missing: ${file}`, 'red');
        isValid = false;
      }
    });
  } else {
    log('❌ Android folder missing - Run: npm run prebuild:android', 'red');
    isValid = false;
  }

  return isValid;
}

function checkBackend() {
  log('\n🔧 Checking backend configuration...', 'blue');
  
  const backendPath = path.join(process.cwd(), 'backend');
  let isValid = true;

  if (!fs.existsSync(backendPath)) {
    log('❌ Backend folder missing', 'red');
    return false;
  }

  const backendFiles = [
    'server.js',
    'package.json',
    'ecosystem.config.js'
  ];

  backendFiles.forEach(file => {
    const filePath = path.join(backendPath, file);
    if (fs.existsSync(filePath)) {
      log(`✅ Backend file found: ${file}`, 'green');
    } else {
      log(`❌ Backend file missing: ${file}`, 'red');
      isValid = false;
    }
  });

  return isValid;
}

function checkDocumentation() {
  log('\n📚 Checking documentation...', 'blue');
  
  const docs = [
    'APPLE_STORE_SUBMISSION.md',
    'GOOGLE_PLAY_SUBMISSION.md',
    'AUTOMATIC_STARTUP.md',
    'BACKEND_SETUP.md'
  ];
  
  let isValid = true;

  docs.forEach(doc => {
    const docPath = path.join(process.cwd(), doc);
    if (fs.existsSync(docPath)) {
      log(`✅ Documentation found: ${doc}`, 'green');
    } else {
      log(`❌ Documentation missing: ${doc}`, 'red');
      isValid = false;
    }
  });

  return isValid;
}

function main() {
  log('🚀 School Management App - Production Readiness Check', 'bright');
  log('=' .repeat(60), 'blue');

  let allChecksPassed = true;

  // Run all checks
  allChecksPassed &= checkAppJson();
  allChecksPassed &= checkEasJson();
  allChecksPassed &= checkPackageJson();
  allChecksPassed &= checkAssets();
  allChecksPassed &= checkNativeFolders();
  allChecksPassed &= checkBackend();
  allChecksPassed &= checkDocumentation();

  log('\n' + '=' .repeat(60), 'blue');
  
  if (allChecksPassed) {
    log('🎉 All checks passed! Your app is ready for production!', 'green');
    log('\n📋 Next Steps:', 'blue');
    log('1. Update EAS Project ID in app.json', 'yellow');
    log('2. Configure Apple Developer Account details in eas.json', 'yellow');
    log('3. Set up Google Play Console service account', 'yellow');
    log('4. Run: npm run build:all', 'yellow');
    log('5. Follow submission guides for each store', 'yellow');
  } else {
    log('❌ Some checks failed. Please fix the issues above before proceeding.', 'red');
    log('\n🔧 Common fixes:', 'blue');
    log('• Run: npm run prebuild:all', 'yellow');
    log('• Update app.json with correct project ID', 'yellow');
    log('• Ensure all required assets are present', 'yellow');
  }

  log('\n📖 For detailed instructions, see:', 'blue');
  log('• APPLE_STORE_SUBMISSION.md', 'cyan');
  log('• GOOGLE_PLAY_SUBMISSION.md', 'cyan');
  log('• AUTOMATIC_STARTUP.md', 'cyan');
}

main();
