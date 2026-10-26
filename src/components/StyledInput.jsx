return (
    <View style={[styles.container, containerStyle, style]}>
      {(label || required) && (
        <Animated.View style={styles.labelWrapper}>
          <Animated.Text style={[styles.label, animatedLabelStyle, labelStyle]}>
            {label}
            {required && <Text style={styles.requiredStar}> *</Text>}
          </Animated.Text>
        </Animated.View>
      )}
      <Animated.View style={[styles.inputWrapper, animatedInputStyle, inputStyle]}>
        {leftElement && <View style={styles.leftElement}>{leftElement}</View>}
        <TextInput
          testID={testID}
          placeholder={placeholder}
          placeholderTextColor={colors.light.textMuted}
          value={displayValue}
          onChangeText={handleChangeText}
          onBlur={handleBlur}
          onFocus={handleFocus}
          secureTextEntry={isSecure}
          keyboardType={formatNairaProp ? 'numeric' : keyboardType}
          editable={editable && !disabled}
          autoFocus={autoFocus}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          textContentType={textContentType}
          style={[
            styles.input,
            {
              fontFamily: formatNairaProp ? typography.fontFamilies.mono : isSecure ? typography.fontFamilies.mono : typography.fontFamilies.body,
              color: colors.light.textPrimary,
            },
          ]}
          caretColor={colors.light.accent}
          selectionColor={colors.light.accentSoft}
          disabled={disabled}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightElement}
            onPress={togglePassword}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {showPassword ? renderIcon('EyeOff', colors.light.textMuted) : renderIcon('Eye', colors.light.textMuted)}
          </TouchableOpacity>
        )}
        {rightElement && !secureTextEntry && <View style={styles.rightElement}>{rightElement}</View>}
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
      {showCounterText && (
        <Text style={[styles.counterText, localValue.length > counterMax ? { color: colors.light.error } : { color: colors.light.textMuted }]}>
          {localValue.length}/{counterMax}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  labelWrapper: { paddingHorizontal: spacing.xs },
  label: {
    fontFamily: typography.fontFamilies.title,
    fontSize: typography.scale.titleSmall.fontSize,
    lineHeight: typography.scale.titleSmall.lineHeight,
    letterSpacing: typography.scale.titleSmall.letterSpacing,
  },
  requiredStar: { color: colors.light.error },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: typography.scale.bodyMedium.fontSize,
    lineHeight: typography.scale.bodyMedium.lineHeight,
    paddingVertical: spacing.sm,
  },
  leftElement: { marginRight: spacing.sm },
  rightElement: { marginLeft: spacing.sm },
  errorText: {
    fontFamily: typography.fontFamilies.caption,
    fontSize: typography.scale.labelSmall.fontSize,
    lineHeight: typography.scale.labelSmall.lineHeight,
    color: colors.light.error,
    marginLeft: spacing.xs,
  },
  hintText: {
    fontFamily: typography.fontFamilies.caption,
    fontSize: typography.scale.labelSmall.fontSize,
    lineHeight: typography.scale.labelSmall.lineHeight,
    color: colors.light.textMuted,
    marginLeft: spacing.xs,
  },
  counterText: {
    fontFamily: typography.fontFamilies.caption,
    fontSize: typography.scale.labelSmall.fontSize,
    lineHeight: typography.scale.labelSmall.lineHeight,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
});

export default StyledInput;
// components/StyledInput.jsx — Label above, helper text, error state, formatNaira prop
// Replaces KambaInput — double-bezel wrapper, secureTextEntry toggle, Geist Mono for numbers

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, radius, spacing, typography, motion, icons } from '../theme/tokens';
import { formatNaira, parseNaira } from '../utils/formatNaira';

const PhosphorIcons = require('phosphor-react-native').default;

export const StyledInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  hint,
  secureTextEntry = false,
  keyboardType = 'default',
  rightElement,
  leftElement,
  editable = true,
  autoFocus = false,
  maxLength,
  style,
  inputStyle,
  containerStyle,
  labelStyle,
  onBlur,
  onFocus,
  testID,
  autoCapitalize = 'sentences',
  autoCorrect = true,
  returnKeyType = 'done',
  onSubmitEditing,
  textContentType,
  formatNaira: formatNairaProp = false,
  showCounter = false,
  counterMax,
  disabled = false,
  required = false,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');
  const [hasError, setHasError] = useState(false);

  const borderAnim = useSharedValue(1);
  const labelAnim = useSharedValue(0);
  const backgroundAnim = useSharedValue(0);
  const shakeAnim = useSharedValue(0);

  const isSecure = secureTextEntry && !showPassword;
  const displayValue = formatNairaProp && localValue ? formatNaira(parseNaira(localValue), { showSymbol: false }) : localValue;

  useEffect(() => {
    if (value !== undefined && value !== localValue) {
      setLocalValue(value || '');
    }
  }, [value]);

  useEffect(() => {
    if (error) {
      setHasError(true);
      shakeAnim.value = withTiming(1, { duration: 50, easing: Easing.linear }, () => {
        shakeAnim.value = withTiming(0, { duration: 50 });
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      setHasError(false);
    }
  }, [error]);

  useEffect(() => {
    if (focused) {
      borderAnim.value = withTiming(2, { duration: motion.duration.fast });
      labelAnim.value = withTiming(1, { duration: motion.duration.fast, easing: Easing.out(Easing.cubic) });
      backgroundAnim.value = withTiming(1, { duration: motion.duration.fast });
    } else {
      borderAnim.value = withTiming(1, { duration: motion.duration.fast });
      labelAnim.value = withTiming(localValue.length > 0 ? 1 : 0, { duration: motion.duration.fast, easing: Easing.out(Easing.cubic) });
      backgroundAnim.value = withTiming(0, { duration: motion.duration.fast });
    }
  }, [focused, localValue]);

  const animatedInputStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnim.value.interpolate({ inputRange: [0, 1], outputRange: [0, 10] }) }],
    borderWidth: borderAnim.value,
    borderColor: hasError ? colors.light.error : focused ? colors.light.accent : colors.light.border,
    backgroundColor: focused ? colors.light.accentHover : colors.light.surface,
  }), []);

  const animatedLabelStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: labelAnim.value.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) },
      { scale: labelAnim.value.interpolate({ inputRange: [0, 1], outputRange: [1, 0.85] }) },
    ],
    color: hasError ? colors.light.error : focused ? colors.light.accent : colors.light.textMuted,
  }), []);

  const handleChangeText = (text) => {
    let processedText = text;
    if (formatNairaProp) {
      processedText = text.replace(/[^0-9.,]/g, '');
    }
    setLocalValue(processedText);
    onChangeText?.(processedText);
  };

  const handleBlur = (e) => { setFocused(false); onBlur?.(e); };
  const handleFocus = (e) => { setFocused(true); onFocus?.(e); };

  const togglePassword = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowPassword(!showPassword);
  };

  const renderIcon = (iconName, color, style) => {
    if (!iconName) return null;
    if (typeof iconName === 'function') return iconName({ size: icons.sizes.md, color, weight: 'bold', ...style });
    const IconComponent = PhosphorIcons[iconName];
    if (IconComponent) return <IconComponent size={icons.sizes.md} color={color} weight="bold" style={style} />;
    return null;
  };

  const showCounterText = showCounter && counterMax && localValue.length > 0;
