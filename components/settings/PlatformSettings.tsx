// components/settings/PlatformSettings.tsx
// General + Branding + Localization + Payments + Storage
"use client";

import { Check, RefreshCw, Upload, Trash2, HardDrive, Cloud } from "lucide-react";
import Button from "@/components/ui/Button";
import UIInput from "@/components/ui/Input";
import UISelect from "@/components/ui/Select";
import {
  SectionCard, FieldRow, MaskedInput, SettingsToggle,
} from "./SettingsShell";
import type {
  GeneralSettings, BrandingSettings, LocalizationSettings,
  PaymentsSettings, StorageSettings, StorageProvider,
} from "@/services/settings/types";

// ── General ───────────────────────────────────────────────────────

const LANGUAGES = [
  { value: "en", label: "English" }, { value: "es", label: "Spanish" },
  { value: "fr", label: "French" }, { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
];
const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "GMT / London" },
  { value: "Europe/Berlin", label: "Central European (CET)" },
  { value: "Africa/Accra", label: "Ghana / Accra (GMT)" },
  { value: "Asia/Tokyo", label: "Japan Standard (JST)" },
];

export function GeneralSettingsPanel({ settings, onChange }: {
  settings: GeneralSettings; onChange: (p: Partial<GeneralSettings>) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Site Information" description="Basic information about your platform.">
        <FieldRow label="Site Name" description="Displayed in the browser tab and emails.">
          <UIInput value={settings.siteName} onChange={e => onChange({ siteName: e.target.value })} placeholder="Sidez" />
        </FieldRow>
        <FieldRow label="Company Name" description="Your legal company name.">
          <UIInput value={settings.companyName} onChange={e => onChange({ companyName: e.target.value })} placeholder="Sidez Music Ltd." />
        </FieldRow>
        <FieldRow label="Website URL" description="The public URL of your storefront.">
          <UIInput value={settings.websiteUrl} onChange={e => onChange({ websiteUrl: e.target.value })} placeholder="https://sidez.io" type="url" />
        </FieldRow>
      </SectionCard>

      <SectionCard title="Contact" description="How customers reach your support team.">
        <FieldRow label="Support Email" description="Displayed in transactional emails.">
          <UIInput value={settings.supportEmail} onChange={e => onChange({ supportEmail: e.target.value })} placeholder="support@sidez.io" type="email" />
        </FieldRow>
        <FieldRow label="Support Phone" description="Optional phone number for customer support.">
          <UIInput value={settings.supportPhone} onChange={e => onChange({ supportPhone: e.target.value })} placeholder="+1 800 000 0000" />
        </FieldRow>
      </SectionCard>

      <SectionCard title="Defaults" description="Platform-wide default locale settings.">
        <FieldRow label="Default Language">
          <UISelect value={settings.defaultLanguage} onChange={v => onChange({ defaultLanguage: v })}>
            {LANGUAGES.map(o => <option key={o.value} value={o.value} className="bg-surface">{o.label}</option>)}
          </UISelect>
        </FieldRow>
        <FieldRow label="Default Timezone">
          <UISelect value={settings.defaultTimezone} onChange={v => onChange({ defaultTimezone: v })}>
            {TIMEZONES.map(o => <option key={o.value} value={o.value} className="bg-surface">{o.label}</option>)}
          </UISelect>
        </FieldRow>
      </SectionCard>
    </div>
  );
}

// ── Branding ──────────────────────────────────────────────────────

function ColorPicker({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-10 h-10 rounded-[10px] border border-[color:var(--border-subtle)] cursor-pointer bg-surface p-0.5"
      />
      <div className="flex-1">
        <p className="text-xs text-[color:var(--text-muted)] mb-1">{label}</p>
        <UIInput value={value} onChange={e => onChange(e.target.value)} className="font-mono" />
      </div>
    </div>
  );
}

function UploadSlot({ label, description, value }: {
  label: string; description: string; value: string | null;
}) {
  return (
    <FieldRow label={label} description={description}>
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-[10px] border border-[color:var(--border-subtle)] bg-elevated flex items-center justify-center overflow-hidden shrink-0">
          {value ? <img src={value} alt={label} className="w-full h-full object-contain p-1" /> : <Upload size={18} className="text-[color:var(--text-muted)]" />}
        </div>
        <div className="flex flex-col gap-1.5">
          <Button variant="secondary" size="sm" icon={<Upload size={12} />} onClick={() => { }}>Upload</Button>
          {value && <Button variant="secondary" size="sm" icon={<Trash2 size={12} />} onClick={() => { }}>Remove</Button>}
          <p className="text-[11px] text-[color:var(--text-muted)]">PNG, SVG, WebP · max 2 MB</p>
        </div>
      </div>
    </FieldRow>
  );
}

export function BrandingSettingsPanel({ settings, onChange }: {
  settings: BrandingSettings; onChange: (p: Partial<BrandingSettings>) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Assets" description="Upload your brand assets used across the platform.">
        <UploadSlot label="Logo (Light)" description="Shown on dark backgrounds and in the sidebar." value={settings.logoUrl} />
        <UploadSlot label="Logo (Dark)" description="Shown on light backgrounds." value={settings.darkLogoUrl} />
        <UploadSlot label="Favicon" description="16×16 or 32×32 .ico or .png" value={settings.faviconUrl} />
        <UploadSlot label="Login Background" description="Full-screen image for the login page." value={settings.loginBackgroundUrl} />
      </SectionCard>

      <SectionCard title="Colors" description="These colors apply to buttons, accents, and CTAs across the storefront.">
        <FieldRow label="Primary Color" description="Main accent color for CTAs and highlights.">
          <ColorPicker label="Hex value" value={settings.primaryColor} onChange={v => onChange({ primaryColor: v })} />
        </FieldRow>
        <FieldRow label="Secondary Color" description="Used for secondary accents and links.">
          <ColorPicker label="Hex value" value={settings.secondaryColor} onChange={v => onChange({ secondaryColor: v })} />
        </FieldRow>
      </SectionCard>

      <SectionCard title="Preview" description="How your branding looks to customers.">
        <div className="rounded-[10px] border border-[color:var(--border-subtle)] bg-surface p-6 flex flex-col items-center gap-4">
          {settings.logoUrl && <img src={settings.logoUrl} alt="Logo" className="h-10 object-contain" />}
          <button className="px-6 py-2.5 rounded-[10px] text-sm font-bold text-white cursor-default" style={{ background: settings.primaryColor }}>
            Browse Beats
          </button>
          <div className="flex gap-2">
            <div className="w-16 h-16 rounded-[10px]" style={{ background: settings.primaryColor }} />
            <div className="w-16 h-16 rounded-[10px]" style={{ background: settings.secondaryColor }} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ── Localization ──────────────────────────────────────────────────

const CURRENCIES = [
  { value: "USD", label: "US Dollar (USD)" }, { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" }, { value: "CAD", label: "Canadian Dollar (CAD)" },
  { value: "NGN", label: "Nigerian Naira (NGN)" }, { value: "GHS", label: "Ghana Cedi (GHS)" },
];
const NUMBER_FORMATS = [
  { value: "1,234.56", label: "1,234.56 (US)" },
  { value: "1.234,56", label: "1.234,56 (EU)" },
  { value: "1 234.56", label: "1 234.56 (FR)" },
];
const DATE_FORMATS = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD (ISO)" },
];
const LOCALES = [
  { value: "en-US", label: "en-US" }, { value: "en-GB", label: "en-GB" },
  { value: "de-DE", label: "de-DE" }, { value: "fr-FR", label: "fr-FR" },
];

export function LocalizationSettingsPanel({ settings, onChange }: {
  settings: LocalizationSettings; onChange: (p: Partial<LocalizationSettings>) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Currency" description="Default currency used across the storefront.">
        <FieldRow label="Currency">
          <UISelect value={settings.currency} onChange={v => onChange({ currency: v })}>
            {CURRENCIES.map(o => <option key={o.value} value={o.value} className="bg-surface">{o.label}</option>)}
          </UISelect>
        </FieldRow>
        <FieldRow label="Currency Symbol" description="Displayed next to prices.">
          <UIInput value={settings.currencySymbol} onChange={e => onChange({ currencySymbol: e.target.value })} />
        </FieldRow>
      </SectionCard>

      <SectionCard title="Formatting" description="How numbers and dates are displayed.">
        <FieldRow label="Number Format">
          <UISelect value={settings.numberFormat} onChange={v => onChange({ numberFormat: v })}>
            {NUMBER_FORMATS.map(o => <option key={o.value} value={o.value} className="bg-surface">{o.label}</option>)}
          </UISelect>
        </FieldRow>
        <FieldRow label="Date Format">
          <UISelect value={settings.dateFormat} onChange={v => onChange({ dateFormat: v })}>
            {DATE_FORMATS.map(o => <option key={o.value} value={o.value} className="bg-surface">{o.label}</option>)}
          </UISelect>
        </FieldRow>
        <FieldRow label="Time Format">
          <UISelect value={settings.timeFormat} onChange={v => onChange({ timeFormat: v })}>
            <option value="12h" className="bg-surface">12-hour</option>
            <option value="24h" className="bg-surface">24-hour</option>
          </UISelect>
        </FieldRow>
        <FieldRow label="Default Locale">
          <UISelect value={settings.defaultLocale} onChange={v => onChange({ defaultLocale: v })}>
            {LOCALES.map(o => <option key={o.value} value={o.value} className="bg-surface">{o.label}</option>)}
          </UISelect>
        </FieldRow>
      </SectionCard>
    </div>
  );
}

// ── Payments ──────────────────────────────────────────────────────

export function PaymentsSettingsPanel({ settings, onChange }: {
  settings: PaymentsSettings; onChange: (p: Partial<PaymentsSettings>) => void;
}) {
  const updateProvider = (id: string, patch: Partial<PaymentsSettings["providers"][0]>) =>
    onChange({ providers: settings.providers.map(p => p.id === id ? { ...p, ...patch } : p) });

  return (
    <div className="flex flex-col gap-5">
      {settings.providers.map(provider => (
        <SectionCard key={provider.id} title={provider.name} description={`Configure ${provider.name} payment integration.`}>
          <SettingsToggle
            checked={provider.enabled}
            onChange={v => updateProvider(provider.id, { enabled: v })}
            label={`Enable ${provider.name}`}
            description="Allow customers to pay with this provider at checkout."
          />
          {provider.enabled && (
            <>
              <FieldRow label="Public Key">
                <MaskedInput value={provider.publicKey} onChange={v => updateProvider(provider.id, { publicKey: v })} placeholder="pk_live_••••" />
              </FieldRow>
              <FieldRow label="Secret Key" description="Never share this key publicly.">
                <MaskedInput value={provider.secretKey} onChange={v => updateProvider(provider.id, { secretKey: v })} placeholder="sk_live_••••" />
              </FieldRow>
              {provider.id === "stripe" && (
                <FieldRow label="Webhook Secret">
                  <MaskedInput value={provider.webhookSecret} onChange={v => updateProvider(provider.id, { webhookSecret: v })} placeholder="whsec_••••" />
                </FieldRow>
              )}
            </>
          )}
        </SectionCard>
      ))}

      <SectionCard title="Invoice & Tax" description="Configure invoice numbering and tax collection.">
        <FieldRow label="Tax Rate %" description="Leave 0 if you collect tax externally.">
          <UIInput value={String(settings.taxRate)} onChange={e => onChange({ taxRate: Number(e.target.value) })} type="number" min="0" max="100" step="0.01" />
        </FieldRow>
        <FieldRow label="Invoice Prefix" description="Prefix on all invoice numbers.">
          <UIInput value={settings.invoicePrefix} onChange={e => onChange({ invoicePrefix: e.target.value })} placeholder="SIDEZ" />
        </FieldRow>
        <FieldRow label="Payment Timeout (min)">
          <UIInput value={String(settings.defaultPaymentTimeoutMinutes)} onChange={e => onChange({ defaultPaymentTimeoutMinutes: Number(e.target.value) })} type="number" min="5" />
        </FieldRow>
      </SectionCard>
    </div>
  );
}

// ── Storage ───────────────────────────────────────────────────────

function fmtBytes(b: number) {
  if (b >= 1e12) return `${(b / 1e12).toFixed(1)} TB`;
  if (b >= 1e9) return `${(b / 1e9).toFixed(1)} GB`;
  if (b >= 1e6) return `${(b / 1e6).toFixed(1)} MB`;
  return `${(b / 1e3).toFixed(0)} KB`;
}

const PROVIDER_FIELDS: Record<StorageProvider, { key: string; label: string; masked?: boolean }[]> = {
  local: [{ key: "path", label: "Storage Path" }],
  s3: [{ key: "bucket", label: "Bucket Name" }, { key: "region", label: "Region" }, { key: "accessKey", label: "Access Key", masked: true }],
  cloudinary: [{ key: "cloudName", label: "Cloud Name" }, { key: "apiKey", label: "API Key", masked: true }, { key: "apiSecret", label: "API Secret", masked: true }],
  gcs: [{ key: "bucket", label: "Bucket Name" }, { key: "projectId", label: "Project ID" }, { key: "keyFile", label: "Key File Path" }],
};

export function StorageSettingsPanel({ settings, onChange }: {
  settings: StorageSettings; onChange: (p: Partial<StorageSettings>) => void;
}) {
  const usedPct = (settings.usedBytes / settings.totalBytes) * 100;
  const usedColor = usedPct > 90 ? "bg-danger" : usedPct > 70 ? "bg-[color:var(--color-warning)]" : "bg-accent";

  const updateProviderConfig = (id: StorageProvider, key: string, value: string) =>
    onChange({ providers: settings.providers.map(p => p.id === id ? { ...p, config: { ...p.config, [key]: value } } : p) });

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Storage Usage" description="Current storage consumption across all assets.">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[color:var(--text-secondary)]">{fmtBytes(settings.usedBytes)} used</span>
            <span className="text-[color:var(--text-muted)]">{fmtBytes(settings.totalBytes)} total</span>
          </div>
          <div className="h-2 rounded-[10px] bg-elevated overflow-hidden">
            <div className={`h-full rounded-[10px] transition-all ${usedColor}`} style={{ width: `${usedPct}%` }} />
          </div>
          <p className="text-[11px] text-[color:var(--text-muted)] mt-1.5">{fmtBytes(settings.totalBytes - settings.usedBytes)} available</p>
        </div>
      </SectionCard>

      <SectionCard title="Active Provider" description="The storage backend used for all new uploads.">
        <div className="grid grid-cols-2 gap-3">
          {settings.providers.map(p => (
            <button
              key={p.id}
              onClick={() => onChange({ activeProvider: p.id as StorageProvider })}
              className={[
                "flex items-center gap-3 px-4 py-3 rounded-[10px] border cursor-pointer text-left transition-all",
                settings.activeProvider === p.id
                  ? "border-accent/50 bg-accent/5 outline outline-1 outline-accent/30"
                  : "border-[color:var(--border-subtle)] bg-surface hover:border-[color:var(--border-default)]",
              ].join(" ")}
            >
              <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 ${p.connected ? "bg-accent/10 text-accent" : "bg-elevated text-[color:var(--text-muted)]"}`}>
                {p.connected ? <Cloud size={14} /> : <HardDrive size={14} />}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{p.name}</p>
                <p className={`text-[10px] font-semibold ${p.connected ? "text-success" : "text-[color:var(--text-muted)]"}`}>
                  {p.connected ? "Connected" : "Not connected"}
                </p>
              </div>
              {settings.activeProvider === p.id && <Check size={13} className="text-accent ml-auto" />}
            </button>
          ))}
        </div>
      </SectionCard>

      {settings.providers.filter(p => p.id !== "local").map(provider => (
        <SectionCard key={provider.id} title={`${provider.name} Configuration`}>
          {(PROVIDER_FIELDS[provider.id as StorageProvider] ?? []).map(field => (
            <FieldRow key={field.key} label={field.label}>
              {field.masked
                ? <MaskedInput value={provider.config[field.key] ?? ""} onChange={v => updateProviderConfig(provider.id as StorageProvider, field.key, v)} />
                : <UIInput value={provider.config[field.key] ?? ""} onChange={e => updateProviderConfig(provider.id as StorageProvider, field.key, e.target.value)} />
              }
            </FieldRow>
          ))}
          <Button variant="secondary" size="md" icon={<RefreshCw size={13} />} onClick={() => { }}>Test Connection</Button>
        </SectionCard>
      ))}
    </div>
  );
}
