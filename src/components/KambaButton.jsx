import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius, shadows, animation } from '../theme';
import * as Haptics from 'expo-haptics';

const Spinner = ({ size = 20, color = '#fff' }) => {
  const spin = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    spin.setValue(0);
    Animated.timing(spin, {
      toValue: 1,
      duration: 800,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        spin.setValue(0);
        Animated.loop(
          Animated.timing(spin, {
            toValue: 1,
            duration: 800,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ).start();
      }
    });
  }, []);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2.5,
        borderColor: color,
        borderRightColor: 'transparent',
        borderTopColor: 'transparent',
        transform: [{ rotate }],
      }}
    />
  );
};

export const KambaButton = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
}) => {
  const pressAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(pressAnim, {
      toValue: 0.96,
      ...animation.spring,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.spring(pressAnim, {
      toValue: 1.03,
      ...animation.springBouncy,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(pressAnim, {
        toValue: 1,
        ...animation.spring,
        useNativeDriver: true,
      }).start();
    });
  };

  const handlePress = () => {
    if (disabled || loading) return;
    onPress?.();
  };

  const sizes = {
    sm: { height: 44, fontSize: typography.sizes.sm, padding: spacing.lg },
    md: { height: 54, fontSize: typography.sizes.base, padding: spacing.xl },
    lg: { height: 60, fontSize: typography.sizes.lg, padding: spacing.xxl },
  };

  const { height, fontSize, padding } = sizes[size];

  const styles = StyleSheet.create({
    container: {
      borderRadius: radius.full,
      height,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.sm,
      width: fullWidth ? '100%' : 'auto',
      paddingHorizontal: padding,
    },
    primary: {
      ...shadows.coral,
    },
    secondary: {
      backgroundColor: colors.inkRaised,
      borderWidth: 1,
      borderColor: colors.inkBorder,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    outlineCoral: {
      backgroundColor: colors.coralDim,
      borderWidth: 1.5,
      borderColor: 'rgba(255,107,71,0.5)',
    },
    textPrimary: {
      color: '#fff',
      fontFamily: typography.fontFamilies.bodySemiBold,
      fontSize,
    },
    textSecondary: {
      color: colors.textPrimary,
      fontFamily: typography.fontFamilies.bodySemiBold,
      fontSize,
    },
    textGhost: {
      color: colors.coral,
      fontFamily: typography.fontFamilies.bodySemiBold,
      fontSize,
    },
    textOutlineCoral: {
      color: colors.coral,
      fontFamily: typography.fontFamilies.bodySemiBold,
      fontSize,
    },
    disabled: {
      opacity: 0.35,
    },
    loadingContainer: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    ghost: styles.ghost,
    outlineCoral: styles.outlineCoral,
  };

  const textStyles = {
    primary: styles.textPrimary,
    secondary: styles.textSecondary,
    ghost: styles.textGhost,
    outlineCoral: styles.textOutlineCoral,
  };

  const bgColors = {
    primary: null, // handled by LinearGradient
    secondary: colors.inkRaised,
    ghost: 'transparent',
    outlineCoral: colors.coralDim,
  };

  const Content = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
      {loading ? <Spinner size={18} /> : icon}
      {!loading && <Text style={textStyles[variant]}>{label}</Text>}
    </View>
  );

  if (variant === 'primary') {
    return (
      <Animated.View
        style={{
          transform: [{ scale: pressAnim }],
          ...shadows.coral,
        }}
      >
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          disabled={disabled || loading}
          activeOpacity={1}
        >
          <LinearGradient
            colors={['#FF6B47', '#E8512E']}
            style={[
              styles.container,
              variantStyles[variant],
              disabled && styles.disabled,
              style,
            ]}
          >
            <Content />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (variant === 'ghost') {
    return (
      <Animated.View
        style={{
          transform: [{ scale: pressAnim }],
        }}
      >
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          disabled={disabled || loading}
          activeOpacity={1}
        >
          <View
            style={[
              styles.container,
              variantStyles[variant],
              disabled && styles.disabled,
              style,
            ]}
          >
            <Content />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={{
        transform: [{ scale: pressAnim }],
      }}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        <View
          style={[
            styles.container,
            variantStyles[variant],
            { backgroundColor: bgColors[variant] },
            disabled && styles.disabled,
            style,
          ]}
        >
          <Content />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default KambaButton;