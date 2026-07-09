const STORAGE_KEY = 'hr_lider_attribution_v1';

export const ATTRIBUTION_QUERY_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'gbraid',
  'wbraid',
  'gad_source',
  'gad_campaignid',
  'fbclid',
  'yclid',
];

function safeLocalStorage() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage || null;
  } catch (_error) {
    return null;
  }
}

function readStoredAttribution() {
  const storage = safeLocalStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (_error) {
    return null;
  }
}

function writeStoredAttribution(payload) {
  const storage = safeLocalStorage();
  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (_error) {
    // Ignore storage failures; tracking must never block the lead form.
  }
}

function browserContext() {
  if (typeof window === 'undefined') return {};

  return {
    landingPage: window.location?.href || '',
    landingPath: `${window.location?.pathname || ''}${window.location?.search || ''}`,
    referrer: typeof document !== 'undefined' ? document.referrer || '' : '',
  };
}

export function extractAttributionFromSearch(search = '') {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  const result = {};

  for (const key of ATTRIBUTION_QUERY_KEYS) {
    const value = params.get(key);
    if (value) result[key] = value.slice(0, 500);
  }

  return result;
}

export function captureAttributionFromLocation() {
  if (typeof window === 'undefined') return null;

  const captured = extractAttributionFromSearch(window.location?.search || '');
  const existing = readStoredAttribution();
  const hasNewAttribution = Object.keys(captured).length > 0;

  if (!hasNewAttribution) return existing;

  const payload = {
    ...(existing || {}),
    ...captured,
    ...browserContext(),
    capturedAt: new Date().toISOString(),
  };

  writeStoredAttribution(payload);
  return payload;
}

export function getAttributionPayload() {
  if (typeof window === 'undefined') return null;

  const stored = readStoredAttribution() || {};
  return {
    ...stored,
    currentPage: window.location?.href || '',
    currentPath: `${window.location?.pathname || ''}${window.location?.search || ''}`,
    referrer: stored.referrer || (typeof document !== 'undefined' ? document.referrer || '' : ''),
    submittedAt: new Date().toISOString(),
  };
}

export function hasGoogleAdsClick(attribution = {}) {
  return Boolean(attribution?.gclid || attribution?.gbraid || attribution?.wbraid);
}

export function attributionChannel(attribution = {}) {
  const utmSource = String(attribution?.utm_source || '').toLowerCase();
  const utmMedium = String(attribution?.utm_medium || '').toLowerCase();

  if (hasGoogleAdsClick(attribution)) return 'google_ads';
  if (utmSource.includes('google') && /cpc|ppc|paid|ads?/.test(utmMedium)) return 'google_ads';
  if (utmSource) return utmSource.slice(0, 40);
  return '';
}
