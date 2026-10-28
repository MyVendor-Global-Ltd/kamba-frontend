import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KambaInput } from './KambaInput';
import { colors, typography, spacing, radius } from '../theme';

export const KambaPhoneInput = ({
  label = 'Phone number',
  placeholder = 'XXXXXXXXXX',
  value,
  onChangeText,
  error,
  hint,
  editable = true,
  autoFocus = false,
  style,
  containerStyle,
  ...inputProps
}) => {
  const [localValue, setLocalValue] = useState(value || '');

  const handleChange = useCallback((text) => {
    const digitsOnly = text.replace(/\D/g, '').slice(0, 10);
    setLocalValue(digitsOnly);
    onChangeText?.(digitsOnly);
  }, [onChangeText]);

  const formattedValue = localValue.length > 0
    ? localValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
    : '';

  const displayValue = localValue;

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    prefixWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.coralDim,
      borderTopLeftRadius: radius.lg,
      borderBottomLeftRadius: radius.lg,
      borderWidth: 1.5,
      borderColor: 'rgba(255,107,71,0.4)',
      borderRightWidth: 0,
      height: 56,
      paddingHorizontal: spacing.md,
      gap: spacing.xs,
    },
    prefixText: {
      fontFamily: typography.fontFamilies.bodySemiBold,
      fontSize: typography.scale.bodyMedium.fontSize,
      color: colors.coral,
    },
    flag: {
      fontSize: 20,
    },
  });

  return (
    <View style={[styles.container, containerStyle, style]}>
      <View style={styles.prefixWrapper}>
        <Text style={styles.flag}>🇳🇬</Text>
        <Text style={styles.prefixText}>+234</Text>
      </View>
      <KambaInput
        label={label}
        placeholder={placeholder}
        value={displayValue}
        onChangeText={handleChange}
        error={error}
        hint={hint}
        editable={editable}
        autoFocus={autoFocus}
        maxLength={10}
        keyboardType="phone-pad"
        autoCapitalize="none"
        autoCorrect={false}
        containerStyle={{
          flex: 1,
          marginLeft: 0,
        }}
        inputStyle={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
        {...inputProps}
      />
    </View>
  );
};

export default KambaPhoneInput;
