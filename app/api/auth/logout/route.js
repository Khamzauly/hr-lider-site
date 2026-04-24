import { clearSessionCookie } from '../../../../lib/auth.js';
import { ok } from '../../../../lib/http.js';

export async function POST() {
  const response = ok();
  clearSessionCookie(response);
  return response;
}
