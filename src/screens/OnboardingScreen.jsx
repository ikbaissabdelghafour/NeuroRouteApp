// Onboarding Screen
// 3-page introduction to the app

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { setOnboardingCompleted } from '../services/storageService';
import { ROUTES } from '../navigation/routes';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Inclusive Navigation',
    description: 'NeuroRoute helps everyone find their way through the city, with special consideration for people with disabilities, sensory sensitivities, and neurodiverse needs.',
    icon: 'accessibility',
    color: COLORS.primary,
  },
  {
    id: '2',
    title: 'Personalized Routes',
    description: 'Tell us about your needs and preferences. We\'ll create routes that work for YOU - avoiding noisy areas, crowds, stairs, or anything that makes you uncomfortable.',
    icon: 'routes',
    color: COLORS.secondary,
  },
  {
    id: '3',
    title: 'Comfort-First Design',
    description: 'Choose routes based on comfort, not just speed. We factor in noise levels, crowd density, lighting, and accessibility to give you the best experience.',
    icon: 'heart',
    color: COLORS.info,
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      finishOnboarding();
    }
  };

  const handleSkip = () => {
    finishOnboarding();
  };

  const finishOnboarding = async () => {
    await setOnboardingCompleted();
    navigation.replace(ROUTES.AUTH);
  };

  const renderItem = ({ item }) => (
    <View style={styles.page}>
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <Icon name={item.icon} size={80} color={item.color} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {ONBOARDING_DATA.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleSkip}
        accessibilityLabel="Skip onboarding"
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Onboarding Pages */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={styles.flatList}
      />

      {/* Pagination Dots */}
      {renderDots()}

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {currentIndex < ONBOARDING_DATA.length - 1 ? (
          <Button
            title="Next"
            onPress={handleNext}
            variant="primary"
            size="large"
            icon="arrow-right"
          />
        ) : (
          <Button
            title="Get Started"
            onPress={finishOnboarding}
            variant="secondary"
            size="large"
            icon="rocket-launch"
          />
        )}
      </View>
    </View>
  );
};

OnboardingScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  skipButton: {
    position: 'absolute',
    top: SPACING.xl,
    right: SPACING.lg,
    zIndex: 1,
    padding: SPACING.sm,
  },
  skipText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.primary,
    fontWeight: '500',
  },
  flatList: {
    flexGrow: 1,
  },
  page: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.textMuted,
    marginHorizontal: SPACING.xs,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  buttonContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
});

export default OnboardingScreen;
