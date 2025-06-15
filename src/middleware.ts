import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const fullUrl = pathname + search;
  
  console.log(`[Middleware] Processing request for: ${fullUrl}`);

  // Skip middleware for static files, API routes, and auth routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon') ||
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return NextResponse.next();
  }  try {
    // Check for session cookie and user role cookie
    const sessionCookie = request.cookies.get('better-auth.session_token');
    const isAuthenticated = !!sessionCookie?.value;    // Get user role from our custom cookie - try multiple ways to read it
    const roleCookie = request.cookies.get('user-role');
    let userRole = roleCookie?.value || null;
    
    // Fallback: try reading from raw cookie header
    if (!userRole) {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const match = cookieHeader.match(/user-role=([^;]+)/);
        userRole = match ? match[1] : null;
      }
    }
    
    console.log(`[Middleware] Session for ${pathname}:`, isAuthenticated ? 'authenticated' : 'not authenticated');
    console.log(`[Middleware] Role cookie object:`, roleCookie);
    console.log(`[Middleware] Role cookie value:`, roleCookie?.value || 'NOT_FOUND');
    console.log(`[Middleware] Final user role:`, userRole || 'none');
    console.log(`[Middleware] Raw cookie header:`, request.headers.get('cookie'));
    console.log(`[Middleware] All cookies:`, Object.fromEntries(
      Array.from(request.cookies).map(([name, cookie]) => [name, cookie.value])
    ));// Define route access rules
    const customerOnlyRoutes = [
      '/cart',
      '/order',
      '/order-history',
      '/payment',
      '/payment-complete',
      '/profile',
    ];

    const adminOnlyRoutes = [
      '/dashboard/admin'
    ];

    const cashierOnlyRoutes = [
      '/dashboard/cashier'
    ];

    const staffOnlyRoutes = [...adminOnlyRoutes, ...cashierOnlyRoutes];

    // Check if current path requires authentication
    const requiresAuth = [...customerOnlyRoutes, ...staffOnlyRoutes].some(path => pathname.startsWith(path));

    // If user is not authenticated and trying to access protected route
    if (requiresAuth && !isAuthenticated) {
      console.log(`[Middleware] Redirecting unauthenticated user from ${pathname} to /login`);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }    // Role-based access control for authenticated users
    if (isAuthenticated) {
      console.log(`[Middleware] Checking role-based access for ${userRole || 'NO_ROLE'} accessing ${pathname}`);

      // If authenticated but no role cookie, this might be a timing issue
      // For critical admin/cashier routes, redirect to login to re-establish role
      if (!userRole && (pathname.startsWith('/dashboard/admin') || pathname.startsWith('/dashboard/cashier'))) {
        console.log(`[Middleware] No role cookie for dashboard access, redirecting to login for re-authentication`);
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Admin role restrictions
      if (userRole === 'admin') {
        // Admin cannot access customer-only routes
        if (customerOnlyRoutes.some(route => pathname.startsWith(route))) {
          console.log(`[Middleware] Blocking admin access to customer route: ${pathname}`);
          return NextResponse.redirect(new URL('/dashboard/admin', request.url));
        }
        
        // Admin cannot access cashier dashboard
        if (pathname.startsWith('/dashboard/cashier')) {
          console.log(`[Middleware] Redirecting admin from cashier dashboard to admin dashboard`);
          return NextResponse.redirect(new URL('/dashboard/admin', request.url));
        }
        
        // Redirect admin from general dashboard to admin dashboard
        if (pathname === '/dashboard') {
          console.log(`[Middleware] Redirecting admin from general dashboard to admin dashboard`);
          return NextResponse.redirect(new URL('/dashboard/admin', request.url));
        }

        // Block admin from accessing home page and public customer routes
        if (pathname === '/' || pathname.startsWith('/coffee-landing') || pathname.startsWith('/coffee-list')) {
          console.log(`[Middleware] Blocking admin access to public route: ${pathname}`);
          return NextResponse.redirect(new URL('/dashboard/admin', request.url));
        }
      }
      
      // Cashier role restrictions
      else if (userRole === 'cashier') {
        // Cashier cannot access customer-only routes
        if (customerOnlyRoutes.some(route => pathname.startsWith(route))) {
          console.log(`[Middleware] Blocking cashier access to customer route: ${pathname}`);
          return NextResponse.redirect(new URL('/dashboard/cashier', request.url));
        }
        
        // Cashier cannot access admin dashboard
        if (pathname.startsWith('/dashboard/admin')) {
          console.log(`[Middleware] Redirecting cashier from admin dashboard to cashier dashboard`);
          return NextResponse.redirect(new URL('/dashboard/cashier', request.url));
        }
        
        // Redirect cashier from general dashboard to cashier dashboard
        if (pathname === '/dashboard') {
          console.log(`[Middleware] Redirecting cashier from general dashboard to cashier dashboard`);
          return NextResponse.redirect(new URL('/dashboard/cashier', request.url));
        }

        // Block cashier from accessing home page and public customer routes
        if (pathname === '/' || pathname.startsWith('/coffee-landing') || pathname.startsWith('/coffee-list')) {
          console.log(`[Middleware] Blocking cashier access to public route: ${pathname}`);
          return NextResponse.redirect(new URL('/dashboard/cashier', request.url));
        }
      }
      
      // Customer role restrictions
      else if (userRole === 'customer') {
        // Customer cannot access admin dashboard
        if (pathname.startsWith('/dashboard/admin')) {
          console.log(`[Middleware] Blocking customer access to admin dashboard: ${pathname}`);
          return NextResponse.redirect(new URL('/', request.url));
        }
        
        // Customer cannot access cashier dashboard
        if (pathname.startsWith('/dashboard/cashier')) {
          console.log(`[Middleware] Blocking customer access to cashier dashboard: ${pathname}`);
          return NextResponse.redirect(new URL('/', request.url));
        }

        // Redirect customer from general dashboard to home
        if (pathname === '/dashboard') {
          console.log(`[Middleware] Redirecting customer from dashboard to home`);
          return NextResponse.redirect(new URL('/', request.url));
        }
      }      // Handle users with no role or unknown role
      if (!userRole || !['admin', 'cashier', 'customer'].includes(userRole)) {
        console.log(`[Middleware] User has no role or unknown role: ${userRole}`);
        
        // If trying to access admin or cashier routes without proper role, redirect to login
        if (pathname.startsWith('/dashboard')) {
          console.log(`[Middleware] Redirecting user with no/unknown role from dashboard to login`);
          return NextResponse.redirect(new URL('/login', request.url));
        }
        
        // For other routes, treat as unauthenticated visitor (allow public access)
        console.log(`[Middleware] Allowing public access for user with no role`);
        return NextResponse.next();
      }
    }

    // If authenticated but no role cookie, treat as customer for now
    if (isAuthenticated && !userRole) {
      console.log(`[Middleware] Authenticated user with no role, blocking dashboard access`);
      if (pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // Allow access if no restrictions apply
    console.log(`[Middleware] Allowing access to: ${pathname}`);
    return NextResponse.next();

  } catch (error) {
    console.error('[Middleware] Error checking session:', error);
    
    // If there's an error and the route requires auth, redirect to login
    const protectedPaths = ['/dashboard', '/cart', '/order', '/payment'];
    const requiresAuth = protectedPaths.some(path => pathname.startsWith(path));
    
    if (requiresAuth) {
      console.log(`[Middleware] Error occurred, redirecting to login from ${pathname}`);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};
