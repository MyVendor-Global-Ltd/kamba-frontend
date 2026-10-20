import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS as C, FONTS as F, SIZES as S } from '../../theme';

export default function PhoneInput({ label = 'Mobile number', value, onChangeText, error, hint, editable = true, autoFocus = false }) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? C.error : focused ? C.jade : C.line;
  const update = (input) => onChangeText?.(input.replace(/\D/g, '').slice(0, 10));
  return (
    <View style={styles.group}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.field, { borderColor }, focused && styles.fieldFocused]}>
        <View style={styles.country}><View style={styles.flag}><View style={styles.flagGreen}/><View style={styles.flagWhite}/><View style={styles.flagGreen}/></View><Text style={styles.countryText}>+234</Text><View style={styles.divider}/></View>
        <TextInput accessibilityLabel="Nigerian mobile number" value={value} onChangeText={update} editable={editable} autoFocus={autoFocus} keyboardType="phone-pad" returnKeyType="done" maxLength={10} placeholder="801 234 5678" placeholderTextColor={C.muted} autoComplete="tel-national" textContentType="telephoneNumber" selectionColor={C.jade} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={styles.input}/>
        {error ? <Ionicons name="alert-circle-outline" size={18} color={C.error}/> : null}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
      {!!hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: S.gapMd },
  label: { color: C.ink, fontFamily: F.medium, fontSize: S.sm, marginBottom: S.gapXs },
  field: { minHeight: S.inputHeight, borderRadius: S.radiusMd, borderWidth: 1, backgroundColor: C.paper, paddingHorizontal: S.gapMd, flexDirection: 'row', alignItems: 'center', gap: S.gapSm },
  fieldFocused: { backgroundColor: C.white, shadowColor: C.jade, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 },
  country: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  flag: { width: 21, height: 14, borderRadius: 3, overflow: 'hidden', flexDirection: 'row', borderWidth: 0.5, borderColor: C.line },
  flagGreen: { flex: 1, backgroundColor: C.jade },
  flagWhite: { flex: 1, backgroundColor: C.white },
  countryText: { color: C.ink, fontFamily: F.semibold, fontSize: S.xs },
  divider: { height: 23, width: 1, backgroundColor: C.line, marginLeft: 3 },
  input: { flex: 1, color: C.ink, fontFamily: F.body, fontSize: S.md, paddingVertical: S.gapSm },
  error: { color: C.error, fontFamily: F.medium, fontSize: S.xs, marginTop: S.gapXs },
  hint: { color: C.muted, fontFamily: F.body, fontSize: S.xs, marginTop: S.gapXs },
});
