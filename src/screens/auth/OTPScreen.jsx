import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Keyboard,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, animation } from '../../theme';
import { ScreenShell } from '../../components/ScreenShell';
import { KambaOTPInput } from '../../components/KambaOTPInput';
import { storage } from '../../utils/storage';

const WhatsAppIcon = ({ size = 32, color = '#25D366' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <Path d="M18 18l-3-3m3 3l3-3" />
  </Svg>
);

const MessageIcon = ({ size = 32, color = colors.coral }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);

export const OTPScreen = ({ navigation, route }) => {
  const phone = route?.params?.phone || '8012345678';
  const method = route?.params?.method || 'whatsapp';

  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const checkmarkScale = useRef(new Animated.Value(0)).current;

  // 60-second countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleOTPComplete = async (code) => {
    Keyboard.dismiss();
    setErrorMessage(null);

    // Mock validation: any 6-digit except "000000" passes; "000000" triggers error shake
    if (code === '000000') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrorMessage("That code didn't match. Try again.");
      setTimeout(() => {
        setOtpCode('');
      }, 800);
      return;
    }

    // Success flow
    setIsSuccess(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Animate checkmark in
    Animated.spring(checkmarkScale, {
      toValue: 1,
      ...animation.springBouncy,
      useNativeDriver: true,
    }).start();

    // Persist verified state
    await storage.setUserData({ verifiedPhone: `+234${phone}`, isVerified: true });

    // Navigate to Home after 600ms per spec
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }, 600);
  };

  const handleResend = () => {
    if (!canResend) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCountdown(59);
    setCanResend(false);
    setOtpCode('');
    setErrorMessage(null);
  };

  const formattedPhone = `+234 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
  const displayTimer = `0:${countdown < 10 ? '0' : ''}${countdown}`;

  return (
    <ScreenShell scrollable padded bg={colors.ink}>
      {/* Top: Progress Step 3 of 3 */}
      <View style={styles.topProgress}>
        <Text style={styles.stepLabel}>STEP 3 OF 3</Text>
        <View style={styles.stepDots}>
          <View style={styles.stepDotDone} />
          <View style={styles.stepLineDone} />
          <View style={styles.stepDotDone} />
          <View style={styles.stepLineDone} />
          <View style={[styles.stepDot, styles.stepDotActive]} />
        </View>
      </View>

      {/* Dynamic Method Icon */}
      <View style={styles.iconContainer}>
        {isSuccess ? (
          <Animated.View style={[styles.successCircle, { transform: [{ scale: checkmarkScale }] }]}>
            <Check size={36} color="#fff" strokeWidth={3} />
          </Animated.View>
        ) : (
          <View style={styles.iconCircle}>
            {method === 'whatsapp' ? (
              <WhatsAppIcon size={32} />
            ) : (
              <MessageIcon size={32} />
            )}
          </View>
        )}
      </View>

      {/* Headline & Sub */}
      <View style={styles.headerTextContainer}>
        <Text style={styles.headline}>Enter the code</Text>
        <Text style={styles.subtext}>
          We sent 6 digits to{' '}
          <Text style={styles.phoneHighlight}>{formattedPhone}</Text>{' '}
          via {method === 'whatsapp' ? 'WhatsApp' : 'SMS'}
        </Text>
      </View>

      {/* 40px Gap before OTP Input */}
      <View style={{ height: 40 }} />

      {/* KambaOTPInput */}
      <View style={styles.otpWrapper}>
        <KambaOTPInput
          value={otpCode}
          onChangeText={setOtpCode}
          onComplete={handleOTPComplete}
          error={!!errorMessage}
          autoFocus={true}
        />
        {errorMessage && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
      </View>

      {/* 24px Gap after OTP Input */}
      <View style={{ height: 24 }} />

      {/* Countdown & Resend Section */}
      <View style={styles.countdownContainer}>
        {canResend ? (
          <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
            <Text style={styles.resendActive}>Resend code</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.countdownText}>
            Resend code in <Text style={styles.timerMono}>{displayTimer}</Text>
          </Text>
        )}

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
          style={styles.diffMethodButton}
          activeOpacity={0.7}
        >
          <Text style={styles.diffMethodText}>Try a different method</Text>
        </TouchableOpacity>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  topProgress: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  stepLabel: {
    fontFamily: typography.fontFamilies.mono,
    fontSize: 10,
    color: colors.gold,
    letterSpacing: 2,
  },
  stepDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.inkBorder,
  },
  stepDotDone: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.coral,
  },
  stepLineDone: {
    width: 20,
    height: 1.5,
    backgroundColor: colors.coral,
  },
  stepDotActive: {
    backgroundColor: colors.coral,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.inkRaised,
    borderWidth: 1,
    borderColor: colors.inkBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  headline: {
    fontFamily: typography.fontFamilies.displayHeavy,
    fontSize: 28,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtext: {
    fontFamily: typography.fontFamilies.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  phoneHighlight: {
    fontFamily: typography.fontFamilies.bodySemiBold,
    color: colors.coral,
  },
  otpWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  errorText: {
    fontFamily: typography.fontFamilies.body,
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  countdownContainer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  countdownText: {
    fontFamily: typography.fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  timerMono: {
    fontFamily: typography.fontFamilies.mono,
    color: colors.gold,
  },
  resendActive: {
    fontFamily: typography.fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.coral,
  },
  diffMethodButton: {
    paddingVertical: spacing.xs,
  },
  diffMethodText: {
    fontFamily: typography.fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});

export default OTPScreen;