import { adminCreate, adminList } from '../../../../lib/crud.js';

export async function GET(req) {
  return adminList('events', req, {
    orderBy: { startsAt: 'desc' },
    include: { _count: { select: { registrations: true } } }
  });
}

export async function POST(req) {
  return adminCreate('events', req);
}
