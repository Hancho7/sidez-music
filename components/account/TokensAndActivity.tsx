// components/account/TokensAndActivity.tsx
// ApiTokens + Activity
"use client";

import { useState } from "react";
import {
  Plus, Trash2, Key, Copy, Check, Clock, Shield,
  Activity, CheckCircle2, XCircle, MinusCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import UIInput from "@/components/ui/Input";
import UISelect from "@/components/ui/Select";
import { SectionCard } from "./AccountShell";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";
import type { ApiToken, UserActivity, ActivityResult, TokenPermission } from "@/services/account/types";
import { ModalClose } from "../ui/ModalPrimitives";

// ── API Tokens ────────────────────────────────────────────────────

function fmtDate(d: string | null) {
  if (!d) return "Never";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtRelative(d: string | null) {
  if (!d) return "Never used";
  const diff = Date.now() - new Date(d).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "Just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
function daysUntil(d: string | null) {
  if (!d) return null;
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  if (diff < 0) return "Expired";
  if (diff === 0) return "Expires today";
  if (diff <= 7) return `${diff}d left`;
  return null;
}

const PERMISSION_COLORS: Record<TokenPermission, string> = {
  read: "bg-accent-cyan/10 text-accent-cyan",
  write: "bg-accent/10 text-accent",
  admin: "bg-danger/10 text-danger",
};

const PERMISSION_DESCS: Record<TokenPermission, string> = {
  read: "Read-only access to all endpoints",
  write: "Create and update resources",
  admin: "Full administrative access",
};

const EXPIRY_OPTIONS = [
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "180", label: "180 days" },
  { value: "365", label: "1 year" },
  { value: "never", label: "No expiration" },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(value).catch(() => { }); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="w-7 h-7 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors"
    >
      {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
    </button>
  );
}

function CreateTokenModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (name: string, permissions: TokenPermission[], expiresInDays: number | null) => void;
}) {
  const [name, setName] = useState("");
  const [perms, setPerms] = useState<TokenPermission[]>(["read"]);
  const [expiry, setExpiry] = useState("365");
  const [creating, setCreating] = useState(false);

  const togglePerm = (p: TokenPermission) =>
    setPerms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    await new Promise(r => setTimeout(r, 600));
    onCreate(name, perms, expiry === "never" ? null : Number(expiry));
    onClose();
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/65 z-[390] backdrop-blur-sm" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(480px,95vw)] bg-surface border border-[#31386d] rounded-[20px] z-[400] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.6)]">

        <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border-subtle)]">
          <div>
            <p className="text-[16px] font-bold text-foreground">Create API Token</p>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">The token will only be shown once after creation</p>
          </div>
          <ModalClose onClose={onClose} />
        </div>

        <div className="p-6 flex flex-col gap-5">
          <UIInput
            label="Token Name *"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. CI/CD Pipeline"
            autoFocus
          />

          <div>
            <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-2">Permissions</label>
            <div className="flex flex-col gap-2">
              {(["read", "write", "admin"] as TokenPermission[]).map(p => (
                <label key={p} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={perms.includes(p)}
                    onChange={() => togglePerm(p)}
                    className="w-4 h-4 accent-accent cursor-pointer"
                  />
                  <div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize mr-2 ${PERMISSION_COLORS[p]}`}>{p}</span>
                    <span className="text-xs text-[color:var(--text-muted)]">{PERMISSION_DESCS[p]}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <UISelect label="Expiration" value={expiry} onChange={setExpiry}>
            {EXPIRY_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-surface">{o.label}</option>)}
          </UISelect>
        </div>

        <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-[color:var(--border-subtle)]">
          <Button variant="secondary" size="md" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" onClick={handleCreate} loading={creating} disabled={!name.trim() || perms.length === 0}>
            Generate Token
          </Button>
        </div>
      </div>
    </>
  );
}

export function ApiTokensWorkspace({ tokens, onRevoke, onCreate }: {
  tokens: ApiToken[];
  onRevoke: (id: string) => void;
  onCreate: (name: string, permissions: TokenPermission[], expiresInDays: number | null) => void;
}) {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-5">
        <SectionCard
          title="Personal Access Tokens"
          description="Tokens for programmatic access to the API. Keep them secret."
          action={<Button variant="primary" size="md" icon={<Plus size={13} />} onClick={() => setShowCreate(true)}>Create Token</Button>}
        >
          {tokens.length === 0 ? (
            <div className="py-8 text-center">
              <Key size={24} className="mx-auto mb-2 text-[color:var(--text-muted)]" />
              <p className="text-sm text-[color:var(--text-muted)]">No tokens yet. Create one to get started.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {tokens.map(token => {
                const expWarning = daysUntil(token.expiresAt);
                return (
                  <div key={token.id} className="flex items-center gap-4 px-4 py-3.5 bg-surface border border-[color:var(--border-subtle)] rounded-xl">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Key size={14} className="text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{token.name}</p>
                        <div className="flex gap-1">
                          {token.permissions.map(p => (
                            <span key={p} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full capitalize ${PERMISSION_COLORS[p]}`}>{p}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-[11px] text-[color:var(--text-muted)]">
                        <span className="flex items-center gap-1"><Clock size={9} /> Used {fmtRelative(token.lastUsedAt)}</span>
                        <span>Created {fmtDate(token.createdAt)}</span>
                        {token.expiresAt
                          ? <span className={expWarning ? "text-danger font-semibold" : ""}>Expires {fmtDate(token.expiresAt)}{expWarning ? ` · ${expWarning}` : ""}</span>
                          : <span>No expiry</span>
                        }
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <CopyButton value={token.token} />
                      <button
                        onClick={() => { if (window.confirm(`Revoke "${token.name}"? This cannot be undone.`)) onRevoke(token.id); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-danger/10 hover:text-danger transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        <div className="bg-[color:var(--color-warning)]/5 border border-[color:var(--color-warning)]/20 rounded-xl px-4 py-3 flex items-start gap-3">
          <Shield size={14} className="text-[color:var(--color-warning)] shrink-0 mt-0.5" />
          <p className="text-xs text-[color:var(--text-muted)] leading-relaxed">
            Treat your API tokens like passwords. Never share them publicly or commit them to version control.
          </p>
        </div>
      </div>

      {showCreate && <CreateTokenModal onClose={() => setShowCreate(false)} onCreate={onCreate} />}
    </>
  );
}

// ── Activity ──────────────────────────────────────────────────────

const RESULT_ICONS: Record<ActivityResult, React.ReactNode> = {
  success: <CheckCircle2 size={14} className="text-success" />,
  failure: <XCircle size={14} className="text-danger" />,
  blocked: <MinusCircle size={14} className="text-[color:var(--color-warning)]" />,
};

const RESULT_CLASSES: Record<ActivityResult, string> = {
  success: "bg-success/10 text-success",
  failure: "bg-danger/10 text-danger",
  blocked: "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]",
};

function fmtActivityDate(d: string) {
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function ActivityWorkspace({ activity }: { activity: UserActivity[] }) {
  const { hoveredId, setHoveredId } = useHoveredRow();
  const [search, setSearch] = useState("");

  const filtered = search
    ? activity.filter(a =>
      a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.module.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
    )
    : activity;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <UIInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search activity..."
          className="max-w-xs pl-9"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] pointer-events-none">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </span>
      </div>

      <DataTable
        isEmpty={filtered.length === 0}
        emptyState={<DataTable.EmptyState icon={<Activity size={22} className="text-accent" />} title="No activity" message="Your actions will appear here." />}
      >
        <DataTable.Header>
          <DataTable.Col>Timestamp</DataTable.Col>
          <DataTable.Col>Action</DataTable.Col>
          <DataTable.Col>Module</DataTable.Col>
          <DataTable.Col>Description</DataTable.Col>
          <DataTable.Col>IP</DataTable.Col>
          <DataTable.Col align="center">Result</DataTable.Col>
        </DataTable.Header>
        <DataTable.Body>
          {filtered.map(entry => {
            const isHovered = hoveredId === entry.id;
            return (
              <DataTable.Row key={entry.id} isHovered={isHovered} onHoverChange={h => setHoveredId(h ? entry.id : null)}>
                <DataTable.Cell className="text-xs text-[color:var(--text-muted)] whitespace-nowrap">{fmtActivityDate(entry.createdAt)}</DataTable.Cell>
                <DataTable.Cell className="font-mono text-xs text-accent">{entry.action}</DataTable.Cell>
                <DataTable.Cell><span className="text-[10px] font-bold bg-elevated px-2 py-0.5 rounded text-[color:var(--text-muted)] uppercase">{entry.module}</span></DataTable.Cell>
                <DataTable.Cell className="text-xs text-[color:var(--text-secondary)] truncate max-w-[220px]">{entry.description}</DataTable.Cell>
                <DataTable.Cell className="font-mono text-[11px] text-[color:var(--text-muted)]">{entry.ipAddress}</DataTable.Cell>
                <DataTable.Cell align="center">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${RESULT_CLASSES[entry.result]}`}>
                    {RESULT_ICONS[entry.result]} {entry.result}
                  </span>
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </DataTable.Body>
      </DataTable>
    </div>
  );
}
