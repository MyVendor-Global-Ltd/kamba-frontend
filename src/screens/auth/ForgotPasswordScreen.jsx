import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeft, Mail } from 'lucide-react-native';
import { colors, spacing } from '../../theme';
import { ScreenShell } from '../../components/ScreenShell';
import { KambaButton } from '../../components/KambaButton';
import { KambaInput } from '../../components/KambaInput';
import { authAPI } from '../../utils/api';

export const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);

  const sendCode = async () => {
    setErrorMessage(null);
    setInfoMessage(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.forgotPassword({ email: email.trim() });
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Could not request a reset code.');
      }
      setCodeSent(true);
      setInfoMessage('If an account exists for this email, a reset code has been sent.');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Could not request a reset code.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setErrorMessage(null);
    if (!/^\d{6}$/.test(otpCode)) {
      setErrorMessage('Enter the 6-digit code from your email.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage('Your new password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('The passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.resetPassword({
        email: email.trim(),
        otp_code: otpCode,
        new_password: newPassword,
      });
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Could not reset your password.');
      }
      setComplete(true);
      setInfoMessage('Password updated. You can now sign in with your new password.');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Could not reset your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell scrollable padded bg={colors.ink}>
      <View style={{ gap: spacing.lg }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Back to sign in"
          style={{ alignSelf: 'flex-start', paddingVertical: spacing.sm }}
        >
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={{ gap: spacing.sm }}>
          <Text style={{ color: colors.textPrimary, fontSize: 28, fontWeight: '700' }}>
            {complete ? 'Password reset' : 'Forgot password?'}
          </Text>
          <Text style={{ color: colors.textSecondary, lineHeight: 22 }}>
            {complete
              ? 'Your account is ready to use again.'
              : 'We’ll email you a one-time code to reset your Kamba password.'}
          </Text>
        </View>

        {!complete ? (
          <View style={{ gap: spacing.md }}>
            <KambaInput
              label="Email address"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftElement={<Mail size={18} color={colors.textTertiary} />}
              editable={!codeSent}
            />
            {codeSent ? (
              <>
                <KambaInput
                  label="Reset code"
                  placeholder="6-digit code"
                  value={otpCode}
                  onChangeText={(value) => setOtpCode(value.replace(/\D/g, '').slice(0, 6))}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <KambaInput
                  label="New password"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
                <KambaInput
                  label="Confirm new password"
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </>
            ) : null}
          </View>
        ) : null}

        {errorMessage ? (
          <Text accessibilityRole="alert" style={{ color: colors.error }}>{errorMessage}</Text>
        ) : null}
        {infoMessage ? (
          <Text style={{ color: colors.textSecondary }}>{infoMessage}</Text>
        ) : null}

        {complete ? (
          <KambaButton label="Back to sign in" fullWidth onPress={() => navigation.goBack()} />
        ) : codeSent ? (
          <>
            <KambaButton label="Reset password" fullWidth loading={loading} onPress={resetPassword} />
            <KambaButton label="Send another code" variant="secondary" fullWidth loading={loading} onPress={sendCode} />
          </>
        ) : (
          <KambaButton label="Send reset code" fullWidth loading={loading} onPress={sendCode} />
        )}
      </View>
    </ScreenShell>
  );
};

export default ForgotPasswordScreen;
