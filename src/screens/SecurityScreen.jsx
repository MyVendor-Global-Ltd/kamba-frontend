import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, ShieldCheck } from '../utils/phosphorIcons';
import { colors, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';

export const SecurityScreen = ({ navigation }) => (
  <ScreenShell scrollable={false} padded bg={colors.light.background}>
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
        <Text style={styles.headerTitle}>Security & privacy</Text>
      </View>
      <ScreenState
        type="empty"
        icon={ShieldCheck}
        title="Security controls are not connected"
        description="Password changes, two-factor authentication, biometrics, and session management are not available in this preview. No security settings are being changed."
      />
    </View>
  </ScreenShell>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.headline,
    fontSize: typography.scale.headlineMedium.fontSize,
  },
});

export default SecurityScreen;
