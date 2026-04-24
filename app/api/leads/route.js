import { fail, ok, readJson } from '../../../lib/http.js';
import { prisma } from '../../../lib/prisma.js';
import { sendTelegramMessage } from '../../../lib/telegram.js';
import { cleanOptionalString, cleanString, validatePhone } from '../../../lib/validation.js';

export async function POST(req) {
  try {
    const body = await readJson(req);
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

    await sendTelegramMessage(
      `📋 *Новая заявка HR Lider*\n\n👤 *Имя:* ${lead.name}\n📞 *Телефон:* ${lead.phone}` +
        `${lead.company ? `\n🏢 *Компания:* ${lead.company}` : ''}` +
        `${lead.comment ? `\n💬 *Комментарий:* ${lead.comment}` : ''}`
    );

    return ok({ item: lead });
  } catch (error) {
    return fail(error.message, 400);
  }
}
