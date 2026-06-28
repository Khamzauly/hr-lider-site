export async function sendTelegramMessage(text) {
  const token = process.env.TG_TOKEN;
  const chatId = process.env.CHAT_ID;
  if (process.env.DISABLE_TELEGRAM_NOTIFICATIONS === '1' || !token || !chatId) {
    return { skipped: true };
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'MarkdownV2'
    })
  });

  const data = await response.json();
  if (!data.ok) throw new Error('Telegram error');
  return data;
}

export async function safeSendTelegramMessage(text) {
  try {
    return await sendTelegramMessage(text);
  } catch {
    return { ok: false, skipped: false };
  }
}

export function escapeMarkdown(value) {
  return String(value || '').replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');
}
