// screens/ProfileScreen.jsx — Marketplace Profile

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User, SignOut as LogOut, Gear as Settings, Bell, Heart, CreditCard, Package, MapPin } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { MagneticButton } from '../components/MagneticButton';
import { storage } from '../utils/storage';
import { authAPI } from '../utils/api';

export const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [logoutError, setLogoutError] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const savedUser = await storage.getUserData();
      setUser(savedUser);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLogoutError(null);
    if (!user) {
      await storage.clearAll();
      navigation.getParent?.()?.reset({ index: 0, routes: [{ name: 'Auth' }] });
      return;
    }

    setLogoutLoading(true);
    try {
      await authAPI.logout();
      await storage.clearAll();
      navigation.getParent?.()?.reset({ index: 0, routes: [{ name: 'Auth' }] });
    } catch (error) {
      setLogoutError(
        error.response?.data?.message ||
        'Unable to contact Kamba to end this session. Check your connection and try again.'
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  const menuItems = [
    { icon: User, label: 'My Profile', route: 'ProfileDetail' },
    { icon: Bell, label: 'Notifications', route: 'Notifications' },
    { icon: Heart, label: 'Favorites', route: 'Favorites' },
    { icon: Package, label: 'My Orders', route: 'Orders' },
    { icon: CreditCard, label: 'Payment Methods', route: 'Payments' },
    { icon: MapPin, label: 'Addresses', route: 'Addresses' },
    { icon: Settings, label: 'Settings', route: 'Settings' },
  ];

  return (
    <ScreenShell scrollable padded bg={colors.light.background}>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{user?.username?.[0]?.toUpperCase() || 'G'}</Text>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.usernameRow}>
              <Text style={styles.username}>{user?.username ? `@${user.username}` : 'Guest mode'}</Text>
            </View>
            <Text style={styles.memberSince}>{user?.email || 'Sign in to view your account details'}</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.route)}
              activeOpacity={0.8}
              accessibilityLabel={item.label}
              accessibilityRole="button"
            >
              <View style={styles.menuIcon}>
                <item.icon size={24} color={colors.light.textPrimary} weight="bold" />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.logoutSection}>
          {logoutError ? <Text style={styles.logoutError} accessibilityRole="alert">{logoutError}</Text> : null}
          <MagneticButton
            label="Log Out"
            variant="destructive"
            size="md"
            fullWidth
            loading={logoutLoading}
            onPress={handleLogout}
          />
        </View>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.xl },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.light.border },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.light.accentSoft, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineLarge.fontSize, color: colors.light.accent },
  userInfo: { flex: 1, gap: spacing.xs },
  usernameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  username: { fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineMedium.fontSize, lineHeight: typography.scale.headlineMedium.lineHeight, letterSpacing: typography.scale.headlineMedium.letterSpacing, color: colors.light.textPrimary },
  memberSince: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, color: colors.light.textMuted },
  menuSection: { gap: spacing.xs },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, paddingHorizontal: spacing.md, backgroundColor: colors.light.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.light.border },
  menuIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.light.accentSoft, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontFamily: typography.fontFamilies.title, fontSize: typography.scale.titleLarge.fontSize, color: colors.light.textPrimary },
  menuChevron: { fontFamily: typography.fontFamilies.mono, fontSize: typography.scale.monoLarge.fontSize, color: colors.light.textMuted },
  logoutSection: { marginTop: spacing.lg, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.light.border },
  logoutError: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, color: colors.light.error, marginBottom: spacing.sm },
});

export default ProfileScreen;
