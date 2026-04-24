import { adminDelete, adminGet, adminUpdate } from '../../../../../lib/crud.js';

export async function GET(_req, { params }) {
  return adminGet('services', params.id);
}

export async function PUT(req, { params }) {
  return adminUpdate('services', params.id, req);
}

export async function DELETE(_req, { params }) {
  return adminDelete('services', params.id);
}
