import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography, radius } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { userAPI } from '../utils/api';

export const VendorOnboardingScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const upgradeToVendor = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await userAPI.upgradeToVendor();
      navigation.goBack();
    } catch (err) {
      const message = err.response?.data?.error;
      setError(typeof message === 'string' ? message : 'Could not upgrade to vendor.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ScreenShell scrollable={false} padded bg={colors.light.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Become a Vendor</Text>
          <Text style={styles.headerSubtitle}>
            Sell your goods to buyers in your community.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What changes</Text>
          <View style={styles.featureRow}>
            <Text style={styles.featureText}>•</Text>
            <Text style={styles.featureDesc}>
              List your own products in the marketplace
            </Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.featureText}>•</Text>
            <Text style={styles.featureDesc}>
              Receive orders from nearby buyers
            </Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.featureText}>•</Text>
            <Text style={styles.featureDesc}>
              Track payments and settlements in Vendor Payments
            </Text>
          </View>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={upgradeToVendor}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Upgrade to vendor"
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.light.onAccent} />
          ) : (
            <Text style={styles.upgradeButtonText}>Upgrade to Vendor</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Cancel"
        >
          <Text style={styles.cancelButtonText}>Not now</Text>
        </TouchableOpacity>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontFamily: typography.fontFamilies.headline,
    fontSize: typography.scale.headlineMedium.fontSize,
    letterSpacing: typography.scale.headlineMedium.letterSpacing,
    color: colors.light.textPrimary,
  },
  headerSubtitle: {
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    color: colors.light.textSecondary,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelMedium.fontSize,
    color: colors.light.textPrimary,
    marginBottom: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  featureText: {
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    color: colors.light.accent,
    marginTop: 1,
    marginRight: spacing.sm,
  },
  featureDesc: {
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    color: colors.light.textSecondary,
    flex: 1,
  },
  errorBox: {
    backgroundColor: colors.light.errorSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.light.error,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
  },
  upgradeButton: {
    backgroundColor: colors.light.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  upgradeButtonText: {
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelLarge.fontSize,
    color: colors.light.onAccent,
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  cancelButtonText: {
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelMedium.fontSize,
    color: colors.light.textSecondary,
  },
});

export default VendorOnboardingScreen;
