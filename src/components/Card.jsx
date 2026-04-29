// Reusable Card Component
// Rounded corners with soft shadows

import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const Card = ({
  children,
  style = {},
  padding = 'medium',
  shadow = 'medium',
  backgroundColor = COLORS.card,
  borderRadius = BORDER_RADIUS.lg,
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return SPACING.sm;
      case 'medium':
        return SPACING.md;
      case 'large':
        return SPACING.lg;
      default:
        return SPACING.md;
    }
  };

  const getShadow = () => {
    switch (shadow) {
      case 'none':
        return {};
      case 'small':
        return SHADOWS.small;
      case 'medium':
        return SHADOWS.medium;
      case 'large':
        return SHADOWS.large;
      default:
        return SHADOWS.medium;
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          padding: getPadding(),
          backgroundColor,
          borderRadius,
          ...getShadow(),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  shadow: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  backgroundColor: PropTypes.string,
  borderRadius: PropTypes.number,
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});

export default Card;
