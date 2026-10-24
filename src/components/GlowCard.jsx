import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { colors, radius, shadows, spacing, animation } from '../theme';

export const GlowCard = ({
  children,
  glowColor = colors.coral,
  intensity = 0.25,
  style,
  onPress,
}) => {
  const entranceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(entranceAnim, {
      toValue: 1,
      ...animation.spring,
      useNativeDriver: true,
    }).start();
  }, []);

  const scale = entranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });
  const opacity = entranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const glowShadow = {
    shadowColor: glowColor,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: intensity,
    shadowRadius: 32,
    elevation: 16,
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.inkRaised,
      borderWidth: 1,
      borderColor: colors.inkBorder,
      borderRadius: radius.xl,
      padding: spacing.xl,
      ...shadows.card,
    },
    pressed: {
      opacity: 0.8,
    },
  });

  const Content = (
    <Animated.View
      style={[
        styles.container,
        glowShadow,
        { transform: [{ scale }], opacity },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <Animated.View>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={1}
        >
          {Content}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return Content;
};

export default GlowCard;