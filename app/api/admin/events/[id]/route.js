import { adminDelete, adminGet, adminUpdate } from '../../../../../lib/crud.js';

export async function GET(_req, { params }) {
  return adminGet('events', params.id, {
    include: { registrations: { orderBy: { createdAt: 'desc' } } }
  });
}

export async function PUT(req, { params }) {
  return adminUpdate('events', params.id, req);
}

export async function DELETE(_req, { params }) {
  return adminDelete('events', params.id);
}
