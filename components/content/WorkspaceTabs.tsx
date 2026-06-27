// components/content/WorkspaceTabs.tsx
"use client";

import { FileText, Layout, LayoutDashboard, HelpCircle, Megaphone } from "lucide-react";
import type { WorkspaceTab } from "@/services/content/types";

interface Props {
  active: WorkspaceTab;
  onChange: (tab: WorkspaceTab) => void;
  counts: Record<WorkspaceTab, number>;
}

const TABS: { key: WorkspaceTab; label: string; icon: React.ReactNode }[] = [
  { key: "blog", label: "Blog Posts", icon: <FileText size={14} /> },
  { key: "pages", label: "Pages", icon: <Layout size={14} /> },
  { key: "homepage", label: "Homepage", icon: <LayoutDashboard size={14} /> },
  { key: "faqs", label: "FAQs", icon: <HelpCircle size={14} /> },
  { key: "announcements", label: "Announcements", icon: <Megaphone size={14} /> },
];

export default function WorkspaceTabs({ active, onChange, counts }: Props) {
  return (
    <div className="flex gap-0 border-b border-[color:var(--border-subtle)] overflow-x-auto">
      {TABS.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={[
            "flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-0 bg-transparent cursor-pointer transition-colors border-b-2 -mb-px",
            active === t.key
              ? "text-accent border-accent"
              : "text-[color:var(--text-muted)] border-transparent hover:text-foreground",
          ].join(" ")}
        >
          {t.icon}
          {t.label}
          {counts[t.key] > 0 && (
            <span className={[
              "ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
              active === t.key ? "bg-accent/20 text-accent" : "bg-elevated text-[color:var(--text-muted)]",
            ].join(" ")}>
              {counts[t.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
