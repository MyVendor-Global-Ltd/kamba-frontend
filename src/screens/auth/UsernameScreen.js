import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LuxuryButton from '../../components/common/LuxuryButton';
import { COLORS as C, FONTS as F, SIZES as S } from '../../theme';

export default function UsernameScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const clean = username.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 24);
  const valid = useMemo(() => clean.length >= 3 && /^[a-zA-Z0-9_]+$/.test(clean), [clean]);
  const validation = !clean ? 'Letters, numbers and underscores make a good username.' : clean.length < 3 ? 'Use at least 3 characters.' : valid ? 'Format looks good; live availability is not connected.' : 'Use only letters, numbers and underscores.';
  const submit = () => Alert.alert('Username setup is not connected', 'Your username was not saved. Connect the account service to check availability and save it.');
  const skip = () => Alert.alert('Setup is waiting for the backend', 'A temporary username cannot be created safely until account services are connected.');
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.brand}><Text style={styles.wordmark}>kamba</Text><View style={styles.brandDot}/></View>
        <View style={styles.main}>
          <View style={styles.icon}><Ionicons name="person-outline" size={20} color={C.jade}/></View>
          <Text style={styles.eyebrow}>ONE LAST PERSONAL TOUCH</Text>
          <Text style={styles.title}>What should people{ '\n' }call you?</Text>
          <Text style={styles.subtitle}>This is the name buyers and sellers will see on Kamba.</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your username</Text>
            <View style={[styles.inputWrap, valid && styles.inputValid]}><Text style={styles.at}>@</Text><TextInput value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false} autoFocus maxLength={24} placeholder="choose_a_name" placeholderTextColor={C.muted} selectionColor={C.jade} style={styles.input}/><Text style={styles.count}>{clean.length}/24</Text></View>
            <View style={styles.hintRow}><Ionicons name={valid ? 'checkmark-circle-outline' : 'information-circle-outline'} size={15} color={valid ? C.jade : C.muted}/><Text style={[styles.hint, valid && styles.hintValid]}>{validation}</Text></View>
          </View>
          <View style={styles.note}><Ionicons name="cloud-offline-outline" size={16} color={C.secondary}/><Text style={styles.noteText}>Username availability needs the Kamba account API. This preview does not claim or save names.</Text></View>
          <View style={styles.action}><LuxuryButton label="This is me" onPress={submit} icon="arrow-forward" disabled={!valid}/></View>
          <Pressable onPress={skip} style={styles.skip}><Text style={styles.skipText}>Skip for now</Text></Pressable>
        </View>
        <Text style={styles.footer}>YOUR NAME CAN BE UPDATED LATER</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },
  content: { flex: 1, paddingHorizontal: S.page, paddingTop: S.gapMd, paddingBottom: S.gapMd },
  brand: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center' },
  wordmark: { color: C.forest, fontFamily: F.displayBold, fontSize: S.lg, letterSpacing: -0.7 },
  brandDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.gold, alignSelf: 'flex-start', marginTop: 4, marginLeft: 2 },
  main: { flex: 1, justifyContent: 'center' },
  icon: { width: 42, height: 42, borderRadius: 15, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center', marginBottom: S.gapMd },
  eyebrow: { color: C.jade, fontFamily: F.semibold, fontSize: S.xxs, letterSpacing: 1.3 },
  title: { color: C.forestDeep, fontFamily: F.display, fontSize: S.xxl, lineHeight: 35, marginTop: S.gapSm },
  subtitle: { color: C.secondary, fontFamily: F.body, fontSize: S.sm, lineHeight: 21, marginTop: S.gapSm },
  inputGroup: { marginTop: S.gapXl },
  label: { color: C.ink, fontFamily: F.medium, fontSize: S.sm, marginBottom: S.gapXs },
  inputWrap: { height: S.inputHeight, borderRadius: S.radiusMd, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper, paddingHorizontal: S.gapMd, flexDirection: 'row', alignItems: 'center', gap: S.gapSm },
  inputValid: { borderColor: C.jade },
  at: { color: C.jade, fontFamily: F.semibold, fontSize: S.md },
  input: { flex: 1, color: C.ink, fontFamily: F.body, fontSize: S.md, paddingVertical: S.gapSm },
  count: { color: C.muted, fontFamily: F.medium, fontSize: S.xs },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: S.gapSm },
  hint: { flex: 1, color: C.muted, fontFamily: F.body, fontSize: S.xxs, lineHeight: 16 },
  hintValid: { color: C.jade },
  note: { flexDirection: 'row', gap: S.gapSm, alignItems: 'center', backgroundColor: C.sand, borderRadius: S.radiusSm, padding: S.gapSm, marginTop: S.gapLg },
  noteText: { flex: 1, color: C.secondary, fontFamily: F.body, fontSize: S.xxs, lineHeight: 16 },
  action: { marginTop: S.gapLg },
  skip: { alignSelf: 'center', padding: S.gapMd, marginTop: S.gapXs },
  skipText: { color: C.secondary, fontFamily: F.medium, fontSize: S.xs },
  footer: { color: C.muted, fontFamily: F.semibold, fontSize: S.xxs, letterSpacing: 1, textAlign: 'center' },
});
