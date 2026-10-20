import React, { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LuxuryButton from '../../components/common/LuxuryButton';
import { COLORS as C, FONTS as F, SIZES as S } from '../../theme';

export default function CongratulationsScreen({ navigation }) {
  const [scale] = useState(() => new Animated.Value(0.65));
  const [opacity] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 8 }),
      Animated.timing(opacity, { toValue: 1, duration: 360, useNativeDriver: true }),
    ]).start();
    return () => { scale.stopAnimation(); opacity.stopAnimation(); };
  }, [opacity, scale]);
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.brand}><Text style={styles.wordmark}>kamba</Text><View style={styles.brandDot}/></View>
        <View style={styles.center}>
          <Animated.View style={[styles.successMark, { opacity, transform: [{ scale }] }]}><Ionicons name="checkmark" size={42} color={C.white}/></Animated.View>
          <Text style={styles.eyebrow}>A NEW CHAPTER, CLOSE TO HOME</Text>
          <Text style={styles.title}>You’re in.</Text>
          <Text style={styles.body}>Welcome to Kamba. One last thing before you start meeting the people and shops around you.</Text>
          <View style={styles.action}><LuxuryButton label="Choose your name" onPress={() => navigation.replace('Username')} icon="arrow-forward" /></View>
          <Text style={styles.preview}>Design preview only · no account has been created</Text>
        </View>
        <Pressable onPress={() => navigation.replace('Welcome')} style={styles.back}><Ionicons name="arrow-back" size={16} color={C.secondary}/><Text style={styles.backText}>Back to welcome</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },
  content: { flex: 1, paddingHorizontal: S.page, paddingVertical: S.gapMd },
  brand: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: S.gapSm },
  wordmark: { color: C.forest, fontFamily: F.displayBold, fontSize: S.lg, letterSpacing: -0.7 },
  brandDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.gold, alignSelf: 'flex-start', marginTop: 4, marginLeft: 2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: S.gapXl },
  successMark: { width: 88, height: 88, borderRadius: 44, backgroundColor: C.jade, alignItems: 'center', justifyContent: 'center', marginBottom: S.gapXl },
  eyebrow: { color: C.jade, fontFamily: F.semibold, fontSize: S.xxs, letterSpacing: 1.3, textAlign: 'center' },
  title: { color: C.forestDeep, fontFamily: F.display, fontSize: S.display, marginTop: S.gapSm },
  body: { color: C.secondary, fontFamily: F.body, fontSize: S.base, lineHeight: 24, textAlign: 'center', paddingHorizontal: S.gapLg, marginTop: S.gapSm },
  action: { width: '100%', marginTop: S.gapXl },
  preview: { color: C.muted, fontFamily: F.body, fontSize: S.xxs, textAlign: 'center', marginTop: S.gapMd },
  back: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, padding: S.gapSm },
  backText: { color: C.secondary, fontFamily: F.medium, fontSize: S.xs },
});
