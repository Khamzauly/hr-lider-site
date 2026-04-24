import { createSession, setSessionCookie } from '../../../../lib/auth.js';
import { fail, ok, readJson } from '../../../../lib/http.js';

export async function POST(req) {
  const body = await readJson(req);
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const adminPassword = String(process.env.ADMIN_PASSWORD || '');

  if (!adminEmail || !adminPassword) {
    return fail('Admin credentials are not configured', 500);
  }

  if (email !== adminEmail || password !== adminPassword) {
    return fail('Invalid email or password', 401);
  }

  const response = ok({ user: { email } });
  setSessionCookie(response, createSession(email));
  return response;
}
