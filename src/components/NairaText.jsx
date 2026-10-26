// components/NairaText.jsx — Monospace Naira amount display
// Geist Mono, tabular-nums, formatNaira() everywhere

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme/tokens';
import { formatNaira, formatNairaCompact, formatNairaDisplay } from '../utils/formatNaira';

export const NairaText = ({
  amount,
  variant = 'display', // 'display' | 'body' | 'compact' | 'inline'
  showSymbol = true,
  showDecimals = true,
  color,
  style,
  testID,
  accessibilityLabel,
  ...props
}) => {
  const formatted = variant === 'compact'
    ? formatNairaCompact(amount, { showSymbol })
    : formatNaira(amount, { showSymbol, showDecimals });

  const variants = {
    display: {
      fontFamily: typography.fontFamilies.mono,
      fontSize: typography.scale.monoLarge.fontSize,
      lineHeight: typography.scale.monoLarge.lineHeight,
      fontWeight: '400',
    },
    body: {
      fontFamily: typography.fontFamilies.mono,
      fontSize: typography.scale.mono.fontSize,
      lineHeight: typography.scale.mono.lineHeight,
      fontWeight: '400',
    },
    inline: {
      fontFamily: typography.fontFamilies.mono,
      fontSize: typography.scale.bodyMedium.fontSize,
      lineHeight: typography.scale.bodyMedium.lineHeight,
      fontWeight: '500',
    },
    compact: {
      fontFamily: typography.fontFamilies.mono,
      fontSize: typography.scale.bodyMedium.fontSize,
      lineHeight: typography.scale.bodyMedium.lineHeight,
      fontWeight: '500',
    },
  };

  const v = variants[variant];

  const amountColor = color || (amount !== null && amount !== undefined && Number(amount) < 0
    ? colors.light.error
    : colors.light.textPrimary);

  return (
    <Text
      testID={testID}
      accessibilityLabel={accessibilityLabel || (showSymbol ? `₦${Number(amount).toLocaleString('en-NG')}` : String(amount))}
      accessibilityRole="text"
      style={[
        styles.base,
        v,
        { color: amountColor },
        style,
      ]}
      {...props}
    >
      {formatted}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFeatureSettings: '"tnum"', // Tabular numbers
    fontVariant: ['tabular-nums'],
  },
});

export default NairaText;