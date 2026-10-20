import React, { useMemo } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../components/common/ProductCard';
import SectionHeading from '../components/common/SectionHeading';
import { seedProducts, seedStores } from '../data/seeds/marketplace';
import { COLORS as C, FONTS as F, SIZES as S } from '../theme';

export default function StoreScreen({ navigation, route }) {
  const store = seedStores.find((item) => item.id === route.params?.storeId) || seedStores[0];
  const products = useMemo(() => seedProducts.filter((item) => item.storeId === store.id).map((item) => ({ ...item, storeName: store.name })), [store]);
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.cover}>
          <Image source={products[0]?.image || require('../../assets/products/raffia-tote.jpg')} contentFit="cover" style={StyleSheet.absoluteFill} transition={400} />
          <LinearGradient colors={['rgba(12,46,39,0.02)', 'rgba(12,46,39,0.76)']} style={StyleSheet.absoluteFill} />
          <Pressable onPress={() => navigation.goBack()} style={styles.back}><Ionicons name="arrow-back" size={19} color={C.paper} /></Pressable>
          <Pressable onPress={() => Alert.alert('Save shop', 'Saved shops will be available when your Kamba account is connected.')} style={styles.share}><Ionicons name="heart-outline" size={19} color={C.paper} /></Pressable>
          <View style={styles.coverText}><Text style={styles.area}>{store.area} · LOCAL SHOP</Text><Text style={styles.storeName}>{store.name}</Text></View>
        </View>
        <View style={styles.infoRow}><View style={styles.meta}><Ionicons name="star" size={14} color={C.gold} /><Text style={styles.rating}>{store.rating.toFixed(1)}</Text><Text style={styles.reviews}>({store.reviewCount} reviews)</Text></View><View style={styles.meta}><Ionicons name="navigate-outline" size={13} color={C.jade}/><Text style={styles.distance}>{store.distanceKm.toFixed(1)} km away</Text></View></View>
        <View style={styles.description}><Text style={styles.descriptionTitle}>A neighbourhood favourite</Text><Text style={styles.descriptionCopy}>{store.name} brings thoughtful {store.categoryId} finds to Umuahia. This preview shop is part of Kamba’s local-marketplace demo.</Text><View style={styles.verified}><Ionicons name="checkmark-circle" size={15} color={C.jade}/><Text style={styles.verifiedText}>Community-verified preview</Text></View></View>
        <View style={styles.action}><Pressable onPress={() => Alert.alert('Messaging is coming soon', 'Seller messaging will be available after the Kamba backend is connected.')} style={styles.messageButton}><Ionicons name="chatbubble-ellipses-outline" size={17} color={C.forest}/><Text style={styles.messageText}>Message shop</Text></Pressable></View>
        <View style={styles.productsHead}><SectionHeading eyebrow="FROM THIS SHOP" title="The current edit" /></View>
        {products.length > 0 ? <View style={styles.grid}>{products.map((item, index) => <ProductCard key={item.id} item={item} index={index} onPress={() => navigation.navigate('Product', { productId: item.id })} />)}</View> : <Text style={styles.descriptionCopy}>This shop has no sample products yet.</Text>}
        <Text style={styles.disclaimer}>Fictional demo listing. Not available to purchase.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },
  content: { paddingBottom: S.gapXl },
  cover: { height: 300, overflow: 'hidden', justifyContent: 'flex-end', padding: S.page },
  back: { position: 'absolute', top: S.gapMd, left: S.page, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(12,46,39,0.52)', alignItems: 'center', justifyContent: 'center' },
  share: { position: 'absolute', top: S.gapMd, right: S.page, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(12,46,39,0.52)', alignItems: 'center', justifyContent: 'center' },
  coverText: { zIndex: 1 },
  area: { color: C.goldPale, fontFamily: F.semibold, fontSize: S.xxs, letterSpacing: 1.2 },
  storeName: { color: C.paper, fontFamily: F.display, fontSize: S.xxl, marginTop: 4 },
  infoRow: { paddingHorizontal: S.page, minHeight: 56, borderBottomWidth: 1, borderColor: C.line, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  rating: { color: C.ink, fontFamily: F.semibold, fontSize: S.xs },
  reviews: { color: C.muted, fontFamily: F.body, fontSize: S.xxs },
  distance: { color: C.secondary, fontFamily: F.medium, fontSize: S.xxs },
  description: { marginHorizontal: S.page, marginTop: S.gapLg, padding: S.gapMd, backgroundColor: C.paper, borderRadius: S.radiusMd, borderWidth: 1, borderColor: C.line },
  descriptionTitle: { color: C.ink, fontFamily: F.semibold, fontSize: S.sm },
  descriptionCopy: { color: C.secondary, fontFamily: F.body, fontSize: S.xs, lineHeight: 19, marginTop: 6 },
  verified: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: S.gapSm },
  verifiedText: { color: C.jade, fontFamily: F.medium, fontSize: S.xxs },
  action: { paddingHorizontal: S.page, marginTop: S.gapSm },
  messageButton: { height: 47, borderRadius: S.radiusFull, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: S.gapSm },
  messageText: { color: C.forest, fontFamily: F.semibold, fontSize: S.xs },
  productsHead: { paddingHorizontal: S.page, marginTop: S.gapXl, marginBottom: S.gapMd },
  grid: { paddingHorizontal: S.page, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: S.gapSm },
  disclaimer: { color: C.muted, fontFamily: F.body, fontSize: S.xxs, textAlign: 'center', marginTop: S.gapLg },
});
