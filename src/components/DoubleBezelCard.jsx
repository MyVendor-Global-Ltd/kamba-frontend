// components/DoubleBezelCard.jsx — Double-bezel card architecture
// Outer shell: borderWidth: 0.5, borderColor: border, padding: 2, borderRadius: 18/20
// Inner core: borderRadius: 16, background: surface
// Replaces GlowCard — no glow, pure structural elegance

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { colors, radius, shadows, spacing } from '../theme/tokens';

export const DoubleBezelCard = ({
  children,
  variant = 'default', // 'default' | 'elevated' | 'balance' | 'interactive'
  onPress,
  pressScale = 0.98,
  style,
  testID,
  accessibilityLabel,
  accessibilityRole,
  ...props
}) => {
  const pressAnim = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressAnim.value }],
  }), []);

  const handlePressIn = () => {
    pressAnim.value = withSpring(pressScale, { damping: 20, stiffness: 150 });
  };

  const handlePressOut = () => {
    pressAnim.value = withSpring(1, { damping: 20, stiffness: 150 });
  };

  const handlePress = () => {
    onPress?.();
  };

  // Variant configurations
  const variants = {
    default: {
      outerRadius: radius.xl,      // 16
      innerRadius: radius.xl,      // 16
      outerPadding: 2,
      innerPadding: spacing.xl,    // 24
      shadow: shadows.card,
    },
    elevated: {
      outerRadius: radius.xl,
      innerRadius: radius.xl,
      outerPadding: 2,
      innerPadding: spacing.xl,
      shadow: shadows.cardElevated,
    },
    balance: {
      outerRadius: radius.xxl,     // 20
      innerRadius: radius.xl,      // 18 (16 + 2 padding)
      outerPadding: 2,
      innerPadding: spacing.xl,
      shadow: shadows.cardElevated,
    },
    interactive: {
      outerRadius: radius.xl,
      innerRadius: radius.xl,
      outerPadding: 2,
      innerPadding: spacing.xl,
      shadow: shadows.card,
    },
  };

  const config = variants[variant];
  const outerBg = colors.light.border;
  const innerBg = colors.light.surface;

  const OuterShell = onPress ? (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      android_ripple={{ color: colors.light.accentSoft, borderless: false }}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole || 'button'}
      testID={testID}
      style={({ pressed }) => [
        styles.outerShell,
        {
          borderRadius: config.outerRadius,
          padding: config.outerPadding,
          backgroundColor: outerBg,
          ...config.shadow,
        },
        animatedStyle,
        style,
      ]}
      {...props}
    >
      <View style={[
        styles.innerCore,
        {
          borderRadius: config.innerRadius,
          padding: config.innerPadding,
          backgroundColor: innerBg,
        },
      ]}>
        {children}
      </View>
    </Pressable>
  ) : (
    <View
      style={[
        styles.outerShell,
        {
          borderRadius: config.outerRadius,
          padding: config.outerPadding,
          backgroundColor: outerBg,
          ...config.shadow,
        },
        style,
      ]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      {...props}
    >
      <View style={[
        styles.innerCore,
        {
          borderRadius: config.innerRadius,
          padding: config.innerPadding,
          backgroundColor: innerBg,
        },
      ]}>
        {children}
      </View>
    </View>
  );

  return <Animated.View>{OuterShell}</Animated.View>;
};

const styles = StyleSheet.create({
  outerShell: {
    borderWidth: 0.5,
    borderColor: colors.light.borderStrong,
  },
  innerCore: {
    // Background and borderRadius applied inline for variant support
  },
});

export default DoubleBezelCard;