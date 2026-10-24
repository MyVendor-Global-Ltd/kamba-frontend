import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors, typography, spacing } from '../../theme';
import { KambaLogo } from '../../components/KambaLogo';
import { storage } from '../../utils/storage';

export const SplashScreen = ({ navigation }) => {
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkScale = useRef(new Animated.Value(0.5)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;
  const pulse3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const startAnimations = async () => {
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(wordmarkScale, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(wordmarkOpacity, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      }, 200);

      setTimeout(() => {
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }, 400);

      const pulse = (anim, delay) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(
              delay,
              Animated.timing(anim, {
                toValue: 0.3,
                duration: 400,
                easing: Easing.inOut(Easing.cubic),
                useNativeDriver: true,
              })
            ),
            Animated.timing(anim, {
              toValue: 1,
              duration: 400,
              easing: Easing.inOut(Easing.cubic),
              useNativeDriver: true,
            }),
          ])
        ).start();
      };
      pulse(pulse1, 0);
      pulse(pulse2, 200);
      pulse(pulse3, 400);
    };

    startAnimations();

    const timer = setTimeout(async () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(async () => {
        const token = await storage.getToken();
        const username = await storage.getUsername();

        if (token && username) {
          navigation.replace('Main');
        } else if (token && !username) {
          navigation.replace('Username');
        } else {
          navigation.replace('Auth');
        }
      });
    }, 2400);

    return () => clearTimeout(timer);
  }, [navigation]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.ink,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centerStack: {
      alignItems: 'center',
      gap: spacing.lg,
    },
    logoContainer: {
      opacity: logoOpacity,
      transform: [{ scale: logoScale }],
    },
    wordmark: {
      opacity: wordmarkOpacity,
      transform: [{ scale: wordmarkScale }],
    },
    tagline: {
      opacity: taglineOpacity,
      color: colors.textSecondary,
      fontFamily: typography.fontFamilies.body,
      fontSize: typography.sizes.sm,
      letterSpacing: 1.5,
      fontStyle: 'italic',
    },
    loadingDots: {
      flexDirection: 'row',
      gap: spacing.sm,
      position: 'absolute',
      bottom: 80,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.coral,
    },
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.centerStack}>
        <Animated.View style={styles.logoContainer}>
          <KambaLogo variant="icon" size={72} color={colors.coral} />
        </Animated.View>
        <Animated.View style={styles.wordmark}>
          <KambaLogo variant="wordmark" size={32} color={colors.coral} />
        </Animated.View>
        <Animated.Text style={styles.tagline}>makes it easy...</Animated.Text>
      </View>
      <View style={styles.loadingDots}>
        <Animated.View style={[styles.dot, { opacity: pulse1 }]} />
        <Animated.View style={[styles.dot, { opacity: pulse2 }]} />
        <Animated.View style={[styles.dot, { opacity: pulse3 }]} />
      </View>
    </Animated.View>
  );
};

export default SplashScreen;