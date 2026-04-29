// Main App Navigator
// Handles navigation between all screens

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from './AuthContext';
import { ROUTES } from './routes';

// Import all screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import RouteSelectionScreen from '../screens/RouteSelectionScreen';
import MapScreen from '../screens/MapScreen';
import NavigationDetailsScreen from '../screens/NavigationDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Show splash screen while checking auth status
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1a237e',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen
              name={ROUTES.SPLASH}
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={ROUTES.ONBOARDING}
              component={OnboardingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={ROUTES.AUTH}
              component={AuthScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={ROUTES.PROFILE_SETUP}
              component={ProfileSetupScreen}
              options={{ title: 'Set Up Your Profile' }}
            />
          </>
        ) : (
          // Main Stack
          <>
            <Stack.Screen
              name={ROUTES.HOME}
              component={HomeScreen}
              options={{ title: 'NeuroRoute', headerBackVisible: false }}
            />
            <Stack.Screen
              name={ROUTES.ROUTE_SELECTION}
              component={RouteSelectionScreen}
              options={{ title: 'Choose Your Route' }}
            />
            <Stack.Screen
              name={ROUTES.MAP}
              component={MapScreen}
              options={{ title: 'Route Map' }}
            />
            <Stack.Screen
              name={ROUTES.NAVIGATION_DETAILS}
              component={NavigationDetailsScreen}
              options={{ title: 'Turn-by-Turn' }}
            />
            <Stack.Screen
              name={ROUTES.PROFILE}
              component={ProfileScreen}
              options={{ title: 'Your Profile' }}
            />
            <Stack.Screen
              name={ROUTES.SETTINGS}
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
