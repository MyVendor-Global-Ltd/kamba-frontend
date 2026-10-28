import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MapPin, MagnifyingGlass, Storefront } from 'phosphor-react-native';
import { colors, typography, spacing, radius } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { vendorAPI } from '../utils/api';

const getName = (store) => store.store_name || store.name || 'Campus store';

export const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

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

  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return [];
    return stores.filter((store) => [getName(store), store.category, store.location_text, store.description]
      .some((field) => String(field || '').toLocaleLowerCase().includes(needle)));
  }, [stores, query]);

  const openStore = (store) => {
    if (store.slug) navigation.navigate('StoreDetail', { slug: store.slug });
  };

  return (
    <ScreenShell scrollable padded bg={colors.light.background}>
      <View style={styles.container}>
        <View style={styles.searchBox}>
          <MagnifyingGlass size={20} color={colors.light.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Store name, category, or location"
            placeholderTextColor={colors.light.textMuted}
            style={styles.input}
            autoCapitalize="none"
            returnKeyType="search"
            accessibilityLabel="Search stores"
          />
          {query.length > 0 ? <TouchableOpacity onPress={() => setQuery('')} accessibilityRole="button" accessibilityLabel="Clear search"><Text style={styles.clear}>Clear</Text></TouchableOpacity> : null}
        </View>

        {loading ? (
          <View style={styles.stateBox} accessibilityRole="progressbar"><ActivityIndicator color={colors.light.accent} /><Text style={styles.stateText}>Loading stores…</Text></View>
        ) : error ? (
          <View style={styles.stateBox}><Text style={styles.stateText}>{error}</Text><TouchableOpacity onPress={() => setReloadKey((key) => key + 1)} accessibilityRole="button"><Text style={styles.link}>Try again</Text></TouchableOpacity></View>
        ) : !query.trim() ? (
          <View style={styles.stateBox}><MagnifyingGlass size={32} color={colors.light.textMuted} /><Text style={styles.stateTitle}>Search campus stores</Text><Text style={styles.stateText}>Search the public store catalog by name, category, or location.</Text></View>
        ) : results.length === 0 ? (
          <View style={styles.stateBox}><Text style={styles.stateTitle}>No matching stores</Text><Text style={styles.stateText}>Try another name, category, or location.</Text></View>
        ) : (
          <View style={styles.list}>
            <Text style={styles.resultCount}>{results.length} {results.length === 1 ? 'store' : 'stores'} found</Text>
            {results.map((store) => (
              <TouchableOpacity
                key={store.id || store.slug}
                style={styles.storeCard}
                onPress={() => openStore(store)}
                disabled={!store.slug}
                activeOpacity={0.82}
                accessibilityRole="button"
                accessibilityLabel={`View ${getName(store)}`}
              >
                <View style={styles.icon}><Storefront size={22} color={colors.light.accent} weight="bold" /></View>
                <View style={styles.storeInfo}>
                  <Text style={styles.storeName} numberOfLines={1}>{getName(store)}</Text>
                  <Text style={styles.category}>{store.category || 'Campus store'}</Text>
                  {store.location_text ? <View style={styles.locationRow}><MapPin size={13} color={colors.light.textMuted} /><Text style={styles.location} numberOfLines={1}>{store.location_text}</Text></View> : null}
                </View>
                {store.vendor_profiles?.is_verified ? <Text style={styles.verified}>Verified</Text> : null}
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
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 52, paddingHorizontal: spacing.md, backgroundColor: colors.light.surface, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.xl },
  input: { flex: 1, paddingVertical: spacing.md, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, color: colors.light.textPrimary, outlineStyle: 'none' },
  clear: { fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize, color: colors.light.accent },
  stateBox: { flex: 1, minHeight: 220, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl, backgroundColor: colors.light.surface, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.lg },
  stateTitle: { fontFamily: typography.fontFamilies.title, fontSize: typography.scale.titleLarge.fontSize, color: colors.light.textPrimary, textAlign: 'center' },
  stateText: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, color: colors.light.textSecondary, textAlign: 'center' },
  link: { fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize, color: colors.light.accent },
  list: { gap: spacing.sm },
  resultCount: { fontFamily: typography.fontFamilies.caption, fontSize: typography.scale.labelSmall.fontSize, color: colors.light.textMuted },
  storeCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, backgroundColor: colors.light.surface, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.lg },
  icon: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.light.accentSoft },
  storeInfo: { flex: 1, gap: 3 },
  storeName: { fontFamily: typography.fontFamilies.title, fontSize: typography.scale.titleMedium.fontSize, color: colors.light.textPrimary },
  category: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, color: colors.light.textSecondary, textTransform: 'capitalize' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  location: { flex: 1, fontFamily: typography.fontFamilies.caption, fontSize: typography.scale.labelSmall.fontSize, color: colors.light.textMuted },
  verified: { fontFamily: typography.fontFamilies.caption, fontSize: typography.scale.labelSmall.fontSize, color: colors.light.success },
});

export default SearchScreen;
