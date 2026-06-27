// app/(dashboard)/users/page.tsx
"use client";

import { useState, useMemo } from "react";
import UsersHeader from "@/components/users/UsersHeader";
import WorkspaceTabs from "@/components/users/WorkspaceTabs";
import UsersTable from "@/components/users/UsersTable";
import UserDrawer from "@/components/users/UserDrawer";
import InviteUserModal from "@/components/users/InviteUserModal";
import {
  MOCK_USERS, MOCK_ROLES, MOCK_PERMISSION_GROUPS,
  MOCK_INVITATIONS, MOCK_SESSIONS, MOCK_ACTIVITY,
} from "@/services/users/mock-data";
import type { StaffUser, Role, Invitation, UserSession, UsersTab } from "@/services/users/types";
import Toolbar from "@/components/ui/Toolbar";
import { ActivityLogTable, InvitationsTable, PermissionsMatrix, RolesTable, SessionsTable } from "@/components/users/WorkspaceTables";

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<UsersTab>("users");

  const [users, setUsers] = useState<StaffUser[]>(MOCK_USERS);
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [invitations, setInvitations] = useState<Invitation[]>(MOCK_INVITATIONS);
  const [sessions, setSessions] = useState<UserSession[]>(MOCK_SESSIONS);

  const [drawerUser, setDrawerUser] = useState<StaffUser | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [activitySearch, setActivitySearch] = useState("");

  // ── Filtering ────────────────────────────────────────────────

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(u =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q) ||
      u.jobTitle.toLowerCase().includes(q)
    );
  }, [users, search]);

  const filteredActivity = useMemo(() => {
    if (!activitySearch.trim()) return MOCK_ACTIVITY;
    const q = activitySearch.toLowerCase();
    return MOCK_ACTIVITY.filter(a =>
      a.userName.toLowerCase().includes(q) ||
      a.action.toLowerCase().includes(q) ||
      a.module.toLowerCase().includes(q) ||
      a.entityTitle.toLowerCase().includes(q)
    );
  }, [activitySearch]);

  // ── Actions ──────────────────────────────────────────────────

  const handleSuspend = (user: StaffUser) => {
    const next = user.status === "suspended" ? "active" : "suspended";
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: next, updatedAt: new Date().toISOString() } : u));
    if (drawerUser?.id === user.id) setDrawerUser(prev => prev ? { ...prev, status: next } : prev);
  };

  const handleResetPassword = (user: StaffUser) => {
    alert(`Password reset email sent to ${user.email}`);
  };

  const handleInvite = async (email: string, roleIds: string[], _message: string) => {
    await new Promise(r => setTimeout(r, 600));
    const newInv: Invitation = {
      id: `inv-${Date.now()}`, email, roleIds,
      invitedBy: "John Carter",
      sentAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      status: "pending", token: `tok_${Math.random().toString(36).slice(2)}`,
    };
    setInvitations(prev => [newInv, ...prev]);
  };

  const handleResendInvite = (inv: Invitation) => {
    setInvitations(prev => prev.map(i => i.id === inv.id ? { ...i, sentAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 7 * 86400000).toISOString() } : i));
  };

  const handleCancelInvite = (inv: Invitation) => {
    if (!window.confirm(`Cancel invitation to ${inv.email}?`)) return;
    setInvitations(prev => prev.map(i => i.id === inv.id ? { ...i, status: "cancelled" } : i));
  };

  const handleTerminateSession = (sess: UserSession) => {
    if (!window.confirm("Terminate this session?")) return;
    setSessions(prev => prev.filter(s => s.id !== sess.id));
  };

  const handleDuplicateRole = (role: Role) => {
    const dupe: Role = { ...role, id: `role-dupe-${Date.now()}`, name: `${role.name} (Copy)`, isSystem: false, userCount: 0, createdAt: new Date().toISOString() };
    setRoles(prev => [...prev, dupe]);
  };

  const handleDeleteRole = (role: Role) => {
    if (role.isSystem) { alert("System roles cannot be deleted."); return; }
    if (role.userCount > 0) { alert(`Cannot delete "${role.name}" — ${role.userCount} user${role.userCount > 1 ? "s are" : " is"} assigned to it.`); return; }
    if (!window.confirm(`Delete role "${role.name}"?`)) return;
    setRoles(prev => prev.filter(r => r.id !== role.id));
  };

  // Tab counts
  const tabCounts: Partial<Record<UsersTab, number>> = {
    users: users.filter(u => u.status === "active").length,
    invitations: invitations.filter(i => i.status === "pending").length,
    sessions: sessions.length,
  };

  return (
    <div className="flex flex-col gap-6">
      <UsersHeader onInvite={() => setInviteOpen(true)} onCreateRole={() => { }} />

      <div className="bg-surface border border-[color:var(--border-subtle)] rounded-2xl overflow-hidden">
        {/* Workspace tabs */}
        <div className="px-5 pt-4">
          <WorkspaceTabs active={activeTab} onChange={t => { setActiveTab(t); setSearch(""); }} counts={tabCounts} />
        </div>

        {/* Per-tab toolbar */}
        {(activeTab === "users") && (
          <div className="px-5 pt-4">
            <Toolbar>
              <Toolbar.Search
                value={search}
                onChange={setSearch}
                placeholder="Search by name, email, department..."
              />
              <Toolbar.Count n={filteredUsers.length} label="member" />
            </Toolbar>
          </div>
        )}

        {/* Tab content */}
        <div className="p-5">
          {activeTab === "users" && (
            <UsersTable
              users={filteredUsers}
              roles={roles}
              onRowClick={setDrawerUser}
              onEdit={setDrawerUser}
              onSuspend={handleSuspend}
              onResetPassword={handleResetPassword}
              onDeactivate={u => { /* TODO */ }}
            />
          )}

          {activeTab === "roles" && (
            <RolesTable
              roles={roles}
              onEdit={r => { }}
              onDuplicate={handleDuplicateRole}
              onDelete={handleDeleteRole}
            />
          )}

          {activeTab === "permissions" && (
            <PermissionsMatrix groups={MOCK_PERMISSION_GROUPS} />
          )}

          {activeTab === "invitations" && (
            <InvitationsTable
              invitations={invitations}
              roles={roles}
              onResend={handleResendInvite}
              onCancel={handleCancelInvite}
            />
          )}

          {activeTab === "sessions" && (
            <SessionsTable
              sessions={sessions}
              onTerminate={handleTerminateSession}
            />
          )}

          {activeTab === "activity" && (
            <ActivityLogTable
              logs={filteredActivity}
              search={activitySearch}
              onSearch={setActivitySearch}
            />
          )}
        </div>
      </div>

      <UserDrawer
        user={drawerUser}
        roles={roles}
        onClose={() => setDrawerUser(null)}
        onEdit={u => { setDrawerUser(null); alert(`Open edit form for ${u.firstName}`); }}
        onSuspend={handleSuspend}
        onResetPassword={handleResetPassword}
      />

      <InviteUserModal
        open={inviteOpen}
        roles={roles}
        onClose={() => setInviteOpen(false)}
        onInvite={handleInvite}
      />
    </div>
  );
}
