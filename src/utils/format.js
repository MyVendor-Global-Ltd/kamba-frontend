export const formatPhone = (num) => {
  if (!num) return '';
  const cleaned = num.replace(/\D/g, '');
  const withCountry = cleaned.startsWith('234') ? cleaned : '234' + cleaned.replace(/^0/, '');
  const last10 = withCountry.slice(-10);
  return `+${withCountry.slice(0, 3)} ${last10.slice(0, 3)} ${last10.slice(3, 6)} ${last10.slice(6)}`;
};

export const formatCurrency = (n) => {
  if (n === null || n === undefined || isNaN(n)) return '₦0';
  return '₦' + n.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const formatCompactNumber = (n) => {
  if (n === null || n === undefined || isNaN(n)) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
};

export const truncateText = (str, maxLength) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + '…';
};

export default { formatPhone, formatCurrency, formatCompactNumber, truncateText };