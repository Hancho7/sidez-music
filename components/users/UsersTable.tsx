// components/users/UsersTable.tsx
"use client";

import { Eye, Pencil, ShieldOff, KeyRound, UserX, ShieldCheck } from "lucide-react";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";
import type { StaffUser, UserStatus, Role } from "@/services/users/types";

interface Props {
  users: StaffUser[];
  roles: Role[];
  onRowClick: (u: StaffUser) => void;
  onEdit: (u: StaffUser) => void;
  onSuspend: (u: StaffUser) => void;
  onResetPassword: (u: StaffUser) => void;
  onDeactivate: (u: StaffUser) => void;
}

const STATUS_VARIANT: Record<UserStatus, "success" | "warning" | "muted" | "danger" | "cyan"> = {
  active: "success",
  suspended: "danger",
  deactivated: "muted",
  invited: "cyan",
};

const STATUS_LABEL: Record<UserStatus, string> = {
  active: "Active", suspended: "Suspended", deactivated: "Deactivated", invited: "Invited",
};

function getInitials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase();
}

function fmtLastLogin(d: string | null) {
  if (!d) return "Never";
  const diff = Date.now() - new Date(d).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function UsersTable({ users, roles, onRowClick, onEdit, onSuspend, onResetPassword, onDeactivate }: Props) {
  const { hoveredId, setHoveredId } = useHoveredRow();

  return (
    <DataTable
      isEmpty={users.length === 0}
      emptyState={
        <DataTable.EmptyState
          icon={<Eye size={22} className="text-accent" />}
          title="No team members yet"
          message="Invite your first staff member to get started."
        />
      }
    >
      <DataTable.Header>
        <DataTable.Col>Member</DataTable.Col>
        <DataTable.Col>Role</DataTable.Col>
        <DataTable.Col>Department</DataTable.Col>
        <DataTable.Col>Status</DataTable.Col>
        <DataTable.Col>Last Login</DataTable.Col>
        <DataTable.Col align="center">2FA</DataTable.Col>
        <DataTable.ActionsCol />
      </DataTable.Header>

      <DataTable.Body>
        {users.map(user => {
          const isHovered = hoveredId === user.id;
          const userRoles = roles.filter(r => user.roleIds.includes(r.id));

          return (
            <DataTable.Row
              key={user.id}
              onClick={() => onRowClick(user)}
              isHovered={isHovered}
              onHoverChange={h => setHoveredId(h ? user.id : null)}
            >
              {/* Member */}
              <DataTable.Cell>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-[color:var(--border-subtle)]"
                    style={{ background: user.avatar ? undefined : "#1f2547" }}>
                    {user.avatar
                      ? <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
                      : <span className="text-xs font-bold text-[color:var(--text-secondary)]">{getInitials(user.firstName, user.lastName)}</span>
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</p>
                    <p className="text-[11px] text-[color:var(--text-muted)] truncate max-w-[180px]">{user.email}</p>
                  </div>
                </div>
              </DataTable.Cell>

              {/* Roles */}
              <DataTable.Cell>
                <div className="flex flex-wrap gap-1">
                  {userRoles.slice(0, 2).map(r => (
                    <span key={r.id} className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${r.color}18`, color: r.color }}>
                      {r.name}
                    </span>
                  ))}
                  {userRoles.length > 2 && (
                    <span className="text-[10px] text-[color:var(--text-muted)] px-1">+{userRoles.length - 2}</span>
                  )}
                </div>
              </DataTable.Cell>

              {/* Department */}
              <DataTable.Cell>
                <span className="text-xs text-[color:var(--text-secondary)]">{user.department}</span>
              </DataTable.Cell>

              {/* Status */}
              <DataTable.Cell>
                <DataTable.StatusBadge label={STATUS_LABEL[user.status]} variant={STATUS_VARIANT[user.status]} />
              </DataTable.Cell>

              {/* Last Login */}
              <DataTable.Cell className="text-xs text-[color:var(--text-muted)] whitespace-nowrap">
                {fmtLastLogin(user.lastLogin)}
              </DataTable.Cell>

              {/* 2FA */}
              <DataTable.Cell align="center">
                {user.twoFactorEnabled
                  ? <ShieldCheck size={14} className="text-success mx-auto" />
                  : <ShieldOff size={14} className="text-[color:var(--text-muted)] mx-auto" />
                }
              </DataTable.Cell>

              {/* Actions */}
              <DataTable.ActionsCell visible={isHovered}>
                <DataTable.ActionBtn onClick={() => onRowClick(user)} icon={<Eye size={13} />} title="View" />
                <DataTable.ActionBtn onClick={() => onEdit(user)} icon={<Pencil size={13} />} title="Edit" />
                <DataTable.ActionBtn onClick={() => onResetPassword(user)} icon={<KeyRound size={13} />} title="Reset password" />
                <DataTable.ActionBtn
                  onClick={() => onSuspend(user)}
                  icon={user.status === "suspended" ? <ShieldCheck size={13} /> : <ShieldOff size={13} />}
                  title={user.status === "suspended" ? "Reactivate" : "Suspend"}
                  danger={user.status !== "suspended"}
                />
              </DataTable.ActionsCell>
            </DataTable.Row>
          );
        })}
      </DataTable.Body>
    </DataTable>
  );
}
