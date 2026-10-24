import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors, typography, spacing, radius, animation } from '../theme';
import { Check, X, Loader2 } from 'lucide-react-native';

export const UsernameAvailability = ({
  status = 'idle',
  username = '',
  style,
}) => {
  const anim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (status === 'checking') {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          anim.setValue(0);
          Animated.loop(
            Animated.timing(anim, {
              toValue: 1,
              duration: 800,
              easing: Easing.linear,
              useNativeDriver: true,
            })
          ).start();
        }
      });
      slideAnim.setValue(-20);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: animation.duration.fast,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else if (status === 'available') {
      anim.setValue(0);
      slideAnim.setValue(-20);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: animation.duration.base,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 1,
          duration: animation.duration.base,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]).start();
    } else if (status === 'taken') {
      anim.setValue(0);
      slideAnim.setValue(-20);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: animation.duration.fast,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 1,
          duration: animation.duration.fast,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      anim.setValue(0);
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: animation.duration.fast,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [status]);

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateX = slideAnim;

  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      height: 24,
      marginTop: spacing.xs,
    },
    text: {
      fontFamily: typography.fontFamilies.body,
      fontSize: typography.sizes.xs,
    },
    checkingText: {
      color: colors.coral,
    },
    availableText: {
      color: colors.success,
    },
    takenText: {
      color: colors.error,
    },
    spinner: {
      transform: [{ rotate }],
    },
    checkIcon: {
      transform: [{ scale }],
    },
    xIcon: {
      transform: [{ scale }],
    },
  });

  if (status === 'idle') {
    return null;
  }

  if (status === 'checking') {
    return (
      <Animated.View style={[styles.container, { opacity }, style]}>
        <Animated.View style={styles.spinner}>
          <Loader2 size={16} color={colors.coral} strokeWidth={2} />
        </Animated.View>
        <Text style={[styles.text, styles.checkingText]}>Checking availability...</Text>
      </Animated.View>
    );
  }

  if (status === 'available') {
    return (
      <Animated.View
        style={[
          styles.container,
          { opacity, transform: [{ translateX }] },
          style,
        ]}
      >
        <Animated.View style={styles.checkIcon}>
          <Check size={16} color={colors.success} strokeWidth={2.5} />
        </Animated.View>
        <Text style={[styles.text, styles.availableText]}>@{username} is yours</Text>
      </Animated.View>
    );
  }

  if (status === 'taken') {
    return (
      <Animated.View
        style={[
          styles.container,
          { opacity, transform: [{ translateX }] },
          style,
        ]}
      >
        <Animated.View style={styles.xIcon}>
          <X size={16} color={colors.error} strokeWidth={2.5} />
        </Animated.View>
        <Text style={[styles.text, styles.takenText]}>That one's taken</Text>
      </Animated.View>
    );
  }

  return null;
};

export default UsernameAvailability;