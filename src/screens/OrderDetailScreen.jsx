import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { orderAPI } from '../utils/api';
import { X } from '../utils/phosphorIcons';

export const OrderDetailScreen = ({ navigation }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orderId } = navigation.getParam('orderId', '');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const order = await orderAPI.getOrder(orderId);
        setOrder(order);
      } catch (err) {
        const message = err.response?.data?.error;
        setError(typeof message === 'string'
          ? message
          : 'Could not load order details. Check your connection and try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

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
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </ScreenShell>
    );
  }

  if (!order) {
    return (
      <ScreenShell>
        <Text style={styles.emptyText}>Order not found</Text>
      </ScreenShell>
    );
  }

  // Determine if user can confirm delivery or cancel
  const canConfirmDelivery = order.status !== 'delivered' && order.status !== 'cancelled';
  const canCancelOrder = order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'refunded';

  return (
    <ScreenShell>
      <View style={styles.container}>
        <Text style={styles.header}>Order #{order.id}</Text>

        <View style={styles.orderDetails}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>
            {order.status || 'Pending'}
          </Text>
        </View>

        <View style={styles.orderDetails}>
          <Text style={styles.label}>Total</Text>
          <Text style={styles.value}>
            {order.totalAmount || 0} {order.currency || 'NGN'}
          </Text>
        </View>

        {order.items && order.items.length > 0 && (
          <View style={styles.itemsSection}>
            <Text style={styles.sectionLabel}>Items</Text>
            {order.items.map((item) => (
              <View key={item.productId} style={styles.item}>
                <Text style={styles.itemName}>{item.name || 'Product'}</Text>
                <Text style={styles.itemDetails}>
                  Qty: {item.quantity || 1} - {item.price || 0} {order.currency || 'NGN'} each
                </Text>
              </View>
            ))}
          </View>
        )}

        {canConfirmDelivery && (
          <TouchableOpacity
            style={styles.confirmDeliveryButton}
            onPress={() => handleConfirmDelivery()}
            accessibilityRole="button"
            accessibilityLabel="Confirm delivery"
          >
            <Text style={styles.confirmDeliveryText}>
              Confirm delivery
            </Text>
          </TouchableOpacity>
        )}

        {canCancelOrder && (
          <TouchableOpacity
            style={styles.cancelOrderButton}
            onPress={() => handleCancelOrder()}
            accessibilityRole="button"
            accessibilityLabel="Cancel order"
          >
            <Text style={styles.cancelOrderText}>Cancel order</Text>
          </TouchableOpacity>
        )}

        {order.status === 'delivered' && (
          <View style={styles.deliveryConfirmed}>
            <Text style={styles.deliveryText}>
              Delivery confirmed - funds will be released to vendor after 24-hour auto-release timer
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Back to orders"
        >
          <Text style={styles.backText}>← Back to Orders</Text>
        </TouchableOpacity>
      </View>
    </ScreenShell>
  );
};

const handleConfirmDelivery = async () => {
  try {
    const order = await orderAPI.confirmDelivery(navigation.getParam('orderId', ''));
    if (order?.id) {
      // Refresh the order details
      setOrder(order);
    }
  } catch (err) {
    const message = err.response?.data?.error;
    setError(typeof message === 'string'
      ? message
      : 'Could not confirm delivery. Please try again.');
  }
};

const handleCancelOrder = async () => {
  try {
    const order = await orderAPI.cancelOrder(navigation.getParam('orderId', ''));
    if (order?.id) {
      // Refresh the order details
      setOrder(order);
    }
  } catch (err) {
    const message = err.response?.data?.error;
    setError(typeof message === 'string'
      ? message
      : 'Could not cancel order. Please try again.');
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    padding: spacing.xl,
  },
  header: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.headline,
    fontSize: typography.scale.headlineLarge.fontSize,
    fontWeight: '600',
    marginBottom: spacing.xl,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  label: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
  },
  value: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    fontWeight: '500',
  },
  itemsSection: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelMedium.fontSize,
    marginBottom: spacing.sm,
  },
  item: {
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    marginBottom: spacing.sm,
  },
  itemName: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    fontWeight: '500',
  },
  itemDetails: {
    color: colors.light.textMuted,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.labelSmall.fontSize,
    marginLeft: spacing.sm,
  },
  confirmDeliveryButton: {
    backgroundColor: colors.light.accent,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  confirmDeliveryText: {
    color: colors.light.background,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    fontWeight: '600',
  },
  cancelOrderButton: {
    backgroundColor: colors.error,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.md,
    marginLeft: spacing.sm,
  },
  cancelOrderText: {
    color: colors.light.background,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    fontWeight: '600',
  },
  deliveryConfirmed: {
    padding: spacing.md,
    backgroundColor: colors.success,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  deliveryText: {
    color: colors.light.background,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
  },
  backButton: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: 8,
  },
  backText: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
  },
  errorText: {
    color: colors.error,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    margin: spacing.md,
  },
  retryButton: {
    padding: spacing.md,
    backgroundColor: colors.light.surface,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  retryText: {
    color: colors.light.accent,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
  },
  emptyText: {
    color: colors.light.textMuted,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});