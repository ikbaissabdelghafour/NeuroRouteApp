// Profile Setup Screen
// User fills in personal information and preferences

import React, { useState } from 'react';
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
import { saveProfile, updateProfile } from '../services/storageService';
import { useAuth } from '../navigation/AuthContext';
import { ROUTES } from '../navigation/routes';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

const DISABILITY_OPTIONS = [
  { id: 'visual_impairment', label: 'Visual Impairment' },
  { id: 'hearing_impairment', label: 'Hearing Impairment' },
  { id: 'mobility_impairment', label: 'Mobility Impairment' },
  { id: 'autism_spectrum', label: 'Autism Spectrum' },
  { id: 'sensory_sensitivity', label: 'Sensory Sensitivity' },
  { id: 'cognitive_difficulty', label: 'Cognitive Difficulty' },
  { id: 'other', label: 'Other' },
];

const MOBILITY_OPTIONS = [
  { id: 'walking', label: 'Walking', icon: 'walk' },
  { id: 'bicycle', label: 'Bicycle', icon: 'bicycle' },
  { id: 'car', label: 'Car', icon: 'car' },
  { id: 'public_transport', label: 'Public Transport', icon: 'bus' },
];

const SENSITIVITY_OPTIONS = [
  { id: 'low', label: 'Low', description: 'Minimal accommodation needed' },
  { id: 'medium', label: 'Medium', description: 'Some accommodations preferred' },
  { id: 'high', label: 'High', description: 'Maximum comfort priority' },
];

const AVOID_OPTIONS = [
  { id: 'noisy_areas', label: 'Noisy Areas' },
  { id: 'crowded_areas', label: 'Crowded Areas' },
  { id: 'poor_lighting', label: 'Poor Lighting' },
  { id: 'stairs', label: 'Stairs' },
  { id: 'unsafe_crossings', label: 'Unsafe Crossings' },
  { id: 'narrow_sidewalks', label: 'Narrow Sidewalks' },
];

const ProfileSetupScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: '',
    gender: '',
    disabilityType: [],
    sensitivityLevel: 'medium',
    preferredMode: 'walking',
    avoidPreferences: [],
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSelection = (field, value) => {
    setFormData(prev => {
      const current = prev[field];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return false;
    }
    if (!formData.age || isNaN(formData.age) || parseInt(formData.age) < 1) {
      Alert.alert('Required', 'Please enter a valid age');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const profile = {
        ...formData,
        age: parseInt(formData.age),
        id: user?.id || `user_${Date.now()}`,
      };

      await updateProfile(profile);
      await updateUser(profile);

      Alert.alert(
        'Profile Saved',
        'Your preferences have been saved successfully!',
        [
          {
            text: 'Get Started',
            onPress: () => navigation.replace(ROUTES.HOME),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Set Up Your Profile</Text>
        <Text style={styles.subtitle}>
          This helps us personalize your navigation experience
        </Text>

        {/* Personal Information */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <Input
            label="Full Name"
            value={formData.name}
            onChangeText={(text) => updateField('name', text)}
            placeholder="Enter your full name"
          />

          <Input
            label="Age"
            value={formData.age}
            onChangeText={(text) => updateField('age', text)}
            placeholder="Enter your age"
            keyboardType="numeric"
            maxLength={3}
          />

          <Input
            label="Gender (Optional)"
            value={formData.gender}
            onChangeText={(text) => updateField('gender', text)}
            placeholder="Enter your gender"
          />
        </Card>

        {/* Disability Type */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Disability or Condition Type</Text>
          <Text style={styles.sectionSubtitle}>Select all that apply</Text>
          
          <View style={styles.optionsGrid}>
            {DISABILITY_OPTIONS.map((option) => (
              <Button
                key={option.id}
                title={option.label}
                onPress={() => toggleSelection('disabilityType', option.id)}
                variant={formData.disabilityType.includes(option.id) ? 'primary' : 'outline'}
                size="small"
                style={styles.optionButton}
              />
            ))}
          </View>
        </Card>

        {/* Sensitivity Level */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Sensitivity Level</Text>
          
          {SENSITIVITY_OPTIONS.map((option) => (
            <Button
              key={option.id}
              title={`${option.label} - ${option.description}`}
              onPress={() => updateField('sensitivityLevel', option.id)}
              variant={formData.sensitivityLevel === option.id ? 'primary' : 'outline'}
              size="small"
              style={styles.levelButton}
            />
          ))}
        </Card>

        {/* Preferred Mobility Mode */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Mode of Transport</Text>
          
          <View style={styles.optionsGrid}>
            {MOBILITY_OPTIONS.map((option) => (
              <Button
                key={option.id}
                title={option.label}
                onPress={() => updateField('preferredMode', option.id)}
                variant={formData.preferredMode === option.id ? 'primary' : 'outline'}
                size="small"
                icon={option.icon}
                style={styles.optionButton}
              />
            ))}
          </View>
        </Card>

        {/* Avoid Preferences */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Things to Avoid</Text>
          <Text style={styles.sectionSubtitle}>Select what makes you uncomfortable</Text>
          
          <View style={styles.optionsGrid}>
            {AVOID_OPTIONS.map((option) => (
              <Button
                key={option.id}
                title={option.label}
                onPress={() => toggleSelection('avoidPreferences', option.id)}
                variant={formData.avoidPreferences.includes(option.id) ? 'secondary' : 'outline'}
                size="small"
                style={styles.optionButton}
              />
            ))}
          </View>
        </Card>

        {/* Save Button */}
        <Button
          title="Save Profile"
          onPress={handleSave}
          variant="primary"
          size="large"
          loading={isLoading}
          style={styles.saveButton}
        />
      </View>
    </ScrollView>
  );
};

ProfileSetupScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZE.xlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.large,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  optionButton: {
    margin: SPACING.xs,
    flex: 1,
    minWidth: '45%',
  },
  levelButton: {
    marginBottom: SPACING.sm,
  },
  saveButton: {
    marginTop: SPACING.lg,
  },
});

export default ProfileSetupScreen;
