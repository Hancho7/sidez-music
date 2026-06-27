// components/users/UserDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import {
  X, Pencil, ShieldCheck, ShieldOff, KeyRound,
  Monitor, Activity, Shield, User, Lock, Clock,
  CheckCircle2, XCircle, Globe, Plus, Trash2,
  LogOut,
} from "lucide-react";
import type { StaffUser, UserStatus, Role, UserSession, ActivityLog } from "@/services/users/types";
import { MOCK_SESSIONS, MOCK_ACTIVITY } from "@/services/users/mock-data";

interface Props {
  user: StaffUser | null;
  roles: Role[];
  onClose: () => void;
  onEdit: (u: StaffUser) => void;
  onSuspend: (u: StaffUser) => void;
  onResetPassword: (u: StaffUser) => void;
}

type Tab = "overview" | "roles" | "permissions" | "sessions" | "activity" | "security" | "profile";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "overview", label: "Overview", icon: <User size={13} /> },
  { key: "roles", label: "Roles", icon: <Shield size={13} /> },
  { key: "permissions", label: "Permissions", icon: <Lock size={13} /> },
  { key: "sessions", label: "Sessions", icon: <Monitor size={13} /> },
  { key: "activity", label: "Activity", icon: <Activity size={13} /> },
  { key: "security", label: "Security", icon: <ShieldCheck size={13} /> },
];

const STATUS_CLASSES: Record<UserStatus, string> = {
  active: "bg-success/10 text-success",
  suspended: "bg-danger/10 text-danger",
  deactivated: "bg-white/10 text-white/40",
  invited: "bg-accent-cyan/10 text-accent-cyan",
};

function fmtDate(d: string | null) {
  if (!d) return "Never";
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
function fmtRelative(d: string | null) {
  if (!d) return "Never";
  const diff = Date.now() - new Date(d).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days < 7 ? `${days}d ago` : fmtDate(d);
}
function getInitials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase();
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 border-b border-[color:var(--border-subtle)]/40 last:border-0">
      <span className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)]">{label}</span>
      <span className="text-sm text-[color:var(--text-secondary)]">{value}</span>
    </div>
  );
}

export default function UserDrawer({ user, roles, onClose, onEdit, onSuspend, onResetPassword }: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const [userRoleIds, setUserRoleIds] = useState<string[]>([]);


  useEffect(() => {
    if (user) { setTab("overview"); setUserRoleIds([...user.roleIds]); }
  }, [user?.id]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!user) return null;

  const userSessions = MOCK_SESSIONS.filter(s => s.userId === user.id);
  const userActivity = MOCK_ACTIVITY.filter(a => a.userId === user.id);
  const assignedRoles = roles.filter(r => userRoleIds.includes(r.id));
  const availableRoles = roles.filter(r => !userRoleIds.includes(r.id));

  const toggleRole = (roleId: string) => {
    setUserRoleIds(prev =>
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[350]" />

      <aside className="fixed top-0 right-0 bottom-0 w-[480px] bg-surface border-l border-[color:var(--border-subtle)] z-[360] flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border-subtle)] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shrink-0 border-2 border-[color:var(--border-subtle)]"
              style={{ background: user.avatar ? undefined : "#1f2547" }}>
              {user.avatar
                ? <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
                : <span className="text-sm font-bold text-[color:var(--text-secondary)]">{getInitials(user.firstName, user.lastName)}</span>
              }
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground">{user.firstName} {user.lastName}</p>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_CLASSES[user.status]}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
                <span className="text-[11px] text-[color:var(--text-muted)] truncate">{user.email}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={() => onEdit(user)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[color:var(--border-default)] bg-transparent text-[color:var(--text-secondary)] text-xs font-semibold cursor-pointer hover:bg-elevated hover:text-foreground transition-colors">
              <Pencil size={11} /> Edit
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[color:var(--border-subtle)] px-5 shrink-0 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={[
                "flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-0 bg-transparent cursor-pointer transition-colors border-b-2 -mb-px",
                tab === t.key ? "text-accent border-accent" : "text-[color:var(--text-muted)] border-transparent hover:text-foreground",
              ].join(" ")}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="flex flex-col gap-4">
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Roles", value: user.roleIds.length, color: "text-accent" },
                  { label: "Sessions", value: userSessions.length, color: "text-accent-cyan" },
                  { label: "Actions", value: userActivity.length, color: "text-[color:var(--accent-magenta)]" },
                ].map(s => (
                  <div key={s.label} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-3.5 text-center">
                    <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <MetaRow label="Department" value={user.department} />
                <MetaRow label="Job Title" value={user.jobTitle} />
                <MetaRow label="Phone" value={user.phone || "Not set"} />
                <MetaRow label="Timezone" value={
                  <span className="flex items-center gap-1.5"><Globe size={12} className="text-[color:var(--text-muted)]" />{user.timezone}</span>
                } />
                <MetaRow label="Language" value={user.language} />
                <MetaRow label="Last Login" value={fmtRelative(user.lastLogin)} />
                <MetaRow label="Member Since" value={fmtDate(user.createdAt)} />
                <MetaRow label="2FA" value={
                  user.twoFactorEnabled
                    ? <span className="flex items-center gap-1 text-success"><CheckCircle2 size={12} /> Enabled</span>
                    : <span className="flex items-center gap-1 text-danger"><XCircle size={12} /> Not enabled</span>
                } />
              </div>

              {/* Assigned roles preview */}
              {assignedRoles.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {assignedRoles.map(r => (
                    <span key={r.id} className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${r.color}18`, color: r.color }}>
                      <Shield size={10} /> {r.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ROLES */}
          {tab === "roles" && (
            <div className="flex flex-col gap-4">
              <p className="text-[11px] text-[color:var(--text-muted)]">Assigned roles determine what this user can do. Changes take effect immediately.</p>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--text-muted)] mb-2">Assigned</p>
                <div className="flex flex-col gap-2">
                  {assignedRoles.length === 0 ? (
                    <p className="text-sm text-[color:var(--text-muted)] text-center py-4">No roles assigned</p>
                  ) : (
                    assignedRoles.map(r => (
                      <div key={r.id} className="flex items-center justify-between gap-3 p-3 bg-[color:var(--bg-input)] border rounded-xl" style={{ borderColor: `${r.color}30` }}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ background: r.color }} />
                          <div>
                            <p className="text-sm font-semibold text-foreground">{r.name}</p>
                            <p className="text-[11px] text-[color:var(--text-muted)]">{r.permissionIds.length} permissions</p>
                          </div>
                        </div>
                        {!r.isSystem && (
                          <button onClick={() => toggleRole(r.id)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-danger hover:bg-danger/10 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {availableRoles.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--text-muted)] mb-2">Available to Add</p>
                  <div className="flex flex-col gap-1.5">
                    {availableRoles.map(r => (
                      <button key={r.id} onClick={() => toggleRole(r.id)}
                        className="flex items-center justify-between gap-3 p-3 bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl cursor-pointer hover:border-[color:var(--border-default)] transition-colors text-left">
                        <div className="flex items-center gap-2.5">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ background: r.color }} />
                          <div>
                            <p className="text-sm font-semibold text-foreground">{r.name}</p>
                            <p className="text-[11px] text-[color:var(--text-muted)]">{r.description}</p>
                          </div>
                        </div>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-accent/10 text-accent shrink-0">
                          <Plus size={13} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PERMISSIONS */}
          {tab === "permissions" && (
            <div className="flex flex-col gap-3">
              <p className="text-[11px] text-[color:var(--text-muted)]">Permissions inherited from assigned roles. Direct overrides can be set per user.</p>
              {assignedRoles.map(role => (
                <div key={role.id} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-[color:var(--border-subtle)] bg-elevated/30">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: role.color }} />
                    <p className="text-xs font-semibold text-foreground">{role.name}</p>
                    <span className="ml-auto text-[10px] text-[color:var(--text-muted)]">{role.permissionIds.length} permissions</span>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[11px] text-[color:var(--text-secondary)] leading-relaxed">{role.description}</p>
                  </div>
                </div>
              ))}
              {assignedRoles.length === 0 && <p className="text-sm text-[color:var(--text-muted)] text-center py-8">No roles assigned — no permissions granted.</p>}
            </div>
          )}

          {/* SESSIONS */}
          {tab === "sessions" && (
            <div className="flex flex-col gap-3">
              <p className="text-[11px] text-[color:var(--text-muted)]">{userSessions.length} active session{userSessions.length !== 1 ? "s" : ""}</p>
              {userSessions.length === 0 ? (
                <p className="text-sm text-[color:var(--text-muted)] text-center py-8">No active sessions</p>
              ) : (
                userSessions.map(sess => (
                  <div key={sess.id} className="flex items-start justify-between gap-3 bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Monitor size={13} className="text-[color:var(--text-muted)]" />
                        <p className="text-sm font-semibold text-foreground">{sess.device} · {sess.browser}</p>
                        {sess.isCurrent && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-success/10 text-success">Current</span>}
                      </div>
                      <p className="text-[11px] text-[color:var(--text-muted)]">{sess.os} · {sess.location}</p>
                      <p className="text-[11px] font-mono text-[color:var(--text-muted)] mt-0.5">{sess.ipAddress}</p>
                      <p className="text-[10px] text-[color:var(--text-muted)] mt-1 flex items-center gap-1">
                        <Clock size={10} /> Last active {new Date(sess.lastActivity).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {!sess.isCurrent && (
                      <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-danger/10 text-danger border border-danger/20 cursor-pointer hover:bg-danger/20 transition-colors shrink-0">
                        <LogOut size={11} /> Terminate
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* ACTIVITY */}
          {tab === "activity" && (
            <div className="flex flex-col gap-2.5">
              <p className="text-[11px] text-[color:var(--text-muted)]">{userActivity.length} recent actions</p>
              {userActivity.map((log, i) => (
                <div key={log.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${log.result === "success" ? "bg-success/10 text-success" : log.result === "blocked" ? "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]" : "bg-danger/10 text-danger"}`}>
                      <Activity size={12} />
                    </div>
                    {i < userActivity.length - 1 && <div className="w-px flex-1 min-h-[16px] bg-[color:var(--border-subtle)] my-1" />}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="text-sm font-semibold text-foreground font-mono">{log.action}</p>
                    <p className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{log.module} · {log.entityTitle}</p>
                    <p className="text-[10px] text-[color:var(--text-muted)] mt-1">{new Date(log.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} · {log.ipAddress}</p>
                  </div>
                </div>
              ))}
              {userActivity.length === 0 && <p className="text-sm text-[color:var(--text-muted)] text-center py-8">No activity recorded yet.</p>}
            </div>
          )}

          {/* SECURITY */}
          {tab === "security" && (
            <div className="flex flex-col gap-4">
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <MetaRow label="Two-Factor Auth" value={
                  user.twoFactorEnabled
                    ? <span className="flex items-center gap-1.5 text-success"><ShieldCheck size={14} /> Enabled and configured</span>
                    : <span className="flex items-center gap-1.5 text-danger"><ShieldOff size={14} /> Not enabled</span>
                } />
                <MetaRow label="Last Password Change" value={fmtDate(user.lastPasswordChange)} />
                <MetaRow label="Failed Login Attempts" value={
                  <span className={user.failedLoginAttempts > 3 ? "text-danger font-semibold" : ""}>
                    {user.failedLoginAttempts} attempt{user.failedLoginAttempts !== 1 ? "s" : ""}
                  </span>
                } />
                <MetaRow label="Active Sessions" value={userSessions.length} />
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={() => onResetPassword(user)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[color:var(--border-default)] bg-elevated text-sm font-semibold text-[color:var(--text-secondary)] cursor-pointer hover:bg-[color:var(--bg-overlay)] hover:text-foreground transition-colors">
                  <KeyRound size={14} /> Send Password Reset Email
                </button>
                {userSessions.length > 1 && (
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-danger/30 bg-danger/10 text-sm font-semibold text-danger cursor-pointer hover:bg-danger/20 transition-colors">
                    <LogOut size={14} /> Terminate All Other Sessions
                  </button>
                )}
                <button onClick={() => onSuspend(user)} className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors border ${user.status === "suspended" ? "border-success/30 bg-success/10 text-success hover:bg-success/20" : "border-danger/30 bg-danger/10 text-danger hover:bg-danger/20"}`}>
                  {user.status === "suspended" ? <><ShieldCheck size={14} /> Reactivate Account</> : <><ShieldOff size={14} /> Suspend Account</>}
                </button>
              </div>
            </div>
          )}

        </div>
      </aside>
    </>
  );
}
