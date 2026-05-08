"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const initialize = useUserStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
