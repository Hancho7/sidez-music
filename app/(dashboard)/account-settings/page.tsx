// app/(dashboard)/account-settings/page.tsx
"use client";

import { useState } from "react";
import { AccountHeader, AccountTabs } from "@/components/account/AccountShell";
import { ProfileWorkspace, SecurityWorkspace } from "@/components/account/ProfileAndSecurity";
import { SessionsWorkspace, PreferencesWorkspace, NotificationsWorkspace } from "@/components/account/EngagementWorkspaces";
import { ApiTokensWorkspace, ActivityWorkspace } from "@/components/account/TokensAndActivity";
import {
  MOCK_PROFILE, MOCK_SECURITY, MOCK_SESSIONS,
  MOCK_PREFERENCES, MOCK_NOTIFICATIONS, MOCK_TOKENS, MOCK_ACTIVITY,
} from "@/services/account/mock-data";
import type {
  AccountTab, UserProfile, UserSecurity, UserSession,
  UserPreferences, NotificationPreferences, ApiToken, TokenPermission,
} from "@/services/account/types";

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState<AccountTab>("profile");

  // ── State per tab ────────────────────────────────────────────

  const [profile, setProfile] = useState<UserProfile>(MOCK_PROFILE);
  const [security, setSecurity] = useState<UserSecurity>(MOCK_SECURITY);
  const [sessions, setSessions] = useState<UserSession[]>(MOCK_SESSIONS);
  const [preferences, setPreferences] = useState<UserPreferences>(MOCK_PREFERENCES);
  const [notifications, setNotifications] = useState<NotificationPreferences>(MOCK_NOTIFICATIONS);
  const [tokens, setTokens] = useState<ApiToken[]>(MOCK_TOKENS);
  const [profileSaving, setProfileSaving] = useState(false);
  const [prefSaving, setPrefSaving] = useState(false);
  const [notifSaving, setNotifSaving] = useState(false);

  // ── Handlers ─────────────────────────────────────────────────

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setProfileSaving(false);
  };

  const handleSavePreferences = async () => {
    setPrefSaving(true);
    await new Promise(r => setTimeout(r, 500));
    setPrefSaving(false);
  };

  const handleSaveNotifications = async () => {
    setNotifSaving(true);
    await new Promise(r => setTimeout(r, 500));
    setNotifSaving(false);
  };

  const handleTerminateSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const handleTerminateAllSessions = () => {
    if (!window.confirm("Sign out of all other devices?")) return;
    setSessions(prev => prev.filter(s => s.isCurrent));
  };

  const handleRevokeToken = (id: string) => {
    setTokens(prev => prev.filter(t => t.id !== id));
  };

  const handleCreateToken = (name: string, permissions: TokenPermission[], expiresInDays: number | null) => {
    const now = new Date().toISOString();
    const newToken: ApiToken = {
      id: `tok-${Date.now()}`,
      name,
      permissions,
      token: `sk_${Array.from({ length: 32 }, () => Math.floor(Math.random() * 36).toString(36)).join("")}`,
      createdAt: now,
      lastUsedAt: null,
      expiresAt: expiresInDays ? new Date(Date.now() + expiresInDays * 86400000).toISOString() : null,
    };
    setTokens(prev => [newToken, ...prev]);
  };

  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className="flex flex-col gap-6">
      <AccountHeader name={fullName} email={profile.email} avatar={profile.avatar} />

      <div className="bg-surface border border-[color:var(--border-subtle)] rounded-2xl overflow-hidden">
        <div className="px-5 pt-4">
          <AccountTabs active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="p-5">
          {activeTab === "profile" && (
            <ProfileWorkspace
              profile={profile}
              onChange={p => setProfile(prev => ({ ...prev, ...p }))}
              onSave={handleSaveProfile}
              saving={profileSaving}
            />
          )}

          {activeTab === "security" && (
            <SecurityWorkspace
              security={security}
              onChange={p => setSecurity(prev => ({ ...prev, ...p }))}
            />
          )}

          {activeTab === "sessions" && (
            <SessionsWorkspace
              sessions={sessions}
              onTerminate={handleTerminateSession}
              onTerminateAll={handleTerminateAllSessions}
            />
          )}

          {activeTab === "preferences" && (
            <PreferencesWorkspace
              prefs={preferences}
              onChange={p => setPreferences(prev => ({ ...prev, ...p }))}
              onSave={handleSavePreferences}
              saving={prefSaving}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationsWorkspace
              prefs={notifications}
              onChange={p => setNotifications(prev => ({ ...prev, ...p }))}
              onSave={handleSaveNotifications}
              saving={notifSaving}
            />
          )}

          {activeTab === "tokens" && (
            <ApiTokensWorkspace
              tokens={tokens}
              onRevoke={handleRevokeToken}
              onCreate={handleCreateToken}
            />
          )}

          {activeTab === "activity" && (
            <ActivityWorkspace activity={MOCK_ACTIVITY} />
          )}
        </div>
      </div>
    </div>
  );
}
