// Theme constants for NeuroRoute App
// Spacing, fonts, border radius, shadows

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZE = {
  tiny: 10,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  title: 28,
  subtitle: 18,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
};

export const TOUCH_TARGET = {
  minHeight: 48,
  minWidth: 48,
};

// Accessibility settings
export const ACCESSIBILITY = {
  minFontSize: 16,
  highContrastText: '#000000',
  highContrastBackground: '#ffffff',
  animationDuration: 300,
};
