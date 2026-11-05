import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MagnifyingGlass, X } from '../utils/phosphorIcons';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { StoreCard } from '../components/StoreCard';
import { vendorAPI } from '../utils/api';

const getStoreName = (store) => store.store_name || store.name || 'Local shop';

export const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return stores.filter((store) => [
      getStoreName(store),
      store.category,
      store.location_text,
      store.description,
    ].some((field) => String(field || '').toLowerCase().includes(needle)));
  }, [stores, query]);

  const openStore = (store) => {
    if (store.slug) navigation.navigate('StoreDetail', { slug: store.slug });
  };

  return (
    <ScreenShell
      padded
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
          <Text style={styles.eyebrow}>SEARCH KAMBA</Text>
          <Text style={styles.heading}>Find a local shop</Text>
          <Text style={styles.description}>Search by shop, category, or location.</Text>
        </View>

        <View style={styles.searchBox}>
          <MagnifyingGlass size={20} color={colors.light.textMuted} weight="regular" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search local shops"
            placeholderTextColor={colors.light.textMuted}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search local shops"
          />
          {query ? (
            <TouchableOpacity
              onPress={() => setQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <X size={18} color={colors.light.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {loading ? (
          <ScreenState
            type="loading"
            title="Loading shops"
            description="Getting the latest store listings."
          />
        ) : error ? (
          <ScreenState
            type="error"
            title="Could not load shops"
            description={error}
            actionLabel="Try again"
            onAction={loadStores}
          />
        ) : !query.trim() ? (
          <ScreenState
            type="empty"
            icon={MagnifyingGlass}
            title="Start with a search"
            description="Search the store directory by name, category, or location."
          />
        ) : results.length === 0 ? (
          <ScreenState
            type="empty"
            title="No matching shops"
            description="Try a different shop name, category, or location."
          />
        ) : (
          <View style={styles.results}>
            <Text style={styles.resultsHeading}>Matching shops</Text>
            <View style={styles.storeList}>
              {results.map((store) => (
                <StoreCard
                  key={store.id || store.slug}
                  store={store}
                  onPress={() => openStore(store)}
                />
              ))}
            </View>
          </View>
        )}
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.xl,
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
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
  },
  results: {
    gap: spacing.md,
  },
  resultsHeading: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.headline,
    fontSize: typography.scale.headlineMedium.fontSize,
  },
  storeList: {
    gap: spacing.sm,
  },
});

export default SearchScreen;
