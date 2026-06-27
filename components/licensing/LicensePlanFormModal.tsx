// components/licensing/LicensePlanFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import type { LicensePlan, LicensePlanFormData } from "@/services/licensing/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/TextArea";
import { ModalClose, SectionTitle, ModalFooter } from "@/components/ui/ModalPrimitives";

interface Props {
  open: boolean;
  plan: LicensePlan | null;
  onClose: () => void;
  onSave: (data: LicensePlanFormData, id?: string) => Promise<void>;
}

// ── Inline Toggle — used only inside this modal ───────────────────────────────
function Toggle({ label, desc, checked, onChange }: {
  label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a2038] last:border-b-0">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {desc && <p className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-[42px] h-6 rounded-full border-0 cursor-pointer relative shrink-0 transition-colors duration-200 ${checked ? "bg-accent" : "bg-[#1a1f3a]"}`}
      >
        <span className={`absolute top-[3px] w-[18px] h-[18px] rounded-full transition-all duration-200 ${checked ? "left-[20px] bg-white" : "left-[3px] bg-[color:var(--text-muted)]"}`} />
      </button>
    </div>
  );
}

function emptyForm(): LicensePlanFormData {
  return {
    name: "", description: "", defaultPrice: "", isActive: true,
    commercialUse: false, streamingAllowed: true, radioAllowed: false,
    tvAllowed: false, monetizationAllowed: false,
    maxStreams: "", maxDistribution: "", territory: "",
    isExclusive: false, includesStems: false, includesWav: true, includesMp3: true,
  };
}

function planToForm(p: LicensePlan): LicensePlanFormData {
  return {
    name: p.name, description: p.description, defaultPrice: String(p.defaultPrice),
    isActive: p.isActive, commercialUse: p.commercialUse, streamingAllowed: p.streamingAllowed,
    radioAllowed: p.radioAllowed, tvAllowed: p.tvAllowed, monetizationAllowed: p.monetizationAllowed,
    maxStreams: p.maxStreams != null ? String(p.maxStreams) : "",
    maxDistribution: p.maxDistribution != null ? String(p.maxDistribution) : "",
    territory: p.territory ?? "",
    isExclusive: p.isExclusive, includesStems: p.includesStems,
    includesWav: p.includesWav, includesMp3: p.includesMp3,
  };
}

type FormTab = "basic" | "rights" | "limits" | "deliverables";

export default function LicensePlanFormModal({ open, plan, onClose, onSave }: Props) {
  const [tab, setTab] = useState<FormTab>("basic");
  const [form, setForm] = useState<LicensePlanFormData>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});


  useEffect(() => {
    if (open) { setForm(plan ? planToForm(plan) : emptyForm()); setTab("basic"); setErrors({}); }
  }, [open, plan]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!open) return null;

  const set = <K extends keyof LicensePlanFormData>(key: K, value: LicensePlanFormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.defaultPrice || isNaN(Number(form.defaultPrice)) || Number(form.defaultPrice) < 0)
      e.defaultPrice = "Valid price required (≥ 0)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) { setTab("basic"); return; }
    setSaving(true);
    try { await onSave(form, plan?.id); onClose(); }
    finally { setSaving(false); }
  };

  const TABS: { key: FormTab; label: string }[] = [
    { key: "basic", label: "Basic Info" },
    { key: "rights", label: "Usage Rights" },
    { key: "limits", label: "Limits" },
    { key: "deliverables", label: "Deliverables" },
  ];

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/60 z-[400] backdrop-blur-sm" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(560px,calc(100vw-40px))] bg-surface border border-[color:var(--border-subtle)] rounded-[20px] z-[410] flex flex-col max-h-[calc(100dvh-60px)] shadow-[0_32px_80px_rgba(0,0,0,0.6)]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border-subtle)] shrink-0">
          <div>
            <p className="text-[16px] font-bold text-foreground">{plan ? "Edit License Plan" : "Create License Plan"}</p>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">{plan ? `Editing "${plan.name}"` : "Define a reusable licensing template"}</p>
          </div>
          <ModalClose onClose={onClose} />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[color:var(--border-subtle)] px-6 shrink-0">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3.5 py-3 border-0 bg-transparent cursor-pointer text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${tab === t.key ? "text-accent border-accent" : "text-[color:var(--text-muted)] border-transparent hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">

          {tab === "basic" && (
            <div className="flex flex-col gap-4">
              <SectionTitle>Plan Identity</SectionTitle>
              <Input label="Plan Name" placeholder="e.g. Premium License" value={form.name} onChange={e => set("name", e.target.value)} error={errors.name} />
              <Textarea label="Description" placeholder="Describe who this license is for and what it allows..." value={form.description} onChange={e => set("description", e.target.value)} rows={3} />
              <Input label="Default Price ($)" type="number" min="0" step="0.01" placeholder="29.99" value={form.defaultPrice} onChange={e => set("defaultPrice", e.target.value)} error={errors.defaultPrice} />
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl overflow-hidden">
                <Toggle label="Active" desc="Inactive plans won't appear on track pages" checked={form.isActive} onChange={v => set("isActive", v)} />
                <Toggle label="Exclusive license" desc="Beat is removed from store after purchase" checked={form.isExclusive} onChange={v => set("isExclusive", v)} />
              </div>
            </div>
          )}

          {tab === "rights" && (
            <div>
              <SectionTitle>Permitted Uses</SectionTitle>
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl overflow-hidden">
                <Toggle label="Commercial use" desc="Allow use in commercial projects" checked={form.commercialUse} onChange={v => set("commercialUse", v)} />
                <Toggle label="Streaming" desc="Spotify, Apple Music, Tidal, etc." checked={form.streamingAllowed} onChange={v => set("streamingAllowed", v)} />
                <Toggle label="Radio broadcasting" desc="FM/AM radio and internet radio stations" checked={form.radioAllowed} onChange={v => set("radioAllowed", v)} />
                <Toggle label="TV / Sync licensing" desc="Film, TV, advertisements, and sync deals" checked={form.tvAllowed} onChange={v => set("tvAllowed", v)} />
                <Toggle label="YouTube monetization" desc="Enable Content ID and revenue sharing" checked={form.monetizationAllowed} onChange={v => set("monetizationAllowed", v)} />
              </div>
            </div>
          )}

          {tab === "limits" && (
            <div className="flex flex-col gap-4">
              <SectionTitle>Distribution Limits</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Max Streams (blank = unlimited)" type="number" min="0" placeholder="100000" value={form.maxStreams} onChange={e => set("maxStreams", e.target.value)} />
                <Input label="Max Distribution Units" type="number" min="0" placeholder="10000" value={form.maxDistribution} onChange={e => set("maxDistribution", e.target.value)} />
              </div>
              <Input label="Territory Restriction (blank = worldwide)" placeholder="e.g. United States, Canada" value={form.territory} onChange={e => set("territory", e.target.value)} />
              <div className="bg-accent-cyan/5 border border-accent-cyan/15 rounded-xl px-3.5 py-3">
                <p className="text-xs text-[color:var(--text-secondary)] leading-relaxed">
                  Leave numeric fields blank to allow <strong className="text-foreground">unlimited</strong> usage.
                  Territory defaults to <strong className="text-foreground">Worldwide</strong>.
                </p>
              </div>
            </div>
          )}

          {tab === "deliverables" && (
            <div>
              <SectionTitle>Included Files</SectionTitle>
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl overflow-hidden">
                <Toggle label="MP3 file" desc="Standard quality compressed audio" checked={form.includesMp3} onChange={v => set("includesMp3", v)} />
                <Toggle label="WAV file" desc="High quality uncompressed audio" checked={form.includesWav} onChange={v => set("includesWav", v)} />
                <Toggle label="Stems (trackout)" desc="Individual instrument tracks for mixing" checked={form.includesStems} onChange={v => set("includesStems", v)} />
              </div>
            </div>
          )}
        </div>

        <ModalFooter
          onClose={onClose}
          onSave={handleSubmit}
          saving={saving}
          saveLabel={plan ? "Save Changes" : "Create Plan"}
        />
      </div>
    </>
  );
}
