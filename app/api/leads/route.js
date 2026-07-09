import { cleanAttribution, appendAttributionToComment, buildTrackedSource, formatAttributionForTelegram, hasGoogleAdsClick } from '../../../lib/lead-attribution.js';
import { fail, ok, readJson } from '../../../lib/http.js';
import { prisma } from '../../../lib/prisma.js';
import { safeSendTelegramMessage, escapeMarkdown, telegramDeliveryStatus } from '../../../lib/telegram.js';
import { cleanOptionalString, cleanString, isSpamTrapFilled, validatePhone } from '../../../lib/validation.js';

export async function POST(req) {
  try {
    const body = await readJson(req);
    if (isSpamTrapFilled(body)) return ok({ skipped: true });

    const name = cleanString(body.name, 120);
    const phone = validatePhone(body.phone);
    if (!name || name.length < 2) return fail('name is required');

    const attribution = cleanAttribution(body.attribution);
    const source = buildTrackedSource(body.source, attribution);
    const comment = appendAttributionToComment(body.comment, attribution);

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        company: cleanOptionalString(body.company, 160),
        comment,
        source
      }
    });

    const attributionTelegram = formatAttributionForTelegram(attribution);
    const notification = await safeSendTelegramMessage(
      `📋 *Новая заявка HR Lider*\n\n👤 *Имя:* ${escapeMarkdown(lead.name)}\n📞 *Телефон:* ${escapeMarkdown(lead.phone)}` +
        `${lead.company ? `\n🏢 *Компания:* ${escapeMarkdown(lead.company)}` : ''}` +
        `${lead.comment ? `\n💬 *Комментарий:* ${escapeMarkdown(lead.comment)}` : ''}` +
        `\n📍 *Источник:* ${escapeMarkdown(lead.source)}` +
        `${attributionTelegram ? `\n📈 *Реклама:*\n${escapeMarkdown(attributionTelegram)}` : ''}`
    );

    console.info(
      'hr_lider_lead_notification',
      JSON.stringify({
        status: telegramDeliveryStatus(notification),
        source: lead.source,
        hasGoogleAdsClick: hasGoogleAdsClick(attribution),
        utmSource: attribution.utm_source || null,
        utmCampaign: attribution.utm_campaign || null
      })
    );

    return ok({ item: lead });
  } catch (error) {
    return fail(error.message, 400);
  }
}
