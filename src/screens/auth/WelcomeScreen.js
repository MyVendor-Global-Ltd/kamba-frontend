import React, { useEffect, useState } from 'react';
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrandMark from '../../components/common/BrandMark';
import LuxuryButton from '../../components/common/LuxuryButton';
import { COLORS as C, FONTS as F, SIZES as S, SHADOWS } from '../../theme';

const VISUALS = [
  { source: require('../../../assets/products/raffia-tote.jpg'), style: 'large' },
  { source: require('../../../assets/products/tomatoes.jpg'), style: 'top' },
  { source: require('../../../assets/products/body-oil.jpg'), style: 'bottom' },
];

export default function WelcomeScreen({ navigation }) {
  const [entrance] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.spring(entrance, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 4 }).start();
    return () => entrance.stopAnimation();
  }, [entrance]);
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topRow}><BrandMark size="compact" /><Pressable accessibilityRole="button" onPress={() => navigation.navigate('MainTabs', { isGuest: true })} style={styles.skip}><Text style={styles.skipText}>Browse as guest</Text><Ionicons name="arrow-forward" size={14} color={C.jade} /></Pressable></View>
        <Animated.View style={[styles.collage, { opacity: entrance, transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }] }]}>
          <View style={styles.sun} />
          <View style={[styles.photo, styles.photoMain, SHADOWS.card]}><Image source={VISUALS[0].source} resizeMode="cover" style={styles.mainPhoto} /></View>
          <View style={[styles.photo, styles.photoTop, SHADOWS.floating]}><Image source={VISUALS[1].source} resizeMode="cover" style={styles.smallPhoto} /><View style={styles.photoIcon}><Ionicons name="leaf-outline" size={13} color={C.jade} /></View></View>
          <View style={[styles.photo, styles.photoBottom, SHADOWS.floating]}><Image source={VISUALS[2].source} resizeMode="cover" style={styles.smallPhoto} /></View>
          <View style={styles.locationPill}><Ionicons name="location" size={12} color={C.paper} /><Text style={styles.locationText}>UMUAHIA, ABIA</Text></View>
        </Animated.View>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>A MORE THOUGHTFUL WAY TO SHOP</Text>
          <Text style={styles.title}>Good finds.{ '\n' }Closer to home.</Text>
          <Text style={styles.subtitle}>Meet the makers, market stalls and independent shops that make your neighbourhood special.</Text>
        </View>
        <View style={styles.actions}>
          <LuxuryButton label="Create your account" onPress={() => navigation.navigate('Register')} icon="arrow-forward" />
          <LuxuryButton label="I already have an account" onPress={() => navigation.navigate('Login')} variant="outline" icon={null} />
        </View>
        <View style={styles.trustRow}><View style={styles.trustLine} /><Ionicons name="shield-checkmark-outline" size={14} color={C.jade} /><Text style={styles.trustText}>Made for your community. Built with care.</Text><View style={styles.trustLine} /></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },
  content: { paddingHorizontal: S.page, paddingBottom: S.gapLg },
  topRow: { minHeight: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: S.gapSm },
  skip: { flexDirection: 'row', gap: 5, alignItems: 'center', padding: 8 },
  skipText: { color: C.jade, fontFamily: F.semibold, fontSize: S.xs },
  collage: { height: 285, marginTop: S.gapMd, position: 'relative' },
  sun: { position: 'absolute', width: 230, height: 230, borderRadius: 115, backgroundColor: C.mint, top: 25, left: 36 },
  photo: { position: 'absolute', overflow: 'hidden', borderRadius: S.radiusLg, backgroundColor: C.paper, borderWidth: 4, borderColor: C.paper },
  photoMain: { width: 190, height: 238, top: 18, left: '23%', transform: [{ rotate: '2deg' }] },
  mainPhoto: { width: '100%', height: '100%' },
  photoTop: { width: 105, height: 112, top: 43, left: 2, transform: [{ rotate: '-8deg' }] },
  photoBottom: { width: 100, height: 110, right: 4, bottom: 7, transform: [{ rotate: '7deg' }] },
  smallPhoto: { width: '100%', height: '100%' },
  photoIcon: { position: 'absolute', width: 25, height: 25, borderRadius: 13, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center', right: 6, bottom: 6 },
  locationPill: { position: 'absolute', left: 19, bottom: 10, backgroundColor: C.forest, borderRadius: S.radiusFull, paddingHorizontal: 11, paddingVertical: 8, flexDirection: 'row', gap: 5, alignItems: 'center' },
  locationText: { color: C.paper, fontFamily: F.semibold, fontSize: S.xxs, letterSpacing: 0.75 },
  copy: { marginTop: S.gapMd },
  eyebrow: { color: C.jade, fontFamily: F.semibold, fontSize: S.xxs, letterSpacing: 1.45, marginBottom: S.gapSm },
  title: { color: C.forestDeep, fontFamily: F.display, fontSize: S.display, lineHeight: 43, letterSpacing: -1.3 },
  subtitle: { color: C.secondary, fontFamily: F.body, fontSize: S.md, lineHeight: 23, marginTop: S.gapMd, maxWidth: 340 },
  actions: { gap: S.gapSm, marginTop: S.gapLg },
  trustRow: { marginTop: S.gapLg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  trustText: { color: C.secondary, fontFamily: F.medium, fontSize: S.xxs },
  trustLine: { flex: 1, height: 1, backgroundColor: C.line },
});
