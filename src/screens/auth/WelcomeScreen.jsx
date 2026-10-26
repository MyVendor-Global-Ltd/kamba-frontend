const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  content: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.xxl, justifyContent: 'space-between' },
  brandSection: { alignItems: 'center', marginBottom: spacing.xl },
  tagline: { marginTop: spacing.sm, fontFamily: typography.fontFamilies.bodyMedium, fontSize: typography.scale.bodyMedium.fontSize, lineHeight: typography.scale.bodyMedium.lineHeight, color: colors.light.textSecondary },
  illustration: { flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: spacing.xl },
  illustrationCard: { width: '100%', maxWidth: 320, aspectRatio: 1, borderRadius: radius.xl, backgroundColor: colors.light.surfaceElevated, borderWidth: 1, borderColor: colors.light.border, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  illustrationIcon: { fontSize: 64, marginBottom: spacing.md },
  illustrationTitle: { fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineMedium.fontSize, lineHeight: typography.scale.headlineMedium.lineHeight, letterSpacing: typography.scale.headlineMedium.letterSpacing, color: colors.light.textPrimary, textAlign: 'center', marginBottom: spacing.xs },
  illustrationSubtitle: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, lineHeight: typography.scale.bodyMedium.lineHeight, color: colors.light.textSecondary, textAlign: 'center' },
  valueProps: { marginVertical: spacing.xl, gap: spacing.md },
  valueProp: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.light.surface, borderWidth: 1, borderColor: colors.light.border },
  valuePropIcon: { width: 40, height: 40, borderRadius: radius.lg, backgroundColor: colors.light.accentSoft, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  valuePropEmoji: { fontSize: 20, color: colors.light.accent },
  valuePropTitle: { fontFamily: typography.fontFamilies.title, fontSize: typography.scale.titleLarge.fontSize, lineHeight: typography.scale.titleLarge.lineHeight, color: colors.light.textPrimary, marginBottom: 2 },
  valuePropDesc: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, lineHeight: typography.scale.bodySmall.lineHeight, color: colors.light.textSecondary },
  ctaSection: { gap: spacing.md, paddingTop: spacing.lg },
  ghostButton: { paddingVertical: spacing.md, alignItems: 'center', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.light.border },
  ghostButtonText: { fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelLarge.fontSize, lineHeight: typography.scale.labelLarge.lineHeight, letterSpacing: typography.scale.labelLarge.letterSpacing, color: colors.light.textSecondary },
  footerText: { textAlign: 'center', fontFamily: typography.fontFamilies.caption, fontSize: typography.scale.labelSmall.fontSize, lineHeight: typography.scale.labelSmall.lineHeight, color: colors.light.textMuted, marginTop: spacing.md },
  linkText: { color: colors.light.accent, fontFamily: typography.fontFamilies.chip },
});

export default WelcomeScreen;
export const WelcomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: motion.duration.slower, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: motion.duration.slower, easing: motion.easing.standard, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleGuestBrowse = () => { navigation.replace('Main'); };
  const handleCreateAccount = () => { navigation.navigate('Register'); };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.content}>
        <View style={styles.brandSection}>
          <KambaLogo variant="full" size={40} />
          <Text style={styles.tagline}>Your campus marketplace</Text>
        </View>

        <View style={styles.illustration}>
          <View style={styles.illustrationCard}>
            <Text style={styles.illustrationIcon}>🛍️</Text>
            <Text style={styles.illustrationTitle}>Discover stores</Text>
            <Text style={styles.illustrationSubtitle}>Find food, fashion, tech & more around campus</Text>
          </View>
        </View>

        <View style={styles.valueProps}>
          {[
            { icon: 'Storefront', title: 'Local stores', desc: 'Verified vendors near you' },
            { icon: 'Search', title: 'Easy discovery', desc: 'Search by category or keyword' },
            { icon: 'Package', title: 'Campus delivery', desc: 'Pick up or get it delivered' },
          ].map((item, i) => (
            <View key={i} style={styles.valueProp}>
              <View style={styles.valuePropIcon}>
                <Text style={styles.valuePropEmoji}>●</Text>
              </View>
              <View>
                <Text style={styles.valuePropTitle}>{item.title}</Text>
                <Text style={styles.valuePropDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.ctaSection}>
          <MagneticButton
            label="Create account"
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleCreateAccount}
            accessibilityLabel="Create your Kamba account"
          />
          <TouchableOpacity
            style={styles.ghostButton}
            onPress={handleGuestBrowse}
            activeOpacity={0.8}
            accessibilityLabel="Browse as guest"
            accessibilityRole="button"
          >
            <Text style={styles.ghostButtonText}>Browse as guest</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.linkText}>Terms of Service</Text>{' '}
            and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};
// screens/auth/WelcomeScreen.jsx — Kamba Marketplace Welcome
// Splash → Welcome → (Create Account OR Browse as Guest)

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { KambaLogo } from '../../components/KambaLogo';
import { MagneticButton } from '../../components/MagneticButton';
import { colors, typography, spacing, radius, motion } from '../../theme/tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
