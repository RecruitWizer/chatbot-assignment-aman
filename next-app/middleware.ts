// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('next-auth.session-token')?.value;
  console.log(currentUser, request.url);
 
  if (currentUser) {
    if (request.nextUrl.pathname.startsWith('/chat')) {
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/chat', request.url))
  }
  else if (request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.next();
  }
  else {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
 
export const config = {
    matcher: [
        '/',
        '/login',
        '/chat'
    ]
}