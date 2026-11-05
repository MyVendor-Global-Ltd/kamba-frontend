import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MagnifyingGlass, Storefront, X } from '../utils/phosphorIcons';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { MarketplaceCategoryChip } from '../components/MarketplaceCategoryChip';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { StoreCard } from '../components/StoreCard';
import { marketplaceCategories } from '../data/marketplaceCategories';
import { vendorAPI } from '../utils/api';

const allShopsCategory = { id: 'all', label: 'All shops', Icon: Storefront };
const categories = [allShopsCategory, ...marketplaceCategories];

const isValidCategory = (categoryId) => (
  categoryId === 'all' || marketplaceCategories.some((category) => category.id === categoryId)
);

export const DiscoverScreen = ({ navigation, route }) => {
  const routeCategory = route?.params?.category;
  const [selectedCategory, setSelectedCategory] = useState(
    isValidCategory(routeCategory) ? routeCategory : 'all'
  );
  const [searchText, setSearchText] = useState('');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSelectedCategory(isValidCategory(routeCategory) ? routeCategory : 'all');
  }, [routeCategory]);

  const loadStores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setStores(await vendorAPI.listStores({ page: 1, limit: 50 }));
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

  const filteredStores = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    const category = marketplaceCategories.find((item) => item.id === selectedCategory);

    return stores.filter((store) => {
      const normalizedCategory = String(store.category || '').trim().toLowerCase();
      const categoryMatches = selectedCategory === 'all'
        || category?.aliases.includes(normalizedCategory);
      const searchMatches = !query || [
        store.store_name,
        store.name,
        store.category,
        store.location_text,
        store.description,
      ].some((value) => String(value || '').toLowerCase().includes(query));

      return categoryMatches && searchMatches;
    });
  }, [stores, selectedCategory, searchText]);

  const openStore = (store) => {
    if (store.slug) navigation.navigate('StoreDetail', { slug: store.slug });
  };

  const emptyDescription = stores.length
    ? 'Try another category or search term.'
    : 'New local sellers will appear here when they join Kamba.';

  return (
    <ScreenShell
      padded={false}
      bg={colors.light.background}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={loadStores}
          tintColor={colors.light.accent}
          colors={[colors.light.accent]}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.headingBlock}>
          <Text style={styles.eyebrow}>DISCOVER</Text>
          <Text style={styles.heading}>Explore local shops</Text>
          <Text style={styles.description}>Search by shop, category, or location.</Text>
        </View>

        <View style={styles.searchBox}>
          <MagnifyingGlass size={20} color={colors.light.textMuted} weight="regular" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search local shops"
            placeholderTextColor={colors.light.textMuted}
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
            accessibilityLabel="Search local shops"
          />
          {searchText ? (
            <TouchableOpacity
              onPress={() => setSearchText('')}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <X size={18} color={colors.light.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Browse categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            {categories.map((category) => (
              <MarketplaceCategoryChip
                key={category.id}
                category={category}
                selected={selectedCategory === category.id}
                onPress={() => setSelectedCategory(category.id)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>Shops</Text>
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
          ) : filteredStores.length === 0 ? (
            <ScreenState
              type="empty"
              title={stores.length ? 'No matching shops' : 'No shops listed yet'}
              description={emptyDescription}
            />
          ) : (
            <View style={styles.storeList}>
              {filteredStores.map((store) => (
                <StoreCard
                  key={store.id || store.slug}
                  store={store}
                  onPress={() => openStore(store)}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  headingBlock: {
    gap: spacing.xs,
  },
  eyebrow: {
    color: colors.light.accent,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
    letterSpacing: 1,
  },
  heading: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.display,
    fontSize: typography.scale.displaySmall.fontSize,
    lineHeight: typography.scale.displaySmall.lineHeight,
  },
  description: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    lineHeight: typography.scale.bodyMedium.lineHeight,
  },
  searchBox: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: radius.xl,
    backgroundColor: colors.light.surface,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
  },
  filterSection: {
    gap: spacing.sm,
  },
  filterLabel: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelMedium.fontSize,
  },
  categoryList: {
    gap: spacing.sm,
    paddingRight: spacing.xl,
  },
  resultsSection: {
    gap: spacing.md,
  },
  resultsTitle: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.headline,
    fontSize: typography.scale.headlineMedium.fontSize,
  },
  storeList: {
    gap: spacing.sm,
  },
});

export default DiscoverScreen;
