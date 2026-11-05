import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, BadgeCheck, MapPin, Storefront } from '../utils/phosphorIcons';
import { colors, radius, spacing, typography } from '../theme/tokens';

const getStoreName = (store) => store.store_name || store.name || 'Local shop';

export const StoreCard = ({ store, onPress }) => {
  const storeName = getStoreName(store);
  const location = typeof store.location_text === 'string' ? store.location_text.trim() : '';
  const verified = store.vendor_profiles?.is_verified === true;
  const canOpen = Boolean(store.slug && onPress);
  const accessibilityLabel = [
    storeName,
    location,
    verified ? 'Verified seller' : null,
    canOpen ? 'View shop' : null,
  ].filter(Boolean).join(', ');

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      disabled={!canOpen}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !canOpen }}
    >
      <View style={styles.iconFrame}>
        <Storefront size={22} color={colors.light.accent} weight="regular" />
      </View>
      <View style={styles.details}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{storeName}</Text>
          {verified ? (
            <View style={styles.verified}>
              <BadgeCheck size={14} color={colors.light.success} weight="fill" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.category} numberOfLines={1}>
          {store.category || 'Independent shop'}
        </Text>
        {location ? (
          <View style={styles.locationRow}>
            <MapPin size={14} color={colors.light.textMuted} />
            <Text style={styles.location} numberOfLines={1}>{location}</Text>
          </View>
        ) : null}
      </View>
      {canOpen ? <ArrowRight size={18} color={colors.light.textMuted} /> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
  iconFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.light.accentSoft,
  },
  details: {
    flex: 1,
    gap: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    flexShrink: 1,
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.title,
    fontSize: typography.scale.titleLarge.fontSize,
  },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedText: {
    color: colors.light.success,
    fontFamily: typography.fontFamilies.caption,
    fontSize: typography.scale.labelSmall.fontSize,
  },
  category: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodySmall.fontSize,
    textTransform: 'capitalize',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  location: {
    flex: 1,
    color: colors.light.textMuted,
    fontFamily: typography.fontFamilies.caption,
    fontSize: typography.scale.labelSmall.fontSize,
  },
});

export default StoreCard;
