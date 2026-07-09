import { cleanString } from './validation.js';

const ATTRIBUTION_FIELDS = [
  ['utm_source', 'utm_source'],
  ['utm_medium', 'utm_medium'],
  ['utm_campaign', 'utm_campaign'],
  ['utm_content', 'utm_content'],
  ['utm_term', 'utm_term'],
  ['gclid', 'gclid'],
  ['gbraid', 'gbraid'],
  ['wbraid', 'wbraid'],
  ['gad_source', 'gad_source'],
  ['gad_campaignid', 'gad_campaignid'],
  ['fbclid', 'fbclid'],
  ['yclid', 'yclid'],
  ['landingPage', 'landing'],
  ['landingPath', 'landing_path'],
  ['currentPage', 'current'],
  ['currentPath', 'current_path'],
  ['referrer', 'referrer'],
  ['capturedAt', 'captured_at'],
  ['submittedAt', 'submitted_at'],
];

export function cleanAttribution(value) {
  if (!value || typeof value !== 'object') return {};

  const result = {};
  for (const [field] of ATTRIBUTION_FIELDS) {
    const cleaned = cleanString(value[field], 500);
    if (cleaned) result[field] = cleaned;
  }
  return result;
}

export function hasGoogleAdsClick(attribution = {}) {
  return Boolean(attribution.gclid || attribution.gbraid || attribution.wbraid);
}

export function inferAttributionChannel(attribution = {}) {
  const utmSource = String(attribution.utm_source || '').toLowerCase();
  const utmMedium = String(attribution.utm_medium || '').toLowerCase();

  if (hasGoogleAdsClick(attribution)) return 'google_ads';
  if (utmSource.includes('google') && /cpc|ppc|paid|ads?/.test(utmMedium)) return 'google_ads';
  if (utmSource) return utmSource.slice(0, 40);
  return '';
}

export function buildTrackedSource(source, attribution = {}) {
  const base = cleanString(source, 50) || 'contact';
  const channel = inferAttributionChannel(attribution);
  if (!channel || base.includes(channel)) return cleanString(base, 80);
  return cleanString(`${base}:${channel}`, 80);
}

export function formatAttributionSummary(attribution = {}, { includeClickIds = true } = {}) {
  const cleaned = cleanAttribution(attribution);
  const parts = [];

  for (const [field, label] of ATTRIBUTION_FIELDS) {
    if (!includeClickIds && ['gclid', 'gbraid', 'wbraid', 'fbclid', 'yclid'].includes(field)) continue;
    if (cleaned[field]) parts.push(`${label}=${cleaned[field]}`);
  }

  return parts.join('; ');
}

export function appendAttributionToComment(comment, attribution = {}) {
  const base = cleanString(comment, 1500);
  const summary = formatAttributionSummary(attribution);
  if (!summary) return base || null;

  const suffix = `\n\n---\nTracking / реклама: ${summary}`;
  return cleanString(`${base}${suffix}`, 2000) || null;
}

export function formatAttributionForTelegram(attribution = {}) {
  const cleaned = cleanAttribution(attribution);
  const parts = [];
  const channel = inferAttributionChannel(cleaned);

  if (channel) parts.push(`Канал: ${channel}`);
  if (cleaned.utm_campaign) parts.push(`Кампания: ${cleaned.utm_campaign}`);
  if (cleaned.utm_source) parts.push(`utm_source: ${cleaned.utm_source}`);
  if (cleaned.utm_medium) parts.push(`utm_medium: ${cleaned.utm_medium}`);
  if (hasGoogleAdsClick(cleaned)) parts.push('Google Ads click id: есть');
  if (cleaned.landingPath) parts.push(`Landing: ${cleaned.landingPath}`);
  if (cleaned.referrer) parts.push(`Referrer: ${cleaned.referrer}`);

  return parts.join('\n');
}
