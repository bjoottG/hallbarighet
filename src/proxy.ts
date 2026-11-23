import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE, AUTH_TOKEN } from '@/lib/auth';

export function proxy(req: NextRequest) {
  if (req.cookies.get(AUTH_COOKIE)?.value === AUTH_TOKEN) {
    return NextResponse.next();
  }
  const url = new URL('/login', req.url);
  const next = req.nextUrl.pathname + req.nextUrl.search;
  if (next !== '/') url.searchParams.set('next', next);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login|api/login|.*\\.(?:svg|png|jpg|jpeg|ico|webp)$).*)'],
};
