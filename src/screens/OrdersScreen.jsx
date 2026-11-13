import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { Package } from '../utils/phosphorIcons';
import { orderAPI } from '../utils/api';

export const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const orders = await orderAPI.listOrders();
        setOrders(orders || []);
      } catch (err) {
        setOrders([]);
        const message = err.response?.data?.error;
        setError(typeof message === 'string'
          ? message
          : 'Could not load orders. Check your connection and try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <ScreenShell scrollable={false} padded bg={colors.light.background}>
        <ActivityIndicator size="large" color={colors.light.accent} />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell scrollable={false} padded bg={colors.light.background}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>ORDER HISTORY</Text>
        <Text style={styles.heading}>Your orders</Text>

        {orders.length === 0 ? (
          <ScreenState
            type="empty"
            icon={Package}
            title="No orders yet"
            description="Start by exploring shops and adding items to your cart."
            actionLabel="Explore shops"
            onAction={() => navigation.navigate('Main', { screen: 'Discover' })}
          />
        ) : (
          <View style={styles.ordersList}>
            {orders.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderItem}
                onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
                accessibilityRole="button"
                accessibilityLabel={`Order ${order.id}`}
              >
                <Text style={styles.orderNumber}>Order #{order.id}</Text>
                <Text style={styles.orderStatus}>
                  {order.status || 'Pending'}
                </Text>
                <Text style={styles.orderAmount}>
                  {order.total_amount || order.totalAmount || 0} {order.currency || 'NGN'}
                </Text>
              </TouchableOpacity>
            ))}
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
  eyebrow: {
    color: colors.light.accent,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
    letterSpacing: 1,
    paddingTop: spacing.md,
  },
  heading: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.display,
    fontSize: typography.scale.displaySmall.fontSize,
    lineHeight: typography.scale.displaySmall.lineHeight,
    marginBottom: spacing.md,
  },
  ordersList: {
    padding: spacing.md,
  },
  orderItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    marginBottom: spacing.md,
  },
  orderNumber: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    fontWeight: '500',
  },
  orderStatus: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.labelSmall.fontSize,
    marginLeft: spacing.sm,
  },
  orderAmount: {
    color: colors.light.accent,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
});
