"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

import { supabase } from "@/lib/supabase";
import { usePathname, useRouter } from "next/navigation";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { initialize, setUserId } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
        initialize(session.user.id);
      } else {
        const isGuest = typeof window !== 'undefined' && localStorage.getItem('jarvis_guest_mode') === 'true';
        if (isGuest) {
          initialize('00000000-0000-0000-0000-000000000000');
        } else {
          initialize('00000000-0000-0000-0000-000000000000');
          if (pathname !== '/login') {
            router.push('/login');
          }
        }
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUserId(session.user.id);
        initialize(session.user.id);
        if (pathname === '/login') {
          router.push('/');
        }
      } else {
        const isGuest = typeof window !== 'undefined' && localStorage.getItem('jarvis_guest_mode') === 'true';
        initialize('00000000-0000-0000-0000-000000000000');
        if (!isGuest && pathname !== '/login') {
          router.push('/login');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [initialize, setUserId, router, pathname]);

  return <>{children}</>;
}
