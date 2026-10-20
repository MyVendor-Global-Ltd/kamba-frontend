import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrandMark from '../../components/common/BrandMark';
import { COLORS as C, FONTS as F, SIZES as S } from '../../theme';

export default function SplashScreen({ navigation }) {
  const [opacity] = useState(() => new Animated.Value(0));
  const [lift] = useState(() => new Animated.Value(16));
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(lift, { toValue: 0, useNativeDriver: true, speed: 15, bounciness: 4 }),
    ]).start();
    const timer = setTimeout(() => navigation.replace('Welcome'), 1150);
    return () => clearTimeout(timer);
  }, [lift, navigation, opacity]);
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={[C.forestDeep, C.forest, C.jade]} style={StyleSheet.absoluteFill} />
      <View style={styles.orbOne} /><View style={styles.orbTwo} />
      <Animated.View style={[styles.content, { opacity, transform: [{ translateY: lift }] }]}>
        <BrandMark light />
        <Text style={styles.line}>Made around you.</Text>
      </Animated.View>
      <Text style={styles.footer}>UMUAHIA · NIGERIA</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.forestDeep, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center' },
  line: { color: C.goldPale, fontFamily: F.medium, fontSize: S.sm, letterSpacing: 1.8, marginTop: S.gapLg },
  orbOne: { position: 'absolute', width: 290, height: 290, borderRadius: 145, borderWidth: 1, borderColor: 'rgba(232,216,183,0.13)', top: '19%', right: -160 },
  orbTwo: { position: 'absolute', width: 200, height: 200, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(232,216,183,0.1)', bottom: '16%', left: -110 },
  footer: { position: 'absolute', bottom: 30, color: 'rgba(232,216,183,0.58)', fontFamily: F.semibold, fontSize: S.xxs, letterSpacing: 2 },
});
