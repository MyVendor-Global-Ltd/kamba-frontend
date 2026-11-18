import React, { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BadgeCheck, MapPin, Storefront } from '../utils/phosphorIcons';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { KambaTextileMotif } from '../components/KambaTextileMotif';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { vendorAPI } from '../utils/api';

const getCount = (value) => {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (typeof value === 'string' && !value.trim()) return null;

  const count = Number(value);
  if (!Number.isFinite(count) || count < 0) return null;
  return Math.floor(count).toLocaleString();
};

export const StoreDetailScreen = ({ route }) => {
  const slug = route?.params?.slug;
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStore = useCallback(async () => {
    if (!slug) {
      setStore(null);
      setError('This shop link is missing its identifier.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await vendorAPI.getStore(slug);
      setStore(result);
      if (!result) setError('This shop is unavailable or could not be found.');
    } catch (err) {
      setStore(null);
      const message = err.response?.data?.error;
      setError(typeof message === 'string'
        ? message
        : 'We could not load this shop. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  const followerCount = store ? getCount(store.follower_count) : null;
  const salesCount = store ? getCount(store.total_sales) : null;
  const hasMetrics = followerCount !== null || salesCount !== null;
  const storeName = store?.store_name || store?.name || 'Local shop';
  const location = typeof store?.location_text === 'string' ? store.location_text.trim() : '';
  const description = typeof store?.description === 'string' ? store.description.trim() : '';
  const verified = store?.vendor_profiles?.is_verified === true;

  return (
    <ScreenShell
      padded
      bg={colors.light.background}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={loadStore}
          tintColor={colors.light.accent}
          colors={[colors.light.accent]}
        />
      }
    >
      {loading ? (
        <ScreenState
          type="loading"
          title="Opening shop"
          description="Loading the seller’s information."
        />
      ) : error ? (
        <ScreenState
          type="error"
          title="Shop unavailable"
          description={error}
          actionLabel={slug ? 'Try again' : undefined}
          onAction={slug ? loadStore : undefined}
        />
      ) : store ? (
        <View style={styles.content}>
          <View style={styles.hero}>
            <KambaTextileMotif
              width={260}
              height={180}
              color={colors.light.onAccent}
              opacity={0.12}
              style={styles.heroPattern}
            />
            <View style={styles.heroIcon}>
              <Storefront size={30} color={colors.light.onAccent}  />
            </View>
            <Text style={styles.heroEyebrow}>LOCAL SHOP</Text>
            <Text style={styles.heroTitle}>{storeName}</Text>
            {store.category ? (
              <Text style={styles.heroCategory}>{store.category}</Text>
            ) : null}
          </View>

          {verified ? (
            <View style={styles.verified}>
              <BadgeCheck size={18} color={colors.light.success} weight="fill" />
              <Text style={styles.verifiedText}>Verified seller</Text>
            </View>
          ) : null}

          {location ? (
            <View style={styles.locationCard}>
              <View style={styles.locationIcon}>
                <MapPin size={19} color={colors.light.accent} />
              </View>
              <View style={styles.locationCopy}>
                <Text style={styles.cardLabel}>Shop location</Text>
                <Text style={styles.locationText}>{location}</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>About this shop</Text>
            <Text style={styles.description}>
              {description || 'The seller has not added a shop description yet.'}
            </Text>
          </View>

          {hasMetrics ? (
            <View style={styles.metrics}>
              {followerCount !== null ? (
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{followerCount}</Text>
                  <Text style={styles.metricLabel}>Followers</Text>
                </View>
              ) : null}
              {salesCount !== null ? (
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{salesCount}</Text>
                  <Text style={styles.metricLabel}>Sales</Text>
                </View>
              ) : null}
            </View>
          ) : null}

          <View style={styles.notice}>
            <Text style={styles.noticeTitle}>Ordering is not available here</Text>
            <Text style={styles.noticeText}>
              This shop view does not currently include product browsing or ordering actions.
            </Text>
          </View>
        </View>
      ) : null}
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
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
  heroEyebrow: {
    marginTop: spacing.sm,
    color: colors.light.gold,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
    letterSpacing: 1,
  },
  heroTitle: {
    color: colors.light.onAccent,
    fontFamily: typography.fontFamilies.display,
    fontSize: typography.scale.displaySmall.fontSize,
    lineHeight: typography.scale.displaySmall.lineHeight,
  },
  heroCategory: {
    color: colors.light.accentSoft,
    fontFamily: typography.fontFamilies.bodyMedium,
    fontSize: typography.scale.bodySmall.fontSize,
    textTransform: 'capitalize',
  },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.light.successSoft,
  },
  verifiedText: {
    color: colors.light.success,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: radius.xl,
    backgroundColor: colors.light.surface,
  },
  locationIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.light.accentSoft,
  },
  locationCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  cardLabel: {
    color: colors.light.textMuted,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
  },
  locationText: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.bodyMedium,
    fontSize: typography.scale.bodyMedium.fontSize,
  },
  infoCard: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: radius.xl,
    backgroundColor: colors.light.surface,
  },
  cardTitle: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.headline,
    fontSize: typography.scale.headlineSmall.fontSize,
  },
  description: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    lineHeight: typography.scale.bodyMedium.lineHeight,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: radius.lg,
    backgroundColor: colors.light.surface,
  },
  metricValue: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.displayMedium,
    fontSize: typography.scale.headlineMedium.fontSize,
  },
  metricLabel: {
    color: colors.light.textMuted,
    fontFamily: typography.fontFamilies.caption,
    fontSize: typography.scale.labelSmall.fontSize,
  },
  notice: {
    gap: spacing.xs,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.light.gold,
    backgroundColor: colors.light.goldSoft,
  },
  noticeTitle: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelMedium.fontSize,
  },
  noticeText: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodySmall.fontSize,
    lineHeight: typography.scale.bodySmall.lineHeight,
  },
});

export default StoreDetailScreen;
