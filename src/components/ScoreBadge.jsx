// Score Badge Component
// Displays comfort, safety, accessibility scores with color coding

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const ScoreBadge = ({
  score,
  label,
  size = 'medium',
  showLabel = true,
}) => {
  const getScoreColor = () => {
    if (score >= 80) return COLORS.scoreHigh;
    if (score >= 60) return COLORS.scoreMedium;
    return COLORS.scoreLow;
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getDimensions = () => {
    switch (size) {
      case 'small':
        return { size: 32, fontSize: FONT_SIZE.small, badgeSize: 16 };
      case 'medium':
        return { size: 48, fontSize: FONT_SIZE.large, badgeSize: 24 };
      case 'large':
        return { size: 64, fontSize: FONT_SIZE.xlarge, badgeSize: 32 };
      default:
        return { size: 48, fontSize: FONT_SIZE.large, badgeSize: 24 };
    }
  };

  const dimensions = getDimensions();
  const scoreColor = getScoreColor();

  return (
    <View style={styles.container}>
      {showLabel && (
        <Text style={[styles.label, { fontSize: dimensions.fontSize * 0.7 }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.badge,
          {
            width: dimensions.size,
            height: dimensions.size,
            borderRadius: dimensions.size / 2,
            backgroundColor: scoreColor,
          },
        ]}
      >
        <Text
          style={[
            styles.scoreText,
            { fontSize: dimensions.fontSize, color: COLORS.textInverse },
          ]}
        >
          {score}
        </Text>
      </View>
      <Text style={[styles.scoreLabel, { fontSize: dimensions.fontSize * 0.6 }]}>
        {getScoreLabel()}
      </Text>
    </View>
  );
};

ScoreBadge.propTypes = {
  score: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showLabel: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: SPACING.sm,
  },
  label: {
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  scoreText: {
    fontWeight: 'bold',
  },
  scoreLabel: {
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
});

export default ScoreBadge;
