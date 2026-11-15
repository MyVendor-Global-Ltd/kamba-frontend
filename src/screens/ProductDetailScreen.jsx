import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { Storefront, ShoppingBag, ChevronRight } from '../utils/phosphorIcons';
import { productAPI, cartAPI } from '../utils/api';
import { vendorAPI } from '../utils/api';

export const ProductDetailScreen = ({ navigation, route }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inStock, setInStock] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const productId = route.params?.productId;

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await productAPI.getProduct(productId);
      setProduct(p);
      setInStock(p?.stock !== false && p?.stock !== 0);
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
        <ActivityIndicator size="large" color={colors.light.accent} />
      </ScreenShell>
    );
  }

  const addToCart = async () => {
    if (!product.id) return;
    setAddingToCart(true);
    try {
      const cart = await cartAPI.addItem(product.id, quantity);
      setQuantity(cart.items.length > 0 ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 1);
    } catch (err) {
      // Cart errors handled by interceptor
    } finally {
      setAddingToCart(false);
    }
  };

  const increaseQuantity = () => {
    setQuantity((q) => Math.min(q + 1, product?.maxQuantity || 99));
  };

  const decreaseQuantity = () => {
    setQuantity((q) => Math.max(q - 1, 1));
  };

  const handleAddToCart = () => {
    if (product.stock !== undefined && quantity > product.stock) {
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
              {product.image_url ? (
                <Image
                  source={{ uri: product.image_url }}
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
                    {product.vendor?.store_name || 'Unknown shop'}
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Price:</Text>
                  <Text style={styles.metaValue}>
                    {product.price} {product.currency || 'NGN'}
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

              {product.stock !== undefined && (
                <View style={styles.stockInfo}>
                  {product.stock > 0 ? (
                    <Text style={styles.stockAvailable}>
                      {product.stock} in stock
                    </Text>
                  ) : (
                    <Text style={styles.stockOut}>
                      Out of stock
                    </Text>
                  )}
                </View>
              )}

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

const styles = StyleSheet.create({
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