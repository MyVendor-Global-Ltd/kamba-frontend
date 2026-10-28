import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius, shadows, motion } from '../theme';
import { Eye, EyeOff, CheckCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export const KambaInput = ({
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
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasSuccess, setHasSuccess] = useState(false);

  const borderAnim = useRef(new Animated.Value(1.5)).current;
  const labelAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const backgroundAnim = useRef(new Animated.Value(0)).current;

  const isSecure = secureTextEntry && !showPassword;

  useEffect(() => {
    if (error) {
      setHasError(true);
      setHasSuccess(false);
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }).start(() => {
          Animated.timing(shakeAnim, { toValue: 1, duration: 50, useNativeDriver: true }).start(() => {
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }).start(() => {
              Animated.timing(shakeAnim, { toValue: 1, duration: 50, useNativeDriver: true }).start(() => {
                Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }).start();
              });
            });
          });
        });
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else if (value && value.length > 0 && !secureTextEntry) {
      setHasSuccess(true);
      setHasError(false);
    } else {
      setHasError(false);
      setHasSuccess(false);
    }
  }, [error, value, secureTextEntry]);

  useEffect(() => {
    if (focused) {
      Animated.timing(borderAnim, {
        toValue: 2,
        duration: motion.duration.fast,
        useNativeDriver: false,
      }).start();
      Animated.timing(labelAnim, {
        toValue: 1,
        duration: motion.duration.fast,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
      Animated.timing(backgroundAnim, {
        toValue: 1,
        duration: motion.duration.fast,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(borderAnim, {
        toValue: 1.5,
        duration: motion.duration.fast,
        useNativeDriver: false,
      }).start();
      Animated.timing(labelAnim, {
        toValue: value && value.length > 0 ? 1 : 0,
        duration: motion.duration.fast,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
      Animated.timing(backgroundAnim, {
        toValue: 0,
        duration: motion.duration.fast,
        useNativeDriver: false,
      }).start();
    }
  }, [focused, value]);

  const shakeX = shakeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  const labelTranslateY = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -22],
  });

  const labelScale = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.75],
  });

  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textSecondary, colors.coral],
  });

  const borderColor = focused
    ? colors.coral
    : hasError
    ? colors.error
    : hasSuccess
    ? colors.success
    : colors.inkBorder;

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      gap: spacing.xs,
    },
    labelWrapper: {
      position: 'absolute',
      top: 16,
      left: 18,
      pointerEvents: 'none',
      zIndex: 1,
    },
    label: {
      fontFamily: typography.fontFamilies.bodyMedium,
      fontSize: typography.scale.labelMedium.fontSize,
      letterSpacing: 0.5,
      backgroundColor: colors.inkRaised,
      paddingHorizontal: 4,
    },
    inputWrapper: {
      backgroundColor: colors.inkRaised,
      borderRadius: radius.lg,
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 18,
      overflow: 'hidden',
    },
    input: {
      flex: 1,
      fontFamily: typography.fontFamilies.body,
      fontSize: typography.scale.bodyMedium.fontSize,
      color: colors.textPrimary,
      paddingVertical: 0,
    },
    leftElement: {
      marginRight: spacing.sm,
      color: colors.textTertiary,
    },
    rightElement: {
      marginLeft: spacing.sm,
    },
    errorText: {
      fontFamily: typography.fontFamilies.body,
      fontSize: typography.scale.labelSmall.fontSize,
      color: colors.error,
      marginLeft: spacing.xs,
    },
    hintText: {
      fontFamily: typography.fontFamilies.body,
      fontSize: typography.scale.labelSmall.fontSize,
      color: colors.textTertiary,
      marginLeft: spacing.xs,
    },
    successIcon: {
      marginLeft: spacing.sm,
    },
  });

  const animatedInputStyle = {
    transform: [{ translateX: shakeX }],
    borderWidth: borderAnim,
    borderColor,
    backgroundColor: focused ? colors.coralDim : colors.inkRaised,
  };

  const animatedLabelStyle = {
    transform: [
      { translateY: labelTranslateY },
      { scale: labelScale },
    ],
    color: labelColor,
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      {label && (
        <Animated.View style={styles.labelWrapper}>
          <Animated.Text style={[styles.label, animatedLabelStyle, labelStyle]}>
            {label}
          </Animated.Text>
        </Animated.View>
      )}
      <Animated.View style={[styles.inputWrapper, animatedInputStyle, inputStyle]}>
        {leftElement && <View style={styles.leftElement}>{leftElement}</View>}
        <TextInput
          testID={testID}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          editable={editable}
          autoFocus={autoFocus}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          textContentType={textContentType}
          style={[styles.input, { fontFamily: secureTextEntry ? typography.fontFamilies.mono : typography.fontFamilies.body }]}
          caretColor={colors.coral}
          selectionColor={colors.coralDim}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightElement}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowPassword(!showPassword);
            }}
            accessible
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <Eye size={20} color={colors.textTertiary} strokeWidth={2} />
            ) : (
              <EyeOff size={20} color={colors.textTertiary} strokeWidth={2} />
            )}
          </TouchableOpacity>
        )}
        {rightElement && !secureTextEntry && (
          <View style={styles.rightElement}>{rightElement}</View>
        )}
        {hasSuccess && !secureTextEntry && (
          <CheckCircle size={20} color={colors.success} strokeWidth={2.5} style={styles.successIcon} />
        )}
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
};

export default KambaInput;
