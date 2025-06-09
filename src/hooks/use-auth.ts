import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export type UserRole = 'admin' | 'cashier' | 'customer';

export function useRoleBasedRedirect() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const user = session?.user;
  const userRole = user?.role as UserRole;

  useEffect(() => {
    if (!isPending && session && user) {
      const currentPath = window.location.pathname;
      
      // Role-based redirects
      if (userRole === 'admin') {
        // Admin should only be on admin dashboard
        if (currentPath.startsWith('/dashboard') && !currentPath.startsWith('/dashboard/admin')) {
          router.push('/dashboard/admin');
        }
        // Block admin from customer routes
        if (currentPath.startsWith('/cart') || 
            currentPath.startsWith('/order') || 
            currentPath.startsWith('/payment') ||
            currentPath.startsWith('/product')) {
          router.push('/dashboard/admin');
        }
      } else if (userRole === 'cashier') {
        // Cashier should only be on cashier dashboard
        if (currentPath.startsWith('/dashboard') && !currentPath.startsWith('/dashboard/cashier')) {
          router.push('/dashboard/cashier');
        }
        // Block cashier from customer routes
        if (currentPath.startsWith('/cart') || 
            currentPath.startsWith('/order') || 
            currentPath.startsWith('/payment') ||
            currentPath.startsWith('/product')) {
          router.push('/dashboard/cashier');
        }
      } else if (userRole === 'customer') {
        // Block customer from admin/cashier dashboards
        if (currentPath.startsWith('/dashboard/admin') || 
            currentPath.startsWith('/dashboard/cashier')) {
          router.push('/');
        }
        // Redirect customer from general dashboard to home
        if (currentPath === '/dashboard') {
          router.push('/');
        }
      }
    }
  }, [session, isPending, userRole, router]);

  return { user, userRole, isLoading: isPending };
}

export function useRequireAuth(redirectTo = '/login') {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      const currentPath = window.location.pathname;
      router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [session, isPending, router, redirectTo]);

  return { session, isLoading: isPending, isAuthenticated: !!session };
}

export function useRoleAccess(allowedRoles: UserRole[]) {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const userRole = user?.role as UserRole;

  const hasAccess = allowedRoles.includes(userRole);

  return {
    hasAccess,
    userRole,
    isLoading: isPending,
    user,
  };
}

// Helper function to check if user has specific role
export function hasRole(session: any, role: UserRole): boolean {
  return session?.user?.role === role;
}

// Helper function to check if user has any of the specified roles
export function hasAnyRole(session: any, roles: UserRole[]): boolean {
  return roles.includes(session?.user?.role);
}
