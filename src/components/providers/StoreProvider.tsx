"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { usePathname, useRouter } from "next/navigation";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { initialize } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('jarvis_admin') === 'true';
    
    if (!isLoggedIn && pathname !== '/login') {
      router.push('/login');
    } else if (isLoggedIn) {
      initialize('00000000-0000-0000-0000-000000000000');
    }
  }, [initialize, router, pathname]);

  return <>{children}</>;
}
