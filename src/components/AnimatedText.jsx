import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, Easing } from 'react-native';
import { typography } from '../theme';

export const AnimatedText = ({
  text,
  style,
  delay = 0,
  direction = 'vertical',
  stagger = 60,
  visible = true,
  onAnimationComplete,
}) => {
  const words = text.split(' ');
  const animationsRef = useRef(words.map(() => new Animated.Value(0)));
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    if (!visible) {
      animationsRef.current.forEach((anim) => anim.setValue(0));
      return;
    }

    const startAnimations = () => {
      const animations = animationsRef.current.map((anim, index) => {
        const startDelay = delay + index * stagger;
        return Animated.delay(
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          startDelay
        );
      });

      Animated.parallel(animations).start(({ finished }) => {
        if (finished && onAnimationComplete) {
          onAnimationComplete();
        }
      });
    };

    const timeout = setTimeout(startAnimations, 0);
    return () => clearTimeout(timeout);
  }, [visible, delay, stagger, text]);

  const wordElements = words.map((word, index) => {
    const anim = animationsRef.current[index];
    const translateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: direction === 'vertical' ? [20, 0] : [0, 0],
    });
    const translateX = anim.interpolate({
      inputRange: [0, 1],
      outputRange: direction === 'horizontal' ? [20, 0] : [0, 0],
    });
    const opacity = anim;

    return (
      <Animated.Text
        key={index}
        style={[
          styles.word,
          { opacity, transform: [{ translateY }, { translateX }] },
        ]}
      >
        {word}{index < words.length - 1 ? ' ' : ''}
      </Animated.Text>
    );
  });

  return <Text style={style}>{wordElements}</Text>;
};

const styles = StyleSheet.create({
  word: {
    // Individual word styles handled inline
  },
});

export default AnimatedText;