import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const rootPage = new URL('../app/page.js', import.meta.url);
const slugPage = new URL('../app/[...slug]/page.js', import.meta.url);

test('public Next routes keep the established SPA visual shell', async () => {
  const [homeSource, slugSource] = await Promise.all([
    readFile(rootPage, 'utf8'),
    readFile(slugPage, 'utf8'),
  ]);

  assert.match(homeSource, /import SpaApp from '\.\/SpaApp';/);
  assert.match(homeSource, /<SpaApp\s*\/>/);
  assert.doesNotMatch(homeSource, /HomePage|PublicRoutePage/);

  assert.match(slugSource, /import SpaApp from '\.\.\/SpaApp';/);
  assert.match(slugSource, /<SpaApp\s*\/>/);
  assert.doesNotMatch(slugSource, /PublicRoutePage/);
});
