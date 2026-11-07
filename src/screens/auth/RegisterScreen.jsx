// screens/auth/RegisterScreen.jsx — Single-screen registration
// Username, Email, Password, Confirm Password, Optional Referral Code

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Keyboard } from 'react-native';
import { KambaLogo } from '../../components/KambaLogo';
import { MagneticButton } from '../../components/MagneticButton';
import { StyledInput } from '../../components/StyledInput';
import { KambaPhoneInput } from '../../components/KambaPhoneInput';
import { colors, typography, spacing, radius, motion } from '../../theme/tokens';
import { storage } from '../../utils/storage';
import { authAPI, userAPI } from '../../utils/api';
import { formatUsername, validateUsername } from '../../utils/username';

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
  serverError: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, color: colors.light.error, textAlign: 'center' },
  loginLink: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginLinkText: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, color: colors.light.textSecondary },
  loginLinkAction: { fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize, color: colors.light.accent },
  methodSwitch: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  methodButton: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.light.border },
  methodButtonActive: { backgroundColor: colors.light.accentSoft, borderColor: colors.light.accent },
  methodButtonText: { fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize, color: colors.light.textSecondary },
  methodButtonTextActive: { color: colors.light.accent },
  methodChoiceRow: { flexDirection: 'row', gap: spacing.sm },
  methodChoice: { flex: 1, paddingVertical: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.light.border, alignItems: 'center' },
  methodChoiceActive: { borderColor: colors.light.accent, backgroundColor: colors.light.accentSoft },
  methodChoiceText: { fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize, color: colors.light.textSecondary },
  methodChoiceTextActive: { color: colors.light.accent },
  helperText: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, color: colors.light.textSecondary },
});

export const RegisterScreen = ({ navigation }) => {
  const [accountMethod, setAccountMethod] = useState('email');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('whatsapp');

  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmError, setConfirmError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: motion.duration.slower, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: motion.duration.slower, easing: Easing.bezier(...motion.easing.standard), useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    const validation = validateUsername(username);
    if (!validation.valid) {
      setUsernameAvailable(null);
      setUsernameChecking(false);
      return undefined;
    }
    const candidate = validation.cleaned;

    let active = true;
    const timer = setTimeout(async () => {
      setUsernameChecking(true);
      setUsernameError(null);
      try {
        const result = await userAPI.checkUsername(`@${candidate}`);
        if (!active) return;
        const available = result?.isAvailable === true;
        setUsernameAvailable(available);
        if (!available) setUsernameError(result?.message || 'Username already taken');
      } catch {
        if (!active) return;
        setUsernameAvailable(null);
        setUsernameError('Could not check availability. Try again.');
      } finally {
        if (active) setUsernameChecking(false);
      }
    }, 450);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [username]);

  const validate = () => {
    let valid = true;
    setUsernameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmError(null);
    setServerError(null);

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      setUsernameError(usernameValidation.error);
      valid = false;
    } else if (usernameAvailable === false) {
      setUsernameError('Username already taken');
      valid = false;
    }

    if (accountMethod === 'email') {
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
    } else if (phone.replace(/\D/g, '').length !== 10) {
      setPhoneError('Enter a valid 10-digit Nigerian phone number');
      valid = false;
    }

    return valid;
  };

  const handleRegister = async () => {
    Keyboard.dismiss();
    if (!validate()) return;

    setLoading(true);
    try {
      if (accountMethod === 'phone') {
        const phoneDigits = phone.replace(/\D/g, '');
        const response = await authAPI.registerPhone({
          phone: `+234${phoneDigits}`,
          method: deliveryMethod,
        });
        const result = response.data?.result;
        if (!response.data?.success || !result?.userId) {
          throw new Error(response.data?.message || 'Phone registration could not be started.');
        }
        navigation.navigate('OTP', {
          flow: 'register',
          userId: result.userId,
          phone: phoneDigits,
          method: deliveryMethod,
          username: `@${formatUsername(username)}`,
        });
        return;
      }

      const response = await authAPI.register({
        username: `@${formatUsername(username)}`,
        email: email.trim(),
        password,
        confirm_password: confirmPassword,
        ...(referralCode.trim() ? { referral_code: referralCode.trim() } : {}),
      });
      const result = response.data?.result;
      if (!response.data?.success || !result?.id) {
        throw new Error(response.data?.message || 'Registration could not be completed.');
      }

      await storage.setUsername(result.username || username.trim());
      await storage.setUserData(result);
      const rootNavigation = navigation.getParent?.()?.getParent?.();
      if (rootNavigation?.reset) {
        rootNavigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } else {
        navigation.navigate('Main');
      }
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
        error.response?.data?.result?.message ||
        'Unable to reach Kamba. Check your connection and API configuration, then try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = password.length === 0 ? 0 : 
    password.length < 8 ? 1 : 
    password.length < 12 ? 2 : 3;

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

        <View style={styles.methodSwitch}>
          {[
            { value: 'email', label: 'Email' },
            { value: 'phone', label: 'Phone' },
          ].map((method) => (
            <TouchableOpacity
              key={method.value}
              style={[styles.methodButton, accountMethod === method.value && styles.methodButtonActive]}
              onPress={() => {
                setAccountMethod(method.value);
                setServerError(null);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.methodButtonText, accountMethod === method.value && styles.methodButtonTextActive]}>
                {method.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.form}>
          <StyledInput
            label="Username"
            placeholder="@johndoe"
            value={username}
            onChangeText={(value) => {
              setUsername(value.replace(/^@/, '').slice(0, 16));
              setUsernameError(null);
              setUsernameAvailable(null);
              setServerError(null);
            }}
            error={usernameError}
            hint={usernameChecking ? 'Checking...' : usernameAvailable === true ? 'Available' : usernameAvailable === false ? 'Taken' : '3–16 characters; punctuation allowed; shown as @username'}
            hintStyle={usernameChecking ? { color: colors.light.accent } : usernameAvailable === true ? { color: colors.light.success } : usernameAvailable === false ? { color: colors.light.error } : undefined}
            autoCapitalize="none"
            autoCompleteType="username"
            textContentType="username"
            required
            testID="username-input"
          />

          {accountMethod === 'email' ? (
            <>
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
            </>
          ) : (
            <>
              <KambaPhoneInput
                label="Phone number"
                placeholder="801 234 5678"
                value={phone}
                onChangeText={(value) => {
                  setPhone(value);
                  setPhoneError(null);
                }}
                error={phoneError}
              />
              <Text style={styles.helperText}>We’ll send a verification code before completing sign-up.</Text>
              <View style={styles.methodChoiceRow}>
                {[
                  { value: 'whatsapp', label: 'WhatsApp' },
                  { value: 'sms', label: 'SMS' },
                ].map((method) => (
                  <TouchableOpacity
                    key={method.value}
                    style={[styles.methodChoice, deliveryMethod === method.value && styles.methodChoiceActive]}
                    onPress={() => setDeliveryMethod(method.value)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.methodChoiceText, deliveryMethod === method.value && styles.methodChoiceTextActive]}>
                      {method.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>

        <View style={styles.submitSection}>
          {serverError ? <Text style={styles.serverError} accessibilityRole="alert">{serverError}</Text> : null}
          <MagneticButton
            label={accountMethod === 'phone' ? 'Continue with phone' : 'Create account'}
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

export default RegisterScreen;
