import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { serviceAPI, userAPI } from '../utils/api';

export const ServicesScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let location = null;
      try { location = await userAPI.getLocation(); } catch { /* Public service browsing remains available. */ }
      const params = { page: 1, limit: 50 };
      if (Number.isFinite(location?.lat) && Number.isFinite(location?.lng)) {
        params.lat = location.lat;
        params.lng = location.lng;
        params.radius = 15;
      }
      setServices(await serviceAPI.listServices(params));
    } catch (err) {
      setServices([]);
      setError(err.response?.data?.error || err.message || 'Could not load local services.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadServices);
    loadServices();
    return unsubscribe;
  }, [navigation, loadServices]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return services;
    return services.filter((service) => [
      service.service_title,
      service.category,
      service.location_text,
      service.description,
      service.business_profiles?.business_name,
      service.business_profiles?.service_area_text,
    ].some((value) => String(value || '').toLowerCase().includes(query)));
  }, [services, search]);

  return (
    <ScreenShell padded={false} bg={colors.light.background} refreshControl={
      <RefreshControl refreshing={loading} onRefresh={loadServices} tintColor={colors.light.accent} />
    }>
      <View style={styles.container}>
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>LOCAL PROFESSIONALS</Text>
          <Text style={styles.title}>Find a service</Text>
          <Text style={styles.description}>Browse providers around your campus or neighbourhood. Request a booking or ask for a quote.</Text>
        </View>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search service, category or area"
          placeholderTextColor={colors.light.textMuted}
          style={styles.search}
          accessibilityLabel="Search local services"
        />
        <TouchableOpacity style={styles.requestsButton} onPress={() => navigation.navigate('ServiceRequests')}>
          <Text style={styles.requestsButtonText}>My service requests</Text>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color={colors.light.accent} />
        ) : error ? (
          <ScreenState type="error" title="Could not load services" description={error} actionLabel="Try again" onAction={loadServices} />
        ) : filtered.length === 0 ? (
          <ScreenState type="empty" title="No services found" description={services.length ? 'Try a different search.' : 'Service providers will appear here when they publish an active profile.'} />
        ) : (
          <View style={styles.list}>
            {filtered.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.card}
                onPress={() => navigation.navigate('ServiceDetail', { slug: service.slug })}
                accessibilityRole="button"
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{service.service_title}</Text>
                  {service.vendor_profiles?.is_verified ? <Text style={styles.verified}>Verified</Text> : null}
                </View>
                <Text style={styles.category}>{service.category}</Text>
                <Text style={styles.cardDescription} numberOfLines={3}>{service.description || 'Contact this provider to discuss your requirements.'}</Text>
                <Text style={styles.location}>{service.business_profiles?.service_area_text || service.business_profiles?.location_text || service.location_text || 'Location not specified'}</Text>
                {Number.isFinite(service.distance_km) ? <Text style={styles.distance}>{service.distance_km.toFixed(1)} km away</Text> : null}
                {service.price_range ? <Text style={styles.price}>{service.price_range}</Text> : null}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.lg, padding: spacing.xl, paddingBottom: spacing.xxxl },
  heading: { gap: spacing.xs },
  eyebrow: { color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize, letterSpacing: 1 },
  title: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.display, fontSize: typography.scale.displaySmall.fontSize },
  description: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, lineHeight: typography.scale.bodyMedium.lineHeight },
  search: { minHeight: 50, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.lg, backgroundColor: colors.light.surface, paddingHorizontal: spacing.md, color: colors.light.textPrimary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize },
  requestsButton: { alignSelf: 'flex-start', paddingVertical: spacing.sm },
  requestsButtonText: { color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
  list: { gap: spacing.md },
  card: { gap: spacing.sm, padding: spacing.lg, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.xl, backgroundColor: colors.light.surface },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  cardTitle: { flex: 1, color: colors.light.textPrimary, fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineSmall.fontSize },
  verified: { color: colors.light.success, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  category: { color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  cardDescription: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, lineHeight: typography.scale.bodySmall.lineHeight },
  location: { color: colors.light.textMuted, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.labelSmall.fontSize },
  distance: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  price: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
});

export default ServicesScreen;
