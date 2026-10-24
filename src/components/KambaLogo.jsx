import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, typography, spacing } from '../theme';

const BagIcon = ({ size = 32, color = colors.coral }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4" />
    <Path d="M3 6h18" />
    <Path d="M16 10a4 4 0 0 1-8 0" />
    <Circle cx={18.5} cy={5.5} r={2} fill={colors.gold} />
  </Svg>
);

export const KambaLogo = ({ size = 28, variant = 'full', color = colors.coral, style }) => {
  const logoSize = size;
  const textSize = size * 1.15;

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    wordmark: {
      fontFamily: typography.fontFamilies.displayHeavy,
      fontSize: textSize,
      color,
      letterSpacing: typography.letterSpacing.tight,
    },
  });

  if (variant === 'icon') {
    return <BagIcon size={logoSize} color={color} style={style} />;
  }

  if (variant === 'wordmark') {
    return <Text style={[styles.wordmark, style]}>kamba</Text>;
  }

  return (
    <View style={[styles.container, style]}>
      <BagIcon size={logoSize} color={color} />
      <Text style={styles.wordmark}>kamba</Text>
    </View>
  );
};

export default KambaLogo;