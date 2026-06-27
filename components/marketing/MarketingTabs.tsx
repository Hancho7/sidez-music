// components/marketing/MarketingTabs.tsx
"use client";

import { Megaphone, LayoutDashboard, Star, Image, MessageSquare, Mail, BarChart3 } from "lucide-react";
import type { MarketingTab } from "@/services/marketing/types";

interface Props {
  active: MarketingTab;
  onChange: (tab: MarketingTab) => void;
  counts: Partial<Record<MarketingTab, number>>;
}

const TABS: { key: MarketingTab; label: string; icon: React.ReactNode }[] = [
  { key: "campaigns", label: "Campaigns", icon: <Megaphone size={14} /> },
  { key: "homepage", label: "Homepage", icon: <LayoutDashboard size={14} /> },
  { key: "featured", label: "Featured Content", icon: <Star size={14} /> },
  { key: "banners", label: "Banners", icon: <Image size={14} /> },
  { key: "popups", label: "Popups", icon: <MessageSquare size={14} /> },
  { key: "newsletter", label: "Newsletter", icon: <Mail size={14} /> },
  { key: "analytics", label: "Analytics", icon: <BarChart3 size={14} /> },
];

export default function MarketingTabs({ active, onChange, counts }: Props) {
  return (
    <div className="flex gap-0 border-b border-[color:var(--border-subtle)] overflow-x-auto">
      {TABS.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={[
            "flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-0 bg-transparent cursor-pointer transition-colors border-b-2 -mb-px",
            active === t.key ? "text-accent border-accent" : "text-[color:var(--text-muted)] border-transparent hover:text-foreground",
          ].join(" ")}
        >
          {t.icon}
          {t.label}
          {(counts[t.key] ?? 0) > 0 && (
            <span className={`ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active === t.key ? "bg-accent/20 text-accent" : "bg-elevated text-[color:var(--text-muted)]"}`}>
              {counts[t.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
