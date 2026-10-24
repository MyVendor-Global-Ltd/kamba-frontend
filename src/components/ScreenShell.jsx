import React from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors, spacing } from '../theme';

export const ScreenShell = ({
  children,
  scrollable = true,
  padded = true,
  bg = colors.ink,
  style,
  contentContainerStyle,
  keyboardShouldPersistTaps = 'handled',
  showsVerticalScrollIndicator = false,
  extraScrollHeight = 0,
}) => {
  const content = (
    <View style={[styles.container, { backgroundColor: bg }, style]}>
      <StatusBar barStyle="light-content" backgroundColor={bg} translucent={false} />
      {scrollable ? (
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          contentContainerStyle={[
            styles.scrollContent,
            padded && styles.padded,
            { paddingBottom: spacing.xxxl + extraScrollHeight },
            contentContainerStyle,
          ]}
          extraScrollHeight={extraScrollHeight}
        >
          {children}
        </KeyboardAwareScrollView>
      ) : (
        <View style={[styles.scrollContent, padded && styles.padded, contentContainerStyle]}>
          {children}
        </View>
      )}
    </View>
  );

  return <SafeAreaView style={styles.safeArea}>{content}</SafeAreaView>;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  padded: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
  },
});

export default ScreenShell;