import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS as C, FONTS as F, SIZES as S, SHADOWS } from '../../theme';

export default function StoreCard({ store, onPress }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, store.featured && styles.featured, pressed && styles.pressed]}>
      <View style={[styles.avatar, { backgroundColor: store.tone || C.mint }]}><Text style={styles.initials}>{store.initials}</Text></View>
      <View style={styles.info}>
        <View style={styles.nameRow}><Text numberOfLines={1} style={styles.name}>{store.name}</Text>{store.verified && <Ionicons name="checkmark-circle" size={16} color={C.jade} />}</View>
        <Text style={styles.area}>{store.area} · {store.categoryId}</Text>
        <View style={styles.meta}><Ionicons name="star" size={12} color={C.gold} /><Text style={styles.rating}>{store.rating.toFixed(1)}</Text><Text style={styles.reviews}>({store.reviewCount} reviews)</Text><View style={styles.metaSpacer}/><Ionicons name="navigate-outline" size={12} color={C.secondary}/><Text style={styles.distance}>{store.distanceKm.toFixed(1)} km</Text></View>
      </View>
      {store.featured && <View style={styles.featuredTag}><Ionicons name="sparkles" size={10} color={C.forest} /><Text style={styles.featuredText}>FEATURED</Text></View>}
      <Ionicons name="chevron-forward" size={18} color={C.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 94, backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: S.radiusMd, padding: S.gapMd, marginBottom: S.gapSm, flexDirection: 'row', alignItems: 'center', gap: S.gapSm, ...SHADOWS.card },
  featured: { borderColor: C.goldPale, backgroundColor: '#FFFDF8' },
  pressed: { opacity: 0.92 },
  avatar: { width: 48, height: 48, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  initials: { color: C.forest, fontFamily: F.display, fontSize: S.sm },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  name: { color: C.ink, fontFamily: F.semibold, fontSize: S.sm, maxWidth: '86%' },
  area: { color: C.secondary, fontFamily: F.body, fontSize: S.xs, marginTop: 4, textTransform: 'capitalize' },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 7, gap: 4 },
  rating: { color: C.ink, fontFamily: F.semibold, fontSize: S.xs },
  reviews: { color: C.muted, fontFamily: F.body, fontSize: S.xxs },
  metaSpacer: { flex: 1 },
  distance: { color: C.secondary, fontFamily: F.medium, fontSize: S.xxs },
  featuredTag: { position: 'absolute', right: S.gapSm, top: -7, borderRadius: S.radiusFull, backgroundColor: C.goldPale, paddingHorizontal: S.gapSm, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 3 },
  featuredText: { color: C.forest, fontFamily: F.bold, fontSize: 8, letterSpacing: 0.8 },
});
