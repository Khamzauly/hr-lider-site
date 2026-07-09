import test from 'node:test';
import assert from 'node:assert/strict';

import {
  trackContactClick,
  trackCtaClick,
  trackEvent,
  trackEventRegistration,
  trackGoogleAdsConversion,
  trackLeadSubmit,
} from '../src/app/lib/analytics.js';

test('trackEvent sends GA event through gtag when available', () => {
  const calls = [];
  global.window = {
    gtag: (...args) => calls.push(args),
  };

  const tracked = trackEvent('lead_submit', { source: 'home' });

  assert.equal(tracked, true);
  assert.deepEqual(calls, [['event', 'lead_submit', { source: 'home' }]]);

  delete global.window;
});

test('trackEvent falls back to dataLayer when gtag is unavailable', () => {
  const dataLayer = [];
  global.window = { dataLayer };

  const tracked = trackEvent('contact_click', { method: 'whatsapp', location: 'header' });

  assert.equal(tracked, true);
  assert.deepEqual(dataLayer, [
    { event: 'contact_click', method: 'whatsapp', location: 'header' },
  ]);

  delete global.window;
});

test('trackEvent is safe during server rendering', () => {
  delete global.window;

  assert.equal(trackEvent('lead_submit', { source: 'home' }), false);
});

test('specific conversion helpers use stable event names and params', () => {
  const calls = [];
  global.window = {
    gtag: (...args) => calls.push(args),
  };

  trackLeadSubmit('contact');
  trackEventRegistration('obuchenie-komissii');
  trackContactClick('phone', 'footer');
  trackCtaClick('consultation_scroll', 'header');

  assert.deepEqual(calls, [
    ['event', 'lead_submit', { source: 'contact' }],
    ['event', 'event_registration_submit', { event_slug: 'obuchenie-komissii' }],
    ['event', 'contact_click', { method: 'phone', location: 'footer' }],
    ['event', 'cta_click', { label: 'consultation_scroll', location: 'header' }],
  ]);

  delete global.window;
});

test('helpers include safe ad attribution flags without sending raw click IDs to GA events', () => {
  const calls = [];
  global.window = {
    gtag: (...args) => calls.push(args),
  };

  trackLeadSubmit('home', {
    gclid: 'test-click-id',
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'commission-training',
  });

  assert.deepEqual(calls, [
    ['event', 'lead_submit', {
      source: 'home',
      has_google_click_id: true,
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'commission-training',
    }],
  ]);

  delete global.window;
});

test('Google Ads conversion fires only when id and label env are configured', () => {
  const oldId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;
  const oldLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL;
  const calls = [];
  global.window = {
    gtag: (...args) => calls.push(args),
  };

  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID = 'AW-123456789';
  process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL = 'LeadLabel123';

  assert.equal(trackGoogleAdsConversion('lead', { event_label: 'home' }), true);
  assert.deepEqual(calls, [
    ['event', 'conversion', { send_to: 'AW-123456789/LeadLabel123', event_label: 'home' }],
  ]);

  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID = oldId;
  process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL = oldLabel;
  delete global.window;
});
