import { publicList } from '../../../../lib/crud.js';

export async function GET(req) {
  return publicList('services', req, { orderBy: { order: 'asc' } });
}
