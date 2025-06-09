'use client';

import { useRoleSync } from '@/hooks/use-role-sync';

export function RoleSyncProvider({ children }: { children: React.ReactNode }) {
  // This will automatically sync role cookie when user is authenticated
  useRoleSync();
  
  return <>{children}</>;
}
