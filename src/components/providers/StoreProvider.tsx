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
    // Always use guest mode by default (no login required)
    localStorage.setItem('jarvis_guest_mode', 'true');
    initialize('00000000-0000-0000-0000-000000000000');
  }, [initialize]);

  return <>{children}</>;
}
