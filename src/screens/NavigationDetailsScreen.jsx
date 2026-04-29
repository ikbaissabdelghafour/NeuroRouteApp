// Navigation Details Screen
// Turn-by-turn instructions with accessibility notes

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { getNavigationSteps } from '../services/routeService';
import Card from '../components/Card';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NavigationDetailsScreen = ({ route, navigation }) => {
  const { route: selectedRoute } = route.params || {};
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (selectedRoute) {
      loadSteps();
    }
  }, [selectedRoute]);

  const loadSteps = async () => {
    try {
      const navigationSteps = await getNavigationSteps(selectedRoute.id);
      setSteps(navigationSteps || selectedRoute.steps || []);
    } catch (error) {
      console.error('Error loading navigation steps:', error);
      setSteps(selectedRoute.steps || []);
    }
  };

  const getDirectionIcon = (instruction) => {
    const lower = instruction.toLowerCase();
    if (lower.includes('left')) return 'arrow-left';
    if (lower.includes('right')) return 'arrow-right';
    if (lower.includes('straight') || lower.includes('continue')) return 'arrow-up';
    if (lower.includes('u-turn')) return 'u-turn-left';
    if (lower.includes('roundabout')) return 'rotate-right';
    if (lower.includes('elevator')) return 'elevator';
    return 'arrow-up';
  };

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigation complete
      setIsNavigating(false);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartNavigation = () => {
    setIsNavigating(true);
    setCurrentStep(0);
  };

  if (steps.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading navigation...</Text>
      </View>
    );
  }

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <View style={styles.container}>
      {/* Header - Current Instruction */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Step {currentStep + 1} of {steps.length}
          </Text>
        </View>

        {!isNavigating ? (
          <Card style={styles.startCard} shadow="medium">
            <Icon name="navigation" size={48} color={COLORS.primary} />
            <Text style={styles.startTitle}>Ready to Navigate?</Text>
            <Text style={styles.startSubtitle}>
              {selectedRoute.duration} min • {formatDistance(selectedRoute.distance)} • {steps.length} steps
            </Text>
            <Button
              title="Start Turn-by-Turn"
              onPress={handleStartNavigation}
              variant="primary"
              size="large"
              icon="play"
              style={styles.startButton}
            />
          </Card>
        ) : (
          <Card style={styles.instructionCard} shadow="medium">
            <View style={styles.instructionHeader}>
              <View style={styles.directionIcon}>
                <Icon
                  name={getDirectionIcon(currentStepData.instruction)}
                  size={40}
                  color={COLORS.primary}
                />
              </View>
              <View style={styles.instructionInfo}>
                <Text style={styles.instructionText}>
                  {currentStepData.instruction}
                </Text>
                <Text style={styles.distanceText}>
                  {formatDistance(currentStepData.distance)}
                </Text>
              </View>
            </View>

            {currentStepData.notes && (
              <View style={styles.notesContainer}>
                <Icon name="information" size={20} color={COLORS.info} />
                <Text style={styles.notesText}>{currentStepData.notes}</Text>
              </View>
            )}
          </Card>
        )}
      </View>

      {/* All Steps List */}
      <ScrollView style={styles.stepsList} showsVerticalScrollIndicator={false}>
        <Text style={styles.listTitle}>All Steps</Text>
        {steps.map((step, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.stepItem,
              index === currentStep && isNavigating && styles.activeStep,
              index < currentStep && isNavigating && styles.completedStep,
            ]}
            onPress={() => setCurrentStep(index)}
            disabled={!isNavigating}
          >
            <View style={styles.stepNumber}>
              <Text
                style={[
                  styles.stepNumberText,
                  index <= currentStep && isNavigating && styles.activeStepNumber,
                ]}
              >
                {index + 1}
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text
                style={[
                  styles.stepInstruction,
                  index === currentStep && isNavigating && styles.activeStepText,
                ]}
              >
                {step.instruction}
              </Text>
              <Text style={styles.stepDistance}>{formatDistance(step.distance)}</Text>
              {step.notes && (
                <Text style={styles.stepNotes}>{step.notes}</Text>
              )}
            </View>
            {index < currentStep && isNavigating && (
              <Icon name="check-circle" size={24} color={COLORS.success} />
            )}
          </TouchableOpacity>
        ))}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Navigation Controls */}
      {isNavigating && (
        <View style={styles.controls}>
          <Button
            title="Previous"
            onPress={handlePreviousStep}
            variant="outline"
            size="medium"
            icon="arrow-left"
            disabled={currentStep === 0}
            style={styles.controlButton}
          />
          <Button
            title={currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            onPress={handleNextStep}
            variant="primary"
            size="medium"
            icon={currentStep === steps.length - 1 ? 'flag-checkered' : 'arrow-right'}
            style={styles.controlButton}
          />
        </View>
      )}
    </View>
  );
};

NavigationDetailsScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      route: PropTypes.object.isRequired,
    }),
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
    padding: SPACING.lg,
    backgroundColor: COLORS.primary,
  },
  progressContainer: {
    marginBottom: SPACING.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.primaryDark,
    borderRadius: 3,
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: FONT_SIZE.small,
    color: COLORS.textInverse,
    textAlign: 'center',
  },
  startCard: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  startTitle: {
    fontSize: FONT_SIZE.xlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  startSubtitle: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  startButton: {
    minWidth: 200,
  },
  instructionCard: {
    padding: SPACING.lg,
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  instructionInfo: {
    flex: 1,
  },
  instructionText: {
    fontSize: FONT_SIZE.xlarge,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  distanceText: {
    fontSize: FONT_SIZE.large,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.info + '15',
    borderRadius: BORDER_RADIUS.md,
  },
  notesText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    flex: 1,
    lineHeight: 22,
  },
  stepsList: {
    flex: 1,
    padding: SPACING.lg,
  },
  listTitle: {
    fontSize: FONT_SIZE.large,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.surface,
  },
  activeStep: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  completedStep: {
    opacity: 0.7,
    backgroundColor: COLORS.surface,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  stepNumberText: {
    fontSize: FONT_SIZE.medium,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  activeStepNumber: {
    backgroundColor: COLORS.primary,
    color: COLORS.textInverse,
  },
  stepContent: {
    flex: 1,
  },
  stepInstruction: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text,
    fontWeight: '500',
  },
  activeStepText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  stepDistance: {
    fontSize: FONT_SIZE.small,
    color: COLORS.textLight,
    marginTop: 2,
  },
  stepNotes: {
    fontSize: FONT_SIZE.small,
    color: COLORS.info,
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
  bottomSpace: {
    height: 100,
  },
  controls: {
    flexDirection: 'row',
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
    gap: SPACING.md,
  },
  controlButton: {
    flex: 1,
  },
});

export default NavigationDetailsScreen;
