import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, ShieldCheck } from '../utils/phosphorIcons';
import { colors, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { KambaInput } from '../components/KambaInput';
import { KambaButton } from '../components/KambaButton';
import { authAPI } from '../utils/api';

export const SecurityScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!password || confirmation !== 'DELETE') return;
    setDeleting(true);
    setError(null);
    try {
      await authAPI.deleteAccount({ password, confirmation });
      navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
    } catch (deleteError) {
      setError(
        deleteError.response?.data?.message ||
        deleteError.message ||
        'Your account was not changed. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ScreenShell scrollable padded bg={colors.light.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <ArrowLeft size={24} color={colors.light.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Security & privacy</Text>
        </View>

        <View style={styles.notice}>
          <ShieldCheck size={24} color={colors.light.accent} />
          <Text style={styles.noticeText}>
            Account deletion requires your current password and explicit confirmation. Accounts without a password (for example, some phone/OAuth accounts) need an assisted support request.
          </Text>
        </View>

        <View style={styles.danger}>
          <Text style={styles.dangerTitle}>Delete account</Text>
          <Text style={styles.description}>
            This deactivates your account, hides vendor listings, and removes your login/profile identifiers. Order and financial records are retained where required for operational, legal, and audit purposes. This action cannot be undone.
          </Text>

          <KambaInput
            label="Current password"
            placeholder="Enter your current password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          <KambaInput
            label="Type DELETE to confirm"
            placeholder="DELETE"
            value={confirmation}
            onChangeText={setConfirmation}
            autoCapitalize="characters"
            autoCorrect={false}
          />

          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}

          <KambaButton
            label="Delete account"
            fullWidth
            loading={deleting}
            disabled={!password || confirmation !== 'DELETE'}
            onPress={handleDelete}
            style={styles.deleteButton}
          />
        </View>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.lg, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  backButton: { padding: spacing.sm },
  headerTitle: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineMedium.fontSize },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, padding: spacing.md, borderRadius: 12, backgroundColor: colors.light.accentSoft },
  noticeText: { flex: 1, color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, lineHeight: typography.scale.bodySmall.lineHeight },
  danger: { gap: spacing.md, borderWidth: 1, borderColor: colors.light.error, borderRadius: 12, padding: spacing.lg, backgroundColor: colors.light.surface },
  dangerTitle: { color: colors.light.error, fontFamily: typography.fontFamilies.title, fontSize: typography.scale.titleLarge.fontSize },
  description: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, lineHeight: typography.scale.bodySmall.lineHeight },
  error: { color: colors.light.error, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize },
  deleteButton: { marginTop: spacing.sm },
});

export default SecurityScreen;
