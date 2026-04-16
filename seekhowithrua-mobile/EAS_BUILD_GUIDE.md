# SeekhoWithRua Mobile App - EAS Build Guide

## 📱 App Features (Simplified - 2 Features Only)

1. **📚 Courses** - All courses from website (same as seekhowithrua.com)
2. **🎙️ Live Features** - Voice Chat Rooms (VCR) + AI Chat (Talk with Rua)

## 🔐 Authentication

The app uses the **same authentication** as LMS:
- Token: `cosmos_token` stored in SecureStore
- User: `cosmos_user` stored in SecureStore
- Backend: `lms.seekhowithrua.com` API
- Login redirects to `app.seekhowithrua.com` after successful auth

## 🚀 EAS Build & Deploy to exp.dev

### Prerequisites

1. **Install EAS CLI:**
```bash
npm install -g eas-cli
```

2. **Login to Expo:**
```bash
eas login
```

3. **Create EAS Project** (First time only):
```bash
eas build:configure
```
   - Select "All" for both iOS and Android
   - This creates the `projectId` in app.json automatically

### Build Commands

#### Development Build (for testing):
```bash
eas build --profile development --platform android
eas build --profile development --platform ios
```

#### Preview Build (internal distribution):
```bash
eas build --profile preview --platform android
eas build --profile preview --platform ios
```

#### Production Build (for stores):
```bash
eas build --profile production --platform android
eas build --profile production --platform ios
```

### Publish to exp.dev (Expo Go)

To make the app available in Expo Go for testing:

```bash
# Update the app and publish
expo publish

# Or with EAS Update
eas update --branch preview --message "Initial release"
```

### QR Code / Download Links

After build completes, you'll get:
- **APK download link** (for Android)
- **IPA download link** (for iOS)
- **QR Code** to scan with Expo Go app
- **exp.dev** project page link

## 📦 App Store Submission

### Android (Google Play Store):

1. Generate service account key in Google Play Console
2. Place JSON key file at: `./google-service-account.json`
3. Update `eas.json` with correct path
4. Run:
```bash
eas submit --platform android
```

### iOS (App Store):

1. Get App Store Connect API Key from Apple Developer
2. Place `.p8` key file at: `./AuthKey.p8`
3. Update `eas.json` with:
   - `ascAppId`: Your Apple App ID
   - `ascApiKeyIssuerId`: Issuer ID
   - `ascApiKeyId`: Key ID
4. Run:
```bash
eas submit --platform ios
```

## 🔧 Environment Variables

Create `.env.local` file:
```
EXPO_PUBLIC_API_URL=https://api.seekhowithrua.com
```

## 📋 Build Checklist

- [ ] App.json configured with correct bundle IDs
- [ ] EAS project initialized (`eas build:configure`)
- [ ] Icons and splash screen images in `/assets/images/`
- [ ] API URL configured in environment variables
- [ ] Test login flow with LMS backend
- [ ] Test VCR (voice rooms) functionality
- [ ] Test AI Chat functionality

## 🆘 Troubleshooting

### Build Fails:
```bash
# Clear cache and retry
eas build --clear-cache
```

### Invalid Project ID:
```bash
# Reconfigure project
eas build:configure
```

### iOS Build Issues:
- Ensure Apple Developer account is active
- Check provisioning profiles in Apple Developer Portal

### Android Build Issues:
- Check `gradle.properties` for correct settings
- Ensure Android SDK is properly configured

## 📱 App Structure

```
seekhowithrua-mobile/
├── app.json              # Expo configuration
├── eas.json              # EAS build profiles
├── src/
│   ├── navigation/
│   │   ├── AppNavigator.tsx    # Root navigator (Auth check)
│   │   └── MainTabs.tsx        # 2-tab navigation (Courses + Live)
│   ├── pages/
│   │   ├── Courses.tsx         # All courses from website
│   │   ├── VCRoom.tsx          # Voice Chat Rooms
│   │   ├── TalkWithRua.tsx     # AI Chat
│   │   └── LoginSignupLogout.tsx   # Auth with LMS
│   ├── store/
│   │   └── authStore.ts        # Auth state (cosmos_token)
│   └── services/
│       └── api.ts              # LMS API integration
└── assets/
    └── images/               # Icons and splash
```

## 🔗 Important Links

- **Expo Dashboard**: https://expo.dev
- **EAS Build**: https://expo.dev/builds
- **App Store**: https://appstoreconnect.apple.com
- **Play Console**: https://play.google.com/console

---

**Ready to Build! 🚀**

Run: `eas build --profile preview --platform all`
