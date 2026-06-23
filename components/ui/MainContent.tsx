// components/ui/MainContent.tsx
"use client";

import { motion } from "framer-motion";
import { useSidebar } from "./SidebarContext";

export default function MainContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <motion.main
      animate={{ marginLeft: collapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="flex-1 min-w-0 p-6"
    >
      {children}
    </motion.main>
  );
}
