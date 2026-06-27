// services/settings/mock-data.ts
import type {
  GeneralSettings, BrandingSettings, LocalizationSettings, PaymentsSettings,
  StorageSettings, EmailSettings, SecuritySettings, SEOSettings,
  Integration, NotificationChannel, MaintenanceSettings, AuditEntry,
} from "./types";

function daysAgo(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString();
}
function hoursAgo(n: number) {
  const d = new Date(); d.setHours(d.getHours() - n); return d.toISOString();
}
function daysFromNow(n: number) {
  const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString();
}

export const MOCK_GENERAL: GeneralSettings = {
  siteName: "Sidez",
  companyName: "Sidez Music Ltd.",
  websiteUrl: "https://sidez.io",
  supportEmail: "support@sidez.io",
  supportPhone: "+1 800 SIDEZ00",
  defaultLanguage: "en",
  defaultTimezone: "America/New_York",
};

export const MOCK_BRANDING: BrandingSettings = {
  primaryColor: "#7c3aed",
  secondaryColor: "#06b6d4",
  logoUrl: "/assets/logo/ss-no-bg.png",
  darkLogoUrl: "/assets/logo/ss-no-bg.png",
  faviconUrl: null,
  loginBackgroundUrl: null,
};

export const MOCK_LOCALIZATION: LocalizationSettings = {
  currency: "USD",
  currencySymbol: "$",
  numberFormat: "1,234.56",
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12h",
  timezone: "America/New_York",
  defaultLocale: "en-US",
};

export const MOCK_PAYMENTS: PaymentsSettings = {
  providers: [
    { id: "stripe", name: "Stripe", enabled: true, publicKey: "pk_live_••••••••••••••••••••••••", secretKey: "sk_live_••••", webhookSecret: "whsec_••••" },
    { id: "paypal", name: "PayPal", enabled: false, publicKey: "", secretKey: "", webhookSecret: "" },
    { id: "paystack", name: "Paystack", enabled: true, publicKey: "pk_live_••••••••••••••••", secretKey: "sk_live_••••", webhookSecret: "" },
    { id: "flutterwave", name: "Flutterwave", enabled: false, publicKey: "", secretKey: "", webhookSecret: "" },
  ],
  taxRate: 0,
  invoicePrefix: "SIDEZ",
  defaultPaymentTimeoutMinutes: 30,
};

export const MOCK_STORAGE: StorageSettings = {
  activeProvider: "cloudinary",
  usedBytes: 18.4 * 1024 * 1024 * 1024,
  totalBytes: 50 * 1024 * 1024 * 1024,
  providers: [
    { id: "local", name: "Local Disk", connected: true, config: { path: "/var/storage" } },
    { id: "s3", name: "Amazon S3", connected: false, config: { bucket: "", region: "", accessKey: "" } },
    { id: "cloudinary", name: "Cloudinary", connected: true, config: { cloudName: "sidez-media", apiKey: "••••••••••••", apiSecret: "••••••••••••" } },
    { id: "gcs", name: "Google Cloud Storage", connected: false, config: { bucket: "", projectId: "", keyFile: "" } },
  ],
};

export const MOCK_EMAIL: EmailSettings = {
  smtpHost: "smtp.sendgrid.net",
  smtpPort: 587,
  smtpUsername: "apikey",
  smtpPassword: "••••••••••••••••••••",
  encryption: "tls",
  fromName: "Sidez",
  fromEmail: "noreply@sidez.io",
};

export const MOCK_SECURITY: SecuritySettings = {
  minPasswordLength: 8,
  requireSpecialChars: true,
  requireNumbers: true,
  sessionTimeoutMinutes: 480,
  require2FA: false,
  loginAttemptLimit: 5,
  allowedIPs: "",
  apiTokens: [
    { id: "tok-1", name: "CI/CD Pipeline", lastUsed: hoursAgo(2), createdAt: daysAgo(30) },
    { id: "tok-2", name: "Mobile App", lastUsed: hoursAgo(6), createdAt: daysAgo(60) },
    { id: "tok-3", name: "Analytics Script", lastUsed: daysAgo(3), createdAt: daysAgo(90) },
  ],
};

export const MOCK_SEO: SEOSettings = {
  siteTitleTemplate: "%s | Sidez — Music Marketplace",
  defaultMetaDescription: "License professional beats, samples, and sound kits from top producers on Sidez.",
  robots: "index, follow",
  openGraphImageUrl: null,
  twitterCard: "summary_large_image",
  sitemapEnabled: true,
};

export const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: "google-analytics", name: "Google Analytics", description: "Track website traffic and user behavior.",
    category: "analytics", enabled: true,
    fields: [{ key: "measurementId", label: "Measurement ID", type: "text", value: "G-••••••••••" }],
  },
  {
    id: "gtm", name: "Google Tag Manager", description: "Manage marketing and analytics tags.",
    category: "analytics", enabled: false,
    fields: [{ key: "containerId", label: "Container ID", type: "text", value: "" }],
  },
  {
    id: "meta-pixel", name: "Meta Pixel", description: "Track conversions from Facebook and Instagram ads.",
    category: "analytics", enabled: true,
    fields: [{ key: "pixelId", label: "Pixel ID", type: "text", value: "••••••••••••••••" }],
  },
  {
    id: "sentry", name: "Sentry", description: "Monitor errors and performance issues in real-time.",
    category: "monitoring", enabled: true,
    fields: [{ key: "dsn", label: "DSN", type: "text", value: "https://••••@sentry.io/••••" }],
  },
  {
    id: "slack", name: "Slack", description: "Receive system alerts and notifications in Slack.",
    category: "communication", enabled: false,
    fields: [{ key: "webhookUrl", label: "Webhook URL", type: "password", value: "" }],
  },
  {
    id: "discord", name: "Discord", description: "Send alerts and announcements to a Discord channel.",
    category: "communication", enabled: false,
    fields: [{ key: "webhookUrl", label: "Webhook URL", type: "password", value: "" }],
  },
  {
    id: "recaptcha", name: "reCAPTCHA", description: "Protect forms from spam and abuse.",
    category: "security", enabled: true,
    fields: [
      { key: "siteKey", label: "Site Key", type: "text", value: "6Ld••••••••••••••" },
      { key: "secretKey", label: "Secret Key", type: "password", value: "6Ld••••••••••••••" },
    ],
  },
];

export const MOCK_NOTIFICATIONS: NotificationChannel[] = [
  { id: "orders", label: "Order Notifications", description: "New orders, refund requests, payment failures", emailEnabled: true, inAppEnabled: true, recipients: "john@sidez.io, sarah@sidez.io" },
  { id: "offers", label: "Offer Notifications", description: "New offers submitted by customers", emailEnabled: true, inAppEnabled: true, recipients: "john@sidez.io" },
  { id: "errors", label: "Error Alerts", description: "Critical system errors and exceptions", emailEnabled: true, inAppEnabled: false, recipients: "john@sidez.io" },
  { id: "marketing", label: "Marketing Alerts", description: "Campaign milestones and performance summaries", emailEnabled: false, inAppEnabled: true, recipients: "" },
  { id: "system", label: "System Emails", description: "User invitations, password resets, receipts", emailEnabled: true, inAppEnabled: false, recipients: "" },
];

export const MOCK_MAINTENANCE: MaintenanceSettings = {
  enabled: false,
  message: "We're performing scheduled maintenance. We'll be back shortly.",
  allowedIPs: "192.168.1.0/24",
  scheduledStart: "",
  scheduledEnd: "",
};

export const MOCK_AUDIT: AuditEntry[] = [
  { id: "aud-1", settingKey: "require2FA", category: "Security", oldValue: "false", newValue: "true", updatedBy: "John Carter", ipAddress: "192.168.1.10", createdAt: hoursAgo(1) },
  { id: "aud-2", settingKey: "primaryColor", category: "Branding", oldValue: "#6d28d9", newValue: "#7c3aed", updatedBy: "Sarah Support", ipAddress: "203.0.113.14", createdAt: hoursAgo(4) },
  { id: "aud-3", settingKey: "taxRate", category: "Payments", oldValue: "0.05", newValue: "0", updatedBy: "Lena Richter", ipAddress: "85.22.113.5", createdAt: hoursAgo(8) },
  { id: "aud-4", settingKey: "smtpHost", category: "Email", oldValue: "smtp.mailgun.org", newValue: "smtp.sendgrid.net", updatedBy: "John Carter", ipAddress: "192.168.1.10", createdAt: daysAgo(1) },
  { id: "aud-5", settingKey: "siteTitleTemplate", category: "SEO", oldValue: "%s — Sidez", newValue: "%s | Sidez — Music Marketplace", updatedBy: "John Carter", ipAddress: "192.168.1.10", createdAt: daysAgo(2) },
  { id: "aud-6", settingKey: "stripeEnabled", category: "Payments", oldValue: "false", newValue: "true", updatedBy: "John Carter", ipAddress: "192.168.1.10", createdAt: daysAgo(3) },
  { id: "aud-7", settingKey: "maintenanceMode", category: "Maintenance", oldValue: "false", newValue: "true", updatedBy: "John Carter", ipAddress: "192.168.1.10", createdAt: daysAgo(5) },
  { id: "aud-8", settingKey: "sessionTimeout", category: "Security", oldValue: "60", newValue: "480", updatedBy: "John Carter", ipAddress: "192.168.1.10", createdAt: daysAgo(7) },
];
