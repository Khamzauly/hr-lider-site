import { publicList } from '../../../../lib/crud.js';

export async function GET(req) {
  const now = new Date();
  return publicList('events', req, {
    orderBy: { startsAt: 'asc' },
    where: (params) => ({
      ...(params.format === 'ONLINE' || params.format === 'OFFLINE' ? { format: params.format } : {}),
      ...(params.timing === 'upcoming' ? { startsAt: { gte: now } } : {}),
      ...(params.timing === 'past' ? { startsAt: { lt: now } } : {}),
      ...(params.q
        ? {
            OR: [
              { title: { contains: params.q, mode: 'insensitive' } },
              { excerpt: { contains: params.q, mode: 'insensitive' } }
            ]
          }
        : {})
    })
  });
}
