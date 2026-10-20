import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS as C, FONTS as F, SIZES as S } from '../../theme';

export default function Divider({ label = 'or', style }) {
  return <View style={[styles.row, style]}><View style={styles.line}/><Text style={styles.label}>{label}</Text><View style={styles.line}/></View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: S.gapMd, marginVertical: S.gapMd },
  line: { height: 1, backgroundColor: C.line, flex: 1 },
  label: { color: C.muted, fontFamily: F.medium, fontSize: S.xs },
});
