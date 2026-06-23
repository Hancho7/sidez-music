// components/ui/SidebarContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

interface SidebarCtx {
  collapsed: boolean;
  toggle: () => void;
}

const Ctx = createContext<SidebarCtx>({ collapsed: false, toggle: () => { } });

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Ctx.Provider value={{ collapsed, toggle: () => setCollapsed(p => !p) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSidebar() {
  return useContext(Ctx);
}
