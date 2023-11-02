import { withAuth } from 'next-auth/middleware';
import { NextResponse, URLPattern } from 'next/server';

const PATTERNS = [
  [
    new URLPattern({ pathname: '/users/:id' }),
    ({ pathname }) => pathname.groups
  ]
];

const params = url => {
  const input = url.split('?')[0];
  let result = {};

  for (const [pattern, handler] of PATTERNS) {
    const patternResult = pattern.exec(input);
    if (patternResult !== null && 'pathname' in patternResult) {
      result = handler(patternResult);
      break;
    }
  }
  return result;
};

export default withAuth(req => {
  if (req.nextUrl.pathname.startsWith('/users')) {
    const { id } = params(req.url);
    if (req.nextauth.token.userRole !== 'Editor') {
      if (id !== undefined) {
        if (req.nextauth.token.id != id) {
          return NextResponse.redirect(new URL('/posts', req.url));
        }
      } else {
        return NextResponse.redirect(new URL('/posts', req.url));
      }
    }
  }
  if (req.nextUrl.pathname.startsWith('/tags')) {
    if (req.nextauth.token.userRole !== 'Editor') {
      return NextResponse.redirect(new URL('/posts', req.url));
    }
  }
});

export const config = {
  matcher: ['/posts/:path*', '/tags/:path*', '/users/:path*']
};
