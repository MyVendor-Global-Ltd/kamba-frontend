// screens/ProfileScreen.jsx — Marketplace Profile

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { User, ShieldCheck, SignOut as LogOut, Gear as Settings, Bell, Heart, CreditCard, Package, MapPin } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { MagneticButton } from '../components/MagneticButton';
import { storage } from '../utils/storage';

export const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState('student');

  useEffect(() => {
    const fetchUser = async () => {
      const u = await storage.getUsername();
      if (u) setUsername(u);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await storage.clearAll();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
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
            <Image
              source={{ uri: 'https://picsum.photos/seed/user-avatar/200/200' }}
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.userInfo}>
            <View style={styles.usernameRow}>
              <Text style={styles.username}>@{username}</Text>
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={14} color={colors.light.success} weight="bold" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
            <Text style={styles.memberSince}>Member since 2024</Text>
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
          <MagneticButton
            label="Log Out"
            variant="destructive"
            size="md"
            fullWidth
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
  avatarCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.light.accentSoft, overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  userInfo: { flex: 1, gap: spacing.xs },
  usernameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  username: { fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineMedium.fontSize, lineHeight: typography.scale.headlineMedium.lineHeight, letterSpacing: typography.scale.headlineMedium.letterSpacing, color: colors.light.textPrimary },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.light.successSoft, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.full },
  verifiedText: { fontFamily: typography.fontFamilies.caption, fontSize: typography.scale.labelSmall.fontSize, color: colors.light.success },
  memberSince: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, color: colors.light.textMuted },
  menuSection: { gap: spacing.xs },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, paddingHorizontal: spacing.md, backgroundColor: colors.light.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.light.border },
  menuIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.light.accentSoft, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontFamily: typography.fontFamilies.title, fontSize: typography.scale.titleLarge.fontSize, color: colors.light.textPrimary },
  menuChevron: { fontFamily: typography.fontFamilies.mono, fontSize: typography.scale.monoLarge.fontSize, color: colors.light.textMuted },
  logoutSection: { marginTop: spacing.lg, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.light.border },
});

export default ProfileScreen;
