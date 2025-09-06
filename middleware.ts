import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './i18n';

export default createMiddleware({
  locales,
  defaultLocale
});

export const config = {
  matcher: [
    // Match all pathnames except for API routes, static files, and Next.js internals  
    '/((?!api|_next|_vercel|favicon.ico).*)'
  ]
};