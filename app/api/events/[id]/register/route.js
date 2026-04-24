import { fail, ok, readJson } from '../../../../../lib/http.js';
import { prisma } from '../../../../../lib/prisma.js';
import { sendTelegramMessage } from '../../../../../lib/telegram.js';
import {
  cleanOptionalString,
  cleanString,
  validateEmail,
  validatePhone
} from '../../../../../lib/validation.js';

export async function POST(req, { params }) {
  try {
    const event = await prisma.event.findFirst({
      where: { id: params.id, status: 'PUBLISHED' },
      include: { _count: { select: { registrations: true } } }
    });

    if (!event) return fail('Event not found', 404);
    if (!event.registrationEnabled) return fail('Registration is closed', 409);
    if (event.seatsLimit && event._count.registrations >= event.seatsLimit) {
      return fail('No seats available', 409);
    }

    const body = await readJson(req);
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

    await sendTelegramMessage(
      `🎓 *Регистрация на мероприятие HR Lider*\n\n📌 *Мероприятие:* ${event.title}\n👤 *Имя:* ${registration.name}\n📞 *Телефон:* ${registration.phone}` +
        `${registration.email ? `\n✉️ *Email:* ${registration.email}` : ''}` +
        `${registration.company ? `\n🏢 *Компания:* ${registration.company}` : ''}` +
        `${registration.position ? `\n💼 *Должность:* ${registration.position}` : ''}` +
        `${registration.comment ? `\n💬 *Комментарий:* ${registration.comment}` : ''}`
    );

    return ok({
      item: registration,
      message: 'Спасибо! Мы получили регистрацию и свяжемся с вами для подтверждения участия.'
    });
  } catch (error) {
    return fail(error.message, 400);
  }
}
