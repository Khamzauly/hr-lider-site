import test from 'node:test';
import assert from 'node:assert/strict';

import {
  attributionChannel,
  extractAttributionFromSearch,
  hasGoogleAdsClick,
} from '../src/app/lib/attribution.js';
import {
  appendAttributionToComment,
  buildTrackedSource,
  cleanAttribution,
  formatAttributionForTelegram,
} from '../lib/lead-attribution.js';

test('extractAttributionFromSearch extracts Google Ads and UTM parameters', () => {
  assert.deepEqual(
    extractAttributionFromSearch('?utm_source=google&utm_medium=cpc&utm_campaign=hrlider&gclid=abc123&ignored=x'),
    {
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'hrlider',
      gclid: 'abc123',
    }
  );
});

test('attribution helpers detect Google Ads channel', () => {
  assert.equal(hasGoogleAdsClick({ gclid: 'abc' }), true);
  assert.equal(attributionChannel({ utm_source: 'google', utm_medium: 'cpc' }), 'google_ads');
  assert.equal(attributionChannel({ utm_source: 'instagram', utm_medium: 'bio' }), 'instagram');
});

test('server attribution summary stores ad data in existing lead fields safely', () => {
  const attribution = cleanAttribution({
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'obuchenie',
    gclid: 'click-id',
    landingPath: '/?utm_source=google',
    unknown: 'ignored',
  });

  assert.equal(buildTrackedSource('home', attribution), 'home:google_ads');
  assert.match(appendAttributionToComment('Нужна программа', attribution), /Tracking \/ реклама:/);
  assert.match(appendAttributionToComment('Нужна программа', attribution), /gclid=click-id/);
  assert.match(formatAttributionForTelegram(attribution), /Google Ads click id: есть/);
});
