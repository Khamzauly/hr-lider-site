import { adminDelete, adminGet, adminUpdate } from '../../../../../lib/crud.js';

export async function GET(_req, { params }) {
  return adminGet('stats', params.id);
}

export async function PUT(req, { params }) {
  return adminUpdate('stats', params.id, req);
}

export async function DELETE(_req, { params }) {
  return adminDelete('stats', params.id);
}
