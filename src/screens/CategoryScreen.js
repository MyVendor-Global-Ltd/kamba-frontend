import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../components/common/ProductCard';
import SectionHeading from '../components/common/SectionHeading';
import StoreCard from '../components/common/StoreCard';
import { seedCategories, seedProducts, seedStores } from '../data/seeds/marketplace';
import { COLORS as C, FONTS as F, SIZES as S } from '../theme';

export default function CategoryScreen({ navigation, route }) {
  const categoryId = route.params?.categoryId || 'all';
  const category = seedCategories.find((item) => item.id === categoryId);
  const title = route.params?.title || category?.name || 'Explore';
  const [saved, setSaved] = useState([]);
  const products = useMemo(() => seedProducts.filter((item) => categoryId === 'all' || item.categoryId === categoryId).map((item) => ({ ...item, storeName: seedStores.find((store) => store.id === item.storeId)?.name || 'Local maker' })), [categoryId]);
  const stores = seedStores.filter((item) => categoryId === 'all' || item.categoryId === categoryId);
  const toggleSaved = (id) => setSaved((items) => items.includes(id) ? items.filter((value) => value !== id) : [...items, id]);
  const openProduct = (item) => navigation.navigate('Product', { productId: item.id });
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topbar}><Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => navigation.goBack()} style={styles.back}><Ionicons name="arrow-back" size={19} color={C.forest} /></Pressable><Text style={styles.topTitle}>Explore</Text><Pressable onPress={() => navigation.navigate('Search')} style={styles.search}><Ionicons name="search-outline" size={19} color={C.forest} /></Pressable></View>
        <LinearGradient colors={[C.forestDeep, C.forestSoft]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroOrb}/><View style={styles.heroCopy}><Text style={styles.eyebrow}>AROUND YOUR CORNER</Text><Text style={styles.heroTitle}>{title}</Text><Text style={styles.heroSub}>{stores.length} independent shops · Umuahia</Text></View><Ionicons name={category?.icon || 'sparkles-outline'} size={48} color={C.goldPale} style={styles.heroIcon}/>
        </LinearGradient>
        <View style={styles.filterRow}><View style={styles.filterChip}><Ionicons name="navigate-outline" size={13} color={C.jade}/><Text style={styles.filterText}>Near me</Text><Ionicons name="chevron-down" size={12} color={C.secondary}/></View><View style={styles.filterChip}><Ionicons name="star-outline" size={13} color={C.jade}/><Text style={styles.filterText}>Top rated</Text></View><Pressable onPress={() => Alert.alert('Filters', 'Distance and sorting filters will be connected to live catalogue data.')} style={styles.filterButton}><Ionicons name="options-outline" size={16} color={C.forest}/></Pressable></View>
        <View style={styles.section}><SectionHeading eyebrow="REAL PEOPLE, LOCAL SHOPS" title="Meet the makers" /></View>
        {stores.length > 0 ? stores.map((store) => <StoreCard key={store.id} store={store} onPress={() => navigation.navigate('Store', { storeId: store.id })} />) : <Text style={styles.emptyCopy}>No stores are listed in this preview category yet.</Text>}
        <View style={[styles.section, styles.productHeading]}><SectionHeading eyebrow="THOUGHTFUL FINDS" title="Picked for you" /></View>
        {products.length > 0 ? <View style={styles.grid}>{products.map((item, index) => <ProductCard key={item.id} item={item} index={index} saved={saved.includes(item.id)} onToggleSave={() => toggleSaved(item.id)} onPress={() => openProduct(item)} />)}</View> : <Text style={styles.emptyCopy}>Sample product listings will appear here as the catalogue grows.</Text>}
        <Text style={styles.disclaimer}>Sample listings are for design preview only.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },
  content: { paddingHorizontal: S.page, paddingBottom: S.gapXl },
  topbar: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  topTitle: { color: C.ink, fontFamily: F.semibold, fontSize: S.sm },
  search: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  hero: { minHeight: 132, borderRadius: S.radiusLg, padding: S.gapLg, justifyContent: 'center', overflow: 'hidden', marginTop: S.gapSm },
  heroCopy: { zIndex: 1 },
  eyebrow: { color: C.goldPale, fontFamily: F.semibold, fontSize: S.xxs, letterSpacing: 1.3 },
  heroTitle: { color: C.paper, fontFamily: F.display, fontSize: S.xxl, marginTop: 4 },
  heroSub: { color: 'rgba(255,254,251,0.76)', fontFamily: F.body, fontSize: S.xs, marginTop: 4 },
  heroIcon: { position: 'absolute', right: S.gapLg, bottom: S.gapLg },
  heroOrb: { position: 'absolute', width: 170, height: 170, borderRadius: 85, borderWidth: 1, borderColor: 'rgba(232,216,183,0.18)', right: -55, top: -65 },
  filterRow: { flexDirection: 'row', gap: S.gapSm, alignItems: 'center', marginVertical: S.gapLg },
  filterChip: { minHeight: 36, paddingHorizontal: S.gapSm, borderRadius: S.radiusFull, backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, flexDirection: 'row', gap: 5, alignItems: 'center' },
  filterText: { color: C.secondary, fontFamily: F.medium, fontSize: S.xxs },
  filterButton: { marginLeft: 'auto', width: 36, height: 36, borderRadius: 18, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' },
  section: { marginBottom: S.gapMd },
  productHeading: { marginTop: S.gapLg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: S.gapSm },
  emptyCopy: { color: C.secondary, fontFamily: F.body, fontSize: S.xs, paddingVertical: S.gapMd },
  disclaimer: { color: C.muted, fontFamily: F.body, fontSize: S.xxs, textAlign: 'center', marginTop: S.gapXl },
});
