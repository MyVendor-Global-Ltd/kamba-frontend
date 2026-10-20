import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BrandMark from '../../components/common/BrandMark';
import FormField from '../../components/common/FormField';
import LuxuryButton from '../../components/common/LuxuryButton';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { COLORS as C, FONTS as F, SIZES as S } from '../../theme';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const submit = () => {
    if (!EMAIL.test(email.trim())) { setError('Enter a valid email address.'); return; }
    setError('');
    Alert.alert('Password recovery is not connected', 'No reset email was sent. Connect the authentication service to enable account recovery.');
  };
  return (
    <ScreenWrapper>
      <View style={styles.header}><Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => navigation.goBack()} style={styles.back}><Ionicons name="arrow-back" size={19} color={C.forest}/></Pressable><BrandMark size="compact"/></View>
      <View style={styles.main}>
        <View style={styles.icon}><Ionicons name="key-outline" size={20} color={C.jade}/></View>
        <Text style={styles.eyebrow}>ACCOUNT RECOVERY</Text>
        <Text style={styles.title}>A fresh start{ '\n' }for your password.</Text>
        <Text style={styles.subtitle}>Enter the email address linked to your Kamba account. If recovery is available, we’ll send instructions there.</Text>
        <View style={styles.form}><FormField label="Email address" icon="mail-outline" placeholder="you@example.com" value={email} onChangeText={(value) => { setEmail(value); setError(''); }} error={error} keyboardType="email-address" autoCapitalize="none" autoFocus/><LuxuryButton label="Send recovery instructions" onPress={submit} icon="arrow-forward"/></View>
        <View style={styles.preview}><Ionicons name="information-circle-outline" size={16} color={C.secondary}/><Text style={styles.previewText}>Preview only. No account lookup or email request is made.</Text></View>
      </View>
      <Pressable onPress={() => navigation.navigate('Login')} style={styles.return}><Text style={styles.returnText}>Remembered it?</Text><Text style={styles.returnAction}> Sign in</Text></Pressable>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { minHeight: 48, marginTop: S.gapSm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  back: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center' },
  main: { flex: 1, justifyContent: 'center', paddingBottom: S.gapXl },
  icon: { width: 42, height: 42, borderRadius: 15, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center', marginBottom: S.gapMd },
  eyebrow: { color: C.jade, fontFamily: F.semibold, fontSize: S.xxs, letterSpacing: 1.3 },
  title: { color: C.forestDeep, fontFamily: F.display, fontSize: S.xxl, lineHeight: 35, marginTop: S.gapSm },
  subtitle: { color: C.secondary, fontFamily: F.body, fontSize: S.sm, lineHeight: 21, marginTop: S.gapSm },
  form: { marginTop: S.gapXl },
  preview: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: C.sand, padding: S.gapSm, borderRadius: S.radiusSm, marginTop: S.gapLg },
  previewText: { flex: 1, color: C.secondary, fontFamily: F.body, fontSize: S.xxs, lineHeight: 16 },
  return: { flexDirection: 'row', justifyContent: 'center', paddingVertical: S.gapMd },
  returnText: { color: C.secondary, fontFamily: F.body, fontSize: S.xs },
  returnAction: { color: C.jade, fontFamily: F.semibold, fontSize: S.xs },
});
