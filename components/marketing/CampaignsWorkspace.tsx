// components/marketing/CampaignsWorkspace.tsx
"use client";

import { useState } from "react";
import { Eye, Pencil, Copy, Archive, Megaphone, TrendingUp, Users, MousePointer, X, Play, Pause, BarChart3, Calendar } from "lucide-react";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";
import type { Campaign, CampaignStatus, CampaignPriority } from "@/services/marketing/types";

interface Props {
  campaigns: Campaign[];
  onDuplicate: (c: Campaign) => void;
  onArchive: (c: Campaign) => void;
  onToggleStatus: (c: Campaign) => void;
}

const STATUS_VARIANT: Record<CampaignStatus, "success" | "warning" | "cyan" | "muted" | "danger"> = {
  active: "success", scheduled: "cyan", paused: "warning", ended: "muted", draft: "warning",
};
const STATUS_LABEL: Record<CampaignStatus, string> = {
  active: "Active", scheduled: "Scheduled", paused: "Paused", ended: "Ended", draft: "Draft",
};
const PRIORITY_CLASSES: Record<CampaignPriority, string> = {
  critical: "bg-danger/10 text-danger",
  high: "bg-[color:var(--accent-magenta)]/10 text-[color:var(--accent-magenta)]",
  medium: "bg-accent/10 text-accent",
  low: "bg-elevated text-[color:var(--text-muted)]",
};
const AUDIENCE_LABEL: Record<string, string> = {
  all: "All Users", logged_in: "Logged In", guests: "Guests",
  vip: "VIP", new_users: "New Users", returning: "Returning",
};

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtNum(n: number) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  return n.toString();
}

// ── Campaign Drawer ──────────────────────────────────────────────

function CampaignDrawer({ campaign, onClose, onToggleStatus }: { campaign: Campaign | null; onClose: () => void; onToggleStatus: (c: Campaign) => void }) {
  const [tab, setTab] = useState<"overview" | "assets" | "audience" | "schedule" | "analytics">("overview");

  if (!campaign) return null;

  const ctr = campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(1) : "0";
  const cvr = campaign.clicks > 0 ? ((campaign.conversions / campaign.clicks) * 100).toFixed(1) : "0";

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[350]" />
      <aside className="fixed top-0 right-0 bottom-0 w-[480px] bg-surface border-l border-[color:var(--border-subtle)] z-[360] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border-subtle)] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Megaphone size={15} className="text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{campaign.name}</p>
              <DataTable.StatusBadge label={STATUS_LABEL[campaign.status]} variant={STATUS_VARIANT[campaign.status]} dot />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => onToggleStatus(campaign)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-colors ${campaign.status === "active" ? "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)] hover:bg-[color:var(--color-warning)]/20" : "bg-success/10 text-success hover:bg-success/20"}`}>
              {campaign.status === "active" ? <><Pause size={11} className="inline mr-1" />Pause</> : <><Play size={11} className="inline mr-1" />Activate</>}
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-elevated transition-colors"><X size={15} /></button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[color:var(--border-subtle)] px-5 shrink-0 overflow-x-auto">
          {(["overview", "assets", "audience", "schedule", "analytics"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-0 bg-transparent cursor-pointer transition-colors border-b-2 -mb-px capitalize ${tab === t ? "text-accent border-accent" : "text-[color:var(--text-muted)] border-transparent hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "overview" && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">{campaign.description}</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Revenue", value: `$${fmtNum(campaign.revenue)}`, color: "text-success", icon: <TrendingUp size={13} /> },
                  { label: "Conversions", value: fmtNum(campaign.conversions), color: "text-accent", icon: <BarChart3 size={13} /> },
                  { label: "Clicks", value: fmtNum(campaign.clicks), color: "text-accent-cyan", icon: <MousePointer size={13} /> },
                  { label: "Impressions", value: fmtNum(campaign.impressions), color: "text-[color:var(--accent-magenta)]", icon: <Eye size={13} /> },
                  { label: "CTR", value: `${ctr}%`, color: "text-[color:var(--color-warning)]", icon: <BarChart3 size={13} /> },
                  { label: "CVR", value: `${cvr}%`, color: "text-success", icon: <TrendingUp size={13} /> },
                ].map(s => (
                  <div key={s.label} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-3.5">
                    <div className={`flex items-center gap-1 mb-1.5 ${s.color}`}>{s.icon}</div>
                    <div className={`text-base font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between"><span className="text-[color:var(--text-muted)]">Priority</span><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${PRIORITY_CLASSES[campaign.priority]}`}>{campaign.priority}</span></div>
                <div className="flex justify-between"><span className="text-[color:var(--text-muted)]">Audience</span><span className="text-foreground">{AUDIENCE_LABEL[campaign.audience]}</span></div>
                <div className="flex justify-between"><span className="text-[color:var(--text-muted)]">Created By</span><span className="text-foreground">{campaign.createdBy}</span></div>
              </div>
              {campaign.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {campaign.tags.map(t => <span key={t} className="px-2 py-0.5 rounded-full bg-elevated border border-[color:var(--border-subtle)] text-[11px] text-[color:var(--text-secondary)]">#{t}</span>)}
                </div>
              )}
            </div>
          )}

          {tab === "assets" && (
            <div className="flex flex-col gap-3">
              <p className="text-[11px] text-[color:var(--text-muted)]">{campaign.assets.length} asset{campaign.assets.length !== 1 ? "s" : ""} attached</p>
              {campaign.assets.length === 0
                ? <div className="py-12 text-center"><p className="text-sm text-[color:var(--text-muted)]">No assets attached yet.</p></div>
                : campaign.assets.map(a => (
                  <div key={a.id} className="flex items-center gap-3 bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-3.5">
                    {a.url ? <img src={a.url} alt={a.name} className="w-12 h-12 rounded-lg object-cover shrink-0" /> : <div className="w-12 h-12 rounded-lg bg-elevated flex items-center justify-center shrink-0"><Megaphone size={16} className="text-[color:var(--text-muted)]" /></div>}
                    <div>
                      <p className="text-sm font-semibold text-foreground">{a.name}</p>
                      <p className="text-[11px] text-[color:var(--text-muted)] capitalize">{a.type}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          )}

          {tab === "audience" && (
            <div className="flex flex-col gap-4">
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--text-muted)] mb-3">Target Audience</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center"><Users size={18} className="text-accent" /></div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{AUDIENCE_LABEL[campaign.audience]}</p>
                    <p className="text-[11px] text-[color:var(--text-muted)]">Campaign target group</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "schedule" && (
            <div className="flex flex-col gap-4">
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4 flex flex-col gap-3">
                {[["Start Date", fmtDate(campaign.startsAt)], ["End Date", fmtDate(campaign.endsAt)], ["Created", fmtDate(campaign.createdAt)], ["Last Updated", fmtDate(campaign.updatedAt)]].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm"><span className="text-[color:var(--text-muted)]">{l}</span><span className="text-foreground">{v}</span></div>
                ))}
              </div>
            </div>
          )}

          {tab === "analytics" && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Revenue", value: `$${campaign.revenue.toLocaleString()}`, color: "text-success" },
                  { label: "Conversions", value: campaign.conversions.toLocaleString(), color: "text-accent" },
                  { label: "Total Clicks", value: campaign.clicks.toLocaleString(), color: "text-accent-cyan" },
                  { label: "Impressions", value: campaign.impressions.toLocaleString(), color: "text-[color:var(--accent-magenta)]" },
                  { label: "Click-Through Rate", value: `${ctr}%`, color: "text-[color:var(--color-warning)]" },
                  { label: "Conversion Rate", value: `${cvr}%`, color: "text-success" },
                ].map(s => (
                  <div key={s.label} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-3.5">
                    <div className={`text-base font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// ── Campaigns Table ──────────────────────────────────────────────

export default function CampaignsWorkspace({ campaigns, onDuplicate, onArchive, onToggleStatus }: Props) {
  const { hoveredId, setHoveredId } = useHoveredRow();
  const [drawer, setDrawer] = useState<Campaign | null>(null);

  return (
    <>
      <DataTable
        isEmpty={campaigns.length === 0}
        emptyState={<DataTable.EmptyState icon={<Megaphone size={22} className="text-accent" />} title="No campaigns yet" message="Create your first marketing campaign." />}
      >
        <DataTable.Header>
          <DataTable.Col>Campaign</DataTable.Col>
          <DataTable.Col align="center">Priority</DataTable.Col>
          <DataTable.Col>Audience</DataTable.Col>
          <DataTable.Col>Status</DataTable.Col>
          <DataTable.Col>Dates</DataTable.Col>
          <DataTable.Col align="right">Revenue</DataTable.Col>
          <DataTable.Col align="right">Conv.</DataTable.Col>
          <DataTable.ActionsCol />
        </DataTable.Header>
        <DataTable.Body>
          {campaigns.map(c => {
            const isHovered = hoveredId === c.id;
            return (
              <DataTable.Row key={c.id} onClick={() => setDrawer(c)} isHovered={isHovered} onHoverChange={h => setHoveredId(h ? c.id : null)}>
                <DataTable.Cell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0"><Megaphone size={13} className="text-accent" /></div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate max-w-[180px]">{c.name}</p>
                      {c.tags.length > 0 && <p className="text-[10px] text-[color:var(--text-muted)]">#{c.tags[0]}{c.tags.length > 1 ? ` +${c.tags.length - 1}` : ""}</p>}
                    </div>
                  </div>
                </DataTable.Cell>
                <DataTable.Cell align="center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${PRIORITY_CLASSES[c.priority]}`}>{c.priority}</span>
                </DataTable.Cell>
                <DataTable.Cell className="text-xs text-[color:var(--text-secondary)]">{AUDIENCE_LABEL[c.audience]}</DataTable.Cell>
                <DataTable.Cell><DataTable.StatusBadge label={STATUS_LABEL[c.status]} variant={STATUS_VARIANT[c.status]} /></DataTable.Cell>
                <DataTable.Cell>
                  <p className="text-[11px] text-[color:var(--text-muted)] whitespace-nowrap">{fmtDate(c.startsAt)}</p>
                  <p className="text-[11px] text-[color:var(--text-muted)] whitespace-nowrap">{fmtDate(c.endsAt)}</p>
                </DataTable.Cell>
                <DataTable.Cell align="right" className={`text-sm font-bold ${c.revenue > 0 ? "text-success" : "text-[color:var(--text-muted)]"}`}>{c.revenue > 0 ? `$${fmtNum(c.revenue)}` : "—"}</DataTable.Cell>
                <DataTable.Cell align="right" className="text-sm font-semibold text-foreground tabular-nums">{c.conversions > 0 ? fmtNum(c.conversions) : "—"}</DataTable.Cell>
                <DataTable.ActionsCell visible={isHovered}>
                  <DataTable.ActionBtn onClick={() => setDrawer(c)} icon={<Eye size={13} />} title="View" />
                  <DataTable.ActionBtn onClick={() => onDuplicate(c)} icon={<Copy size={13} />} title="Duplicate" />
                  <DataTable.ActionBtn onClick={() => onToggleStatus(c)} icon={c.status === "active" ? <Pause size={13} /> : <Play size={13} />} title={c.status === "active" ? "Pause" : "Activate"} />
                  <DataTable.ActionBtn onClick={() => onArchive(c)} icon={<Archive size={13} />} title="Archive" danger />
                </DataTable.ActionsCell>
              </DataTable.Row>
            );
          })}
        </DataTable.Body>
      </DataTable>

      {drawer && <CampaignDrawer campaign={drawer} onClose={() => setDrawer(null)} onToggleStatus={c => { onToggleStatus(c); setDrawer(prev => prev ? { ...prev, status: prev.status === "active" ? "paused" : "active" } : prev); }} />}
    </>
  );
}
