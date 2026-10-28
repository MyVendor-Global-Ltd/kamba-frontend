import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Keyboard,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ChevronLeft, Mail, Phone } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadows, motion } from '../../theme';
import { ScreenShell } from '../../components/ScreenShell';
import { KambaButton } from '../../components/KambaButton';
import { KambaInput } from '../../components/KambaInput';
import { KambaPhoneInput } from '../../components/KambaPhoneInput';
import { storage } from '../../utils/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Colorful Google SVG Icon per quality rules (NO emojis)
const GoogleIcon = ({ size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <Path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <Path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <Path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </Svg>
);

export const LoginScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('email'); // 'email' | 'phone' | 'google'

  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  // Phone state
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState('whatsapp');

  const [loading, setLoading] = useState(false);

  // Animated sliding pill tab indicator
  const tabSlideAnim = useRef(new Animated.Value(0)).current;
  const tabWidth = (SCREEN_WIDTH - 32 - 8) / 3;

  const handleTabChange = (tab, index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
    Animated.spring(tabSlideAnim, {
      toValue: index * tabWidth,
      ...motion.easing.spring,
      useNativeDriver: true,
    }).start();
  };

  const handleEmailLogin = async () => {
    Keyboard.dismiss();
    let valid = true;
    setEmailError(null);
    setPasswordError(null);

    if (!email.trim() || !email.includes('@')) {
      setEmailError('Enter a valid email');
      valid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    }

    if (!valid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await storage.setToken('mock_login_token_' + Date.now());
      const savedUser = await storage.getUsername();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // On login success rule: if no username set → Username, if set → Main
      if (savedUser) {
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } else {
        navigation.navigate('Username', { email: email.trim() });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSendCode = () => {
    Keyboard.dismiss();
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setPhoneError('Enter a valid 10-digit number');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setPhoneError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    navigation.navigate('OTP', {
      phone: cleaned,
      method: deliveryMethod,
      intent: 'login',
    });
  };

  const handleGoogleConnect = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);

    setTimeout(async () => {
      setLoading(false);
      await storage.setToken('mock_google_token_' + Date.now());
      const savedUser = await storage.getUsername();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (savedUser) {
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } else {
        navigation.navigate('Username', { email: 'google.student@campus.edu.ng' });
      }
    }, 800);
  };

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

        <View>
          <Text style={styles.screenTitle}>Welcome back</Text>
          <Text style={styles.screenSubTitle}>Sign in to Kamba</Text>
        </View>
      </View>

      {/* 3 Tab Switcher: [ Email ] [ Phone ] [ Google ] */}
      <View style={styles.tabBar}>
        <Animated.View
          style={[
            styles.tabIndicator,
            { width: tabWidth, transform: [{ translateX: tabSlideAnim }] },
          ]}
        />
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabChange('email', 0)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabLabel, activeTab === 'email' && styles.tabLabelActive]}>
            Email
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabChange('phone', 1)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabLabel, activeTab === 'phone' && styles.tabLabelActive]}>
            Phone
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabChange('google', 2)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabLabel, activeTab === 'google' && styles.tabLabelActive]}>
            Google
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB 1: EMAIL */}
      {activeTab === 'email' && (
        <View style={styles.tabContentGroup}>
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
            error={emailError}
            leftElement={<Mail size={18} color={colors.textTertiary} strokeWidth={2} />}
          />

          <View>
            <KambaInput
              label="Password"
              placeholder="Your password"
              value={password}
              onChangeText={(txt) => {
                setPassword(txt);
                if (passwordError) setPasswordError(null);
              }}
              secureTextEntry
              error={passwordError}
            />

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <KambaButton
            label="Sign In"
            variant="primary"
            fullWidth
            loading={loading}
            onPress={handleEmailLogin}
          />
        </View>
      )}

      {/* TAB 2: PHONE */}
      {activeTab === 'phone' && (
        <View style={styles.tabContentGroup}>
          <KambaPhoneInput
            label="Phone number"
            placeholder="801 234 5678"
            value={phone}
            onChangeText={(txt) => {
              setPhone(txt);
              if (phoneError) setPhoneError(null);
            }}
            error={phoneError}
          />

          <View style={styles.methodChoiceRow}>
            <TouchableOpacity
              style={[
                styles.methodPill,
                deliveryMethod === 'whatsapp' && styles.methodPillActive,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setDeliveryMethod('whatsapp');
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.methodPillText,
                  deliveryMethod === 'whatsapp' && styles.methodPillTextActive,
                ]}
              >
                WhatsApp (Recommended)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.methodPill,
                deliveryMethod === 'sms' && styles.methodPillActive,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setDeliveryMethod('sms');
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.methodPillText,
                  deliveryMethod === 'sms' && styles.methodPillTextActive,
                ]}
              >
                SMS
              </Text>
            </TouchableOpacity>
          </View>

          <KambaButton
            label="Send Code"
            variant="primary"
            fullWidth
            onPress={handlePhoneSendCode}
          />
        </View>
      )}

      {/* TAB 3: GOOGLE */}
      {activeTab === 'google' && (
        <View style={styles.googleContentContainer}>
          <View style={styles.googleIconCircle}>
            <GoogleIcon size={40} />
          </View>

          <Text style={styles.googleHeadline}>Continue with Google</Text>
          <Text style={styles.googleSubtext}>
            We'll sign you in instantly with your campus Google account.
          </Text>

          <KambaButton
            label="Connect Google Account"
            variant="primary"
            fullWidth
            loading={loading}
            onPress={handleGoogleConnect}
            style={{ marginTop: spacing.md }}
          />
        </View>
      )}

      {/* Bottom Switch to Register */}
      <View style={styles.bottomFooter}>
        <View style={styles.bottomDivider} />
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate('Register');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.registerLink}>Create one</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    marginBottom: spacing.xl,
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
  screenSubTitle: {
    fontFamily: typography.fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.inkRaised,
    borderRadius: radius.full,
    padding: 4,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.inkBorder,
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    backgroundColor: colors.coral,
    borderRadius: radius.full,
    ...shadows.coral,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  tabLabel: {
    fontFamily: typography.fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: '#fff',
  },
  tabContentGroup: {
    gap: spacing.lg,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontFamily: typography.fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.coral,
  },
  methodChoiceRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  methodPill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: radius.md,
    backgroundColor: colors.inkRaised,
    borderWidth: 1,
    borderColor: colors.inkBorder,
    alignItems: 'center',
  },
  methodPillActive: {
    borderColor: colors.coral,
    backgroundColor: colors.coralDim,
  },
  methodPillText: {
    fontFamily: typography.fontFamilies.bodyMedium,
    fontSize: 11,
    color: colors.textSecondary,
  },
  methodPillTextActive: {
    color: colors.coral,
  },
  googleContentContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.base,
    backgroundColor: colors.inkRaised,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.inkBorder,
  },
  googleIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
  },
  googleHeadline: {
    fontFamily: typography.fontFamilies.display,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  googleSubtext: {
    fontFamily: typography.fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
  bottomFooter: {
    marginTop: spacing.xxxl,
    alignItems: 'center',
    gap: spacing.base,
  },
  bottomDivider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.inkBorder,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: typography.fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  registerLink: {
    fontFamily: typography.fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.coral,
  },
});

export default LoginScreen;