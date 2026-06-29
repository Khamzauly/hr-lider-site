import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildGoogleAnalyticsScripts,
  buildMicrosoftClarityScript,
} from '../app/lib/analytics-scripts.js';

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

test('buildMicrosoftClarityScript returns null when project id is missing or unsafe', () => {
  assert.equal(buildMicrosoftClarityScript(''), null);
  assert.equal(buildMicrosoftClarityScript(undefined), null);
  assert.equal(buildMicrosoftClarityScript('bad-id<script>'), null);
});

test('buildMicrosoftClarityScript builds Clarity loader snippet', () => {
  const script = buildMicrosoftClarityScript('abc123xyz');

  assert.match(script, /https:\/\/www\.clarity\.ms\/tag\//);
  assert.match(script, /"clarity", "script", "abc123xyz"/);
});
