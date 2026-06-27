// components/marketing/EngagementWorkspaces.tsx
// PopupsWorkspace + NewsletterWorkspace
"use client";

import { useState } from "react";
import {
  MessageSquare, Mail, Plus, Eye, EyeOff, Pencil, Trash2,
  Users, TrendingUp, MousePointer, Send, Clock, CheckCircle2, FileText,
} from "lucide-react";
import type { Popup, PopupType, NewsletterCampaign, NewsletterSubscriber, NewsletterStatus } from "@/services/marketing/types";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";

// ── Popups Workspace ─────────────────────────────────────────────

const POPUP_TYPE_COLORS: Record<PopupType, string> = {
  newsletter: "bg-accent/10 text-accent",
  announcement: "bg-accent-cyan/10 text-accent-cyan",
  sale: "bg-success/10 text-success",
  countdown: "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]",
  maintenance: "bg-danger/10 text-danger",
};

const POPUP_TYPE_LABELS: Record<PopupType, string> = {
  newsletter: "Newsletter", announcement: "Announcement",
  sale: "Sale", countdown: "Countdown", maintenance: "Maintenance",
};

function fmtCvr(views: number, conversions: number) {
  if (views === 0) return "—";
  return `${((conversions / views) * 100).toFixed(1)}%`;
}

export function PopupsWorkspace({ popups, onToggleActive, onDelete }: {
  popups: Popup[];
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[color:var(--text-muted)]">{popups.filter(p => p.active).length} active · {popups.length} total</p>
        <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent/10 text-accent text-xs font-semibold border border-accent/30 cursor-pointer hover:bg-accent/20 transition-colors">
          <Plus size={13} /> Create Popup
        </button>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {popups.map(popup => (
          <div key={popup.id} className={`bg-surface border rounded-2xl overflow-hidden flex flex-col transition-all ${popup.active ? "border-[color:var(--border-subtle)]" : "border-[color:var(--border-subtle)] opacity-60"}`}>
            {/* Type stripe */}
            <div className={`h-1 w-full ${popup.active ? "bg-gradient-to-r from-accent to-[color:var(--accent-magenta)]" : "bg-elevated"}`} />
            <div className="p-4 flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${POPUP_TYPE_COLORS[popup.type]}`}>
                  {POPUP_TYPE_LABELS[popup.type]}
                </span>
                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                  <button onClick={() => onToggleActive(popup.id)} className={`w-7 h-7 rounded-lg flex items-center justify-center border-0 cursor-pointer transition-colors ${popup.active ? "bg-success/10 text-success hover:bg-success/20" : "bg-elevated text-[color:var(--text-muted)] hover:bg-[color:var(--bg-overlay)]"}`}>
                    {popup.active ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center border-0 bg-elevated text-[color:var(--text-muted)] cursor-pointer hover:text-foreground transition-colors"><Pencil size={12} /></button>
                  <button onClick={() => onDelete(popup.id)} className="w-7 h-7 rounded-lg flex items-center justify-center border-0 bg-transparent cursor-pointer text-[color:var(--text-muted)] hover:bg-danger/10 hover:text-danger transition-colors"><Trash2 size={12} /></button>
                </div>
              </div>

              {/* Content */}
              <div>
                <p className="text-sm font-bold text-foreground">{popup.title}</p>
                <p className="text-[11px] text-[color:var(--text-muted)] mt-1 line-clamp-2">{popup.body}</p>
              </div>

              {/* CTA */}
              {popup.ctaText && (
                <span className="self-start inline-flex px-3 py-1 rounded-lg bg-accent text-white text-[11px] font-bold">{popup.ctaText}</span>
              )}

              {/* Meta */}
              <div className="flex items-center justify-between text-[11px] text-[color:var(--text-muted)] pt-2 border-t border-[color:var(--border-subtle)]">
                <span className="capitalize">{popup.frequency} · {popup.audience.replace("_", " ")}</span>
                <div className="flex items-center gap-3">
                  <span>{popup.views.toLocaleString()} views</span>
                  <span className="text-success font-semibold">{fmtCvr(popup.views, popup.conversions)} CVR</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {popups.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <MessageSquare size={28} className="mx-auto mb-3 text-[color:var(--text-muted)]" />
            <p className="text-sm text-[color:var(--text-muted)]">No popups created yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Newsletter Workspace ─────────────────────────────────────────

const NL_STATUS_VARIANT: Record<NewsletterStatus, "success" | "cyan" | "warning" | "muted"> = {
  sent: "success", scheduled: "cyan", draft: "warning", cancelled: "muted",
};

const NL_STATUS_ICONS: Record<NewsletterStatus, React.ReactNode> = {
  sent: <CheckCircle2 size={12} />,
  scheduled: <Clock size={12} />,
  draft: <FileText size={12} />,
  cancelled: <Trash2 size={12} />,
};

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function NewsletterWorkspace({ subscribers, campaigns }: {
  subscribers: NewsletterSubscriber;
  campaigns: NewsletterCampaign[];
}) {
  const { hoveredId, setHoveredId } = useHoveredRow();

  return (
    <div className="flex flex-col gap-5">
      {/* Subscriber stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Subscribers", value: subscribers.total.toLocaleString(), color: "text-foreground", icon: <Users size={14} /> },
          { label: "Active", value: subscribers.active.toLocaleString(), color: "text-success", icon: <TrendingUp size={14} /> },
          { label: "Unsubscribed", value: subscribers.unsubscribed.toLocaleString(), color: "text-[color:var(--color-warning)]", icon: <EyeOff size={14} /> },
          { label: "Bounced", value: subscribers.bounced.toLocaleString(), color: "text-danger", icon: <MousePointer size={14} /> },
        ].map(s => (
          <div key={s.label} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
            <div className={`flex items-center gap-1 mb-2 ${s.color}`}>{s.icon}</div>
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Campaigns table */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Email Campaigns</p>
        <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent/10 text-accent text-xs font-semibold border border-accent/30 cursor-pointer hover:bg-accent/20 transition-colors">
          <Plus size={13} /> New Campaign
        </button>
      </div>

      <DataTable isEmpty={campaigns.length === 0} emptyState={<DataTable.EmptyState icon={<Mail size={22} className="text-accent" />} title="No email campaigns" message="Create your first newsletter campaign." />}>
        <DataTable.Header>
          <DataTable.Col>Campaign</DataTable.Col>
          <DataTable.Col>Segment</DataTable.Col>
          <DataTable.Col align="center">Recipients</DataTable.Col>
          <DataTable.Col>Status</DataTable.Col>
          <DataTable.Col align="right">Open Rate</DataTable.Col>
          <DataTable.Col align="right">CTR</DataTable.Col>
          <DataTable.Col>Date</DataTable.Col>
          <DataTable.ActionsCol />
        </DataTable.Header>
        <DataTable.Body>
          {campaigns.map(nl => {
            const isHovered = hoveredId === nl.id;
            return (
              <DataTable.Row key={nl.id} isHovered={isHovered} onHoverChange={h => setHoveredId(h ? nl.id : null)}>
                <DataTable.Cell>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate max-w-[200px]">{nl.subject}</p>
                    <p className="text-[11px] text-[color:var(--text-muted)] truncate max-w-[200px]">{nl.previewText}</p>
                  </div>
                </DataTable.Cell>
                <DataTable.Cell className="text-xs text-[color:var(--text-secondary)]">{nl.segment}</DataTable.Cell>
                <DataTable.Cell align="center" className="text-sm font-semibold text-foreground tabular-nums">{nl.recipientCount.toLocaleString()}</DataTable.Cell>
                <DataTable.Cell>
                  <div className="flex items-center gap-1">
                    <DataTable.StatusBadge label={nl.status.charAt(0).toUpperCase() + nl.status.slice(1)} variant={NL_STATUS_VARIANT[nl.status]} />
                  </div>
                </DataTable.Cell>
                <DataTable.Cell align="right" className={`text-sm font-bold ${nl.openRate > 0 ? "text-success" : "text-[color:var(--text-muted)]"}`}>
                  {nl.openRate > 0 ? `${nl.openRate}%` : "—"}
                </DataTable.Cell>
                <DataTable.Cell align="right" className={`text-sm font-bold ${nl.clickRate > 0 ? "text-accent" : "text-[color:var(--text-muted)]"}`}>
                  {nl.clickRate > 0 ? `${nl.clickRate}%` : "—"}
                </DataTable.Cell>
                <DataTable.Cell className="text-xs text-[color:var(--text-muted)] whitespace-nowrap">
                  {nl.status === "sent" ? fmtDate(nl.sentAt) : nl.status === "scheduled" ? fmtDate(nl.scheduledAt) : "—"}
                </DataTable.Cell>
                <DataTable.ActionsCell visible={isHovered}>
                  <DataTable.ActionBtn onClick={() => { }} icon={<Pencil size={13} />} title="Edit" />
                  {nl.status === "draft" && <DataTable.ActionBtn onClick={() => { }} icon={<Send size={13} />} title="Send" />}
                </DataTable.ActionsCell>
              </DataTable.Row>
            );
          })}
        </DataTable.Body>
      </DataTable>
    </div>
  );
}
