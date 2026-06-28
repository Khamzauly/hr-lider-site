import { fail, ok, readJson } from '../../../../../lib/http.js';
import { prisma } from '../../../../../lib/prisma.js';
import { safeSendTelegramMessage, escapeMarkdown, telegramDeliveryStatus } from '../../../../../lib/telegram.js';
import {
  isSpamTrapFilled,
  cleanOptionalString,
  cleanString,
  validateEmail,
  validatePhone
} from '../../../../../lib/validation.js';

export async function POST(req, { params }) {
  try {
    const resolvedParams = await params;
    const body = await readJson(req);
    if (isSpamTrapFilled(body)) return ok({ skipped: true });

    const event = await prisma.event.findFirst({
      where: { id: resolvedParams.id, status: 'PUBLISHED' },
      include: { _count: { select: { registrations: true } } }
    });

    if (!event) return fail('Event not found', 404);
    if (!event.registrationEnabled) return fail('Registration is closed', 409);
    if (event.seatsLimit && event._count.registrations >= event.seatsLimit) {
      return fail('No seats available', 409);
    }

    const name = cleanString(body.name, 120);
    const phone = validatePhone(body.phone);
    if (!name || name.length < 2) return fail('name is required');

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: event.id,
        name,
        phone,
        email: validateEmail(body.email),
        company: cleanOptionalString(body.company, 160),
        position: cleanOptionalString(body.position, 160),
        comment: cleanOptionalString(body.comment, 2000)
      }
    });

    const notification = await safeSendTelegramMessage(
      `🎓 *Регистрация на мероприятие HR Lider*\n\n📌 *Мероприятие:* ${escapeMarkdown(event.title)}\n👤 *Имя:* ${escapeMarkdown(registration.name)}\n📞 *Телефон:* ${escapeMarkdown(registration.phone)}` +
        `${registration.email ? `\n✉️ *Email:* ${escapeMarkdown(registration.email)}` : ''}` +
        `${registration.company ? `\n🏢 *Компания:* ${escapeMarkdown(registration.company)}` : ''}` +
        `${registration.position ? `\n💼 *Должность:* ${escapeMarkdown(registration.position)}` : ''}` +
        `${registration.comment ? `\n💬 *Комментарий:* ${escapeMarkdown(registration.comment)}` : ''}`
    );

    console.info(
      'hr_lider_event_registration_notification',
      JSON.stringify({ status: telegramDeliveryStatus(notification), eventId: event.id })
    );

    return ok({
      item: registration,
      message: 'Спасибо! Мы получили регистрацию и свяжемся с вами для подтверждения участия.'
    });
  } catch (error) {
    return fail(error.message, 400);
  }
}
