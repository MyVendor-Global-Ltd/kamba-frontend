import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrandMark from '../../components/common/BrandMark';
import FormField from '../../components/common/FormField';
import LuxuryButton from '../../components/common/LuxuryButton';
import { COLORS as C, FONTS as F, SIZES as S } from '../../theme';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthScreen({ navigation, route }) {
  const isRegister = route.name === 'Register';
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', referral: route.params?.referralCode || '' });
  const [errors, setErrors] = useState({});
  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => { const next = { ...current }; delete next[field]; return next; });
  };
  const title = isRegister ? 'Create your account' : 'Welcome back';
  const subtitle = isRegister ? 'A few details and your neighbourhood is yours.' : 'Your favourite local finds are just around the corner.';

  const handleSubmit = () => {
    const next = {};
    if (isRegister && form.name.trim().length < 2) next.name = 'Please enter your name.';
    if (!EMAIL.test(form.email.trim())) next.email = 'Enter a valid email address.';
    if (form.password.length < 8) next.password = 'Use at least 8 characters.';
    if (isRegister && form.confirmPassword !== form.password) next.confirmPassword = 'Your passwords do not match.';
    setErrors(next);
    if (Object.keys(next).length) return;
    Alert.alert('Secure sign-in is not connected yet', 'Your details were not sent or stored. Connect Kamba’s authentication service to enable this action.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topBar}><Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.back}><Ionicons name="arrow-back" size={19} color={C.forest} /></Pressable><BrandMark size="compact" /></View>
        <View style={styles.heading}>
          <View style={styles.accent}><Ionicons name={isRegister ? 'person-add-outline' : 'key-outline'} size={18} color={C.jade} /></View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.form}>
          {isRegister && <FormField label="Your name" icon="person-outline" placeholder="e.g. Amara Okafor" value={form.name} onChangeText={(v) => update('name', v)} error={errors.name} autoCapitalize="words" autoFocus />}
          <FormField label="Email address" icon="mail-outline" placeholder="you@example.com" value={form.email} onChangeText={(v) => update('email', v)} error={errors.email} keyboardType="email-address" autoCapitalize="none" autoFocus={!isRegister} />
          <FormField label="Password" icon="lock-closed-outline" placeholder="At least 8 characters" value={form.password} onChangeText={(v) => update('password', v)} error={errors.password} secure autoCapitalize="none" />
          {isRegister && <FormField label="Confirm password" icon="lock-closed-outline" placeholder="Enter your password again" value={form.confirmPassword} onChangeText={(v) => update('confirmPassword', v)} error={errors.confirmPassword} secure autoCapitalize="none" />}
          {!isRegister && <Pressable onPress={() => Alert.alert('Password reset', 'Password recovery will be enabled when the secure authentication service is connected.')} style={styles.forgot}><Text style={styles.forgotText}>Forgot password?</Text></Pressable>}
          {isRegister && <FormField label="Referral code (optional)" icon="ticket-outline" placeholder="If a friend invited you" value={form.referral} onChangeText={(v) => update('referral', v)} autoCapitalize="characters" />}
          <View style={styles.notice}><Ionicons name="shield-checkmark-outline" size={17} color={C.jade} /><Text style={styles.noticeText}>Your information is protected. We never display your password.</Text></View>
          <LuxuryButton label={isRegister ? 'Create account' : 'Sign in'} onPress={handleSubmit} icon={isRegister ? 'arrow-forward' : 'log-in-outline'} />
        </View>
        <View style={styles.switchRow}><Text style={styles.switchText}>{isRegister ? 'Already a member?' : 'New to Kamba?'}</Text><Pressable onPress={() => navigation.replace(isRegister ? 'Login' : 'Register')}><Text style={styles.switchAction}>{isRegister ? ' Sign in' : ' Create an account'}</Text></Pressable></View>
        <Text style={styles.legal}>Reviewed Terms of Service and Privacy Policy pages are required before live registration is enabled.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },
  content: { paddingHorizontal: S.page, paddingBottom: S.gapXl },
  topBar: { minHeight: 48, marginTop: S.gapSm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center' },
  heading: { marginTop: 35, marginBottom: 27 },
  accent: { width: 42, height: 42, borderRadius: 15, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center', marginBottom: S.gapMd },
  title: { color: C.forestDeep, fontFamily: F.display, fontSize: S.xxl, lineHeight: 36, letterSpacing: -0.6 },
  subtitle: { color: C.secondary, fontFamily: F.body, fontSize: S.sm, lineHeight: 21, marginTop: S.gapSm },
  form: { gap: 0 },
  forgot: { alignSelf: 'flex-end', marginTop: -5, marginBottom: S.gapMd, paddingVertical: S.gapXs },
  forgotText: { color: C.jade, fontFamily: F.semibold, fontSize: S.xs },
  notice: { borderRadius: S.radiusSm, padding: S.gapSm, backgroundColor: C.mint, flexDirection: 'row', alignItems: 'center', gap: S.gapSm, marginBottom: S.gapLg },
  noticeText: { flex: 1, color: C.secondary, fontFamily: F.body, fontSize: S.xs, lineHeight: 17 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: S.gapLg },
  switchText: { color: C.secondary, fontFamily: F.body, fontSize: S.xs },
  switchAction: { color: C.jade, fontFamily: F.semibold, fontSize: S.xs },
  legal: { color: C.muted, fontFamily: F.body, fontSize: S.xxs, lineHeight: 16, textAlign: 'center', marginTop: S.gapLg, paddingHorizontal: S.gapLg },
});
