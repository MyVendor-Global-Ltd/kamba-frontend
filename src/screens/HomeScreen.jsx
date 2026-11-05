import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Bell, MagnifyingGlass, Storefront } from '../utils/phosphorIcons';
import { colors, motion, radius, spacing, typography } from '../theme/tokens';
import { KambaTextileMotif } from '../components/KambaTextileMotif';
import { MarketplaceCategoryChip } from '../components/MarketplaceCategoryChip';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { StoreCard } from '../components/StoreCard';
import { marketplaceCategories } from '../data/marketplaceCategories';
import { vendorAPI } from '../utils/api';

export const HomeScreen = ({ navigation }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  const loadStores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await vendorAPI.listStores({ page: 1, limit: 20 });
      setStores(results);
    } catch (err) {
      setStores([]);
      const message = err.response?.data?.error;
      setError(typeof message === 'string'
        ? message
        : 'We could not load shops. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: motion.duration.slower,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: motion.duration.slower,
        easing: Easing.bezier(...motion.easing.standard),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const openStore = (store) => {
    if (store.slug) navigation.navigate('StoreDetail', { slug: store.slug });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <ScreenShell scrollable={false} padded={false} bg={colors.light.background}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadStores}
              tintColor={colors.light.accent}
              colors={[colors.light.accent]}
            />
          }
        >
          <View style={styles.topBar}>
            <View style={styles.brand}>
              <View style={styles.brandMark}>
                <Storefront size={22} color={colors.light.onAccent} weight="bold" />
              </View>
              <View>
                <Text style={styles.brandName}>Kamba</Text>
                <Text style={styles.brandCaption}>LOCAL MARKETPLACE</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => navigation.navigate('Notifications')}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
            >
              <Bell size={20} color={colors.light.textPrimary} weight="regular" />
            </TouchableOpacity>
          </View>

          <View style={styles.hero}>
            <KambaTextileMotif
              width={260}
              height={180}
              color={colors.light.onAccent}
              opacity={0.12}
              style={styles.heroPattern}
            />
            <Text style={styles.heroEyebrow}>SHOP LOCAL</Text>
            <Text style={styles.heroTitle}>Good finds, closer to home.</Text>
            <Text style={styles.heroDescription}>
              Discover independent shops, products, and services on Kamba.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('Search')}
            activeOpacity={0.82}
            accessibilityRole="button"
            accessibilityLabel="Search local shops"
          >
            <MagnifyingGlass size={20} color={colors.light.textMuted} weight="regular" />
            <Text style={styles.searchLabel}>Search local shops</Text>
            <Text style={styles.searchHint}>Search</Text>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shop by category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            >
              {marketplaceCategories.map((category) => (
                <MarketplaceCategoryChip
                  key={category.id}
                  category={category}
                  onPress={() => navigation.navigate('Discover', { category: category.id })}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionCopy}>
                <Text style={styles.sectionTitle}>Local shops</Text>
                <Text style={styles.sectionDescription}>Browse sellers listed on Kamba.</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('Discover')}
                accessibilityRole="button"
                accessibilityLabel="Browse all local shops"
              >
                <Text style={styles.sectionLink}>See all</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <ScreenState
                type="loading"
                title="Finding local shops"
                description="Loading stores from Kamba."
              />
            ) : error ? (
              <ScreenState
                type="error"
                title="Could not load shops"
                description={error}
                actionLabel="Try again"
                onAction={loadStores}
              />
            ) : stores.length === 0 ? (
              <ScreenState
                type="empty"
                title="No shops listed yet"
                description="New local sellers will appear here when they join Kamba."
              />
            ) : (
              <View style={styles.storeList}>
                {stores.slice(0, 8).map((store) => (
                  <StoreCard
                    key={store.id || store.slug}
                    store={store}
                    onPress={() => openStore(store)}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </ScreenShell>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  content: {
    gap: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandMark: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.light.accent,
  },
  brandName: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.display,
    fontSize: typography.scale.headlineMedium.fontSize,
  },
  brandCaption: {
    color: colors.light.textMuted,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
    letterSpacing: 0.8,
  },
  notificationButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
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
  heroEyebrow: {
    color: colors.light.gold,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
    letterSpacing: 1.1,
  },
  heroTitle: {
    maxWidth: 300,
    color: colors.light.onAccent,
    fontFamily: typography.fontFamilies.display,
    fontSize: typography.scale.displaySmall.fontSize,
    lineHeight: typography.scale.displaySmall.lineHeight,
  },
  heroDescription: {
    maxWidth: 300,
    color: colors.light.accentSoft,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    lineHeight: typography.scale.bodyMedium.lineHeight,
  },
  searchButton: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
  searchLabel: {
    flex: 1,
    color: colors.light.textMuted,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
  },
  searchHint: {
    color: colors.light.accent,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  sectionCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  sectionTitle: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.headline,
    fontSize: typography.scale.headlineMedium.fontSize,
  },
  sectionDescription: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodySmall.fontSize,
  },
  sectionLink: {
    color: colors.light.accent,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelMedium.fontSize,
  },
  categoryList: {
    gap: spacing.sm,
    paddingRight: spacing.xl,
  },
  storeList: {
    gap: spacing.sm,
  },
});

export default HomeScreen;
