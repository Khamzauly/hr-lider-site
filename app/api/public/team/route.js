import { publicList } from '../../../../lib/crud.js';

export async function GET(req) {
  return publicList('team', req, { orderBy: { order: 'asc' } });
}
