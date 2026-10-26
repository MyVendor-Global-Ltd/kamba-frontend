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

// ============================================================================
// DEFAULT THEME OBJECT
// ============================================================================
export const theme = { colors: colors.light, darkColors: colors.dark, typography, spacing, radius, shadows, motion, breakpoints, zIndex, icons, haptics };
export default theme;
// tokens.js — Kamba Design System (Marketplace Light Mode)
// Nigerian campus marketplace — Light-mode default, discovery-first, warm utilitarian

// ============================================================================
// COLOR SYSTEM — Warm Monochrome + Single Accent (Kamba Coral #FF6B47)
// Light-mode DEFAULT. No dark mode for MVP.
// ============================================================================
export const colors = {
  light: {
    background: '#FFFDFC', surface: '#FFFFFF', surfaceElevated: '#FAFAF9',
    border: '#ECE8E5', borderStrong: '#E0DDD8',
    textPrimary: '#202124', textSecondary: '#6B6B70', textMuted: '#9E9E9E',
    accent: '#FF6B47', accentSoft: '#FFF0EB', accentHover: '#FF5A35',
    success: '#237A52', successSoft: '#EDF3EC',
    warning: '#9A6100', warningSoft: '#FBF3DB',
    error: '#C0392B', errorSoft: '#FDEBEC',
    overlay: 'rgba(32,33,36,0.4)', overlayStrong: 'rgba(32,33,36,0.6)',
  },
  dark: {
    background: '#1C1917', surface: '#292524', surfaceElevated: '#3F3F46',
    border: '#44403C', borderStrong: '#57534E',
    textPrimary: '#FAFAF9', textSecondary: '#D6D3D1', textMuted: '#A8A29E',
    accent: '#FF6B47', accentSoft: '#7C2D12', accentHover: '#FF5A35',
    success: '#10B981', successSoft: '#064E3B',
    warning: '#F59E0B', warningSoft: '#78350F',
    error: '#EF4444', errorSoft: '#7F1D1D',
    overlay: 'rgba(250,250,249,0.4)', overlayStrong: 'rgba(250,250,249,0.6)',
  },
};

// ============================================================================
// TYPOGRAPHY — Geist Sans (Display/Headlines) + Plus Jakarta Sans (UI/Body)
// ============================================================================
export const typography = {
  fontFamilies: {
    display: 'Geist_700Bold', displayMedium: 'Geist_600SemiBold',
    headline: 'Geist_600SemiBold', headlineMedium: 'Geist_500Medium',
    title: 'PlusJakartaSans_600SemiBold', body: 'PlusJakartaSans_400Regular',
    bodyMedium: 'PlusJakartaSans_500Medium', label: 'PlusJakartaSans_600SemiBold',
    chip: 'PlusJakartaSans_500Medium', caption: 'PlusJakartaSans_400Regular',
    mono: 'GeistMono_400Regular', monoMedium: 'GeistMono_500Medium',
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
