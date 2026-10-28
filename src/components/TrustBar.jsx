// components/TrustBar.jsx — Trust signals on Home screen
// "CBN Licensed • NDIC Insured • 50k+ Agents"

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import { colors, spacing, typography, icons } from '../theme/tokens';

const PhosphorIcons = require('phosphor-react-native').default;

export const TrustBar = ({
  items = [
    { icon: 'ShieldCheck', text: 'CBN Licensed' },
    { icon: 'BadgeCheck', text: 'NDIC Insured' },
    { icon: 'Users', text: '50k+ Agents' },
  ],
  style,
  testID,
}) => {
  const fadeAnim = useSharedValue(0);

  React.useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 600, delay: 200 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: interpolate(fadeAnim.value, [0, 1], [10, 0]) }],
  }), []);

  return (
    <Animated.View style={[styles.container, animatedStyle, style]} testID={testID}>
      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          <PhosphorIcons[item.icon] size={icons.sizes.xs} color={colors.light.textSecondary} weight="bold" style={styles.icon} />
          <Text style={styles.text}>{item.text}</Text>
          {index < items.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.light.accentSoft,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.light.border,
  },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  icon: { marginRight: spacing.xs },
  text: {
    fontFamily: typography.fontFamilies.caption,
    fontSize: typography.scale.labelSmall.fontSize,
    lineHeight: typography.scale.labelSmall.lineHeight,
    letterSpacing: typography.scale.labelSmall.letterSpacing,
    color: colors.light.textSecondary,
  },
  divider: { width: 1, height: 12, backgroundColor: colors.light.border, marginHorizontal: spacing.sm },
});

export default TrustBar;
