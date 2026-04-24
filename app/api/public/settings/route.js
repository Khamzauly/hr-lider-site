import { ok } from '../../../../lib/http.js';
import { prisma } from '../../../../lib/prisma.js';

export async function GET() {
  const item = await prisma.siteSettings.findUnique({ where: { id: 'main' } });
  return ok({ item });
}
