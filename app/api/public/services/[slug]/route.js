import { publicBySlug } from '../../../../../lib/crud.js';

export async function GET(_req, { params }) {
  return publicBySlug('services', params.slug);
}
