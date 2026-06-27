// components/users/WorkspaceTabs.tsx
"use client";

import { Users, Shield, Key, Mail, Monitor, Activity } from "lucide-react";
import type { UsersTab } from "@/services/users/types";

interface Props {
  active: UsersTab;
  onChange: (tab: UsersTab) => void;
  counts: Partial<Record<UsersTab, number>>;
}

const TABS: { key: UsersTab; label: string; icon: React.ReactNode }[] = [
  { key: "users", label: "Users", icon: <Users size={14} /> },
  { key: "roles", label: "Roles", icon: <Shield size={14} /> },
  { key: "permissions", label: "Permissions", icon: <Key size={14} /> },
  { key: "invitations", label: "Invitations", icon: <Mail size={14} /> },
  { key: "sessions", label: "Sessions", icon: <Monitor size={14} /> },
  { key: "activity", label: "Activity Logs", icon: <Activity size={14} /> },
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
            active === t.key ? "text-accent border-accent" : "text-[color:var(--text-muted)] border-transparent hover:text-foreground",
          ].join(" ")}
        >
          {t.icon}
          {t.label}
          {(counts[t.key] ?? 0) > 0 && (
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
