import { adminDelete, adminGet, adminUpdate } from '../../../../../lib/crud.js';

export async function GET(_req, { params }) {
  return adminGet('registrations', params.id, {
    include: { event: { select: { id: true, title: true, startsAt: true } } }
  });
}

export async function PUT(req, { params }) {
  return adminUpdate('registrations', params.id, req);
}

export async function DELETE(_req, { params }) {
  return adminDelete('registrations', params.id);
}
