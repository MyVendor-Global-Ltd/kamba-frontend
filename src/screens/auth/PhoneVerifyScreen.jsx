import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Smartphone } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import { ScreenShell } from '../../components/ScreenShell';
import { KambaButton } from '../../components/KambaButton';
import { KambaPhoneInput } from '../../components/KambaPhoneInput';

// Custom SVG Icons per spec (NO emojis)
const WhatsAppIcon = ({ size = 24, color = '#25D366' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <Path d="M18 18l-3-3m3 3l3-3" />
  </Svg>
);

const SMSBubbleIcon = ({ size = 24, color = colors.coral }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <Path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth={3} strokeLinecap="round" />
  </Svg>
);

export const PhoneVerifyScreen = ({ navigation, route }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('whatsapp'); // 'whatsapp' | 'sms'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelectMethod = (method) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDeliveryMethod(method);
  };

  const handleSendCode = async () => {
    Keyboard.dismiss();
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setError('Please enter a valid 10-digit number');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setError(null);
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Simulate OTP dispatch
    setTimeout(() => {
      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.navigate('OTP', {
        phone: cleaned,
        method: deliveryMethod,
      });
    }, 700);
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.replace('Main');
  };

  const isComplete = phoneNumber.replace(/\D/g, '').length === 10;

  return (
    <ScreenShell scrollable padded bg={colors.ink}>
      {/* Top: Progress Step 2 of 3 */}
      <View style={styles.topProgress}>
        <Text style={styles.stepLabel}>STEP 2 OF 3</Text>
        <View style={styles.stepDots}>
          <View style={styles.stepDotDone} />
          <View style={styles.stepLineDone} />
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={styles.stepLine} />
          <View style={styles.stepDot} />
        </View>
      </View>

      {/* Header Info */}
      <View style={styles.headerArea}>
        <View style={styles.iconCircle}>
          <Smartphone size={40} color={colors.coral} strokeWidth={1.8} />
        </View>
        <Text style={styles.headline}>Add your number</Text>
        <Text style={styles.subtext}>
          Get order updates and verify your identity. Choose how we reach you.
        </Text>
      </View>

      {/* Phone Input with +234 */}
      <View style={styles.inputArea}>
        <KambaPhoneInput
          label="Phone number"
          placeholder="801 234 5678"
          value={phoneNumber}
          onChangeText={(val) => {
            setPhoneNumber(val);
            if (error) setError(null);
          }}
          error={error}
          autoFocus={true}
        />
      </View>

      {/* Delivery Method Choice Cards */}
      <View style={styles.methodCardsContainer}>
        {/* Card 1: WhatsApp (Recommended) */}
        <TouchableOpacity
          style={[
            styles.methodCard,
            deliveryMethod === 'whatsapp' && styles.methodCardSelected,
          ]}
          onPress={() => handleSelectMethod('whatsapp')}
          activeOpacity={0.85}
        >
          <View style={styles.methodHeader}>
            <WhatsAppIcon size={24} />
            <View style={styles.recommendedPill}>
              <Text style={styles.recommendedText}>Recommended</Text>
            </View>
          </View>
          <Text style={styles.methodTitle}>WhatsApp</Text>
          <Text style={styles.methodSubtitle}>Instant delivery • Free</Text>
        </TouchableOpacity>

        {/* Card 2: SMS */}
        <TouchableOpacity
          style={[
            styles.methodCard,
            deliveryMethod === 'sms' && styles.methodCardSelected,
          ]}
          onPress={() => handleSelectMethod('sms')}
          activeOpacity={0.85}
        >
          <View style={styles.methodHeader}>
            <SMSBubbleIcon size={24} />
          </View>
          <Text style={styles.methodTitle}>Send via SMS</Text>
          <Text style={styles.methodSubtitle}>Standard carrier SMS</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom CTA & Skip */}
      <View style={styles.bottomArea}>
        <KambaButton
          label="Send Code"
          variant="primary"
          fullWidth
          disabled={!isComplete}
          loading={loading}
          onPress={handleSendCode}
        />

        <Text style={styles.helperNote}>You only verify once.</Text>

        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipButton}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip for now — verify later</Text>
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
    marginBottom: spacing.lg,
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
  stepLine: {
    width: 20,
    height: 1.5,
    backgroundColor: colors.inkBorder,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.coralDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
  },
  headline: {
    fontFamily: typography.fontFamilies.displayHeavy,
    fontSize: 26,
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
    maxWidth: 300,
  },
  inputArea: {
    marginBottom: spacing.xl,
  },
  methodCardsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  methodCard: {
    flex: 1,
    backgroundColor: colors.inkRaised,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.inkBorder,
    padding: spacing.base,
    minHeight: 110,
    justifyContent: 'space-between',
  },
  methodCardSelected: {
    borderColor: colors.coral,
    backgroundColor: colors.coralDim,
    transform: [{ scale: 1.02 }],
    ...shadows.coral,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recommendedPill: {
    backgroundColor: colors.goldDim,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: colors.gold,
  },
  recommendedText: {
    fontFamily: typography.fontFamilies.bodySemiBold,
    fontSize: 9,
    color: colors.gold,
  },
  methodTitle: {
    fontFamily: typography.fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  methodSubtitle: {
    fontFamily: typography.fontFamilies.body,
    fontSize: 11,
    color: colors.textSecondary,
  },
  bottomArea: {
    gap: spacing.md,
    alignItems: 'center',
  },
  helperNote: {
    fontFamily: typography.fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
  skipButton: {
    paddingVertical: spacing.xs,
  },
  skipText: {
    fontFamily: typography.fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
  },
});

export default PhoneVerifyScreen;