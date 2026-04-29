// Authentication Screen
// Google Sign-In and Guest options

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZE, SHADOWS } from '../constants/theme';
import { signInWithGoogle, signInAsGuest } from '../services/authService';
import { saveProfile } from '../services/storageService';
import { useAuth } from '../navigation/AuthContext';
import { ROUTES } from '../navigation/routes';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AuthScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        // Save initial user data
        await saveProfile({
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          isGuest: false,
        });
        
        await login(result.user);
        navigation.replace(ROUTES.PROFILE_SETUP);
      } else {
        Alert.alert('Sign In Failed', 'Unable to sign in with Google. Please try again.');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInAsGuest();
      if (result.success) {
        // Save guest user data
        await saveProfile({
          id: result.user.id,
          name: result.user.name,
          isGuest: true,
        });
        
        await login(result.user);
        navigation.replace(ROUTES.PROFILE_SETUP);
      } else {
        Alert.alert('Error', 'Unable to continue as guest.');
      }
    } catch (error) {
      console.error('Guest sign in error:', error);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <Icon name="map-marker-radius" size={60} color={COLORS.primary} />
          <View style={styles.iconBadge}>
            <Icon name="accessibility" size={20} color={COLORS.secondary} />
          </View>
        </View>
        <Text style={styles.appName}>NeuroRoute</Text>
        <Text style={styles.tagline}>Welcome! Let's get you started.</Text>
      </View>

      {/* Auth Options */}
      <View style={styles.authContainer}>
        <Card style={styles.authCard} shadow="large">
          <Text style={styles.welcomeText}>Sign In</Text>
          <Text style={styles.subtitle}>
            Choose how you'd like to continue
          </Text>

          {/* Google Sign In */}
          <Button
            title="Sign in with Google"
            onPress={handleGoogleSignIn}
            variant="outline"
            size="large"
            loading={isLoading}
            style={styles.googleButton}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Guest Option */}
          <Button
            title="Continue as Guest"
            onPress={handleGuestSignIn}
            variant="ghost"
            size="large"
            loading={isLoading}
          />
        </Card>

        {/* Info Text */}
        <Text style={styles.infoText}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </View>
  );
};

AuthScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
    marginBottom: SPACING.xl,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  iconBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: COLORS.background,
    borderRadius: 15,
    padding: 3,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  appName: {
    fontSize: FONT_SIZE.xlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  tagline: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.textLight,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  authCard: {
    padding: SPACING.lg,
  },
  welcomeText: {
    fontSize: FONT_SIZE.xlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  googleButton: {
    marginBottom: SPACING.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.textMuted,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: FONT_SIZE.medium,
    color: COLORS.textLight,
  },
  infoText: {
    fontSize: FONT_SIZE.small,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});

export default AuthScreen;
