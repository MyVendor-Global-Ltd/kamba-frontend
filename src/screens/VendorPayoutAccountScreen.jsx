import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { vendorPayoutAPI } from '../utils/api';

export const VendorPayoutAccountScreen = () => {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [bankSearch, setBankSearch] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [preview, setPreview] = useState(null);
  const [savedAccount, setSavedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const filteredBanks = useMemo(() => {
    const query = bankSearch.trim().toLowerCase();
    return (query ? banks.filter((bank) => bank.name.toLowerCase().includes(query)) : banks).slice(0, 12);
  }, [banks, bankSearch]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [bankList, account] = await Promise.all([
        vendorPayoutAPI.listBanks(),
        vendorPayoutAPI.getAccount(),
      ]);
      setBanks(bankList);
      setSavedAccount(account);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Could not load bank details.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const resolveAccount = useCallback(async () => {
    if (!selectedBank || !/^\d{10}$/.test(accountNumber)) {
      setError('Choose a bank and enter a valid 10-digit account number.');
      return;
    }
    setWorking(true);
    setError('');
    setNotice('');
    setPreview(null);
    try {
      const result = await vendorPayoutAPI.resolveAccount({
        bank_code: selectedBank.code,
        account_number: accountNumber,
      });
      setPreview(result);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'The bank could not resolve this account.');
    } finally {
      setWorking(false);
    }
  }, [selectedBank, accountNumber]);

  const confirmAccount = useCallback(async () => {
    if (!preview) return;
    setWorking(true);
    setError('');
    setNotice('');
    try {
      const result = await vendorPayoutAPI.confirmAccount({
        bank_code: preview.bank_code,
        account_number: accountNumber,
        account_name: preview.resolved_account_name,
      });
      setSavedAccount(result);
      setPreview(null);
      setAccountNumber('');
      setNotice('Your payout bank account has been verified and saved.');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Could not save the verified bank account.');
    } finally {
      setWorking(false);
    }
  }, [preview, accountNumber]);

  if (loading) return <ScreenShell><ActivityIndicator size="large" color={colors.light.accent} /></ScreenShell>;

  return (
    <ScreenShell scrollable padded bg={colors.light.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Payout bank account</Text>
        <Text style={styles.copy}>Add the bank account where Kamba can send your eligible vendor payouts. Paystack verifies the account name before Kamba saves the beneficiary.</Text>

        {savedAccount ? (
          <View style={styles.savedCard}>
            <Text style={styles.savedTitle}>Verified account</Text>
            <Text style={styles.accountName}>{savedAccount.account_name}</Text>
            <Text style={styles.copy}>{savedAccount.bank_name} · ending {savedAccount.account_last4}</Text>
            <Text style={styles.verified}>Verified · {savedAccount.status}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.label}>Find your bank</Text>
          <TextInput
            value={bankSearch}
            onChangeText={(value) => { setBankSearch(value); setSelectedBank(null); setPreview(null); }}
            placeholder="Search banks"
            placeholderTextColor={colors.light.textMuted}
            style={styles.input}
          />
          {filteredBanks.map((bank) => (
            <TouchableOpacity
              key={bank.code}
              style={[styles.bankOption, selectedBank?.code === bank.code && styles.bankOptionActive]}
              onPress={() => { setSelectedBank(bank); setBankSearch(bank.name); setPreview(null); }}
            >
              <Text style={styles.bankName}>{bank.name}</Text>
              {selectedBank?.code === bank.code ? <Text style={styles.selected}>Selected</Text> : null}
            </TouchableOpacity>
          ))}
          <Text style={styles.label}>Account number</Text>
          <TextInput
            value={accountNumber}
            onChangeText={(value) => { setAccountNumber(value.replace(/\\D/g, '').slice(0, 10)); setPreview(null); }}
            keyboardType="number-pad"
            maxLength={10}
            placeholder="10-digit account number"
            placeholderTextColor={colors.light.textMuted}
            style={styles.input}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={resolveAccount} disabled={working}>
            {working && !preview ? <ActivityIndicator color={colors.light.onAccent} /> : <Text style={styles.primaryText}>Verify account name</Text>}
          </TouchableOpacity>
        </View>

        {preview ? (
          <View style={styles.card}>
            <Text style={styles.savedTitle}>Bank returned this account name</Text>
            <Text style={styles.accountName}>{preview.resolved_account_name}</Text>
            <Text style={styles.copy}>{preview.bank_name} · account ending {preview.account_number_last4}</Text>
            <Text style={styles.copy}>Check that this is the correct account before confirming. Kamba will create a Paystack transfer recipient for this verified account.</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={confirmAccount} disabled={working}>
              {working ? <ActivityIndicator color={colors.light.onAccent} /> : <Text style={styles.primaryText}>Confirm and save this account</Text>}
            </TouchableOpacity>
          </View>
        ) : null}

        {!!notice && <Text style={styles.notice}>{notice}</Text>}
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.md, paddingBottom: spacing.xxxl },
  title: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.display, fontSize: typography.scale.displaySmall.fontSize },
  copy: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, lineHeight: typography.scale.bodySmall.lineHeight },
  card: { gap: spacing.sm, padding: spacing.lg, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.light.border, backgroundColor: colors.light.surface },
  savedCard: { gap: spacing.xs, padding: spacing.lg, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.light.success, backgroundColor: colors.light.surface },
  savedTitle: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineSmall.fontSize },
  accountName: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelLarge.fontSize },
  verified: { color: colors.light.success, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  label: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize, marginTop: spacing.xs },
  input: { minHeight: 48, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.md, paddingHorizontal: spacing.md, color: colors.light.textPrimary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize },
  bankOption: { padding: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.light.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bankOptionActive: { borderColor: colors.light.accent, backgroundColor: colors.light.accentSoft },
  bankName: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize },
  selected: { color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  primaryButton: { minHeight: 50, borderRadius: radius.lg, backgroundColor: colors.light.accent, alignItems: 'center', justifyContent: 'center', padding: spacing.md, marginTop: spacing.sm },
  primaryText: { color: colors.light.onAccent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
  notice: { color: colors.light.success, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.bodySmall.fontSize },
  error: { color: colors.light.error, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize },
});

export default VendorPayoutAccountScreen;
