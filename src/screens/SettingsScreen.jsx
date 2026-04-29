// Settings Screen
// Language, theme, and accessibility options

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZE } from '../constants/theme';
import { getSettings, saveSettings } from '../services/storageService';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LANGUAGES = [
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
  { id: 'ar', label: 'العربية', flag: '🇸🇦' },
];

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    language: 'en',
    darkMode: false,
    largeText: false,
    highContrast: false,
    voiceGuidance: false,
    vibrationAlerts: true,
    simpleInterface: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedSettings = await getSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }
  };

  const updateSetting = async (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await saveSettings(updated);
  };

  const handleLanguageChange = async (langId) => {
    setIsLoading(true);
    await updateSetting('language', langId);
    setIsLoading(false);
    Alert.alert('Language Updated', 'The app language has been changed.');
  };

  const handleReset = async () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const defaultSettings = {
              language: 'en',
              darkMode: false,
              largeText: false,
              highContrast: false,
              voiceGuidance: false,
              vibrationAlerts: true,
              simpleInterface: false,
            };
            setSettings(defaultSettings);
            await saveSettings(defaultSettings);
            Alert.alert('Settings Reset', 'All settings have been reset to default.');
          },
        },
      ]
    );
  };

  const getSettingDescription = (key) => {
    const descriptions = {
      darkMode: 'Use dark theme throughout the app',
      largeText: 'Increase text size for better readability',
      highContrast: 'Enhance contrast for better visibility',
      voiceGuidance: 'Enable voice announcements for navigation',
      vibrationAlerts: 'Vibrate for important notifications',
      simpleInterface: 'Simplify the UI with fewer elements',
    };
    return descriptions[key] || '';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Language Section */}
      <Card style={styles.section} shadow="medium">
        <View style={styles.sectionHeader}>
          <Icon name="translate" size={24} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Language</Text>
        </View>
        
        <View style={styles.languageGrid}>
          {LANGUAGES.map((lang) => (
            <Button
              key={lang.id}
              title={`${lang.flag} ${lang.label}`}
              onPress={() => handleLanguageChange(lang.id)}
              variant={settings.language === lang.id ? 'primary' : 'outline'}
              size="small"
              loading={isLoading && settings.language === lang.id}
              style={styles.languageButton}
            />
          ))}
        </View>
      </Card>

      {/* Appearance Section */}
      <Card style={styles.section} shadow="medium">
        <View style={styles.sectionHeader}>
          <Icon name="palette" size={24} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Appearance</Text>
        </View>
        
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Dark Mode</Text>
            <Text style={styles.toggleDescription}>
              {getSettingDescription('darkMode')}
            </Text>
          </View>
          <Switch
            value={settings.darkMode}
            onValueChange={(value) => updateSetting('darkMode', value)}
            trackColor={{ false: COLORS.textMuted, true: COLORS.primary }}
            thumbColor={settings.darkMode ? COLORS.secondary : COLORS.background}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Large Text</Text>
            <Text style={styles.toggleDescription}>
              {getSettingDescription('largeText')}
            </Text>
          </View>
          <Switch
            value={settings.largeText}
            onValueChange={(value) => updateSetting('largeText', value)}
            trackColor={{ false: COLORS.textMuted, true: COLORS.primary }}
            thumbColor={settings.largeText ? COLORS.secondary : COLORS.background}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>High Contrast</Text>
            <Text style={styles.toggleDescription}>
              {getSettingDescription('highContrast')}
            </Text>
          </View>
          <Switch
            value={settings.highContrast}
            onValueChange={(value) => updateSetting('highContrast', value)}
            trackColor={{ false: COLORS.textMuted, true: COLORS.primary }}
            thumbColor={settings.highContrast ? COLORS.secondary : COLORS.background}
          />
        </View>
      </Card>

      {/* Accessibility Section */}
      <Card style={styles.section} shadow="medium">
        <View style={styles.sectionHeader}>
          <Icon name="accessibility" size={24} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Accessibility Options</Text>
        </View>
        
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Voice Guidance</Text>
            <Text style={styles.toggleDescription}>
              {getSettingDescription('voiceGuidance')}
            </Text>
          </View>
          <Switch
            value={settings.voiceGuidance}
            onValueChange={(value) => updateSetting('voiceGuidance', value)}
            trackColor={{ false: COLORS.textMuted, true: COLORS.primary }}
            thumbColor={settings.voiceGuidance ? COLORS.secondary : COLORS.background}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Vibration Alerts</Text>
            <Text style={styles.toggleDescription}>
              {getSettingDescription('vibrationAlerts')}
            </Text>
          </View>
          <Switch
            value={settings.vibrationAlerts}
            onValueChange={(value) => updateSetting('vibrationAlerts', value)}
            trackColor={{ false: COLORS.textMuted, true: COLORS.primary }}
            thumbColor={settings.vibrationAlerts ? COLORS.secondary : COLORS.background}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Simple Interface</Text>
            <Text style={styles.toggleDescription}>
              {getSettingDescription('simpleInterface')}
            </Text>
          </View>
          <Switch
            value={settings.simpleInterface}
            onValueChange={(value) => updateSetting('simpleInterface', value)}
            trackColor={{ false: COLORS.textMuted, true: COLORS.primary }}
            thumbColor={settings.simpleInterface ? COLORS.secondary : COLORS.background}
          />
        </View>
      </Card>

      {/* App Info Section */}
      <Card style={styles.section} shadow="medium">
        <View style={styles.sectionHeader}>
          <Icon name="information" size={24} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>About</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App Name</Text>
          <Text style={styles.infoValue}>NeuroRoute</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Build</Text>
          <Text style={styles.infoValue}>2024.1.1</Text>
        </View>
      </Card>

      {/* Reset Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Reset to Default"
          onPress={handleReset}
          variant="outline"
          size="large"
          icon="refresh"
        />
      </View>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
};

SettingsScreen.propTypes = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  languageButton: {
    margin: SPACING.xs,
    flex: 1,
    minWidth: '45%',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  toggleInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  toggleTitle: {
    fontSize: FONT_SIZE.medium,
    fontWeight: '500',
    color: COLORS.text,
  },
  toggleDescription: {
    fontSize: FONT_SIZE.small,
    color: COLORS.textLight,
    marginTop: 2,
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
  buttonContainer: {
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  bottomSpace: {
    height: SPACING.xxl,
  },
});

export default SettingsScreen;
