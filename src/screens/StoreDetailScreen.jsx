import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BadgeCheck, MapPin, Storefront } from '../utils/phosphorIcons';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { KambaTextileMotif } from '../components/KambaTextileMotif';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { marketplaceAPI, productAPI, vendorAPI } from '../utils/api';

const getCount = (value) => {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (typeof value === 'string' && !value.trim()) return null;

  const count = Number(value);
  if (!Number.isFinite(count) || count < 0) return null;
  return Math.floor(count).toLocaleString();
};

export const StoreDetailScreen = ({ navigation, route }) => {
  const slug = route?.params?.slug;
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [following, setFollowing] = useState(null);
  const [followBusy, setFollowBusy] = useState(false);
  const [followMessage, setFollowMessage] = useState('');

  const loadStore = useCallback(async () => {
    if (!slug) {
      setStore(null);
      setProducts([]);
      setProductsLoading(false);
      setProductsError('');
      setError('This shop link is missing its identifier.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await vendorAPI.getStore(slug);
      setStore(result);
      setFollowing(null);
      setFollowMessage('');
      if (!result) {
        setProducts([]);
        setProductsLoading(false);
        setProductsError('');
        setError('This shop is unavailable or could not be found.');
        return;
      }
      try {
        const follow = await marketplaceAPI.getFollowStatus(slug);
        setFollowing(Boolean(follow?.following));
        if (follow?.follower_count !== undefined) {
          setStore((current) => current ? { ...current, follower_count: follow.follower_count } : current);
        }
      } catch (followErr) {
        setFollowing(null);
        setFollowMessage(followErr.response?.status === 403
          ? 'A buyer account is required to follow shops.'
          : 'Sign in as a buyer to follow this shop.');
      }
      setProductsLoading(true);
      setProductsError('');
      try {
        const catalog = await productAPI.listProducts({ store: result.slug, limit: 50 });
        setProducts(catalog);
      } catch (productErr) {
        setProducts([]);
        const message = productErr.response?.data?.error;
        setProductsError(typeof message === 'string' ? message : 'This shop loaded, but its products could not be fetched.');
      } finally {
        setProductsLoading(false);
      }
    } catch (err) {
      setStore(null);
      setProducts([]);
      setProductsLoading(false);
      setProductsError('');
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
  const toggleFollow = async () => {
    if (following === null) {
      navigation.navigate('Auth', { screen: 'Login' });
      return;
    }
    setFollowBusy(true);
    setFollowMessage('');
    try {
      const result = following
        ? await marketplaceAPI.unfollowStore(slug)
        : await marketplaceAPI.followStore(slug);
      setFollowing(Boolean(result?.following));
      if (result?.follower_count !== undefined) {
        setStore((current) => current ? { ...current, follower_count: result.follower_count } : current);
      }
    } catch (followErr) {
      setFollowMessage(followErr.response?.data?.message || followErr.response?.data?.error || 'Could not update your follow status.');
    } finally {
      setFollowBusy(false);
    }
  };
  const salesCount = store ? getCount(store.total_sales) : null;
  const hasMetrics = followerCount !== null || salesCount !== null;
  const storeName = store?.store_name || store?.name || 'Local shop';
  const location = typeof store?.location_text === 'string' ? store.location_text.trim() : '';
  const description = typeof store?.description === 'string' ? store.description.trim() : '';
  const verified = store?.vendor_profiles?.is_verified === true;
  const formatNaira = (amountKobo) => `₦${(Number(amountKobo || 0) / 100).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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

          <View style={styles.followPanel}>
            <TouchableOpacity style={styles.followButton} onPress={toggleFollow} disabled={followBusy} accessibilityRole="button">
              {followBusy ? <ActivityIndicator size="small" color={colors.light.onAccent} /> : <Text style={styles.followButtonText}>{following === null ? 'Sign in to follow' : following ? 'Following · Unfollow' : 'Follow shop'}</Text>}
            </TouchableOpacity>
            {!!followMessage ? <Text style={styles.followMessage}>{followMessage}</Text> : null}
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

          <View style={styles.productsSection}>
            <View style={styles.productsHeading}>
              <Text style={styles.cardTitle}>Products</Text>
              <Text style={styles.productsCount}>{products.length ? `${products.length} listed` : ''}</Text>
            </View>
            {productsLoading ? (
              <View style={styles.productsState}>
                <ActivityIndicator size="small" color={colors.light.accent} />
                <Text style={styles.description}>Loading this shop's products…</Text>
              </View>
            ) : productsError ? (
              <ScreenState
                type="error"
                title="Products unavailable"
                description={productsError}
                actionLabel="Retry"
                onAction={loadStore}
              />
            ) : products.length ? (
              <View style={styles.productList}>
                {products.map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.productCard}
                    onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                    accessibilityRole="button"
                    accessibilityLabel={`View ${product.name}`}
                  >
                    {product.images?.[0] ? (
                      <Image source={{ uri: product.images[0] }} style={styles.productImage} resizeMode="cover" />
                    ) : (
                      <View style={[styles.productImage, styles.productImageFallback]}>
                        <Storefront size={22} color={colors.light.textMuted} />
                      </View>
                    )}
                    <View style={styles.productCopy}>
                      <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                      <Text style={styles.productPrice}>{formatNaira(product.price)}</Text>
                      <Text style={styles.productStock}>
                        {Number(product.stock_quantity) > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.productsState}>
                <Text style={styles.description}>This shop has not listed any available products yet.</Text>
              </View>
            )}
          </View>
        </View>
      ) : null}
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  followPanel: { gap: spacing.xs },
  followButton: { minHeight: 46, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.light.accent },
  followButtonText: { color: colors.light.onAccent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
  followMessage: { color: colors.light.textMuted, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.labelSmall.fontSize },
  productsSection: { gap: spacing.md },
  productsHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  productsCount: { color: colors.light.textMuted, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.labelSmall.fontSize },
  productsState: { alignItems: 'center', gap: spacing.sm, padding: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.light.surface },
  productList: { gap: spacing.md },
  productCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.lg, backgroundColor: colors.light.surface },
  productImage: { width: 88, height: 88, borderRadius: radius.md, backgroundColor: colors.light.accentSoft },
  productImageFallback: { alignItems: 'center', justifyContent: 'center' },
  productCopy: { flex: 1, gap: spacing.xs },
  productName: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
  productPrice: { color: colors.light.accent, fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.titleSmall.fontSize },
  productStock: { color: colors.light.textMuted, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.labelSmall.fontSize },
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
