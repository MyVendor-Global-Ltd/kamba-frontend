import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { Package } from '../utils/phosphorIcons';
import { orderAPI } from '../utils/api';

const formatMoney = (amountKobo, currency = 'NGN') => {
  const amount = (Number(amountKobo) || 0) / 100;
  return currency === 'NGN'
    ? `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `${currency} ${amount.toFixed(2)}`;
};

export const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadOrders = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    else setRefreshing(true);
    setError('');
    try {
      setOrders(await orderAPI.listOrders());
    } catch (err) {
      setOrders([]);
      setError(err.response?.data?.message || err.response?.data?.error || 'Could not load orders. Check your connection and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  return (
    <ScreenShell
      scrollable
      padded
      bg={colors.light.background}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => loadOrders(false)}
          tintColor={colors.light.accent}
          colors={[colors.light.accent]}
        />
      }
    >
      <View style={styles.container}>
        <Text style={styles.eyebrow}>ORDER HISTORY</Text>
        <Text style={styles.heading}>Your orders</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.light.accent} />
        ) : error ? (
          <ScreenState type="error" title="Could not load orders" description={error} actionLabel="Try again" onAction={() => loadOrders()} />
        ) : orders.length === 0 ? (
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
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>Order #{String(order.id).slice(0, 8).toUpperCase()}</Text>
                  <Text style={styles.orderStatus}>{String(order.status || 'pending').replaceAll('_', ' ')}</Text>
                </View>
                {order.store_name ? <Text style={styles.storeName}>{order.store_name}</Text> : null}
                <View style={styles.orderFooter}>
                  <Text style={styles.orderMeta}>{Number(order.item_count) || 0} item(s) · {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Date unavailable'}</Text>
                  <Text style={styles.orderAmount}>{formatMoney(order.total, order.currency)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.md, backgroundColor: colors.light.background, paddingBottom: spacing.xxxl },
  eyebrow: { color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize, letterSpacing: 1, paddingTop: spacing.md },
  heading: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.display, fontSize: typography.scale.displaySmall.fontSize, lineHeight: typography.scale.displaySmall.lineHeight, marginBottom: spacing.md },
  ordersList: { gap: spacing.md },
  orderItem: { gap: spacing.sm, padding: spacing.lg, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.lg, backgroundColor: colors.light.surface },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  orderNumber: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
  orderStatus: { color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize, textTransform: 'capitalize' },
  storeName: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md },
  orderMeta: { flex: 1, color: colors.light.textMuted, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.labelSmall.fontSize },
  orderAmount: { color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
});

export default OrdersScreen;
