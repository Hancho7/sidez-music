// services/account/mock-data.ts
import type {
  UserProfile, UserSecurity, UserSession, UserPreferences,
  NotificationPreferences, ApiToken, UserActivity,
} from "./types";

function daysAgo(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString();
}
function hoursAgo(n: number) {
  const d = new Date(); d.setHours(d.getHours() - n); return d.toISOString();
}
function minsAgo(n: number) {
  const d = new Date(); d.setMinutes(d.getMinutes() - n); return d.toISOString();
}
function daysFromNow(n: number) {
  const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString();
}

export const MOCK_PROFILE: UserProfile = {
  id: "usr-001",
  firstName: "John",
  lastName: "Carter",
  email: "john@sidez.io",
  avatar: "https://i.pravatar.cc/150?img=1",
  phone: "+1 555 000 0001",
  jobTitle: "Platform Owner",
  department: "Engineering",
  bio: "Building Sidez — the music marketplace for the next generation of producers.",
  timezone: "America/New_York",
  language: "en",
};

export const MOCK_SECURITY: UserSecurity = {
  twoFactorEnabled: true,
  passwordLastChanged: daysAgo(30),
  recoveryCodesGenerated: true,
  loginAlertsEnabled: true,
  failedLoginAttempts: 0,
  lastFailedLogin: null,
};

export const MOCK_SESSIONS: UserSession[] = [
  {
    id: "sess-1",
    device: "MacBook Pro 16\"",
    deviceType: "desktop",
    browser: "Chrome 120",
    os: "macOS 14 Sonoma",
    location: "New York, US",
    ipAddress: "192.168.1.10",
    lastActive: minsAgo(2),
    isCurrent: true,
  },
  {
    id: "sess-2",
    device: "iPhone 15 Pro",
    deviceType: "mobile",
    browser: "Safari 17",
    os: "iOS 17.2",
    location: "New York, US",
    ipAddress: "10.0.0.42",
    lastActive: hoursAgo(3),
    isCurrent: false,
  },
  {
    id: "sess-3",
    device: "iPad Air",
    deviceType: "tablet",
    browser: "Safari 17",
    os: "iPadOS 17.2",
    location: "New York, US",
    ipAddress: "10.0.0.55",
    lastActive: hoursAgo(18),
    isCurrent: false,
  },
  {
    id: "sess-4",
    device: "Windows Desktop",
    deviceType: "desktop",
    browser: "Edge 120",
    os: "Windows 11",
    location: "Los Angeles, US",
    ipAddress: "172.16.0.8",
    lastActive: daysAgo(2),
    isCurrent: false,
  },
];

export const MOCK_PREFERENCES: UserPreferences = {
  theme: "dark",
  sidebarState: "expanded",
  defaultLandingPage: "/dashboard",
  language: "en",
  dateFormat: "MM/DD/YYYY",
  compactMode: false,
};

export const MOCK_NOTIFICATIONS: NotificationPreferences = {
  emailNotifications: true,
  loginAlerts: true,
  marketingEmails: false,
  systemAlerts: true,
  orderNotifications: true,
  offerNotifications: true,
  weeklyDigest: true,
};

export const MOCK_TOKENS: ApiToken[] = [
  {
    id: "tok-1",
    name: "CI/CD Pipeline",
    permissions: ["read", "write"],
    token: "sk_••••••••••••••••••••••••••••••••",
    createdAt: daysAgo(30),
    lastUsedAt: hoursAgo(2),
    expiresAt: daysFromNow(335),
  },
  {
    id: "tok-2",
    name: "Mobile App",
    permissions: ["read"],
    token: "sk_••••••••••••••••••••••••••••••••",
    createdAt: daysAgo(60),
    lastUsedAt: hoursAgo(6),
    expiresAt: daysFromNow(305),
  },
  {
    id: "tok-3",
    name: "Analytics Script",
    permissions: ["read"],
    token: "sk_••••••••••••••••••••••••••••••••",
    createdAt: daysAgo(90),
    lastUsedAt: daysAgo(3),
    expiresAt: null, // never expires
  },
];

export const MOCK_ACTIVITY: UserActivity[] = [
  { id: "act-1", action: "login", module: "Auth", description: "Signed in successfully", ipAddress: "192.168.1.10", result: "success", createdAt: minsAgo(2) },
  { id: "act-2", action: "publish_track", module: "Music", description: "Published track 'Midnight Bloom'", ipAddress: "192.168.1.10", result: "success", createdAt: hoursAgo(2) },
  { id: "act-3", action: "invite_user", module: "Users", description: "Invited omar.s@example.com", ipAddress: "192.168.1.10", result: "success", createdAt: hoursAgo(5) },
  { id: "act-4", action: "login_failed", module: "Auth", description: "Failed login attempt from unknown IP", ipAddress: "198.51.100.1", result: "failure", createdAt: hoursAgo(8) },
  { id: "act-5", action: "export_report", module: "Reports", description: "Exported Q4 Revenue Report", ipAddress: "192.168.1.10", result: "success", createdAt: daysAgo(1) },
  { id: "act-6", action: "update_settings", module: "Settings", description: "Changed SMTP configuration", ipAddress: "192.168.1.10", result: "success", createdAt: daysAgo(1) },
  { id: "act-7", action: "create_campaign", module: "Marketing", description: "Created 'Black Friday 2025' campaign", ipAddress: "192.168.1.10", result: "success", createdAt: daysAgo(2) },
  { id: "act-8", action: "password_change", module: "Security", description: "Password updated successfully", ipAddress: "192.168.1.10", result: "success", createdAt: daysAgo(30) },
  { id: "act-9", action: "2fa_enabled", module: "Security", description: "Two-factor authentication enabled", ipAddress: "192.168.1.10", result: "success", createdAt: daysAgo(35) },
  { id: "act-10", action: "revoke_token", module: "API", description: "Revoked token 'Old Script'", ipAddress: "192.168.1.10", result: "success", createdAt: daysAgo(45) },
];
