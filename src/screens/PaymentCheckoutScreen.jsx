import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { orderAPI, marketplaceCheckoutAPI } from '../utils/api';
import { formatCurrency } from '../utils/format';

const money = (kobo) => formatCurrency((Number(kobo) || 0) / 100);

export const PaymentCheckoutScreen = ({ navigation, route }) => {
  const orderId = route?.params?.orderId || '';
  const checkoutId = route?.params?.checkoutId || '';
  const isParentCheckout = Boolean(checkoutId);
  const [instructions, setInstructions] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadPayment = useCallback(async (initialize = false) => {
    if (!orderId && !checkoutId) {
      setError('This payment session is missing its order ID.');
      setLoading(false);
      return;
    }
    if (initialize) setLoading(true);
    else setRefreshing(true);
    setError('');
    try {
      if (initialize) {
        const result = isParentCheckout
          ? await marketplaceCheckoutAPI.initiatePayment(checkoutId)
          : await orderAPI.initiatePayment(orderId);
        if (result?.payment_instructions?.method !== 'bank_transfer') {
          throw new Error('Kamba did not receive temporary bank-transfer instructions.');
        }
        setInstructions(result.payment_instructions);
      }
      const status = isParentCheckout
        ? await marketplaceCheckoutAPI.getStatus(checkoutId)
        : await orderAPI.getPaymentStatus(orderId);
      setPayment(status);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Could not load payment instructions.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [orderId, checkoutId, isParentCheckout]);

  useEffect(() => { loadPayment(true); }, [loadPayment]);

  useEffect(() => {
    if (payment?.status !== 'pending') return undefined;
    const timer = setInterval(() => { loadPayment(false); }, 6000);
    return () => clearInterval(timer);
  }, [payment?.status, loadPayment]);

  const status = payment?.status || 'pending';
  const paid = isParentCheckout ? status === 'held' : ['held', 'released'].includes(status);
  const failed = isParentCheckout ? ['failed', 'expired'].includes(status) : ['failed', 'refunded'].includes(status);

  if (loading) {
    return <ScreenShell><ActivityIndicator size="large" color={colors.light.accent} /></ScreenShell>;
  }

  return (
    <ScreenShell scrollable padded bg={colors.light.background}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>KAMBA SECURE CHECKOUT</Text>
        <Text style={styles.title}>Complete your transfer</Text>
        {isParentCheckout ? <Text style={styles.copy}>One payment covers {route?.params?.childOrders?.length || 'all'} store orders in this checkout.</Text> : null}
        <Text style={styles.copy}>This temporary account belongs to this checkout only. Transfer the exact amount shown below. Paystack will notify Kamba when the transfer is confirmed.</Text>

        {instructions ? (
          <View style={styles.card}>
            <Text style={styles.label}>Exact amount to transfer</Text>
            <Text style={styles.amount}>{money(instructions.amount_minor)}</Text>
            <View style={styles.divider} />
            <Text style={styles.label}>Bank</Text>
            <Text style={styles.value}>{instructions.bank_name}</Text>
            <Text style={styles.label}>Account name</Text>
            <Text style={styles.value}>{instructions.account_name}</Text>
            <Text style={styles.label}>Temporary account number</Text>
            <Text selectable style={styles.accountNumber}>{instructions.account_number}</Text>
            <View style={styles.warning}>
              <Text style={styles.warningText}>IMPORTANT: Transfer exactly {money(instructions.amount_minor)}. Do not round up, underpay or send a different amount. A transfer that Paystack rejects will not pay your order.</Text>
            </View>
            <Text style={styles.expiry}>Account expires {instructions.expires_at ? new Date(instructions.expires_at).toLocaleString() : 'according to Paystack’s temporary account expiry'}.</Text>
          </View>
        ) : null}

        <View style={styles.statusCard}>
          <Text style={styles.label}>Payment status</Text>
          <Text style={[styles.status, paid ? styles.statusSuccess : failed ? styles.statusFailed : styles.statusPending]}>
            {paid ? 'Payment received' : failed ? 'Payment failed' : 'Waiting for your transfer'}
          </Text>
          <Text style={styles.copy}>
            {paid
              ? 'Paystack has confirmed the payment. ' + (isParentCheckout ? 'All store orders in this checkout are now being prepared.' : 'Your order is now being prepared.')
              : failed
                ? 'This payment did not complete. Check your order for the latest status before trying again.'
                : 'Keep this screen open or return later. Kamba checks the payment automatically; tapping refresh does not mark a transfer as paid.'}
          </Text>
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}
        {!paid && !failed ? (
          <TouchableOpacity style={styles.primaryButton} onPress={() => loadPayment(false)} disabled={refreshing}>
            {refreshing ? <ActivityIndicator color={colors.light.onAccent} /> : <Text style={styles.primaryText}>Refresh payment status</Text>}
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => isParentCheckout
          ? navigation.navigate('Orders')
          : navigation.replace('OrderDetail', { orderId })}>
          <Text style={styles.secondaryText}>{isParentCheckout ? 'View my orders' : paid ? 'View order' : 'Return to order'}</Text>
        </TouchableOpacity>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.md, paddingBottom: spacing.xxxl },
  eyebrow: { color: colors.light.textMuted, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize, letterSpacing: 1 },
  title: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.display, fontSize: typography.scale.displaySmall.fontSize },
  copy: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, lineHeight: typography.scale.bodySmall.lineHeight },
  card: { gap: spacing.sm, padding: spacing.lg, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.light.border, backgroundColor: colors.light.surface },
  label: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  amount: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.display, fontSize: typography.scale.displaySmall.fontSize },
  divider: { height: 1, backgroundColor: colors.light.border, marginVertical: spacing.xs },
  value: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelLarge.fontSize, marginBottom: spacing.sm },
  accountNumber: { color: colors.light.accent, fontFamily: typography.fontFamilies.display, fontSize: typography.scale.headlineLarge.fontSize, letterSpacing: 1, marginBottom: spacing.sm },
  warning: { padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.light.background, borderWidth: 1, borderColor: colors.light.error },
  warningText: { color: colors.light.error, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.bodySmall.fontSize, lineHeight: typography.scale.bodySmall.lineHeight },
  expiry: { color: colors.light.textMuted, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.labelSmall.fontSize },
  statusCard: { gap: spacing.sm, padding: spacing.lg, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.light.border, backgroundColor: colors.light.surface },
  status: { fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineSmall.fontSize },
  statusSuccess: { color: colors.light.success },
  statusFailed: { color: colors.light.error },
  statusPending: { color: colors.light.warning },
  error: { color: colors.light.error, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize },
  primaryButton: { minHeight: 52, borderRadius: radius.xl, backgroundColor: colors.light.accent, alignItems: 'center', justifyContent: 'center', padding: spacing.md },
  primaryText: { color: colors.light.onAccent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelLarge.fontSize },
  secondaryButton: { minHeight: 48, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.light.border, alignItems: 'center', justifyContent: 'center', padding: spacing.md },
  secondaryText: { color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
});

export default PaymentCheckoutScreen;
