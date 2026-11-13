import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { KambaButton } from '../components/KambaButton';
import { KambaInput } from '../components/KambaInput';
import { ArrowLeft, User } from '../utils/phosphorIcons';
import { colors, spacing, typography, radius } from '../theme/tokens';
import { storage } from '../utils/storage';
import { authAPI, userAPI } from '../utils/api';
import { validateUsername } from '../utils/username';

export const EditProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const loadUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const savedUser = await storage.getUserData();
      if (savedUser) {
        setUser(savedUser);
        setDisplayName(savedUser.display_name || savedUser.name || '');
        setUsername(savedUser.username ? savedUser.username.replace(/^@/, '') : '');
        setPhone(savedUser.phone || '');
        setEmail(savedUser.email || '');
        return;
      }

      const response = await authAPI.getDashboard();
      const profile = response.data?.result;
      if (!response.data?.success || !profile) {
        throw new Error('Your profile could not be loaded.');
      }

      setUser(profile);
      setDisplayName(profile.display_name || profile.name || '');
      setUsername(profile.username ? profile.username.replace(/^@/, '') : '');
      setPhone(profile.phone || '');
      setEmail(profile.email || '');
      await storage.setUserData(profile);
    } catch (loadError) {
      setError(
        loadError.response?.data?.message ||
        loadError.message ||
        'We could not load your profile. Check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleSave = async () => {
    const validation = validateUsername(username);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError(null);
    setSaving(true);
    try {
      const response = await userAPI.updateProfile({
        display_name: displayName.trim() || null,
        username: `@${validation.cleaned}`,
        phone: phone.trim() || null,
        email: email.trim() || null,
      });

      const updated = response.data?.result;
      if (!response.data?.success || !updated) {
        throw new Error(response.data?.message || 'Could not save your changes.');
      }

      setUser(updated);
      await storage.setUserData(updated);
      await storage.setUsername(updated.username || '');
      navigation.goBack();
    } catch (saveError) {
      setError(
        saveError.response?.data?.message ||
        saveError.message ||
        'Could not save your changes. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ScreenShell scrollable padded bg={colors.light.background}>
        <ScreenState type="loading" title="Loading your profile" />
      </ScreenShell>
    );
  }

  if (error) {
    return (
      <ScreenShell scrollable padded bg={colors.light.background}>
        <ScreenState
          type="error"
          title="Profile unavailable"
          description={error}
          actionLabel="Try again"
          onAction={loadUser}
        />
      </ScreenShell>
    );
  }

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
            <ArrowLeft size={24} color={colors.light.textPrimary} weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit profile</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarFrame}>
            {user?.avatar_url ? (
              <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
            ) : (
              <User size={34} color={colors.light.accent} weight="regular" />
            )}
          </View>
          <Text style={styles.avatarLabel}>Profile photo</Text>
        </View>

        <View style={styles.form}>
          <KambaInput
            label="Display name"
            placeholder="Your display name"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <KambaInput
            label="Username"
            placeholder="@yourname"
            value={username}
            onChangeText={(value) => {
              setUsername(value.replace(/^@/, '').slice(0, 16));
              setError(null);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={16}
          />
          <KambaInput
            label="Phone number"
            placeholder="+234 801 234 5678"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <KambaInput
            label="Email address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {error ? (
          <Text accessibilityRole="alert" style={styles.errorText}>
            {error}
          </Text>
        ) : null}

        <KambaButton
          label="Save changes"
          fullWidth
          loading={saving}
          onPress={handleSave}
          style={styles.saveButton}
        />
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    flex: 1,
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.headline,
    fontSize: typography.scale.headlineMedium.fontSize,
    letterSpacing: typography.scale.headlineMedium.letterSpacing,
  },
  avatarSection: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  avatarFrame: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colors.light.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.light.border,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: radius.full,
  },
  avatarLabel: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodySmall.fontSize,
  },
  form: {
    gap: spacing.md,
  },
  errorText: {
    color: colors.light.error,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodySmall.fontSize,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: spacing.lg,
  },
});

export default EditProfileScreen;
