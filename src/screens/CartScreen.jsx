import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { ShoppingBag } from '../utils/phosphorIcons';

export const CartScreen = ({ navigation }) => (
  <ScreenShell scrollable={false} padded bg={colors.light.background}>
    <View style={styles.container}>
      <Text style={styles.eyebrow}>YOUR CART</Text>
      <ScreenState
        type="empty"
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Product listings and cart support are not connected in this preview. No sample items or charges are shown."
        actionLabel="Explore shops"
        onAction={() => navigation.navigate('Discover')}
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
    textAlign: 'center',
  },
});

export default CartScreen;
