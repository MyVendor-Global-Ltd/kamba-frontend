// Skeleton loader
  const Skeleton = () => (
    <View style={[styles.skeleton, { height, borderRadius: radius.lg, width: fullWidth ? '100%' : undefined }]} />
  );

  const content = (
    <View style={[styles.content, { gap }, iconPosition === 'right' && styles.contentReverse]}>
      {iconPosition === 'left' && renderIcon(icon, v.iconColor, iconAnimatedStyle)}
      {(loading || skeleton) ? (
        <View style={styles.loader}>
          {skeleton ? (
            <View style={[styles.skeletonBar, { width: fontSize * (label?.length || 8) }]} />
          ) : (
            <Spinner />
          )}
        </View>
      ) : (
        <Text style={[
          styles.text,
          { fontSize, fontFamily: v.fontFamily || typography.fontFamilies.label, color: v.textColor },
          disabled && styles.disabledText,
        ]}>
          {label}
        </Text>
      )}
      {iconPosition === 'right' && renderIcon(icon, v.iconColor, iconAnimatedStyle)}
    </View>
  );

  const buttonContent = isGradient ? (
    <LinearGradient colors={v.gradient} style={[{ height, borderRadius: radius.lg, justifyContent: 'center', alignItems: 'center', paddingHorizontal: padding, width: fullWidth ? '100%' : 'auto' }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
      {content}
    </LinearGradient>
  ) : (
    <View style={[{ height, borderRadius: radius.lg, justifyContent: 'center', alignItems: 'center', paddingHorizontal: padding, width: fullWidth ? '100%' : 'auto' }, { backgroundColor: v.bg, borderWidth: v.borderWidth, borderColor: v.borderColor }]}>
      {content}
    </View>
  );

  return (
    <Animated.View style={[animatedStyle, style]} testID={testID}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        android_ripple={!isGradient ? { color: colors.light.accentSoft, borderless: false } : undefined}
        accessibilityLabel={accessibilityLabel || label}
        accessibilityRole={accessibilityRole}
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
        style={({ pressed }) => pressed && !disabled && !loading ? { opacity: 0.8 } : {}}
        {...props}
      >
        {skeleton || loading ? <Skeleton /> : buttonContent}
      </Pressable>
    </Animated.View>
  );
};

const Spinner = () => {
  const spin = useSharedValue(0);
  React.useEffect(() => {
    spin.value = withTiming(1, { duration: 800, easing: Easing.linear }, () => {
      spin.value = 0;
      spin.value = withTiming(1, { duration: 800, easing: Easing.linear, loop: true });
    });
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={[styles.spinner, { transform: [{ rotate }] }]} />
  );
};

const styles = StyleSheet.create({
  content: { flexDirection: 'row', alignItems: 'center' },
  contentReverse: { flexDirection: 'row-reverse' },
  text: { fontWeight: '600' },
  disabledText: { opacity: 0.5 },
  loader: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  spinner: { width: 20, height: 20, borderRadius: 10, borderWidth: 2.5, borderColor: 'currentColor', borderRightColor: 'transparent', borderTopColor: 'transparent' },
  skeleton: { backgroundColor: colors.light.border, overflow: 'hidden' },
  skeletonBar: { height: '100%', backgroundColor: colors.light.borderStrong },
});

export default MagneticButton;
// components/MagneticButton.jsx — Magnetic press physics button
// Replaces KambaButton — scale(0.96-0.98), icon slide, double-bezel variant
// Variants: primary, secondary, ghost, ussd (monospace), whatsapp (green), destructive
// Loading: skeleton not spinner

import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, radius, spacing, typography, motion, icons } from '../theme/tokens';

const PhosphorIcons = require('phosphor-react-native').default;

export const MagneticButton = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  skeleton = false,
  style,
  testID,
  accessibilityLabel,
  accessibilityRole = 'button',
  ...props
}) => {
  const pressAnim = useSharedValue(1);
  const iconSlideAnim = useSharedValue(0);

  const sizes = {
    sm: { height: 40, fontSize: typography.scale.labelMedium.fontSize, padding: spacing.md, iconSize: icons.sizes.sm, gap: spacing.xs },
    md: { height: 48, fontSize: typography.scale.labelLarge.fontSize, padding: spacing.lg, iconSize: icons.sizes.md, gap: spacing.sm },
    lg: { height: 56, fontSize: typography.scale.headlineSmall.fontSize, padding: spacing.xl, iconSize: icons.sizes.lg, gap: spacing.md },
  };

  const { height, fontSize, padding, iconSize, gap } = sizes[size];
  const pressScale = variant === 'primary' ? motion.press.primary : motion.press.secondary;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    pressAnim.value = withSpring(pressScale, { damping: 20, stiffness: 150 });
    iconSlideAnim.value = withSpring(iconPosition === 'left' ? -4 : 4, { damping: 20, stiffness: 150 });
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    pressAnim.value = withSpring(1, { damping: 20, stiffness: 150 });
    iconSlideAnim.value = withSpring(0, { damping: 20, stiffness: 150 });
  };

  const handlePress = () => {
    if (disabled || loading) return;
    onPress?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressAnim.value }],
  }), []);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: iconSlideAnim.value }],
    opacity: pressAnim.value.interpolate({ inputRange: [pressScale, 1], outputRange: [0.6, 1] }),
  }), []);

  const variantStyles = {
    primary: { gradient: ['#E85D2D', '#D64E25'], textColor: '#FFFFFF', iconColor: '#FFFFFF' },
    secondary: { bg: colors.light.surfaceElevated, borderColor: colors.light.border, textColor: colors.light.textPrimary, iconColor: colors.light.textSecondary },
    ghost: { bg: 'transparent', textColor: colors.light.accent, iconColor: colors.light.accent },
    ussd: { bg: colors.light.surfaceElevated, borderColor: colors.light.borderStrong, borderWidth: 1.5, textColor: colors.light.textPrimary, iconColor: colors.light.textSecondary, fontFamily: typography.fontFamilies.mono },
    whatsapp: { gradient: ['#25D366', '#128C7E'], textColor: '#FFFFFF', iconColor: '#FFFFFF' },
    destructive: { bg: colors.light.errorSoft, borderColor: colors.light.error, textColor: colors.light.error, iconColor: colors.light.error },
  };

  const v = variantStyles[variant];
  const isGradient = variant === 'primary' || variant === 'whatsapp';

  const renderIcon = (iconName, color, style) => {
    if (!iconName) return null;
    if (typeof iconName === 'function') return iconName({ size: iconSize, color, weight: 'bold', ...style });
    const IconComponent = PhosphorIcons[iconName];
    if (IconComponent) return <IconComponent size={iconSize} color={color} weight="bold" style={style} />;
    return null;
  };
