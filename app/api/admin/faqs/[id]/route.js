import { adminDelete, adminGet, adminUpdate } from '../../../../../lib/crud.js';

export async function GET(_req, { params }) {
  return adminGet('faqs', params.id);
}

export async function PUT(req, { params }) {
  return adminUpdate('faqs', params.id, req);
}

export async function DELETE(_req, { params }) {
  return adminDelete('faqs', params.id);
}
