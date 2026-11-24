import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { KambaTextileMotif } from '../components/KambaTextileMotif';
import { ScreenShell } from '../components/ScreenShell';
import { ArrowRight, Storefront } from '../utils/phosphorIcons';
import { authAPI, vendorAPI } from '../utils/api';

export const VendorHubScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [isVendor, setIsVendor] = useState(false);
  const [vendorType, setVendorType] = useState(null);
  const [onboardingStage, setOnboardingStage] = useState(null);

  const loadVendorState = useCallback(async () => {
    setLoading(true);
    try {
      const [profileResponse, status] = await Promise.all([
        authAPI.getDashboard(),
        vendorAPI.getOnboardingStatus(),
      ]);
      const user = profileResponse.data?.result;
      setIsVendor(user?.role === 'vendor');
      setVendorType(status.vendor_type || null);
      setOnboardingStage(status.stage || null);
    } catch {
      setIsVendor(false);
      setVendorType(null);
      setOnboardingStage(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVendorState();
    const unsubscribe = navigation.addListener('focus', () => { void loadVendorState(); });
    return unsubscribe;
  }, [navigation, loadVendorState]);

  return (
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
            <Storefront size={26} color={colors.light.onAccent} />
          </View>
          <Text style={styles.eyebrow}>FOR LOCAL SELLERS</Text>
          <Text style={styles.heroTitle}>A marketplace built around your community.</Text>
        </View>

        {loading ? (
          <View style={styles.loading}><ActivityIndicator color={colors.light.accent} /><Text style={styles.cardDesc}>Checking your vendor account…</Text></View>
        ) : !isVendor ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Storefront size={24} color={colors.light.accent} />
              <Text style={styles.cardTitle}>Become a Vendor</Text>
            </View>
            <Text style={styles.cardDesc}>
              Complete phone verification, selfie verification and your business profile before listing products or services.
            </Text>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => navigation.navigate('VendorOnboarding')}
              accessibilityRole="button"
              accessibilityLabel="Start vendor onboarding"
            >
              <Text style={styles.upgradeButtonText}>Start vendor onboarding</Text>
              <ArrowRight size={16} color={colors.light.onAccent} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Storefront size={24} color={colors.light.accent} />
              <Text style={styles.cardTitle}>Your vendor workspace</Text>
            </View>
            <Text style={styles.cardDesc}>
              {onboardingStage === 'complete'
                ? 'Your business profile is submitted. Verification may still be pending while Kamba reviews your information.'
                : 'Continue the required business-profile steps before managing listings.'}
            </Text>
            {onboardingStage !== 'complete' ? (
              <TouchableOpacity style={styles.upgradeButton} onPress={() => navigation.navigate('VendorOnboarding')}>
                <Text style={styles.upgradeButtonText}>Continue onboarding</Text>
                <ArrowRight size={16} color={colors.light.onAccent} />
              </TouchableOpacity>
            ) : null}
            {['products', 'both'].includes(vendorType) && onboardingStage === 'complete' ? (
              <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('VendorProducts')}>
                <Text style={styles.secondaryButtonText}>Manage products and media</Text>
                <ArrowRight size={16} color={colors.light.accent} />
              </TouchableOpacity>
            ) : null}
            {['services', 'both'].includes(vendorType) && onboardingStage === 'complete' ? (
              <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('ServiceRequests')}>
                <Text style={styles.secondaryButtonText}>Manage service requests</Text>
                <ArrowRight size={16} color={colors.light.accent} />
              </TouchableOpacity>
            ) : null}
          </View>
        )}

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
};

const styles = StyleSheet.create({
  container: { gap: spacing.md, paddingBottom: spacing.xxl },
  hero: { position: 'relative', overflow: 'hidden', gap: spacing.sm, padding: spacing.xl, borderRadius: radius.xxl, backgroundColor: colors.light.accentStrong },
  heroPattern: { position: 'absolute', top: 0, right: -24 },
  heroIcon: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: radius.lg, backgroundColor: colors.light.accent },
  eyebrow: { marginTop: spacing.sm, color: colors.light.gold, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize, letterSpacing: 1 },
  heroTitle: { maxWidth: 300, color: colors.light.onAccent, fontFamily: typography.fontFamilies.display, fontSize: typography.scale.displaySmall.fontSize, lineHeight: typography.scale.displaySmall.lineHeight },
  card: { backgroundColor: colors.light.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.light.border, gap: spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cardTitle: { fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize, color: colors.light.textPrimary },
  cardDesc: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, color: colors.light.textSecondary, lineHeight: typography.scale.bodyMedium.lineHeight },
  loading: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  upgradeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.light.accent, borderRadius: radius.md, paddingVertical: spacing.md },
  upgradeButtonText: { fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize, color: colors.light.onAccent, fontWeight: '600' },
  secondaryButton: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.md },
  secondaryButtonText: { fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize, color: colors.light.accent },
  payoutButton: { minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.lg, backgroundColor: colors.light.surface },
  payoutButtonText: { fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize, color: colors.light.accent },
  browseButton: { alignItems: 'center', paddingVertical: spacing.md },
  browseButtonText: { fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize, color: colors.light.textSecondary },
});

export default VendorHubScreen;
