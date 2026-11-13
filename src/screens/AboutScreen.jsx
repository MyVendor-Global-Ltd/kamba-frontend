import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, Storefront } from '../utils/phosphorIcons';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { KambaTextileMotif } from '../components/KambaTextileMotif';
import { ScreenShell } from '../components/ScreenShell';

export const AboutScreen = ({ navigation }) => (
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
          <ArrowLeft size={24} color={colors.light.textPrimary}  />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Kamba</Text>
      </View>

      <View style={styles.hero}>
        <KambaTextileMotif
          width={250}
          height={150}
          color={colors.light.onAccent}
          opacity={0.12}
          style={styles.heroPattern}
        />
        <View style={styles.heroIcon}>
          <Storefront size={28} color={colors.light.onAccent}  />
        </View>
        <Text style={styles.eyebrow}>A LOCAL MARKETPLACE</Text>
        <Text style={styles.heroTitle}>Kamba brings nearby buyers and sellers closer.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Kamba</Text>
        <Text style={styles.body}>
          Kamba is a hyperlocal marketplace designed to help people discover sellers nearby, shorten the distance between buyers and local businesses, and build connections across communities.
        </Text>
      </View>

      <View style={styles.previewNote}>
        <Text style={styles.noteEyebrow}>ABOUT THIS PREVIEW</Text>
        <Text style={styles.noteText}>
          Shop discovery and seller information are available. Product listings, ordering, payment, vendor management, and support channels are not connected here.
        </Text>
      </View>
    </View>
  </ScreenShell>
);

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
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
  hero: {
    position: 'relative',
    overflow: 'hidden',
    gap: spacing.sm,
    padding: spacing.xl,
    borderRadius: radius.xxl,
    backgroundColor: colors.light.accentStrong,
  },
  heroPattern: {
    position: 'absolute',
    top: 0,
    right: -24,
  },
  heroIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.light.accent,
  },
  eyebrow: {
    marginTop: spacing.sm,
    color: colors.light.gold,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
    letterSpacing: 1,
  },
  heroTitle: {
    maxWidth: 320,
    color: colors.light.onAccent,
    fontFamily: typography.fontFamilies.display,
    fontSize: typography.scale.displaySmall.fontSize,
    lineHeight: typography.scale.displaySmall.lineHeight,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.headline,
    fontSize: typography.scale.headlineMedium.fontSize,
  },
  body: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    lineHeight: typography.scale.bodyMedium.lineHeight,
  },
  previewNote: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: radius.xl,
    backgroundColor: colors.light.surface,
  },
  noteEyebrow: {
    color: colors.light.accent,
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
    letterSpacing: 0.8,
  },
  noteText: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodySmall.fontSize,
    lineHeight: typography.scale.bodySmall.lineHeight,
  },
});

export default AboutScreen;
