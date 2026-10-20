import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS as C, FONTS as F, SIZES as S } from '../../theme';

const previewItems = [
  { id: 'welcome', icon: 'sparkles-outline', tone: C.mint, title: 'A warmer way to shop', body: 'Discover makers, fresh finds and independent shops right around you.', time: 'WELCOME NOTE' },
  { id: 'community', icon: 'people-outline', tone: C.sand, title: 'Good things happen nearby', body: 'Your Kamba neighbourhood is getting ready to welcome its first shoppers.', time: 'COMMUNITY UPDATE' },
  { id: 'security', icon: 'shield-checkmark-outline', tone: C.rose, title: 'Your account, your privacy', body: 'We’ll only send updates that help you shop with confidence.', time: 'ACCOUNT NOTE' },
];

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}><View><Text style={styles.kicker}>STAY IN THE LOOP</Text><Text style={styles.title}>Updates</Text></View><View style={styles.bell}><Ionicons name="notifications-outline" size={20} color={C.forest} /></View></View>
        <Text style={styles.subtitle}>A thoughtful note, never noise.</Text>
        <View style={styles.status}><View style={styles.statusDot}/><Text style={styles.statusText}>Preview notifications · not live updates</Text></View>
        {previewItems.map((item) => <Pressable key={item.id} style={({ pressed }) => [styles.card, pressed && styles.pressed]}><View style={[styles.iconWrap, { backgroundColor: item.tone }]}><Ionicons name={item.icon} size={20} color={C.forest} /></View><View style={styles.copy}><View style={styles.row}><Text style={styles.time}>{item.time}</Text><View style={styles.unread} /></View><Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.body}>{item.body}</Text></View></Pressable>)}
        <View style={styles.footer}><Ionicons name="checkmark-done-outline" size={16} color={C.jade} /><Text style={styles.footerText}>You’re all caught up.</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },
  content: { paddingHorizontal: S.page, paddingBottom: S.gapXl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: S.gapMd },
  kicker: { color: C.jade, fontFamily: F.semibold, fontSize: S.xxs, letterSpacing: 1.3 },
  title: { color: C.forestDeep, fontFamily: F.display, fontSize: S.display, marginTop: 4 },
  bell: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  subtitle: { color: C.secondary, fontFamily: F.body, fontSize: S.sm, marginTop: 4, marginBottom: S.gapMd },
  status: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: S.gapSm, paddingVertical: 7, borderRadius: S.radiusFull, backgroundColor: C.mint, marginBottom: S.gapMd },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.jade },
  statusText: { color: C.jade, fontFamily: F.semibold, fontSize: S.xxs },
  card: { borderRadius: S.radiusMd, padding: S.gapMd, backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, flexDirection: 'row', gap: S.gapSm, marginBottom: S.gapSm },
  pressed: { opacity: 0.94 },
  iconWrap: { width: 43, height: 43, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  time: { color: C.muted, fontFamily: F.semibold, fontSize: 8, letterSpacing: 1 },
  unread: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.gold },
  cardTitle: { color: C.ink, fontFamily: F.semibold, fontSize: S.sm, marginTop: 8 },
  body: { color: C.secondary, fontFamily: F.body, fontSize: S.xs, lineHeight: 19, marginTop: 5 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: S.gapMd },
  footerText: { color: C.secondary, fontFamily: F.medium, fontSize: S.xs },
});
