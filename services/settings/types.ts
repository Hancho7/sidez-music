// services/settings/types.ts

export type SettingsTab =
  | "general" | "branding" | "localization" | "payments" | "storage"
  | "email" | "security" | "seo" | "integrations" | "notifications"
  | "maintenance" | "audit";

// ── General ───────────────────────────────────────────────────────

export interface GeneralSettings {
  siteName: string;
  companyName: string;
  websiteUrl: string;
  supportEmail: string;
  supportPhone: string;
  defaultLanguage: string;
  defaultTimezone: string;
}

// ── Branding ──────────────────────────────────────────────────────

export interface BrandingSettings {
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
  darkLogoUrl: string | null;
  faviconUrl: string | null;
  loginBackgroundUrl: string | null;
}

// ── Localization ──────────────────────────────────────────────────

export interface LocalizationSettings {
  currency: string;
  currencySymbol: string;
  numberFormat: string;
  dateFormat: string;
  timeFormat: string;
  timezone: string;
  defaultLocale: string;
}

// ── Payments ──────────────────────────────────────────────────────

export interface PaymentProvider {
  id: string;
  name: string;
  enabled: boolean;
  publicKey: string;
  secretKey: string;       // masked in UI
  webhookSecret: string;   // masked in UI
}

export interface PaymentsSettings {
  providers: PaymentProvider[];
  taxRate: number;
  invoicePrefix: string;
  defaultPaymentTimeoutMinutes: number;
}

// ── Storage ───────────────────────────────────────────────────────

export type StorageProvider = "local" | "s3" | "cloudinary" | "gcs";

export interface StorageSettings {
  activeProvider: StorageProvider;
  usedBytes: number;
  totalBytes: number;
  providers: {
    id: StorageProvider;
    name: string;
    connected: boolean;
    config: Record<string, string>;
  }[];
}

// ── Email ─────────────────────────────────────────────────────────

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;     // masked
  encryption: "none" | "ssl" | "tls";
  fromName: string;
  fromEmail: string;
}

// ── Security ──────────────────────────────────────────────────────

export interface SecuritySettings {
  minPasswordLength: number;
  requireSpecialChars: boolean;
  requireNumbers: boolean;
  sessionTimeoutMinutes: number;
  require2FA: boolean;
  loginAttemptLimit: number;
  allowedIPs: string;       // newline-separated
  apiTokens: { id: string; name: string; lastUsed: string | null; createdAt: string }[];
}

// ── SEO ───────────────────────────────────────────────────────────

export interface SEOSettings {
  siteTitleTemplate: string;
  defaultMetaDescription: string;
  robots: string;
  openGraphImageUrl: string | null;
  twitterCard: "summary" | "summary_large_image";
  sitemapEnabled: boolean;
}

// ── Integrations ──────────────────────────────────────────────────

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: "analytics" | "monitoring" | "communication" | "security";
  enabled: boolean;
  fields: { key: string; label: string; type: "text" | "password"; value: string }[];
}

// ── Notifications ─────────────────────────────────────────────────

export interface NotificationChannel {
  id: string;
  label: string;
  description: string;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  recipients: string;
}

// ── Maintenance ───────────────────────────────────────────────────

export interface MaintenanceSettings {
  enabled: boolean;
  message: string;
  allowedIPs: string;
  scheduledStart: string;
  scheduledEnd: string;
}

// ── Audit ─────────────────────────────────────────────────────────

export interface AuditEntry {
  id: string;
  settingKey: string;
  category: string;
  oldValue: string;
  newValue: string;
  updatedBy: string;
  ipAddress: string;
  createdAt: string;
}
