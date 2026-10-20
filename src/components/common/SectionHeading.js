import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS as C, FONTS as F, SIZES as S } from '../../theme';

export default function SectionHeading({ eyebrow, title, action, onAction, style }) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.copy}>
        {!!eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
        <Text style={styles.title}>{title}</Text>
      </View>
      {!!action && <Pressable accessibilityRole="button" onPress={onAction} style={styles.action}><Text style={styles.actionText}>{action}</Text><Ionicons name="arrow-forward" size={14} color={C.jade} /></Pressable>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  copy: { flex: 1 },
  eyebrow: { color: C.jade, fontFamily: F.semibold, fontSize: S.xxs, letterSpacing: 1.45, marginBottom: 5 },
  title: { color: C.ink, fontFamily: F.display, fontSize: S.xl, lineHeight: S.xxl },
  action: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingBottom: 3, marginLeft: S.gapSm },
  actionText: { color: C.jade, fontFamily: F.semibold, fontSize: S.xs },
});
