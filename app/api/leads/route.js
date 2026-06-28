import { fail, ok, readJson } from '../../../lib/http.js';
import { prisma } from '../../../lib/prisma.js';
import { safeSendTelegramMessage, escapeMarkdown } from '../../../lib/telegram.js';
import { cleanOptionalString, cleanString, isSpamTrapFilled, validatePhone } from '../../../lib/validation.js';

export async function POST(req) {
  try {
    const body = await readJson(req);
    if (isSpamTrapFilled(body)) return ok({ skipped: true });

    const name = cleanString(body.name, 120);
    const phone = validatePhone(body.phone);
    if (!name || name.length < 2) return fail('name is required');

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        company: cleanOptionalString(body.company, 160),
        comment: cleanOptionalString(body.comment, 2000),
        source: cleanString(body.source, 80) || 'contact'
      }
    });

    await safeSendTelegramMessage(
      `📋 *Новая заявка HR Lider*\n\n👤 *Имя:* ${escapeMarkdown(lead.name)}\n📞 *Телефон:* ${escapeMarkdown(lead.phone)}` +
        `${lead.company ? `\n🏢 *Компания:* ${escapeMarkdown(lead.company)}` : ''}` +
        `${lead.comment ? `\n💬 *Комментарий:* ${escapeMarkdown(lead.comment)}` : ''}`
    );

    return ok({ item: lead });
  } catch (error) {
    return fail(error.message, 400);
  }
}
