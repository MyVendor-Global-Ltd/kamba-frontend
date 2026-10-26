// hooks/useReducedMotion.js — Respect user's motion preferences
// Reduced motion: instant transitions, no stagger

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Hook to detect if user has reduced motion enabled
 * Returns true if animations should be minimized/disabled
 */
export const useReducedMotion = () => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const checkReducedMotion = async () => {
      const isEnabled = await AccessibilityInfo.isReduceMotionEnabled();
      setReduceMotion(isEnabled);
    };

    checkReducedMotion();

    const listener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => setReduceMotion(enabled)
    );

    return () => listener.remove();
  }, []);

  return reduceMotion;
};

/**
 * Hook that provides motion configs based on reduced motion preference
 * Use this instead of raw motion tokens for automatic reduced-motion support
 */
export const useMotionConfig = () => {
  const reduceMotion = useReducedMotion();

  return {
    // Duration overrides
    duration: reduceMotion ? 0 : undefined, // Will use token defaults when false
    // Stagger delay overrides
    staggerDelay: reduceMotion ? 0 : undefined,
    // Spring configs — use instant when reduced
    spring: reduceMotion ? { damping: 1, stiffness: 1000 } : undefined,
    springBouncy: reduceMotion ? { damping: 1, stiffness: 1000 } : undefined,
    springModal: reduceMotion ? { damping: 1, stiffness: 1000 } : undefined,
    // Easing — linear when reduced
    easing: reduceMotion ? [0, 0, 1, 1] : undefined,
    // Boolean flags for conditional rendering
    shouldAnimate: !reduceMotion,
    shouldStagger: !reduceMotion,
  };
};

/**
 * Helper to get animation config with reduced motion support
 * Usage: const animConfig = useAnimationConfig({ duration: 300, easing: tokens.motion.easing.standard });
 */
export const useAnimationConfig = (config = {}) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return {
      duration: 0,
      easing: [0, 0, 1, 1],
      ...config,
    };
  }

  return config;
};

export default useReducedMotion;