// components/users/InviteUserModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown, UserPlus } from "lucide-react";
import type { Role } from "@/services/users/types";
import Button from "@/components/ui/Button";

interface Props {
  open: boolean;
  roles: Role[];
  onClose: () => void;
  onInvite: (email: string, roleIds: string[], message: string) => Promise<void>;
}

export default function InviteUserModal({ open, roles, onClose, onInvite }: Props) {
  const [email, setEmail] = useState("");
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [message, setMessage] = useState("You've been invited to join the Sidez admin team. Click the link below to set up your account.");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (open) { setEmail(""); setSelectedRoleIds([]); setError(""); } }, [open]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!open) return null;

  const toggleRole = (id: string) =>
    setSelectedRoleIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleSend = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email address"); return; }
    if (selectedRoleIds.length === 0) { setError("Select at least one role"); return; }
    setSending(true);
    try { await onInvite(email, selectedRoleIds, message); onClose(); }
    finally { setSending(false); }
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/65 z-[390] backdrop-blur-sm" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(520px,95vw)] max-h-[92vh] bg-surface border border-[#31386d] rounded-[20px] z-[400] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.6)]">

        <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border-subtle)] shrink-0">
          <div>
            <p className="text-[17px] font-bold text-foreground">Invite Team Member</p>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">Send an invitation to join the admin team</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer flex items-center justify-center text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              placeholder="colleague@company.com"
              autoFocus
              className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl text-sm text-foreground font-inherit px-3.5 py-2.5 outline-none focus:border-accent transition-colors placeholder:text-[color:var(--text-muted)]"
            />
            {error && error.includes("email") && <p className="text-[11px] text-danger mt-1">{error}</p>}
          </div>

          {/* Role selection */}
          <div>
            <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-2">Assign Roles *</label>
            <div className="flex flex-col gap-2">
              {roles.map(role => {
                const selected = selectedRoleIds.includes(role.id);
                return (
                  <button
                    key={role.id}
                    onClick={() => { toggleRole(role.id); setError(""); }}
                    className={[
                      "flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-left transition-all",
                      selected ? "border-accent/40 bg-accent/5" : "border-[color:var(--border-subtle)] bg-[color:var(--bg-input)] hover:border-[color:var(--border-default)]",
                    ].join(" ")}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${selected ? "bg-accent border-accent" : "border-[color:var(--border-default)]"}`}>
                      {selected && <div className="w-2 h-2 bg-white rounded-sm" />}
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: role.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{role.name}</p>
                      <p className="text-[11px] text-[color:var(--text-muted)] truncate">{role.description}</p>
                    </div>
                    {role.isSystem && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-accent/10 text-accent uppercase shrink-0">System</span>}
                  </button>
                );
              })}
            </div>
            {error && error.includes("role") && <p className="text-[11px] text-danger mt-1">{error}</p>}
          </div>

          {/* Custom message */}
          <div>
            <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">Invitation Message (optional)</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl text-sm text-foreground font-inherit px-3.5 py-2.5 outline-none focus:border-accent resize-none leading-relaxed placeholder:text-[color:var(--text-muted)]"
            />
            <p className="text-[11px] text-[color:var(--text-muted)] mt-1">Invitation expires in 7 days</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[color:var(--border-subtle)] shrink-0">
          <Button onClick={onClose} variant="secondary" size="md">Cancel</Button>
          <Button onClick={handleSend} variant="primary" size="md" loading={sending} icon={<UserPlus size={14} />}>
            {sending ? "Sending..." : "Send Invitation"}
          </Button>
        </div>
      </div>
    </>
  );
}
