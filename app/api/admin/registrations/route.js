import { adminList } from '../../../../lib/crud.js';
import { checkAdmin, unauthorized } from '../../../../lib/auth.js';
import { ok } from '../../../../lib/http.js';
import { prisma } from '../../../../lib/prisma.js';

export async function GET(req) {
  return adminList('registrations', req, {
    orderBy: { createdAt: 'desc' },
    include: { event: { select: { id: true, title: true, startsAt: true } } }
  });
}

export async function DELETE() {
  if (!checkAdmin()) return unauthorized();
  await prisma.eventRegistration.deleteMany({});
  return ok();
}
