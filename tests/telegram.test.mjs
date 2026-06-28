import test from 'node:test';
import assert from 'node:assert/strict';

import {
  escapeMarkdown,
  safeSendTelegramMessage,
  sendTelegramMessage,
  telegramDeliveryStatus,
} from '../lib/telegram.js';

test('escapeMarkdown escapes Telegram MarkdownV2 control characters', () => {
  assert.equal(
    escapeMarkdown('A_B [test](x) + 1.0!'),
    'A\\_B \\[test\\]\\(x\\) \\+ 1\\.0\\!'
  );
});

test('sendTelegramMessage skips when notifications are disabled', async () => {
  const previous = process.env.DISABLE_TELEGRAM_NOTIFICATIONS;
  process.env.DISABLE_TELEGRAM_NOTIFICATIONS = '1';

  const result = await sendTelegramMessage('test');

  assert.deepEqual(result, { skipped: true });
  if (previous === undefined) delete process.env.DISABLE_TELEGRAM_NOTIFICATIONS;
  else process.env.DISABLE_TELEGRAM_NOTIFICATIONS = previous;
});

test('safeSendTelegramMessage never throws when Telegram fails', async () => {
  const oldToken = process.env.TG_TOKEN;
  const oldChatId = process.env.CHAT_ID;
  const oldDisabled = process.env.DISABLE_TELEGRAM_NOTIFICATIONS;
  const oldFetch = globalThis.fetch;

  process.env.TG_TOKEN = 'token';
  process.env.CHAT_ID = 'chat';
  delete process.env.DISABLE_TELEGRAM_NOTIFICATIONS;
  globalThis.fetch = async () => ({ json: async () => ({ ok: false }) });

  const result = await safeSendTelegramMessage('test');

  assert.equal(result.ok, false);
  assert.equal(result.skipped, false);

  if (oldToken === undefined) delete process.env.TG_TOKEN;
  else process.env.TG_TOKEN = oldToken;
  if (oldChatId === undefined) delete process.env.CHAT_ID;
  else process.env.CHAT_ID = oldChatId;
  if (oldDisabled === undefined) delete process.env.DISABLE_TELEGRAM_NOTIFICATIONS;
  else process.env.DISABLE_TELEGRAM_NOTIFICATIONS = oldDisabled;
  globalThis.fetch = oldFetch;
});

test('telegramDeliveryStatus summarizes Telegram delivery result without secrets', () => {
  assert.equal(telegramDeliveryStatus({ ok: true }), 'sent');
  assert.equal(telegramDeliveryStatus({ skipped: true }), 'skipped');
  assert.equal(telegramDeliveryStatus({ ok: false, skipped: false }), 'failed');
  assert.equal(telegramDeliveryStatus(undefined), 'failed');
});
