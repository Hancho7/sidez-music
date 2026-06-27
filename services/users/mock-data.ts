// services/users/mock-data.ts
import type {
  StaffUser, Role, Permission, PermissionGroup,
  Invitation, UserSession, ActivityLog,
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

// ── Roles ─────────────────────────────────────────────────────────

export const MOCK_ROLES: Role[] = [
  { id: "role-1", name: "Super Admin", description: "Full access to all platform features and settings", color: "#7c3aed", permissionIds: [], userCount: 1, isSystem: true, createdAt: daysAgo(180) },
  { id: "role-2", name: "Music Manager", description: "Manage tracks, artists, collections, and licensing", color: "#0891b2", permissionIds: [], userCount: 2, isSystem: false, createdAt: daysAgo(120) },
  { id: "role-3", name: "Content Editor", description: "Create and manage blog posts, pages, and media", color: "#059669", permissionIds: [], userCount: 1, isSystem: false, createdAt: daysAgo(90) },
  { id: "role-4", name: "Customer Support", description: "View orders, customers, and handle refund requests", color: "#d97706", permissionIds: [], userCount: 2, isSystem: false, createdAt: daysAgo(60) },
  { id: "role-5", name: "Finance Manager", description: "View revenue reports, payouts, and financial data", color: "#10b981", permissionIds: [], userCount: 1, isSystem: false, createdAt: daysAgo(45) },
  { id: "role-6", name: "Marketing Manager", description: "Manage coupons, announcements, and marketing campaigns", color: "#ec4899", permissionIds: [], userCount: 1, isSystem: false, createdAt: daysAgo(30) },
];

// ── Users ─────────────────────────────────────────────────────────

export const MOCK_USERS: StaffUser[] = [
  {
    id: "usr-001", firstName: "John", lastName: "Carter", email: "john@sidez.io",
    avatar: "https://i.pravatar.cc/150?img=1",
    status: "active", department: "Engineering", jobTitle: "Platform Owner",
    phone: "+1 555 000 0001", timezone: "America/New_York", language: "English",
    roleIds: ["role-1"], twoFactorEnabled: true,
    lastLogin: hoursAgo(2), lastPasswordChange: daysAgo(30),
    failedLoginAttempts: 0, createdAt: daysAgo(365), updatedAt: daysAgo(2),
  },
  {
    id: "usr-002", firstName: "Sarah", lastName: "Support", email: "sarah@sidez.io",
    avatar: "https://i.pravatar.cc/150?img=5",
    status: "active", department: "Operations", jobTitle: "Head of Music",
    phone: "+1 555 000 0002", timezone: "America/Chicago", language: "English",
    roleIds: ["role-2", "role-3"], twoFactorEnabled: true,
    lastLogin: hoursAgo(5), lastPasswordChange: daysAgo(60),
    failedLoginAttempts: 0, createdAt: daysAgo(300), updatedAt: daysAgo(5),
  },
  {
    id: "usr-003", firstName: "Maya", lastName: "Osei", email: "maya@sidez.io",
    avatar: "https://i.pravatar.cc/150?img=10",
    status: "active", department: "Content", jobTitle: "Content Editor",
    phone: "+233 555 0003", timezone: "Africa/Accra", language: "English",
    roleIds: ["role-3"], twoFactorEnabled: false,
    lastLogin: daysAgo(1), lastPasswordChange: daysAgo(45),
    failedLoginAttempts: 0, createdAt: daysAgo(120), updatedAt: daysAgo(1),
  },
  {
    id: "usr-004", firstName: "Daniel", lastName: "Wu", email: "daniel@sidez.io",
    avatar: "https://i.pravatar.cc/150?img=8",
    status: "active", department: "Support", jobTitle: "Customer Support Lead",
    phone: "+1 555 000 0004", timezone: "America/Los_Angeles", language: "English",
    roleIds: ["role-4"], twoFactorEnabled: true,
    lastLogin: hoursAgo(12), lastPasswordChange: daysAgo(90),
    failedLoginAttempts: 1, createdAt: daysAgo(200), updatedAt: daysAgo(3),
  },
  {
    id: "usr-005", firstName: "Lena", lastName: "Richter", email: "lena@sidez.io",
    avatar: null,
    status: "active", department: "Finance", jobTitle: "Finance Manager",
    phone: "+49 555 0005", timezone: "Europe/Berlin", language: "German",
    roleIds: ["role-5"], twoFactorEnabled: true,
    lastLogin: daysAgo(2), lastPasswordChange: daysAgo(120),
    failedLoginAttempts: 0, createdAt: daysAgo(150), updatedAt: daysAgo(2),
  },
  {
    id: "usr-006", firstName: "Kevin", lastName: "James", email: "kevin@sidez.io",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "active", department: "Marketing", jobTitle: "Marketing Manager",
    phone: "+44 555 0006", timezone: "Europe/London", language: "English",
    roleIds: ["role-6"], twoFactorEnabled: false,
    lastLogin: hoursAgo(8), lastPasswordChange: daysAgo(75),
    failedLoginAttempts: 0, createdAt: daysAgo(100), updatedAt: daysAgo(1),
  },
  {
    id: "usr-007", firstName: "Alex", lastName: "Torres", email: "alex@sidez.io",
    avatar: "https://i.pravatar.cc/150?img=15",
    status: "suspended", department: "Support", jobTitle: "Support Agent",
    phone: "+1 555 000 0007", timezone: "America/New_York", language: "English",
    roleIds: ["role-4"], twoFactorEnabled: false,
    lastLogin: daysAgo(14), lastPasswordChange: daysAgo(180),
    failedLoginAttempts: 5, createdAt: daysAgo(250), updatedAt: daysAgo(7),
  },
];

// ── Permissions ───────────────────────────────────────────────────

const MODULES: Record<string, { resource: string; actions: string[] }[]> = {
  Music: [
    { resource: "Tracks", actions: ["create", "edit", "delete", "publish", "view"] },
    { resource: "Collections", actions: ["create", "edit", "delete", "publish", "view"] },
    { resource: "Artists", actions: ["create", "edit", "delete", "view"] },
    { resource: "Genres", actions: ["create", "edit", "delete", "view"] },
  ],
  Store: [
    { resource: "Orders", actions: ["view", "refund", "export"] },
    { resource: "Customers", actions: ["view", "edit", "suspend", "export"] },
    { resource: "Coupons", actions: ["create", "edit", "delete", "view"] },
    { resource: "Offers", actions: ["view", "counter", "accept", "reject"] },
  ],
  Content: [
    { resource: "Blog Posts", actions: ["create", "edit", "delete", "publish", "view"] },
    { resource: "Pages", actions: ["create", "edit", "delete", "publish", "view"] },
    { resource: "FAQ", actions: ["create", "edit", "delete", "view"] },
    { resource: "Media", actions: ["upload", "delete", "view"] },
  ],
  Finance: [
    { resource: "Revenue", actions: ["view", "export"] },
    { resource: "Payouts", actions: ["view", "approve", "export"] },
    { resource: "Reports", actions: ["view", "export"] },
  ],
  Settings: [
    { resource: "Platform", actions: ["view", "edit"] },
    { resource: "Users", actions: ["invite", "edit", "suspend", "deactivate", "view"] },
    { resource: "Roles", actions: ["create", "edit", "delete", "view"] },
  ],
};

let permId = 0;
export const MOCK_PERMISSIONS: Permission[] = [];
export const MOCK_PERMISSION_GROUPS: PermissionGroup[] = [];

for (const [module, resources] of Object.entries(MODULES)) {
  const group: PermissionGroup = { module, resources: [] };
  for (const { resource, actions } of resources) {
    const perms: Permission[] = actions.map(action => ({
      id: `perm-${++permId}`,
      module, resource, action,
      description: `${action.charAt(0).toUpperCase() + action.slice(1)} ${resource.toLowerCase()}`,
    }));
    MOCK_PERMISSIONS.push(...perms);
    group.resources.push({ resource, permissions: perms });
  }
  MOCK_PERMISSION_GROUPS.push(group);
}

// Assign all permissions to Super Admin
MOCK_ROLES[0].permissionIds = MOCK_PERMISSIONS.map(p => p.id);
MOCK_ROLES[0].permissionIds.length; // hint for TS

// Fill other roles with realistic subsets
const byModule = (m: string) => MOCK_PERMISSIONS.filter(p => p.module === m).map(p => p.id);
const byResource = (r: string) => MOCK_PERMISSIONS.filter(p => p.resource === r).map(p => p.id);

MOCK_ROLES[1].permissionIds = [...byModule("Music"), ...byResource("Media")];
MOCK_ROLES[2].permissionIds = [...byModule("Content")];
MOCK_ROLES[3].permissionIds = [...byResource("Orders"), ...byResource("Customers"), ...byResource("Offers")];
MOCK_ROLES[4].permissionIds = [...byModule("Finance")];
MOCK_ROLES[5].permissionIds = [...byResource("Coupons"), ...byResource("Blog Posts"), ...byResource("FAQ")];

// Update counts
MOCK_ROLES.forEach(r => r.permissionIds.length); // ensure computed

// ── Invitations ───────────────────────────────────────────────────

export const MOCK_INVITATIONS: Invitation[] = [
  { id: "inv-1", email: "james.park@example.com", roleIds: ["role-2"], invitedBy: "John Carter", sentAt: daysAgo(3), expiresAt: daysFromNow(4), status: "pending", token: "tok_abc" },
  { id: "inv-2", email: "nina.j@example.com", roleIds: ["role-3"], invitedBy: "Sarah Support", sentAt: daysAgo(8), expiresAt: daysAgo(1), status: "expired", token: "tok_def" },
  { id: "inv-3", email: "omar.s@example.com", roleIds: ["role-4"], invitedBy: "John Carter", sentAt: daysAgo(1), expiresAt: daysFromNow(6), status: "pending", token: "tok_ghi" },
  { id: "inv-4", email: "priya.k@example.com", roleIds: ["role-6"], invitedBy: "Sarah Support", sentAt: daysAgo(15), expiresAt: daysAgo(8), status: "accepted", token: "tok_jkl" },
];

// ── Sessions ──────────────────────────────────────────────────────

export const MOCK_SESSIONS: UserSession[] = [
  { id: "sess-1", userId: "usr-001", userName: "John Carter", device: "Desktop", browser: "Chrome 120", os: "macOS 14", ipAddress: "192.168.1.10", location: "New York, US", lastActivity: hoursAgo(0), isCurrent: true },
  { id: "sess-2", userId: "usr-001", userName: "John Carter", device: "Mobile", browser: "Safari 17", os: "iOS 17", ipAddress: "10.0.0.42", location: "New York, US", lastActivity: hoursAgo(4), isCurrent: false },
  { id: "sess-3", userId: "usr-002", userName: "Sarah Support", device: "Desktop", browser: "Firefox 121", os: "Windows 11", ipAddress: "203.0.113.14", location: "Chicago, US", lastActivity: hoursAgo(1), isCurrent: false },
  { id: "sess-4", userId: "usr-003", userName: "Maya Osei", device: "Desktop", browser: "Chrome 120", os: "Ubuntu 22.04", ipAddress: "41.66.192.1", location: "Accra, GH", lastActivity: hoursAgo(3), isCurrent: false },
  { id: "sess-5", userId: "usr-004", userName: "Daniel Wu", device: "Tablet", browser: "Safari 17", os: "iPadOS 17", ipAddress: "172.16.0.5", location: "Los Angeles, US", lastActivity: hoursAgo(10), isCurrent: false },
  { id: "sess-6", userId: "usr-006", userName: "Kevin James", device: "Desktop", browser: "Edge 120", os: "Windows 11", ipAddress: "86.12.44.201", location: "London, GB", lastActivity: hoursAgo(2), isCurrent: false },
];

// ── Activity Logs ─────────────────────────────────────────────────

export const MOCK_ACTIVITY: ActivityLog[] = [
  { id: "act-1", userId: "usr-001", userName: "John Carter", userAvatar: "https://i.pravatar.cc/150?img=1", module: "Settings", action: "invite_user", entityType: "Invitation", entityId: "inv-3", entityTitle: "omar.s@example.com", ipAddress: "192.168.1.10", result: "success", createdAt: hoursAgo(1) },
  { id: "act-2", userId: "usr-002", userName: "Sarah Support", userAvatar: "https://i.pravatar.cc/150?img=5", module: "Music", action: "publish_track", entityType: "Track", entityId: "trk-1", entityTitle: "Midnight Bloom", ipAddress: "203.0.113.14", result: "success", createdAt: hoursAgo(2) },
  { id: "act-3", userId: "usr-003", userName: "Maya Osei", userAvatar: "https://i.pravatar.cc/150?img=10", module: "Content", action: "create_post", entityType: "Blog Post", entityId: "pst-1", entityTitle: "Top 10 Trap Producers", ipAddress: "41.66.192.1", result: "success", createdAt: hoursAgo(3) },
  { id: "act-4", userId: "usr-007", userName: "Alex Torres", userAvatar: "https://i.pravatar.cc/150?img=15", module: "Store", action: "view_customer", entityType: "Customer", entityId: "cus-4", entityTitle: "sara.m", ipAddress: "198.51.100.1", result: "blocked", createdAt: hoursAgo(6) },
  { id: "act-5", userId: "usr-001", userName: "John Carter", userAvatar: "https://i.pravatar.cc/150?img=1", module: "Settings", action: "suspend_user", entityType: "User", entityId: "usr-7", entityTitle: "Alex Torres", ipAddress: "192.168.1.10", result: "success", createdAt: hoursAgo(8) },
  { id: "act-6", userId: "usr-004", userName: "Daniel Wu", userAvatar: "https://i.pravatar.cc/150?img=8", module: "Store", action: "refund_order", entityType: "Order", entityId: "ord-1", entityTitle: "ORD-8821", ipAddress: "172.16.0.5", result: "success", createdAt: hoursAgo(10) },
  { id: "act-7", userId: "usr-005", userName: "Lena Richter", userAvatar: null, module: "Finance", action: "export_report", entityType: "Report", entityId: "rpt-1", entityTitle: "Q4 Revenue Report", ipAddress: "85.22.113.5", result: "success", createdAt: hoursAgo(14) },
  { id: "act-8", userId: "usr-002", userName: "Sarah Support", userAvatar: "https://i.pravatar.cc/150?img=5", module: "Music", action: "delete_track", entityType: "Track", entityId: "trk-5", entityTitle: "Deleted Beat", ipAddress: "203.0.113.14", result: "success", createdAt: daysAgo(1) },
  { id: "act-9", userId: "usr-006", userName: "Kevin James", userAvatar: "https://i.pravatar.cc/150?img=12", module: "Content", action: "create_coupon", entityType: "Coupon", entityId: "cpn-3", entityTitle: "SUMMER25", ipAddress: "86.12.44.201", result: "success", createdAt: daysAgo(1) },
  { id: "act-10", userId: "usr-003", userName: "Maya Osei", userAvatar: "https://i.pravatar.cc/150?img=10", module: "Content", action: "upload_media", entityType: "Media", entityId: "ast-4", entityTitle: "blog-licensing-guide.jpg", ipAddress: "41.66.192.1", result: "success", createdAt: daysAgo(2) },
];
