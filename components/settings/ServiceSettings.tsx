// components/settings/ServiceSettings.tsx
// Email + Security + SEO + Integrations + Notifications + Maintenance + Audit
"use client";

import { useState } from "react";
import { Send, Plus, Trash2, Shield, Key, Activity, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import UIInput from "@/components/ui/Input";
import UISelect from "@/components/ui/Select";
import UITextarea from "@/components/ui/TextArea";
import {
  SectionCard, FieldRow, MaskedInput, SettingsToggle, DangerZone,
} from "./SettingsShell";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";
import type {
  EmailSettings, SecuritySettings, SEOSettings, Integration,
  NotificationChannel, MaintenanceSettings, AuditEntry,
} from "@/services/settings/types";

// ── Email ─────────────────────────────────────────────────────────

export function EmailSettingsPanel({ settings, onChange }: {
  settings: EmailSettings; onChange: (p: Partial<EmailSettings>) => void;
}) {
  const [sending, setSending] = useState(false);
  const [testResult, setTestResult] = useState<"sent" | "error" | null>(null);

  const sendTest = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setTestResult("sent");
    setTimeout(() => setTestResult(null), 3000);
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="SMTP Configuration" description="Outgoing email server settings.">
        <FieldRow label="Host">
          <UIInput value={settings.smtpHost} onChange={e => onChange({ smtpHost: e.target.value })} placeholder="smtp.sendgrid.net" />
        </FieldRow>
        <FieldRow label="Port">
          <UIInput value={String(settings.smtpPort)} onChange={e => onChange({ smtpPort: Number(e.target.value) })} type="number" />
        </FieldRow>
        <FieldRow label="Username">
          <UIInput value={settings.smtpUsername} onChange={e => onChange({ smtpUsername: e.target.value })} />
        </FieldRow>
        <FieldRow label="Password">
          <MaskedInput value={settings.smtpPassword} onChange={v => onChange({ smtpPassword: v })} />
        </FieldRow>
        <FieldRow label="Encryption">
          <UISelect value={settings.encryption} onChange={v => onChange({ encryption: v as EmailSettings["encryption"] })}>
            <option value="none" className="bg-surface">None</option>
            <option value="ssl" className="bg-surface">SSL</option>
            <option value="tls" className="bg-surface">TLS (Recommended)</option>
          </UISelect>
        </FieldRow>
      </SectionCard>

      <SectionCard title="Sender Details" description="How outgoing emails appear to recipients.">
        <FieldRow label="From Name">
          <UIInput value={settings.fromName} onChange={e => onChange({ fromName: e.target.value })} placeholder="Sidez" />
        </FieldRow>
        <FieldRow label="From Email">
          <UIInput value={settings.fromEmail} onChange={e => onChange({ fromEmail: e.target.value })} type="email" placeholder="noreply@sidez.io" />
        </FieldRow>
      </SectionCard>

      <SectionCard title="Test Configuration">
        <div className="flex items-center gap-3">
          <Button variant="primary" size="md" icon={<Send size={13} />} onClick={sendTest} loading={sending}>
            Send Test Email
          </Button>
          {testResult === "sent" && <span className="text-sm text-success font-semibold">Test email sent successfully</span>}
          {testResult === "error" && <span className="text-sm text-danger font-semibold">Failed to send — check your credentials</span>}
        </div>
      </SectionCard>
    </div>
  );
}

// ── Security ──────────────────────────────────────────────────────

export function SecuritySettingsPanel({ settings, onChange }: {
  settings: SecuritySettings; onChange: (p: Partial<SecuritySettings>) => void;
}) {
  const deleteToken = (id: string) =>
    onChange({ apiTokens: settings.apiTokens.filter(t => t.id !== id) });

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Password Policy" description="Enforce strong passwords for all staff accounts.">
        <FieldRow label="Minimum Length">
          <UIInput value={String(settings.minPasswordLength)} onChange={e => onChange({ minPasswordLength: Number(e.target.value) })} type="number" min="6" max="128" />
        </FieldRow>
        <SettingsToggle checked={settings.requireSpecialChars} onChange={v => onChange({ requireSpecialChars: v })} label="Require Special Characters" description="Force at least one special character in passwords." />
        <SettingsToggle checked={settings.requireNumbers} onChange={v => onChange({ requireNumbers: v })} label="Require Numbers" description="Force at least one number in passwords." />
      </SectionCard>

      <SectionCard title="Session & Access" description="Control how long sessions stay active.">
        <FieldRow label="Session Timeout (min)" description="Automatically log out inactive users.">
          <UIInput value={String(settings.sessionTimeoutMinutes)} onChange={e => onChange({ sessionTimeoutMinutes: Number(e.target.value) })} type="number" min="5" />
        </FieldRow>
        <FieldRow label="Login Attempt Limit" description="Lock accounts after this many failed attempts.">
          <UIInput value={String(settings.loginAttemptLimit)} onChange={e => onChange({ loginAttemptLimit: Number(e.target.value) })} type="number" min="1" max="20" />
        </FieldRow>
        <SettingsToggle checked={settings.require2FA} onChange={v => onChange({ require2FA: v })} label="Require Two-Factor Authentication" description="Force all admin accounts to enable 2FA." />
      </SectionCard>

      <SectionCard title="IP Allowlist" description="Restrict admin access to specific IP addresses. Leave blank to allow all.">
        <FieldRow label="Allowed IPs" description="One IP per line. Supports CIDR notation.">
          <UITextarea
            value={settings.allowedIPs}
            onChange={e => onChange({ allowedIPs: e.target.value })}
            rows={4}
            placeholder={"192.168.1.0/24\n10.0.0.1"}
          />
        </FieldRow>
      </SectionCard>

      <SectionCard title="API Tokens" description="Manage long-lived API tokens for programmatic access.">
        <div className="flex flex-col gap-2">
          {settings.apiTokens.map(token => (
            <div key={token.id} className="flex items-center justify-between gap-4 px-4 py-3 bg-surface border border-[color:var(--border-subtle)] rounded-[10px]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[10px] bg-accent/10 flex items-center justify-center">
                  <Key size={13} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{token.name}</p>
                  <p className="text-[11px] text-[color:var(--text-muted)]">
                    {token.lastUsed ? `Last used ${new Date(token.lastUsed).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "Never used"} · Created {new Date(token.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              <button onClick={() => deleteToken(token.id)} className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-danger/10 hover:text-danger transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <Button variant="secondary" size="md" icon={<Plus size={13} />} onClick={() => { }}>Generate New Token</Button>
        </div>
      </SectionCard>
    </div>
  );
}

// ── SEO ───────────────────────────────────────────────────────────

export function SEOSettingsPanel({ settings, onChange }: {
  settings: SEOSettings; onChange: (p: Partial<SEOSettings>) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Page Titles" description="How page titles appear in search results and browser tabs.">
        <FieldRow label="Title Template" description="Use %s as the page-specific title placeholder.">
          <UIInput value={settings.siteTitleTemplate} onChange={e => onChange({ siteTitleTemplate: e.target.value })} placeholder="%s | Sidez" />
        </FieldRow>
        {settings.siteTitleTemplate && (
          <div className="px-3 py-2 bg-surface border border-[color:var(--border-subtle)] rounded-[10px]">
            <p className="text-[11px] text-[color:var(--text-muted)] mb-0.5">Preview:</p>
            <p className="text-sm text-foreground">{settings.siteTitleTemplate.replace("%s", "Midnight Bloom")}</p>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Meta Tags" description="Default values used when pages don't specify their own.">
        <FieldRow label="Default Meta Description" description="Max 160 characters.">
          <UITextarea value={settings.defaultMetaDescription} onChange={e => onChange({ defaultMetaDescription: e.target.value })} rows={3} maxLength={160} />
          <p className="text-[11px] text-[color:var(--text-muted)] mt-1">{settings.defaultMetaDescription.length}/160</p>
        </FieldRow>
        <FieldRow label="Robots" description="Default robots directive for all pages.">
          <UISelect value={settings.robots} onChange={v => onChange({ robots: v })}>
            <option value="index, follow" className="bg-surface">index, follow (recommended)</option>
            <option value="noindex, follow" className="bg-surface">noindex, follow</option>
            <option value="index, nofollow" className="bg-surface">index, nofollow</option>
            <option value="noindex, nofollow" className="bg-surface">noindex, nofollow</option>
          </UISelect>
        </FieldRow>
      </SectionCard>

      <SectionCard title="Social Cards" description="Open Graph and Twitter Card settings.">
        <FieldRow label="Twitter Card Type">
          <UISelect value={settings.twitterCard} onChange={v => onChange({ twitterCard: v as SEOSettings["twitterCard"] })}>
            <option value="summary" className="bg-surface">Summary</option>
            <option value="summary_large_image" className="bg-surface">Summary with Large Image (recommended)</option>
          </UISelect>
        </FieldRow>
        <SettingsToggle checked={settings.sitemapEnabled} onChange={v => onChange({ sitemapEnabled: v })} label="Generate XML Sitemap" description="Automatically maintain a sitemap.xml at /sitemap.xml." />
      </SectionCard>
    </div>
  );
}

// ── Integrations ──────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  analytics: "Analytics", monitoring: "Monitoring",
  communication: "Communication", security: "Security",
};

export function IntegrationsSettingsPanel({ integrations, onChange }: {
  integrations: Integration[];
  onChange: (integrations: Integration[]) => void;
}) {
  const updateIntegration = (id: string, patch: Partial<Integration>) =>
    onChange(integrations.map(i => i.id === id ? { ...i, ...patch } : i));

  const updateField = (integrationId: string, fieldKey: string, value: string) =>
    onChange(integrations.map(i =>
      i.id === integrationId ? { ...i, fields: i.fields.map(f => f.key === fieldKey ? { ...f, value } : f) } : i
    ));

  const groups = [...new Set(integrations.map(i => i.category))];

  return (
    <div className="flex flex-col gap-5">
      {groups.map(cat => (
        <SectionCard key={cat} title={CATEGORY_LABELS[cat]} description={`${cat.charAt(0).toUpperCase() + cat.slice(1)} integrations.`}>
          <div className="flex flex-col gap-4">
            {integrations.filter(i => i.category === cat).map(integration => (
              <div key={integration.id} className={`rounded-[10px] border transition-all ${integration.enabled ? "border-accent/30 bg-surface" : "border-[color:var(--border-subtle)] bg-elevated/20"}`}>
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{integration.name}</p>
                    <p className="text-[11px] text-[color:var(--text-muted)]">{integration.description}</p>
                  </div>
                  <SettingsToggle checked={integration.enabled} onChange={v => updateIntegration(integration.id, { enabled: v })} label="" />
                </div>
                {integration.enabled && integration.fields.length > 0 && (
                  <div className="px-4 pb-4 pt-0 border-t border-[color:var(--border-subtle)] flex flex-col gap-3">
                    {integration.fields.map(field => (
                      <FieldRow key={field.key} label={field.label}>
                        {field.type === "password"
                          ? <MaskedInput value={field.value} onChange={v => updateField(integration.id, field.key, v)} />
                          : <UIInput value={field.value} onChange={e => updateField(integration.id, field.key, e.target.value)} />
                        }
                      </FieldRow>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

// ── Notifications ─────────────────────────────────────────────────

export function NotificationsSettingsPanel({ channels, onChange }: {
  channels: NotificationChannel[];
  onChange: (channels: NotificationChannel[]) => void;
}) {
  const update = (id: string, patch: Partial<NotificationChannel>) =>
    onChange(channels.map(c => c.id === id ? { ...c, ...patch } : c));

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Notification Channels" description="Control which events trigger emails and in-app alerts.">
        <div className="flex flex-col gap-1">
          <div className="grid text-[10px] font-semibold uppercase tracking-wide text-[color:var(--text-muted)] mb-2 gap-4" style={{ gridTemplateColumns: "1fr 80px 80px" }}>
            <span>Channel</span>
            <span className="text-center">Email</span>
            <span className="text-center">In-App</span>
          </div>
          {channels.map(ch => (
            <div key={ch.id} className="grid gap-4 items-center py-3 border-t border-[color:var(--border-subtle)]" style={{ gridTemplateColumns: "1fr 80px 80px" }}>
              <div>
                <p className="text-sm font-semibold text-foreground">{ch.label}</p>
                <p className="text-[11px] text-[color:var(--text-muted)]">{ch.description}</p>
              </div>
              <div className="flex justify-center">
                <SettingsToggle checked={ch.emailEnabled} onChange={v => update(ch.id, { emailEnabled: v })} label="" />
              </div>
              <div className="flex justify-center">
                <SettingsToggle checked={ch.inAppEnabled} onChange={v => update(ch.id, { inAppEnabled: v })} label="" />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Recipients" description="Configure who receives each notification type.">
        {channels.filter(c => c.emailEnabled).map(ch => (
          <FieldRow key={ch.id} label={ch.label} description="Comma-separated email addresses.">
            <UIInput value={ch.recipients} onChange={e => update(ch.id, { recipients: e.target.value })} placeholder="john@sidez.io, sarah@sidez.io" />
          </FieldRow>
        ))}
      </SectionCard>
    </div>
  );
}

// ── Maintenance ───────────────────────────────────────────────────

export function MaintenanceSettingsPanel({ settings, onChange }: {
  settings: MaintenanceSettings; onChange: (p: Partial<MaintenanceSettings>) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {settings.enabled && (
        <div className="bg-[color:var(--color-warning)]/10 border border-[color:var(--color-warning)]/30 rounded-[10px] px-4 py-3 flex items-center gap-3">
          <AlertTriangle size={16} className="text-[color:var(--color-warning)] shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Maintenance Mode is Active</p>
            <p className="text-xs text-[color:var(--text-muted)]">Your storefront is currently hidden from visitors. Only allowed IPs can access it.</p>
          </div>
        </div>
      )}

      <SectionCard title="Maintenance Mode" description="Take the storefront offline while you work. Administrators are not affected.">
        <SettingsToggle checked={settings.enabled} onChange={v => onChange({ enabled: v })} label="Enable Maintenance Mode" description="Shows the maintenance page to all non-admin visitors." />
        <FieldRow label="Maintenance Message" description="Shown to visitors during maintenance.">
          <UITextarea value={settings.message} onChange={e => onChange({ message: e.target.value })} rows={3} />
        </FieldRow>
        <FieldRow label="Allowed IP Addresses" description="These IPs can bypass maintenance mode.">
          <UITextarea value={settings.allowedIPs} onChange={e => onChange({ allowedIPs: e.target.value })} rows={3} placeholder={"192.168.1.1\n10.0.0.0/24"} />
        </FieldRow>
      </SectionCard>

      <SectionCard title="Scheduled Maintenance" description="Automatically enable and disable maintenance mode.">
        <FieldRow label="Scheduled Start">
          <UIInput value={settings.scheduledStart} onChange={e => onChange({ scheduledStart: e.target.value })} type="datetime-local" />
        </FieldRow>
        <FieldRow label="Scheduled End">
          <UIInput value={settings.scheduledEnd} onChange={e => onChange({ scheduledEnd: e.target.value })} type="datetime-local" />
        </FieldRow>
      </SectionCard>

      <DangerZone
        title="Force Maintenance Mode Off"
        description="Immediately disable maintenance mode and restore public access."
        action={() => onChange({ enabled: false })}
        actionLabel="Disable Now"
      />
    </div>
  );
}

// ── Audit Log ─────────────────────────────────────────────────────

function fmtDate(d: string) {
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function AuditLogPanel({ entries }: { entries: AuditEntry[] }) {
  const { hoveredId, setHoveredId } = useHoveredRow();
  const [search, setSearch] = useState("");

  const filtered = search
    ? entries.filter(e =>
      e.settingKey.toLowerCase().includes(search.toLowerCase()) ||
      e.updatedBy.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
    )
    : entries;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative">
          <UIInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search audit logs..."
            className="pl-9 w-64"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] pointer-events-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </span>
        </div>
        <Button variant="secondary" size="md" icon={<Activity size={13} />} onClick={() => { }}>Export Logs</Button>
      </div>

      <DataTable
        isEmpty={filtered.length === 0}
        emptyState={<DataTable.EmptyState icon={<Activity size={22} className="text-accent" />} title="No audit entries" message="Setting changes will be recorded here." />}
      >
        <DataTable.Header>
          <DataTable.Col>Timestamp</DataTable.Col>
          <DataTable.Col>Administrator</DataTable.Col>
          <DataTable.Col>Category</DataTable.Col>
          <DataTable.Col>Setting</DataTable.Col>
          <DataTable.Col>Old Value</DataTable.Col>
          <DataTable.Col>New Value</DataTable.Col>
          <DataTable.Col>IP</DataTable.Col>
        </DataTable.Header>
        <DataTable.Body>
          {filtered.map(entry => {
            const isHovered = hoveredId === entry.id;
            return (
              <DataTable.Row key={entry.id} isHovered={isHovered} onHoverChange={h => setHoveredId(h ? entry.id : null)}>
                <DataTable.Cell className="text-xs text-[color:var(--text-muted)] whitespace-nowrap">{fmtDate(entry.createdAt)}</DataTable.Cell>
                <DataTable.Cell className="text-xs font-semibold text-foreground">{entry.updatedBy}</DataTable.Cell>
                <DataTable.Cell><span className="text-[10px] font-bold bg-elevated px-2 py-0.5 rounded text-[color:var(--text-muted)] uppercase">{entry.category}</span></DataTable.Cell>
                <DataTable.Cell className="font-mono text-xs text-accent">{entry.settingKey}</DataTable.Cell>
                <DataTable.Cell className="text-xs text-danger truncate max-w-[120px]">{entry.oldValue}</DataTable.Cell>
                <DataTable.Cell className="text-xs text-success truncate max-w-[120px]">{entry.newValue}</DataTable.Cell>
                <DataTable.Cell className="font-mono text-[11px] text-[color:var(--text-muted)]">{entry.ipAddress}</DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </DataTable.Body>
      </DataTable>
    </div>
  );
}
