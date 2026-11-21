import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { MagnifyingGlass, Storefront, X } from '../utils/phosphorIcons';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { StoreCard } from '../components/StoreCard';
import { productAPI, userAPI } from '../utils/api';
import marketplaceCategories from '../data/marketplaceCategories';

const formatNaira = (amountKobo) =>
  `₦${(Number(amountKobo || 0) / 100).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const ProductListScreen = ({ navigation, route }) => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [savedLocation, setSavedLocation] = useState(null);
  const [locationReady, setLocationReady] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (Number.isFinite(savedLocation?.lat) && Number.isFinite(savedLocation?.lng)) {
        params.lat = savedLocation.lat;
        params.lng = savedLocation.lng;
        params.radius = 15;
        params.sort = 'nearest';
      }
      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }
      if (query.trim()) {
        params.search = query.trim();
      }
      const results = await productAPI.listProducts(params);
      setProducts(results);
    } catch (err) {
      setProducts([]);
      const message = err.response?.data?.error;
      setError(typeof message === 'string'
        ? message
        : 'Could not load products. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, query, savedLocation]);

  useEffect(() => {
    let active = true;
    userAPI.getLocation()
      .then((location) => { if (active) setSavedLocation(location); })
      .catch(() => { if (active) setSavedLocation(null); })
      .finally(() => { if (active) setLocationReady(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (locationReady) loadProducts();
  }, [loadProducts, locationReady]);

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return products;
    return products.filter((product) =>
      [product.name, product.description, product.category].some((field) =>
        String(field || '').toLowerCase().includes(needle)
      )
    );
  }, [products, query]);

  const openProduct = (product) => {
    if (product.id) {
      navigation.navigate('ProductDetail', { productId: product.id });
    }
  };

  return (
    <ScreenShell
      padded
      bg={colors.light.background}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={loadProducts}
          tintColor={colors.light.accent}
          colors={[colors.light.accent]}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.headingBlock}>
          <Text style={styles.eyebrow}>SHOP PRODUCTS</Text>
          <Text style={styles.heading}>Find items from local shops</Text>
          <Text style={styles.description}>{Number.isFinite(savedLocation?.lat) && Number.isFinite(savedLocation?.lng)
            ? `Showing products within 15 km of ${savedLocation.location_text || 'your saved location'}.`
            : 'Search or browse by category. Set a location to find nearby products.'}</Text>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search products..."
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
            leftIcon={<MagnifyingGlass size={18} color={colors.light.textMuted} />}
            rightIcon={query ? <X size={18} color={colors.light.textMuted} /> : null}
            onPressClear={query ? () => setQuery('') : undefined}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setQuery('')}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <X size={16} color={colors.light.accent} />
          </TouchableOpacity>
        </View>

        {categoryFilter !== 'all' ? (
          <View style={styles.categoryFilter}>
            <Text style={styles.categoryLabel}>Category:</Text>
            <View style={styles.categoryChips}>
              <TouchableOpacity
                style={styles.categoryChip}
                onPress={() => setCategoryFilter('all')}
                accessibilityRole="button"
                accessibilityLabel="All categories"
              >
                <Text style={styles.categoryChipText} active={categoryFilter === 'all'}>
                  All
                </Text>
              </TouchableOpacity>
              {marketplaceCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryChip}
                  onPress={() => setCategoryFilter(category.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Category: ${category.label}`}
                >
                  <Text style={styles.categoryChipText} active={categoryFilter === category.id}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}

        <ScrollView
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadProducts}
              tintColor={colors.light.accent}
              colors={[colors.light.accent]}
            />
          }
        >
          {loading ? (
            <ActivityIndicator size="large" color={colors.light.accent} />
          ) : products.length === 0 ? (
            <ScreenState
              type="empty"
              icon={Storefront}
              title="No products found"
              description="Try adjusting your search or category filter."
              actionLabel="Browse shops"
              onAction={() => navigation.navigate('Discover')}
            />
          ) : (
            <View style={styles.productGrid}>
              {filteredProducts.map((product) => (
                <StoreCard
                  key={product.id}
                  store={{ store_name: product.store_name || 'Local shop', slug: product.store_slug }}
                  onPress={() => openProduct(product)}
                >
                  <View style={styles.productImage}>
                    <View
                      style={{
                        width: '100%',
                        height: 100,
                        borderRadius: 8,
                        backgroundColor: colors.light.surface,
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}
                    >
                      {(product.image_url || product.images?.[0])
                        ? (
                          <Image
                            source={{ uri: product.image_url || product.images[0] }}
                            style={{ width: '100%', height: '100%' }}
                          />
                        )
                        : (
                          <Text style={styles.placeholderText}>
                            No image
                          </Text>
                        )}
                    </View>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>
                      {product.name}
                    </Text>
                    <Text style={styles.productVendor}>
                      {product.store_name || 'Local shop'}
                    </Text>
                  </View>
                  <View style={styles.productPrice}>
                    {product.price !== undefined ? (
                      <Text style={styles.productPriceAmount}>
                        {formatNaira(product.price)}
                      </Text>
                    ) : (
                      <Text style={styles.productPriceAmount}>Price on request</Text>
                    )}
                  </View>
                </StoreCard>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  headingBlock: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
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
  },
  description: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodySmall.fontSize,
  },
  searchBox: {
    padding: spacing.md,
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: colors.light.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontFamily: typography.fontFamilies.body,
  },
  searchButton: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.light.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  categoryFilter: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  categoryLabel: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.labelSmall.fontSize,
    marginRight: spacing.sm,
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor:
      colors.light.accent,
    borderRadius: radius.full,
  },
  categoryChipText: {
    color: colors.light.background,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
  },
  productList: {
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  productGrid: {
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  placeholderText: {
    color: colors.light.textMuted,
    fontFamily: typography.fontFamilies.body,
  },
  productInfo: {
    padding: spacing.xs,
  },
  productName: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodySmall.fontSize,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  productVendor: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.labelSmall.fontSize,
    textAlign: 'center',
  },
  productPrice: {
    padding: spacing.xs,
  },
  productPriceAmount: {
    color: colors.light.accent,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    fontWeight: '600',
    textAlign: 'center',
  },
});