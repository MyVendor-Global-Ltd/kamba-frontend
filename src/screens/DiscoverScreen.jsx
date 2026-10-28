import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MagnifyingGlass, MapPin, Storefront } from 'phosphor-react-native';
import { colors, typography, spacing, radius } from '../theme/tokens';
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

const getName = (store) => store.store_name || store.name || 'Campus store';
const CATEGORY_ALIASES = {
  food: ['food'],
  fashion: ['fashion'],
  tech: ['tech', 'technology', 'electronics'],
  books: ['book', 'books'],
  beauty: ['beauty'],
  services: ['service', 'services'],
};

export const DiscoverScreen = ({ navigation, route }) => {
  const initialCategory = route?.params?.category || 'all';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchText, setSearchText] = useState('');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setSelectedCategory(route?.params?.category || 'all');
  }, [route?.params?.category]);

  const loadStores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setStores(await vendorAPI.listStores({ page: 1, limit: 50 }));
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

  const filteredStores = useMemo(() => {
    const query = searchText.trim().toLocaleLowerCase();
    return stores.filter((store) => {
      const normalizedCategory = String(store.category || '').toLocaleLowerCase();
      const categoryMatches = selectedCategory === 'all' || (CATEGORY_ALIASES[selectedCategory] || [selectedCategory]).includes(normalizedCategory);
      const searchMatches = !query || [getName(store), store.category, store.location_text, store.description]
        .some((value) => String(value || '').toLocaleLowerCase().includes(query));
      return categoryMatches && searchMatches;
    });
  }, [stores, selectedCategory, searchText]);

  const openStore = (store) => {
    if (store.slug) navigation.navigate('StoreDetail', { slug: store.slug });
  };

  return (
    <ScreenShell scrollable padded bg={colors.light.background}>
      <View style={styles.container}>
        <View style={styles.searchBox}>
          <MagnifyingGlass size={20} color={colors.light.textMuted} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search stores, categories, locations..."
            placeholderTextColor={colors.light.textMuted}
            style={styles.searchInput}
            returnKeyType="search"
            accessibilityLabel="Search campus stores"
          />
        </View>

        <Text style={styles.heading}>Browse stores</Text>
        <View style={styles.categories}>
          <TouchableOpacity
            style={[styles.categoryChip, selectedCategory === 'all' && styles.categorySelected]}
            onPress={() => setSelectedCategory('all')}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === 'all' }}
          >
            <Text style={[styles.categoryText, selectedCategory === 'all' && styles.categoryTextSelected]}>All</Text>
          </TouchableOpacity>
          {CATEGORIES.map((category) => {
            const selected = selectedCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryChip, { backgroundColor: selected ? colors.light.accent : category.color }, selected && styles.categorySelected]}
                onPress={() => setSelectedCategory(category.id)}
                accessibilityRole="button"
                accessibilityLabel={`${category.name} category`}
                accessibilityState={{ selected }}
              >
                <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>{category.icon} {category.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {loading ? (
          <View style={styles.stateBox} accessibilityRole="progressbar">
            <ActivityIndicator color={colors.light.accent} />
            <Text style={styles.stateText}>Loading campus stores…</Text>
          </View>
        ) : error ? (
          <View style={styles.stateBox}>
            <Text style={styles.stateText}>{error}</Text>
            <TouchableOpacity onPress={() => setReloadKey((key) => key + 1)} accessibilityRole="button">
              <Text style={styles.retry}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : filteredStores.length === 0 ? (
          <View style={styles.stateBox}>
            <Text style={styles.stateTitle}>{stores.length ? 'No matching stores' : 'No stores to show yet'}</Text>
            <Text style={styles.stateText}>{stores.length ? 'Try another category or search term.' : 'New campus stores will appear here when available.'}</Text>
          </View>
        ) : (
          <View style={styles.storeList}>
            {filteredStores.map((store) => (
              <TouchableOpacity
                key={store.id || store.slug}
                style={styles.storeCard}
                onPress={() => openStore(store)}
                disabled={!store.slug}
                activeOpacity={0.82}
                accessibilityRole="button"
                accessibilityLabel={`View ${getName(store)}`}
              >
                <View style={styles.storeIcon}><Storefront size={24} color={colors.light.accent} weight="bold" /></View>
                <View style={styles.storeInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.storeName} numberOfLines={1}>{getName(store)}</Text>
                    {store.vendor_profiles?.is_verified ? <Text style={styles.verified}>Verified</Text> : null}
                  </View>
                  <Text style={styles.categoryLabel}>{store.category || 'Campus store'}</Text>
                  {store.location_text ? (
                    <View style={styles.locationRow}>
                      <MapPin size={14} color={colors.light.textMuted} />
                      <Text style={styles.location} numberOfLines={1}>{store.location_text}</Text>
                    </View>
                  ) : null}
                </View>
                {store.slug ? <Text style={styles.chevron}>›</Text> : null}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.lg },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.xl, backgroundColor: colors.light.surface, paddingHorizontal: spacing.md, minHeight: 52 },
  searchInput: { flex: 1, paddingVertical: spacing.md, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, color: colors.light.textPrimary, outlineStyle: 'none' },
  heading: { fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineMedium.fontSize, color: colors.light.textPrimary },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, alignItems: 'flex-start' },
  categoryChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, borderWidth: 1, borderColor: colors.light.border },
  categorySelected: { borderColor: colors.light.accent },
  categoryText: { fontFamily: typography.fontFamilies.chip, fontSize: typography.scale.labelMedium.fontSize, color: colors.light.textSecondary },
  categoryTextSelected: { color: '#FFFFFF' },
  storeList: { gap: spacing.sm },
  storeCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, backgroundColor: colors.light.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.light.border },
  storeIcon: { width: 48, height: 48, borderRadius: radius.lg, backgroundColor: colors.light.accentSoft, alignItems: 'center', justifyContent: 'center' },
  storeInfo: { flex: 1, gap: 3 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  storeName: { flexShrink: 1, fontFamily: typography.fontFamilies.title, fontSize: typography.scale.titleLarge.fontSize, color: colors.light.textPrimary },
  verified: { fontFamily: typography.fontFamilies.caption, fontSize: typography.scale.labelSmall.fontSize, color: colors.light.success },
  categoryLabel: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, color: colors.light.textSecondary, textTransform: 'capitalize' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  location: { flex: 1, fontFamily: typography.fontFamilies.caption, fontSize: typography.scale.labelSmall.fontSize, color: colors.light.textMuted },
  chevron: { fontFamily: typography.fontFamilies.mono, fontSize: typography.scale.monoLarge.fontSize, color: colors.light.textMuted },
  stateBox: { alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.xl, backgroundColor: colors.light.surface, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.lg },
  stateTitle: { fontFamily: typography.fontFamilies.title, fontSize: typography.scale.titleLarge.fontSize, color: colors.light.textPrimary, textAlign: 'center' },
  stateText: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, color: colors.light.textSecondary, textAlign: 'center' },
  retry: { fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize, color: colors.light.accent },
});

export default DiscoverScreen;
