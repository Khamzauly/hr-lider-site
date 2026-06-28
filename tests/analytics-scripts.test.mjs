import test from 'node:test';
import assert from 'node:assert/strict';

import { buildGoogleAnalyticsScripts } from '../app/lib/analytics-scripts.js';

test('buildGoogleAnalyticsScripts returns null when measurement id is missing', () => {
  assert.equal(buildGoogleAnalyticsScripts(''), null);
  assert.equal(buildGoogleAnalyticsScripts(undefined), null);
});

test('buildGoogleAnalyticsScripts builds safe GA loader and config snippets', () => {
  const scripts = buildGoogleAnalyticsScripts('G-TEST123');

  assert.equal(scripts.src, 'https://www.googletagmanager.com/gtag/js?id=G-TEST123');
  assert.match(scripts.inline, /window\.dataLayer = window\.dataLayer \|\| \[\];/);
  assert.match(scripts.inline, /gtag\('config', 'G-TEST123'\);/);
});
