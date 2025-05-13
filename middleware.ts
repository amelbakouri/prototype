import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const secret = process.env.NEXTAUTH_SECRET

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret })

  const isAuth = !!token
  const isProtectedRoute = request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/devis')

  if (isProtectedRoute && !isAuth) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
