// Storage Service using AsyncStorage
// Handles user profile and settings persistence

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_PROFILE: '@neuroroute_user_profile',
  USER_SETTINGS: '@neuroroute_user_settings',
  ONBOARDING_COMPLETED: '@neuroroute_onboarding_completed',
  AUTH_TOKEN: '@neuroroute_auth_token',
};

/**
 * Save user profile to AsyncStorage
 * @param {Object} profile - User profile object
 */
export const saveProfile = async (profile) => {
  try {
    const jsonValue = JSON.stringify(profile);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving profile:', error);
    return false;
  }
};

/**
 * Get user profile from AsyncStorage
 * @returns {Object|null} User profile or null if not found
 */
export const getProfile = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
};

/**
 * Update existing user profile
 * @param {Object} updates - Profile fields to update
 */
export const updateProfile = async (updates) => {
  try {
    const currentProfile = await getProfile();
    if (!currentProfile) {
      throw new Error('No profile found to update');
    }
    const updatedProfile = { ...currentProfile, ...updates };
    await saveProfile(updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
};

/**
 * Save user settings
 * @param {Object} settings - User settings object
 */
export const saveSettings = async (settings) => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_SETTINGS, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

/**
 * Get user settings
 * @returns {Object|null} User settings or default settings
 */
export const getSettings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    // Return default settings
    return {
      language: 'en',
      darkMode: false,
      largeText: false,
      highContrast: false,
      voiceGuidance: false,
      vibrationAlerts: true,
      simpleInterface: false,
    };
  } catch (error) {
    console.error('Error getting settings:', error);
    return null;
  }
};

/**
 * Mark onboarding as completed
 */
export const setOnboardingCompleted = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    return true;
  } catch (error) {
    console.error('Error setting onboarding completed:', error);
    return false;
  }
};

/**
 * Check if onboarding is completed
 * @returns {boolean}
 */
export const isOnboardingCompleted = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

/**
 * Save authentication token
 * @param {string} token - Auth token
 */
export const saveAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    return true;
  } catch (error) {
    console.error('Error saving auth token:', error);
    return false;
  }
};

/**
 * Get authentication token
 * @returns {string|null}
 */
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = async () => {
  const token = await getAuthToken();
  return token !== null;
};

/**
 * Clear all stored data (logout)
 */
export const clearAll = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_PROFILE,
      STORAGE_KEYS.AUTH_TOKEN,
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};
