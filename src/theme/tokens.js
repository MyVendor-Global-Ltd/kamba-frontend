// ============================================================================
// SHADOWS — Ultra-diffuse, low opacity
// ============================================================================
const makeShadow = (opacity, y, blur, elevation) => ({
  shadowColor: '#202124', shadowOffset: { width: 0, height: y },
  shadowOpacity: opacity, shadowRadius: blur, elevation,
});

export const shadows = {
  card: makeShadow(0.03, 2, 8, 1),
  cardElevated: makeShadow(0.04, 4, 16, 2),
  cardHigh: makeShadow(0.05, 8, 24, 4),
  accent: makeShadow(0.12, 3, 10, 2),
  coral: makeShadow(0.12, 3, 10, 2),
  press: makeShadow(0.05, 2, 8, 1),
  modal: makeShadow(0.08, 16, 48, 8),
  fab: makeShadow(0.06, 4, 16, 3),
  none: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
};

// ============================================================================
// MOTION — cubic-bezier(0.16, 1, 0.3, 1)
// ============================================================================
export const motion = {
  easing: {
    standard: [0.16, 1, 0.3, 1], decelerate: [0, 0, 0.2, 1], accelerate: [0.4, 0, 1, 1],
    spring: { damping: 20, stiffness: 150 },
    springBouncy: { damping: 15, stiffness: 180 },
    springModal: { damping: 20, stiffness: 120 },
  },
  duration: { instant: 0, fast: 150, base: 250, slow: 400, slower: 600, entry: 600, staggerDelay: 80 },
  press: { primary: 0.96, secondary: 0.98, icon: 0.92 },
};

// ============================================================================
// BREAKPOINTS, Z-INDEX, ICONS, HAPTICS
// ============================================================================
export const breakpoints = { sm: 360, md: 390, lg: 428, xl: 768 };
export const zIndex = { base: 0, dropdown: 100, sticky: 200, modal: 300, toast: 400, tooltip: 500 };
export const icons = { family: 'PhosphorIcons', weight: 'bold', strokeWidth: 2.0, sizes: { xs: 16, sm: 20, md: 24, lg: 28, xl: 32, xxl: 40, hero: 64 } };
export const haptics = { light: 'impactLight', medium: 'impactMedium', heavy: 'impactHeavy', success: 'notificationSuccess', warning: 'notificationWarning', error: 'notificationError', selection: 'selectionStart' };

// tokens.js — Kamba Design System

// ============================================================================
// COLOR SYSTEM — Forest green, warm paper, and restrained brass
// ============================================================================
const lightColors = {
  background: '#F6F5EF',
  surface: '#FFFDF8',
  surfaceElevated: '#FFFFFF',
  border: '#E7E5DA',
  borderStrong: '#D5D2C5',
  textPrimary: '#1C2A21',
  textSecondary: '#56645A',
  textTertiary: '#6E7C72',
  textMuted: '#7D897F',
  accent: '#24543B',
  accentStrong: '#173D2A',
  accentSoft: '#E8F0E9',
  accentHover: '#35684B',
  onAccent: '#FFFFFF',
  textOnAccent: '#FFFFFF',
  accentGlow: 'rgba(36, 84, 59, 0.14)',
  gold: '#B68B3B',
  goldSoft: '#F3EBD9',
  goldDim: '#EAE1CC',
  success: '#347354',
  successSoft: '#E7F1E9',
  info: '#456650',
  infoSoft: '#E9F0EA',
  warning: '#956A1D',
  warningSoft: '#F5EEDC',
  error: '#A94338',
  errorSoft: '#F6E9E6',
  danger: '#A94338',
  dangerSoft: '#F6E9E6',
  overlay: 'rgba(23, 35, 27, 0.38)',
  overlayStrong: 'rgba(23, 35, 27, 0.62)',
};

const darkColors = {
  background: '#152019',
  surface: '#1D2B22',
  surfaceElevated: '#26372C',
  border: '#35473A',
  borderStrong: '#4B5D4F',
  textPrimary: '#F3F4EC',
  textSecondary: '#C4CEC5',
  textTertiary: '#B0BBB2',
  textMuted: '#9AA99D',
  accent: '#A6C8A8',
  accentStrong: '#C1D9BD',
  accentSoft: '#2A4032',
  accentHover: '#B5D2B2',
  onAccent: '#17271C',
  textOnAccent: '#17271C',
  accentGlow: 'rgba(166, 200, 168, 0.18)',
  gold: '#D6B66C',
  goldSoft: '#403923',
  goldDim: '#383622',
  success: '#8FC59B',
  successSoft: '#233A2B',
  info: '#A6C8A8',
  infoSoft: '#2A4032',
  warning: '#E0C27A',
  warningSoft: '#403923',
  error: '#E9A096',
  errorSoft: '#482D2A',
  danger: '#E9A096',
  dangerSoft: '#482D2A',
  overlay: 'rgba(0, 0, 0, 0.42)',
  overlayStrong: 'rgba(0, 0, 0, 0.68)',
};

export const colors = {
  light: lightColors,
  dark: darkColors,
  ...lightColors,
  ink: lightColors.background,
  inkRaised: lightColors.surface,
  inkBorder: lightColors.border,
  coral: lightColors.accent,
  coralDim: lightColors.accentSoft,
  coralGlow: lightColors.accentGlow,
};

// ============================================================================
// TYPOGRAPHY — Space Grotesk display + Plus Jakarta Sans UI
// ============================================================================
export const typography = {
  fontFamilies: {
    display: 'SpaceGrotesk_700Bold', displayHeavy: 'SpaceGrotesk_700Bold',
    displayMedium: 'SpaceGrotesk_600SemiBold',
    headline: 'SpaceGrotesk_600SemiBold', headlineMedium: 'SpaceGrotesk_500Medium',
    title: 'PlusJakartaSans_600SemiBold', body: 'PlusJakartaSans_400Regular',
    bodyMedium: 'PlusJakartaSans_500Medium', label: 'PlusJakartaSans_600SemiBold',
    chip: 'PlusJakartaSans_500Medium', caption: 'PlusJakartaSans_400Regular',
    mono: 'GeistMono_400Regular', monoMedium: 'GeistMono_500Medium',
    bodyRegular: 'PlusJakartaSans_400Regular',
    bodySemiBold: 'PlusJakartaSans_600SemiBold',
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    tightest: -1,
  },
  scale: {
    displayLarge: { fontSize: 40, lineHeight: 44, letterSpacing: -0.8 },
    displayMedium: { fontSize: 32, lineHeight: 38, letterSpacing: -0.6 },
    displaySmall: { fontSize: 24, lineHeight: 30, letterSpacing: -0.4 },
    headlineLarge: { fontSize: 20, lineHeight: 26, letterSpacing: -0.2 },
    headlineMedium: { fontSize: 18, lineHeight: 24, letterSpacing: -0.1 },
    headlineSmall: { fontSize: 16, lineHeight: 22, letterSpacing: 0 },
    titleLarge: { fontSize: 14, lineHeight: 20, letterSpacing: 0 },
    titleMedium: { fontSize: 13, lineHeight: 19, letterSpacing: 0 },
    titleSmall: { fontSize: 12, lineHeight: 18, letterSpacing: 0.1 },
    bodyLarge: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
    bodyMedium: { fontSize: 14, lineHeight: 22, letterSpacing: 0 },
    bodySmall: { fontSize: 12, lineHeight: 18, letterSpacing: 0.1 },
    labelLarge: { fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
    labelMedium: { fontSize: 12, lineHeight: 18, letterSpacing: 0.2 },
    labelSmall: { fontSize: 11, lineHeight: 16, letterSpacing: 0.3 },
    mono: { fontSize: 13, lineHeight: 20, letterSpacing: 0 },
    monoLarge: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  },
};

// ============================================================================
// SPACING — 4px base unit
// ============================================================================
export const spacing = {
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 28, 8: 32,
  10: 40, 12: 48, 16: 64, 20: 80,
  xs: 4, sm: 8, md: 12, base: 16, lg: 20, xl: 24, xxl: 32, xxxl: 48, section: 64,
};

// ============================================================================
// SHAPE CONSISTENCY — Cards=16, Buttons=12, Inputs=10, Badges=9999
// ============================================================================
export const radius = { none: 0, xs: 4, sm: 8, md: 10, lg: 12, xl: 16, xxl: 20, full: 9999 };

// ============================================================================
// DEFAULT THEME OBJECT
// ============================================================================
export const theme = { colors: colors.light, darkColors: colors.dark, typography, spacing, radius, shadows, motion, breakpoints, zIndex, icons, haptics };
export default theme;
