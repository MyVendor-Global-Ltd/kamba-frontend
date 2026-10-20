import React, { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS as C, FONTS as F, SIZES as S } from '../../theme';

export default function LuxuryButton({ label, onPress, icon = 'arrow-forward', variant = 'primary', fullWidth = true, disabled = false }) {
  const [scale] = useState(() => new Animated.Value(1));
  const isOutline = variant === 'outline';
  const animate = (toValue) => Animated.spring(scale, { toValue, useNativeDriver: true, speed: 28, bounciness: 4 }).start();
  return (
    <Animated.View style={[styles.wrap, !fullWidth && styles.wrapAuto, { transform: [{ scale }] }]}>
      <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPressIn={() => animate(0.975)} onPressOut={() => animate(1)} onPress={onPress} style={styles.pressable}>
        {isOutline ? (
          <View style={[styles.button, styles.outline, disabled && styles.disabled]}>
            <Text style={styles.outlineText}>{label}</Text>
            {icon && <Ionicons name={icon} size={17} color={C.forest} />}
          </View>
        ) : (
          <LinearGradient colors={disabled ? [C.muted, C.muted] : [C.forest, C.jade]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.button, disabled && styles.disabled]}>
            <Text style={styles.primaryText}>{label}</Text>
            {icon && <View style={styles.iconBubble}><Ionicons name={icon} size={15} color={C.forestDeep} /></View>}
          </LinearGradient>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  wrapAuto: { width: 'auto', alignSelf: 'flex-start' },
  pressable: { borderRadius: S.radiusFull, overflow: 'hidden' },
  button: { minHeight: S.buttonHeight, borderRadius: S.radiusFull, paddingHorizontal: S.gapLg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: S.gapMd },
  outline: { borderWidth: 1, borderColor: C.line, backgroundColor: C.paper },
  primaryText: { fontFamily: F.semibold, color: C.paper, fontSize: S.md, letterSpacing: 0.1 },
  outlineText: { fontFamily: F.semibold, color: C.forest, fontSize: S.md },
  iconBubble: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.goldPale, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.55 },
});
