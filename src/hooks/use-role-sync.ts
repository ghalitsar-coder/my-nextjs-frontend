'use client';

import { useEffect } from 'react';
import { useSession } from '@/lib/auth-client';

export function useRoleSync() {
  const { data: session } = useSession();

  useEffect(() => {
    const setRoleCookie = async () => {
      if (session?.user) {
        try {
          console.log('[useRoleSync] Setting role cookie for user:', session.user.role);
          const response = await fetch('/api/set-role', {
            method: 'GET',
            credentials: 'include',
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('[useRoleSync] Role cookie set successfully:', data);
          } else {
            console.error('[useRoleSync] Failed to set role cookie:', response.status);
          }
        } catch (error) {
          console.error('[useRoleSync] Error setting role cookie:', error);
        }
      }
    };

    // Set timeout to ensure session is fully loaded
    const timer = setTimeout(setRoleCookie, 1000);
    
    return () => clearTimeout(timer);
  }, [session]);

  return session;
}
