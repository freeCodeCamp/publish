export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/posts/:path*', '/tags/:path*', '/users/:path*']
};
