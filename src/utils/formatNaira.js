// utils/formatNaira.js — Nigerian Naira formatting (EVERYWHERE)
// ₦1,234.56 via formatNaira() utility — comma separators = legitimacy

/**
 * Format a number as Nigerian Naira with proper comma separators
 * @param {number|string} amount - Amount in Naira (can be integer or decimal)
 * @param {object} options - Formatting options
 * @param {boolean} options.showSymbol - Whether to show ₦ symbol (default: true)
 * @param {boolean} options.showDecimals - Whether to show decimal places (default: true)
 * @param {number} options.minDecimals - Minimum decimal places (default: 2)
 * @param {number} options.maxDecimals - Maximum decimal places (default: 2)
 * @returns {string} Formatted Naira string
 */
export const formatNaira = (amount, options = {}) => {
  const {
    showSymbol = true,
    showDecimals = true,
    minDecimals = 2,
    maxDecimals = 2,
  } = options;

  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return showSymbol ? '₦0.00' : '0.00';
  }

  const num = Number(amount);
  const formatter = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: showDecimals ? minDecimals : 0,
    maximumFractionDigits: showDecimals ? maxDecimals : 0,
    useGrouping: true,
  });

  const formatted = formatter.format(Math.abs(num));
  const symbol = showSymbol ? '₦' : '';
  const sign = num < 0 ? '-' : '';

  return `${sign}${symbol}${formatted}`;
};

/**
 * Format Naira for display in UI components (tabular nums for Geist Mono)
 * Uses monospace-friendly formatting
 */
export const formatNairaDisplay = (amount, options = {}) => {
  return formatNaira(amount, { ...options, showDecimals: true });
};

/**
 * Format Naira for compact display (e.g., ₦1.2K, ₦5.5M)
 */
export const formatNairaCompact = (amount, options = {}) => {
  const { showSymbol = true } = options;
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return showSymbol ? '₦0' : '0';
  }

  const num = Number(amount);
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  const symbol = showSymbol ? '₦' : '';

  if (absNum >= 1_000_000_000) {
    return `${sign}${symbol}${(absNum / 1_000_000_000).toFixed(1)}B`;
  }
  if (absNum >= 1_000_000) {
    return `${sign}${symbol}${(absNum / 1_000_000).toFixed(1)}M`;
  }
  if (absNum >= 1_000) {
    return `${sign}${symbol}${(absNum / 1_000).toFixed(1)}K`;
  }
  return `${sign}${symbol}${absNum.toLocaleString('en-NG')}`;
};

/**
 * Parse a Naira string back to number
 */
export const parseNaira = (nairaString) => {
  if (!nairaString) return 0;
  const cleaned = String(nairaString).replace(/[₦,\s]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

export default { formatNaira, formatNairaDisplay, formatNairaCompact, parseNaira };