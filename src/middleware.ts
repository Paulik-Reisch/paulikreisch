import { NextResponse, type NextRequest } from 'next/server';
import { ANALYTICS_HOST, ANALYTICS_ORIGIN, STATIC_HOST, isHiddenManagementPath } from './lib/management-hosts';
import {
  ADMIN_HOST, ADMIN_ORIGIN, PUBLIC_HOST, PUBLIC_ORIGIN,
  isPrivilegedPath, isLocalHost, isSafeMethod, isSameOrigin, isSiteHost, requestHost,
} from './lib/admin-host-policy';

function privateResponse(response: NextResponse) {
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

export function middleware(request: NextRequest) {
  const host = requestHost(request.headers);
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const protectedPath = isPrivilegedPath(path);
  const safe = isSafeMethod(request.method);
  const local = process.env.NODE_ENV !== 'production' && isLocalHost(host);
  const reject = () => privateResponse(new NextResponse('Forbidden', { status: 403 }));
  // The path comes from NextURL, but assigning pathname separately also prevents
  // protocol-relative paths from replacing our fixed destination's authority.
  const move = (origin: string, destinationPath = path) => {
    const url = new URL(origin);
    url.pathname = destinationPath;
    url.search = search;
    return NextResponse.redirect(url, 301);
  };

  if ((host === PUBLIC_HOST || host === ADMIN_HOST || host === STATIC_HOST) && (path === '/upload' || path === '/upload/')) {
    return safe ? privateResponse(move(ADMIN_ORIGIN, '/admin/upload')) : reject();
  }
  // File gateway is a separate public-download surface. Never accept mutation POSTs here.
  if (host === STATIC_HOST) {
    if (safe && /^\/f\/[a-f0-9-]{36}$/.test(path)) {
      const url=request.nextUrl.clone();url.pathname='/static-private'+path;url.search='';
      return privateResponse(NextResponse.rewrite(url));
    }
    return privateResponse(new NextResponse('Not found',{status:404}));
  }
  // Dedicated analytics surface: no content mutation routes or ambient admin cookie.
  if (host === ANALYTICS_HOST) {
    const destination = path === '/' ? '/analytics-private' : path === '/login' ? '/analytics-private/login' : null;
    if (destination) {
      if (!safe && !isSameOrigin(request.headers.get('origin'), ANALYTICS_HOST, true)) return reject();
      const url = request.nextUrl.clone(); url.pathname = destination; url.search = '';
      return privateResponse(NextResponse.rewrite(url));
    }
    if (safe && (path.startsWith('/_next/') || path === '/favicon.ico')) return privateResponse(NextResponse.next());
    return privateResponse(new NextResponse('Not found', {status:404}));
  }
  // Never expose implementation paths on apex, default backend, admin or another subdomain.
  if (isHiddenManagementPath(path)) return privateResponse(new NextResponse('Not found',{status:404}));
  if (host === ADMIN_HOST && (path === '/admin/analytics' || path.startsWith('/admin/analytics/'))) {
    return safe ? privateResponse(move(ANALYTICS_ORIGIN, '/')) : reject();
  }

  if (host === ADMIN_HOST || local) {
    if (!safe && ((!local && !protectedPath) || (protectedPath && !isSameOrigin(request.headers.get('origin'), host!, !local)))) return reject();
    if (local) return protectedPath ? privateResponse(NextResponse.next()) : NextResponse.next();
    if (path === '/') return privateResponse(move(ADMIN_ORIGIN, '/admin'));
    if (protectedPath) return privateResponse(NextResponse.next());
    // Assets are shared by both surfaces. Never let an extension bypass the
    // /admin and /login decisions above.
    if (path.startsWith('/_next/') || /\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|woff2?|css|js|webmanifest)$/.test(path)) {
      return privateResponse(NextResponse.next());
    }
    return safe ? privateResponse(move(PUBLIC_ORIGIN)) : reject();
  }

  // An action POST must never be redirected across hosts with its body intact.
  if (protectedPath) return safe ? privateResponse(move(ADMIN_ORIGIN)) : reject();
  if (!host || !isSiteHost(host)) {
    // App Hosting health/default-backend public routes remain unchanged, but
    // no privileged route is served on those authorities.
    return NextResponse.next();
  }
  if (host !== PUBLIC_HOST) return safe ? move(PUBLIC_ORIGIN) : reject();
  return NextResponse.next();
}

// Include assets and metadata so admin-host responses all receive noindex.
export const config = { matcher: ['/:path*'] };
