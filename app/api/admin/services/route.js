import { adminCreate, adminList } from '../../../../lib/crud.js';

export async function GET(req) {
  return adminList('services', req, { orderBy: { order: 'asc' } });
}

export async function POST(req) {
  return adminCreate('services', req);
}
