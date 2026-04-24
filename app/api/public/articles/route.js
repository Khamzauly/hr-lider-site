import { publicList } from '../../../../lib/crud.js';

export async function GET(req) {
  return publicList('articles', req, {
    orderBy: { publishedAt: 'desc' },
    where: (params) => ({
      ...(params.category ? { category: params.category } : {}),
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
