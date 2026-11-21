import React, { useCallback, useEffect, useState } from 'react';
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
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cart = await cartAPI.getCart();
      setCartItems(cart.items || []);
      setSubtotal(cart.subtotal || 0);
      setTotal(cart.total || 0);
    } catch (err) {
      setCartItems([]);
      setSubtotal(0);
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

  const removeItem = useCallback(async (productId) => {
    try {
      const cart = await cartAPI.removeItem(productId);
      setCartItems(cart.items || []);
      setSubtotal(cart.subtotal || 0);
      setTotal(cart.total || 0);
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
      setTotal(cart.total || 0);
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
      setTotal(cart.total || 0);
    } catch (err) {
      const message = err.response?.data?.error;
      setError(typeof message === 'string'
        ? message
        : 'Could not update cart item quantity.');
    }
  }, []);

  const checkout = useCallback(async () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }
    navigation.navigate('Checkout');
  }, [cartItems, navigation]);

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
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>
                      {item.name || 'Product'}
                    </Text>
                    <Text style={styles.itemVendor}>
                      {typeof item.vendor === 'string' ? item.vendor : item.vendor?.store_name || ''}
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
                    {item.price || 0} {item.currency || 'NGN'}
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
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.subtotalAmount}>{subtotal} {currency}</Text>

              <Text style={styles.summaryLabel}>Platform fee</Text>
              <Text style={styles.subtotalAmount}>{(subtotal * 0.1).toFixed(0)} {currency}</Text>

              <Text style={styles.summaryLabel}>Delivery fee</Text>
              <Text style={styles.subtotalAmount}>200 {currency}</Text>

              <View style={styles.divider} />

              <Text style={styles.summaryLabelTotal}>TOTAL</Text>
              <Text style={styles.totalAmount}>{total} {currency}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={checkout}
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

const currency = 'NGN';

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
