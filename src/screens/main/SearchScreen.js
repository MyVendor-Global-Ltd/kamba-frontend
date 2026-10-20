import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../../components/common/ProductCard';
import SectionHeading from '../../components/common/SectionHeading';
import { seedCategories, seedProducts, seedStores } from '../../data/seeds/marketplace';
import { COLORS as C, FONTS as F, SIZES as S } from '../../theme';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [saved, setSaved] = useState([]);
  const products = useMemo(() => seedProducts.map((item) => ({ ...item, storeName: seedStores.find((store) => store.id === item.storeId)?.name || 'Local maker' })), []);
  const visible = products.filter((item) => (category === 'all' || item.categoryId === category) && `${item.name} ${item.storeName}`.toLowerCase().includes(query.trim().toLowerCase()));
  const openCategory = (id, title) => navigation.getParent()?.navigate('Category', { categoryId: id, title });
  const toggleSaved = (id) => setSaved((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topline}><Text style={styles.kicker}>YOUR NEIGHBOURHOOD, EDITED</Text><Pressable onPress={() => navigation.navigate('Profile')} style={styles.account}><Ionicons name="person-outline" size={17} color={C.forest} /></Pressable></View>
        <Text style={styles.title}>Find your next{ '\n' }favourite thing.</Text>
        <View style={styles.searchBox}><Ionicons name="search-outline" size={19} color={C.jade} /><TextInput value={query} onChangeText={setQuery} placeholder="Try ‘handmade’, ‘fresh’…" placeholderTextColor={C.muted} style={styles.input} returnKeyType="search" autoCorrect={false} /><Pressable accessibilityLabel="Clear search" onPress={() => setQuery('')} hitSlop={8}><Ionicons name={query ? 'close-circle' : 'options-outline'} size={19} color={C.secondary} /></Pressable></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {seedCategories.map((item) => <Pressable key={item.id} onPress={() => setCategory(item.id)} onLongPress={() => item.id !== 'all' && openCategory(item.id, item.name)} style={[styles.filter, category === item.id && styles.filterActive]}><Text style={[styles.filterText, category === item.id && styles.filterTextActive]}>{item.name}</Text></Pressable>)}
        </ScrollView>
        <View style={styles.section}><SectionHeading eyebrow="CURATED CLOSE TO YOU" title={query ? `${visible.length} ${visible.length === 1 ? 'find' : 'finds'}` : 'The local edit'} /></View>
        {visible.length > 0 ? <View style={styles.grid}>{visible.map((item, index) => <ProductCard key={item.id} item={item} index={index} saved={saved.includes(item.id)} onToggleSave={() => toggleSaved(item.id)} onPress={() => navigation.getParent()?.navigate('Product', { productId: item.id })} />)}</View> : <View style={styles.empty}><View style={styles.emptyIcon}><Ionicons name="search-outline" size={24} color={C.jade} /></View><Text style={styles.emptyTitle}>Nothing here just yet</Text><Text style={styles.emptyCopy}>Try another word or explore a different category.</Text></View>}
        <Text style={styles.disclaimer}>Sample listings are for design preview only.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },
  content: { paddingHorizontal: S.page, paddingBottom: S.gapXl },
  topline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: S.gapSm },
  kicker: { color: C.jade, fontFamily: F.semibold, fontSize: S.xxs, letterSpacing: 1.3 },
  account: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  title: { color: C.forestDeep, fontFamily: F.display, fontSize: 31, lineHeight: 36, letterSpacing: -0.8, marginTop: S.gapSm },
  searchBox: { height: 54, marginTop: S.gapLg, paddingHorizontal: S.gapMd, borderRadius: S.radiusMd, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper, flexDirection: 'row', alignItems: 'center', gap: S.gapSm },
  input: { flex: 1, color: C.ink, fontFamily: F.body, fontSize: S.sm, paddingVertical: 10 },
  filters: { gap: S.gapSm, paddingVertical: S.gapMd },
  filter: { paddingHorizontal: S.gapMd, paddingVertical: 9, borderRadius: S.radiusFull, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper },
  filterActive: { backgroundColor: C.forest, borderColor: C.forest },
  filterText: { color: C.secondary, fontFamily: F.medium, fontSize: S.xs },
  filterTextActive: { color: C.paper },
  section: { marginTop: S.gapSm, marginBottom: S.gapMd },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: S.gapSm },
  empty: { alignItems: 'center', paddingVertical: 62, paddingHorizontal: S.gapXl },
  emptyIcon: { width: 68, height: 68, borderRadius: 34, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: C.ink, fontFamily: F.display, fontSize: S.lg, marginTop: S.gapMd },
  emptyCopy: { color: C.secondary, fontFamily: F.body, textAlign: 'center', lineHeight: 20, fontSize: S.xs, marginTop: S.gapSm },
  disclaimer: { color: C.muted, fontFamily: F.body, fontSize: S.xxs, textAlign: 'center', marginTop: S.gapXl },
});
