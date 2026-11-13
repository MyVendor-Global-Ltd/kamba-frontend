import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { KambaTextileMotif } from '../components/KambaTextileMotif';
import { ScreenShell } from '../components/ScreenShell';
import { Storefront, Bank, Shield, History, Calendar, AlertCircle, CheckCircle, XCircle, Loader2, RefreshCw } from '../utils/phosphorIcons';
import { vendorAPI } from '../utils/api';

export const VendorPaymentScreen = ({ navigation }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vendorAPI.getPayments();
      setPayments(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load payment data');
      console.error('Vendor payments error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const paymentStatusColor = (status) => {
    const statusMap = {
      held: colors.light.accent,
      pending: colors.light.warning,
      released: colors.light.success,
      disputed: colors.light.error,
      refunded: colors.light.muted,
    };
    return statusMap[status] || colors.light.textPrimary;
  };

  const paymentStatusText = (status) => {
    const textMap = {
      held: 'Held',
      pending: 'Pending',
      released: 'Released',
      disputed: 'Disputed',
      refunded: 'Refunded',
    };
    return textMap[status] || status;
  };

  return (
    <ScreenShell scrollable padded bg={colors.light.background}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadPayments}
            tintColor={colors.light.accent}
            colors={[colors.light.accent]}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={colors.light.accent} />
            <Text style={styles.loadingText}>Loading payment data...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorState}>
            <AlertCircle size={48} color={colors.light.error} />
            <Text style={styles.errorTitle}>Could not load payment data</Text>
            <Text style={styles.errorDescription}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadPayments}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : payments.length === 0 ? (
          <View style={styles.emptyState}>
            <Storefront size={48} color={colors.light.muted} />
            <Text style={styles.emptyTitle}>No payment records found</Text>
            <Text style={styles.emptyDescription}>Your payment settlement data will appear here once you receive payments from buyer deliveries.</Text>
          </View>
        ) : (
          <View style={styles.paymentsList}>
            {payments.map((payment) => (
              <View
                key={payment.id || payment.transactionId || payment.occurredAt}
                style={styles.paymentItem}
              >
                <View style={styles.paymentHeader}>
                  <Text style={styles.paymentTitle}>#{payment.id || payment.transactionId}</Text>
                  <Text style={styles.paymentStatus}>
                    {paymentStatusText(payment.status)}
                  </Text>
                </View>

                <View style={styles.paymentDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount</Text>
                    <Text style={styles.detailValue}>₦{payment.amount / 100}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Currency</Text>
                    <Text style={styles.detailValue}>{payment.currency || 'NGN'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Payment Date</Text>
                    <Text style={styles.detailValue}>
                      {payment.occurredAt ? new Date(payment.occurredAt).toLocaleDateString() : 'N/A'}
                    </Text>
                  </View>
                  {payment.releasedAt && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Released</Text>
                      <Text style={styles.detailValue}>
                        {payment.releasedAt ? new Date(payment.releasedAt).toLocaleDateString() : 'N/A'}
                      </Text>
                    </View>
                  )}
                  {payment.disputeId && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Dispute</Text>
                      <Text style={[styles.detailValue, { color: colors.light.error }]}>
                        Dispute #{payment.disputeId} active
                      </Text>
                    </View>
                  )}
                </View>

                {payment.status === 'held' && (
                  <View style={styles.heldBadge}>
                    <Text style={styles.heldText}>HELD - Auto-release in 24h if no dispute</Text>
                  </View>
                )}

                {payment.status === 'pending' && (
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingText}>PENDING - Awaiting buyer delivery confirmation</Text>
                  </View>
                )}

                {payment.status === 'disputed' && (
                  <View style={styles.disputedBadge}>
                    <AlertCircle size={16} color={colors.light.error} /> 
                                    Dispute active - Admin resolution required
                  </View>
                )}

                {payment.status === 'released' && (
                  <View style={styles.releasedBadge}>
                    <CheckCircle size={16} color={colors.light.success} /> 
                                    Released to vendor
                  </View>
                )}

                {payment.status === 'refunded' && (
                  <View style={styles.refundedBadge}>
                    <XCircle size={16} color={colors.light.muted} /> 
                                    Refunded to buyer
                  </View>
                )}

                {payment.status !== 'released' && payment.occurredAt && (
                  <View style={styles.timerSection}>
                    <Text style={styles.timerLabel}>Auto-release timer</Text>
                    <Text style={styles.timerValue}>
                      {(new Date(payment.occurredAt).getTime() / 1000 + 86400 - Date.now() / 1000) / 3600 | 0} hours remaining
                    </Text>
                  </View>
                )}

                <View style={styles.divider} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  loadingState: {
    padding: spacing.xxxl,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    color: colors.light.textSecondary,
  },
  errorState: {
    padding: spacing.xxxl,
    textAlign: 'center',
  },
  errorTitle: {
    color: colors.light.error,
    fontSize: typography.scale.bodyLarge.fontSize,
    marginBottom: spacing.sm,
  },
  errorDescription: {
    color: colors.light.textSecondary,
    fontSize: typography.scale.bodyMedium.fontSize,
  },
  emptyState: {
    padding: spacing.xxxl,
    textAlign: 'center',
  },
  emptyTitle: {
    color: colors.light.muted,
    fontSize: typography.scale.bodyLarge.fontSize,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    color: colors.light.textSecondary,
    fontSize: typography.scale.bodyMedium.fontSize,
  },
  paymentsList: {},
  paymentItem: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeft: `4px solid ${colors.light.accent}`,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  paymentTitle: {
    fontFamily: typography.fontFamilies.display,
    fontSize: typography.scale.headlineSmall.fontSize,
    color: colors.light.textPrimary,
  },
  paymentStatus: {
    fontSize: typography.scale.caption.fontSize,
    color: paymentStatusColor,
    fontWeight: '600',
  },
  paymentDetails: {},
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
    paddingBottom: spacing.xs,
    borderBottom: `1px solid ${colors.light.divider}`,
  },
  detailLabel: {
    color: colors.light.textMuted,
    fontSize: typography.scale.caption.fontSize,
  },
  detailValue: {
    color: colors.light.textPrimary,
    fontSize: typography.scale.bodySmall.fontSize,
    fontWeight: '500',
  },
  heldBadge: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    borderRadius: radius.sm,
    padding: spacing.xs,
    marginTop: spacing.xs,
    fontSize: typography.scale.caption.fontSize,
    color: colors.light.warning,
  },
  pendingBadge: {
    backgroundColor: 'rgba(255, 165, 0, 0.15)',
    borderRadius: radius.sm,
    padding: spacing.xs,
    marginTop: spacing.xs,
    fontSize: typography.scale.caption.fontSize,
    color: colors.light.warning,
  },
  disputedBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: radius.sm,
    padding: spacing.xs,
    marginTop: spacing.xs,
    fontSize: typography.scale.caption.fontSize,
    color: colors.light.error,
  },
  releasedBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderRadius: radius.sm,
    padding: spacing.xs,
    marginTop: spacing.xs,
    fontSize: typography.scale.caption.fontSize,
    color: colors.light.success,
  },
  refundedBadge: {
    backgroundColor: 'rgba(107, 114, 128, 0.15)',
    borderRadius: radius.sm,
    padding: spacing.xs,
    marginTop: spacing.xs,
    fontSize: typography.scale.caption.fontSize,
    color: colors.light.muted,
  },
  timerSection: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTop: `1px solid ${colors.light.divider}`,
    fontSize: typography.scale.caption.fontSize,
    color: colors.light.textMuted,
  },
  timerLabel: {
    marginBottom: spacing.xxs,
  },
  timerValue: {},
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: colors.light.divider,
    margin: spacing.md 0,
  },
});