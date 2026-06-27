// app/(dashboard)/marketing/page.tsx
"use client";

import { useState, useMemo } from "react";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingTabs from "@/components/marketing/MarketingTabs";
import CampaignsWorkspace from "@/components/marketing/CampaignsWorkspace";
import { HomepageWorkspace, FeaturedContentWorkspace, BannersWorkspace } from "@/components/marketing/PromoWorkspaces";
import { PopupsWorkspace, NewsletterWorkspace } from "@/components/marketing/EngagementWorkspaces";
import AnalyticsWorkspace from "@/components/marketing/AnalyticsWorkspace";
import Toolbar from "@/components/ui/Toolbar";
import {
  MOCK_CAMPAIGNS, MOCK_HOME_SECTIONS, MOCK_FEATURED, MOCK_BANNERS,
  MOCK_POPUPS, MOCK_NEWSLETTER_CAMPAIGNS, MOCK_NEWSLETTER_SUBSCRIBERS, MOCK_ANALYTICS,
} from "@/services/marketing/mock-data";
import type {
  Campaign, HomeSection, FeaturedItem, Banner, Popup,
  MarketingTab, CampaignStatus,
} from "@/services/marketing/types";

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<MarketingTab>("campaigns");

  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [sections, setSections] = useState<HomeSection[]>(MOCK_HOME_SECTIONS);
  const [featured, setFeatured] = useState<FeaturedItem[]>(MOCK_FEATURED);
  const [banners, setBanners] = useState<Banner[]>(MOCK_BANNERS);
  const [popups, setPopups] = useState<Popup[]>(MOCK_POPUPS);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "all">("all");

  // ── Campaign filtering ─────────────────────────────────────

  const filteredCampaigns = useMemo(() => {
    let list = [...campaigns];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.tags.some(t => t.includes(q)));
    }
    if (statusFilter !== "all") list = list.filter(c => c.status === statusFilter);
    return list;
  }, [campaigns, search, statusFilter]);

  // ── Actions ────────────────────────────────────────────────

  const handleDuplicateCampaign = (c: Campaign) => {
    const now = new Date().toISOString();
    const dupe: Campaign = { ...c, id: `cmp-dupe-${Date.now()}`, name: `${c.name} (Copy)`, status: "draft", revenue: 0, conversions: 0, clicks: 0, impressions: 0, createdAt: now, updatedAt: now };
    setCampaigns(prev => [dupe, ...prev]);
  };

  const handleArchiveCampaign = (c: Campaign) => {
    setCampaigns(prev => prev.filter(x => x.id !== c.id));
  };

  const handleToggleCampaignStatus = (c: Campaign) => {
    const next: CampaignStatus = c.status === "active" ? "paused" : "active";
    setCampaigns(prev => prev.map(x => x.id === c.id ? { ...x, status: next, updatedAt: new Date().toISOString() } : x));
  };

  const handleTogglePopup = (id: string) => {
    setPopups(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const handleDeletePopup = (id: string) => {
    setPopups(prev => prev.filter(p => p.id !== id));
  };

  const handleArchiveBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const handleRemoveFeatured = (id: string) => {
    setFeatured(prev => prev.filter(f => f.id !== id));
  };

  // Tab counts
  const tabCounts: Partial<Record<MarketingTab, number>> = {
    campaigns: campaigns.filter(c => c.status === "active").length,
    banners: banners.filter(b => b.status === "active").length,
    popups: popups.filter(p => p.active).length,
    newsletter: MOCK_NEWSLETTER_CAMPAIGNS.filter(n => n.status === "scheduled").length,
  };

  const STATUS_OPTIONS = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "scheduled", label: "Scheduled" },
    { value: "paused", label: "Paused" },
    { value: "draft", label: "Draft" },
    { value: "ended", label: "Ended" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <MarketingHeader
        onCreateCampaign={() => { }}
        onPreview={() => window.open("/", "_blank")}
      />

      <div className="bg-surface border border-[color:var(--border-subtle)] rounded-2xl overflow-hidden">
        {/* Tabs */}
        <div className="px-5 pt-4">
          <MarketingTabs
            active={activeTab}
            onChange={t => { setActiveTab(t); setSearch(""); setStatusFilter("all"); }}
            counts={tabCounts}
          />
        </div>

        {/* Per-tab toolbar (campaigns only) */}
        {activeTab === "campaigns" && (
          <div className="px-5 pt-4">
            <Toolbar>
              <Toolbar.Search
                value={search}
                onChange={setSearch}
                placeholder="Search campaigns by name or tag..."
              />
              <Toolbar.Select
                value={statusFilter}
                onChange={v => setStatusFilter(v as CampaignStatus | "all")}
                options={STATUS_OPTIONS}
              />
              <Toolbar.Spacer />
              <Toolbar.Count n={filteredCampaigns.length} label="campaign" />
            </Toolbar>
          </div>
        )}

        {/* Tab content */}
        <div className="p-5">
          {activeTab === "campaigns" && (
            <CampaignsWorkspace
              campaigns={filteredCampaigns}
              onDuplicate={handleDuplicateCampaign}
              onArchive={handleArchiveCampaign}
              onToggleStatus={handleToggleCampaignStatus}
            />
          )}

          {activeTab === "homepage" && (
            <HomepageWorkspace sections={sections} onChange={setSections} />
          )}

          {activeTab === "featured" && (
            <FeaturedContentWorkspace items={featured} onRemove={handleRemoveFeatured} />
          )}

          {activeTab === "banners" && (
            <BannersWorkspace banners={banners} onArchive={handleArchiveBanner} />
          )}

          {activeTab === "popups" && (
            <PopupsWorkspace
              popups={popups}
              onToggleActive={handleTogglePopup}
              onDelete={handleDeletePopup}
            />
          )}

          {activeTab === "newsletter" && (
            <NewsletterWorkspace
              subscribers={MOCK_NEWSLETTER_SUBSCRIBERS}
              campaigns={MOCK_NEWSLETTER_CAMPAIGNS}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsWorkspace analytics={MOCK_ANALYTICS} />
          )}
        </div>
      </div>
    </div>
  );
}
