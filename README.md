# NeuroRoute - Inclusive Urban Navigation

**Smart Navigation for Inclusive Mobility**

NeuroRoute is a React Native CLI mobile application designed to help people with disabilities, sensory sensitivities, or neurodiverse profiles choose safer and more comfortable routes in the city. The app optimizes not just distance and time, but also comfort, accessibility, noise level, crowd density, lighting, and environmental conditions.

## Features

- **Personalized Route Recommendations**: Routes tailored to your specific needs and preferences
- **Accessibility-First Design**: Large buttons, readable text, high contrast, screen reader support
- **Environmental Scoring**: Comfort, safety, accessibility, noise, and crowd level metrics
- **Multiple Transport Modes**: Walking, cycling, driving, and public transport options
- **Mock AI Integration**: Structured for future AI route recommendation system
- **Offline Profile Storage**: User preferences saved locally with AsyncStorage

## Tech Stack

- **React Native CLI** (v0.85.2)
- **JavaScript/JSX**
- **React Navigation** (Native Stack)
- **react-native-maps** (Google Maps)
- **AsyncStorage** for local data persistence
- **PropTypes** for runtime type validation

## Quick Start

### Prerequisites

- Node.js >= 22.11.0
- React Native development environment (Android Studio/Xcode)
- Android SDK (for Android development)

### Installation

1. **Install dependencies** (already done):
```bash
npm install
```

2. **Start Metro bundler**:
```bash
npm start
```

3. **Run on Android**:
```bash
npm run android
```

### Demo Mode

This app uses **mock authentication** for easy testing:
- Tap "Sign in with Google" or "Continue as Guest"
- No real Firebase setup required
- All data is stored locally on device

## App Workflow & Screen Flow

```
[Splash Screen] → [Onboarding] → [Auth] → [Profile Setup] → [Home]
                                                      ↓
                           [Settings] ← [Profile] ← [Home]
                                              ↓
                           [Map] ← [Route Selection] ← [Home]
                                              ↓
                                    [Navigation Details]
```

### Screen Descriptions

| Screen | Purpose | Navigation |
|--------|---------|------------|
| **SplashScreen** | App logo, slogan "Smart Navigation for Inclusive Mobility", loading | Auto-navigates to Onboarding (first launch) or Home (logged in) |
| **OnboardingScreen** | 3-page introduction: Inclusive Navigation, Personalized Routes, Comfort Design | Next/Skip/Get Started buttons |
| **AuthScreen** | Google Sign-In (mock) and Guest login options | Login → ProfileSetup |
| **ProfileSetupScreen** | Collect user preferences: disability type, sensitivity, transport mode, avoid preferences | Save → Home |
| **HomeScreen** | Greeting with user name, search (From/To), quick route cards | Find Route → RouteSelection |
| **RouteSelectionScreen** | Shows 4 route options with scores (comfort, safety, accessibility) | Select → Map |
| **MapScreen** | Google Maps view with route line, warning markers, bottom info card | Start Navigation → NavigationDetails |
| **NavigationDetailsScreen** | Turn-by-turn instructions with environmental notes | Previous/Next step navigation |
| **ProfileScreen** | View/edit user info, see saved preferences, logout | Edit → ProfileSetup |
| **SettingsScreen** | Language, theme, accessibility options (large text, high contrast, voice guidance) | - |

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Button.jsx       # Accessible button with variants
│   ├── Card.jsx         # Rounded card with shadows
│   ├── Input.jsx        # Accessible text input
│   ├── ScoreBadge.jsx   # Circular score indicator
│   └── RouteCard.jsx    # Route option display
├── screens/             # All screen components
│   ├── SplashScreen.jsx
│   ├── OnboardingScreen.jsx
│   ├── AuthScreen.jsx
│   ├── ProfileSetupScreen.jsx
│   ├── HomeScreen.jsx
│   ├── RouteSelectionScreen.jsx
│   ├── MapScreen.jsx
│   ├── NavigationDetailsScreen.jsx
│   ├── ProfileScreen.jsx
│   └── SettingsScreen.jsx
├── navigation/          # Navigation setup
│   ├── AuthContext.jsx  # Auth state management
│   ├── AppNavigator.jsx # Stack navigator configuration
│   └── routes.js        # Route name constants
├── services/            # Business logic
│   ├── storageService.js    # AsyncStorage wrapper
│   ├── authService.js       # Authentication (mock)
│   └── routeService.js      # Route calculation (mock)
├── data/                # Mock data
│   └── mockRoutes.js    # Sample routes with environmental data
├── constants/           # App constants
│   ├── colors.js        # Color palette
│   ├── theme.js         # Spacing, fonts, shadows
│   ├── propTypes.js     # PropTypes definitions
│   └── index.js         # Centralized exports
├── hooks/               # Custom React hooks
├── utils/               # Helper functions
└── assets/              # Images and fonts
```

## File Relationships & Data Flow

### Component Dependencies
```
Button, Card, Input, ScoreBadge ← constants/colors, constants/theme
RouteCard ← Card, Button, ScoreBadge
```

### Screen Dependencies
```
HomeScreen ← Input, Button, RouteCard, storageService
RouteSelectionScreen ← RouteCard, routeService
MapScreen ← ScoreBadge, Card, Button, react-native-maps
ProfileSetupScreen ← Input, Button, Card, storageService
```

### Service Architecture
```
AuthContext (Provider)
    ├── storageService (AsyncStorage)
    │   ├── User Profile
    │   ├── App Settings
    │   └── Auth Token
    ├── authService (Mock Google/Guest login)
    └── routeService (Mock route calculation)
        └── mockRoutes.js
```

### Data Flow Example: Finding a Route
```
1. User enters From/To in HomeScreen
2. HomeScreen calls navigation.navigate('RouteSelection', params)
3. RouteSelectionScreen calls routeService.getRoutes(origin, dest, profile)
4. routeService calculates personalized scores using userProfile.avoidPreferences
5. Routes are sorted and filtered
6. RouteSelectionScreen displays RouteCard components
7. User selects a route → navigation.navigate('Map', { route })
8. MapScreen displays route on react-native-maps with warning markers
```

## Design System

### Color Palette
- **Primary**: #1a237e (Dark Blue)
- **Secondary**: #4caf50 (Green)
- **Background**: #ffffff (White)
- **Surface**: #f5f5f5 (Light Gray)
- **Error**: #d32f2f (Red)
- **Warning**: #f57c00 (Orange)

### Accessibility Features
- Minimum touch target: 48x48dp
- Minimum font size: 16sp
- High contrast mode support
- Screen reader labels on all interactive elements
- Large text mode option

## Mock Data Structure

### Route Object
```javascript
{
  id: 'route_1',
  type: 'shortest' | 'calm' | 'accessible' | 'balanced',
  mode: 'walking' | 'bicycle' | 'car' | 'public_transport',
  duration: 12,        // minutes
  distance: 950,       // meters
  comfortScore: 65,    // 0-100
  noiseLevel: 'low' | 'medium' | 'high',
  crowdLevel: 'low' | 'medium' | 'high',
  accessibilityScore: 70, // 0-100
  safetyScore: 75,     // 0-100
  warnings: ['high_noise', 'crowded_zone'],
  coordinates: [{ lat, lng }, ...],
  steps: [{
    instruction: 'Turn right on Main St',
    distance: 200,
    duration: 2,
    notes: 'Environmental note'
  }]
}
```

### User Profile
```javascript
{
  id: 'user_123',
  name: 'John Doe',
  age: 30,
  gender: 'male',
  disabilityType: ['mobility_impairment', 'sensory_sensitivity'],
  sensitivityLevel: 'high',
  preferredMode: 'walking',
  avoidPreferences: ['noisy_areas', 'stairs']
}
```

## Future AI Integration

The app is structured for easy AI model integration:

1. **API Service Layer**: `services/routeService.js` is designed to switch from mock data to real API calls
2. **Route Calculation**: `calculatePersonalizedScore()` can be replaced with ML model predictions
3. **Environmental Data**: Mock warnings will come from real-time sensors and databases

To integrate AI:
```javascript
// In services/routeService.js, replace:
export const getRoutes = async (origin, destination, profile) => {
  // Current: return mock data
  // Future: 
  // const response = await fetch('YOUR_AI_API/routes', {
  //   method: 'POST',
  //   body: JSON.stringify({ origin, destination, profile })
  // });
  // return response.json();
};
```

## Testing Checklist

### Setup Verification
- [ ] App launches without errors
- [ ] Splash screen displays for 2.5 seconds
- [ ] Onboarding shows 3 pages with navigation
- [ ] Auth screen accepts mock login

### Feature Testing
- [ ] Profile setup saves to AsyncStorage
- [ ] Home screen shows greeting with user name
- [ ] Route search displays 4 route options
- [ ] Map displays route line with markers
- [ ] Navigation details show turn-by-turn instructions
- [ ] Profile can be viewed and edited
- [ ] Settings persist after app restart

### Accessibility Testing
- [ ] All touch targets ≥ 48x48dp
- [ ] Text size increases with "Large Text" setting
- [ ] Screen reader announces buttons correctly
- [ ] High contrast mode works

## Troubleshooting

### Common Issues

**Metro bundler not starting:**
```bash
npx react-native start --reset-cache
```

**Android build fails:**
```bash
cd android && ./gradlew clean && cd .. && npm run android
```

**Maps not displaying:**
- Ensure you have a valid Google Maps API key in `android/app/src/main/AndroidManifest.xml`

### Dependencies

Key packages installed:
- `@react-navigation/native` & `@react-navigation/native-stack`
- `react-native-maps` - Map visualization
- `@react-native-async-storage/async-storage` - Local storage
- `react-native-vector-icons` - Material Design icons
- `react-native-safe-area-context` - Safe area handling
- `prop-types` - Runtime type checking

## License

This is a demo prototype for educational purposes.

---

**Made with ❤️ for inclusive mobility**
