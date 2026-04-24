import { publicList } from '../../../../lib/crud.js';

export async function GET(req) {
  return publicList('stats', req, { orderBy: { order: 'asc' } });
}
