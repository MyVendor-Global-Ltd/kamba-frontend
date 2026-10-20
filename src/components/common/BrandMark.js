import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS as C, FONTS as F, SIZES as S } from '../../theme';

export default function BrandMark({ size = 'regular', light = false, showWordmark = true }) {
  const compact = size === 'compact';
  return (
    <View style={styles.row}>
      <View style={[styles.mark, compact && styles.markCompact, light && styles.markLight]}>
        <Ionicons name="bag-handle" size={compact ? 17 : 20} color={light ? C.forestDeep : C.paper} />
        <View style={[styles.dot, light && styles.dotLight]} />
      </View>
      {showWordmark && <View style={styles.words}>
        <Text style={[styles.wordmark, compact && styles.wordmarkCompact, light && styles.wordmarkLight]}>kamba</Text>
        {!compact && <Text style={[styles.tagline, light && styles.taglineLight]}>MADE AROUND YOU</Text>}
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  mark: { width: 42, height: 42, borderRadius: 15, backgroundColor: C.forest, alignItems: 'center', justifyContent: 'center' },
  markCompact: { width: 34, height: 34, borderRadius: 12 },
  markLight: { backgroundColor: C.goldPale },
  dot: { position: 'absolute', width: 6, height: 6, borderRadius: 3, backgroundColor: C.gold, right: 7, top: 7, borderWidth: 1, borderColor: C.forest },
  dotLight: { borderColor: C.goldPale },
  words: { marginLeft: S.gapSm },
  wordmark: { color: C.forest, fontSize: S.xl, lineHeight: S.xl, fontFamily: F.displayBold, letterSpacing: -0.8 },
  wordmarkCompact: { fontSize: S.lg, lineHeight: S.lg },
  wordmarkLight: { color: C.paper },
  tagline: { color: C.muted, fontSize: S.xxs, marginTop: 4, letterSpacing: 1.4, fontFamily: F.semibold },
  taglineLight: { color: C.goldPale },
});
