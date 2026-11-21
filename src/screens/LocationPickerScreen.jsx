import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import { ScreenShell } from '../components/ScreenShell';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { userAPI } from '../utils/api';
import { MapPin } from '../utils/phosphorIcons';

export const LocationPickerScreen = ({ navigation }) => {
  const [locationText, setLocationText] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    userAPI.getLocation()
      .then((location) => {
        if (!active || !location) return;
        setLocationText(location.location_text || '');
        if (Number.isFinite(location.lat) && Number.isFinite(location.lng)) {
          setCoordinates({ lat: location.lat, lng: location.lng });
        }
      })
      .catch(() => {
        if (active) setError('Your saved location could not be loaded. You can still enter it manually.');
      })
      .finally(() => { if (active) setLoadingSaved(false); });
    return () => { active = false; };
  }, []);

  const useCurrentLocation = useCallback(async () => {
    setError('');
    setLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setError(permission.canAskAgain
          ? 'Location permission was not granted. You can enter your campus or neighbourhood manually.'
          : 'Location permission is disabled for Kamba. Enable it in your phone settings, or enter a location manually.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setCoordinates({ lat, lng });

      try {
        const places = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
        const place = places?.[0];
        const label = [
          place?.name,
          place?.street,
          place?.district,
          place?.subregion,
          place?.city,
          place?.region,
        ].filter((part, index, all) => typeof part === 'string' && part.trim() && all.indexOf(part) === index).join(', ');
        if (label) setLocationText(label);
        else setError('We found your coordinates. Add your campus, hostel or neighbourhood name before saving.');
      } catch {
        setError('We found your coordinates, but could not name the area. Enter your campus or neighbourhood below.');
      }
    } catch {
      setError('We could not get your current location. Check that location services are on, or enter it manually.');
    } finally {
      setLocating(false);
    }
  }, []);

  const saveLocation = useCallback(async () => {
    const label = locationText.trim();
    if (!label) {
      setError('Enter a campus, hostel or neighbourhood name.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await userAPI.updateLocation({
        location_text: label,
        ...(coordinates ? { lat: coordinates.lat, lng: coordinates.lng } : {}),
      });
      navigation.goBack();
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message;
      setError(typeof message === 'string' ? message : 'Your location could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [locationText, coordinates, navigation]);

  return (
    <ScreenShell scrollable padded bg={colors.light.background}>
      <View style={styles.container}>
        <View style={styles.intro}>
          <View style={styles.iconWrap}><MapPin size={25} color={colors.light.accent} /></View>
          <Text style={styles.title}>Find shops around you</Text>
          <Text style={styles.description}>
            Set your campus or neighbourhood to see nearby sellers. Kamba only checks your location when you ask it to; it does not track you in the background.
          </Text>
        </View>

        <TouchableOpacity style={styles.locationButton} onPress={useCurrentLocation} disabled={locating || saving}>
          {locating ? <ActivityIndicator color={colors.light.onAccent} /> : <MapPin size={19} color={colors.light.onAccent} />}
          <Text style={styles.locationButtonText}>{locating ? 'Finding your location…' : 'Use my current location'}</Text>
        </TouchableOpacity>

        <View style={styles.manualPanel}>
          <Text style={styles.label}>Campus or neighbourhood</Text>
          <TextInput
            value={locationText}
            onChangeText={setLocationText}
            placeholder="e.g. OAU, Ile-Ife or Akoka, Lagos"
            placeholderTextColor={colors.light.textMuted}
            style={styles.input}
            autoCapitalize="words"
            returnKeyType="done"
            accessibilityLabel="Campus or neighbourhood"
          />
          <Text style={styles.helper}>
            {coordinates ? 'Device coordinates are ready and will be saved with this label.' : 'Manual entry works without granting GPS permission.'}
          </Text>
          {coordinates ? (
            <TouchableOpacity onPress={() => setCoordinates(null)} style={styles.textOnlyButton}>
              <Text style={styles.textOnlyText}>Save text only instead</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}

        <TouchableOpacity style={[styles.saveButton, (saving || loadingSaved) && styles.disabled]} onPress={saveLocation} disabled={saving || loadingSaved}>
          {saving ? <ActivityIndicator color={colors.light.onAccent} /> : <Text style={styles.saveText}>Save location</Text>}
        </TouchableOpacity>
        {loadingSaved ? <Text style={styles.helper}>Loading your saved location…</Text> : null}
        <Text style={styles.privacy}>Your precise coordinates are used for nearby discovery and are not shown on public store pages.</Text>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.lg, paddingBottom: spacing.xxxl },
  intro: { gap: spacing.sm },
  iconWrap: { width: 52, height: 52, borderRadius: radius.xl, backgroundColor: colors.light.accentSoft, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.display, fontSize: typography.scale.displaySmall.fontSize },
  description: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, lineHeight: typography.scale.bodyMedium.lineHeight },
  locationButton: { minHeight: 54, borderRadius: radius.xl, backgroundColor: colors.light.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.md },
  locationButtonText: { color: colors.light.onAccent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelLarge.fontSize },
  manualPanel: { gap: spacing.sm, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.xl, backgroundColor: colors.light.surface, padding: spacing.lg },
  label: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
  input: { minHeight: 50, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.lg, paddingHorizontal: spacing.md, color: colors.light.textPrimary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize },
  helper: { color: colors.light.textMuted, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, lineHeight: typography.scale.bodySmall.lineHeight },
  textOnlyButton: { alignSelf: 'flex-start', paddingVertical: spacing.xs },
  textOnlyText: { color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  error: { color: colors.light.danger || '#B42318', fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize },
  saveButton: { minHeight: 52, borderRadius: radius.xl, backgroundColor: colors.light.accentStrong, alignItems: 'center', justifyContent: 'center', padding: spacing.md },
  saveText: { color: colors.light.onAccent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelLarge.fontSize },
  disabled: { opacity: 0.55 },
  privacy: { color: colors.light.textMuted, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.labelSmall.fontSize, lineHeight: 18, textAlign: 'center' },
});

export default LocationPickerScreen;
