export async function sendTelegramMessage(text) {
  const token = process.env.TG_TOKEN;
  const chatId = process.env.CHAT_ID;
  if (!token || !chatId) return { skipped: true };

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown'
    })
  });

  const data = await response.json();
  if (!data.ok) throw new Error('Telegram error');
  return data;
}

export function escapeMarkdown(value) {
  return String(value || '').replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');
}
