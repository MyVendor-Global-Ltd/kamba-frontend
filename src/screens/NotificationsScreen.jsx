import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';
import { colors, typography, spacing } from '../theme';
import { ScreenShell } from '../components/ScreenShell';

export const NotificationsScreen = () => (
  <ScreenShell padded bg={colors.ink}>
    <View style={styles.center}>
      <Bell size={40} color={colors.coral} strokeWidth={2} />
      <Text style={styles.title}>Campus Updates</Text>
      <Text style={styles.sub}>Instant alerts on drops, order statuses, and new campus stores.</Text>
    </View>
  </ScreenShell>
);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    marginTop: 100,
  },
  title: {
    fontFamily: typography.fontFamilies.display,
    fontSize: 22,
    color: colors.textPrimary,
  },
  sub: {
    fontFamily: typography.fontFamilies.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotificationsScreen;