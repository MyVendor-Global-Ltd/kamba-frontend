// components/USSDBanner.jsx — Offline fallback banner
// "Offline? Dial *901#" — maps to real USSD codes per action

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { colors, spacing, typography, radius, icons, motion } from '../theme/tokens';
import { getUssdCode } from '../utils/ussdMap';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const PhosphorIcons = require('phosphor-react-native').default;

export const USSDBanner = ({
  action, // 'airtime' | 'sendMoney' | 'balance' | 'agent' | 'bills' | 'help'
  params = {},
  customMessage,
  onDismiss,
  onDial,
  style,
  testID,
}) => {
  const { isOffline } = useNetworkStatus();
  const [visible, setVisible] = React.useState(false);
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (isOffline && !visible) {
      setVisible(true);
      translateY.value = withSpring(0, { damping: 20, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 300 });
    } else if (!isOffline && visible) {
      opacity.value = withTiming(0, { duration: 200 }, () => {
        translateY.value = withSpring(50, { damping: 20, stiffness: 150 });
        setVisible(false);
      });
    }
  }, [isOffline]);

  React.useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        if (visible) {
          opacity.value = withTiming(0, { duration: 300 }, () => {
            translateY.value = withSpring(50, { damping: 20, stiffness: 150 });
            setVisible(false);
          });
        }
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const ussdCode = customMessage || getUssdCode(action, params);
  const actionLabel = action ? action.charAt(0).toUpperCase() + action.slice(1) : 'Banking';

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }), []);

  const handleDial = () => {
    onDial?.(ussdCode);
    // In real app: Linking.openURL(`tel:${ussdCode}`)
  };

  const handleDismiss = () => {
    opacity.value = withTiming(0, { duration: 200 }, () => {
      translateY.value = withSpring(50, { damping: 20, stiffness: 150 });
      setVisible(false);
    });
    onDismiss?.();
  };

  return (
    <Animated.View style={[styles.container, animatedStyle, style]} testID={testID}>
      <View style={styles.content}>
        <PhosphorIcons.WifiOff size={icons.sizes.sm} color={colors.light.warning} weight="bold" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>You're offline</Text>
          <Text style={styles.code}>{ussdCode}</Text>
        </View>
        <TouchableOpacity
          style={styles.dialButton}
          onPress={handleDial}
          accessibilityLabel={`Dial ${ussdCode} for ${actionLabel}`}
          accessibilityRole="button"
        >
          <Text style={styles.dialButtonText}>Dial</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={handleDismiss}
          accessibilityLabel="Dismiss"
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <PhosphorIcons.X size={icons.sizes.sm} color={colors.light.textMuted} weight="bold" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    pointerEvents: 'box-none',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.light.warningSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.warning,
    ...colors.light.warningSoft,
  },
  textContainer: { flex: 1, gap: 2 },
  title: {
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelMedium.fontSize,
    lineHeight: typography.scale.labelMedium.lineHeight,
    color: colors.light.warning,
  },
  code: {
    fontFamily: typography.fontFamilies.mono,
    fontSize: typography.scale.mono.fontSize,
    lineHeight: typography.scale.mono.lineHeight,
    color: colors.light.textPrimary,
    letterSpacing: 0.5,
  },
  dialButton: {
    backgroundColor: colors.light.warning,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  dialButtonText: {
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
    color: '#FFFFFF',
  },
  dismissButton: { padding: spacing.xs },
});

export default USSDBanner;