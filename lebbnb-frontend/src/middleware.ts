import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Since we're using JWT in localStorage (client-side only),
  // we can't check auth in middleware (server-side)
  // Auth protection is handled by client-side code in each admin page
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
