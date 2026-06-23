// app/(dashboard)/licensing/plans/page.tsx
"use client";

import { useState, useCallback } from "react";
import { Plus, ScrollText, RefreshCw } from "lucide-react";
import LicensePlanCard from "@/components/licensing/LicensePlanCard";
import LicensePlanDrawer from "@/components/licensing/LicensePlanDrawer";
import LicensePlanFormModal from "@/components/licensing/LicensePlanFormModal";
import { MOCK_LICENSE_PLANS } from "@/services/licensing/mock-data";
import type { LicensePlan, LicensePlanFormData } from "@/services/licensing/types";
import Button from "@/components/ui/Button";

// ── Helpers ──────────────────────────────────────────────────────────

function formToplan(data: LicensePlanFormData, id: string, createdAt: string): LicensePlan {
  return {
    id,
    name: data.name,
    description: data.description,
    defaultPrice: parseFloat(data.defaultPrice) || 0,
    isActive: data.isActive,
    commercialUse: data.commercialUse,
    streamingAllowed: data.streamingAllowed,
    radioAllowed: data.radioAllowed,
    tvAllowed: data.tvAllowed,
    monetizationAllowed: data.monetizationAllowed,
    maxStreams: data.maxStreams ? parseInt(data.maxStreams) : null,
    maxDistribution: data.maxDistribution ? parseInt(data.maxDistribution) : null,
    territory: data.territory.trim() || null,
    isExclusive: data.isExclusive,
    includesStems: data.includesStems,
    includesWav: data.includesWav,
    includesMp3: data.includesMp3,
    createdAt,
  };
}

// ── Page ─────────────────────────────────────────────────────────────

export default function LicensePlansPage() {
  const [plans, setPlans] = useState<LicensePlan[]>(MOCK_LICENSE_PLANS);
  const [drawerPlan, setDrawerPlan] = useState<LicensePlan | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LicensePlan | null>(null);

  // ── Actions ──

  const openCreate = () => {
    setEditingPlan(null);
    setModalOpen(true);
  };

  const openEdit = useCallback((plan: LicensePlan) => {
    setEditingPlan(plan);
    setDrawerPlan(null);
    setModalOpen(true);
  }, []);

  const handleToggleActive = useCallback((plan: LicensePlan) => {
    setPlans(prev => prev.map(p =>
      p.id === plan.id ? { ...p, isActive: !p.isActive } : p
    ));
    if (drawerPlan?.id === plan.id) {
      setDrawerPlan(prev => prev ? { ...prev, isActive: !prev.isActive } : prev);
    }
  }, [drawerPlan]);

  const handleSave = async (data: LicensePlanFormData, id?: string) => {
    await new Promise(r => setTimeout(r, 500));

    if (id) {
      const updated = formToplan(data, id, plans.find(p => p.id === id)?.createdAt ?? new Date().toISOString());
      setPlans(prev => prev.map(p => p.id === id ? updated : p));
      if (drawerPlan?.id === id) setDrawerPlan(updated);
    } else {
      const newPlan = formToplan(data, `plan_${Date.now()}`, new Date().toISOString());
      setPlans(prev => [...prev, newPlan]);
    }
  };

  const activePlans = plans.filter(p => p.isActive);
  const inactivePlans = plans.filter(p => !p.isActive);

  return (
    <div className="flex flex-col gap-7">

      {/* ── Page header ── */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
            Licensing
          </div>
          <h1 className="text-2xl font-bold text-foreground m-0 tracking-[-0.03em] leading-tight">
            License Plans
          </h1>
          <p className="mt-1.5 text-sm text-[color:var(--text-secondary)]">
            Define how your music is licensed and sold
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={15} />}
          onClick={openCreate}
        >
          Create License Plan
        </Button>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
        {[
          { label: "Total Plans", value: plans.length },
          { label: "Active", value: activePlans.length, color: "#34d399" },
          { label: "Inactive", value: inactivePlans.length, color: "#66709b" },
          { label: "Exclusive Plans", value: plans.filter(p => p.isExclusive).length, color: "#f59e0b" },
        ].map(stat => (
          <div key={stat.label} className="bg-surface border border-[color:var(--border-subtle)] rounded-xl px-4 py-3.5">
            <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
              {stat.label}
            </div>
            <div className="text-[22px] font-bold tracking-[-0.03em]" style={{ color: stat.color ?? "#f0f2ff" }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Active plans grid ── */}
      {activePlans.length > 0 && (
        <section>
          <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-3.5">
            Active Plans
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {activePlans.map(plan => (
              <LicensePlanCard
                key={plan.id}
                plan={plan}
                onClick={setDrawerPlan}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Inactive plans ── */}
      {inactivePlans.length > 0 && (
        <section>
          <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-3.5">
            Inactive Plans
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {inactivePlans.map(plan => (
              <LicensePlanCard
                key={plan.id}
                plan={plan}
                onClick={setDrawerPlan}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Empty state ── */}
      {plans.length === 0 && (
        <div className="bg-surface border border-[color:var(--border-subtle)] rounded-[20px] py-[72px] px-8 text-center">
          <div className="w-[60px] h-[60px] rounded-[16px] bg-accent/10 mx-auto mb-5 flex items-center justify-center">
            <ScrollText size={26} className="text-accent" />
          </div>
          <div className="text-lg font-bold text-foreground mb-2">
            No license plans yet
          </div>
          <p className="text-sm text-[color:var(--text-muted)] m-0 mx-auto max-w-[360px] leading-relaxed">
            License plans define how your beats can be used and sold. Create your first plan to start monetizing your catalog.
          </p>
          <Button
            variant="primary"
            icon={<Plus size={15} />}
            onClick={openCreate}
          >
            Create your first plan
          </Button>
        </div>
      )}

      {/* ── Drawer ── */}
      <LicensePlanDrawer
        plan={drawerPlan}
        onClose={() => setDrawerPlan(null)}
        onEdit={openEdit}
      />

      {/* ── Modal ── */}
      <LicensePlanFormModal
        open={modalOpen}
        plan={editingPlan}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

    </div>
  );
}
