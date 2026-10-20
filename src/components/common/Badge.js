import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS as C, FONTS as F, SIZES as S } from '../../theme';

const variants = {
  verified: { background: C.mint, foreground: C.jade, icon: 'checkmark-circle' },
  featured: { background: C.goldPale, foreground: C.forest, icon: 'sparkles' },
  category: { background: C.cream, foreground: C.secondary, icon: null },
  neutral: { background: C.paper, foreground: C.secondary, icon: null },
};

export default function Badge({ label, variant = 'neutral', style }) {
  const tone = variants[variant] || variants.neutral;
  return <View style={[styles.badge, { backgroundColor: tone.background }, style]}>{tone.icon && <Ionicons name={tone.icon} size={12} color={tone.foreground}/>}<Text style={[styles.label, { color: tone.foreground }]}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', minHeight: 23, paddingHorizontal: S.gapSm, borderRadius: S.radiusFull, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  label: { fontFamily: F.semibold, fontSize: S.xxs },
});
