import React, { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS as C, FONTS as F, SIZES as S, SHADOWS } from '../../theme';

export function formatNaira(kobo) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(kobo / 100);
}

export default function ProductCard({ item, index = 0, saved = false, onToggleSave, onPress }) {
  const [entrance] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const animation = Animated.timing(entrance, { toValue: 1, duration: 420, delay: Math.min(index * 75, 350), useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [entrance, index]);
  return (
    <Animated.View style={[styles.wrap, { opacity: entrance, transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }]}>
      <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
        <View style={styles.imageWrap}>
          <Image source={item.image} style={styles.image} contentFit="cover" transition={420} cachePolicy="memory-disk" accessibilityLabel={item.name} />
          {!!item.label && <View style={styles.label}><Text style={styles.labelText}>{item.label}</Text></View>}
          <Pressable accessibilityRole="button" accessibilityLabel={saved ? 'Remove from saved' : 'Save product'} onPress={onToggleSave} hitSlop={8} style={styles.saveButton}>
            <Ionicons name={saved ? 'heart' : 'heart-outline'} size={18} color={saved ? C.error : C.forest} />
          </Pressable>
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.store} numberOfLines={1}>{item.storeName}</Text>
          <View style={styles.priceRow}><Text style={styles.price}>{formatNaira(item.priceKobo)}</Text><View style={styles.verified}><Ionicons name="checkmark" size={11} color={C.jade} /></View></View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '48.2%' },
  card: { backgroundColor: C.paper, borderRadius: S.radiusMd, overflow: 'hidden', borderWidth: 1, borderColor: C.line, ...SHADOWS.card },
  cardPressed: { opacity: 0.94, transform: [{ scale: 0.985 }] },
  imageWrap: { height: 168, backgroundColor: C.mint, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  label: { position: 'absolute', left: S.gapSm, bottom: S.gapSm, borderRadius: S.radiusFull, paddingHorizontal: S.gapSm, paddingVertical: 5, backgroundColor: C.paper },
  labelText: { color: C.forest, fontFamily: F.semibold, fontSize: S.xxs, letterSpacing: 0.8 },
  saveButton: { position: 'absolute', right: S.gapSm, top: S.gapSm, width: 34, height: 34, borderRadius: S.radiusFull, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center' },
  info: { paddingHorizontal: S.gapSm, paddingTop: S.gapSm, paddingBottom: S.gapMd },
  name: { color: C.ink, fontFamily: F.semibold, fontSize: S.sm, lineHeight: 18, minHeight: 36 },
  store: { color: C.secondary, fontFamily: F.body, fontSize: S.xs, marginTop: 5 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: S.gapSm },
  price: { color: C.forest, fontFamily: F.bold, fontSize: S.md },
  verified: { width: 18, height: 18, borderRadius: 9, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' },
});
