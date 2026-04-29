// Reusable Input Component
// Accessible text input with clear labels and error handling

import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder = '',
  secureTextEntry = false,
  keyboardType = 'default',
  error = null,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  autoCapitalize = 'sentences',
  autoCorrect = true,
  maxLength,
  style = {},
  inputStyle = {},
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label} accessibilityLabel={label}>
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={!disabled}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        maxLength={maxLength}
        accessibilityLabel={label || placeholder}
        accessibilityHint={placeholder}
        style={[
          styles.input,
          {
            borderColor: error ? COLORS.error : COLORS.textLight,
            backgroundColor: disabled ? COLORS.surface : COLORS.background,
            height: multiline ? Math.max(80, numberOfLines * 24) : 48,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          inputStyle,
        ]}
      />
      {error && (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
    </View>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  keyboardType: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
  numberOfLines: PropTypes.number,
  autoCapitalize: PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
  autoCorrect: PropTypes.bool,
  maxLength: PropTypes.number,
  style: PropTypes.object,
  inputStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.medium,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.medium,
    color: COLORS.text,
    minHeight: 48,
  },
  errorText: {
    fontSize: FONT_SIZE.small,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});

export default Input;
