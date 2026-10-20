import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LuxuryButton from '../components/common/LuxuryButton';
import { formatNaira } from '../components/common/ProductCard';
import { seedProducts, seedStores } from '../data/seeds/marketplace';
import { COLORS as C, FONTS as F, SIZES as S } from '../theme';

export default function ProductScreen({ navigation, route }) {
  const item = seedProducts.find((product) => product.id === route.params?.productId) || seedProducts[0];
  const store = seedStores.find((seller) => seller.id === item.storeId);
  const [saved, setSaved] = useState(false);
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.imageWrap}><Image source={item.image} style={styles.image} contentFit="cover" transition={450} cachePolicy="memory-disk" /><Pressable onPress={() => navigation.goBack()} style={styles.back}><Ionicons name="arrow-back" size={19} color={C.forest}/></Pressable><Pressable accessibilityLabel={saved ? 'Remove from saved' : 'Save product'} onPress={() => setSaved((value) => !value)} style={styles.save}><Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={saved ? C.error : C.forest}/></Pressable><View style={styles.badge}><Text style={styles.badgeText}>{item.label}</Text></View></View>
        <View style={styles.detail}>
          <Text style={styles.category}>{item.categoryId.toUpperCase()} · LOCAL FIND</Text><Text style={styles.title}>{item.name}</Text><Text style={styles.price}>{formatNaira(item.priceKobo)}</Text>
          <View style={styles.divider}/>
          <Pressable style={styles.seller} onPress={() => navigation.navigate('Store', { storeId: item.storeId })}><View style={[styles.sellerMark, { backgroundColor: store?.tone || C.mint }]}><Text style={styles.sellerInitials}>{store?.initials || 'KM'}</Text></View><View style={styles.sellerCopy}><Text style={styles.sellerName}>{store?.name || 'Local maker'}</Text><Text style={styles.sellerArea}>{store?.area || 'Umuahia'} · {store?.distanceKm?.toFixed(1) || '1.0'} km away</Text></View><View style={styles.rating}><Ionicons name="star" size={12} color={C.gold}/><Text style={styles.ratingText}>{store?.rating?.toFixed(1) || '4.8'}</Text></View><Ionicons name="chevron-forward" size={16} color={C.muted}/></Pressable>
          <Text style={styles.section}>About this find</Text><Text style={styles.description}>Thoughtfully chosen from a neighbourhood shop. Product details shown here are illustrative and will be replaced by live catalogue data before launch.</Text>
          <View style={styles.promise}><Ionicons name="shield-checkmark-outline" size={18} color={C.jade}/><Text style={styles.promiseText}>A real local seller, a more personal shopping experience.</Text></View>
        </View>
        <View style={styles.bottom}><LuxuryButton label="Add to bag" onPress={() => Alert.alert('Preview only', 'Checkout is not connected. No order or payment has been created.')} icon="bag-add-outline" /><Text style={styles.disclaimer}>This sample listing cannot be purchased.</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },
  content: { paddingBottom: S.gapXl },
  imageWrap: { height: 360, overflow: 'hidden', backgroundColor: C.mint },
  image: { width: '100%', height: '100%' },
  back: { position: 'absolute', top: S.gapMd, left: S.page, width: 40, height: 40, borderRadius: 20, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center' },
  save: { position: 'absolute', top: S.gapMd, right: S.page, width: 40, height: 40, borderRadius: 20, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', bottom: S.gapMd, left: S.page, paddingHorizontal: S.gapSm, paddingVertical: 7, borderRadius: S.radiusFull, backgroundColor: C.paper },
  badgeText: { color: C.forest, fontFamily: F.semibold, fontSize: S.xxs, letterSpacing: 0.8 },
  detail: { paddingHorizontal: S.page, paddingTop: S.gapLg },
  category: { color: C.jade, fontFamily: F.semibold, fontSize: S.xxs, letterSpacing: 1.3 },
  title: { color: C.forestDeep, fontFamily: F.display, fontSize: S.xxl, lineHeight: 34, marginTop: S.gapSm },
  price: { color: C.forest, fontFamily: F.bold, fontSize: S.xl, marginTop: S.gapSm },
  divider: { height: 1, backgroundColor: C.line, marginVertical: S.gapLg },
  seller: { flexDirection: 'row', alignItems: 'center', gap: S.gapSm },
  sellerMark: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  sellerInitials: { color: C.forest, fontFamily: F.display, fontSize: S.xs },
  sellerCopy: { flex: 1 },
  sellerName: { color: C.ink, fontFamily: F.semibold, fontSize: S.xs },
  sellerArea: { color: C.secondary, fontFamily: F.body, fontSize: S.xxs, marginTop: 4 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { color: C.ink, fontFamily: F.semibold, fontSize: S.xxs },
  section: { color: C.ink, fontFamily: F.semibold, fontSize: S.md, marginTop: S.xl },
  description: { color: C.secondary, fontFamily: F.body, fontSize: S.xs, lineHeight: 20, marginTop: S.gapSm },
  promise: { flexDirection: 'row', alignItems: 'center', gap: S.gapSm, backgroundColor: C.mint, borderRadius: S.radiusSm, padding: S.gapSm, marginTop: S.gapLg },
  promiseText: { flex: 1, color: C.secondary, fontFamily: F.medium, fontSize: S.xxs, lineHeight: 17 },
  bottom: { paddingHorizontal: S.page, marginTop: S.gapLg },
  disclaimer: { color: C.muted, fontFamily: F.body, fontSize: S.xxs, textAlign: 'center', marginTop: S.gapSm },
});
