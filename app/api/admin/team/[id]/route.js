import { adminDelete, adminGet, adminUpdate } from '../../../../../lib/crud.js';

export async function GET(_req, { params }) {
  return adminGet('team', params.id);
}

export async function PUT(req, { params }) {
  return adminUpdate('team', params.id, req);
}

export async function DELETE(_req, { params }) {
  return adminDelete('team', params.id);
}
