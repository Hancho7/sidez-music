// components/tracks/TrackDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import {
  X, Music2, Star, Play, TrendingUp, ShoppingCart,
  Download, BarChart3, Scroll, Eye, DollarSign, Zap, Globe, Shield,
} from "lucide-react";
import type { Track } from "@/services/tracks/types";

interface Props {
  track: Track | null;
  onClose: () => void;
  onEdit: (track: Track) => void;
}

type Tab = "overview" | "licensing" | "performance";

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  published: { bg: "bg-success/10", color: "text-success" },
  draft: { bg: "bg-[color:var(--color-warning)]/10", color: "text-[color:var(--color-warning)]" },
  archived: { bg: "bg-[#6b7280]/15", color: "text-[#9ca3af]" },
};

function MetaChip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)]">{label}</span>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-input border border-[color:var(--border-subtle)] rounded-[10px] p-3.5 flex flex-col gap-2.5">
      <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      <div>
        <div className="text-lg font-bold text-foreground tracking-[-0.02em]">{value}</div>
        <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
}
function fmtDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function TrackDrawer({ track, onClose, onEdit }: Props) {
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    if (track) {
      setTab("overview")
    };
  }, [track?.id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!track) return null;

  const conversionRate = track.analytics.plays > 0
    ? ((track.analytics.salesCount / track.analytics.plays) * 100).toFixed(2)
    : "0.00";
  const statusStyle = STATUS_STYLE[track.status] || STATUS_STYLE.draft;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-[350] backdrop-blur-sm"
      />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 bottom-0 w-[460px] bg-surface border-l border-[color:var(--border-subtle)] z-[360] flex flex-col overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4.5 border-b border-[color:var(--border-subtle)] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-accent/12 flex items-center justify-center">
              <Music2 size={16} className="text-accent" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">{track.title}</div>
              <div className="text-xs text-[color:var(--text-muted)]">{track.artistName}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(track)}
              className="px-3.5 py-1.5 rounded-[10px] border border-[#31386d] bg-transparent text-[color:var(--text-secondary)] text-xs font-semibold cursor-pointer transition-all hover:bg-elevated hover:text-foreground"
            >
              Edit
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-[10px] border-0 bg-transparent cursor-pointer flex items-center justify-center text-[color:var(--text-muted)] transition-all hover:bg-elevated hover:text-foreground"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[color:var(--border-subtle)] px-5 flex-shrink-0">
          {(["overview", "licensing", "performance"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 border-0 bg-transparent cursor-pointer text-sm font-semibold capitalize transition-colors border-b-2 -mb-px
                ${tab === t
                  ? "text-accent border-accent"
                  : "text-[color:var(--text-muted)] border-transparent hover:text-foreground"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 px-5 py-5 overflow-y-auto">

          {/* ---- OVERVIEW ---- */}
          {tab === "overview" && (
            <div className="flex flex-col gap-5">
              {/* Cover placeholder */}
              <div className="w-full aspect-[16/7] rounded-[10px] bg-gradient-to-br from-elevated to-input border border-[color:var(--border-subtle)] flex flex-col items-center justify-center gap-2.5">
                <div className="w-[52px] h-[52px] rounded-[10px] bg-accent/12 flex items-center justify-center">
                  <Music2 size={22} className="text-accent" />
                </div>
                <span className="text-xs text-[color:var(--text-muted)]">No cover image</span>
              </div>

              {/* Status + featured */}
              <div className="flex items-center gap-2.5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] text-xs font-semibold ${statusStyle.bg} ${statusStyle.color}`}>
                  <span className="w-1.5 h-1.5 rounded-[10px] bg-current" />
                  {track.status.charAt(0).toUpperCase() + track.status.slice(1)}
                </span>
                {track.isFeatured && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] text-xs font-semibold bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]">
                    <Star size={10} fill="currentColor" />
                    Featured
                  </span>
                )}
              </div>

              {/* Description */}
              {track.description && (
                <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed m-0">
                  {track.description}
                </p>
              )}

              {/* Metadata grid */}
              <div className="grid grid-cols-3 gap-4 px-4 py-4 bg-input rounded-[10px] border border-[color:var(--border-subtle)]">
                <MetaChip label="BPM" value={track.bpm} />
                <MetaChip label="Key" value={track.key} />
                <MetaChip label="Duration" value={fmtDuration(track.duration)} />
                <MetaChip label="Genre" value={track.genre} />
                <MetaChip label="Licenses" value={track.licenses.length} />
                <MetaChip label="Created" value={new Date(track.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })} />
              </div>

              {/* Mood tags */}
              {track.mood.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-2">Mood</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {track.mood.map(m => (
                      <span key={m} className="px-2.5 py-0.5 rounded-[10px] text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Audio player placeholder */}
              <div className="bg-input border border-[color:var(--border-subtle)] rounded-[10px] px-4 py-4 flex items-center gap-3.5">
                <button className="w-10 h-10 rounded-full bg-accent border-0 cursor-pointer flex items-center justify-center flex-shrink-0">
                  <Play size={16} fill="#000" color="#fff" className="ml-0.5" />
                </button>
                <div className="flex-1">
                  <div className="h-0.5 bg-[#1a1f3a] rounded-[10px] overflow-hidden">
                    <div className="w-[35%] h-full bg-gradient-to-r from-accent to-[color:var(--accent-magenta)] rounded-[10px]" />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[11px] text-[color:var(--text-muted)]">0:42</span>
                    <span className="text-[11px] text-[color:var(--text-muted)]">{fmtDuration(track.duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---- LICENSING ---- */}
          {tab === "licensing" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-foreground">License Tiers</span>
                <span className="text-xs text-[color:var(--text-muted)]">{track.licenses.length} tier{track.licenses.length !== 1 ? "s" : ""}</span>
              </div>

              {track.licenses.length === 0 && (
                <div className="text-center py-8 text-[color:var(--text-muted)]">
                  <Scroll size={28} className="mx-auto mb-2" />
                  <p className="m-0 text-sm">No licenses configured yet.</p>
                </div>
              )}

              {track.licenses.map((lic, i) => {
                const TIER_COLORS = ["#7c3aed", "#06b6d4", "#ec4899", "#f59e0b"];
                const c = TIER_COLORS[i % TIER_COLORS.length];
                return (
                  <div key={lic.id} className="bg-input border border-[color:var(--border-subtle)] rounded-[10px] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1a2038]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7.5 h-7.5 rounded-[10px] flex items-center justify-center" style={{ background: `${c}18` }}>
                          <Scroll size={13} color={c} />
                        </div>
                        <span className="font-bold text-foreground text-sm">{lic.name}</span>
                      </div>
                      <span className="text-lg font-bold text-success tracking-[-0.02em]">
                        ${lic.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="px-4 py-3 grid grid-cols-2 gap-2.5">
                      <div className="flex items-center gap-1.5">
                        <Zap size={12} className="text-[color:var(--text-muted)]" />
                        <span className="text-xs text-[color:var(--text-secondary)]">
                          {lic.streamLimit ? `${lic.streamLimit.toLocaleString()} streams` : "Unlimited streams"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Globe size={12} className="text-[color:var(--text-muted)]" />
                        <span className="text-xs text-[color:var(--text-secondary)]">
                          {lic.distributionLimit ? `${lic.distributionLimit.toLocaleString()} dist.` : "Unlimited dist."}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <Shield size={12} className={lic.commercialUse ? "text-success" : "text-[color:var(--text-muted)]"} />
                        <span className={`text-xs ${lic.commercialUse ? "text-success" : "text-[color:var(--text-secondary)]"}`}>
                          {lic.commercialUse ? "Commercial use allowed" : "Non-commercial only"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ---- PERFORMANCE ---- */}
          {tab === "performance" && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <StatCard icon={<ShoppingCart size={14} />} label="Total Sales" value={fmtNum(track.analytics.salesCount)} color="#34d399" />
                <StatCard icon={<DollarSign size={14} />} label="Revenue" value={`$${fmtNum(track.analytics.revenue)}`} color="#7c3aed" />
                <StatCard icon={<Eye size={14} />} label="Total Plays" value={fmtNum(track.analytics.plays)} color="#06b6d4" />
                <StatCard icon={<Download size={14} />} label="Downloads" value={fmtNum(track.analytics.downloads)} color="#a855f7" />
              </div>

              {/* Conversion rate */}
              <div className="bg-input border border-[color:var(--border-subtle)] rounded-[10px] px-4 py-4">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-[color:var(--color-warning)]" />
                    <span className="text-sm font-semibold text-foreground">Conversion Rate</span>
                  </div>
                  <span className="text-lg font-bold text-[color:var(--color-warning)]">{conversionRate}%</span>
                </div>
                <div className="h-1.5 bg-[#1a1f3a] rounded-[10px] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] rounded-[10px] transition-all duration-600"
                    style={{ width: `${Math.min(parseFloat(conversionRate) * 10, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-[color:var(--text-muted)] mt-2">
                  {track.analytics.salesCount.toLocaleString()} purchases from {track.analytics.plays.toLocaleString()} plays
                </div>
              </div>

              {/* Revenue per sale */}
              <div className="bg-input border border-[color:var(--border-subtle)] rounded-[10px] px-4 py-4">
                <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-2">
                  Avg. Revenue per Sale
                </div>
                <div className="text-2xl font-bold text-success tracking-[-0.03em]">
                  ${track.analytics.salesCount > 0
                    ? (track.analytics.revenue / track.analytics.salesCount).toFixed(2)
                    : "0.00"}
                </div>
              </div>

              {/* License breakdown */}
              <div className="bg-input border border-[color:var(--border-subtle)] rounded-[10px] px-4 py-4">
                <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-3">
                  License Breakdown
                </div>
                {track.licenses.map((lic, i) => {
                  const pct = track.licenses.length ? Math.round(100 / track.licenses.length) : 0;
                  const COLORS = ["#7c3aed", "#06b6d4", "#ec4899", "#f59e0b"];
                  const c = COLORS[i % COLORS.length];
                  return (
                    <div key={lic.id} className="mb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-[color:var(--text-secondary)]">{lic.name}</span>
                        <span className="text-xs font-semibold text-foreground">{pct}%</span>
                      </div>
                      <div className="h-1 bg-[#1a1f3a] rounded-[10px]">
                        <div className="h-full rounded-[10px]" style={{ width: `${pct}%`, background: c }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
