// components/licensing/LicensePlanCard.tsx
//
// LicensePlanCard deliberately retains inline styles for per-tier dynamic accent
// colors (border glow, icon bg, etc.) — these are data-driven and can't use
// static Tailwind classes. Everything structural uses Card primitives.
"use client";

import { CheckCircle2, XCircle, Music2, Globe, Layers, Zap, Lock } from "lucide-react";
import type { LicensePlan } from "@/services/licensing/types";
import Card from "@/components/ui/Card";

interface Props {
  plan: LicensePlan;
  onClick: (plan: LicensePlan) => void;
  onToggleActive: (plan: LicensePlan) => void;
}

const TIER_ACCENTS: Record<string, { color: string; bg: string; glow: string }> = {
  Basic: { color: "#06b6d4", bg: "rgba(6,182,212,0.1)", glow: "rgba(6,182,212,0.2)" },
  Premium: { color: "#a855f7", bg: "rgba(168,85,247,0.1)", glow: "rgba(168,85,247,0.2)" },
  Unlimited: { color: "#10b981", bg: "rgba(16,185,129,0.1)", glow: "rgba(16,185,129,0.2)" },
  Exclusive: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", glow: "rgba(245,158,11,0.2)" },
};

function getAccent(name: string) {
  return TIER_ACCENTS[name] ?? { color: "#7c3aed", bg: "rgba(124,58,237,0.1)", glow: "rgba(124,58,237,0.2)" };
}

function fmtNum(n: number | null) {
  if (n === null) return "Unlimited";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return `${n}`;
}

function Right({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {ok ? <CheckCircle2 size={12} className="text-success" /> : <XCircle size={12} className="text-[#31386d]" />}
      <span className={`text-xs ${ok ? "text-[color:var(--text-secondary)]" : "text-[#3a4070]"}`}>{label}</span>
    </div>
  );
}

export default function LicensePlanCard({ plan, onClick, onToggleActive }: Props) {
  const accent = getAccent(plan.name);

  return (
    // Card shell with dynamic border glow — must use noHoverLift so we can set
    // our own boxShadow via the style prop without fighting Tailwind shadow classes.
    <Card onClick={() => onClick(plan)} noHoverLift>
      {/* Dynamic accent stripe at top */}
      {plan.isExclusive && (
        <div
          className="h-0.5 w-full shrink-0"
          style={{ background: `linear-gradient(90deg, ${accent.color}, transparent)` }}
        />
      )}

      <Card.Body className="gap-5 p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[11px] flex items-center justify-center shrink-0" style={{ background: accent.bg }}>
              {plan.isExclusive
                ? <Lock size={17} color={accent.color} />
                : <Music2 size={17} color={accent.color} />
              }
            </div>
            <div>
              <div className="text-[15px] font-bold text-foreground tracking-tight">{plan.name}</div>
              {plan.isExclusive && (
                <div className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-bold tracking-[0.06em] uppercase" style={{ color: accent.color }}>
                  <Zap size={9} fill={accent.color} /> Exclusive
                </div>
              )}
            </div>
          </div>

          {/* Active toggle */}
          <button
            onClick={e => { e.stopPropagation(); onToggleActive(plan); }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border-0 cursor-pointer text-[11px] font-semibold transition-all duration-150
              ${plan.isActive ? "bg-success/10 text-success" : "bg-white/5 text-white/40"}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${plan.isActive ? "bg-success" : "bg-white/40"}`} />
            {plan.isActive ? "Active" : "Inactive"}
          </button>
        </div>

        {/* Price */}
        <div>
          <div className="text-[11px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] mb-1">Default Price</div>
          <div className="text-[28px] font-bold text-foreground tracking-tight leading-none">
            ${plan.defaultPrice.toFixed(2)}
          </div>
        </div>

        <p className="text-sm text-[color:var(--text-muted)] leading-relaxed line-clamp-2 m-0">{plan.description}</p>

        {/* Rights grid */}
        <div className="grid grid-cols-2 gap-2 gap-x-3">
          <Right ok={plan.commercialUse} label="Commercial use" />
          <Right ok={plan.streamingAllowed} label="Streaming" />
          <Right ok={plan.radioAllowed} label="Radio" />
          <Right ok={plan.tvAllowed} label="TV / Sync" />
          <Right ok={plan.monetizationAllowed} label="Monetization" />
          <Right ok={plan.includesStems} label="Stems" />
        </div>

        {/* Distribution chips */}
        <div className="flex gap-2 pt-1 border-t border-[color:var(--border-subtle)]">
          <div className="flex items-center gap-1.5 bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg px-2.5 py-1.5">
            <Globe size={11} className="text-[color:var(--text-muted)]" />
            <span className="text-[11px] text-[color:var(--text-secondary)]">{plan.territory ?? "Worldwide"}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg px-2.5 py-1.5">
            <Layers size={11} className="text-[color:var(--text-muted)]" />
            <span className="text-[11px] text-[color:var(--text-secondary)]">{fmtNum(plan.maxStreams)} streams</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
