import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrandMark from '../components/common/BrandMark';
import ProductCard from '../components/common/ProductCard';
import SectionHeading from '../components/common/SectionHeading';
import StoreCard from '../components/common/StoreCard';
import { seedCategories, seedProducts, seedStores } from '../data/seeds/marketplace';
import { COLORS as C, FONTS as F, SIZES as S, SHADOWS } from '../theme';

const HERO_IMAGE = require('../../assets/products/raffia-tote.jpg');

export default function HomeScreen({ navigation }) {
  const [saved, setSaved] = useState([]);
  const [heroMotion] = useState(() => new Animated.Value(0));
  const products = useMemo(() => seedProducts.map((item) => ({ ...item, storeName: seedStores.find((store) => store.id === item.storeId)?.name || 'Local maker' })), []);
  const toggleSaved = (id) => setSaved((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);

  useEffect(() => {
    Animated.spring(heroMotion, { toValue: 1, useNativeDriver: true, speed: 13, bounciness: 4 }).start();
    return () => heroMotion.stopAnimation();
  }, [heroMotion]);

  const openCategory = (category) => navigation.getParent()?.navigate('Category', { categoryId: category.id, title: category.name });
  const openStore = (store) => navigation.getParent()?.navigate('Store', { storeId: store.id });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <BrandMark size="compact" />
          <View style={styles.headerActions}>
            <Pressable accessibilityRole="button" accessibilityLabel="Notifications" onPress={() => navigation.navigate('Notifications')} style={styles.roundButton}>
              <Ionicons name="notifications-outline" size={19} color={C.forest} /><View style={styles.notificationDot} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Your profile" onPress={() => navigation.navigate('Profile')} style={styles.profileButton}><Text style={styles.profileInitial}>A</Text></Pressable>
          </View>
        </View>
        <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Profile')} style={styles.locationRow}>
          <Ionicons name="location" size={15} color={C.jade} /><Text style={styles.locationKicker}>SHOPPING AROUND</Text><Text style={styles.locationName}>Umuahia, Abia</Text><Ionicons name="chevron-down" size={14} color={C.secondary} />
        </Pressable>
        <Pressable accessibilityRole="search" onPress={() => navigation.navigate('Search')} style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={C.jade} /><Text style={styles.searchPlaceholder}>Find something lovely…</Text><View style={styles.searchFilter}><Ionicons name="options-outline" size={17} color={C.forest} /></View>
        </Pressable>

        <Animated.View style={[styles.hero, { opacity: heroMotion, transform: [{ translateY: heroMotion.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }]}>
          <LinearGradient colors={[C.forestDeep, C.forest, C.forestSoft]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <View style={styles.heroCircleOne} /><View style={styles.heroCircleTwo} />
          <View style={styles.heroCopy}>
            <View style={styles.eyebrow}><View style={styles.eyebrowDot} /><Text style={styles.eyebrowText}>GOOD THINGS, CLOSE BY</Text></View>
            <Text style={styles.heroTitle}>Your local edit.</Text>
            <Text style={styles.heroSub}>Thoughtful finds from the people who make home special.</Text>
            <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Search')} style={styles.heroCta}><Text style={styles.heroCtaText}>Explore the neighbourhood</Text><Ionicons name="arrow-forward" size={14} color={C.forest} /></Pressable>
          </View>
          <View style={styles.heroPhotoFrame}><Image source={HERO_IMAGE} style={styles.heroPhoto} contentFit="cover" transition={450} cachePolicy="memory-disk" /><View style={styles.heroPhotoBorder} /></View>
          <View style={styles.madeLocal}><Ionicons name="leaf-outline" size={11} color={C.forest} /><Text style={styles.madeLocalText}>MADE LOCAL</Text></View>
        </Animated.View>

        <View style={styles.sectionBlock}>
          <SectionHeading eyebrow="CURATED FOR YOUR CORNER" title="Explore by mood" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
            {seedCategories.filter((item) => item.id !== 'all').map((item, index) => (
              <Pressable accessibilityRole="button" key={item.id} onPress={() => openCategory(item)} style={[styles.categoryCard, { backgroundColor: [C.mint, C.sand, C.rose, '#E7E9EF', '#E8E6F0'][index % 5] }]}>
                <View style={styles.categoryIcon}><Ionicons name={item.icon} size={19} color={C.forest} /></View><Text style={styles.categoryName}>{item.name}</Text><Ionicons name="arrow-up-right" size={13} color={C.secondary} style={styles.categoryArrow} />
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.productsBlock}>
          <SectionHeading eyebrow="A LITTLE OF EVERYTHING" title="Lovely local finds" action="See all" onAction={() => navigation.navigate('Search')} />
          <View style={styles.productGrid}>{products.map((item, index) => <ProductCard key={item.id} item={item} index={index} saved={saved.includes(item.id)} onToggleSave={() => toggleSaved(item.id)} onPress={() => navigation.getParent()?.navigate('Product', { productId: item.id })} />)}</View>
        </View>

        <View style={styles.storesBlock}>
          <SectionHeading eyebrow="PEOPLE BEHIND THE GOOD STUFF" title="Meet your neighbours" action="Browse" onAction={() => navigation.navigate('Search')} style={styles.storeHeading} />
          {seedStores.filter((store) => store.featured || store.verified).slice(0, 2).map((store) => <StoreCard key={store.id} store={store} onPress={() => openStore(store)} />)}
        </View>

        <View style={styles.trustCard}>
          <View style={styles.trustIcon}><Ionicons name="shield-checkmark-outline" size={21} color={C.jade} /></View>
          <View style={styles.trustCopy}><Text style={styles.trustTitle}>Local feels different.</Text><Text style={styles.trustSub}>Every find connects you with a real neighbour.</Text></View>
          <Ionicons name="arrow-forward" size={16} color={C.jade} />
        </View>
        <Text style={styles.footer}>A little closer to home. Made for Umuahia.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },
  content: { paddingBottom: S.gapXl },
  header: { paddingHorizontal: S.page, paddingTop: S.gapSm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: S.gapSm },
  roundButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center' },
  notificationDot: { position: 'absolute', width: 7, height: 7, borderRadius: 4, top: 8, right: 9, backgroundColor: C.gold, borderWidth: 1, borderColor: C.paper },
  profileButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.goldPale, borderWidth: 2, borderColor: C.paper, alignItems: 'center', justifyContent: 'center' },
  profileInitial: { color: C.forest, fontFamily: F.display, fontSize: S.sm },
  locationRow: { marginHorizontal: S.page, marginTop: S.gapMd, flexDirection: 'row', alignItems: 'center', gap: 5 },
  locationKicker: { color: C.muted, fontFamily: F.semibold, fontSize: S.xxs, letterSpacing: 0.8, marginLeft: 2 },
  locationName: { color: C.ink, fontFamily: F.semibold, fontSize: S.xs, marginLeft: 2 },
  searchBar: { height: 54, marginHorizontal: S.page, marginTop: S.gapMd, marginBottom: S.gapLg, paddingLeft: S.gapMd, paddingRight: 7, flexDirection: 'row', alignItems: 'center', gap: S.gapSm, borderRadius: S.radiusMd, backgroundColor: C.paper, borderWidth: 1, borderColor: C.line },
  searchPlaceholder: { flex: 1, color: C.muted, fontFamily: F.body, fontSize: S.sm },
  searchFilter: { width: 40, height: 40, borderRadius: 14, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' },
  hero: { marginHorizontal: S.page, marginBottom: S.gapXl, minHeight: 222, borderRadius: S.radiusLg, overflow: 'hidden', padding: S.gapLg, ...SHADOWS.floating },
  heroCopy: { width: '68%', zIndex: 2 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: S.gapSm },
  eyebrowDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.gold },
  eyebrowText: { color: C.goldPale, fontFamily: F.semibold, fontSize: S.xxs, letterSpacing: 1.15 },
  heroTitle: { color: C.paper, fontFamily: F.display, fontSize: S.xl, lineHeight: 28, letterSpacing: -0.4 },
  heroSub: { color: 'rgba(255,254,251,0.78)', fontFamily: F.body, fontSize: S.xs, lineHeight: 18, marginTop: S.gapSm, maxWidth: 188 },
  heroCta: { minHeight: 38, alignSelf: 'flex-start', backgroundColor: C.goldPale, paddingHorizontal: S.gapSm, borderRadius: S.radiusFull, flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: S.gapMd },
  heroCtaText: { color: C.forestDeep, fontFamily: F.semibold, fontSize: S.xxs },
  heroPhotoFrame: { position: 'absolute', width: 144, height: 186, right: 14, top: 17, borderRadius: 76, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,254,251,0.62)', transform: [{ rotate: '4deg' }] },
  heroPhoto: { width: '100%', height: '100%' },
  heroPhotoBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 76, borderWidth: 5, borderColor: 'rgba(255,254,251,0.16)' },
  heroCircleOne: { position: 'absolute', width: 208, height: 208, borderRadius: 104, borderWidth: 1, borderColor: 'rgba(232,216,183,0.16)', top: -132, left: 90 },
  heroCircleTwo: { position: 'absolute', width: 128, height: 128, borderRadius: 64, borderWidth: 1, borderColor: 'rgba(232,216,183,0.12)', bottom: -80, left: 20 },
  madeLocal: { position: 'absolute', right: 12, bottom: 12, backgroundColor: C.goldPale, borderRadius: S.radiusFull, paddingHorizontal: S.gapSm, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 4, transform: [{ rotate: '-3deg' }] },
  madeLocalText: { color: C.forest, fontFamily: F.bold, fontSize: 8, letterSpacing: 0.7 },
  sectionBlock: { marginBottom: S.gapXl },
  categoryRow: { paddingHorizontal: S.page, gap: S.gapSm, paddingTop: S.gapMd },
  categoryCard: { width: 110, height: 110, borderRadius: S.radiusMd, padding: S.gapSm, justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(23,33,29,0.035)' },
  categoryIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: 'rgba(255,254,251,0.76)', alignItems: 'center', justifyContent: 'center' },
  categoryName: { color: C.ink, fontFamily: F.semibold, fontSize: S.xs },
  categoryArrow: { position: 'absolute', right: 10, bottom: 10 },
  productsBlock: { paddingHorizontal: S.page, marginBottom: S.gapXl },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: S.gapSm, marginTop: S.gapMd },
  storesBlock: { paddingHorizontal: S.page },
  storeHeading: { marginBottom: S.gapMd },
  trustCard: { marginHorizontal: S.page, marginTop: S.gapLg, padding: S.gapMd, borderRadius: S.radiusMd, backgroundColor: C.sand, flexDirection: 'row', alignItems: 'center', gap: S.gapSm, borderWidth: 1, borderColor: C.goldPale },
  trustIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center' },
  trustCopy: { flex: 1 },
  trustTitle: { color: C.ink, fontFamily: F.semibold, fontSize: S.sm },
  trustSub: { color: C.secondary, fontFamily: F.body, fontSize: S.xxs, marginTop: 3 },
  footer: { color: C.muted, fontFamily: F.medium, fontSize: S.xxs, textAlign: 'center', marginTop: S.gapLg },
});
