import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { authAPI, serviceAPI } from '../utils/api';
import { storage } from '../utils/storage';

const formatNaira = (kobo) => `₦${(Number(kobo || 0) / 100).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function nairaToKobo(value) {
  const normalized = String(value || '').trim().replace(/,/g, '');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;
  const [whole, fraction = ''] = normalized.split('.');
  const amount = BigInt(whole) * 100n + BigInt((fraction + '00').slice(0, 2));
  return amount > 0n && amount <= 2147483647n ? Number(amount) : null;
}

const RequestCard = ({ item, isVendor, onRefresh, setError }) => {
  const [amount, setAmount] = useState('');
  const [scope, setScope] = useState('');
  const [scheduleAt, setScheduleAt] = useState('');
  const [busy, setBusy] = useState(false);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    if (isVendor) return;
    serviceAPI.getPayment(item.id).then(setPayment).catch(() => setPayment(null));
  }, [isVendor, item.id]);

  const run = async (action) => {
    setBusy(true);
    setError('');
    try {
      await action();
      await onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'The action could not be completed.');
    } finally {
      setBusy(false);
    }
  };

  const submitQuote = () => {
    const amountKobo = nairaToKobo(amount);
    if (!amountKobo || scope.trim().length < 5) {
      setError('Enter a valid amount in naira and a quote scope of at least 5 characters.');
      return;
    }
    return run(() => serviceAPI.submitQuote(item.id, {
      amount: amountKobo,
      scope: scope.trim(),
      currency: 'NGN',
    }));
  };

  const schedule = () => {
    if (!Number.isFinite(Date.parse(scheduleAt))) {
      setError('Enter a valid scheduled start date and time.');
      return;
    }
    return run(() => serviceAPI.updateRequestStatus(item.id, 'scheduled', {
      scheduled_start_at: new Date(scheduleAt).toISOString(),
    }));
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.service_title || 'Service request'}</Text>
        <Text style={styles.status}>{String(item.status || 'requested').replaceAll('_', ' ')}</Text>
      </View>
      <Text style={styles.meta}>{item.request_type === 'booking' ? 'Booking' : 'Quotation'} · {new Date(item.created_at).toLocaleDateString()}</Text>
      <Text style={styles.description}>{item.description}</Text>

      {Array.isArray(item.quotes) ? item.quotes.map((quote) => (
        <View key={quote.id} style={styles.quote}>
          <Text style={styles.quoteAmount}>{formatNaira(quote.amount)}</Text>
          <Text style={styles.description}>{quote.scope}</Text>
          <Text style={styles.meta}>Quote: {quote.status}</Text>
          {!isVendor && quote.status === 'pending' && item.status === 'quoted' ? (
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.primaryButton} disabled={busy} onPress={() => run(() => serviceAPI.respondToQuote(item.id, quote.id, 'accept'))}>
                <Text style={styles.primaryText}>Accept quote</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} disabled={busy} onPress={() => run(() => serviceAPI.respondToQuote(item.id, quote.id, 'decline'))}>
                <Text style={styles.secondaryText}>Decline</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      )) : null}

      {isVendor && ['requested', 'quoted'].includes(item.status) ? (
        <View style={styles.actionPanel}>
          <Text style={styles.sectionTitle}>Send a quote</Text>
          <TextInput value={amount} onChangeText={setAmount} style={styles.input} placeholder="Amount in naira (e.g. 15000)" keyboardType="decimal-pad" placeholderTextColor={colors.light.textMuted} />
          <TextInput value={scope} onChangeText={setScope} style={[styles.input, styles.multiline]} placeholder="What does this quote cover?" multiline placeholderTextColor={colors.light.textMuted} />
          <TouchableOpacity style={styles.primaryButton} onPress={submitQuote} disabled={busy}>
            {busy ? <ActivityIndicator color={colors.light.onAccent} /> : <Text style={styles.primaryText}>Submit quote</Text>}
          </TouchableOpacity>
        </View>
      ) : null}

      {isVendor && item.status === 'accepted' ? (
        <View style={styles.actionPanel}>
          <Text style={styles.sectionTitle}>Schedule the service</Text>
          <TextInput value={scheduleAt} onChangeText={setScheduleAt} style={styles.input} placeholder="2026-11-22 10:00" placeholderTextColor={colors.light.textMuted} />
          <TouchableOpacity style={styles.primaryButton} onPress={schedule} disabled={busy}>
            <Text style={styles.primaryText}>Schedule work</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {isVendor && item.status === 'scheduled' ? (
        <TouchableOpacity style={styles.primaryButton} disabled={busy} onPress={() => run(() => serviceAPI.updateRequestStatus(item.id, 'in_progress'))}>
          <Text style={styles.primaryText}>Start work</Text>
        </TouchableOpacity>
      ) : null}
      {isVendor && item.status === 'in_progress' ? (
        <TouchableOpacity style={styles.primaryButton} disabled={busy} onPress={() => run(() => serviceAPI.updateRequestStatus(item.id, 'completed'))}>
          <Text style={styles.primaryText}>Mark work completed</Text>
        </TouchableOpacity>
      ) : null}

      {!isVendor && item.accepted_quote_id && ['accepted', 'scheduled'].includes(item.status) && (!payment || payment.status === 'pending' || payment.status === 'failed') ? (
        <TouchableOpacity style={styles.primaryButton} disabled={busy} onPress={() => run(async () => {
          const result = await serviceAPI.initiatePayment(item.id);
          if (!result?.checkout_url?.startsWith('https://')) throw new Error('The payment provider did not return a secure checkout URL.');
          await Linking.openURL(result.checkout_url);
        })}>
          <Text style={styles.primaryText}>Pay for service</Text>
        </TouchableOpacity>
      ) : null}
      {!isVendor && item.status === 'completed' && payment?.status === 'held' ? (
        <TouchableOpacity style={styles.primaryButton} disabled={busy} onPress={() => run(() => serviceAPI.confirmCompletion(item.id))}>
          <Text style={styles.primaryText}>Confirm service completion</Text>
        </TouchableOpacity>
      ) : null}
      {!isVendor && payment?.status === 'held' ? (
        <Text style={styles.meta}>Payment is held pending completion confirmation or the configured release workflow.</Text>
      ) : null}
    </View>
  );
};

export const ServiceRequestsScreen = ({ route }) => {
  const [requests, setRequests] = useState([]);
  const [isVendor, setIsVendor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError('');
    try {
      let user = null;
      try {
        const response = await authAPI.getDashboard();
        user = response.data?.result || null;
        if (user?.id) await storage.setUserData(user);
      } catch {
        user = await storage.getUserData();
      }
      setIsVendor(user?.role === 'vendor');
      setRequests(await serviceAPI.listRequests({ limit: 100 }));
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Could not load service requests.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <ScreenShell><ActivityIndicator size="large" color={colors.light.accent} /></ScreenShell>;

  return (
    <ScreenShell padded={false} bg={colors.light.background} refreshControl={undefined}>
      <View style={styles.container}>
        <Text style={styles.title}>{isVendor ? 'Customer requests' : 'My service requests'}</Text>
        {!!route?.params?.requestId ? <Text style={styles.meta}>Latest request: {route.params.requestId.slice(0, 8).toUpperCase()}</Text> : null}
        {!!error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        {requests.length === 0 && !error ? (
          <ScreenState type="empty" title="No service requests yet" description={isVendor ? 'Customer requests will appear here.' : 'Your booking and quotation requests will appear here.'} />
        ) : requests.map((item) => (
          <RequestCard key={item.id} item={item} isVendor={isVendor} onRefresh={() => load(false)} setError={setError} />
        ))}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => load()} disabled={refreshing}>
          <Text style={styles.secondaryText}>Refresh requests</Text>
        </TouchableOpacity>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.lg, padding: spacing.xl, paddingBottom: spacing.xxxl },
  title: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.display, fontSize: typography.scale.displaySmall.fontSize },
  card: { gap: spacing.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.xl, backgroundColor: colors.light.surface },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  cardTitle: { flex: 1, color: colors.light.textPrimary, fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineSmall.fontSize },
  status: { color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize, textTransform: 'capitalize' },
  meta: { color: colors.light.textMuted, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.labelSmall.fontSize },
  description: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, lineHeight: typography.scale.bodySmall.lineHeight },
  quote: { gap: spacing.sm, padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.light.background },
  quoteAmount: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.display, fontSize: typography.scale.headlineMedium.fontSize },
  actionPanel: { gap: spacing.sm, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.light.border },
  sectionTitle: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineSmall.fontSize },
  input: { minHeight: 46, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.lg, paddingHorizontal: spacing.md, color: colors.light.textPrimary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize },
  multiline: { minHeight: 100, paddingVertical: spacing.md, textAlignVertical: 'top' },
  actionRow: { flexDirection: 'row', gap: spacing.sm },
  primaryButton: { minHeight: 46, flex: 1, borderRadius: radius.lg, backgroundColor: colors.light.accent, alignItems: 'center', justifyContent: 'center', padding: spacing.md },
  primaryText: { color: colors.light.onAccent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  secondaryButton: { minHeight: 46, flex: 1, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.light.border, alignItems: 'center', justifyContent: 'center', padding: spacing.md },
  secondaryText: { color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  error: { color: colors.light.error, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize },
});

export default ServiceRequestsScreen;
