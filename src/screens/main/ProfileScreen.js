import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LuxuryButton from '../../components/common/LuxuryButton';
import { COLORS as C, FONTS as F, SIZES as S } from '../../theme';

const menu = [
  { icon: 'location-outline', title: 'Delivery addresses', detail: 'Add a place you call home' },
  { icon: 'heart-outline', title: 'Saved finds', detail: 'Keep your favourites close' },
  { icon: 'help-circle-outline', title: 'Help & support', detail: 'We’re here when you need us' },
  { icon: 'document-text-outline', title: 'Terms & privacy', detail: 'How Kamba keeps things safe' },
];

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>YOUR CORNER OF KAMBA</Text><Text style={styles.title}>Account</Text>
        <View style={styles.profileCard}><View style={styles.avatar}><Text style={styles.initial}>A</Text></View><View style={styles.identity}><Text style={styles.name}>Guest shopper</Text><Text style={styles.email}>Sign in to make it yours</Text></View><Ionicons name="chevron-forward" size={18} color={C.muted}/></View>
        <View style={styles.cta}><Text style={styles.ctaTitle}>Make yourself at home.</Text><Text style={styles.ctaCopy}>Sign in to save finds, manage orders and hear from local shops.</Text><View style={styles.button}><LuxuryButton label="Sign in or create account" onPress={() => navigation.getParent()?.getParent()?.navigate('Login')} icon="arrow-forward" /></View></View>
        <Text style={styles.sectionTitle}>Your details</Text>
        {menu.map((item) => <Pressable key={item.title} onPress={() => Alert.alert('Not connected yet', item.title === 'Terms & privacy' ? 'Reviewed terms and privacy pages are a launch requirement and are not included in this preview.' : 'This account feature will be enabled when Kamba’s backend is connected.')} style={({ pressed }) => [styles.row, pressed && styles.pressed]}><View style={styles.menuIcon}><Ionicons name={item.icon} size={19} color={C.jade}/></View><View style={styles.menuCopy}><Text style={styles.menuTitle}>{item.title}</Text><Text style={styles.menuDetail}>{item.detail}</Text></View><Ionicons name="chevron-forward" size={17} color={C.muted}/></Pressable>)}
        <View style={styles.preview}><Ionicons name="information-circle-outline" size={16} color={C.secondary}/><Text style={styles.previewText}>Guest profile preview. Account actions will work once authentication is connected.</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },
  content: { paddingHorizontal: S.page, paddingBottom: S.gapXl },
  kicker: { color: C.jade, fontFamily: F.semibold, fontSize: S.xxs, letterSpacing: 1.3, marginTop: S.gapMd },
  title: { color: C.forestDeep, fontFamily: F.display, fontSize: S.display, marginTop: 4 },
  profileCard: { flexDirection: 'row', alignItems: 'center', padding: S.gapMd, backgroundColor: C.paper, borderRadius: S.radiusMd, borderWidth: 1, borderColor: C.line, marginTop: S.gapLg },
  avatar: { width: 50, height: 50, borderRadius: 19, backgroundColor: C.goldPale, alignItems: 'center', justifyContent: 'center' },
  initial: { color: C.forest, fontFamily: F.display, fontSize: S.lg },
  identity: { flex: 1, marginLeft: S.gapSm },
  name: { color: C.ink, fontFamily: F.semibold, fontSize: S.sm },
  email: { color: C.secondary, fontFamily: F.body, fontSize: S.xs, marginTop: 4 },
  cta: { backgroundColor: C.forest, borderRadius: S.radiusLg, padding: S.gapLg, marginTop: S.gapMd },
  ctaTitle: { color: C.paper, fontFamily: F.display, fontSize: S.lg },
  ctaCopy: { color: 'rgba(255,254,251,0.76)', fontFamily: F.body, fontSize: S.xs, lineHeight: 18, marginTop: 6 },
  button: { marginTop: S.gapMd },
  sectionTitle: { color: C.ink, fontFamily: F.display, fontSize: S.lg, marginTop: S.gapXl, marginBottom: S.gapSm },
  row: { minHeight: 71, borderBottomWidth: 1, borderBottomColor: C.line, flexDirection: 'row', alignItems: 'center', gap: S.gapSm },
  pressed: { opacity: 0.85 },
  menuIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' },
  menuCopy: { flex: 1 },
  menuTitle: { color: C.ink, fontFamily: F.medium, fontSize: S.sm },
  menuDetail: { color: C.muted, fontFamily: F.body, fontSize: S.xxs, marginTop: 3 },
  preview: { flexDirection: 'row', gap: 7, backgroundColor: C.sand, borderRadius: S.radiusSm, padding: S.gapSm, marginTop: S.gapLg },
  previewText: { flex: 1, color: C.secondary, fontFamily: F.body, fontSize: S.xxs, lineHeight: 17 },
});
