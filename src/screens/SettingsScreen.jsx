import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, Bell, CreditCard, Info, QuestionCircle, ShieldCheck, User } from '../utils/phosphorIcons';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';

const settingItems = [
  {
    icon: Bell,
    label: 'Notifications',
    description: 'Manage preferences shared with your Kamba website account.',
    route: 'Notifications',
  },
  {
    icon: ShieldCheck,
    label: 'Security & privacy',
    description: 'Review account deletion and security options.',
    route: 'Security',
  },
  {
    icon: User,
    label: 'Edit profile',
    description: 'Update your account details and contact information.',
    route: 'EditProfile',
  },
  {
    icon: CreditCard,
    label: 'Payment methods',
    description: 'A payment provider is not connected.',
    route: 'PaymentMethods',
  },
  {
    icon: QuestionCircle,
    label: 'Help & support',
    description: 'See what is available in this preview.',
    route: 'Help',
  },
  {
    icon: Info,
    label: 'About Kamba',
    description: 'Learn about the local marketplace.',
    route: 'About',
  },
];

export const SettingsScreen = ({ navigation }) => (
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
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <Text style={styles.eyebrow}>ACCOUNT & PREFERENCES</Text>
      <View style={styles.list}>
        {settingItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.route)}
            activeOpacity={0.8}
            accessibilityLabel={`${item.label}. ${item.description}`}
            accessibilityRole="button"
          >
            <View style={styles.menuIcon}>
              <item.icon size={22} color={colors.light.accent} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  </ScreenShell>
);

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
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.headline,
    fontSize: typography.scale.headlineMedium.fontSize,
  },
  eyebrow: {
    color: colors.light.accent,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
    letterSpacing: 1,
  },
  list: {
    gap: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
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
  menuContent: {
    flex: 1,
    gap: spacing.xs,
  },
  menuLabel: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.title,
    fontSize: typography.scale.titleLarge.fontSize,
  },
  menuDescription: {
    color: colors.light.textMuted,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodySmall.fontSize,
    lineHeight: typography.scale.bodySmall.lineHeight,
  },
  menuChevron: {
    color: colors.light.textMuted,
    fontFamily: typography.fontFamilies.mono,
    fontSize: typography.scale.monoLarge.fontSize,
  },
});

export default SettingsScreen;
