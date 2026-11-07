export const validateUsername = (str) => {
  if (!str) {
    return { valid: false, error: 'Username is required' };
  }

  const cleaned = str.trim().replace(/^@/, '').toLowerCase();

  if (cleaned.includes('@') || /[\u0000-\u001F\u007F\s]/u.test(cleaned)) {
    return { valid: false, error: 'Usernames cannot contain @ or spaces' };
  }

  if (cleaned.length < 3) {
    return { valid: false, error: 'Must be at least 3 characters' };
  }

  if (cleaned.length > 16) {
    return { valid: false, error: 'Must be at most 16 characters' };
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
  return str.trim().replace(/^@/, '').slice(0, 16).toLowerCase();
};

export default { validateUsername, suggestFromEmail, formatUsername };