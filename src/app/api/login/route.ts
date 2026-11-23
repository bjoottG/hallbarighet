import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE, AUTH_TOKEN, PASSWORD } from '@/lib/auth';

function safeNext(value: FormDataEntryValue | null): string {
  const s = typeof value === 'string' ? value : '';
  return s.startsWith('/') && !s.startsWith('//') ? s : '/ansokningar';
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const next = safeNext(form.get('next'));

  if (form.get('password') !== PASSWORD) {
    const url = new URL('/login', req.url);
    url.searchParams.set('fel', '1');
    if (next !== '/ansokningar') url.searchParams.set('next', next);
    return NextResponse.redirect(url, 303);
  }

  const res = NextResponse.redirect(new URL(next, req.url), 303);
  res.cookies.set(AUTH_COOKIE, AUTH_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
