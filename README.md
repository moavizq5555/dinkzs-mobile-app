# 🚀 Dinkzs Mobile App

A cross-platform mobile application that loads the [Dinkzs website](https://playdinkzs.com/) in a native web view with full mobile optimization and device integration including **location services**.

## ✨ Features

- **Full Website Integration**: Loads https://playdinkzs.com/ in a native web view
- **Mobile Optimized**: Responsive design with mobile-specific enhancements
- **Native Device Features**: Camera, location, microphone, and more
- **📍 Location Services**: Real-time GPS location with permission handling
- **Cross-platform**: Works on iOS, Android, and Web
- **Offline Support**: Graceful handling of network issues
- **Deep Linking**: Support for app-specific URLs
- **Splash Screen**: Beautiful loading experience

## 🛠️ Built With

- **Capacitor**: Cross-platform native runtime for web apps
- **Dinkzs Website**: https://playdinkzs.com/
- **HTML5/CSS3**: Modern web technologies
- **JavaScript**: Interactive functionality with location integration
- **Capacitor Plugins**: Full suite of device integration plugins including Geolocation

## 📱 Supported Platforms

- 📱 iOS (with full permissions including location)
- 🤖 Android (with full permissions including location)
- 🌐 Web Browser

## 🔐 Permissions Included

### iOS Permissions

- **📍 Location services** (when in use and always)
- Camera access for photos/videos
- Microphone for voice features
- Photo library access
- Face ID for authentication
- Bluetooth for enhanced features
- Local network access
- User tracking for personalization

### Android Permissions

- **📍 Location services** (fine and coarse location)
- Internet and network access
- Camera and media permissions
- Microphone and audio settings
- Storage access (read/write)
- Bluetooth connectivity
- Vibration and notifications
- System alert windows
- Battery optimization bypass

## 📍 Location Features

The app includes comprehensive location functionality:

- **Real-time GPS tracking** with high accuracy
- **Automatic permission requests** for location access
- **Location watcher** for continuous updates
- **Fallback to browser geolocation** when needed
- **Location data sharing** with the Dinkzs website
- **Error handling** for location permission denials
- **Background location** support (Android)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- For iOS development: Xcode (macOS only)
- For Android development: Android Studio

### Installation

1. **Clone or navigate to the project directory**

   ```bash
   cd dinkzs
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Sync Capacitor**
   ```bash
   npm run cap:sync
   ```

## 🎯 Available Scripts

### Development

```bash
# Serve web version
npm run web

# Sync changes to native projects
npm run cap:sync

# Copy web assets to native projects
npm run cap:copy
```

### Platform Specific

```bash
# iOS
npm run ios

# Android
npm run android

# Open in IDE
npm run cap:open
```

## 📁 Project Structure

```
dinkzs/
├── www/                 # Web assets
│   ├── index.html      # Main HTML with web view
│   └── app.js          # JavaScript with Capacitor & location integration
├── ios/                # iOS native project
├── android/            # Android native project
├── capacitor.config.json # Capacitor configuration
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## 🔧 Capacitor Configuration

The project is configured with:

- **App ID**: `com.dinkzs.mobile`
- **App Name**: `Dinkzs`
- **Web Directory**: `www`
- **Target Website**: https://playdinkzs.com/
- **Location Plugin**: Fully configured with permissions

## 📱 Native Features

The app provides these native capabilities:

1. **Web View**: Full website integration with mobile optimization
2. **📍 Location Services**: GPS tracking and location sharing
3. **Device Integration**: Camera, location, microphone access
4. **Network Handling**: Offline detection and retry mechanisms
5. **Orientation Support**: Handles device rotation
6. **Deep Linking**: Support for app-specific URLs
7. **Splash Screen**: Professional loading experience
8. **Status Bar**: Custom status bar styling
9. **Back Button**: Android back button handling
10. **App State**: Background/foreground state management

## 🎨 UI Features

- **Loading Screen**: Beautiful gradient with spinner
- **Error Handling**: User-friendly error messages
- **Retry Mechanism**: Automatic retry on connection issues
- **Mobile Optimization**: Touch-friendly interface
- **Status Bar**: Custom colored status bar
- **Full Screen**: Immersive web view experience

## 🔌 Capacitor Plugins Used

- **@capacitor/app**: App lifecycle management
- **@capacitor/device**: Device information
- **@capacitor/dialog**: Native alert dialogs
- **@capacitor/network**: Network connectivity
- **@capacitor/camera**: Camera access
- **📍 @capacitor/geolocation**: Location services (v7.1.4)
- **@capacitor/haptics**: Haptic feedback
- **@capacitor/status-bar**: Status bar customization
- **@capacitor/splash-screen**: Splash screen management

## 📍 Location Integration

The app seamlessly integrates location services:

```javascript
// Get current location
const position = await DinkzsApp.getCurrentLocation();

// Request location permissions
await DinkzsApp.requestLocationPermission();

// Location data structure
{
  latitude: 37.7749,
  longitude: -122.4194,
  accuracy: 10,
  timestamp: 1640995200000
}
```

## 🚀 Deployment

### Web

```bash
npm run web
```

### iOS

```bash
npm run cap:sync
npm run ios
```

### Android

```bash
npm run cap:sync
npm run android
```

## 📝 Development Notes

- The app loads https://playdinkzs.com/ in a secure web view
- **Location permissions are automatically requested** on app startup
- All necessary permissions are pre-configured
- Mobile optimizations are automatically applied
- Network errors are handled gracefully
- The app works offline with appropriate error messages
- Deep linking support for app-specific URLs
- **Location data is shared with the website** via postMessage API

## 🔒 Security Features

- HTTPS enforcement for web content
- Secure web view configuration
- Permission-based access control
- Network security policies
- Content security policies
- **Location data privacy** protection

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built with [Capacitor](https://capacitorjs.com/)
- Integrates with [Dinkzs](https://playdinkzs.com/)
- Uses modern mobile development practices
- Implements comprehensive permission handling
- **Includes advanced location services** for enhanced user experience
