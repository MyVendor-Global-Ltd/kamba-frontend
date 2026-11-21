import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { productAPI, cartAPI } from '../utils/api';

export const ProductDetailScreen = ({ navigation, route }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const productId = route.params?.productId;

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await productAPI.getProduct(productId);
      if (!p) throw new Error('This product is no longer available.');
      setProduct(p);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Could not load product details.'
      );
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  if (!product) {
    return (
      <ScreenShell scrollable padded bg={colors.light.background}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.light.accent} />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.errorText}>{error || 'Product not found.'}</Text>
            <TouchableOpacity style={styles.addToCartButton} onPress={loadProduct}>
              <Text style={styles.addToCartButtonText}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScreenShell>
    );
  }

  const stockQuantity = Number(product.stock_quantity ?? product.stock ?? 0);
  const inStock = Number.isFinite(stockQuantity) && stockQuantity > 0 && product.in_stock !== false;
  const productImages = Array.isArray(product.images)
    ? product.images
    : (product.image_url ? [product.image_url] : []);

  const addToCart = async () => {
    if (!product.id) return;
    setAddingToCart(true);
    try {
      await cartAPI.addItem(product.id, quantity);
      setNotice('Added to your cart.');
      setError(null);
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message;
      setError(typeof message === 'string' ? message : 'Could not add this product to your cart.');
      setNotice('');
    } finally {
      setAddingToCart(false);
    }
  };

  const increaseQuantity = () => {
    setQuantity((q) => Math.min(q + 1, stockQuantity));
  };

  const decreaseQuantity = () => {
    setQuantity((q) => Math.max(q - 1, 1));
  };

  const handleAddToCart = () => {
    if (quantity > stockQuantity) {
      // Show simple feedback
      return;
    }
    addToCart();
  };

  return (
    <ScreenShell scrollable padded bg={colors.light.background}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.light.accent} />
        ) : (
          <View style={styles.productCard}>
            <View style={styles.productImage}>
              {productImages.length > 0 ? (
                <Image
                  source={{ uri: productImages[0] }}
                  style={{ width: '100%', height: 200 }}
                />
              ) : (
                <View
                  style={{
                    width: '100%',
                    height: 200,
                    borderRadius: radius.lg,
                    backgroundColor: colors.light.surface,
                  }}
                />
              )}
            </View>

            <View style={styles.productDetails}>
              <View style={styles.productHeader}>
                <Text style={styles.productName}>
                  {product.name}
                </Text>
                <Text style={styles.productSku}>
                  SKU: {product.sku || 'N/A'}
                </Text>
              </View>

              <View style={styles.productMeta}>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Category:</Text>
                  <Text style={styles.metaValue}>
                    {product.category || 'Uncategorized'}
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Vendor:</Text>
                  <Text style={styles.metaValue}>
                    {product.store_name || 'Local shop'}
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Price:</Text>
                  <Text style={styles.metaValue}>
                    {formatNaira(product.price, product.currency || 'NGN')}
                  </Text>
                </View>
              </View>

              {product.description && (
                <View style={styles.productDescription}>
                  <Text style={styles.descriptionLabel}>Description:</Text>
                  <Text style={styles.descriptionText}>
                    {product.description}
                  </Text>
                </View>
              )}

              <View style={styles.stockInfo}>
                  {inStock ? (
                    <Text style={styles.stockAvailable}>
                      {stockQuantity} in stock
                    </Text>
                  ) : (
                    <Text style={styles.stockOut}>
                      Out of stock
                    </Text>
                  )}
              </View>

              {inStock && !addingToCart && (
                <View style={styles.quantityControl}>
                  <Text style={styles.quantityLabel}>Quantity:</Text>
                  <View style={styles.quantityButtons}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={decreaseQuantity}
                      accessibilityRole="button"
                      accessibilityLabel="Decrease quantity"
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>{quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={increaseQuantity}
                      accessibilityRole="button"
                      accessibilityLabel="Increase quantity"
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {!!notice && <Text accessibilityRole="alert" style={styles.noticeText}>{notice}</Text>}
              {!!error && <Text accessibilityRole="alert" style={styles.errorText}>{error}</Text>}

              {!inStock && !addingToCart && (
                <Text style={styles.stockOutText}>
                  This item is currently out of stock
                </Text>
              )}

              {addingToCart && (
                <Text style={styles.addingText}>Adding to cart...</Text>
              )}
            </View>

            <View style={styles.addToCartArea}>
              {inStock && !addingToCart && (
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={handleAddToCart}
                  accessibilityRole="button"
                  accessibilityLabel="Add to cart"
                >
                  <Text style={styles.addToCartButtonText}>
                    Add to cart
                  </Text>
                </TouchableOpacity>
              )}

              {addingToCart && (
                <Text style={styles.addingText}>Adding to cart...</Text>
              )}

              {!inStock && !addingToCart && (
                <Text style={styles.cannotAddText}>
                  Unable to add - item out of stock
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    </ScreenShell>
  );
};

const formatNaira = (amountKobo, currency = 'NGN') => {
  const amount = (Number(amountKobo) || 0) / 100;
  return currency === 'NGN'
    ? `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `${currency} ${amount.toFixed(2)}`;
};

const styles = StyleSheet.create({
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  errorText: { color: colors.light.error, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, textAlign: 'center' },
  noticeText: { color: colors.light.success, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize },
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  productCard: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    margin: spacing.md,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.light.surface,
    position: 'relative',
  },
  productDetails: {
    padding: spacing.md,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  productName: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.display,
    fontSize: typography.scale.displayMedium.fontSize,
    fontWeight: '600',
  },
  productSku: {
    color: colors.light.textMuted,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.labelSmall.fontSize,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  metaLabel: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.labelSmall.fontSize,
  },
  metaValue: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodySmall.fontSize,
  },
  productDescription: {
    marginVertical: spacing.sm,
  },
  descriptionLabel: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.labelSmall.fontSize,
    marginBottom: spacing.xs,
  },
  descriptionText: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodySmall.fontSize,
    lineHeight: 20,
  },
  stockInfo: {
    marginVertical: spacing.sm,
    padding: spacing.xs,
    backgroundColor: colors.light.background,
    borderRadius: radius.md,
  },
  stockAvailable: {
    color: colors.light.accent,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodySmall.fontSize,
  },
  stockOut: {
    color: colors.error,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodySmall.fontSize,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.light.surface,
    borderRadius: radius.md,
  },
  quantityLabel: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.labelSmall.fontSize,
    marginRight: spacing.sm,
  },
  quantityButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.background,
    borderRadius: radius.md,
    padding: spacing.xs,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  quantityButtonText: {
    color: colors.light.accent,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    fontWeight: '600',
  },
  quantityValue: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    marginHorizontal: 4,
  },
  addToCartArea: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  addToCartButton: {
    width: '100%',
    backgroundColor: colors.light.accent,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: colors.light.background,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    fontWeight: '600',
  },
  cannotAddText: {
    color: colors.error,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodySmall.fontSize,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  addingText: {
    color: colors.light.accent,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodySmall.fontSize,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});