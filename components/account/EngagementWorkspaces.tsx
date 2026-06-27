// components/account/EngagementWorkspaces.tsx
// Sessions + Preferences + Notifications
"use client";

import { Monitor, Smartphone, Tablet, LogOut, MapPin, Clock } from "lucide-react";
import Button from "@/components/ui/Button";
import UISelect from "@/components/ui/Select";
import { SectionCard } from "./AccountShell";
import { Toggle } from "./ProfileAndSecurity";
import type { UserSession, UserPreferences, NotificationPreferences } from "@/services/account/types";

// ── Sessions ──────────────────────────────────────────────────────

const DEVICE_ICONS = {
  desktop: <Monitor size={18} />,
  mobile: <Smartphone size={18} />,
  tablet: <Tablet size={18} />,
};

function fmtRelative(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Active now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function SessionsWorkspace({ sessions, onTerminate, onTerminateAll }: {
  sessions: UserSession[];
  onTerminate: (id: string) => void;
  onTerminateAll: () => void;
}) {
  const others = sessions.filter(s => !s.isCurrent);

  return (
    <div className="flex flex-col gap-5">
      <SectionCard
        title="Active Sessions"
        description={`${sessions.length} session${sessions.length !== 1 ? "s" : ""} signed in`}
        action={
          others.length > 0
            ? <Button variant="secondary" size="md" icon={<LogOut size={13} />} onClick={onTerminateAll}>Sign Out All Others</Button>
            : undefined
        }
      >
        <div className="flex flex-col gap-3">
          {sessions.map(sess => (
            <div
              key={sess.id}
              className={`flex items-center gap-4 p-4 rounded-[10px] border transition-all ${sess.isCurrent ? "border-accent/30 bg-accent/5" : "border-[color:var(--border-subtle)] bg-surface"}`}
            >
              <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${sess.isCurrent ? "bg-accent/10 text-accent" : "bg-elevated text-[color:var(--text-muted)]"}`}>
                {DEVICE_ICONS[sess.deviceType]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{sess.device}</p>
                  {sess.isCurrent && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-success/10 text-success">Current</span>}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-[color:var(--text-muted)]">
                  <span>{sess.browser} · {sess.os}</span>
                  <span className="flex items-center gap-0.5"><MapPin size={9} />{sess.location}</span>
                  <span className="font-mono">{sess.ipAddress}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1 text-[11px] text-[color:var(--text-muted)] justify-end">
                  <Clock size={10} />
                  <span className={sess.isCurrent ? "text-success font-semibold" : ""}>{fmtRelative(sess.lastActive)}</span>
                </div>
                {!sess.isCurrent && (
                  <Button variant="secondary" size="sm" icon={<LogOut size={12} />} onClick={() => onTerminate(sess.id)}>
                    Sign Out
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ── Preferences ───────────────────────────────────────────────────

const LANDING_PAGES = [
  { value: "/dashboard", label: "Dashboard" },
  { value: "/music/tracks", label: "Tracks" },
  { value: "/store/orders", label: "Orders" },
  { value: "/store/customers", label: "Customers" },
  { value: "/reports", label: "Reports" },
];

const DATE_FORMATS = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY (US)" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY (EU)" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD (ISO)" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
];

export function PreferencesWorkspace({ prefs, onChange, onSave, saving }: {
  prefs: UserPreferences;
  onChange: (p: Partial<UserPreferences>) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Appearance" description="Customize how the dashboard looks for you.">
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">Theme</p>
          <div className="grid grid-cols-3 gap-3">
            {(["dark", "light", "system"] as const).map(t => (
              <button
                key={t}
                onClick={() => onChange({ theme: t })}
                className={[
                  "py-3 rounded-[10px] text-sm font-semibold border-0 cursor-pointer transition-all capitalize",
                  prefs.theme === t
                    ? "bg-accent/15 text-accent outline outline-1 outline-accent/40"
                    : "bg-surface text-[color:var(--text-muted)] outline outline-1 outline-[color:var(--border-subtle)] hover:text-foreground hover:outline-[color:var(--border-default)]",
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <Toggle
          checked={prefs.compactMode}
          onChange={v => onChange({ compactMode: v })}
          label="Compact Mode"
          description="Reduce spacing and padding for a denser layout."
        />
        <Toggle
          checked={prefs.sidebarState === "collapsed"}
          onChange={v => onChange({ sidebarState: v ? "collapsed" : "expanded" })}
          label="Collapse Sidebar by Default"
          description="Start with the sidebar minimized."
        />
      </SectionCard>

      <SectionCard title="Navigation & Locale">
        <div>
          <p className="text-sm font-semibold text-foreground mb-1.5">Default Landing Page</p>
          <p className="text-xs text-[color:var(--text-muted)] mb-2">Where you land after signing in.</p>
          <UISelect value={prefs.defaultLandingPage} onChange={v => onChange({ defaultLandingPage: v })}>
            {LANDING_PAGES.map(o => <option key={o.value} value={o.value} className="bg-surface">{o.label}</option>)}
          </UISelect>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground mb-1.5">Language</p>
          <UISelect value={prefs.language} onChange={v => onChange({ language: v })}>
            {LANGUAGES.map(o => <option key={o.value} value={o.value} className="bg-surface">{o.label}</option>)}
          </UISelect>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground mb-1.5">Date Format</p>
          <UISelect value={prefs.dateFormat} onChange={v => onChange({ dateFormat: v as UserPreferences["dateFormat"] })}>
            {DATE_FORMATS.map(o => <option key={o.value} value={o.value} className="bg-surface">{o.label}</option>)}
          </UISelect>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <Button variant="primary" size="md" onClick={onSave} loading={saving}>Save Preferences</Button>
      </div>
    </div>
  );
}

// ── Notifications ─────────────────────────────────────────────────

const NOTIFICATION_ITEMS: { key: keyof NotificationPreferences; label: string; description: string }[] = [
  { key: "emailNotifications", label: "Email Notifications", description: "Receive a daily summary of important activity." },
  { key: "loginAlerts", label: "Login Alerts", description: "Get an email when you sign in from a new device." },
  { key: "orderNotifications", label: "Order Notifications", description: "New orders, payment failures, and refund requests." },
  { key: "offerNotifications", label: "Offer Notifications", description: "When customers submit new price offers." },
  { key: "systemAlerts", label: "System Alerts", description: "Critical errors and platform health warnings." },
  { key: "weeklyDigest", label: "Weekly Digest", description: "A weekly summary of platform performance." },
  { key: "marketingEmails", label: "Marketing Emails", description: "Product updates, tips, and feature announcements." },
];

export function NotificationsWorkspace({ prefs, onChange, onSave, saving }: {
  prefs: NotificationPreferences;
  onChange: (p: Partial<NotificationPreferences>) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Email Notifications" description="Choose which notifications are sent to your email.">
        <div className="flex flex-col gap-1">
          {NOTIFICATION_ITEMS.map((item, i) => (
            <div key={item.key}>
              {i > 0 && <div className="h-px bg-[color:var(--border-subtle)] my-2" />}
              <Toggle
                checked={prefs[item.key]}
                onChange={v => onChange({ [item.key]: v })}
                label={item.label}
                description={item.description}
              />
            </div>
          ))}
        </div>
      </SectionCard>
      <div className="flex justify-end">
        <Button variant="primary" size="md" onClick={onSave} loading={saving}>Save Notifications</Button>
      </div>
    </div>
  );
}
