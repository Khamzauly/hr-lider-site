import { adminCreate, adminList } from '../../../../lib/crud.js';

export async function GET(req) {
  return adminList('faqs', req, { orderBy: { order: 'asc' } });
}

export async function POST(req) {
  return adminCreate('faqs', req);
}
