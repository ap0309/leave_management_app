/**
 * Email validation utility for Brainybeam domain
 * Validates that email ends with @brainybeam.com
 */
export function validateBrainybeamEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@brainybeam\.com$/.test(email);
}

export function getEmailDomain(email) {
  return email.split('@')[1];
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}