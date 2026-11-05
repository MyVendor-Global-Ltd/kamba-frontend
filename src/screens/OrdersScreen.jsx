import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { Package } from '../utils/phosphorIcons';

export const OrdersScreen = ({ navigation }) => (
  <ScreenShell scrollable={false} padded bg={colors.light.background}>
    <View style={styles.container}>
      <Text style={styles.eyebrow}>ORDER HISTORY</Text>
      <Text style={styles.heading}>Your orders</Text>
      <ScreenState
        type="empty"
        icon={Package}
        title="Order history is unavailable"
        description="This preview is not connected to an orders service. No sample orders are shown."
        actionLabel="Explore shops"
        onAction={() => navigation.navigate('Main', { screen: 'Discover' })}
      />
    </View>
  </ScreenShell>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.light.accent,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
    letterSpacing: 1,
  },
  heading: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.display,
    fontSize: typography.scale.displaySmall.fontSize,
    lineHeight: typography.scale.displaySmall.lineHeight,
  },
});

export default OrdersScreen;
