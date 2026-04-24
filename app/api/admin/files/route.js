import { put } from '@vercel/blob';
import { checkAdmin, unauthorized } from '../../../../lib/auth.js';
import { fail, ok } from '../../../../lib/http.js';

export async function POST(req) {
  if (!checkAdmin()) return unauthorized();

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return fail('BLOB_READ_WRITE_TOKEN is not configured', 500);

  const formData = await req.formData();
  const file = formData.get('file');
  const folder = String(formData.get('folder') || 'uploads')
    .replace(/[^a-z0-9-_]/gi, '-')
    .toLowerCase();

  if (!file || typeof file === 'string') {
    return fail('file is required', 400);
  }

  const pathname = `${folder}/${Date.now()}-${file.name.replace(/[^a-z0-9._-]/gi, '-')}`;
  const blob = await put(pathname, file, {
    access: 'public',
    token
  });

  return ok({ item: blob });
}
