import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS as C, FONTS as F, SIZES as S } from '../../theme';

export default function FormField({ label, value, onChangeText, placeholder, icon, keyboardType = 'default', autoCapitalize = 'sentences', secure = false, error, hint, maxLength, autoFocus = false }) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const borderColor = error ? C.error : focused ? C.jade : C.line;
  return (
    <View style={styles.group}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.field, { borderColor }, focused && styles.fieldFocused]}>
        {icon && <Ionicons name={icon} size={18} color={focused ? C.jade : C.muted} />}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={C.muted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          secureTextEntry={secure && !visible}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={maxLength}
          autoFocus={autoFocus}
          selectionColor={C.jade}
          style={styles.input}
        />
        {secure && <Pressable accessibilityRole="button" accessibilityLabel={visible ? 'Hide password' : 'Show password'} onPress={() => setVisible((v) => !v)} hitSlop={10}>
          <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={19} color={C.secondary} />
        </Pressable>}
        {!secure && error && <Ionicons name="alert-circle-outline" size={18} color={C.error} />}
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
  input: { flex: 1, color: C.ink, fontFamily: F.body, fontSize: S.md, paddingVertical: S.gapSm },
  error: { color: C.error, fontFamily: F.medium, fontSize: S.xs, marginTop: S.gapXs },
  hint: { color: C.muted, fontFamily: F.body, fontSize: S.xs, marginTop: S.gapXs },
});
