import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS as C, FONTS as F, SIZES as S } from '../../theme';

const DIGITS = 6;

export default function OTPInput({ value = '', onChangeText, onComplete, autoFocus = false, disabled = false, error }) {
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const code = String(value).replace(/\D/g, '').slice(0, DIGITS);
  const update = (input) => {
    const next = input.replace(/\D/g, '').slice(0, DIGITS);
    onChangeText?.(next);
    if (next.length === DIGITS) onComplete?.(next);
  };
  return (
    <View style={styles.wrap}>
      <Pressable accessibilityRole="button" accessibilityLabel="Enter six-digit verification code" onPress={() => inputRef.current?.focus()} style={styles.digitsRow}>
        {Array.from({ length: DIGITS }, (_, index) => {
          const active = focused && index === Math.min(code.length, DIGITS - 1);
          return <View key={index} style={[styles.digitBox, active && styles.activeBox, !!error && styles.errorBox, disabled && styles.disabledBox]}><Text style={styles.digit}>{code[index] || ''}</Text>{active && !code[index] && <View style={styles.cursor}/>}</View>;
        })}
        <TextInput ref={inputRef} accessibilityLabel="Six-digit one-time code" value={code} onChangeText={update} keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="sms-otp" maxLength={DIGITS} editable={!disabled} autoFocus={autoFocus} selectionColor="transparent" caretHidden style={styles.hiddenInput} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      </Pressable>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.helper}>{disabled ? 'Code entry is unavailable in preview mode.' : 'Enter the 6-digit code sent to your phone.'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  digitsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: S.gapXs, position: 'relative' },
  digitBox: { width: 46, height: 54, borderRadius: S.radiusSm, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  activeBox: { borderWidth: 2, borderColor: C.jade },
  errorBox: { borderColor: C.error },
  disabledBox: { backgroundColor: C.cream },
  digit: { color: C.forest, fontFamily: F.semibold, fontSize: S.lg },
  cursor: { width: 1.5, height: 21, backgroundColor: C.jade, marginLeft: 1 },
  hiddenInput: { position: 'absolute', width: 1, height: 1, opacity: 0, left: 0, top: 0 },
  errorText: { color: C.error, fontFamily: F.medium, fontSize: S.xs, marginTop: S.gapXs },
  helper: { color: C.muted, fontFamily: F.body, fontSize: S.xs, textAlign: 'center', marginTop: S.gapSm },
});
