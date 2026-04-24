export function cleanString(value, max = 5000) {
  if (value === undefined || value === null) return '';
  return String(value).trim().slice(0, max);
}

export function cleanOptionalString(value, max = 5000) {
  const cleaned = cleanString(value, max);
  return cleaned || null;
}

export function normalizeStatus(value) {
  const status = cleanString(value).toUpperCase();
  if (['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) return status;
  return 'DRAFT';
}

export function normalizeRegistrationStatus(value) {
  const status = cleanString(value).toUpperCase();
  if (['NEW', 'CONFIRMED', 'CANCELLED', 'ATTENDED'].includes(status)) return status;
  return 'NEW';
}

export function normalizeFormat(value) {
  const format = cleanString(value).toUpperCase();
  return format === 'ONLINE' ? 'ONLINE' : 'OFFLINE';
}

export function slugify(value) {
  const source = cleanString(value, 160).toLowerCase();
  return source
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zа-яё0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

export function required(value, field) {
  if (!cleanString(value)) throw new Error(`${field} is required`);
}

export function validatePhone(value) {
  const phone = cleanString(value, 32);
  if (!/^\+?[0-9\s\-()]{7,24}$/.test(phone)) throw new Error('phone is invalid');
  return phone;
}

export function validateEmail(value) {
  const email = cleanString(value, 160);
  if (!email) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('email is invalid');
  return email;
}
