import { checkAdmin, unauthorized } from '../../../../lib/auth.js';
import { fail, ok, readJson } from '../../../../lib/http.js';
import { prisma } from '../../../../lib/prisma.js';
import { cleanOptionalString } from '../../../../lib/validation.js';

function settingsData(body) {
  return {
    phone: cleanOptionalString(body.phone, 80),
    email: cleanOptionalString(body.email, 160),
    whatsapp: cleanOptionalString(body.whatsapp, 80),
    seoTitle: cleanOptionalString(body.seoTitle, 180),
    seoDescription: cleanOptionalString(body.seoDescription, 500)
  };
}

export async function GET() {
  if (!checkAdmin()) return unauthorized();
  const item = await prisma.siteSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: { id: 'main' }
  });
  return ok({ item });
}

export async function PUT(req) {
  if (!checkAdmin()) return unauthorized();
  try {
    const body = await readJson(req);
    const item = await prisma.siteSettings.upsert({
      where: { id: 'main' },
      update: settingsData(body),
      create: { id: 'main', ...settingsData(body) }
    });
    return ok({ item });
  } catch (error) {
    return fail(error.message, 400);
  }
}
