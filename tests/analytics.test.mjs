import test from 'node:test';
import assert from 'node:assert/strict';

import {
  trackContactClick,
  trackEvent,
  trackEventRegistration,
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

  assert.deepEqual(calls, [
    ['event', 'lead_submit', { source: 'contact' }],
    ['event', 'event_registration_submit', { event_slug: 'obuchenie-komissii' }],
    ['event', 'contact_click', { method: 'phone', location: 'footer' }],
  ]);

  delete global.window;
});
