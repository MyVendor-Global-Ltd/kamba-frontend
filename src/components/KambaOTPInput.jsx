import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius, shadows } from '../theme';
import * as Haptics from 'expo-haptics';

export const KambaOTPInput = ({
  value = '',
  onChangeText,
  onComplete,
  autoFocus = true,
  style,
  error = false,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [errorState, setErrorState] = useState(false);

  const inputRef = useRef(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const currentValue = value !== undefined ? value : internalValue;

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (error) {
      setErrorState(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 45, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 45, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 45, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 45, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 4, duration: 45, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 45, useNativeDriver: true }),
      ]).start(() => {
        const timer = setTimeout(() => setErrorState(false), 800);
        return () => clearTimeout(timer);
      });
    }
  }, [error]);

  const handleChangeText = useCallback(
    (text) => {
      const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
      setInternalValue(cleaned);
      onChangeText?.(cleaned);
      setFocusedIndex(cleaned.length < 6 ? cleaned.length : 5);

      if (cleaned.length === 6) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onComplete?.(cleaned);
      }
    },
    [onChangeText, onComplete]
  );

  const handleBoxPress = () => {
    inputRef.current?.focus();
  };

  const digits = (currentValue || '').split('');

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: shakeAnim }] }, style]}>
      {/* Hidden native TextInput taking keyboard focus */}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={currentValue}
        onChangeText={handleChangeText}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoFocus={autoFocus}
        maxLength={6}
        selectionColor="transparent"
        caretHidden
      />

      {/* 6 Digit Visible Boxes */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleBoxPress}
        style={styles.boxesRow}
      >
        {Array.from({ length: 6 }).map((_, i) => {
          const char = digits[i] || '';
          const isFocused = i === (currentValue.length < 6 ? currentValue.length : 5);
          const isFilled = Boolean(char);

          return (
            <View
              key={i}
              style={[
                styles.box,
                isFocused && styles.boxFocused,
                isFilled && styles.boxFilled,
                errorState && styles.boxError,
              ]}
            >
              <Text
                style={[
                  styles.boxText,
                  isFocused && styles.boxTextFocused,
                  errorState && styles.boxTextError,
                ]}
              >
                {char}
              </Text>

              {/* Gold underline on filled boxes per spec */}
              {isFilled && !errorState && <View style={styles.goldUnderline} />}
            </View>
          );
        })}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  boxesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 50,
    height: 60,
    backgroundColor: colors.inkRaised,
    borderWidth: 1.5,
    borderColor: colors.inkBorder,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  boxFocused: {
    borderColor: colors.coral,
    backgroundColor: colors.coralDim,
    transform: [{ scale: 1.05 }],
    ...shadows.coral,
  },
  boxFilled: {
    borderColor: colors.coral,
    backgroundColor: colors.inkRaised,
  },
  boxError: {
    borderColor: colors.error,
    backgroundColor: 'rgba(255, 71, 87, 0.12)',
  },
  boxText: {
    fontFamily: typography.fontFamilies.displayHeavy,
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  boxTextFocused: {
    color: colors.coral,
  },
  boxTextError: {
    color: colors.error,
  },
  goldUnderline: {
    position: 'absolute',
    bottom: 4,
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: colors.gold,
    borderRadius: 1,
  },
});

export default KambaOTPInput;