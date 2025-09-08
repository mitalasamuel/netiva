# Deployment Guide - School Management App

## Quick Start

### Prerequisites
1. **Node.js** (v18 or higher)
2. **Expo CLI**: `npm install -g @expo/cli`
3. **EAS CLI**: `npm install -g @expo/eas-cli`
4. **Apple Developer Account** (for iOS)
5. **Google Play Console Account** (for Android)

### Initial Setup
```bash
# Install dependencies
npm install

# Login to Expo
eas login

# Configure EAS
eas build:configure
```

## Build Commands

### Development Builds
```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

### Production Builds
```bash
# Build for iOS App Store
npm run build:ios

# Build for Google Play Store
npm run build:android

# Build for both platforms
npm run build:all

# Build preview/APK for testing
npm run build:preview
```

### App Store Submission
```bash
# Submit to iOS App Store
npm run submit:ios

# Submit to Google Play Store
npm run submit:android

# Submit to both stores
npm run submit:all
```

## Project Structure

```
SchoolManagementApp/
├── ios/                          # iOS native project
│   ├── SchoolManagementApp.xcworkspace
│   ├── SchoolManagementApp.xcodeproj
│   └── SchoolManagementApp/
├── android/                      # Android native project
│   ├── app/
│   ├── build.gradle
│   └── gradle.properties
├── components/                   # React Native components
│   ├── screens/                 # App screens
│   ├── navigation/              # Navigation setup
│   └── services/                # API services
├── backend/                     # Node.js backend
│   ├── server.js
│   └── package.json
├── app.json                     # Expo configuration
├── eas.json                     # EAS Build configuration
├── package.json                 # Dependencies and scripts
└── scripts/
    ├── build.sh                 # Build script
    └── reset-project.js
```

## Configuration Files

### app.json
- **App Name**: School Management App
- **Bundle ID**: com.schoolmanagement.app
- **Version**: 1.0.0
- **Platforms**: iOS, Android, Web
- **Permissions**: Camera, Storage, Location, Microphone

### eas.json
- **Development**: Internal distribution
- **Preview**: APK for testing
- **Production**: AAB for Play Store, IPA for App Store

## Backend Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production
PORT=3001
```

### Backend Deployment
```bash
# Install backend dependencies
cd backend
npm install

# Start backend server
npm start

# Or use PM2 for production
npm install -g pm2
pm2 start server.js --name "school-backend"
```

## Store Submission Process

### 1. Apple App Store

#### Prerequisites
- Apple Developer Account ($99/year)
- Xcode (latest version)
- macOS

#### Steps
1. **Build iOS App**:
   ```bash
   npm run build:ios
   ```

2. **App Store Connect**:
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Create new app with bundle ID: `com.schoolmanagement.app`
   - Upload build from EAS

3. **Required Information**:
   - App Name: School Management App
   - Category: Education
   - Age Rating: 4+
   - Screenshots (iPhone, iPad)
   - App Description
   - Privacy Policy URL

4. **Submit for Review**:
   - Fill in all required fields
   - Submit for Apple review
   - Wait for approval (1-7 days)

### 2. Google Play Store

#### Prerequisites
- Google Play Console Account ($25 one-time)
- Android Studio (optional)

#### Steps
1. **Build Android App**:
   ```bash
   npm run build:android
   ```

2. **Google Play Console**:
   - Go to [Google Play Console](https://play.google.com/console)
   - Create new app with package: `com.schoolmanagement.app`
   - Upload AAB from EAS

3. **Required Information**:
   - App Name: School Management App
   - Category: Education
   - Content Rating: Everyone
   - Screenshots (Phone, Tablet)
   - App Description
   - Privacy Policy URL

4. **Submit for Review**:
   - Complete store listing
   - Set up content rating
   - Submit for review
   - Wait for approval (1-3 days)

## Testing

### Local Testing
```bash
# Test on iOS simulator
npm run ios

# Test on Android emulator
npm run android

# Test on web browser
npm run web
```

### Device Testing
```bash
# Build preview for testing
npm run build:preview

# Install on device
# iOS: Use TestFlight
# Android: Install APK directly
```

### Backend Testing
```bash
# Test backend API
cd backend
npm run test-api

# Test login functionality
npm run test-login
```

## Monitoring and Analytics

### App Performance
- Monitor crashes and errors
- Track user engagement
- Analyze performance metrics

### Backend Monitoring
- Monitor server performance
- Track API usage
- Monitor database performance

## Updates and Maintenance

### App Updates
1. **Version Bump**: Update version in `app.json`
2. **Build New Version**: `npm run build:all`
3. **Submit Update**: `npm run submit:all`

### Backend Updates
1. **Deploy Changes**: Update backend server
2. **Test API**: Ensure all endpoints work
3. **Monitor Performance**: Check for issues

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clean and rebuild
npm run prebuild:clean
npm run build:all
```

#### Backend Connection Issues
- Check backend server status
- Verify API endpoints
- Check network connectivity

#### Store Rejection
- Address review feedback
- Update app description
- Fix any policy violations

### Support Resources
- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Google Play Developer Documentation](https://developer.android.com/distribute)

## Security Considerations

### App Security
- Secure API endpoints
- Implement proper authentication
- Use HTTPS for all communications
- Validate user inputs

### Backend Security
- Use environment variables for secrets
- Implement rate limiting
- Use proper CORS settings
- Regular security updates

## Performance Optimization

### App Performance
- Optimize images and assets
- Implement lazy loading
- Use efficient navigation
- Monitor memory usage

### Backend Performance
- Optimize database queries
- Implement caching
- Use CDN for static assets
- Monitor server resources

## Next Steps

1. **Complete Store Listings**: Fill in all required information
2. **Create Marketing Materials**: Screenshots, descriptions, promotional graphics
3. **Test Thoroughly**: Test on multiple devices and scenarios
4. **Submit for Review**: Follow submission process for each store
5. **Monitor Launch**: Track downloads, reviews, and user feedback
6. **Plan Updates**: Regular updates based on user feedback

## Contact Information

- **Developer**: [Your Name]
- **Email**: [Your Email]
- **Website**: [Your Website]
- **Support**: [Support Email]

---

**Good luck with your app deployment! 🚀**

For any questions or issues, please refer to the documentation or contact support.
