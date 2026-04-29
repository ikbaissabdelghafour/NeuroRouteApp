// Authentication Service (Mock for demo)
// Simulates Google Sign-In and guest login

import { saveAuthToken, saveProfile, clearAll } from './storageService';

/**
 * Simulate Google Sign-In
 * @returns {Promise<{success: boolean, user: Object}>}
 */
export const signInWithGoogle = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock successful Google sign-in
  const mockUser = {
    id: 'google_' + Math.random().toString(36).substr(2, 9),
    name: 'Demo User',
    email: 'demo@example.com',
    photo: null,
    isGuest: false,
  };
  
  // Save auth token
  await saveAuthToken('mock_google_token_' + Date.now());
  
  return {
    success: true,
    user: mockUser,
  };
};

/**
 * Sign in as guest
 * @returns {Promise<{success: boolean, user: Object}>}
 */
export const signInAsGuest = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const mockUser = {
    id: 'guest_' + Math.random().toString(36).substr(2, 9),
    name: 'Guest User',
    email: null,
    photo: null,
    isGuest: true,
  };
  
  // Save auth token
  await saveAuthToken('mock_guest_token_' + Date.now());
  
  return {
    success: true,
    user: mockUser,
  };
};

/**
 * Sign out user
 * @returns {Promise<{success: boolean}>}
 */
export const signOut = async () => {
  try {
    await clearAll();
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>}
 */
export const getCurrentUser = async () => {
  // In a real app, this would validate the token
  // For demo, we just check if token exists
  const token = await AsyncStorage.getItem('@neuroroute_auth_token');
  if (!token) return null;
  
  // Return mock user
  return {
    id: 'current_user',
    name: 'Current User',
    email: 'user@example.com',
  };
};
