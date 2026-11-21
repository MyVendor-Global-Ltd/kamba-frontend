import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { Storefront, AlertCircle, CheckCircle, XCircle } from '../utils/phosphorIcons';
import { vendorAPI } from '../utils/api';

const formatNaira = (kobo, currency = 'NGN') => {
  const amount = (Number(kobo) || 0) / 100;
  return currency === 'NGN'
    ? `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `${currency} ${amount.toFixed(2)}`;
};

const statusLabel = (status) => ({
  pending: 'Awaiting payment',
  held: 'Pending settlement',
  releasing: 'Settlement processing',
  released: 'Payout confirmed',
  disputed: 'Disputed',
  refunding: 'Refund processing',
  refunded: 'Refunded',
  failed: 'Payment failed',
}[status] || String(status || 'Unknown').replaceAll('_', ' '));

const statusColor = (status) => ({
  pending: colors.light.warning,
  held: colors.light.accent,
  releasing: colors.light.warning,
  released: colors.light.success,
  disputed: colors.light.error,
  refunding: colors.light.warning,
  refunded: colors.light.muted,
  failed: colors.light.error,
}[status] || colors.light.textPrimary);

export const VendorPaymentScreen = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadPayments = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    else setRefreshing(true);
    setError('');
    try {
      setPayments(await vendorAPI.getPayments());
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Could not load payment data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadPayments(); }, [loadPayments]);

  return (
    <ScreenShell
      scrollable
      padded
      bg={colors.light.background}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => loadPayments(false)}
          tintColor={colors.light.accent}
          colors={[colors.light.accent]}
        />
      }
    >
      <View style={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>VENDOR FINANCE</Text>
          <Text style={styles.title}>Payment records</Text>
          <Text style={styles.description}>Your product earnings are shown separately from the buyer's gross payment, Kamba's platform charge and delivery.</Text>
        </View>

        {loading ? (
          <View style={styles.state}>
            <ActivityIndicator size="large" color={colors.light.accent} />
            <Text style={styles.stateText}>Loading payment records…</Text>
          </View>
        ) : error ? (
          <View style={styles.state}>
            <AlertCircle size={42} color={colors.light.error} />
            <Text style={styles.stateTitle}>Could not load payments</Text>
            <Text style={styles.stateText}>{error}</Text>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => loadPayments()}><Text style={styles.secondaryText}>Try again</Text></TouchableOpacity>
          </View>
        ) : payments.length === 0 ? (
          <View style={styles.state}>
            <Storefront size={42} color={colors.light.muted} />
            <Text style={styles.stateTitle}>No payment records yet</Text>
            <Text style={styles.stateText}>Your seller payable and payment status will appear here after buyers pay for your orders.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {payments.map((payment) => {
              const currency = payment.currency || 'NGN';
              const paymentDate = payment.paid_at || payment.order_created_at;
              return (
                <View key={payment.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.reference}>#{String(payment.order_id || payment.id).slice(0, 8).toUpperCase()}</Text>
                    <Text style={[styles.status, { color: statusColor(payment.status) }]}>{statusLabel(payment.status)}</Text>
                  </View>

                  <View style={styles.primaryAmount}>
                    <Text style={styles.primaryLabel}>Your seller payable</Text>
                    <Text style={styles.primaryValue}>{formatNaira(payment.seller_payable_amount, currency)}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Buyer paid (gross)</Text>
                    <Text style={styles.detailValue}>{formatNaira(payment.amount, currency)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Items subtotal</Text>
                    <Text style={styles.detailValue}>{formatNaira(payment.subtotal, currency)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Kamba platform charge ({((payment.platform_fee_bps || 0) / 100).toFixed(2)}%)</Text>
                    <Text style={styles.detailValue}>{formatNaira(payment.platform_fee, currency)}</Text>
                  </View>
                  {Number(payment.shipping_amount) > 0 ? (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Buyer delivery charge</Text>
                      <Text style={styles.detailValue}>{formatNaira(payment.shipping_amount, currency)}</Text>
                    </View>
                  ) : null}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Payment date</Text>
                    <Text style={styles.detailValue}>{paymentDate ? new Date(paymentDate).toLocaleDateString() : 'Not recorded'}</Text>
                  </View>
                  {payment.released_at ? (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Provider-confirmed payout</Text>
                      <Text style={styles.detailValue}>{new Date(payment.released_at).toLocaleString()}</Text>
                    </View>
                  ) : null}
                  {payment.auto_release_at && ['held', 'releasing'].includes(payment.status) ? (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Release eligibility time</Text>
                      <Text style={styles.detailValue}>{new Date(payment.auto_release_at).toLocaleString()}</Text>
                    </View>
                  ) : null}
                  {payment.dispute_id ? (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Dispute</Text>
                      <Text style={[styles.detailValue, { color: colors.light.error }]}>#{payment.dispute_id}</Text>
                    </View>
                  ) : null}

                  {payment.status === 'held' ? (
                    <View style={styles.notice}>
                      <Text style={styles.noticeText}>Payment has been verified. Your seller payable is awaiting the configured release workflow. This internal status is not proof of a completed bank transfer.</Text>
                    </View>
                  ) : null}
                  {payment.status === 'pending' ? (
                    <View style={styles.notice}><Text style={styles.noticeText}>Awaiting verified payment from the payment provider.</Text></View>
                  ) : null}
                  {payment.status === 'releasing' ? (
                    <View style={styles.notice}><Text style={styles.noticeText}>A settlement request has been submitted. The payout is not complete until the provider confirms it.</Text></View>
                  ) : null}
                  {payment.status === 'disputed' ? (
                    <View style={styles.noticeError}>
                      <AlertCircle size={16} color={colors.light.error} />
                      <Text style={styles.noticeText}>A dispute is open. Settlement is paused pending review.</Text>
                    </View>
                  ) : null}
                  {payment.status === 'released' ? (
                    <View style={styles.noticeSuccess}>
                      <CheckCircle size={16} color={colors.light.success} />
                      <Text style={styles.noticeText}>The payment provider confirmed the seller payout.</Text>
                    </View>
                  ) : null}
                  {payment.status === 'refunding' ? (
                    <View style={styles.notice}><Text style={styles.noticeText}>A refund has been requested and is awaiting provider confirmation.</Text></View>
                  ) : null}
                  {payment.status === 'refunded' ? (
                    <View style={styles.notice}>
                      <XCircle size={16} color={colors.light.muted} />
                      <Text style={styles.noticeText}>The payment provider confirmed the buyer refund.</Text>
                    </View>
                  ) : null}
                  {payment.status === 'failed' ? (
                    <View style={styles.noticeError}><AlertCircle size={16} color={colors.light.error} /><Text style={styles.noticeText}>The payment did not complete.</Text></View>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  content: { gap: spacing.xl, paddingBottom: spacing.xxxl },
  heading: { gap: spacing.xs },
  eyebrow: { color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize, letterSpacing: 1 },
  title: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.display, fontSize: typography.scale.displaySmall.fontSize },
  description: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, lineHeight: typography.scale.bodySmall.lineHeight },
  state: { alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  stateTitle: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineSmall.fontSize, textAlign: 'center' },
  stateText: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, textAlign: 'center' },
  list: { gap: spacing.md },
  card: { gap: spacing.md, padding: spacing.lg, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.light.border, backgroundColor: colors.light.surface },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  reference: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
  status: { fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  primaryAmount: { gap: spacing.xs, paddingVertical: spacing.md, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.light.border },
  primaryLabel: { color: colors.light.textMuted, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.labelSmall.fontSize },
  primaryValue: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.display, fontSize: typography.scale.displaySmall.fontSize },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  detailLabel: { flex: 1, color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize },
  detailValue: { flex: 1, color: colors.light.textPrimary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize, textAlign: 'right' },
  notice: { padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.light.accentSoft },
  noticeError: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.light.surface },
  noticeSuccess: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.light.surface },
  noticeText: { flex: 1, color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, lineHeight: typography.scale.bodySmall.lineHeight },
  secondaryButton: { minHeight: 46, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.light.border, alignItems: 'center', justifyContent: 'center', padding: spacing.md },
  secondaryText: { color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
});

export default VendorPaymentScreen;
