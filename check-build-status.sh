#!/bin/bash
# Google Play Store Submission Helper Script

echo "🚀 Google Play Store Submission Helper"
echo "======================================"

# Check EAS build status
echo "📱 Checking EAS build status..."
eas build:list --limit 3

echo ""
echo "🔗 Useful Links:"
echo "• EAS Project: https://expo.dev/accounts/mitala/projects/school-management-app"
echo "• Google Play Console: https://play.google.com/console"
echo "• Build Logs: eas build:view [BUILD_ID]"

echo ""
echo "📋 Next Steps:"
echo "1. Wait for build to complete"
echo "2. Download AAB file when ready"
echo "3. Create Google Play Console account"
echo "4. Upload graphics and create store listing"
echo "5. Upload AAB and submit for review"

echo ""
echo "⏱️  Build typically takes 10-15 minutes"
echo "📊 Check status with: eas build:list"
