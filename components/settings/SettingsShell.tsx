// components/settings/SettingsShell.tsx
"use client";

import { Save, RotateCcw, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import type { SettingsTab } from "@/services/settings/types";

// ── Header ───────────────────────────────────────────────────────

export function SettingsHeader({
  isDirty, onSave, onRestoreDefaults, saving,
}: {
  isDirty: boolean;
  onSave: () => void;
  onRestoreDefaults: () => void;
  saving: boolean;
}) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
          System
        </div>
        <h1 className="text-2xl font-bold text-foreground m-0 tracking-tight leading-tight">Settings</h1>
        <p className="mt-1.5 text-sm text-[color:var(--text-muted)]">Configure platform-wide preferences, services, and system behavior.</p>
      </div>
      <div className="flex items-center gap-2.5">
        {isDirty && (
          <span className="text-xs font-semibold text-[color:var(--color-warning)] bg-[color:var(--color-warning)]/10 px-2.5 py-1 rounded-[10px]">
            Unsaved changes
          </span>
        )}
        <Button variant="secondary" size="md" icon={<RotateCcw size={14} />} onClick={onRestoreDefaults}>
          Restore Defaults
        </Button>
        <Button variant="primary" size="md" icon={<Save size={14} />} onClick={onSave} loading={saving} disabled={!isDirty}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────

const TABS: { key: SettingsTab; label: string }[] = [
  { key: "general", label: "General" },
  { key: "branding", label: "Branding" },
  { key: "localization", label: "Localization" },
  { key: "payments", label: "Payments" },
  { key: "storage", label: "Storage" },
  { key: "email", label: "Email" },
  { key: "security", label: "Security" },
  { key: "seo", label: "SEO" },
  { key: "integrations", label: "Integrations" },
  { key: "notifications", label: "Notifications" },
  { key: "maintenance", label: "Maintenance" },
  { key: "audit", label: "Audit Log" },
];

export function SettingsTabs({ active, onChange }: { active: SettingsTab; onChange: (t: SettingsTab) => void }) {
  return (
    <div className="flex gap-0 border-b border-[color:var(--border-subtle)] overflow-x-auto">
      {TABS.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={[
            "px-4 py-3 text-sm font-semibold whitespace-nowrap border-0 bg-transparent cursor-pointer transition-colors border-b-2 -mb-px",
            active === t.key ? "text-accent border-accent" : "text-[color:var(--text-muted)] border-transparent hover:text-foreground",
          ].join(" ")}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Layout primitives (settings-specific, no form overlap) ────────

export function SectionCard({ title, description, children }: {
  title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-[10px] overflow-hidden">
      <div className="px-5 py-4 border-b border-[color:var(--border-subtle)] bg-elevated/20">
        <p className="text-sm font-bold text-foreground">{title}</p>
        {description && <p className="text-xs text-[color:var(--text-muted)] mt-0.5">{description}</p>}
      </div>
      <div className="p-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}

export function FieldRow({ label, description, children }: {
  label: string; description?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="min-w-0 shrink-0 w-56">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {description && <p className="text-xs text-[color:var(--text-muted)] mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

// ── MaskedInput — kept here because it has eye-toggle behaviour ───
// not present in the global ui/Input component

export function MaskedInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface border border-[color:var(--border-subtle)] rounded-[10px] text-sm text-foreground font-inherit px-3.5 py-2.5 pr-10 outline-none focus:border-accent transition-colors placeholder:text-[color:var(--text-muted)] font-mono"
      />
      <button
        type="button"
        onClick={() => setVisible(v => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] cursor-pointer hover:text-foreground transition-colors bg-transparent border-0"
      >
        {visible ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}

// ── Toggle — kept here; used in Integrations with label="" pattern ─

export function SettingsToggle({ checked, onChange, label, description }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      {label && (
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          {description && <p className="text-xs text-[color:var(--text-muted)] mt-0.5">{description}</p>}
        </div>
      )}
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-[10px] border-0 cursor-pointer relative shrink-0 transition-colors duration-200 ${checked ? "bg-accent" : "bg-[color:var(--border-subtle)]"}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-[10px] bg-white transition-all duration-200 shadow-sm ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

// ── DangerZone ────────────────────────────────────────────────────

export function DangerZone({ title, description, action, actionLabel }: {
  title: string; description: string; action: () => void; actionLabel: string;
}) {
  return (
    <div className="bg-danger/5 border border-danger/20 rounded-[10px] p-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-[color:var(--text-muted)] mt-0.5">{description}</p>
      </div>
      <Button variant="danger" size="md" onClick={action} className="shrink-0">
        {actionLabel}
      </Button>
    </div>
  );
}
