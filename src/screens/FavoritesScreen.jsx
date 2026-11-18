import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, Heart } from '../utils/phosphorIcons';
import { colors, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';

export const FavoritesScreen = ({ navigation }) => (
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
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>
      <ScreenState
        type="empty"
        icon={Heart}
        title="Favorites are not connected"
        description="This preview has no saved-items service or product listings. No sample favorites are shown."
        actionLabel="Explore shops"
        onAction={() => navigation.navigate('Main', { screen: 'Discover' })}
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

export default FavoritesScreen;
