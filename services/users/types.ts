// services/users/types.ts

export type UserStatus = "active" | "suspended" | "deactivated" | "invited";
export type UsersTab = "users" | "roles" | "permissions" | "invitations" | "sessions" | "activity";
export type InvitationStatus = "pending" | "accepted" | "expired" | "cancelled";
export type PermissionEffect = "allow" | "deny" | "inherited";
export type ActivityResult = "success" | "failure" | "blocked";

export interface StaffUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  status: UserStatus;
  department: string;
  jobTitle: string;
  phone: string;
  timezone: string;
  language: string;
  roleIds: string[];
  twoFactorEnabled: boolean;
  lastLogin: string | null;
  lastPasswordChange: string | null;
  failedLoginAttempts: number;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  permissionIds: string[];
  userCount: number;
  isSystem: boolean; // system roles can't be deleted
  createdAt: string;
}

export interface Permission {
  id: string;
  module: string;
  resource: string;
  action: string;
  description: string;
}

export interface PermissionGroup {
  module: string;
  resources: {
    resource: string;
    permissions: Permission[];
  }[];
}

export interface Invitation {
  id: string;
  email: string;
  roleIds: string[];
  invitedBy: string;
  sentAt: string;
  expiresAt: string;
  status: InvitationStatus;
  token: string;
}

export interface UserSession {
  id: string;
  userId: string;
  userName: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  lastActivity: string;
  isCurrent: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  module: string;
  action: string;
  entityType: string;
  entityId: string;
  entityTitle: string;
  ipAddress: string;
  result: ActivityResult;
  createdAt: string;
}
