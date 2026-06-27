// components/account/ProfileAndSecurity.tsx
"use client";

import { useState } from "react";
import {
  Camera, ShieldCheck, ShieldOff, Eye, EyeOff,
  RotateCcw, AlertTriangle, CheckCircle2, Key,
} from "lucide-react";
import Button from "@/components/ui/Button";
import UIInput from "@/components/ui/Input";
import UITextarea from "@/components/ui/TextArea";
import UISelect from "@/components/ui/Select";
import { SectionCard, FieldRow } from "./AccountShell";
import type { UserProfile, UserSecurity } from "@/services/account/types";

// ── Shared toggle (account-specific visual, not in global ui/) ────

function Toggle({ checked, onChange, label, description }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {description && <p className="text-xs text-[color:var(--text-muted)] mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full border-0 cursor-pointer relative shrink-0 transition-colors duration-200 ${checked ? "bg-accent" : "bg-[color:var(--border-subtle)]"}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 shadow-sm ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "GMT / London" },
  { value: "Europe/Berlin", label: "Central European (CET)" },
  { value: "Africa/Accra", label: "Ghana / Accra (GMT)" },
  { value: "Asia/Tokyo", label: "Japan Standard (JST)" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
];

// ── Profile ───────────────────────────────────────────────────────

export function ProfileWorkspace({ profile, onChange, onSave, saving }: {
  profile: UserProfile;
  onChange: (p: Partial<UserProfile>) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Avatar" description="Your profile photo visible to other administrators.">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[color:var(--border-subtle)] bg-elevated flex items-center justify-center">
              {profile.avatar
                ? <img src={profile.avatar} alt={profile.firstName} className="w-full h-full object-cover" />
                : <span className="text-2xl font-bold text-[color:var(--text-secondary)]">{initials}</span>
              }
            </div>
            <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-accent flex items-center justify-center border-2 border-surface cursor-pointer">
              <Camera size={12} className="text-white" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" size="md" icon={<Camera size={13} />} onClick={() => { }}>Upload Photo</Button>
            <p className="text-[11px] text-[color:var(--text-muted)]">PNG, JPG · max 2 MB · 400×400 recommended</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Personal Information">
        <div className="grid grid-cols-2 gap-4">
          <UIInput
            label="First Name"
            value={profile.firstName}
            onChange={e => onChange({ firstName: e.target.value })}
            placeholder="John"
          />
          <UIInput
            label="Last Name"
            value={profile.lastName}
            onChange={e => onChange({ lastName: e.target.value })}
            placeholder="Carter"
          />
        </div>
        <FieldRow label="Email" description="Used for notifications and login.">
          <UIInput value={profile.email} onChange={e => onChange({ email: e.target.value })} type="email" placeholder="john@sidez.io" />
        </FieldRow>
        <FieldRow label="Phone">
          <UIInput value={profile.phone} onChange={e => onChange({ phone: e.target.value })} placeholder="+1 555 000 0000" />
        </FieldRow>
        <FieldRow label="Bio" description="A short description visible on your profile.">
          <UITextarea value={profile.bio} onChange={e => onChange({ bio: e.target.value })} rows={3} placeholder="Tell your team about yourself..." />
        </FieldRow>
      </SectionCard>

      <SectionCard title="Role & Location">
        <FieldRow label="Job Title">
          <UIInput value={profile.jobTitle} onChange={e => onChange({ jobTitle: e.target.value })} placeholder="Platform Owner" />
        </FieldRow>
        <FieldRow label="Department">
          <UIInput value={profile.department} onChange={e => onChange({ department: e.target.value })} placeholder="Engineering" />
        </FieldRow>
        <FieldRow label="Timezone">
          <UISelect value={profile.timezone} onChange={v => onChange({ timezone: v })}>
            {TIMEZONES.map(o => <option key={o.value} value={o.value} className="bg-surface">{o.label}</option>)}
          </UISelect>
        </FieldRow>
        <FieldRow label="Language">
          <UISelect value={profile.language} onChange={v => onChange({ language: v })}>
            {LANGUAGES.map(o => <option key={o.value} value={o.value} className="bg-surface">{o.label}</option>)}
          </UISelect>
        </FieldRow>
      </SectionCard>

      <div className="flex justify-end">
        <Button variant="primary" size="md" onClick={onSave} loading={saving}>Save Profile</Button>
      </div>
    </div>
  );
}

// ── Security ──────────────────────────────────────────────────────

function PasswordField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <FieldRow label={label}>
      <div className="relative">
        <UIInput
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? "••••••••••••"}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] cursor-pointer hover:text-foreground transition-colors bg-transparent border-0"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </FieldRow>
  );
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function SecurityWorkspace({ security, onChange }: {
  security: UserSecurity;
  onChange: (p: Partial<UserSecurity>) => void;
}) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [changingPw, setChangingPw] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState("");

  const handleChangePassword = async () => {
    if (!currentPw) { setPwError("Enter your current password."); return; }
    if (newPw.length < 8) { setPwError("New password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { setPwError("Passwords do not match."); return; }
    setPwError("");
    setChangingPw(true);
    await new Promise(r => setTimeout(r, 800));
    setChangingPw(false);
    setPwSuccess(true);
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => setPwSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Password */}
      <SectionCard title="Change Password" description="Use a strong password with at least 8 characters.">
        <div className="bg-[color:var(--bg-input)]/50 border border-[color:var(--border-subtle)] rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-[color:var(--text-muted)]">
          <Key size={12} />
          Last changed {fmtDate(security.passwordLastChanged)}
        </div>
        <PasswordField label="Current Password" value={currentPw} onChange={setCurrentPw} />
        <PasswordField label="New Password" value={newPw} onChange={setNewPw} placeholder="Min. 8 characters" />
        <PasswordField label="Confirm Password" value={confirmPw} onChange={setConfirmPw} />
        {pwError && <p className="text-sm text-danger">{pwError}</p>}
        {pwSuccess && <p className="flex items-center gap-2 text-success text-sm"><CheckCircle2 size={14} /> Password updated successfully.</p>}
        <div className="flex justify-start">
          <Button variant="primary" size="md" onClick={handleChangePassword} loading={changingPw}>Update Password</Button>
        </div>
      </SectionCard>

      {/* 2FA */}
      <SectionCard
        title="Two-Factor Authentication"
        description="Add a second layer of security to your account."
        action={
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${security.twoFactorEnabled ? "bg-success/10 text-success" : "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]"}`}>
            {security.twoFactorEnabled ? <ShieldCheck size={11} /> : <ShieldOff size={11} />}
            {security.twoFactorEnabled ? "Enabled" : "Disabled"}
          </span>
        }
      >
        <Toggle
          checked={security.twoFactorEnabled}
          onChange={v => onChange({ twoFactorEnabled: v })}
          label="Require 2FA on login"
          description="You'll be asked for a 6-digit code from your authenticator app."
        />
        {security.twoFactorEnabled && (
          <div className="flex flex-col gap-3 pt-2 border-t border-[color:var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Recovery Codes</p>
                <p className="text-xs text-[color:var(--text-muted)] mt-0.5">Use these if you lose access to your authenticator app.</p>
              </div>
              <Button variant="secondary" size="md" icon={<RotateCcw size={13} />} onClick={() => { }}>Regenerate</Button>
            </div>
            {security.recoveryCodesGenerated && (
              <div className="px-3 py-2 bg-elevated rounded-lg border border-[color:var(--border-subtle)]">
                <p className="text-[11px] text-success flex items-center gap-1">
                  <CheckCircle2 size={11} /> Recovery codes generated and saved.
                </p>
              </div>
            )}
          </div>
        )}
      </SectionCard>

      {/* Login alerts */}
      <SectionCard title="Login Alerts" description="Receive notifications when your account is accessed from a new device or location.">
        <Toggle
          checked={security.loginAlertsEnabled}
          onChange={v => onChange({ loginAlertsEnabled: v })}
          label="Email me on new logins"
          description="Sends an alert when a new session is created."
        />
      </SectionCard>

      {security.failedLoginAttempts > 0 && (
        <div className="bg-[color:var(--color-warning)]/10 border border-[color:var(--color-warning)]/30 rounded-xl px-4 py-3.5 flex items-start gap-3">
          <AlertTriangle size={16} className="text-[color:var(--color-warning)] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">{security.failedLoginAttempts} failed login attempt{security.failedLoginAttempts > 1 ? "s" : ""}</p>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">
              {security.lastFailedLogin ? `Last attempt ${fmtDate(security.lastFailedLogin)}. ` : ""}If this wasn't you, change your password immediately.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Re-export Toggle so EngagementWorkspaces can still import it from here
export { Toggle };
