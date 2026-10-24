import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Keyboard,
} from 'react-native';
import { ChevronLeft, Mail, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius } from '../../theme';
import { ScreenShell } from '../../components/ScreenShell';
import { KambaButton } from '../../components/KambaButton';
import { KambaInput } from '../../components/KambaInput';
import { SocialAuthButton } from '../../components/SocialAuthButton';
import { AnimatedText } from '../../components/AnimatedText';
import { storage } from '../../utils/storage';

export const RegisterScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isReferralLocked, setIsReferralLocked] = useState(false);

  // Field errors
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmError, setConfirmError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Staggered entrance animations for form elements
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;
  const anim4 = useRef(new Animated.Value(0)).current;
  const anim5 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Check invite param ?r=
    const { r } = route?.params || {};
    if (r) {
      setReferralCode(String(r).toUpperCase());
      setIsReferralLocked(true);
    }

    // Stagger form entrance
    Animated.stagger(70, [
      Animated.timing(anim1, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(anim2, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(anim3, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(anim4, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(anim5, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [route?.params]);

  const validate = () => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);
    setConfirmError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setEmailError('Enter a valid email address');
      isValid = false;
    }

    if (!password || password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    Keyboard.dismiss();
    if (!validate()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      // Simulate registration & store auth token
      const mockToken = 'kamba_mock_token_' + Date.now();
      await storage.setToken(mockToken);
      await storage.setUserData({ email: email.trim(), referralCode });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Pass email to UsernameScreen for dynamic suggestions
      navigation.navigate('Username', { email: email.trim() });
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setEmailError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  const makeAnimStyle = (anim) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
    ],
  });

  return (
    <ScreenShell scrollable padded bg={colors.ink}>
      {/* Top Header */}
      <View style={styles.topSection}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color={colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>

        <Text style={styles.screenTitle}>Create account</Text>
      </View>

      <View style={styles.subTitleWrapper}>
        <AnimatedText
          text="Join thousands of buyers and sellers."
          style={styles.subTitleText}
          stagger={40}
        />
      </View>

      {/* Social Auth First */}
      <View style={styles.socialGroup}>
        <SocialAuthButton
          provider="google"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        />
        <SocialAuthButton
          provider="phone"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('PhoneVerify');
          }}
        />
      </View>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or with email</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Form Fields - Stagger Animated */}
      <View style={styles.formGroup}>
        <Animated.View style={makeAnimStyle(anim1)}>
          <KambaInput
            label="Email address"
            placeholder="you@campus.edu.ng"
            value={email}
            onChangeText={(txt) => {
              setEmail(txt);
              if (emailError) setEmailError(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={emailError}
            leftElement={<Mail size={18} color={colors.textTertiary} strokeWidth={2} />}
          />
        </Animated.View>

        <Animated.View style={makeAnimStyle(anim2)}>
          <KambaInput
            label="Password"
            placeholder="At least 8 characters"
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              if (passwordError) setPasswordError(null);
            }}
            secureTextEntry
            error={passwordError}
          />
        </Animated.View>

        <Animated.View style={makeAnimStyle(anim3)}>
          <KambaInput
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={(txt) => {
              setConfirmPassword(txt);
              if (confirmError) setConfirmError(null);
            }}
            secureTextEntry
            error={confirmError}
            rightElement={
              passwordsMatch ? (
                <View style={styles.matchTick}>
                  <Check size={16} color={colors.success} strokeWidth={2.5} />
                </View>
              ) : null
            }
          />
        </Animated.View>

        <Animated.View style={makeAnimStyle(anim4)}>
          <KambaInput
            label="Referral Code (optional)"
            placeholder="INVITE CODE"
            value={referralCode}
            onChangeText={(txt) => setReferralCode(txt.toUpperCase())}
            autoCapitalize="characters"
            editable={!isReferralLocked}
            hint={
              isReferralLocked
                ? 'Applied from your invite link'
                : 'Have an invite code? Enter it here.'
            }
            hintStyle={isReferralLocked ? { color: colors.success } : null}
          />
        </Animated.View>

        <Animated.View style={[makeAnimStyle(anim5), { marginTop: spacing.md }]}>
          <KambaButton
            label="Create Account"
            variant="primary"
            fullWidth
            loading={loading}
            onPress={handleRegister}
          />

          <View style={styles.termsWrapper}>
            <Text style={styles.termsText}>
              By continuing you agree to our{' '}
              <Text style={styles.termsLink}>Terms</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </Animated.View>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.inkRaised,
    borderWidth: 1,
    borderColor: colors.inkBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontFamily: typography.fontFamilies.display,
    fontSize: 22,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
  },
  subTitleWrapper: {
    marginBottom: spacing.lg,
    paddingLeft: 2,
  },
  subTitleText: {
    fontFamily: typography.fontFamilies.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  socialGroup: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.inkBorder,
  },
  dividerText: {
    fontFamily: typography.fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
  formGroup: {
    gap: spacing.base,
  },
  matchTick: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(34,197,94,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsWrapper: {
    marginTop: spacing.base,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  termsText: {
    fontFamily: typography.fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
  termsLink: {
    color: colors.coral,
    fontFamily: typography.fontFamilies.bodyMedium,
  },
});

export default RegisterScreen;