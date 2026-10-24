import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, typography, spacing, radius, shadows, animation } from '../theme';
import { Phone } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const GoogleIcon = ({ size = 22, color }) => (
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

const WhatsAppIcon = ({ size = 22, color = '#25D366' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <Path d="M18 18l-3-3m3 3l3-3" />
  </Svg>
);

const SMSIcon = ({ size = 22, color = colors.coral }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);

export const SocialAuthButton = ({
  provider,
  onPress,
  style,
  disabled = false,
  loading = false,
}) => {
  const pressAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(pressAnim, { toValue: 0.98, ...animation.spring, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.spring(pressAnim, { toValue: 1, ...animation.spring, useNativeDriver: true }).start();
  };

  const handlePress = () => {
    if (disabled || loading) return;
    onPress?.();
  };

  const getIcon = () => {
    switch (provider) {
      case 'google':
        return <GoogleIcon size={22} />;
      case 'whatsapp':
        return <WhatsAppIcon size={22} />;
      case 'phone':
        return <Phone size={22} color={colors.textPrimary} strokeWidth={2} />;
      case 'sms':
        return <SMSIcon size={22} />;
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (provider) {
      case 'google':
        return 'Continue with Google';
      case 'whatsapp':
        return 'Continue with WhatsApp';
      case 'phone':
        return 'Use phone number';
      case 'sms':
        return 'Send via SMS';
      default:
        return '';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
      height: 54,
      borderRadius: radius.full,
      paddingHorizontal: spacing.xl,
      backgroundColor: colors.inkRaised,
      borderWidth: 1,
      borderColor: colors.inkBorder,
      ...shadows.card,
    },
    disabled: {
      opacity: 0.5,
    },
    text: {
      fontFamily: typography.fontFamilies.bodySemiBold,
      fontSize: typography.sizes.base,
      color: colors.textPrimary,
    },
    loadingText: {
      color: colors.textTertiary,
    },
  });

  return (
    <Animated.View style={{ transform: [{ scale: pressAnim }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[styles.container, disabled && styles.disabled, style]}
        accessibilityLabel={getLabel()}
        accessibilityRole="button"
      >
        {getIcon()}
        <Text style={[styles.text, loading && styles.loadingText]}>
          {loading ? 'Connecting...' : getLabel()}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default SocialAuthButton;