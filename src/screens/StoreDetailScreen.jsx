import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MapPin, Storefront } from 'phosphor-react-native';
import { colors, typography, spacing, radius } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { vendorAPI } from '../utils/api';

const formatCount = (value) => Number.isFinite(Number(value)) ? Number(value).toLocaleString() : '—';

export const StoreDetailScreen = ({ route }) => {
  const slug = route?.params?.slug;
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const loadStore = useCallback(async () => {
    if (!slug) {
      setError('This store link is missing its identifier.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await vendorAPI.getStore(slug);
      setStore(result);
      if (!result) setError('This store is unavailable or could not be found.');
    } catch (err) {
      setStore(null);
      setError(err.response?.data?.error || 'We could not load this store. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [slug, reloadKey]);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  return (
    <ScreenShell scrollable padded bg={colors.light.background}>
      {loading ? (
        <View style={styles.stateBox} accessibilityRole="progressbar">
          <ActivityIndicator color={colors.light.accent} />
          <Text style={styles.body}>Loading store…</Text>
        </View>
      ) : error ? (
        <View style={styles.stateBox}>
          <Storefront size={36} color={colors.light.textMuted} />
          <Text style={styles.title}>Store unavailable</Text>
          <Text style={styles.body}>{error}</Text>
          {slug ? <TouchableOpacity onPress={() => setReloadKey((key) => key + 1)} accessibilityRole="button"><Text style={styles.link}>Try again</Text></TouchableOpacity> : null}
        </View>
      ) : store ? (
        <View style={styles.content}>
          <View style={styles.heroIcon}><Storefront size={36} color={colors.light.accent} weight="bold" /></View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{store.store_name || 'Campus store'}</Text>
            {store.vendor_profiles?.is_verified ? <Text style={styles.verified}>Verified</Text> : null}
          </View>
          {store.category ? <Text style={styles.category}>{store.category}</Text> : null}
          {store.location_text ? (
            <View style={styles.locationRow}><MapPin size={18} color={colors.light.textMuted} /><Text style={styles.body}>{store.location_text}</Text></View>
          ) : null}
          {store.description ? <Text style={styles.description}>{store.description}</Text> : <Text style={styles.body}>Store information will be updated by the vendor.</Text>}
          <View style={styles.metrics}>
            <View style={styles.metricCard}><Text style={styles.metricValue}>{formatCount(store.follower_count)}</Text><Text style={styles.metricLabel}>Followers</Text></View>
            <View style={styles.metricCard}><Text style={styles.metricValue}>{formatCount(store.total_sales)}</Text><Text style={styles.metricLabel}>Sales</Text></View>
          </View>
          <Text style={styles.note}>Contact and product ordering are not available in this store view yet.</Text>
        </View>
      ) : null}
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  stateBox: { flex: 1, minHeight: 260, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl, backgroundColor: colors.light.surface, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.lg },
  content: { gap: spacing.md },
  heroIcon: { width: 76, height: 76, alignItems: 'center', justifyContent: 'center', borderRadius: radius.xl, backgroundColor: colors.light.accentSoft },
  titleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.sm },
  title: { fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineLarge.fontSize, lineHeight: typography.scale.headlineLarge.lineHeight, color: colors.light.textPrimary },
  verified: { fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize, color: colors.light.success },
  category: { fontFamily: typography.fontFamilies.bodyMedium, fontSize: typography.scale.bodyMedium.fontSize, color: colors.light.textSecondary, textTransform: 'capitalize' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  description: { marginTop: spacing.sm, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, lineHeight: typography.scale.bodyMedium.lineHeight, color: colors.light.textPrimary },
  body: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, color: colors.light.textSecondary, textAlign: 'center' },
  metrics: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  metricCard: { flex: 1, gap: spacing.xs, padding: spacing.md, backgroundColor: colors.light.surface, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.lg },
  metricValue: { fontFamily: typography.fontFamilies.monoMedium, fontSize: typography.scale.headlineSmall.fontSize, color: colors.light.textPrimary },
  metricLabel: { fontFamily: typography.fontFamilies.caption, fontSize: typography.scale.labelSmall.fontSize, color: colors.light.textMuted },
  note: { marginTop: spacing.md, fontFamily: typography.fontFamilies.caption, fontSize: typography.scale.labelSmall.fontSize, lineHeight: typography.scale.labelSmall.lineHeight, color: colors.light.textMuted },
  link: { fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize, color: colors.light.accent },
});

export default StoreDetailScreen;
