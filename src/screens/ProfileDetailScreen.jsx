import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, CreditCard, Edit, Heart, Info, Package, Settings, ShieldCheck, User } from '../utils/phosphorIcons';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { storage } from '../utils/storage';
import { authAPI } from '../utils/api';

const profileSections = [
  {
    title: 'Account',
    items: [{ icon: Settings, label: 'Settings', route: 'Settings' }],
  },
  {
    title: 'Security',
    items: [
      { icon: ShieldCheck, label: 'Security & privacy', route: 'Security' },
      { icon: CreditCard, label: 'Payment methods', route: 'PaymentMethods' },
    ],
  },
  {
    title: 'Activity',
    items: [
      { icon: Package, label: 'My orders', route: 'Orders' },
      { icon: Heart, label: 'Favorites', route: 'Favorites' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: Info, label: 'Help & support', route: 'Help' },
      { icon: Info, label: 'About Kamba', route: 'About' },
    ],
  },
];

const ProfileMenuItem = ({ icon: Icon, label, onPress }) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.8}
    accessibilityLabel={label}
    accessibilityRole="button"
  >
    <View style={styles.menuIcon}>
      <Icon size={22} color={colors.light.accent} weight="bold" />
    </View>
    <Text style={styles.menuLabel}>{label}</Text>
    <Text style={styles.menuChevron}>›</Text>
  </TouchableOpacity>
);

export const ProfileDetailScreen = ({ navigation }) => {
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
      setUser(null);
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

  const username = typeof user?.username === 'string' ? user.username.trim() : '';
  const email = typeof user?.email === 'string' ? user.email.trim() : '';
  const avatarUrl = typeof user?.avatar_url === 'string' ? user.avatar_url.trim() : '';

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
          <Text style={styles.headerTitle}>My profile</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.editButton}
            activeOpacity={0.7}
            accessibilityLabel="Edit profile"
            accessibilityRole="button"
          >
            <Edit size={20} color={colors.light.accent} weight="bold" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ScreenState type="loading" title="Loading your profile" />
        ) : error ? (
          <ScreenState
            type="error"
            title="Profile unavailable"
            description={error}
            actionLabel="Try again"
            onAction={loadUser}
          />
        ) : user ? (
          <>
            <View style={styles.profileCard}>
              <View style={styles.avatarFrame}>
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                ) : (
                  <User size={34} color={colors.light.accent} weight="regular" />
                )}
                {user.is_verified === true ? (
                  <View style={styles.verifiedBadge}>
                    <ShieldCheck size={16} color={colors.light.onAccent} weight="bold" />
                  </View>
                ) : null}
              </View>
              {username ? <Text style={styles.username}>@{username}</Text> : null}
              {email ? <Text style={styles.email}>{email}</Text> : null}
              {user.is_verified === true ? (
                <Text style={styles.verifiedText}>Verified account</Text>
              ) : null}
            </View>

            {profileSections.map((section) => (
              <View key={section.title} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <View style={styles.menuList}>
                  {section.items.map((item) => (
                    <ProfileMenuItem
                      key={item.route}
                      icon={item.icon}
                      label={item.label}
                      onPress={() => navigation.navigate(item.route)}
                    />
                  ))}
                </View>
              </View>
            ))}
          </>
        ) : null}
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
  },
  editButton: {
    padding: spacing.sm,
  },
  profileCard: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: radius.xl,
    backgroundColor: colors.light.surface,
  },
  avatarFrame: {
    position: 'relative',
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: radius.full,
    backgroundColor: colors.light.accentSoft,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.light.surface,
    borderRadius: radius.full,
    backgroundColor: colors.light.success,
  },
  username: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.headline,
    fontSize: typography.scale.headlineMedium.fontSize,
  },
  email: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
  },
  verifiedText: {
    marginTop: spacing.xs,
    color: colors.light.success,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.headline,
    fontSize: typography.scale.headlineSmall.fontSize,
  },
  menuList: {
    gap: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: radius.lg,
    backgroundColor: colors.light.surface,
  },
  menuIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.light.accentSoft,
  },
  menuLabel: {
    flex: 1,
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.title,
    fontSize: typography.scale.titleLarge.fontSize,
  },
  menuChevron: {
    color: colors.light.textMuted,
    fontFamily: typography.fontFamilies.mono,
    fontSize: typography.scale.monoLarge.fontSize,
  },
});

export default ProfileDetailScreen;
