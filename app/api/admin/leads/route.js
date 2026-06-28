import { adminList } from '../../../../lib/crud.js';

export async function GET(req) {
  return adminList('leads', req, {
    orderBy: { createdAt: 'desc' },
  });
}
