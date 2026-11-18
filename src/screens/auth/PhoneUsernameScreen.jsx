import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { colors, spacing } from '../../theme';
import { ScreenShell } from '../../components/ScreenShell';
import { KambaButton } from '../../components/KambaButton';
import { KambaInput } from '../../components/KambaInput';
import { authAPI } from '../../utils/api';
import { storage } from '../../utils/storage';
import { validateUsername } from '../../utils/username';

export const PhoneUsernameScreen = ({ navigation, route }) => {
  const [username, setUsername] = useState(route?.params?.username || '');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleComplete = async () => {
    const validation = validateUsername(username);
    if (!validation.valid) {
      setErrorMessage(validation.error);
      return;
    }

    setErrorMessage(null);
    setLoading(true);
    try {
      const response = await authAPI.setUsername({ username: `@${validation.cleaned}` });
      const user = response.data?.result;
      if (!response.data?.success || !user?.id) {
        throw new Error(response.data?.message || 'Could not complete your account.');
      }
      await storage.setUsername(user.username || validation.cleaned);
      await storage.setUserData(user);
      const rootNavigation = navigation.getParent?.()?.getParent?.();
      if (rootNavigation?.reset) {
        rootNavigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } else {
        navigation.navigate('Main');
      }
    } catch (error) {
      setErrorMessage(
        error.response?.status === 401
          ? 'Your number is verified, but the backend has not signed you in yet. The account service must create a session after phone verification before username setup can finish.'
          : error.response?.data?.message ||
            'Could not complete your account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell scrollable padded bg={colors.ink}>
      <View style={{ gap: spacing.lg }}>
        <View style={{ gap: spacing.sm }}>
          <Text style={{ color: colors.textPrimary, fontSize: 28, fontWeight: '700' }}>
            Choose your username
          </Text>
          <Text style={{ color: colors.textSecondary, lineHeight: 22 }}>
            Your public handle will appear with an @ prefix. Use 3–16 characters.
          </Text>
        </View>
        <KambaInput
          label="Username"
          placeholder="@yourname"
          value={username}
          onChangeText={(value) => {
            setUsername(value.replace(/^@/, '').slice(0, 16));
            setErrorMessage(null);
          }}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={16}
        />
        {errorMessage ? (
          <Text accessibilityRole="alert" style={{ color: colors.error }}>{errorMessage}</Text>
        ) : null}
        <KambaButton
          label="Complete account"
          fullWidth
          loading={loading}
          onPress={handleComplete}
        />
      </View>
    </ScreenShell>
  );
};

export default PhoneUsernameScreen;
