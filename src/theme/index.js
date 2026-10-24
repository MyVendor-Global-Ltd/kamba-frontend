export const colors = {
  ink: '#0A0E1A',
  inkRaised: '#111827',
  inkBorder: 'rgba(255,255,255,0.07)',

  coral: '#FF6B47',
  coralDim: 'rgba(255,107,71,0.12)',
  coralGlow: 'rgba(255,107,71,0.25)',

  navy: '#1E3A5F',
  gold: '#FFD23F',
  goldDim: 'rgba(255,210,63,0.1)',

  textPrimary: '#F8FAFC',
  textSecondary: 'rgba(248,250,252,0.55)',
  textTertiary: 'rgba(248,250,252,0.3)',

  success: '#22C55E',
  error: '#FF4757',
  warning: '#FFD23F',
};

export const typography = {
  fontFamilies: {
    display: 'SpaceGrotesk_700Bold',
    displayHeavy: 'SpaceGrotesk_800ExtraBold',
    body: 'PlusJakartaSans_400Regular',
    bodyMedium: 'PlusJakartaSans_500Medium',
    bodySemiBold: 'PlusJakartaSans_600SemiBold',
    mono: 'monospace',
  },
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 30,
    display: 38,
    hero: 46,
  },
  letterSpacing: {
    tight: -1,
    normal: 0,
    caps: 1.5,
    wide: 2,
  },
  lineHeight: {
    headline: 1.1,
    body: 1.6,
    loose: 1.65,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  section: 64,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  xl: 32,
  full: 999,
};

export const shadows = {
  coral: {
    shadowColor: '#FF6B47',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const animation = {
  spring: { damping: 18, stiffness: 200, mass: 0.8 },
  springBouncy: { damping: 12, stiffness: 180, mass: 0.6 },
  duration: { fast: 200, base: 350, slow: 600 },
};