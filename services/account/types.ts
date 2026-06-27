// services/account/types.ts

export type AccountTab = "profile" | "security" | "sessions" | "preferences" | "notifications" | "tokens" | "activity";

// ── Profile ───────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  phone: string;
  jobTitle: string;
  department: string;
  bio: string;
  timezone: string;
  language: string;
}

// ── Security ──────────────────────────────────────────────────────

export interface UserSecurity {
  twoFactorEnabled: boolean;
  passwordLastChanged: string;
  recoveryCodesGenerated: boolean;
  loginAlertsEnabled: boolean;
  failedLoginAttempts: number;
  lastFailedLogin: string | null;
}

// ── Sessions ──────────────────────────────────────────────────────

export interface UserSession {
  id: string;
  device: string;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

// ── Preferences ───────────────────────────────────────────────────

export type ThemePreference = "dark" | "light" | "system";
export type SidebarState = "expanded" | "collapsed";
export type DateFormat = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";

export interface UserPreferences {
  theme: ThemePreference;
  sidebarState: SidebarState;
  defaultLandingPage: string;
  language: string;
  dateFormat: DateFormat;
  compactMode: boolean;
}

// ── Notifications ─────────────────────────────────────────────────

export interface NotificationPreferences {
  emailNotifications: boolean;
  loginAlerts: boolean;
  marketingEmails: boolean;
  systemAlerts: boolean;
  orderNotifications: boolean;
  offerNotifications: boolean;
  weeklyDigest: boolean;
}

// ── API Token ─────────────────────────────────────────────────────

export type TokenPermission = "read" | "write" | "admin";

export interface ApiToken {
  id: string;
  name: string;
  permissions: TokenPermission[];
  token: string;       // masked — only shown once on creation
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
}

// ── Activity ──────────────────────────────────────────────────────

export type ActivityResult = "success" | "failure" | "blocked";

export interface UserActivity {
  id: string;
  action: string;
  module: string;
  description: string;
  ipAddress: string;
  result: ActivityResult;
  createdAt: string;
}
