import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, spacing, typography, radius } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { orderAPI, deliveryAPI } from '../utils/api';
import { formatCurrency } from '../utils/format';

const money = (amount, currency = 'NGN') => {
  if (currency === 'NGN') return formatCurrency((Number(amount) || 0) / 100);
  return `${currency} ${((Number(amount) || 0) / 100).toFixed(2)}`;
};

export const OrderDetailScreen = ({ navigation, route }) => {
  const orderId = route?.params?.orderId || '';
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [handoverCode, setHandoverCode] = useState('');
  const [handoverExpiresAt, setHandoverExpiresAt] = useState(null);
  const [deliveryEvidence, setDeliveryEvidence] = useState([]);
  const [evidenceLoading, setEvidenceLoading] = useState(false);

  const loadOrder = useCallback(async (showLoading = true) => {
    if (!orderId) {
      setError('This order link is missing its order ID.');
      setLoading(false);
      return;
    }
    if (showLoading) setLoading(true);
    setError('');
    try {
      const freshOrder = await orderAPI.getOrder(orderId);
      setOrder(freshOrder);
      if (freshOrder?.delivery_id) {
        setEvidenceLoading(true);
        try {
          const evidence = await deliveryAPI.getDeliveryEvidence(freshOrder.delivery_id);
          setDeliveryEvidence(Array.isArray(evidence) ? evidence : []);
        } catch {
          // Evidence is supplemental; a temporary storage/network failure must not hide order details.
          setDeliveryEvidence([]);
        } finally {
          setEvidenceLoading(false);
        }
      } else {
        setDeliveryEvidence([]);
      }
      try {
        const freshPayment = await orderAPI.getPaymentStatus(orderId);
        setPayment(freshPayment);
      } catch {
        setPayment(freshOrder?.payment_status ? { status: freshOrder.payment_status } : null);
      }
    } catch (err) {
      const message = err.response?.data?.error;
      setError(typeof message === 'string' ? message : 'Could not load order details. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const paymentStatus = payment?.status || order?.payment_status || 'unknown';
  const items = useMemo(() => order?.order_items || order?.items || [], [order]);
  const canStartPayment = Boolean(order && order.status === 'pending_payment' && paymentStatus === 'pending');
  const canGenerateHandoverCode = Boolean(order?.delivery_id && ['picked_up', 'in_transit'].includes(order.delivery_status));
  const canRefreshDelivery = Boolean(order?.delivery_id && !['delivered', 'failed'].includes(order.delivery_status));
  const canConfirm = Boolean(
    order && paymentStatus === 'held' && (
      (order.delivery_type === 'delivery' && order.status === 'delivered') ||
      (order.delivery_type === 'pickup' && ['shipped', 'delivered'].includes(order.status))
    )
  );
  const canCancel = Boolean(
    order && order.status === 'pending_payment' &&
    paymentStatus === 'pending' && order.payment_checkout_not_started === true
  );
  const canOpenDispute = Boolean(
    order && paymentStatus === 'held' &&
    ['paid_held', 'confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)
  );

  const handleGenerateHandoverCode = useCallback(async () => {
    if (!order?.delivery_id) return;
    setAction('handover-code');
    setError('');
    setNotice('');
    try {
      const result = await deliveryAPI.generateHandoverCode(order.delivery_id);
      if (!result?.code) throw new Error('Kamba did not return a handover code.');
      setHandoverCode(result.code);
      setHandoverExpiresAt(result.expires_at || null);
      setNotice('Show this one-time code to your delivery provider at handover. Do not share it with anyone else.');
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      setError(typeof message === 'string' ? message : 'Could not generate a handover code.');
    } finally {
      setAction('');
    }
  }, [order?.delivery_id]);

  const handleRefreshDelivery = useCallback(async () => {
    await loadOrder(false);
    setNotice('Delivery progress refreshed from Kamba.');
  }, [loadOrder]);

  const handleStartPayment = useCallback(async () => {
    setAction('payment');
    setError('');
    setNotice('');
    try {
      const result = await orderAPI.initiatePayment(orderId);
      if (!result?.checkout_url || !result.checkout_url.startsWith('https://')) {
        throw new Error('The payment provider did not return a valid checkout link.');
      }
      await loadOrder(false);
      await Linking.openURL(result.checkout_url);
      setNotice('Payment page opened. Complete payment there, return to Kamba, then refresh the payment status.');
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      setError(typeof message === 'string' ? message : 'Could not open the payment page. You can retry from this order.');
    } finally {
      setAction('');
    }
  }, [orderId, loadOrder]);

  const handleRefreshPayment = useCallback(async () => {
    setAction('refresh');
    setError('');
    setNotice('');
    try {
      await loadOrder(false);
      setNotice('Payment status refreshed from Kamba.');
    } finally {
      setAction('');
    }
  }, [loadOrder]);

  const handleConfirm = useCallback(async () => {
    setAction('confirm');
    setError('');
    setNotice('');
    try {
      const result = await orderAPI.confirmDelivery(orderId);
      await loadOrder(false);
      setNotice(result?.status === 'released'
        ? 'Receipt confirmed. The payment provider confirmed the release.'
        : 'Receipt confirmed. Payment release is being processed.');
    } catch (err) {
      const message = err.response?.data?.error;
      setError(typeof message === 'string' ? message : 'Could not confirm receipt. Please try again.');
    } finally {
      setAction('');
    }
  }, [orderId, loadOrder]);

  const handleCancel = useCallback(async () => {
    setAction('cancel');
    setError('');
    setNotice('');
    try {
      await orderAPI.cancelOrder(orderId);
      await loadOrder(false);
      setNotice('The unpaid order was cancelled and its stock reservation was released.');
    } catch (err) {
      const message = err.response?.data?.error;
      setError(typeof message === 'string' ? message : 'Could not cancel this order. Please try again.');
    } finally {
      setAction('');
    }
  }, [orderId, loadOrder]);

  const handleDispute = useCallback(async () => {
    const reason = disputeReason.trim();
    if (reason.length < 10 || reason.length > 2000) {
      setError('Explain the issue in 10 to 2,000 characters.');
      return;
    }
    setAction('dispute');
    setError('');
    setNotice('');
    try {
      await orderAPI.createDispute(orderId, reason);
      setDisputeReason('');
      await loadOrder(false);
      setNotice('Your complaint has been submitted. The payment is paused while it is reviewed.');
    } catch (err) {
      const message = err.response?.data?.error;
      setError(typeof message === 'string' ? message : 'Could not submit your complaint. Please try again.');
    } finally {
      setAction('');
    }
  }, [disputeReason, orderId, loadOrder]);

  if (loading) {
    return (
      <ScreenShell>
        <ActivityIndicator size="large" color={colors.light.accent} />
      </ScreenShell>
    );
  }

  if (error && !order) {
    return (
      <ScreenShell>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => loadOrder()}>
          <Text style={styles.secondaryText}>Try again</Text>
        </TouchableOpacity>
      </ScreenShell>
    );
  }

  if (!order) {
    return <ScreenShell><Text style={styles.emptyText}>Order not found</Text></ScreenShell>;
  }

  return (
    <ScreenShell scrollable>
      <View style={styles.container}>
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>ORDER DETAILS</Text>
          <Text style={styles.header}>Order #{String(order.id).slice(0, 8).toUpperCase()}</Text>
          <Text style={styles.status}>{String(order.status || 'pending').replaceAll('_', ' ')}</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Order total</Text>
            <Text style={styles.total}>{money(order.total, order.currency)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Items subtotal</Text>
            <Text style={styles.value}>{money(order.subtotal, order.currency)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Kamba platform charge</Text>
            <Text style={styles.value}>{money(order.platform_fee, order.currency)}</Text>
          </View>
          {Number(order.shipping_amount) > 0 ? (
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Delivery</Text>
              <Text style={styles.value}>{money(order.shipping_amount, order.currency)}</Text>
            </View>
          ) : null}
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Payment state</Text>
            <Text style={styles.value}>{String(paymentStatus).replaceAll('_', ' ')}</Text>
          </View>
        </View>

        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>Items ({items.length})</Text>
          {items.map((item, index) => (
            <View key={item.product_id || item.productId || index} style={styles.item}>
              <View style={styles.itemCopy}>
                <Text style={styles.itemName}>{item.name || 'Product'}</Text>
                <Text style={styles.itemDetails}>Quantity: {item.quantity || 1}</Text>
              </View>
              <Text style={styles.itemAmount}>{money(item.line_amount ?? ((item.unit_amount ?? item.price ?? 0) * (item.quantity || 1)), order.currency)}</Text>
            </View>
          ))}
          {items.length === 0 ? <Text style={styles.label}>No item details were returned for this order.</Text> : null}
        </View>

        {order.delivery_type === 'delivery' && order.delivery_id ? (
          <View style={styles.evidenceSection}>
            <View style={styles.evidenceHeading}>
              <Text style={styles.sectionTitle}>Delivery evidence</Text>
              {evidenceLoading ? <ActivityIndicator size="small" color={colors.light.accent} /> : null}
            </View>
            <Text style={styles.helper}>
              Pickup and handover photos are recorded by the assigned provider. They document handling and handover, not the product's internal condition.
            </Text>
            {deliveryEvidence.map((item) => (
              <View key={item.id} style={styles.evidenceCard}>
                <Image
                  source={{ uri: item.url }}
                  style={styles.evidenceImage}
                  resizeMode="cover"
                  accessibilityLabel={item.evidence_type === 'pickup' ? 'Package pickup evidence' : 'Buyer handover evidence'}
                />
                <View style={styles.evidenceCopy}>
                  <Text style={styles.evidenceTitle}>
                    {item.evidence_type === 'pickup' ? 'Package collected' : 'Handover recorded'}
                  </Text>
                  <Text style={styles.helper}>
                    {item.captured_at ? new Date(item.captured_at).toLocaleString() : 'Capture time unavailable'}
                  </Text>
                  {item.package_reference ? (
                    <Text style={styles.helper}>Package reference: {item.package_reference}</Text>
                  ) : null}
                </View>
              </View>
            ))}
            {!evidenceLoading && deliveryEvidence.length === 0 ? (
              <Text style={styles.helper}>No delivery photos are available yet. They will appear after the provider records a pickup or handover.</Text>
            ) : null}
          </View>
        ) : null}

        {order.status === 'delivered' && paymentStatus === 'held' ? (
          <Text style={styles.helper}>The delivery provider has marked this order delivered. Confirm only after you have received it.</Text>
        ) : null}

        {!!notice && <Text accessibilityRole="alert" style={styles.notice}>{notice}</Text>}
        {!!error && <Text accessibilityRole="alert" style={styles.errorText}>{error}</Text>}

        {canStartPayment ? (
          <View style={styles.paymentPanel}>
            <Text style={styles.helper}>This order is awaiting payment. Kamba will verify payment with the provider; returning from the payment page does not by itself mark the order as paid.</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={handleStartPayment} disabled={Boolean(action)}>
              {action === 'payment' ? <ActivityIndicator color={colors.light.onAccent} /> : <Text style={styles.primaryText}>Continue to secure payment</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleRefreshPayment} disabled={Boolean(action)}>
              {action === 'refresh' ? <ActivityIndicator color={colors.light.accent} /> : <Text style={styles.secondaryText}>Refresh payment status</Text>}
            </TouchableOpacity>
          </View>
        ) : null}

        {canRefreshDelivery ? (
          <TouchableOpacity style={styles.secondaryButton} onPress={handleRefreshDelivery} disabled={Boolean(action)}>
            <Text style={styles.secondaryText}>Refresh delivery progress</Text>
          </TouchableOpacity>
        ) : null}

        {canGenerateHandoverCode ? (
          <View style={styles.handoverPanel}>
            <Text style={styles.sectionTitle}>Confirm handover securely</Text>
            <Text style={styles.helper}>Generate a one-time code and show it to the delivery provider only when you are ready to receive your package. It expires after 10 minutes.</Text>
            {handoverCode ? (
              <View style={styles.handoverCodeBox}>
                <Text style={styles.handoverCode}>{handoverCode}</Text>
                {handoverExpiresAt ? <Text style={styles.helper}>Expires {new Date(handoverExpiresAt).toLocaleTimeString()}</Text> : null}
              </View>
            ) : null}
            <TouchableOpacity style={styles.primaryButton} onPress={handleGenerateHandoverCode} disabled={Boolean(action)}>
              {action === 'handover-code' ? <ActivityIndicator color={colors.light.onAccent} /> : <Text style={styles.primaryText}>{handoverCode ? 'Generate a new code' : 'Generate handover code'}</Text>}
            </TouchableOpacity>
          </View>
        ) : null}

        {canConfirm ? (
          <TouchableOpacity style={styles.primaryButton} onPress={handleConfirm} disabled={Boolean(action)}>
            {action === 'confirm' ? <ActivityIndicator color={colors.light.onAccent} /> : (
              <Text style={styles.primaryText}>{order.delivery_type === 'pickup' ? 'Confirm pickup' : 'Confirm receipt'}</Text>
            )}
          </TouchableOpacity>
        ) : null}

        {canCancel ? (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} disabled={Boolean(action)}>
            {action === 'cancel' ? <ActivityIndicator color={colors.light.onAccent} /> : <Text style={styles.primaryText}>Cancel unpaid order</Text>}
          </TouchableOpacity>
        ) : null}

        {canOpenDispute ? (
          <View style={styles.disputePanel}>
            <Text style={styles.sectionTitle}>Report an issue</Text>
            <Text style={styles.helper}>Describe what went wrong. A complaint pauses the normal payment-release process while it is reviewed.</Text>
            <TextInput
              value={disputeReason}
              onChangeText={setDisputeReason}
              style={styles.disputeInput}
              placeholder="Explain the issue (at least 10 characters)"
              placeholderTextColor={colors.light.textMuted}
              multiline
              maxLength={2000}
              textAlignVertical="top"
              accessibilityLabel="Complaint reason"
            />
            <TouchableOpacity style={styles.secondaryButton} onPress={handleDispute} disabled={Boolean(action)}>
              {action === 'dispute' ? <ActivityIndicator color={colors.light.accent} /> : <Text style={styles.secondaryText}>Submit complaint</Text>}
            </TouchableOpacity>
          </View>
        ) : null}

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryText}>Back to orders</Text>
        </TouchableOpacity>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.lg, paddingBottom: spacing.xxxl },
  heading: { gap: spacing.xs },
  eyebrow: { color: colors.light.textMuted, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize, letterSpacing: 1 },
  header: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.display, fontSize: typography.scale.displaySmall.fontSize },
  status: { alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, backgroundColor: colors.light.accentSoft, color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize, textTransform: 'capitalize' },
  summaryCard: { gap: spacing.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.xl, backgroundColor: colors.light.surface },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md },
  label: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize },
  value: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
  total: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.display, fontSize: typography.scale.headlineLarge.fontSize },
  evidenceSection: { gap: spacing.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.xl, backgroundColor: colors.light.surface },
  evidenceHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  evidenceCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.light.border },
  evidenceImage: { width: 92, height: 92, borderRadius: radius.lg, backgroundColor: colors.light.background },
  evidenceCopy: { flex: 1, gap: spacing.xs },
  evidenceTitle: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
  itemsSection: { gap: spacing.sm },
  sectionTitle: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineSmall.fontSize },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.light.border },
  itemCopy: { flex: 1, gap: spacing.xs },
  itemName: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
  itemDetails: { color: colors.light.textMuted, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.labelSmall.fontSize },
  itemAmount: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
  helper: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, lineHeight: typography.scale.bodySmall.lineHeight },
  notice: { color: colors.light.success, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.bodySmall.fontSize },
  errorText: { color: colors.light.error, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, marginVertical: spacing.sm },
  primaryButton: { minHeight: 52, borderRadius: radius.xl, backgroundColor: colors.light.accent, alignItems: 'center', justifyContent: 'center', padding: spacing.md },
  cancelButton: { minHeight: 52, borderRadius: radius.xl, backgroundColor: colors.light.danger, alignItems: 'center', justifyContent: 'center', padding: spacing.md },
  primaryText: { color: colors.light.onAccent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelLarge.fontSize },
  paymentPanel: { gap: spacing.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.xl, backgroundColor: colors.light.surface },
  handoverPanel: { gap: spacing.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.xl, backgroundColor: colors.light.surface },
  handoverCodeBox: { alignItems: 'center', justifyContent: 'center', padding: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.light.accentSoft },
  handoverCode: { color: colors.light.accent, fontFamily: typography.fontFamilies.display, fontSize: 34, letterSpacing: 6, fontWeight: '700' },
  disputePanel: { gap: spacing.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.xl, backgroundColor: colors.light.surface },
  disputeInput: { minHeight: 120, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.lg, padding: spacing.md, color: colors.light.textPrimary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize },
  secondaryButton: { minHeight: 48, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.light.border, alignItems: 'center', justifyContent: 'center', padding: spacing.md },
  secondaryText: { color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
  backButton: { alignItems: 'center', padding: spacing.md },
  emptyText: { color: colors.light.textMuted, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, textAlign: 'center', marginTop: spacing.xl },
});

export default OrderDetailScreen;
