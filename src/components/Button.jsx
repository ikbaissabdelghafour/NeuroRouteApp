// Reusable Button Component
// Large accessible touch targets with multiple variants

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, TOUCH_TARGET } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  style = {},
  textStyle = {},
}) => {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.textMuted;
    switch (variant) {
      case 'primary':
        return COLORS.primary;
      case 'secondary':
        return COLORS.secondary;
      case 'outline':
        return 'transparent';
      case 'ghost':
        return 'transparent';
      default:
        return COLORS.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.background;
    switch (variant) {
      case 'primary':
      case 'secondary':
        return COLORS.textInverse;
      case 'outline':
      case 'ghost':
        return COLORS.primary;
      default:
        return COLORS.textInverse;
    }
  };

  const getHeight = () => {
    switch (size) {
      case 'small':
        return 40;
      case 'medium':
        return 48;
      case 'large':
        return 56;
      default:
        return 48;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return FONT_SIZE.medium;
      case 'medium':
        return FONT_SIZE.large;
      case 'large':
        return FONT_SIZE.xlarge;
      default:
        return FONT_SIZE.large;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          height: getHeight(),
          borderWidth: variant === 'outline' ? 2 : 0,
          borderColor: COLORS.primary,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && (
            <Icon
              name={icon}
              size={getFontSize()}
              color={getTextColor()}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.string,
  style: PropTypes.object,
  textStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    minWidth: TOUCH_TARGET.minWidth,
  },
  text: {
    fontWeight: '600',
  },
  icon: {
    marginRight: SPACING.sm,
  },
});

export default Button;
