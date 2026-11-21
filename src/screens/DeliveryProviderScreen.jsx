import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, typography, radius } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { deliveryAPI } from '../utils/api';
import { formatCurrency } from '../utils/format';

const money = (kobo, currency = 'NGN') => {
  const amount = (Number(kobo) || 0) / 100;
  return currency === 'NGN'
    ? formatCurrency(amount)
    : `${currency} ${amount.toFixed(2)}`;
};

const addressText = (value, fallback) => {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  return [
    value.business_name,
    value.address,
    value.neighbourhood,
    value.city,
    value.state,
  ].filter(Boolean).join(', ') || fallback;
};

async function captureEvidencePhoto() {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Camera permission required', 'Allow camera access to capture delivery evidence.');
    return null;
  }
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    base64: true,
    quality: 0.55,
    allowsEditing: false,
  });
  if (result.canceled) return null;
  const asset = result.assets?.[0];
  if (!asset?.base64) {
    Alert.alert('Photo unavailable', 'Kamba could not read the captured photo. Please try again.');
    return null;
  }
  return {
    uri: asset.uri,
    dataUrl: `data:image/jpeg;base64,${asset.base64}`,
  };
}

const AssignmentCard = ({ assignment, onRespond, onStatus, busy }) => {
  const [handoverCode, setHandoverCode] = useState('');
  const [handoverPhoto, setHandoverPhoto] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const assignmentStatus = assignment.assignment_status || assignment.status;
  const deliveryStatus = assignment.delivery_status;

  const captureHandover = async () => {
    setCapturing(true);
    try {
      const photo = await captureEvidencePhoto();
      if (photo) setHandoverPhoto(photo);
    } finally {
      setCapturing(false);
    }
  };

  const capturePickup = async () => {
    setCapturing(true);
    try {
      const photo = await captureEvidencePhoto();
      if (photo) {
        await onStatus(assignment, 'picked_up', {
          package_reference: assignment.package_reference,
          pickup_photo: photo.dataUrl,
        });
      }
    } finally {
      setCapturing(false);
    }
  };

  const completeHandover = async () => {
    if (!/^\d{6}$/.test(handoverCode)) {
      Alert.alert('Enter the buyer code', 'Ask the buyer for their current six-digit handover code.');
      return;
    }
    if (!handoverPhoto) {
      Alert.alert('Handover photo required', 'Capture a handover photo before completing this delivery.');
      return;
    }
    const completed = await onStatus(assignment, 'delivered', {
      handover_code: handoverCode,
      handover_photo: handoverPhoto.dataUrl,
    });
    if (completed) {
      setHandoverCode('');
      setHandoverPhoto(null);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Delivery {String(assignment.delivery_id || '').slice(0, 8).toUpperCase()}</Text>
          <Text style={styles.muted}>Offer: {assignmentStatus || 'unknown'} · Job: {deliveryStatus || 'unknown'}</Text>
        </View>
        <Text style={styles.payout}>{money(assignment.provider_payout_kobo, assignment.currency)}</Text>
      </View>
      <View style={styles.addressBlock}>
        <Text style={styles.label}>PICKUP</Text>
        <Text style={styles.body}>{addressText(assignment.pickup_address, 'Pickup details unavailable')}</Text>
      </View>
      <View style={styles.addressBlock}>
        <Text style={styles.label}>DROP-OFF</Text>
        <Text style={styles.body}>{addressText(assignment.dropoff_address, 'Drop-off details unavailable')}</Text>
      </View>
      {assignment.package_reference ? (
        <Text style={styles.reference}>Package reference: {assignment.package_reference}</Text>
      ) : null}

      {assignmentStatus === 'offered' ? (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => onRespond(assignment, 'accept')} disabled={busy || capturing}>
            <Text style={styles.primaryText}>Accept job</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => onRespond(assignment, 'decline')} disabled={busy || capturing}>
            <Text style={styles.secondaryText}>Decline</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {assignmentStatus === 'accepted' && deliveryStatus === 'assigned' ? (
        <TouchableOpacity style={styles.primaryButton} onPress={capturePickup} disabled={busy || capturing}>
          {capturing || busy ? <ActivityIndicator color={colors.light.onAccent} /> : <Text style={styles.primaryText}>Capture package and confirm pickup</Text>}
        </TouchableOpacity>
      ) : null}

      {assignmentStatus === 'accepted' && deliveryStatus === 'picked_up' ? (
        <TouchableOpacity style={styles.primaryButton} onPress={() => onStatus(assignment, 'in_transit', {})} disabled={busy}>
          {busy ? <ActivityIndicator color={colors.light.onAccent} /> : <Text style={styles.primaryText}>Start delivery</Text>}
        </TouchableOpacity>
      ) : null}

      {assignmentStatus === 'accepted' && deliveryStatus === 'in_transit' ? (
        <View style={styles.handoverPanel}>
          <Text style={styles.sectionTitle}>Buyer handover</Text>
          <Text style={styles.muted}>Ask the buyer to generate their one-time code in Kamba. Do not mark the job delivered without the buyer's code and a handover photo.</Text>
          <TextInput
            value={handoverCode}
            onChangeText={(value) => setHandoverCode(value.replace(/\D/g, '').slice(0, 6))}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="Six-digit buyer code"
            placeholderTextColor={colors.light.textMuted}
            accessibilityLabel="Buyer handover code"
          />
          <TouchableOpacity style={styles.secondaryButton} onPress={captureHandover} disabled={capturing || busy}>
            <Text style={styles.secondaryText}>{handoverPhoto ? 'Retake handover photo' : 'Capture handover photo'}</Text>
          </TouchableOpacity>
          {handoverPhoto ? <Image source={{ uri: handoverPhoto.uri }} style={styles.evidencePreview} /> : null}
          <TouchableOpacity style={styles.primaryButton} onPress={completeHandover} disabled={busy || capturing || !handoverPhoto || handoverCode.length !== 6}>
            {busy ? <ActivityIndicator color={colors.light.onAccent} /> : <Text style={styles.primaryText}>Verify code and complete delivery</Text>}
          </TouchableOpacity>
        </View>
      ) : null}

      {deliveryStatus === 'delivered' ? <Text style={styles.successText}>Delivery completed and handover evidence recorded.</Text> : null}
      {deliveryStatus === 'failed' ? <Text style={styles.errorText}>This delivery was marked failed. Contact Kamba support for the next step.</Text> : null}
    </View>
  );
};

export const DeliveryProviderScreen = () => {
  const [provider, setProvider] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [stateName, setStateName] = useState('');
  const [cities, setCities] = useState('');
  const [capacityDraft, setCapacityDraft] = useState('5');

  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError('');
    try {
      const profile = await deliveryAPI.getProviderProfile();
      const currentProvider = profile || null;
      setProvider(currentProvider);
      setCapacityDraft(String(currentProvider?.max_active_deliveries ?? 5));
      if (currentProvider?.verification_status === 'approved') {
        const [jobs, providerEarnings] = await Promise.all([
          deliveryAPI.listAssignments(),
          deliveryAPI.listEarnings(),
        ]);
        setAssignments(jobs);
        setEarnings(providerEarnings);
      } else {
        setAssignments([]);
        setEarnings([]);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Could not load your delivery provider profile.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const acceptedAssignments = assignments.filter((assignment) =>
    assignment.assignment_status === 'accepted'
    && !['delivered', 'failed', 'cancelled'].includes(assignment.delivery_status)
  );
  const pendingOffers = assignments.filter((assignment) => assignment.assignment_status === 'offered');
  const capacityLimit = Number(provider?.max_active_deliveries) || 5;
  const workloadCount = acceptedAssignments.length + pendingOffers.length;
  const workloadLabel = `${workloadCount} of ${capacityLimit} slots used`;

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApply = async () => {
    const cityList = cities.split(',').map((item) => item.trim()).filter(Boolean);
    if (!displayName.trim() || !phone.trim() || !stateName.trim() || cityList.length === 0) {
      setError('Enter your display name, phone number, state and at least one city or university area.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const result = await deliveryAPI.registerProvider({
        display_name: displayName.trim(),
        phone: phone.trim(),
        state: stateName.trim(),
        cities: cityList,
      });
      setProvider(result);
      setNotice('Your delivery provider application was submitted for review.');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Could not submit your application.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvailability = async (nextValue) => {
    setSaving(true);
    setError('');
    try {
      await deliveryAPI.setAvailability(nextValue);
      setProvider((current) => ({ ...current, is_available: nextValue }));
      setNotice(nextValue ? 'You are now accepting new delivery offers.' : 'You will not receive new offers. Your accepted jobs remain active.');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Could not update availability.');
    } finally {
      setSaving(false);
    }
  };

  const handleCapacitySave = async () => {
    const value = Number(capacityDraft);
    if (!Number.isInteger(value) || value < 1 || value > 10) {
      setError('Choose a whole number between 1 and 10.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const result = await deliveryAPI.setCapacity(value);
      setProvider((current) => ({ ...current, max_active_deliveries: result.max_active_deliveries ?? value }));
      setCapacityDraft(String(result.max_active_deliveries ?? value));
      setNotice(`Your active delivery capacity is now ${result.max_active_deliveries ?? value} job(s).`);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Could not update delivery capacity.');
    } finally {
      setSaving(false);
    }
  };

  const handleRespond = async (assignment, decision) => {
    setBusyId(assignment.assignment_id);
    setError('');
    try {
      await deliveryAPI.respondToAssignment(assignment.assignment_id, decision);
      setNotice(decision === 'accept' ? 'Delivery accepted. It will remain assigned even if you stop accepting new jobs.' : 'Delivery offer declined.');
      await loadData(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Could not respond to this delivery offer.');
    } finally {
      setBusyId('');
    }
  };

  const handleStatus = async (assignment, status, evidence = {}) => {
    setBusyId(assignment.assignment_id);
    setError('');
    try {
      await deliveryAPI.updateDeliveryStatus(assignment.delivery_id, status, null, evidence);
      setNotice(status === 'delivered' ? 'Delivery completed. Buyer handover evidence was recorded.' : `Delivery status updated to ${status.replace('_', ' ')}.`);
      await loadData(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Could not update this delivery.');
      return false;
    } finally {
      setBusyId('');
    }
  };

  if (loading) {
    return <ScreenShell><ScreenState type="loading" title="Loading provider workspace" description="Checking your verification status and delivery assignments." /></ScreenShell>;
  }

  return (
    <ScreenShell>
      <View style={styles.container}>
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>KAMBA DELIVERY NETWORK</Text>
          <Text style={styles.title}>Delivery provider</Text>
          <Text style={styles.muted}>Manage your application, availability, assigned jobs and delivery earnings.</Text>
        </View>

        {!!notice ? <Text accessibilityRole="alert" style={styles.notice}>{notice}</Text> : null}
        {!!error ? <Text accessibilityRole="alert" style={styles.errorText}>{error}</Text> : null}

        {!provider ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Apply to deliver</Text>
            <Text style={styles.muted}>Your account will be reviewed before you can accept delivery jobs.</Text>
            <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName} placeholder="Display name" placeholderTextColor={colors.light.textMuted} />
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone number" keyboardType="phone-pad" placeholderTextColor={colors.light.textMuted} />
            <TextInput style={styles.input} value={stateName} onChangeText={setStateName} placeholder="State (e.g. Rivers)" placeholderTextColor={colors.light.textMuted} />
            <TextInput style={styles.input} value={cities} onChangeText={setCities} placeholder="Cities / university communities (comma separated)" placeholderTextColor={colors.light.textMuted} />
            <TouchableOpacity style={styles.primaryButton} onPress={handleApply} disabled={saving}>
              {saving ? <ActivityIndicator color={colors.light.onAccent} /> : <Text style={styles.primaryText}>Submit application</Text>}
            </TouchableOpacity>
          </View>
        ) : null}

        {provider?.verification_status === 'pending' ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Application under review</Text>
            <Text style={styles.muted}>Kamba has received your application. You cannot accept jobs until an administrator approves your provider profile.</Text>
            <Text style={styles.label}>Status: Pending review</Text>
          </View>
        ) : null}

        {provider?.verification_status === 'rejected' ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Application not approved</Text>
            <Text style={styles.muted}>{provider.rejection_reason || 'Contact Kamba support for the review decision and appeal process.'}</Text>
          </View>
        ) : null}

        {provider?.verification_status === 'approved' ? (
          <>
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>{provider.display_name}</Text>
                  <Text style={styles.muted}>{provider.state} · {(provider.cities || []).join(', ')}</Text>
                </View>
                <Text style={styles.approved}>Verified</Text>
              </View>
              <View style={styles.availabilityRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.body}>Accepting new jobs</Text>
                  <Text style={styles.muted}>Turning this off does not cancel accepted deliveries.</Text>
                </View>
                <Switch value={Boolean(provider.is_available)} onValueChange={handleAvailability} disabled={saving} trackColor={{ false: colors.light.border, true: colors.light.accentSoft }} />
              </View>
              <View style={styles.workloadRow}>
                <Text style={styles.label}>Current workload</Text>
                <Text style={styles.workloadValue}>{workloadLabel}</Text>
              </View>
              <View style={styles.capacityPanel}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.body}>Maximum active deliveries</Text>
                  <Text style={styles.muted}>Choose how many jobs you can safely handle at once. You can change this at any time.</Text>
                </View>
                <TextInput
                  value={capacityDraft}
                  onChangeText={(value) => setCapacityDraft(value.replace(/[^0-9]/g, '').slice(0, 2))}
                  style={styles.capacityInput}
                  keyboardType="number-pad"
                  maxLength={2}
                  accessibilityLabel="Maximum active deliveries"
                />
              </View>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleCapacitySave} disabled={saving}>
                {saving ? <ActivityIndicator color={colors.light.accent} /> : <Text style={styles.secondaryText}>Save capacity</Text>}
              </TouchableOpacity>
            </View>

            <View style={styles.sectionHeading}>
              <Text style={styles.sectionTitle}>Delivery assignments</Text>
              <TouchableOpacity onPress={() => loadData(false)}><Text style={styles.link}>Refresh</Text></TouchableOpacity>
            </View>
            {assignments.length ? assignments.map((assignment) => (
              <AssignmentCard
                key={assignment.assignment_id}
                assignment={assignment}
                busy={busyId === assignment.assignment_id}
                onRespond={handleRespond}
                onStatus={handleStatus}
              />
            )) : <Text style={styles.muted}>No current delivery offers or accepted jobs.</Text>}

            <Text style={styles.sectionTitle}>Recent earnings</Text>
            {earnings.slice(0, 5).map((earning) => (
              <View key={earning.id || earning.delivery_id} style={styles.earningRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.body}>Delivery {String(earning.delivery_id || '').slice(0, 8).toUpperCase()}</Text>
                  <Text style={styles.muted}>{earning.status || 'pending'} · {earning.created_at ? new Date(earning.created_at).toLocaleDateString() : ''}</Text>
                </View>
                <Text style={styles.payout}>{money(earning.amount, earning.currency)}</Text>
              </View>
            ))}
            {!earnings.length ? <Text style={styles.muted}>Completed delivery earnings will appear here.</Text> : null}
          </>
        ) : null}

        <TouchableOpacity style={styles.refreshButton} onPress={() => { setRefreshing(true); loadData(false); }} disabled={refreshing}>
          {refreshing ? <ActivityIndicator color={colors.light.accent} /> : <Text style={styles.link}>Refresh provider workspace</Text>}
        </TouchableOpacity>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.lg, paddingBottom: spacing.xxxl },
  heading: { gap: spacing.xs },
  eyebrow: { color: colors.light.textMuted, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize, letterSpacing: 1 },
  title: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.display, fontSize: typography.scale.displaySmall.fontSize },
  card: { gap: spacing.md, backgroundColor: colors.light.surface, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.lg, padding: spacing.lg },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.titleMedium.fontSize },
  muted: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, lineHeight: 20 },
  body: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize },
  label: { color: colors.light.textMuted, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  input: { minHeight: 48, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.md, paddingHorizontal: spacing.md, color: colors.light.textPrimary, fontFamily: typography.fontFamilies.body, backgroundColor: colors.light.background },
  primaryButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, borderRadius: radius.md, backgroundColor: colors.light.accent },
  primaryText: { color: colors.light.onAccent, fontFamily: typography.fontFamilies.body, fontWeight: '600' },
  secondaryButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.light.border },
  secondaryText: { color: colors.light.accent, fontFamily: typography.fontFamilies.body, fontWeight: '600' },
  buttonRow: { flexDirection: 'row', gap: spacing.sm },
  addressBlock: { gap: spacing.xs },
  payout: { color: colors.light.accent, fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.titleSmall.fontSize },
  reference: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  handoverPanel: { gap: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.light.border },
  evidencePreview: { width: '100%', height: 160, borderRadius: radius.md, backgroundColor: colors.light.accentSoft },
  availabilityRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderTopWidth: 1, borderTopColor: colors.light.border, paddingTop: spacing.md },
  approved: { color: colors.light.success, fontFamily: typography.fontFamilies.label, fontWeight: '700' },
  workloadRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  workloadValue: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  capacityPanel: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderTopWidth: 1, borderTopColor: colors.light.border, paddingTop: spacing.md },
  capacityInput: { width: 64, height: 48, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.md, textAlign: 'center', color: colors.light.textPrimary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.titleMedium.fontSize, backgroundColor: colors.light.background },
  successText: { color: colors.light.success, fontFamily: typography.fontFamilies.body, fontWeight: '600' },
  notice: { color: colors.light.success, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize },
  errorText: { color: colors.light.error, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize },
  link: { color: colors.light.accent, fontFamily: typography.fontFamilies.body, fontWeight: '600' },
  earningRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.light.border, gap: spacing.md },
  refreshButton: { alignItems: 'center', paddingVertical: spacing.md },
});

export default DeliveryProviderScreen;
