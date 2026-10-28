// screens/HomeScreen.jsx — Marketplace Home
// Search, Featured Categories, Featured Stores, Nearby

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Animated, Easing, Dimensions } from 'react-native';
import { Search, MapPin, ShieldCheck, Flame, ArrowRight, Bell, Storefront, Truck, Heart, Grid } from 'phosphor-react-native';
import { colors, typography, spacing, radius, motion, icons } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { KambaLogo } from '../components/KambaLogo';
import { DoubleBezelCard } from '../components/DoubleBezelCard';
import { MagneticButton } from '../components/MagneticButton';
import { NairaText } from '../components/NairaText';
import { storage } from '../utils/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'food', name: 'Food', icon: '🍔', color: '#FFF0EB' },
  { id: 'fashion', name: 'Fashion', icon: '👕', color: '#E1F3FE' },
  { id: 'tech', name: 'Tech', icon: '📱', color: '#EDF3EC' },
  { id: 'books', name: 'Books', icon: '📚', color: '#FBF3DB' },
  { id: 'beauty', name: 'Beauty', icon: '💄', color: '#FDEBEC' },
  { id: 'services', name: 'Services', icon: '🛠️', color: '#F0F0F0' },
];

const FEATURED_STORES = [
  { id: 1, name: "Ada's Kitchen", category: 'Food • Jollof & Swallow', rating: 4.9, distance: '0.3 km', deliveryTime: '15-20 min', image: 'https://picsum.photos/seed/adas-kitchen/400/300' },
  { id: 2, name: 'TechHub UNILAG', category: 'Tech • Phones & Accessories', rating: 4.8, distance: '0.5 km', deliveryTime: '10-15 min', image: 'https://picsum.photos/seed/techhub/400/300' },
  { id: 3, name: 'Style Avenue', category: 'Fashion • Thrift & New', rating: 4.7, distance: '0.8 km', deliveryTime: '20-25 min', image: 'https://picsum.photos/seed/styleavenue/400/300' },
  { id: 4, name: 'Campus Bookstore', category: 'Books • Textbooks & Stationery', rating: 4.9, distance: '0.2 km', deliveryTime: '5-10 min', image: 'https://picsum.photos/seed/bookstore/400/300' },
];

const NEARBY_STORES = [
  { id: 5, name: 'Fresh Fruits NG', category: 'Food', rating: 4.6, distance: '0.4 km' },
  { id: 6, name: 'Sneaker Plug', category: 'Fashion', rating: 4.8, distance: '0.6 km' },
  { id: 7, name: 'Phone Clinic', category: 'Tech', rating: 4.5, distance: '0.7 km' },
  { id: 8, name: 'Print & Go', category: 'Services', rating: 4.7, distance: '0.3 km' },
];

const renderCategory = ({ item, index }) => {
  const delay = index * motion.duration.staggerDelay;
  return (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        { backgroundColor: item.color },
      ]}
      onPress={() => navigation.navigate('Discover', { category: item.id })}
      activeOpacity={0.8}
      accessibilityLabel={`${item.name} category`}
      accessibilityRole="button"
        key={item.id}
      >
        <Text style={styles.categoryChipText}>
          {item.icon}{' '}{item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFeaturedStore = ({ item, index }) => {
    return (
      <Animated.View style={styles.featuredCard} key={item.id}>
        <DoubleBezelCard variant="default" style={styles.featuredCardInner}>
          <View style={styles.featuredImageContainer}>
            <View style={styles.featuredImage} />
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>Featured</Text>
            </View>
          </View>
          <View style={styles.featuredContent}>
            <View style={styles.featuredHeader}>
              <Text style={styles.featuredName}>{item.name}</Text>
              <View style={styles.featuredRating}>
                <Text style={styles.ratingText}>★ {item.rating}</Text>
              </View>
            </View>
            <Text style={styles.featuredCategory}>{item.category}</Text>
            <View style={styles.featuredMeta}>
              <View style={styles.metaItem}>
                <MapPin size={icons.sizes.xs} color={colors.light.textMuted} weight="bold" />
                <Text style={styles.metaText}>{item.distance}</Text>
              </View>
              <View style={styles.metaItem}>
                <Truck size={icons.sizes.xs} color={colors.light.textMuted} weight="bold" />
                <Text style={styles.metaText}>{item.deliveryTime}</Text>
              </View>
            </View>
            <MagneticButton
              label="View Store"
              variant="ghost"
              size="sm"
              fullWidth
              onPress={() => navigation.navigate('StoreDetail', { storeId: item.id })}
            />
          </View>
        </DoubleBezelCard>
      </Animated.View>
    );
  };

  const renderNearbyStore = ({ item }) => (
    <TouchableOpacity
      style={styles.nearbyCard}
      onPress={() => navigation.navigate('StoreDetail', { storeId: item.id })}
      activeOpacity={0.8}
      accessibilityLabel={`${item.name}, ${item.category}, ${item.rating} stars, ${item.distance} away`}
    >
      <View style={styles.nearbyIcon}>
        <Text style={styles.nearbyEmoji}>🏪</Text>
      </View>
      <View style={styles.nearbyInfo}>
        <Text style={styles.nearbyName}>{item.name}</Text>
        <Text style={styles.nearbyCategory}>{item.category}</Text>
      </View>
      <View style={styles.nearbyRating}>
        <Text style={styles.ratingText}>★ {item.rating}</Text>
        <Text style={styles.nearbyDistance}>{item.distance}</Text>
      </View>
    </TouchableOpacity>
  );

export const HomeScreen = ({ navigation }) => {
  const [username, setUsername] = React.useState('student');

  useEffect(() => {
    const fetchUser = async () => {
      const u = await storage.getUsername();
      if (u) setUsername(u);
    };
    fetchUser();
  }, []);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: motion.duration.slower, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: motion.duration.slower, easing: motion.easing.standard, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <ScreenShell scrollable={false} padded={false} bg={colors.light.background}>
        <View style={styles.content}>
          <View style={styles.searchWrapper}>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => navigation.navigate('Search')}
              activeOpacity={0.8}
              accessibilityLabel="Search stores and products"
              accessibilityRole="search"
            >
              <View style={styles.searchIconWrapper}>
                <Search size={icons.sizes.md} color={colors.light.textMuted} weight="bold" />
              </View>
              <Text style={styles.searchPlaceholder}>Search stores, products...</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScrollContent}
              style={styles.categoryScroll}
            >
              {CATEGORIES.map((cat, i) => renderCategory({ item: cat, index: i }))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Stores</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Discover')}
                accessibilityLabel="View all featured stores"
              >
                <Text style={styles.sectionLink}>View all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={FEATURED_STORES}
              renderItem={renderFeaturedStore}
              keyExtractor={(item) => String(item.id)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredScrollContent}
              snapToAlignment="start"
              decelerationRate="fast"
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nearby</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Discover')}
                accessibilityLabel="View all nearby stores"
              >
                <Text style={styles.sectionLink}>View all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={NEARBY_STORES}
              renderItem={renderNearbyStore}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={styles.nearbyListContent}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </ScreenShell>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  content: { flex: 1, paddingBottom: spacing.xxl },
  searchWrapper: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.md },
  searchButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.light.surface, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.xl, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  searchIconWrapper: { width: 40, height: 40, borderRadius: radius.lg, backgroundColor: colors.light.accentSoft, alignItems: 'center', justifyContent: 'center' },
  searchPlaceholder: { flex: 1, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, color: colors.light.textMuted },
  section: { paddingHorizontal: spacing.xl, marginBottom: spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineMedium.fontSize, lineHeight: typography.scale.headlineMedium.lineHeight, letterSpacing: typography.scale.headlineMedium.letterSpacing, color: colors.light.textPrimary },
  sectionLink: { fontFamily: typography.fontFamilies.chip, fontSize: typography.scale.labelMedium.fontSize, color: colors.light.accent },
  categoryScroll: { marginHorizontal: -spacing.xl, paddingHorizontal: spacing.xl },
  categoryScrollContent: { gap: spacing.sm, paddingBottom: spacing.sm },
  categoryChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, borderWidth: 1, borderColor: colors.light.border },
  categoryChipText: { fontFamily: typography.fontFamilies.chip, fontSize: typography.scale.labelMedium.fontSize, letterSpacing: typography.scale.labelMedium.letterSpacing, color: colors.light.textSecondary },
  featuredScrollContent: { paddingHorizontal: spacing.xl, gap: spacing.md, paddingBottom: spacing.sm },
  featuredCard: { width: SCREEN_WIDTH - spacing.xl * 2 },
  featuredCardInner: { width: '100%' },
  featuredImageContainer: { position: 'relative', height: 160, borderRadius: radius.lg, overflow: 'hidden', margin: -2, marginBottom: spacing.md },
  featuredImage: { flex: 1, backgroundColor: colors.light.surfaceElevated },
  featuredBadge: { position: 'absolute', top: spacing.md, left: spacing.md, backgroundColor: colors.light.accent, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  featuredBadgeText: { fontFamily: typography.fontFamilies.caption, fontSize: typography.scale.labelSmall.fontSize, color: '#FFFFFF' },
  featuredContent: { gap: spacing.xs },
  featuredHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  featuredName: { fontFamily: typography.fontFamilies.title, fontSize: typography.scale.titleLarge.fontSize, lineHeight: typography.scale.titleLarge.lineHeight, color: colors.light.textPrimary, flex: 1 },
  featuredRating: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.light.successSoft, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.full },
  ratingText: { fontFamily: typography.fontFamilies.mono, fontSize: typography.scale.mono.fontSize, color: colors.light.success },
  featuredCategory: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, color: colors.light.textSecondary },
  featuredMeta: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  metaText: { fontFamily: typography.fontFamilies.caption, fontSize: typography.scale.labelSmall.fontSize, color: colors.light.textMuted },
  nearbyListContent: { paddingTop: spacing.xs },
  nearbyCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, backgroundColor: colors.light.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.light.border },
  nearbyIcon: { width: 48, height: 48, borderRadius: radius.lg, backgroundColor: colors.light.accentSoft, alignItems: 'center', justifyContent: 'center' },
  nearbyEmoji: { fontSize: 24 },
  nearbyInfo: { flex: 1, gap: 2 },
  nearbyName: { fontFamily: typography.fontFamilies.title, fontSize: typography.scale.titleMedium.fontSize, color: colors.light.textPrimary },
  nearbyCategory: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, color: colors.light.textSecondary },
  nearbyRating: { alignItems: 'flex-end', gap: 2 },
  nearbyDistance: { fontFamily: typography.fontFamilies.caption, fontSize: typography.scale.labelSmall.fontSize, color: colors.light.textMuted },
  separator: { height: 1, backgroundColor: colors.light.border, marginHorizontal: spacing.xl },
});

export default HomeScreen;
