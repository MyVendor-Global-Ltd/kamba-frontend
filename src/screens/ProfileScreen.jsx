import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { colors, spacing, typography, radius } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { User, ArrowRight } from '../utils/phosphorIcons';
import { authAPI } from '../utils/api';
import { storage } from '../utils/storage';

export const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const savedUser = await storage.getUserData();
      if (savedUser) {
        setUser(savedUser);
        setLoading(false);
        return;
      }

      const response = await authAPI.getDashboard();
      const profile = response.data?.result;
      if (!response.data?.success || !profile) {
        throw new Error('Your profile could not be loaded.');
      }

      setUser(profile);
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

  if (loading) {
    return (
      <ScreenShell scrollable padded bg={colors.light.background}>
        <ActivityIndicator size="large" color={colors.light.accent} />
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

  if (!user) {
    return (
      <ScreenShell scrollable padded bg={colors.light.background}>
        <Text style={styles.emptyText}>No profile data available</Text>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell scrollable padded bg={colors.light.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarFrame}>
              {user.avatar_url ? (
                <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
              ) : (
                <User size={34} color={colors.light.accent} />
              )}
            </View>
            <View style={styles.avatarInfo}>
              <Text style={styles.displayName}>
                {user.display_name || user.name || 'User'}
              </Text>
              <Text style={styles.username}>
                {user.username || '@user'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email || 'Not set'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{user.phone || 'Not set'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>
              {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Buyer'}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('EditProfile')}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
          >
            <User size={18} color={colors.light.accent} />
            <Text style={styles.actionLabel}>Edit Profile</Text>
            <ArrowRight size={16} color={colors.light.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('Security')}
            accessibilityRole="button"
            accessibilityLabel="Security"
          >
            <User size={18} color={colors.light.accent} />
            <Text style={styles.actionLabel}>Security</Text>
            <ArrowRight size={16} color={colors.light.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('Settings')}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <User size={18} color={colors.light.accent} />
            <Text style={styles.actionLabel}>Settings</Text>
            <ArrowRight size={16} color={colors.light.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('DeliveryProvider')}
            accessibilityRole="button"
            accessibilityLabel="Delivery provider"
          >
            <User size={18} color={colors.light.accent} />
            <Text style={styles.actionLabel}>Delivery Provider</Text>
            <ArrowRight size={16} color={colors.light.textMuted} />
          </TouchableOpacity>
        </View>
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
    marginBottom: spacing.md,
  },
  headerTitle: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.headline,
    fontSize: typography.scale.headlineMedium.fontSize,
    letterSpacing: typography.scale.headlineMedium.letterSpacing,
  },
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  avatarFrame: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.light.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.light.border,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: radius.full,
  },
  avatarInfo: {
    flex: 1,
  },
  displayName: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    fontWeight: '600',
  },
  username: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.labelSmall.fontSize,
  },
  divider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginVertical: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  infoLabel: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.labelSmall.fontSize,
  },
  infoValue: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.labelSmall.fontSize,
  },
  actions: {
    gap: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  actionLabel: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    fontWeight: '500',
  },
  emptyText: {
    color: colors.light.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});

export default ProfileScreen;
