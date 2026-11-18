import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, CreditCard } from '../utils/phosphorIcons';
import { colors, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';

export const PaymentMethodsScreen = ({ navigation }) => (
  <ScreenShell scrollable={false} padded bg={colors.light.background}>
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={24} color={colors.light.textPrimary}  />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment methods</Text>
      </View>
      <ScreenState
        type="empty"
        icon={CreditCard}
        title="Payments are not connected"
        description="A payment provider is not connected in this preview. No card details are stored or displayed."
      />
    </View>
  </ScreenShell>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.headline,
    fontSize: typography.scale.headlineMedium.fontSize,
  },
});

export default PaymentMethodsScreen;
