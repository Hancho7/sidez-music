// components/account/AccountShell.tsx
"use client";

import type { AccountTab } from "@/services/account/types";

// ── Header ───────────────────────────────────────────────────────

interface HeaderProps {
  name: string;
  email: string;
  avatar: string | null;
}

export function AccountHeader({ name, email, avatar }: HeaderProps) {
  const initials = name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
          Account
        </div>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-[10px] overflow-hidden border-2 border-[color:var(--border-subtle)] shrink-0 bg-elevated flex items-center justify-center">
            {avatar
              ? <img src={avatar} alt={name} className="w-full h-full object-cover" />
              : <span className="text-xl font-bold text-[color:var(--text-secondary)]">{initials}</span>
            }
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground m-0 tracking-tight leading-tight">{name}</h1>
          </div>
        </div>
        <p className="mt-1.5 text-sm text-[color:var(--text-muted)]">{email}</p>
      </div>
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────

const TABS: { key: AccountTab; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "security", label: "Security" },
  { key: "sessions", label: "Sessions" },
  { key: "preferences", label: "Preferences" },
  { key: "notifications", label: "Notifications" },
  { key: "tokens", label: "API Tokens" },
  { key: "activity", label: "Activity" },
];

export function AccountTabs({ active, onChange }: { active: AccountTab; onChange: (t: AccountTab) => void }) {
  return (
    <div className="flex gap-0 border-b border-[color:var(--border-subtle)] overflow-x-auto">
      {TABS.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={[
            "px-4 py-3 text-sm font-semibold whitespace-nowrap border-0 bg-transparent cursor-pointer transition-colors border-b-2 -mb-px",
            active === t.key
              ? "text-accent border-accent"
              : "text-[color:var(--text-muted)] border-transparent hover:text-foreground",
          ].join(" ")}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Layout primitives (account-specific, no form overlap) ─────────

export function SectionCard({ title, description, children, action }: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-[10px] overflow-hidden">
      <div className="px-5 py-4 border-b border-[color:var(--border-subtle)] bg-elevated/20 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-foreground">{title}</p>
          {description && <p className="text-xs text-[color:var(--text-muted)] mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      <div className="p-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}

export function FieldRow({ label, description, children }: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-6">
      <div className="w-44 shrink-0 pt-0.5">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {description && <p className="text-xs text-[color:var(--text-muted)] mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
