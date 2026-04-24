import { publicList } from '../../../../lib/crud.js';

export async function GET(req) {
  return publicList('faqs', req, { orderBy: { order: 'asc' } });
}
