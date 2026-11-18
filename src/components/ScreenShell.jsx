import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors, spacing } from '../theme';

export const ScreenShell = ({
  children,
  scrollable = true,
  padded = true,
  bg = colors.light.background,
  style,
  contentContainerStyle,
  keyboardShouldPersistTaps = 'handled',
  showsVerticalScrollIndicator = false,
  extraScrollHeight = 0,
  refreshControl,
}) => {
  const content = (
    <View style={[styles.container, { backgroundColor: bg }, style]}>
      <StatusBar barStyle="dark-content" backgroundColor={bg} translucent={false} />
      {scrollable ? (
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          refreshControl={refreshControl}
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

  return <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>{content}</SafeAreaView>;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.background,
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