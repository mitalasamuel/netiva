# App Store Submission Guide

## Overview
This guide will help you submit the School Management App to both the Apple App Store and Google Play Store.

## Prerequisites

### For iOS (Apple App Store)
1. **Apple Developer Account** - $99/year
2. **Xcode** - Latest version from Mac App Store
3. **macOS** - Required for iOS development

### For Android (Google Play Store)
1. **Google Play Console Account** - $25 one-time fee
2. **Android Studio** - For testing and debugging (optional)

## Project Structure

```
SchoolManagementApp/
├── ios/                    # iOS native project
│   ├── SchoolManagementApp.xcworkspace
│   ├── SchoolManagementApp.xcodeproj
│   └── SchoolManagementApp/
├── android/                # Android native project
│   ├── app/
│   ├── build.gradle
│   └── gradle.properties
├── app.json               # Expo configuration
├── eas.json              # EAS Build configuration
└── components/           # React Native components
```

## Configuration

### App Information
- **App Name**: School Management App
- **Bundle ID (iOS)**: com.schoolmanagement.app
- **Package Name (Android)**: com.schoolmanagement.app
- **Version**: 1.0.0
- **Build Number**: 1

### Permissions
The app requests the following permissions:

#### iOS Permissions
- Camera access for school activities
- Photo library access for image selection
- Microphone access for audio features
- Location access for school-related features

#### Android Permissions
- Camera
- Read/Write External Storage
- Record Audio
- Fine/Coarse Location
- Internet Access
- Network State

## Building for App Stores

### Using EAS Build (Recommended)

1. **Install EAS CLI**:
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure Project**:
   ```bash
   eas build:configure
   ```

4. **Build for iOS**:
   ```bash
   eas build --platform ios --profile production
   ```

5. **Build for Android**:
   ```bash
   eas build --platform android --profile production
   ```

### Using Local Build

#### iOS Build
1. Open `ios/SchoolManagementApp.xcworkspace` in Xcode
2. Select your development team
3. Choose "Any iOS Device" as target
4. Product → Archive
5. Follow App Store Connect upload process

#### Android Build
1. Open `android` folder in Android Studio
2. Build → Generate Signed Bundle/APK
3. Choose "Android App Bundle" for Play Store
4. Follow Google Play Console upload process

## App Store Submission

### Apple App Store

1. **App Store Connect Setup**:
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Create new app with bundle ID: `com.schoolmanagement.app`
   - Fill in app information and metadata

2. **Required Information**:
   - App Name: School Management App
   - Subtitle: Student Portal & School Management
   - Category: Education
   - Age Rating: 4+ (suitable for all ages)
   - Description: Comprehensive school management app for students, parents, and teachers

3. **Screenshots Required**:
   - iPhone 6.7" (iPhone 14 Pro Max)
   - iPhone 6.5" (iPhone 14 Plus)
   - iPhone 5.5" (iPhone 8 Plus)
   - iPad Pro 12.9" (6th generation)
   - iPad Pro 12.9" (2nd generation)

4. **App Review Information**:
   - Demo account credentials
   - App description and features
   - Contact information

### Google Play Store

1. **Google Play Console Setup**:
   - Go to [Google Play Console](https://play.google.com/console)
   - Create new app with package name: `com.schoolmanagement.app`
   - Fill in store listing details

2. **Required Information**:
   - App Name: School Management App
   - Short Description: Student Portal & School Management
   - Full Description: Comprehensive school management app
   - Category: Education
   - Content Rating: Everyone

3. **Screenshots Required**:
   - Phone screenshots (at least 2)
   - Tablet screenshots (at least 1)
   - Feature graphic (1024 x 500)

4. **App Content**:
   - Privacy Policy URL
   - Target audience
   - Content rating questionnaire

## Testing

### Pre-submission Testing
1. **Test on Real Devices**:
   - Test on various iOS and Android devices
   - Test all app features and navigation
   - Test with different screen sizes

2. **TestFlight (iOS)**:
   - Upload build to App Store Connect
   - Invite beta testers
   - Collect feedback and fix issues

3. **Internal Testing (Android)**:
   - Upload AAB to Play Console
   - Create internal testing track
   - Test with internal users

## Store Assets

### App Icons
- **iOS**: 1024x1024 (App Store), various sizes for different devices
- **Android**: 512x512 (Play Store), adaptive icon with foreground/background

### Screenshots
- **iOS**: 6.7", 6.5", 5.5" iPhone, 12.9" iPad
- **Android**: Phone and tablet screenshots

### App Store Graphics
- **iOS**: App Store icon, screenshots, app preview videos
- **Android**: Feature graphic, screenshots, promotional graphics

## Release Process

### iOS Release
1. Upload build to App Store Connect
2. Fill in all required metadata
3. Submit for review
4. Wait for Apple review (1-7 days)
5. Release to App Store

### Android Release
1. Upload AAB to Play Console
2. Complete store listing
3. Set up content rating
4. Submit for review
5. Release to Play Store

## Post-Launch

### Monitoring
- Monitor app performance and crashes
- Track user reviews and ratings
- Update app based on feedback

### Updates
- Regular updates to fix bugs
- Feature updates based on user feedback
- Security updates as needed

## Support

### Contact Information
- Developer: [Your Name]
- Email: [Your Email]
- Website: [Your Website]

### Privacy Policy
- Required for both stores
- Must be accessible via URL
- Should cover data collection and usage

## Troubleshooting

### Common Issues
1. **Build Failures**: Check dependencies and configuration
2. **Review Rejections**: Address Apple/Google feedback
3. **Performance Issues**: Optimize app performance
4. **Store Listing Issues**: Ensure all required fields are filled

### Resources
- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Developer Policy](https://play.google.com/about/developer-content-policy/)
- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

## Next Steps

1. **Complete App Store Listings**: Fill in all required information
2. **Create Store Assets**: Design icons, screenshots, and promotional materials
3. **Test Thoroughly**: Test on multiple devices and scenarios
4. **Submit for Review**: Follow the submission process for each store
5. **Monitor and Update**: Track performance and user feedback after launch

Good luck with your app store submission! 🚀
