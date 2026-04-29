// Route Card Component
// Displays route option with all metrics

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import Card from './Card';
import Button from './Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RouteCard = ({ route, onSelect, isSelected = false }) => {
  const getModeIcon = () => {
    switch (route.mode) {
      case 'walking':
        return 'walk';
      case 'bicycle':
        return 'bicycle';
      case 'car':
        return 'car';
      case 'public_transport':
        return 'bus';
      default:
        return 'walk';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'low':
        return 'check-circle';
      case 'medium':
        return 'alert-circle';
      case 'high':
        return 'alert';
      default:
        return 'help-circle';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'low':
        return COLORS.levelLow;
      case 'medium':
        return COLORS.levelMedium;
      case 'high':
        return COLORS.levelHigh;
      default:
        return COLORS.textMuted;
    }
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${meters} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  return (
    <TouchableOpacity
      onPress={() => onSelect(route)}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`${route.type} route option`}
    >
      <Card
        style={[
          styles.card,
          isSelected && styles.selectedCard,
        ]}
        shadow="medium"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.typeContainer}>
            <Icon
              name={getModeIcon()}
              size={24}
              color={COLORS.primary}
              style={styles.modeIcon}
            />
            <Text style={styles.typeText}>
              {route.type.charAt(0).toUpperCase() + route.type.slice(1)}
            </Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{route.comfortScore}</Text>
            <Text style={styles.scoreLabel}>Comfort</Text>
          </View>
        </View>

        {/* Time and Distance */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Icon name="clock-outline" size={20} color={COLORS.textLight} />
            <Text style={styles.infoText}>{formatDuration(route.duration)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="map-marker-distance" size={20} color={COLORS.textLight} />
            <Text style={styles.infoText}>{formatDistance(route.distance)}</Text>
          </View>
        </View>

        {/* Level Indicators */}
        <View style={styles.levelsContainer}>
          <View style={styles.levelItem}>
            <Icon
              name={getLevelIcon(route.noiseLevel)}
              size={16}
              color={getLevelColor(route.noiseLevel)}
            />
            <Text style={styles.levelText}>
              Noise: {route.noiseLevel}
            </Text>
          </View>
          <View style={styles.levelItem}>
            <Icon
              name={getLevelIcon(route.crowdLevel)}
              size={16}
              color={getLevelColor(route.crowdLevel)}
            />
            <Text style={styles.levelText}>
              Crowd: {route.crowdLevel}
            </Text>
          </View>
        </View>

        {/* Scores */}
        <View style={styles.scoresRow}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreValue}>{route.accessibilityScore}</Text>
            <Text style={styles.scoreName}>Accessibility</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreValue}>{route.safetyScore}</Text>
            <Text style={styles.scoreName}>Safety</Text>
          </View>
        </View>

        {/* Warnings */}
        {route.warnings.length > 0 && (
          <View style={styles.warningsContainer}>
            {route.warnings.map((warning, index) => (
              <View key={index} style={styles.warningItem}>
                <Icon name="alert" size={14} color={COLORS.warning} />
                <Text style={styles.warningText}>
                  {warning.replace('_', ' ')}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Select Button */}
        <Button
          title={isSelected ? 'Selected' : 'Select Route'}
          onPress={() => onSelect(route)}
          variant={isSelected ? 'secondary' : 'primary'}
          size="small"
          style={styles.selectButton}
        />
      </Card>
    </TouchableOpacity>
  );
};

RouteCard.propTypes = {
  route: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    distance: PropTypes.number.isRequired,
    comfortScore: PropTypes.number.isRequired,
    noiseLevel: PropTypes.string.isRequired,
    crowdLevel: PropTypes.string.isRequired,
    accessibilityScore: PropTypes.number.isRequired,
    safetyScore: PropTypes.number.isRequired,
    warnings: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeIcon: {
    marginRight: SPACING.sm,
  },
  typeText: {
    fontSize: FONT_SIZE.large,
    fontWeight: '600',
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  scoreBadge: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: FONT_SIZE.xlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  scoreLabel: {
    fontSize: FONT_SIZE.small,
    color: COLORS.textLight,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  infoText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  levelsContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  levelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  levelText: {
    fontSize: FONT_SIZE.small,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
    textTransform: 'capitalize',
  },
  scoresRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  scoreName: {
    fontSize: FONT_SIZE.small,
    color: COLORS.textLight,
  },
  warningsContainer: {
    marginBottom: SPACING.md,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  warningText: {
    fontSize: FONT_SIZE.small,
    color: COLORS.warning,
    marginLeft: SPACING.xs,
    textTransform: 'capitalize',
  },
  selectButton: {
    marginTop: SPACING.sm,
  },
});

export default RouteCard;
