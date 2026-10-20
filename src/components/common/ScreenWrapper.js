import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS as C, SIZES as S } from '../../theme';

export default function ScreenWrapper({ children, edges = ['top', 'bottom'], style, contentContainerStyle, keyboardShouldPersistTaps = 'handled' }) {
  return (
    <SafeAreaView style={[styles.safe, style]} edges={edges}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView keyboardShouldPersistTaps={keyboardShouldPersistTaps} showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, contentContainerStyle]}>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: S.page, paddingBottom: S.gapXl },
});
