import { NextResponse } from 'next/server';

export function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

export function ok(data = {}) {
  return json({ ok: true, ...data });
}

export function fail(message, status = 400, details) {
  return json({ ok: false, error: message, details }, status);
}

export async function readJson(req) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

export function parseListParams(req) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(Number(searchParams.get('page') || 1), 1);
  const limit = Math.min(Math.max(Number(searchParams.get('limit') || 20), 1), 100);
  const q = searchParams.get('q')?.trim() || '';
  const category = searchParams.get('category')?.trim() || '';
  const format = searchParams.get('format')?.trim().toUpperCase() || '';
  const timing = searchParams.get('timing')?.trim() || '';

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    q,
    category,
    format,
    timing
  };
}
