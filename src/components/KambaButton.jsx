import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius, shadows, motion } from '../theme';
import * as Haptics from 'expo-haptics';

export const KambaButton = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
}) => {
  const pressAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(pressAnim, {
      toValue: 0.96,
      ...motion.easing.spring,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.spring(pressAnim, {
      toValue: 1,
      ...motion.easing.spring,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (disabled || loading) return;
    onPress?.();
  };

  const sizes = {
    sm: { height: 40, fontSize: typography.scale.labelMedium.fontSize, padding: spacing.md },
    md: { height: 48, fontSize: typography.scale.labelLarge.fontSize, padding: spacing.lg },
    lg: { height: 56, fontSize: typography.scale.headlineSmall.fontSize, padding: spacing.xl },
  };

  const { height, fontSize, padding } = sizes[size];

  const styles = StyleSheet.create({
    container: {
      borderRadius: radius.lg,
      height,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.sm,
      width: fullWidth ? '100%' : 'auto',
      paddingHorizontal: padding,
    },
    primary: {
      ...shadows.accent,
    },
    secondary: {
      backgroundColor: colors.light.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.light.border,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    outlineCoral: {
      backgroundColor: colors.light.accentSoft,
      borderWidth: 1.5,
      borderColor: colors.light.accent,
    },
    textPrimary: {
      color: colors.light.onAccent,
      fontFamily: typography.fontFamilies.label,
      fontSize,
    },
    textSecondary: {
      color: colors.light.textPrimary,
      fontFamily: typography.fontFamilies.label,
      fontSize,
    },
    textGhost: {
      color: colors.light.accent,
      fontFamily: typography.fontFamilies.label,
      fontSize,
    },
    textOutlineCoral: {
      color: colors.light.accent,
      fontFamily: typography.fontFamilies.label,
      fontSize,
    },
    disabled: {
      opacity: 0.35,
    },
    loadingContainer: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    ghost: styles.ghost,
    outlineCoral: styles.outlineCoral,
  };

  const textStyles = {
    primary: styles.textPrimary,
    secondary: styles.textSecondary,
    ghost: styles.textGhost,
    outlineCoral: styles.textOutlineCoral,
  };

  const bgColors = {
    primary: null,
    secondary: colors.light.surfaceElevated,
    ghost: 'transparent',
    outlineCoral: colors.light.accentSoft,
  };

  const Content = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? colors.light.onAccent : colors.light.accent} />
      ) : icon}
      {!loading && <Text style={textStyles[variant]}>{label}</Text>}
    </View>
  );

  if (variant === 'primary') {
    return (
      <Animated.View
        style={{
          transform: [{ scale: pressAnim }],
          ...shadows.accent,
        }}
      >
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          disabled={disabled || loading}
          activeOpacity={1}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ disabled: disabled || loading, busy: loading }}
        >
          <LinearGradient
            colors={[colors.light.accent, colors.light.accentStrong]}
            style={[
              styles.container,
              variantStyles[variant],
              disabled && styles.disabled,
              style,
            ]}
          >
            <Content />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (variant === 'ghost') {
    return (
      <Animated.View
        style={{
          transform: [{ scale: pressAnim }],
        }}
      >
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          disabled={disabled || loading}
          activeOpacity={1}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ disabled: disabled || loading, busy: loading }}
        >
          <View
            style={[
              styles.container,
              variantStyles[variant],
              disabled && styles.disabled,
              style,
            ]}
          >
            <Content />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={{
        transform: [{ scale: pressAnim }],
      }}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
      >
        <View
          style={[
            styles.container,
            variantStyles[variant],
            { backgroundColor: bgColors[variant] },
            disabled && styles.disabled,
            style,
          ]}
        >
          <Content />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default KambaButton;
