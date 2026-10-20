import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS as C, FONTS as F, SIZES as S } from '../../theme';

export default function EmptyState({ icon, title, message, action }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconHalo}><View style={styles.iconCore}><Ionicons name={icon} size={29} color={C.jade} /></View></View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingHorizontal: S.gapXl, paddingVertical: 52 },
  iconHalo: { width: 90, height: 90, borderRadius: 45, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' },
  iconCore: { width: 62, height: 62, borderRadius: 31, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center' },
  title: { color: C.ink, fontFamily: F.display, fontSize: S.lg, textAlign: 'center', marginTop: S.gapLg },
  message: { color: C.secondary, fontFamily: F.body, fontSize: S.sm, lineHeight: 21, textAlign: 'center', marginTop: S.gapSm },
});
