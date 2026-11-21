import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { ShoppingBag, X } from '../utils/phosphorIcons';
import { cartAPI } from '../utils/api';

export const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [platformFeeBps, setPlatformFeeBps] = useState(500);
  const [total, setTotal] = useState(0);
  const [currency, setCurrency] = useState('NGN');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cart = await cartAPI.getCart();
      setCartItems(cart.items || []);
      setSelectedProductIds((current) => current.length ? current.filter((id) => (cart.items || []).some((item) => item.product_id === id)) : (cart.items || []).map((item) => item.product_id));
      setSubtotal(cart.subtotal || 0);
      setPlatformFee(cart.platform_fee || 0);
      setPlatformFeeBps(Number.isSafeInteger(cart.platform_fee_bps) ? cart.platform_fee_bps : 500);
      setTotal(cart.total || 0);
      setCurrency(cart.currency || 'NGN');
    } catch (err) {
      setCartItems([]);
      setSubtotal(0);
      setPlatformFee(0);
      setTotal(0);
      const message = err.response?.data?.error;
      setError(typeof message === 'string'
        ? message
        : 'Could not load cart. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const selectedItems = useMemo(
    () => cartItems.filter((item) => selectedProductIds.includes(item.product_id)),
    [cartItems, selectedProductIds],
  );
  const selectedSubtotal = selectedItems.reduce((sum, item) => sum + Number(item.line_total ?? ((Number(item.price) || 0) * (Number(item.quantity) || 1))), 0);
  const selectedFee = Math.ceil((selectedSubtotal * platformFeeBps) / 10000);
  const selectedTotal = selectedSubtotal + selectedFee;

  const toggleSelected = useCallback((productId) => {
    setSelectedProductIds((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
  }, []);

  const removeItem = useCallback(async (productId) => {
    try {
      const cart = await cartAPI.removeItem(productId);
      setCartItems(cart.items || []);
      setSelectedProductIds((current) => current.filter((id) => (cart.items || []).some((item) => item.product_id === id)));
      setSubtotal(cart.subtotal || 0);
      setPlatformFee(cart.platform_fee || 0);
      setTotal(cart.total || 0);
      setCurrency(cart.currency || 'NGN');
    } catch (err) {
      const message = err.response?.data?.error;
      setError(typeof message === 'string'
        ? message
        : 'Could not remove item from cart.');
    }
  }, []);

  const increaseQuantity = useCallback(async (productId, currentQuantity) => {
    try {
      const cart = await cartAPI.updateItem(productId, (currentQuantity || 1) + 1);
      setCartItems(cart.items || []);
      setSubtotal(cart.subtotal || 0);
      setPlatformFee(cart.platform_fee || 0);
      setTotal(cart.total || 0);
      setCurrency(cart.currency || 'NGN');
    } catch (err) {
      const message = err.response?.data?.error;
      setError(typeof message === 'string'
        ? message
        : 'Could not update cart item quantity.');
    }
  }, []);

  const decreaseQuantity = useCallback(async (productId, currentQuantity) => {
    try {
      const cart = await cartAPI.updateItem(productId, Math.max((currentQuantity || 1) - 1, 1));
      setCartItems(cart.items || []);
      setSubtotal(cart.subtotal || 0);
      setPlatformFee(cart.platform_fee || 0);
      setTotal(cart.total || 0);
      setCurrency(cart.currency || 'NGN');
    } catch (err) {
      const message = err.response?.data?.error;
      setError(typeof message === 'string'
        ? message
        : 'Could not update cart item quantity.');
    }
  }, []);

  const checkout = useCallback(async () => {
    if (selectedItems.length === 0) {
      setError('Your cart is empty');
      return;
    }
    navigation.navigate('Checkout', { selectedProductIds });
  }, [selectedItems, selectedProductIds, navigation]);

  return (
    <ScreenShell scrollable={false} padded bg={colors.light.background}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>YOUR CART</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.light.accent} />
        ) : cartItems.length === 0 ? (
          <ScreenState
            type="empty"
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Browse local stores and add products to your cart. Your order total is calculated securely at checkout."
            actionLabel="Explore shops"
            onAction={() => navigation.navigate('Discover')}
          />
        ) : (
          <>
            <View style={styles.cartItems}>
              {cartItems.map((item) => (
                <View key={item.product_id || item.productId} style={styles.cartItem}>
                  <TouchableOpacity
                    style={[styles.selectItem, selectedProductIds.includes(item.product_id) && styles.selectItemActive]}
                    onPress={() => toggleSelected(item.product_id)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selectedProductIds.includes(item.product_id) }}
                    accessibilityLabel={`Select ${item.name || 'product'}`}
                  >
                    <Text style={styles.selectItemText}>{selectedProductIds.includes(item.product_id) ? '✓' : ''}</Text>
                  </TouchableOpacity>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>
                      {item.name || 'Product'}
                    </Text>
                    <Text style={styles.itemVendor}>
                      {item.store_name || (typeof item.vendor === 'string' ? item.vendor : item.vendor?.store_name) || ''}
                    </Text>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => decreaseQuantity(item.product_id || item.productId, item.quantity)}
                      accessibilityRole="button"
                      accessibilityLabel="Decrease quantity"
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>
                      {item.quantity || 1}
                    </Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => increaseQuantity(item.product_id || item.productId, item.quantity)}
                      accessibilityRole="button"
                      accessibilityLabel="Increase quantity"
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.itemPrice}>
                    {formatMoney(item.price, currency)}
                  </Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeItem(item.product_id || item.productId)}
                    accessibilityRole="button"
                    accessibilityLabel="Remove item"
                  >
                    <X size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.cartSummary}>
              <Text style={styles.summaryLabel}>Selected items ({selectedItems.length})</Text>
              <Text style={styles.subtotalAmount}>{formatMoney(selectedSubtotal, currency)}</Text>

              <Text style={styles.summaryLabel}>Estimated Kamba platform charge</Text>
              <Text style={styles.subtotalAmount}>{formatMoney(selectedFee, currency)}</Text>

              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={styles.subtotalAmount}>Calculated at checkout</Text>

              <View style={styles.divider} />

              <Text style={styles.summaryLabelTotal}>SELECTED ITEMS TOTAL · PICKUP ESTIMATE</Text>
              <Text style={styles.totalAmount}>{formatMoney(selectedTotal, currency)}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={checkout}
              disabled={selectedItems.length === 0}
              accessibilityRole="button"
              accessibilityLabel="Proceed to checkout"
            >
              <Text style={styles.checkoutButtonText}>
                Proceed to checkout
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScreenShell>
  );
};

const formatMoney = (amountKobo, currencyCode = 'NGN') => {
  const amount = (Number(amountKobo) || 0) / 100;
  if (currencyCode === 'NGN') {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${currencyCode} ${amount.toFixed(2)}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  eyebrow: {
    color: colors.light.accent,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
    letterSpacing: 1,
    textAlign: 'center',
    paddingTop: spacing.md,
  },
  cartItems: {
    padding: spacing.md,
  },
  selectItem: {
    width: 24, height: 24, borderWidth: 1.5, borderColor: colors.light.border,
    borderRadius: 7, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm,
  },
  selectItemActive: { backgroundColor: colors.light.accent, borderColor: colors.light.accent },
  selectItemText: { color: colors.light.onAccent, fontWeight: '700', fontSize: 15 },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    fontWeight: '500',
  },
  itemVendor: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.labelSmall.fontSize,
    marginLeft: spacing.sm,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginLeft: spacing.md,
  },
  quantityButton: {
    width: 30,
    height: 30,
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
  removeButton: {
    marginLeft: spacing.sm,
  },
  cartSummary: {
    padding: spacing.md,
    backgroundColor: colors.light.surface,
    borderRadius: radius.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  summaryLabel: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.labelSmall.fontSize,
    marginRight: spacing.sm,
  },
  subtotalAmount: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: colors.light.border,
    marginVertical: spacing.sm,
  },
  summaryLabelTotal: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  totalAmount: {
    color: colors.light.accent,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.displaySmall.fontSize,
    fontWeight: '600',
  },
  checkoutButton: {
    width: '100%',
    backgroundColor: colors.light.accent,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  checkoutButtonText: {
    color: colors.light.background,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    fontWeight: '600',
  },
});
