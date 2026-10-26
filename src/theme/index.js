// theme/index.js — Re-exports from tokens.js for backwards compatibility
// New code should import directly from 'tokens'

export {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  motion,
  breakpoints,
  zIndex,
  icons,
  haptics,
  theme,
} from './tokens';

// Default export for existing imports
export { default } from './tokens';