import { adminCreate, adminList } from '../../../../lib/crud.js';

export async function GET(req) {
  return adminList('articles', req, { orderBy: { updatedAt: 'desc' } });
}

export async function POST(req) {
  return adminCreate('articles', req);
}
