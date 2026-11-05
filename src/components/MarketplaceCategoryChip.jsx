import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';

export const MarketplaceCategoryChip = ({ category, selected = false, onPress }) => {
  const Icon = category.Icon;

  return (
    <Pressable
      style={[styles.container, selected && styles.selected]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${category.label} category`}
      accessibilityState={{ selected }}
    >
      <View style={[styles.iconFrame, selected && styles.selectedIconFrame]}>
        <Icon size={18} color={selected ? colors.light.onAccent : colors.light.accent} weight="regular" />
      </View>
      <Text style={[styles.label, selected && styles.selectedLabel]}>{category.label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
  selected: {
    borderColor: colors.light.accent,
    backgroundColor: colors.light.accent,
  },
  iconFrame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIconFrame: {
    opacity: 0.94,
  },
  label: {
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.chip,
    fontSize: typography.scale.labelMedium.fontSize,
  },
  selectedLabel: {
    color: colors.light.onAccent,
  },
});

export default MarketplaceCategoryChip;
