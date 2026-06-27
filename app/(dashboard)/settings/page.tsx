// app/(dashboard)/settings/page.tsx
"use client";

import { useState, useCallback } from "react";
import { SettingsHeader, SettingsTabs } from "@/components/settings/SettingsShell";
import {
  GeneralSettingsPanel, BrandingSettingsPanel, LocalizationSettingsPanel,
  PaymentsSettingsPanel, StorageSettingsPanel,
} from "@/components/settings/PlatformSettings";
import {
  EmailSettingsPanel, SecuritySettingsPanel, SEOSettingsPanel,
  IntegrationsSettingsPanel, NotificationsSettingsPanel,
  MaintenanceSettingsPanel, AuditLogPanel,
} from "@/components/settings/ServiceSettings";
import {
  MOCK_GENERAL, MOCK_BRANDING, MOCK_LOCALIZATION, MOCK_PAYMENTS,
  MOCK_STORAGE, MOCK_EMAIL, MOCK_SECURITY, MOCK_SEO,
  MOCK_INTEGRATIONS, MOCK_NOTIFICATIONS, MOCK_MAINTENANCE, MOCK_AUDIT,
} from "@/services/settings/mock-data";
import type {
  SettingsTab, GeneralSettings, BrandingSettings, LocalizationSettings,
  PaymentsSettings, StorageSettings, EmailSettings, SecuritySettings,
  SEOSettings, Integration, NotificationChannel, MaintenanceSettings,
} from "@/services/settings/types";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // ── Per-tab state ────────────────────────────────────────────

  const [general, setGeneral] = useState<GeneralSettings>(MOCK_GENERAL);
  const [branding, setBranding] = useState<BrandingSettings>(MOCK_BRANDING);
  const [localization, setLocalization] = useState<LocalizationSettings>(MOCK_LOCALIZATION);
  const [payments, setPayments] = useState<PaymentsSettings>(MOCK_PAYMENTS);
  const [storage, setStorage] = useState<StorageSettings>(MOCK_STORAGE);
  const [email, setEmail] = useState<EmailSettings>(MOCK_EMAIL);
  const [security, setSecurity] = useState<SecuritySettings>(MOCK_SECURITY);
  const [seo, setSeo] = useState<SEOSettings>(MOCK_SEO);
  const [integrations, setIntegrations] = useState<Integration[]>(MOCK_INTEGRATIONS);
  const [notifications, setNotifications] = useState<NotificationChannel[]>(MOCK_NOTIFICATIONS);
  const [maintenance, setMaintenance] = useState<MaintenanceSettings>(MOCK_MAINTENANCE);

  // Wrap setters to mark dirty
  const dirty = useCallback(<T,>(setter: React.Dispatch<React.SetStateAction<T>>) => (v: T | ((prev: T) => T)) => {
    setter(v as T);
    setIsDirty(true);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setIsDirty(false);
  };

  const handleRestoreDefaults = () => {
    if (!window.confirm("Restore all settings on this tab to their defaults? This cannot be undone.")) return;
    setIsDirty(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <SettingsHeader
        isDirty={isDirty}
        onSave={handleSave}
        onRestoreDefaults={handleRestoreDefaults}
        saving={saving}
      />

      <div className="bg-surface border border-[color:var(--border-subtle)] rounded-2xl overflow-hidden">
        <div className="px-5 pt-4">
          <SettingsTabs active={activeTab} onChange={t => setActiveTab(t)} />
        </div>

        <div className="p-5">
          {activeTab === "general" && (
            <GeneralSettingsPanel
              settings={general}
              onChange={p => { setGeneral(prev => ({ ...prev, ...p })); setIsDirty(true); }}
            />
          )}
          {activeTab === "branding" && (
            <BrandingSettingsPanel
              settings={branding}
              onChange={p => { setBranding(prev => ({ ...prev, ...p })); setIsDirty(true); }}
            />
          )}
          {activeTab === "localization" && (
            <LocalizationSettingsPanel
              settings={localization}
              onChange={p => { setLocalization(prev => ({ ...prev, ...p })); setIsDirty(true); }}
            />
          )}
          {activeTab === "payments" && (
            <PaymentsSettingsPanel
              settings={payments}
              onChange={p => { setPayments(prev => ({ ...prev, ...p })); setIsDirty(true); }}
            />
          )}
          {activeTab === "storage" && (
            <StorageSettingsPanel
              settings={storage}
              onChange={p => { setStorage(prev => ({ ...prev, ...p })); setIsDirty(true); }}
            />
          )}
          {activeTab === "email" && (
            <EmailSettingsPanel
              settings={email}
              onChange={p => { setEmail(prev => ({ ...prev, ...p })); setIsDirty(true); }}
            />
          )}
          {activeTab === "security" && (
            <SecuritySettingsPanel
              settings={security}
              onChange={p => { setSecurity(prev => ({ ...prev, ...p })); setIsDirty(true); }}
            />
          )}
          {activeTab === "seo" && (
            <SEOSettingsPanel
              settings={seo}
              onChange={p => { setSeo(prev => ({ ...prev, ...p })); setIsDirty(true); }}
            />
          )}
          {activeTab === "integrations" && (
            <IntegrationsSettingsPanel
              integrations={integrations}
              onChange={v => { setIntegrations(v); setIsDirty(true); }}
            />
          )}
          {activeTab === "notifications" && (
            <NotificationsSettingsPanel
              channels={notifications}
              onChange={v => { setNotifications(v); setIsDirty(true); }}
            />
          )}
          {activeTab === "maintenance" && (
            <MaintenanceSettingsPanel
              settings={maintenance}
              onChange={p => { setMaintenance(prev => ({ ...prev, ...p })); setIsDirty(true); }}
            />
          )}
          {activeTab === "audit" && (
            <AuditLogPanel entries={MOCK_AUDIT} />
          )}
        </div>
      </div>
    </div>
  );
}
