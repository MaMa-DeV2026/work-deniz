import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { locales, defaultLocale } from './lib/i18n';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'deniz-watch-super-secret-jwt-key-change-me-in-production'
);
const ADMIN_COOKIE = 'admin_session';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

async function verifyToken(token?: string): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get(ADMIN_COOKIE)?.value;

    if (pathname === '/admin/login') {
      const valid = await verifyToken(token);
      if (valid) {
        const url = req.nextUrl.clone();
        url.pathname = '/admin/dashboard';
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    const valid = await verifyToken(token);
    if (!valid) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  // Run on everything except API, Next internals and static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
