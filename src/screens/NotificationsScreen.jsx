import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Switch, Text, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { authAPI } from '../utils/api';
import { colors, radius, spacing, typography } from '../theme/tokens';

const DEFAULTS = {
  push_enabled: false,
  email_enabled: true,
  sms_enabled: false,
  marketing_enabled: false,
};

const preferenceRows = [
  { key: 'email_enabled', title: 'Email notifications', description: 'Account and order updates by email.' },
  { key: 'sms_enabled', title: 'SMS notifications', description: 'Delivery and account updates by SMS.' },
  { key: 'marketing_enabled', title: 'Marketing messages', description: 'Optional product news and promotions.' },
  { key: 'push_enabled', title: 'Push notifications', description: 'Push delivery is not yet available because device registration/provider setup is pending.', unavailable: true },
];

export const NotificationsScreen = () => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [error, setError] = useState(null);

  const loadPreferences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.getNotificationPreferences();
      const saved = response.data?.result;
      if (!response.data?.success || !saved) {
        throw new Error(response.data?.message || 'Notification preferences were not returned by the server.');
      }
      setPreferences({ ...DEFAULTS, ...saved });
    } catch (loadError) {
      setError(
        loadError.response?.data?.message ||
        loadError.message ||
        'We could not load your notification preferences. Check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const updatePreference = async (key, value) => {
    const previous = preferences;
    setPreferences((current) => ({ ...current, [key]: value }));
    setSavingKey(key);
    setError(null);
    try {
      const response = await authAPI.updateNotificationPreferences({ [key]: value });
      const saved = response.data?.result;
      if (!response.data?.success || !saved) {
        throw new Error(response.data?.message || 'The server did not confirm the saved preference.');
      }
      setPreferences({ ...DEFAULTS, ...saved });
    } catch (saveError) {
      setPreferences(previous);
      setError(
        saveError.response?.data?.message ||
        saveError.message ||
        'Your preference was not saved. Please try again.'
      );
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) {
    return (
      <ScreenShell scrollable={false} padded bg={colors.light.background}>
        <View style={styles.state}>
          <ActivityIndicator size="large" color={colors.light.accent} />
          <Text style={styles.stateText}>Loading your preferences…</Text>
        </View>
      </ScreenShell>
    );
  }

  if (error && !preferences) {
    return (
      <ScreenShell scrollable={false} padded bg={colors.light.background}>
        <ScreenState type="error" title="Preferences unavailable" description={error} actionLabel="Try again" onAction={loadPreferences} />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell scrollable padded bg={colors.light.background}>
      <View style={styles.container}>
        <Text style={styles.intro}>
          These preferences are saved to your Kamba account and shared with the website. Push delivery is not available until device registration and provider setup are completed.
        </Text>
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        <View style={styles.card}>
          {preferenceRows.map((item, index) => (
            <View key={item.key}>
              {index > 0 ? <View style={styles.divider} /> : null}
              <View style={styles.row}>
                <View style={styles.copy}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                  {savingKey === item.key ? <Text style={styles.saving}>Saving…</Text> : null}
                </View>
                <Switch
                  value={Boolean(preferences[item.key])}
                  onValueChange={(value) => updatePreference(item.key, value)}
                  disabled={Boolean(savingKey) || Boolean(item.unavailable)}
                  trackColor={{ false: colors.light.border, true: colors.light.accentSoft }}
                  thumbColor={preferences[item.key] ? colors.light.accent : colors.light.textMuted}
                  accessibilityLabel={item.title}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.lg, paddingBottom: spacing.xxl },
  intro: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, lineHeight: typography.scale.bodySmall.lineHeight },
  card: { backgroundColor: colors.light.surface, borderColor: colors.light.border, borderWidth: 1, borderRadius: radius.lg, paddingHorizontal: spacing.md },
  row: { minHeight: 82, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  copy: { flex: 1, gap: spacing.xs },
  title: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.title, fontSize: typography.scale.titleLarge.fontSize },
  description: { color: colors.light.textMuted, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, lineHeight: typography.scale.bodySmall.lineHeight },
  saving: { color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  divider: { height: 1, backgroundColor: colors.light.border },
  error: { color: colors.light.error, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize },
  state: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  stateText: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize },
});

export default NotificationsScreen;
