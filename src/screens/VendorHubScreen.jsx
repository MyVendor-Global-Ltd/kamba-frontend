import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { KambaTextileMotif } from '../components/KambaTextileMotif';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { Storefront } from '../utils/phosphorIcons';

export const VendorHubScreen = ({ navigation }) => (
  <ScreenShell scrollable padded bg={colors.light.background}>
    <View style={styles.container}>
      <View style={styles.hero}>
        <KambaTextileMotif
          width={250}
          height={150}
          color={colors.light.onAccent}
          opacity={0.12}
          style={styles.heroPattern}
        />
        <View style={styles.heroIcon}>
          <Storefront size={26} color={colors.light.onAccent} weight="regular" />
        </View>
        <Text style={styles.eyebrow}>FOR LOCAL SELLERS</Text>
        <Text style={styles.heroTitle}>A marketplace built around your community.</Text>
      </View>

      <ScreenState
        type="empty"
        icon={Storefront}
        title="Seller tools are not connected"
        description="This preview cannot register vendors, create shops, list products, or manage orders. No seller account or store will be created."
        actionLabel="Browse local shops"
        onAction={() => navigation.navigate('Main', { screen: 'Discover' })}
      />
    </View>
  </ScreenShell>
);

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  hero: {
    position: 'relative',
    overflow: 'hidden',
    gap: spacing.sm,
    padding: spacing.xl,
    borderRadius: radius.xxl,
    backgroundColor: colors.light.accentStrong,
  },
  heroPattern: {
    position: 'absolute',
    top: 0,
    right: -24,
  },
  heroIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.light.accent,
  },
  eyebrow: {
    marginTop: spacing.sm,
    color: colors.light.gold,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
    letterSpacing: 1,
  },
  heroTitle: {
    maxWidth: 300,
    color: colors.light.onAccent,
    fontFamily: typography.fontFamilies.display,
    fontSize: typography.scale.displaySmall.fontSize,
    lineHeight: typography.scale.displaySmall.lineHeight,
  },
});

export default VendorHubScreen;
