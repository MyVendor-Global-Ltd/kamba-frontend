import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme/tokens';
import { phosphorIcons } from '../utils/phosphorIcons';
import { KambaButton } from './KambaButton';

const stateCopy = {
  loading: {
    title: 'Loading',
    description: 'Please wait while we get things ready.',
  },
  empty: {
    title: 'Nothing here yet',
    description: 'When there is something to show, it will appear here.',
  },
  error: {
    title: 'Something went wrong',
    description: 'We could not load this information. Please try again.',
  },
  offline: {
    title: 'You are offline',
    description: 'Reconnect to the internet and try again.',
  },
};

const stateIcons = {
  empty: phosphorIcons.Package,
  error: phosphorIcons.Info,
  offline: phosphorIcons.WifiOff,
};

export const ScreenState = ({
  type = 'empty',
  title,
  description,
  actionLabel,
  onAction,
  icon,
  style,
  testID,
}) => {
  const copy = stateCopy[type];
  const Icon = icon || stateIcons[type];
  const isLoading = type === 'loading';

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.iconFrame}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.light.accent} />
        ) : Icon ? (
          <Icon size={28} color={colors.light.accent} weight="regular" />
        ) : null}
      </View>
      <Text accessibilityRole="header" style={styles.title}>
        {title || copy.title}
      </Text>
      <Text style={styles.description}>{description || copy.description}</Text>
      {actionLabel && onAction ? (
        <KambaButton
          label={actionLabel}
          onPress={onAction}
          variant={type === 'error' ? 'primary' : 'secondary'}
          size="sm"
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    minHeight: 220,
    padding: spacing.xl,
  },
  iconFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.light.accentSoft,
  },
  title: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.headline,
    fontSize: typography.scale.headlineMedium.fontSize,
    lineHeight: typography.scale.headlineMedium.lineHeight,
    textAlign: 'center',
  },
  description: {
    maxWidth: 320,
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    lineHeight: typography.scale.bodyMedium.lineHeight,
    textAlign: 'center',
  },
});

export default ScreenState;
