import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { serviceAPI } from '../utils/api';

export const ServiceDetailScreen = ({ navigation, route }) => {
  const slug = route?.params?.slug || '';
  const [service, setService] = useState(null);
  const [requestType, setRequestType] = useState('quotation');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const attemptRef = useRef(null);

  const loadService = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await serviceAPI.getService(slug);
      if (!result) throw new Error('This service is currently unavailable.');
      setService(result);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Could not load this service.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { loadService(); }, [loadService]);

  const submitRequest = useCallback(async () => {
    if (!service?.id) return;
    const cleanDescription = description.trim();
    if (cleanDescription.length < 10 || cleanDescription.length > 5000) {
      setError('Describe what you need in at least 10 characters.');
      return;
    }
    const payload = {
      service_profile_id: service.id,
      request_type: requestType,
      description: cleanDescription,
    };
    const signature = JSON.stringify(payload);
    if (attemptRef.current?.signature !== signature) {
      const randomId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      attemptRef.current = { signature, key: `kamba-service-request-${randomId}` };
    }
    setSubmitting(true);
    setError('');
    try {
      const request = await serviceAPI.createRequest(payload, attemptRef.current.key);
      if (!request?.id) throw new Error('Kamba did not return the created service request.');
      attemptRef.current = null;
      navigation.navigate('ServiceRequests', { requestId: request.id });
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Could not send your request.');
    } finally {
      setSubmitting(false);
    }
  }, [service, description, requestType, navigation]);

  if (loading) return <ScreenShell><ActivityIndicator size="large" color={colors.light.accent} /></ScreenShell>;
  if (!service) return <ScreenShell padded><Text style={styles.error}>{error || 'Service not found.'}</Text></ScreenShell>;

  const business = service.business_profiles || {};
  return (
    <ScreenShell padded bg={colors.light.background}>
      <View style={styles.container}>
        <View style={styles.intro}>
          <Text style={styles.category}>{service.category}</Text>
          <Text style={styles.title}>{service.service_title}</Text>
          {business.business_name ? <Text style={styles.business}>{business.business_name}</Text> : null}
          <Text style={styles.description}>{service.description || 'Contact this provider to discuss your requirements.'}</Text>
          <Text style={styles.location}>{business.service_area_text || business.location_text || service.location_text || 'Location not specified'}</Text>
          {service.price_range ? <Text style={styles.price}>{service.price_range}</Text> : null}
          {service.vendor_profiles?.is_verified ? <Text style={styles.verified}>Verified provider</Text> : null}
        </View>

        <View style={styles.requestPanel}>
          <Text style={styles.sectionTitle}>Send a service request</Text>
          <Text style={styles.helper}>Choose whether you want to book this provider or receive a quotation. The provider will respond in your service requests.</Text>
          <View style={styles.choiceRow}>
            {['booking', 'quotation'].map((type) => (
              <TouchableOpacity key={type} style={[styles.choice, requestType === type && styles.choiceActive]} onPress={() => setRequestType(type)}>
                <Text style={[styles.choiceText, requestType === type && styles.choiceTextActive]}>{type === 'booking' ? 'Book service' : 'Request quote'}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            placeholder="Describe the work you need (10–5,000 characters)"
            placeholderTextColor={colors.light.textMuted}
            multiline
            maxLength={5000}
            textAlignVertical="top"
            accessibilityLabel="Service request description"
          />
          {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.submitButton} onPress={submitRequest} disabled={submitting}>
            {submitting ? <ActivityIndicator color={colors.light.onAccent} /> : <Text style={styles.submitText}>Send request</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.xl, paddingBottom: spacing.xxxl },
  intro: { gap: spacing.sm },
  category: { color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  title: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.display, fontSize: typography.scale.displaySmall.fontSize },
  business: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
  description: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, lineHeight: typography.scale.bodyMedium.lineHeight },
  location: { color: colors.light.textMuted, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize },
  price: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelLarge.fontSize },
  verified: { color: colors.light.success, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  requestPanel: { gap: spacing.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.xl, backgroundColor: colors.light.surface },
  sectionTitle: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineSmall.fontSize },
  helper: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, lineHeight: typography.scale.bodySmall.lineHeight },
  choiceRow: { flexDirection: 'row', gap: spacing.sm },
  choice: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', padding: spacing.sm, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.lg },
  choiceActive: { borderColor: colors.light.accent, backgroundColor: colors.light.accentSoft },
  choiceText: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  choiceTextActive: { color: colors.light.accent },
  input: { minHeight: 140, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.lg, padding: spacing.md, color: colors.light.textPrimary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize },
  submitButton: { minHeight: 50, borderRadius: radius.lg, backgroundColor: colors.light.accent, alignItems: 'center', justifyContent: 'center', padding: spacing.md },
  submitText: { color: colors.light.onAccent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
  error: { color: colors.light.error, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize },
});

export default ServiceDetailScreen;
