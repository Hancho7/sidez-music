// components/users/WorkspaceTables.tsx
// Contains: RolesTable, PermissionsMatrix, InvitationsTable, SessionsTable, ActivityLogTable
"use client";

import { useState } from "react";
import {
  Pencil, Copy, Trash2, Shield, Mail, Monitor, Activity,
  CheckCircle2, Clock, XCircle, RefreshCw, LogOut, Check, Minus,
  ArrowUpRight,
} from "lucide-react";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";
import type { Role, Invitation, UserSession, ActivityLog, PermissionGroup, ActivityResult } from "@/services/users/types";

// ── Shared helpers ───────────────────────────────────────────────

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtRelative(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
function getInitials(name: string) {
  return name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
}

// ── Roles Table ──────────────────────────────────────────────────

export function RolesTable({ roles, onEdit, onDuplicate, onDelete }: {
  roles: Role[];
  onEdit: (r: Role) => void;
  onDuplicate: (r: Role) => void;
  onDelete: (r: Role) => void;
}) {
  const { hoveredId, setHoveredId } = useHoveredRow();

  return (
    <DataTable isEmpty={roles.length === 0} emptyState={<DataTable.EmptyState icon={<Shield size={22} className="text-accent" />} title="No roles yet" message="Create your first role to manage permissions." />}>
      <DataTable.Header>
        <DataTable.Col>Role</DataTable.Col>
        <DataTable.Col>Description</DataTable.Col>
        <DataTable.Col align="center">Users</DataTable.Col>
        <DataTable.Col align="center">Permissions</DataTable.Col>
        <DataTable.Col>Created</DataTable.Col>
        <DataTable.ActionsCol />
      </DataTable.Header>
      <DataTable.Body>
        {roles.map(role => {
          const isHovered = hoveredId === role.id;
          return (
            <DataTable.Row key={role.id} isHovered={isHovered} onHoverChange={h => setHoveredId(h ? role.id : null)}>
              <DataTable.Cell>
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: role.color }} />
                  <span className="text-sm font-semibold text-foreground">{role.name}</span>
                  {role.isSystem && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-accent/10 text-accent uppercase">System</span>}
                </div>
              </DataTable.Cell>
              <DataTable.Cell className="text-xs text-[color:var(--text-secondary)] max-w-[240px] truncate">{role.description}</DataTable.Cell>
              <DataTable.Cell align="center" className="text-sm font-semibold text-foreground">{role.userCount}</DataTable.Cell>
              <DataTable.Cell align="center" className="text-sm font-semibold text-foreground">{role.permissionIds.length}</DataTable.Cell>
              <DataTable.Cell className="text-xs text-[color:var(--text-muted)] whitespace-nowrap">{fmtDate(role.createdAt)}</DataTable.Cell>
              <DataTable.ActionsCell visible={isHovered}>
                <DataTable.ActionBtn onClick={() => onEdit(role)} icon={<Pencil size={13} />} title="Edit" />
                <DataTable.ActionBtn onClick={() => onDuplicate(role)} icon={<Copy size={13} />} title="Duplicate" />
                <DataTable.ActionBtn onClick={() => onDelete(role)} icon={<Trash2 size={13} />} title="Delete" danger />
              </DataTable.ActionsCell>
            </DataTable.Row>
          );
        })}
      </DataTable.Body>
    </DataTable>
  );
}

// ── Permissions Matrix ───────────────────────────────────────────

type PermMatrix = Record<string, Record<string, Record<string, boolean>>>;

export function PermissionsMatrix({ groups }: { groups: PermissionGroup[] }) {
  const [search, setSearch] = useState("");
  const [activeRole, setActiveRole] = useState("all");

  const filtered = search
    ? groups.map(g => ({ ...g, resources: g.resources.filter(r => r.resource.toLowerCase().includes(search.toLowerCase()) || r.permissions.some(p => p.action.toLowerCase().includes(search.toLowerCase()))) })).filter(g => g.resources.length > 0)
    : groups;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search permissions..." className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl text-sm text-foreground font-inherit px-3.5 py-2.5 pl-9 outline-none focus:border-accent transition-colors placeholder:text-[color:var(--text-muted)]" />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg></span>
        </div>
        <p className="text-xs text-[color:var(--text-muted)]">{groups.reduce((acc, g) => acc + g.resources.reduce((a, r) => a + r.permissions.length, 0), 0)} total permissions</p>
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map(group => (
          <div key={group.module} className="bg-surface border border-[color:var(--border-subtle)] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[color:var(--border-subtle)] bg-elevated/30">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">{group.module}</p>
            </div>
            <div className="divide-y divide-[color:var(--border-subtle)]">
              {group.resources.map(({ resource, permissions }) => (
                <div key={resource} className="flex items-center gap-4 px-4 py-3">
                  <p className="text-sm text-[color:var(--text-secondary)] w-32 shrink-0">{resource}</p>
                  <div className="flex flex-wrap gap-2">
                    {permissions.map(p => (
                      <span key={p.id} className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 capitalize">
                        <Check size={9} /> {p.action}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Invitations Table ────────────────────────────────────────────

export function InvitationsTable({ invitations, roles, onResend, onCancel }: {
  invitations: Invitation[];
  roles: Role[];
  onResend: (inv: Invitation) => void;
  onCancel: (inv: Invitation) => void;
}) {
  const { hoveredId, setHoveredId } = useHoveredRow();

  const statusVariant = (s: Invitation["status"]): "warning" | "success" | "muted" | "danger" => ({
    pending: "warning", accepted: "success", expired: "muted", cancelled: "danger",
  }[s] as never);

  return (
    <DataTable isEmpty={invitations.length === 0} emptyState={<DataTable.EmptyState icon={<Mail size={22} className="text-accent" />} title="No invitations sent" message="Invite team members to join the platform." />}>
      <DataTable.Header>
        <DataTable.Col>Email</DataTable.Col>
        <DataTable.Col>Role</DataTable.Col>
        <DataTable.Col>Invited By</DataTable.Col>
        <DataTable.Col>Sent</DataTable.Col>
        <DataTable.Col>Expires</DataTable.Col>
        <DataTable.Col>Status</DataTable.Col>
        <DataTable.ActionsCol />
      </DataTable.Header>
      <DataTable.Body>
        {invitations.map(inv => {
          const isHovered = hoveredId === inv.id;
          const invRoles = roles.filter(r => inv.roleIds.includes(r.id));
          const isPending = inv.status === "pending";
          return (
            <DataTable.Row key={inv.id} isHovered={isHovered} onHoverChange={h => setHoveredId(h ? inv.id : null)}>
              <DataTable.Cell className="text-sm font-semibold text-foreground">{inv.email}</DataTable.Cell>
              <DataTable.Cell>
                <div className="flex gap-1">
                  {invRoles.map(r => (
                    <span key={r.id} className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${r.color}18`, color: r.color }}>{r.name}</span>
                  ))}
                </div>
              </DataTable.Cell>
              <DataTable.Cell className="text-xs text-[color:var(--text-secondary)]">{inv.invitedBy}</DataTable.Cell>
              <DataTable.Cell className="text-xs text-[color:var(--text-muted)] whitespace-nowrap">{fmtDate(inv.sentAt)}</DataTable.Cell>
              <DataTable.Cell className={`text-xs whitespace-nowrap ${inv.status === "expired" ? "text-danger" : "text-[color:var(--text-muted)]"}`}>{fmtDate(inv.expiresAt)}</DataTable.Cell>
              <DataTable.Cell><DataTable.StatusBadge label={inv.status.charAt(0).toUpperCase() + inv.status.slice(1)} variant={statusVariant(inv.status)} /></DataTable.Cell>
              <DataTable.ActionsCell visible={isHovered}>
                {isPending && <DataTable.ActionBtn onClick={() => onResend(inv)} icon={<RefreshCw size={13} />} title="Resend" />}
                {isPending && <DataTable.ActionBtn onClick={() => onCancel(inv)} icon={<XCircle size={13} />} title="Cancel" danger />}
              </DataTable.ActionsCell>
            </DataTable.Row>
          );
        })}
      </DataTable.Body>
    </DataTable>
  );
}

// ── Sessions Table ───────────────────────────────────────────────

export function SessionsTable({ sessions, onTerminate }: {
  sessions: UserSession[];
  onTerminate: (sess: UserSession) => void;
}) {
  const { hoveredId, setHoveredId } = useHoveredRow();

  return (
    <DataTable isEmpty={sessions.length === 0} emptyState={<DataTable.EmptyState icon={<Monitor size={22} className="text-accent" />} title="No active sessions" message="Active user sessions will appear here." />}>
      <DataTable.Header>
        <DataTable.Col>User</DataTable.Col>
        <DataTable.Col>Device</DataTable.Col>
        <DataTable.Col>Browser</DataTable.Col>
        <DataTable.Col>OS</DataTable.Col>
        <DataTable.Col>IP</DataTable.Col>
        <DataTable.Col>Location</DataTable.Col>
        <DataTable.Col>Last Activity</DataTable.Col>
        <DataTable.ActionsCol />
      </DataTable.Header>
      <DataTable.Body>
        {sessions.map(sess => {
          const isHovered = hoveredId === sess.id;
          return (
            <DataTable.Row key={sess.id} isHovered={isHovered} onHoverChange={h => setHoveredId(h ? sess.id : null)}>
              <DataTable.Cell>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-[9px] font-bold text-accent shrink-0">{getInitials(sess.userName)}</div>
                  <span className="text-xs font-semibold text-foreground">{sess.userName}</span>
                  {sess.isCurrent && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-success/10 text-success">You</span>}
                </div>
              </DataTable.Cell>
              <DataTable.Cell className="text-xs text-[color:var(--text-secondary)]">{sess.device}</DataTable.Cell>
              <DataTable.Cell className="text-xs text-[color:var(--text-secondary)]">{sess.browser}</DataTable.Cell>
              <DataTable.Cell className="text-xs text-[color:var(--text-secondary)]">{sess.os}</DataTable.Cell>
              <DataTable.Cell className="font-mono text-xs text-[color:var(--text-muted)]">{sess.ipAddress}</DataTable.Cell>
              <DataTable.Cell className="text-xs text-[color:var(--text-secondary)]">{sess.location}</DataTable.Cell>
              <DataTable.Cell className="text-xs text-[color:var(--text-muted)] whitespace-nowrap">{fmtRelative(sess.lastActivity)}</DataTable.Cell>
              <DataTable.ActionsCell visible={isHovered}>
                {!sess.isCurrent && <DataTable.ActionBtn onClick={() => onTerminate(sess)} icon={<LogOut size={13} />} title="Terminate session" danger />}
              </DataTable.ActionsCell>
            </DataTable.Row>
          );
        })}
      </DataTable.Body>
    </DataTable>
  );
}

// ── Activity Log Table ───────────────────────────────────────────

const RESULT_CLASSES: Record<ActivityResult, string> = {
  success: "bg-success/10 text-success",
  failure: "bg-danger/10 text-danger",
  blocked: "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]",
};

export function ActivityLogTable({ logs, onSearch, search }: {
  logs: ActivityLog[];
  onSearch: (v: string) => void;
  search: string;
}) {
  const { hoveredId, setHoveredId } = useHoveredRow();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative">
          <input value={search} onChange={e => onSearch(e.target.value)} placeholder="Search logs..." className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl text-sm text-foreground font-inherit px-3.5 py-2.5 pl-9 outline-none focus:border-accent transition-colors placeholder:text-[color:var(--text-muted)] w-64" />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg></span>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[color:var(--border-subtle)] bg-transparent text-xs font-semibold text-[color:var(--text-secondary)] cursor-pointer hover:bg-elevated hover:text-foreground transition-colors">
          <ArrowUpRight size={13} /> Export CSV
        </button>
      </div>

      <DataTable isEmpty={logs.length === 0} emptyState={<DataTable.EmptyState icon={<Activity size={22} className="text-accent" />} title="No activity yet" message="User actions will be recorded here." />}>
        <DataTable.Header>
          <DataTable.Col>Timestamp</DataTable.Col>
          <DataTable.Col>User</DataTable.Col>
          <DataTable.Col>Module</DataTable.Col>
          <DataTable.Col>Action</DataTable.Col>
          <DataTable.Col>Entity</DataTable.Col>
          <DataTable.Col>IP</DataTable.Col>
          <DataTable.Col align="center">Result</DataTable.Col>
        </DataTable.Header>
        <DataTable.Body>
          {logs.map(log => {
            const isHovered = hoveredId === log.id;
            return (
              <DataTable.Row key={log.id} isHovered={isHovered} onHoverChange={h => setHoveredId(h ? log.id : null)}>
                <DataTable.Cell className="text-xs text-[color:var(--text-muted)] whitespace-nowrap">{fmtRelative(log.createdAt)}</DataTable.Cell>
                <DataTable.Cell>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-elevated flex items-center justify-center shrink-0">
                      {log.userAvatar ? <img src={log.userAvatar} alt={log.userName} className="w-full h-full object-cover" /> : <span className="text-[9px] font-bold text-accent">{getInitials(log.userName)}</span>}
                    </div>
                    <span className="text-xs font-semibold text-foreground">{log.userName}</span>
                  </div>
                </DataTable.Cell>
                <DataTable.Cell><span className="text-[10px] font-semibold text-[color:var(--text-muted)] bg-elevated px-2 py-0.5 rounded">{log.module}</span></DataTable.Cell>
                <DataTable.Cell className="text-xs font-mono text-[color:var(--text-secondary)]">{log.action}</DataTable.Cell>
                <DataTable.Cell>
                  <div className="min-w-0">
                    <span className="text-[10px] text-[color:var(--text-muted)]">{log.entityType} · </span>
                    <span className="text-xs text-[color:var(--text-secondary)] truncate">{log.entityTitle}</span>
                  </div>
                </DataTable.Cell>
                <DataTable.Cell className="font-mono text-xs text-[color:var(--text-muted)]">{log.ipAddress}</DataTable.Cell>
                <DataTable.Cell align="center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${RESULT_CLASSES[log.result]}`}>{log.result}</span>
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </DataTable.Body>
      </DataTable>
    </div>
  );
}
