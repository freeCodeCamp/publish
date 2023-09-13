import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(req => {
  if (
    req.nextUrl.pathname.startsWith('/tags') ||
    req.nextUrl.pathname.startsWith('/users')
  ) {
    if (req.nextauth.token.userRole !== 'Editor') {
      return NextResponse.redirect(new URL('/posts', req.url));
    }
  }
});

export const config = {
  matcher: ['/posts/:path*', '/tags/:path*', '/users/:path*']
};
