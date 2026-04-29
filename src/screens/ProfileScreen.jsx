// Profile Screen
// Display and edit user information

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZE } from '../constants/theme';
import { getProfile, updateProfile } from '../services/storageService';
import { signOut } from '../services/authService';
import { useAuth } from '../navigation/AuthContext';
import { ROUTES } from '../navigation/routes';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DISABILITY_LABELS = {
  visual_impairment: 'Visual Impairment',
  hearing_impairment: 'Hearing Impairment',
  mobility_impairment: 'Mobility Impairment',
  autism_spectrum: 'Autism Spectrum',
  sensory_sensitivity: 'Sensory Sensitivity',
  cognitive_difficulty: 'Cognitive Difficulty',
  other: 'Other',
};

const MODE_LABELS = {
  walking: 'Walking',
  bicycle: 'Bicycle',
  car: 'Car',
  public_transport: 'Public Transport',
};

const AVOID_LABELS = {
  noisy_areas: 'Noisy Areas',
  crowded_areas: 'Crowded Areas',
  poor_lighting: 'Poor Lighting',
  stairs: 'Stairs',
  unsafe_crossings: 'Unsafe Crossings',
  narrow_sidewalks: 'Narrow Sidewalks',
};

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const userProfile = await getProfile();
    setProfile(userProfile);
  };

  const handleEditProfile = () => {
    navigation.navigate(ROUTES.PROFILE_SETUP);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await signOut();
              await logout();
              navigation.replace(ROUTES.AUTH);
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Icon name="account-circle" size={80} color={COLORS.primary} />
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email || 'Guest User'}</Text>
      </View>

      {/* Personal Info Section */}
      <Card style={styles.section} shadow="medium">
        <View style={styles.sectionHeader}>
          <Icon name="account" size={24} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Personal Information</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Age</Text>
          <Text style={styles.infoValue}>{profile.age} years</Text>
        </View>
        
        {profile.gender && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>{profile.gender}</Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Sensitivity Level</Text>
          <Text style={[styles.infoValue, styles.capitalize]}>
            {profile.sensitivityLevel}
          </Text>
        </View>
      </Card>

      {/* Disability Types */}
      {profile.disabilityType?.length > 0 && (
        <Card style={styles.section} shadow="medium">
          <View style={styles.sectionHeader}>
            <Icon name="accessibility" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Disability/Condition Type</Text>
          </View>
          
          {profile.disabilityType.map((type, index) => (
            <View key={index} style={styles.tagItem}>
              <Icon name="check-circle" size={16} color={COLORS.secondary} />
              <Text style={styles.tagText}>{DISABILITY_LABELS[type] || type}</Text>
            </View>
          ))}
        </Card>
      )}

      {/* Preferred Mode */}
      <Card style={styles.section} shadow="medium">
        <View style={styles.sectionHeader}>
          <Icon name="walk" size={24} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Preferred Transport Mode</Text>
        </View>
        
        <View style={styles.tagItem}>
          <Icon name="check" size={16} color={COLORS.secondary} />
          <Text style={styles.tagText}>
            {MODE_LABELS[profile.preferredMode] || profile.preferredMode}
          </Text>
        </View>
      </Card>

      {/* Avoid Preferences */}
      {profile.avoidPreferences?.length > 0 && (
        <Card style={styles.section} shadow="medium">
          <View style={styles.sectionHeader}>
            <Icon name="alert-circle" size={24} color={COLORS.warning} />
            <Text style={styles.sectionTitle}>Things to Avoid</Text>
          </View>
          
          {profile.avoidPreferences.map((pref, index) => (
            <View key={index} style={styles.tagItem}>
              <Icon name="close-circle" size={16} color={COLORS.error} />
              <Text style={styles.tagText}>{AVOID_LABELS[pref] || pref}</Text>
            </View>
          ))}
        </Card>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Edit Profile"
          onPress={handleEditProfile}
          variant="primary"
          size="large"
          icon="pencil"
          style={styles.actionButton}
        />
        
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          size="large"
          icon="logout"
          loading={isLoading}
          style={styles.actionButton}
        />
      </View>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
};

ProfileScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.textLight,
  },
  header: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.primary,
  },
  avatarContainer: {
    marginBottom: SPACING.md,
  },
  name: {
    fontSize: FONT_SIZE.xlarge,
    fontWeight: 'bold',
    color: COLORS.textInverse,
  },
  email: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.textInverse + 'CC',
    marginTop: SPACING.xs,
  },
  section: {
    margin: SPACING.lg,
    marginBottom: 0,
    padding: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.large,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  infoLabel: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.textLight,
  },
  infoValue: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text,
    fontWeight: '500',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  tagText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  buttonContainer: {
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  actionButton: {
    marginBottom: SPACING.md,
  },
  bottomSpace: {
    height: SPACING.xxl,
  },
});

export default ProfileScreen;
