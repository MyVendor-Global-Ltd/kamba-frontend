import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../../components/common/EmptyState';
import LuxuryButton from '../../components/common/LuxuryButton';
import { COLORS as C, FONTS as F, SIZES as S } from '../../theme';

export default function OrdersScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>YOUR KAMBA</Text><Text style={styles.title}>Orders</Text>
        <View style={styles.intro}><Text style={styles.introTitle}>Everything you love, in one place.</Text><Text style={styles.introCopy}>Track purchases from local shops and makers once checkout is connected.</Text></View>
        <EmptyState icon="bag-handle-outline" title="Your story starts here" message="No orders to show yet. When you find something you love, it will be waiting here." action={<View style={styles.action}><LuxuryButton label="Discover local finds" onPress={() => navigation.navigate('Search')} icon="arrow-forward" /></View>} />
        <View style={styles.note}><Text style={styles.noteTitle}>Preview mode</Text><Text style={styles.noteCopy}>Orders and payments are not connected to a live backend yet.</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },
  content: { paddingHorizontal: S.page, paddingBottom: S.gapXl },
  kicker: { color: C.jade, fontFamily: F.semibold, fontSize: S.xxs, letterSpacing: 1.35, marginTop: S.gapMd },
  title: { color: C.forestDeep, fontFamily: F.display, fontSize: S.display, marginTop: 4 },
  intro: { padding: S.gapMd, backgroundColor: C.mint, borderRadius: S.radiusMd, marginTop: S.gapLg },
  introTitle: { color: C.forest, fontFamily: F.semibold, fontSize: S.sm },
  introCopy: { color: C.secondary, fontFamily: F.body, fontSize: S.xs, lineHeight: 19, marginTop: 5 },
  action: { width: 235, marginTop: S.gapLg },
  note: { padding: S.gapMd, borderRadius: S.radiusSm, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper },
  noteTitle: { color: C.ink, fontFamily: F.semibold, fontSize: S.xs },
  noteCopy: { color: C.secondary, fontFamily: F.body, fontSize: S.xxs, lineHeight: 17, marginTop: 4 },
});
