import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography, radius } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { ShoppingBag, ArrowRight } from '../utils/phosphorIcons';
import { cartAPI } from '../utils/api';
import { orderAPI } from '../utils/api';

export const CheckoutScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(200);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cart = await cartAPI.getCart();
      const items = cart.items || [];
      const sub = cart.subtotal || 0;
      const fee = Math.ceil((sub * 1000) / 10000); // 10% platform fee in kobo, rounded up
      setCartItems(items);
      setSubtotal(sub);
      setPlatformFee(fee);
      setTotal(sub + fee + (cart.delivery_fee || 200));
    } catch (err) {
      const message = err.response?.data?.error;
      setError(typeof message === 'string' ? message : 'Could not load cart.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const placeOrder = useCallback(async () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }
    const vendorId = cartItems[0]?.vendor_id || cartItems[0]?.vendorId;
    setPlacingOrder(true);
    try {
      const order = await orderAPI.createOrder(cartItems, vendorId);
      if (order?.id) {
        navigation.navigate('OrderDetail', { orderId: order.id });
      } else {
        setError('Could not create order. Please try again.');
        setPlacingOrder(false);
      }
    } catch (err) {
      const message = err.response?.data?.error;
      setError(typeof message === 'string' ? message : 'Could not place order.');
      setPlacingOrder(false);
    }
  }, [cartItems, navigation]);

  if (loading) {
    return (
      <ScreenShell>
        <ActivityIndicator size="large" color={colors.light.accent} />
      </ScreenShell>
    );
  }

  if (error) {
    return (
      <ScreenShell>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCart}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell scrollable={false} padded bg={colors.light.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ShoppingBag size={28} color={colors.light.accent} />
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cartItems.map((item) => (
            <View key={item.product_id || item.productId} style={styles.cartItem}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name || 'Product'}</Text>
                <Text style={styles.itemQty}>
                  x{item.quantity || 1}
                </Text>
              </View>
              <Text style={styles.itemPrice}>
                {(item.price || 0) * (item.quantity || 1)}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{subtotal}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.summaryLabel}>Platform fee</Text>
            <Text style={styles.summaryValue}>{platformFee}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.summaryLabel}>Delivery fee</Text>
            <Text style={styles.summaryValue}>{deliveryFee}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.rowTotal}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{total}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={placingOrder || cartItems.length === 0 ? undefined : placeOrder}
          accessibilityRole="button"
          accessibilityLabel="Place order"
        >
          <View style={styles.buttonContent}>
            {placingOrder ? (
              <ActivityIndicator size="small" color={colors.light.onAccent} />
            ) : (
              <ArrowRight size={20} color={colors.light.onAccent} />
            )}
            <Text style={styles.buttonText}>
              {placingOrder ? 'Placing order...' : 'Place order'}
            </Text>
          </View>
        </TouchableOpacity>

        {cartItems.length === 0 && (
          <ScreenState
            type="empty"
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Add items from a store before checking out."
            actionLabel="Explore shops"
            onAction={() => navigation.navigate('Discover')}
          />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontFamily: typography.fontFamilies.headline,
    fontSize: typography.scale.headlineMedium.fontSize,
    letterSpacing: typography.scale.headlineMedium.letterSpacing,
    color: colors.light.textPrimary,
    marginLeft: spacing.sm,
  },
  section: {
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
    letterSpacing: 0.5,
    color: colors.light.textMuted,
    marginBottom: spacing.sm,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    color: colors.light.textPrimary,
  },
  itemQty: {
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.labelSmall.fontSize,
    color: colors.light.textSecondary,
  },
  itemPrice: {
    fontFamily: typography.fontFamilies.bodyMedium,
    fontSize: typography.scale.bodyMedium.fontSize,
    color: colors.light.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    color: colors.light.textSecondary,
  },
  summaryValue: {
    fontFamily: typography.fontFamilies.bodyMedium,
    fontSize: typography.scale.bodyMedium.fontSize,
    color: colors.light.textPrimary,
  },
  rowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    backgroundColor: colors.light.accentSoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  totalLabel: {
    fontFamily: typography.fontFamilies.headlineMedium,
    fontSize: typography.scale.headlineMedium.fontSize,
    color: colors.light.textPrimary,
  },
  totalValue: {
    fontFamily: typography.fontFamilies.headlineMedium,
    fontSize: typography.scale.headlineMedium.fontSize,
    color: colors.light.accentStrong,
    fontWeight: '600',
  },
  checkoutButton: {
    backgroundColor: colors.light.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  buttonText: {
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelLarge.fontSize,
    color: colors.light.onAccent,
    fontWeight: '600',
  },
  errorText: {
    color: colors.light.error,
    textAlign: 'center',
    marginHorizontal: spacing.md,
  },
  retryButton: {
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  retryText: {
    color: colors.light.accent,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelMedium.fontSize,
  },
});

export default CheckoutScreen;
