import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { fail } from './http.js';

const COOKIE_NAME = 'hr_lider_admin';

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

function sign(value) {
  return crypto
    .createHmac('sha256', process.env.AUTH_SECRET || 'dev-secret-change-me')
    .update(value)
    .digest('base64url');
}

export function createSession(email) {
  const payload = {
    email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12
  };
  const body = base64url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export function verifySession(token) {
  if (!token || !token.includes('.')) return null;
  const [body, signature] = token.split('.');
  if (sign(body) !== signature) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function setSessionCookie(response, token) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12
  });
}

export function clearSessionCookie(response) {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });
}

export function requireAdmin() {
  const token = cookies().get(COOKIE_NAME)?.value;
  const session = verifySession(token);
  if (!session) return null;
  return session;
}

export function unauthorized() {
  return fail('Unauthorized', 401);
}

export function checkAdmin() {
  return requireAdmin() || false;
}
