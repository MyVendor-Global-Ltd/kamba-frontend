import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { MagneticButton } from '../components/MagneticButton';
import { colors, spacing, typography } from '../theme/tokens';

const featureContent = {
  Checkout: {
    title: 'Checkout',
    message: 'Checkout and payment are not available in this preview. No payment will be taken and no order has been placed.',
  },
  Addresses: {
    title: 'Delivery addresses',
    message: 'Address management is not connected yet. Saved addresses are not available here.',
  },
  OrderDetail: {
    title: 'Order details',
    message: 'Live order data is not connected in this preview. No sample order details are shown.',
  },
  Favorites: {
    title: 'Favorites',
    message: 'Favorites are not available yet because product listings are not connected in this preview.',
  },
  ProductDetail: {
    title: 'Product details',
    message: 'Product detail pages are not available yet. Browse stores to see current listings.',
  },
  AddCard: {
    title: 'Add a payment method',
    message: 'Adding cards is not available because a payment provider is not connected in this preview.',
  },
  EditProfile: {
    title: 'Edit profile',
    message: 'Profile editing is not available in this preview yet.',
  },
  Language: {
    title: 'Language',
    message: 'Language preferences are not available in this preview yet.',
  },
  ClearCache: {
    title: 'Clear cache',
    message: 'Cache management is not available in this preview yet.',
  },
  ContactSupport: {
    title: 'Contact support',
    message: 'Support contact options are not available in this preview yet.',
  },
  EmailSupport: {
    title: 'Email support',
    message: 'Email support is not available in this preview yet.',
  },
  CallSupport: {
    title: 'Call support',
    message: 'Phone support is not available in this preview yet.',
  },
  DataPrivacy: {
    title: 'Data & privacy',
    message: 'Data and privacy controls are not available in this preview yet.',
  },
  BlockedUsers: {
    title: 'Blocked users',
    message: 'Blocked user management is not available in this preview yet.',
  },
  SecurityLog: {
    title: 'Security history',
    message: 'Security history is not available in this preview yet.',
  },
  ActiveSessions: {
    title: 'Active sessions',
    message: 'Active session management is not available in this preview yet.',
  },
};

export const UnavailableFeatureScreen = ({ navigation, route }) => {
  const content = featureContent[route.name] || {
    title: 'Feature unavailable',
    message: 'This feature is not available in this preview yet.',
  };

  return (
    <ScreenShell scrollable={false} padded bg={colors.light.background}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>PREVIEW LIMITATION</Text>
        <Text style={styles.title}>{content.title}</Text>
        <Text style={styles.message}>{content.message}</Text>
        {route.params?.orderId ? (
          <Text style={styles.reference}>Order reference: {route.params.orderId}</Text>
        ) : null}
        <MagneticButton
          label="Go back"
          variant="primary"
          size="md"
          onPress={() => navigation.goBack()}
          style={styles.button}
        />
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', gap: spacing.md },
  eyebrow: {
    fontFamily: typography.fontFamilies.label,
    fontSize: typography.scale.labelSmall.fontSize,
    letterSpacing: 1,
    color: colors.light.accent,
  },
  title: {
    fontFamily: typography.fontFamilies.headline,
    fontSize: typography.scale.headlineLarge.fontSize,
    color: colors.light.textPrimary,
  },
  message: {
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    lineHeight: typography.scale.bodyMedium.lineHeight,
    color: colors.light.textSecondary,
  },
  reference: {
    fontFamily: typography.fontFamilies.mono,
    fontSize: typography.scale.mono.fontSize,
    color: colors.light.textMuted,
  },
  button: { marginTop: spacing.md, alignSelf: 'flex-start' },
});

export default UnavailableFeatureScreen;
