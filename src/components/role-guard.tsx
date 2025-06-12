'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

export type UserRole = 'admin' | 'cashier' | 'customer';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  fallbackUrl?: string;
  loadingComponent?: React.ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles = [],
  requireAuth = true,
  fallbackUrl = '/',
  loadingComponent = <div>Loading...</div>,
}: RoleGuardProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const user = session?.user;
  const userRole = user?.role as UserRole;

  useEffect(() => {
    if (!isPending) {
      // Check if authentication is required but user is not authenticated
      if (requireAuth && !session) {
        const currentPath = window.location.pathname;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      // Check role-based access if roles are specified
      if (session && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        console.log(`[RoleGuard] Access denied. User role: ${userRole}, Allowed roles:`, allowedRoles);
        
        // Role-based redirects
        if (userRole === 'admin') {
          router.push('/dashboard/admin');
        } else if (userRole === 'cashier') {
          router.push('/dashboard/cashier');
        } else {
          router.push(fallbackUrl);
        }
        return;
      }
    }
  }, [session, isPending, userRole, allowedRoles, requireAuth, fallbackUrl, router]);

  // Show loading while checking authentication
  if (isPending) {
    return <>{loadingComponent}</>;
  }

  // If auth is required but no session, don't render children (redirect will happen)
  if (requireAuth && !session) {
    return null;
  }

  // If roles are specified and user doesn't have access, don't render children
  if (session && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
}

// Specific role guards for convenience
export function AdminOnly({ children, ...props }: Omit<RoleGuardProps, 'allowedRoles'>) {
  return (
    <RoleGuard allowedRoles={['admin']} fallbackUrl="/dashboard/admin" {...props}>
      {children}
    </RoleGuard>
  );
}

export function CashierOnly({ children, ...props }: Omit<RoleGuardProps, 'allowedRoles'>) {
  return (
    <RoleGuard allowedRoles={['cashier']} fallbackUrl="/dashboard/cashier" {...props}>
      {children}
    </RoleGuard>
  );
}

export function CustomerOnly({ children, ...props }: Omit<RoleGuardProps, 'allowedRoles'>) {
  return (
    <RoleGuard allowedRoles={['customer']} fallbackUrl="/" {...props}>
      {children}
    </RoleGuard>
  );
}

export function StaffOnly({ children, ...props }: Omit<RoleGuardProps, 'allowedRoles'>) {
  return (
    <RoleGuard allowedRoles={['admin', 'cashier']} fallbackUrl="/" {...props}>
      {children}
    </RoleGuard>
  );
}
