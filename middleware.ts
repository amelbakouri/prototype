import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');

  // Si l'utilisateur est connecté, on l'empêche d'accéder à /login ou /register
  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Si l'utilisateur n'est pas connecté et tente d'accéder à une route protégée
  if (!isAuth && protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // pages protégées
    '/dashboard/:path*',
    '/profil/:path*',
    '/admin/:path*',
    '/facture/:path*',
    '/devis/:path*',
  ],
};

const protectedRoutes = ['/dashboard', '/profil', '/admin', '/facture', '/devis'];
