const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  content: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xl },
  backButton: { paddingVertical: spacing.xs, marginBottom: spacing.md },
  backText: { fontFamily: typography.fontFamilies.bodyMedium, fontSize: typography.scale.bodyMedium.fontSize, color: colors.light.textSecondary },
  brandSection: { alignItems: 'center', marginBottom: spacing.xl },
  title: { marginTop: spacing.md, fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineLarge.fontSize, lineHeight: typography.scale.headlineLarge.lineHeight, letterSpacing: typography.scale.headlineLarge.letterSpacing, color: colors.light.textPrimary },
  subtitle: { marginTop: spacing.xs, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, lineHeight: typography.scale.bodyMedium.lineHeight, color: colors.light.textSecondary, textAlign: 'center' },
  form: { gap: spacing.md, marginBottom: spacing.xl },
  passwordStrength: { marginTop: spacing.xs, gap: spacing.xs },
  strengthBar: { flexDirection: 'row', gap: 4, height: 4 },
  strengthSegment: { flex: 1, borderRadius: 2, backgroundColor: colors.light.border },
  strengthFilled: { backgroundColor: colors.light.accent },
  strengthLabel: { fontFamily: typography.fontFamilies.caption, fontSize: typography.scale.labelSmall.fontSize, color: colors.light.textMuted },
  submitSection: { gap: spacing.md, paddingTop: spacing.md },
  loginLink: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginLinkText: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, color: colors.light.textSecondary },
  loginLinkAction: { fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize, color: colors.light.accent },
});

export default RegisterScreen;
return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.brandSection}>
          <KambaLogo variant="full" size={36} />
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Join Kamba to discover campus stores</Text>
        </View>

        <View style={styles.form}>
          <StyledInput
            label="Username"
            placeholder="johndoe"
            value={username}
            onChangeText={setUsername}
            error={usernameError}
            hint={usernameChecking ? 'Checking...' : usernameAvailable === true ? 'Available' : usernameAvailable === false ? 'Taken' : '3+ characters, letters/numbers/_'}
            hintStyle={usernameChecking ? { color: colors.light.accent } : usernameAvailable === true ? { color: colors.light.success } : usernameAvailable === false ? { color: colors.light.error } : undefined}
            autoCapitalize="none"
            autoCompleteType="username"
            textContentType="username"
            required
            testID="username-input"
          />

          <StyledInput
            label="Email"
            placeholder="you@university.edu"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            hint="We'll only send important updates"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            required
            testID="email-input"
          />

          <StyledInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            hint={password.length > 0 && password.length < 8 ? 'At least 8 characters' : undefined}
            secureTextEntry
            required
            testID="password-input"
          />

          {password.length > 0 && (
            <View style={styles.passwordStrength}>
              <View style={styles.strengthBar}>
                {[1, 2, 3].map((level) => (
                  <View
                    key={level}
                    style={[
                      styles.strengthSegment,
                      level <= passwordStrength ? styles.strengthFilled : {},
                      level === 1 && { backgroundColor: colors.light.error },
                      level === 2 && { backgroundColor: colors.light.warning },
                      level === 3 && { backgroundColor: colors.light.success },
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.strengthLabel}>
                {passwordStrength === 1 ? 'Weak' : passwordStrength === 2 ? 'Medium' : 'Strong'}
              </Text>
            </View>
          )}

          <StyledInput
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={confirmError}
            secureTextEntry
            required
            testID="confirm-password-input"
          />

          <StyledInput
            label="Referral Code (optional)"
            placeholder="INVITE123"
            value={referralCode}
            onChangeText={(t) => setReferralCode(t.toUpperCase())}
            hint="Have a referral code? Enter it here"
            autoCapitalize="characters"
            testID="referral-input"
          />
        </View>

        <View style={styles.submitSection}>
          <MagneticButton
            label="Create account"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            onPress={handleRegister}
            accessibilityLabel="Create your Kamba account"
          />

          <View style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              accessibilityLabel="Go to login"
            >
              <Text style={styles.loginLinkAction}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

// Debounce utility
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
const validate = () => {
    let valid = true;
    setUsernameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmError(null);

    if (!username.trim()) {
      setUsernameError('Username is required');
      valid = false;
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      valid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError('Letters, numbers, and underscore only');
      valid = false;
    } else if (usernameAvailable === false) {
      setUsernameError('Username already taken');
      valid = false;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      valid = false;
    }

    return valid;
  };

  const handleRegister = async () => {
    Keyboard.dismiss();
    if (!validate()) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const mockToken = 'kamba_mock_token_' + Date.now();
      await storage.setToken(mockToken);
      await storage.setUsername(username.trim());
      navigation.replace('Main');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = password.length === 0 ? 0 : 
    password.length < 8 ? 1 : 
    password.length < 12 ? 2 : 3;
// Debounced username availability check
  const checkUsernameAvailability = useCallback(
    debounce(async (value) => {
      if (!value || value.length < 3) {
        setUsernameAvailable(null);
        return;
      }
      setUsernameChecking(true);
      setUsernameError(null);
      try {
        await new Promise((r) => setTimeout(r, 800));
        const taken = ['admin', 'kamba', 'support', 'test', 'demo'].includes(value.toLowerCase());
        setUsernameAvailable(!taken);
        if (taken) setUsernameError('Username already taken');
      } catch {
        setUsernameError('Could not check availability');
      } finally {
        setUsernameChecking(false);
      }
    }, 1500),
    []
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: motion.duration.slower, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: motion.duration.slower, easing: motion.easing.standard, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    checkUsernameAvailability(username);
  }, [username, checkUsernameAvailability]);
// screens/auth/RegisterScreen.jsx — Single-screen registration
// Username, Email, Password, Confirm Password, Optional Referral Code

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Keyboard } from 'react-native';
import { KambaLogo } from '../../components/KambaLogo';
import { MagneticButton } from '../../components/MagneticButton';
import { StyledInput } from '../../components/StyledInput';
import { colors, typography, spacing, radius, motion } from '../../theme/tokens';
import { storage } from '../../utils/storage';

export const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmError, setConfirmError] = useState(null);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
