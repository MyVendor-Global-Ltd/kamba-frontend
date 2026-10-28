import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MagnifyingGlass, MapPin, Storefront } from 'phosphor-react-native';
import { colors, typography, spacing, radius, motion } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { vendorAPI } from '../utils/api';

const CATEGORIES = [
  { id: 'food', name: 'Food', icon: '🍔', color: '#FFF0EB' },
  { id: 'fashion', name: 'Fashion', icon: '👕', color: '#E1F3FE' },
  { id: 'tech', name: 'Tech', icon: '📱', color: '#EDF3EC' },
  { id: 'books', name: 'Books', icon: '📚', color: '#FBF3DB' },
  { id: 'beauty', name: 'Beauty', icon: '💄', color: '#FDEBEC' },
  { id: 'services', name: 'Services', icon: '🛠️', color: '#F0F0F0' },
];

const displayName = (store) => store.store_name || store.name || 'Campus store';

export const HomeScreen = ({ navigation }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
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
      setError(err.response?.data?.error || 'We could not load stores. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [reloadKey]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: motion.duration.slower, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: motion.duration.slower, easing: Easing.bezier(...motion.easing.standard), useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const openStore = (store) => {
    if (!store.slug) return;
    navigation.navigate('StoreDetail', { slug: store.slug });
  };

  const renderStore = (store) => (
    <TouchableOpacity
      key={store.id || store.slug}
      style={styles.storeCard}
      onPress={() => openStore(store)}
      disabled={!store.slug}
      activeOpacity={0.82}
      accessibilityRole="button"
      accessibilityLabel={`View ${displayName(store)}`}
    >
      <View style={styles.storeIcon}><Storefront size={24} color={colors.light.accent} weight="bold" /></View>
      <View style={styles.storeInfo}>
        <View style={styles.storeNameRow}>
          <Text style={styles.storeName} numberOfLines={1}>{displayName(store)}</Text>
          {store.vendor_profiles?.is_verified ? <Text style={styles.verified}>Verified</Text> : null}
        </View>
        <Text style={styles.storeCategory} numberOfLines={1}>{store.category || 'Campus store'}</Text>
        {store.location_text ? (
          <View style={styles.locationRow}>
            <MapPin size={14} color={colors.light.textMuted} />
            <Text style={styles.location} numberOfLines={1}>{store.location_text}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <ScreenShell scrollable={false} padded={false} bg={colors.light.background}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('Search')}
            activeOpacity={0.8}
            accessibilityLabel="Search campus stores"
            accessibilityRole="search"
          >
            <MagnifyingGlass size={22} color={colors.light.textMuted} weight="bold" />
            <Text style={styles.searchPlaceholder}>Search campus stores...</Text>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryChip, { backgroundColor: category.color }]}
                  onPress={() => navigation.navigate('Discover', { category: category.id })}
                  accessibilityRole="button"
                  accessibilityLabel={`${category.name} category`}
                >
                  <Text style={styles.categoryText}>{category.icon} {category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Campus stores</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Discover')} accessibilityRole="button">
                <Text style={styles.sectionLink}>Browse all</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.statusBox} accessibilityRole="progressbar">
                <ActivityIndicator color={colors.light.accent} />
                <Text style={styles.statusText}>Loading stores…</Text>
              </View>
            ) : error ? (
              <View style={styles.statusBox}>
                <Text style={styles.statusText}>{error}</Text>
                <TouchableOpacity onPress={() => setReloadKey((key) => key + 1)} accessibilityRole="button">
                  <Text style={styles.sectionLink}>Try again</Text>
                </TouchableOpacity>
              </View>
            ) : stores.length === 0 ? (
              <View style={styles.statusBox}>
                <Text style={styles.statusTitle}>No stores to show yet</Text>
                <Text style={styles.statusText}>New campus stores will appear here when available.</Text>
              </View>
            ) : (
              <View style={styles.storeList}>{stores.slice(0, 8).map(renderStore)}</View>
            )}
          </View>
        </ScrollView>
      </ScreenShell>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.lg },
  searchButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.light.surface, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.xl, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  searchPlaceholder: { flex: 1, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, color: colors.light.textMuted },
  section: { gap: spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineMedium.fontSize, color: colors.light.textPrimary },
  sectionLink: { fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize, color: colors.light.accent },
  categories: { gap: spacing.sm, paddingRight: spacing.xl },
  categoryChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, borderWidth: 1, borderColor: colors.light.border },
  categoryText: { fontFamily: typography.fontFamilies.chip, fontSize: typography.scale.labelMedium.fontSize, color: colors.light.textSecondary },
  storeList: { gap: spacing.sm },
  storeCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, backgroundColor: colors.light.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.light.border },
  storeIcon: { width: 48, height: 48, borderRadius: radius.lg, backgroundColor: colors.light.accentSoft, alignItems: 'center', justifyContent: 'center' },
  storeInfo: { flex: 1, gap: 3 },
  storeNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  storeName: { flexShrink: 1, fontFamily: typography.fontFamilies.title, fontSize: typography.scale.titleLarge.fontSize, color: colors.light.textPrimary },
  verified: { fontFamily: typography.fontFamilies.caption, fontSize: typography.scale.labelSmall.fontSize, color: colors.light.success },
  storeCategory: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, color: colors.light.textSecondary, textTransform: 'capitalize' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  location: { flex: 1, fontFamily: typography.fontFamilies.caption, fontSize: typography.scale.labelSmall.fontSize, color: colors.light.textMuted },
  chevron: { fontFamily: typography.fontFamilies.mono, fontSize: typography.scale.monoLarge.fontSize, color: colors.light.textMuted },
  statusBox: { alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.xl, backgroundColor: colors.light.surface, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.lg },
  statusTitle: { fontFamily: typography.fontFamilies.title, fontSize: typography.scale.titleLarge.fontSize, color: colors.light.textPrimary, textAlign: 'center' },
  statusText: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, color: colors.light.textSecondary, textAlign: 'center' },
});

export default HomeScreen;
