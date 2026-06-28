import { adminDelete, adminGet } from '../../../../../lib/crud.js';

export async function GET(req, { params }) {
  const resolvedParams = await params;
  return adminGet('leads', resolvedParams.id);
}

export async function DELETE(req, { params }) {
  const resolvedParams = await params;
  return adminDelete('leads', resolvedParams.id);
}
