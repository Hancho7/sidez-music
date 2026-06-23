// components/licensing/LicensePlanDrawer.tsx
"use client";

import { useEffect } from "react";
import {
  X, Music2, Lock, CheckCircle2, XCircle, Globe, Layers,
  Zap, Radio, Tv2, DollarSign, FileAudio, FileMusic, Mic2,
} from "lucide-react";
import type { LicensePlan } from "@/services/licensing/types";

interface Props {
  plan: LicensePlan | null;
  onClose: () => void;
  onEdit: (plan: LicensePlan) => void;
}

const TIER_ACCENTS: Record<string, string> = {
  Basic: "#06b6d4", Premium: "#a855f7", Unlimited: "#10b981", Exclusive: "#f59e0b",
};
function getAccent(name: string) { return TIER_ACCENTS[name] ?? "#7c3aed"; }

function fmtNum(n: number | null) {
  if (n === null) return "Unlimited";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return `${n}`;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-[color:var(--text-muted)] mb-3">
      {children}
    </div>
  );
}

function RightRow({ icon, label, ok }: { icon: React.ReactNode; label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between px-3.5 py-3 border-b border-[#1a2038]">
      <div className="flex items-center gap-2.5">
        <div className="text-[color:var(--text-muted)] flex">{icon}</div>
        <span className="text-sm text-[color:var(--text-secondary)]">{label}</span>
      </div>
      {ok
        ? <div className="flex items-center gap-1.5 text-success text-xs font-semibold">
          <CheckCircle2 size={14} /> Yes
        </div>
        : <div className="flex items-center gap-1.5 text-[#3a4070] text-xs font-semibold">
          <XCircle size={14} /> No
        </div>}
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-input border border-[color:var(--border-subtle)] rounded-xl p-3.5 flex flex-col gap-1">
      <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)]">
        {label}
      </div>
      <div className="text-[16px] font-bold text-foreground tracking-[-0.02em]">
        {value}
      </div>
    </div>
  );
}

function DeliverableChip({ label, icon, included }: { label: string; icon: React.ReactNode; included: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border
      ${included
        ? "bg-success/10 border-success/20"
        : "bg-input border-[color:var(--border-subtle)]"
      }`}>
      <div className={included ? "text-success" : "text-[#3a4070]"}>{icon}</div>
      <span className={`text-sm font-medium ${included ? "text-[color:var(--text-secondary)]" : "text-[#3a4070]"}`}>
        {label}
      </span>
    </div>
  );
}

export default function LicensePlanDrawer({ plan, onClose, onEdit }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!plan) return null;

  const accent = getAccent(plan.name);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-[350] backdrop-blur-sm"
      />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 bottom-0 w-[480px] bg-surface border-l border-[color:var(--border-subtle)] z-[360] flex flex-col overflow-y-auto">

        {/* Top accent bar */}
        <div
          className="h-0.5 flex-shrink-0"
          style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-5.5 py-4.5 border-b border-[color:var(--border-subtle)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: `${accent}18` }}
            >
              {plan.isExclusive
                ? <Lock size={16} color={accent} />
                : <Music2 size={16} color={accent} />}
            </div>
            <div>
              <div className="text-[15px] font-bold text-foreground">{plan.name} License</div>
              <div className="text-xs text-[color:var(--text-muted)]">${plan.defaultPrice.toFixed(2)} default price</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(plan)}
              className="px-3.5 py-1.5 rounded-lg border border-[#31386d] bg-transparent text-[color:var(--text-secondary)] text-xs font-semibold cursor-pointer transition-all hover:bg-elevated hover:text-foreground"
            >
              Edit
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer flex items-center justify-center text-[color:var(--text-muted)] transition-all hover:bg-elevated hover:text-foreground"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 px-5.5 py-5.5 flex flex-col gap-7">

          {/* Description */}
          <div>
            <SectionTitle>Overview</SectionTitle>
            <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed m-0">
              {plan.description}
            </p>
          </div>

          {/* Distribution stats */}
          <div>
            <SectionTitle>Distribution Limits</SectionTitle>
            <div className="grid grid-cols-2 gap-2.5">
              <StatChip label="Max Streams" value={fmtNum(plan.maxStreams)} />
              <StatChip label="Max Distribution" value={fmtNum(plan.maxDistribution)} />
              <StatChip label="Territory" value={plan.territory ?? "Worldwide"} />
              <StatChip label="Exclusivity" value={plan.isExclusive ? "Exclusive" : "Non-exclusive"} />
            </div>
          </div>

          {/* Usage rights */}
          <div>
            <SectionTitle>Usage Rights</SectionTitle>
            <div className="bg-input border border-[color:var(--border-subtle)] rounded-[14px] overflow-hidden">
              <RightRow icon={<DollarSign size={14} />} label="Commercial use" ok={plan.commercialUse} />
              <RightRow icon={<Music2 size={14} />} label="Streaming allowed" ok={plan.streamingAllowed} />
              <RightRow icon={<Radio size={14} />} label="Radio broadcasting" ok={plan.radioAllowed} />
              <RightRow icon={<Tv2 size={14} />} label="TV / Sync licensing" ok={plan.tvAllowed} />
              <div className="border-b-0">
                <RightRow icon={<Zap size={14} />} label="YouTube monetization" ok={plan.monetizationAllowed} />
              </div>
            </div>
          </div>

          {/* Deliverables */}
          <div>
            <SectionTitle>Deliverables</SectionTitle>
            <div className="flex flex-col gap-2">
              <DeliverableChip label="MP3 file" icon={<FileMusic size={15} />} included={plan.includesMp3} />
              <DeliverableChip label="WAV file" icon={<FileAudio size={15} />} included={plan.includesWav} />
              <DeliverableChip label="Stems (trackout)" icon={<Mic2 size={15} />} included={plan.includesStems} />
            </div>
          </div>

          {/* Exclusive callout */}
          {plan.isExclusive && (
            <div className="bg-[rgba(245,158,11,0.07)] border border-[rgba(245,158,11,0.2)] rounded-xl px-4 py-3.5 flex items-start gap-3">
              <Lock size={16} className="text-[color:var(--color-warning)] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-[color:var(--color-warning)] mb-1">Exclusive License</div>
                <div className="text-xs text-[color:var(--text-secondary)] leading-relaxed">
                  Once purchased, this beat is removed from the marketplace. No other buyers can license it — giving the artist full ownership.
                </div>
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="pt-1 border-t border-[color:var(--border-subtle)]">
            <div className="text-[11px] text-[color:var(--text-muted)]">
              Created {new Date(plan.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}
