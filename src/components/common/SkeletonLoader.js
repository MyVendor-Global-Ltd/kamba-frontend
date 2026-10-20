import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { COLORS as C, SIZES as S } from '../../theme';

export default function SkeletonLoader({ count = 1, height = 16, width = '100%', radius = S.radiusSm, style }) {
  const [pulse] = useState(() => new Animated.Value(0.45));
  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 0.95, duration: 750, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0.45, duration: 750, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [pulse]);
  return <View style={[styles.stack, style]}>{Array.from({ length: Math.max(1, count) }, (_, index) => <Animated.View key={index} accessibilityLabel="Loading" style={[styles.skeleton, { height, width, borderRadius: radius, opacity: pulse }]} />)}</View>;
}

const styles = StyleSheet.create({
  stack: { gap: S.gapSm },
  skeleton: { backgroundColor: C.mint },
});
