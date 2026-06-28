import test from 'node:test';
import assert from 'node:assert/strict';

import { cleanString, isSpamTrapFilled, validateEmail, validatePhone } from '../lib/validation.js';

test('cleanString trims and limits input', () => {
  assert.equal(cleanString('  abc  ', 10), 'abc');
  assert.equal(cleanString('abcdef', 3), 'abc');
});

test('isSpamTrapFilled detects hidden bot fields', () => {
  assert.equal(isSpamTrapFilled({ website: '' }), false);
  assert.equal(isSpamTrapFilled({ website: 'https://spam.example' }), true);
  assert.equal(isSpamTrapFilled({ homepage: 'bot' }), true);
  assert.equal(isSpamTrapFilled({ url: 'bot' }), true);
});

test('contact validators accept normal values', () => {
  assert.equal(validatePhone('+7 701 432 21 11'), '+7 701 432 21 11');
  assert.equal(validateEmail('user@example.com'), 'user@example.com');
  assert.equal(validateEmail(''), null);
});
