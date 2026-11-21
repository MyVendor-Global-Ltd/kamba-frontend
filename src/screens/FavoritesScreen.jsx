import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, Heart, Trash } from '../utils/phosphorIcons';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { marketplaceAPI } from '../utils/api';

const formatNaira = (kobo) => `₦${(Number(kobo || 0) / 100).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const FavoritesScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [authRequired, setAuthRequired] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    setAuthRequired(false);
    try {
      setItems(await marketplaceAPI.getWishlist());
    } catch (err) {
      setItems([]);
      setAuthRequired([401, 403].includes(err.response?.status));
      setError(err.response?.data?.message || err.response?.data?.error || 'Could not load saved products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (productId) => {
    setBusyId(productId);
    setError('');
    try {
      await marketplaceAPI.removeWishlistItem(productId);
      setItems((current) => current.filter((item) => item.product_id !== productId));
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Could not remove this saved product.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <ScreenShell scrollable padded bg={colors.light.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityLabel="Go back" accessibilityRole="button">
            <ArrowLeft size={24} color={colors.light.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Saved products</Text>
        </View>
        {!!error ? (
          <ScreenState
            type="error"
            title="Saved products unavailable"
            description={error}
            actionLabel={authRequired ? 'Sign in as buyer' : 'Try again'}
            onAction={() => authRequired ? navigation.navigate('Auth', { screen: 'Login' }) : load()}
          />
        ) : loading ? (
          <ActivityIndicator size="large" color={colors.light.accent} />
        ) : items.length === 0 ? (
          <ScreenState
            type="empty"
            icon={Heart}
            title="No saved products yet"
            description="Save products from their detail pages and they will appear here."
            actionLabel="Explore products"
            onAction={() => navigation.navigate('Main', { screen: 'Discover' })}
          />
        ) : (
          <View style={styles.list}>
            {items.map((item) => (
              <View key={item.product_id} style={styles.item}>
                <TouchableOpacity style={styles.product} onPress={() => navigation.navigate('ProductDetail', { productId: item.product_id })} accessibilityRole="button">
                  {item.images?.[0] ? <Image source={{ uri: item.images[0] }} style={styles.image} /> : <View style={[styles.image, styles.imageFallback]}><Heart size={20} color={colors.light.textMuted} /></View>}
                  <View style={styles.copy}>
                    <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.store}>{item.store_name || 'Local shop'}</Text>
                    <Text style={styles.price}>{formatNaira(item.price)}</Text>
                    {!item.available ? <Text style={styles.unavailable}>Currently unavailable</Text> : null}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.remove} onPress={() => remove(item.product_id)} disabled={busyId === item.product_id} accessibilityRole="button" accessibilityLabel="Remove saved product">
                  {busyId === item.product_id ? <ActivityIndicator size="small" color={colors.light.accent} /> : <Trash size={18} color={colors.light.error} />}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.lg, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  backButton: { padding: spacing.sm },
  headerTitle: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineMedium.fontSize },
  list: { gap: spacing.md },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.lg, backgroundColor: colors.light.surface },
  product: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  image: { width: 76, height: 76, borderRadius: radius.md, backgroundColor: colors.light.accentSoft },
  imageFallback: { alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: spacing.xs },
  name: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
  store: { color: colors.light.textMuted, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.labelSmall.fontSize },
  price: { color: colors.light.accent, fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.titleSmall.fontSize },
  unavailable: { color: colors.light.error, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.labelSmall.fontSize },
  remove: { padding: spacing.sm },
});

export default FavoritesScreen;
