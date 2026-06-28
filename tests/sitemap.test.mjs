import test from 'node:test';
import assert from 'node:assert/strict';

import sitemap from '../app/sitemap.js';

const siteUrl = 'https://www.hr-lider.kz';

test('sitemap fallback includes all current public service, article and event routes', async () => {
  const oldDatabaseUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;

  try {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    assert.equal(new Set(urls).size, urls.length);
    assert.ok(urls.includes(`${siteUrl}/services/obuchenie-soglasitelnoi-komissii`));
    assert.ok(urls.includes(`${siteUrl}/services/razrabotka-kadrovyh-dokumentov`));
    assert.ok(urls.includes(`${siteUrl}/articles/oshibki-rabotodateley-pri-sozdanii-soglasitelnoy-komissii`));
    assert.ok(urls.includes(`${siteUrl}/articles/zachem-rabotodatelyu-obuchat-soglasitelnuyu-komissiyu`));
    assert.ok(urls.includes(`${siteUrl}/events/obuchenie-soglasitelnoy-komissii-dlya-rabotodateley`));
    assert.ok(urls.includes(`${siteUrl}/events/kadrovoe-deloproizvodstvo-kak-podgotovitsya-k-proverke`));
    assert.ok(!urls.some((url) => url.includes('/admin')));
  } finally {
    if (oldDatabaseUrl) process.env.DATABASE_URL = oldDatabaseUrl;
  }
});

test('sitemap marks key landing pages with higher priority', async () => {
  const oldDatabaseUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;

  try {
    const entries = await sitemap();
    const byUrl = new Map(entries.map((entry) => [entry.url, entry]));

    assert.equal(byUrl.get(`${siteUrl}`).priority, 1);
    assert.equal(byUrl.get(`${siteUrl}/services/obuchenie-soglasitelnoi-komissii`).priority, 0.95);
    assert.equal(byUrl.get(`${siteUrl}/contacts`).priority, 0.85);
  } finally {
    if (oldDatabaseUrl) process.env.DATABASE_URL = oldDatabaseUrl;
  }
});
