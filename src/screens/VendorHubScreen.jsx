import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { KambaTextileMotif } from '../components/KambaTextileMotif';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { Storefront, ArrowRight } from '../utils/phosphorIcons';

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
          <Storefront size={26} color={colors.light.onAccent}  />
        </View>
        <Text style={styles.eyebrow}>FOR LOCAL SELLERS</Text>
        <Text style={styles.heroTitle}>A marketplace built around your community.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Storefront size={24} color={colors.light.accent} />
          <Text style={styles.cardTitle}>Become a Vendor</Text>
        </View>
        <Text style={styles.cardDesc}>
          Start selling to buyers in your community. List products, receive
          orders, and track your payments.
        </Text>
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={() => navigation.navigate('VendorOnboarding')}
          accessibilityRole="button"
          accessibilityLabel="Upgrade to vendor"
        >
          <Text style={styles.upgradeButtonText}>Upgrade to Vendor</Text>
          <ArrowRight size={16} color={colors.light.onAccent} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.payoutButton}
        onPress={() => navigation.navigate('VendorPayoutAccount')}
        accessibilityRole="button"
        accessibilityLabel="Set up payout bank account"
      >
        <Text style={styles.payoutButtonText}>Set up payout bank account</Text>
        <ArrowRight size={16} color={colors.light.accent} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('Main', { screen: 'Discover' })}
        accessibilityRole="button"
        accessibilityLabel="Browse local shops"
      >
        <Text style={styles.browseButtonText}>Browse local shops</Text>
      </TouchableOpacity>
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
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelMedium.fontSize,
    color: colors.light.textPrimary,
  },
  cardDesc: {
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    color: colors.light.textSecondary,
    lineHeight: typography.scale.bodyMedium.lineHeight,
    marginBottom: spacing.md,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.light.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  upgradeButtonText: {
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelMedium.fontSize,
    color: colors.light.onAccent,
    fontWeight: '600',
  },
  payoutButton: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: radius.lg,
    backgroundColor: colors.light.surface,
  },
  payoutButtonText: {
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelMedium.fontSize,
    color: colors.light.accent,
  },
  browseButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  browseButtonText: {
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelMedium.fontSize,
    color: colors.light.textSecondary,
  },
});

export default VendorHubScreen;
