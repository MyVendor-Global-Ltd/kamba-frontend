export const validateUsername = (str) => {
  if (!str) {
    return { valid: false, error: 'Username is required' };
  }

  const cleaned = str.toLowerCase().replace(/[^a-z0-9\-!_*#]/g, '');

  if (cleaned !== str) {
    return { valid: false, error: 'Only letters, numbers, hyphen, exclamation, underscore, asterisk, and hashtag allowed' };
  }

  if (cleaned.length < 3) {
    return { valid: false, error: 'Must be at least 3 characters' };
  }

  if (cleaned.length > 24) {
    return { valid: false, error: 'Must be at most 24 characters' };
  }

  if (cleaned.startsWith('-') || cleaned.endsWith('-') || cleaned.startsWith('!') || cleaned.endsWith('!')) {
    return { valid: false, error: 'Cannot start or end with special characters' };
  }

  return { valid: true, error: null, cleaned };
};

export const suggestFromEmail = (email) => {
  if (!email) {
    return ['kamba_user', 'kamba_user_ng', 'kamba_user01'];
  }

  const prefix = email.split('@')[0];
  const clean = prefix.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 18);

  return [clean, `${clean}_ng`, `${clean}01`];
};

export const formatUsername = (str) => {
  return str.toLowerCase().replace(/[^a-z0-9\-!_*#]/g, '');
};

export default { validateUsername, suggestFromEmail, formatUsername };