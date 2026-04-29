// Splash Screen
// App logo, slogan, and loading animation

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZE } from '../constants/theme';
import { isOnboardingCompleted, isAuthenticated } from '../services/storageService';
import { ROUTES } from '../navigation/routes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Check auth status and navigate
    const checkStatus = async () => {
      await new Promise(resolve => setTimeout(resolve, 2500)); // Show splash for 2.5s
      
      const onboardingDone = await isOnboardingCompleted();
      const auth = await isAuthenticated();

      if (auth) {
        navigation.replace(ROUTES.HOME);
      } else if (onboardingDone) {
        navigation.replace(ROUTES.AUTH);
      } else {
        navigation.replace(ROUTES.ONBOARDING);
      }
    };

    checkStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo Icon */}
        <View style={styles.logoContainer}>
          <Icon name="map-marker-radius" size={80} color={COLORS.primary} />
          <View style={styles.iconBadge}>
            <Icon name="accessibility" size={24} color={COLORS.secondary} />
          </View>
        </View>

        {/* App Name */}
        <Text style={styles.appName}>NeuroRoute</Text>

        {/* Slogan */}
        <Text style={styles.slogan}>
          Smart Navigation for Inclusive Mobility
        </Text>

        {/* Loading Indicator */}
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={styles.loader}
        />

        {/* Version */}
        <Text style={styles.version}>v1.0.0</Text>
      </Animated.View>
    </View>
  );
};

SplashScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  iconBadge: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 4,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  appName: {
    fontSize: FONT_SIZE.title,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  slogan: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  loader: {
    marginTop: SPACING.lg,
  },
  version: {
    position: 'absolute',
    bottom: SPACING.xl,
    fontSize: FONT_SIZE.small,
    color: COLORS.textMuted,
  },
});

export default SplashScreen;
