// components/coupons/CouponFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, RefreshCw, ChevronDown } from "lucide-react";
import type { Coupon, CouponFormValues, DiscountType, CouponStatus, EligibilityTarget, CustomerTarget } from "@/services/coupons/types";
import Button from "@/components/ui/Button";

interface Props {
  open: boolean;
  coupon: Coupon | null;
  onClose: () => void;
  onSave: (data: CouponFormValues, id?: string) => Promise<void>;
}

type FormTab = "basic" | "discount" | "eligibility" | "usage";

const FORM_TABS: { key: FormTab; label: string }[] = [
  { key: "basic", label: "Basic" },
  { key: "discount", label: "Discount" },
  { key: "eligibility", label: "Eligibility" },
  { key: "usage", label: "Usage & Scheduling" },
];

const ENTITY_TARGETS: { value: EligibilityTarget; label: string }[] = [
  { value: "all", label: "Entire Store" },
  { value: "tracks", label: "Specific Tracks" },
  { value: "collections", label: "Collections" },
  { value: "genres", label: "Genres" },
  { value: "license_plans", label: "License Plans" },
  { value: "products", label: "Digital Products" },
  { value: "services", label: "Services" },
];

const CUSTOMER_TARGETS: { value: CustomerTarget; label: string }[] = [
  { value: "all", label: "All Customers" },
  { value: "vip", label: "VIP Customers" },
  { value: "first_time", label: "First-Time Buyers" },
  { value: "returning", label: "Returning Customers" },
  { value: "specific", label: "Specific Customers" },
];

const STATUS_OPTIONS: { value: CouponStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "active", label: "Active" },
  { value: "disabled", label: "Disabled" },
];

const COUNTRIES = ["US", "GB", "CA", "AU", "DE", "FR", "NG", "GH", "ZA", "BR", "JP", "KR"];

function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function emptyForm(): CouponFormValues {
  return {
    campaignName: "", code: "", description: "",
    discountType: "percentage", discountValue: "", maximumDiscount: "", minimumPurchase: "",
    status: "draft", startsAt: "", expiresAt: "",
    usageLimit: "", usagePerCustomer: "", unlimited: true, stackable: false,
    entityTarget: "all", customerTarget: "all", countries: [],
  };
}

function couponToForm(c: Coupon): CouponFormValues {
  return {
    campaignName: c.campaignName, code: c.code, description: c.description,
    discountType: c.discountType,
    discountValue: String(c.discountValue),
    maximumDiscount: c.maximumDiscount !== null ? String(c.maximumDiscount) : "",
    minimumPurchase: c.minimumPurchase !== null ? String(c.minimumPurchase) : "",
    status: c.status,
    startsAt: c.startsAt ? c.startsAt.split("T")[0] : "",
    expiresAt: c.expiresAt ? c.expiresAt.split("T")[0] : "",
    usageLimit: c.usageLimit !== null ? String(c.usageLimit) : "",
    usagePerCustomer: c.usagePerCustomer !== null ? String(c.usagePerCustomer) : "",
    unlimited: c.usageLimit === null,
    stackable: c.stackable,
    entityTarget: c.eligibility.entityTarget,
    customerTarget: c.eligibility.customerTarget,
    countries: [...c.eligibility.countries],
  };
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">{children}</label>;
}

function FieldInput({ label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        {...props}
        className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none transition-colors focus:border-accent placeholder:text-[color:var(--text-muted)]"
      />
      {error && <p className="text-[11px] text-danger mt-1">{error}</p>}
    </div>
  );
}

function FieldSelect({ label, children, value, onChange }: { label: string; children: React.ReactNode; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 pr-9 outline-none transition-colors focus:border-accent appearance-none cursor-pointer [&>option]:bg-surface"
        >
          {children}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] pointer-events-none" />
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold tracking-widest uppercase text-[color:var(--text-muted)] border-b border-[color:var(--border-subtle)] pb-2.5 mb-4">
      {children}
    </div>
  );
}

export default function CouponFormModal({ open, coupon, onClose, onSave }: Props) {
  const [formTab, setFormTab] = useState<FormTab>("basic");
  const [form, setForm] = useState<CouponFormValues>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});


  useEffect(() => {
    if (open) {
      setForm(coupon ? couponToForm(coupon) : emptyForm());
      setFormTab("basic");
      setErrors({});
    }
  }, [open, coupon]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!open) return null;

  const set = <K extends keyof CouponFormValues>(k: K, v: CouponFormValues[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const toggleCountry = (c: string) =>
    set("countries", form.countries.includes(c) ? form.countries.filter(x => x !== c) : [...form.countries, c]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.campaignName.trim()) e.campaignName = "Campaign name is required";
    if (!form.code.trim()) e.code = "Coupon code is required";
    if (!form.discountValue || isNaN(Number(form.discountValue)) || Number(form.discountValue) <= 0)
      e.discountValue = "Valid discount value required";
    if (form.discountType === "percentage" && Number(form.discountValue) > 100)
      e.discountValue = "Percentage cannot exceed 100%";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) { setFormTab("basic"); return; }
    setSaving(true);
    try { await onSave(form, coupon?.id); onClose(); }
    finally { setSaving(false); }
  };

  // Live discount preview
  const previewPrice = 99.99;
  const discountVal = Number(form.discountValue) || 0;
  const maxDiscount = Number(form.maximumDiscount) || Infinity;
  const minPurchase = Number(form.minimumPurchase) || 0;
  const rawDiscount = form.discountType === "percentage" ? previewPrice * (discountVal / 100) : discountVal;
  const appliedDiscount = Math.min(rawDiscount, maxDiscount);
  const previewValid = previewPrice >= minPurchase;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/65 z-[390] backdrop-blur-sm" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(620px,95vw)] max-h-[92vh] bg-surface border border-[#31386d] rounded-[20px] z-[400] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.6)]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border-subtle)] shrink-0">
          <div>
            <div className="text-[17px] font-bold text-foreground">
              {coupon ? `Edit "${coupon.campaignName}"` : "Create Coupon"}
            </div>
            <div className="text-xs text-[color:var(--text-muted)] mt-0.5">
              {coupon ? "Update coupon rules and settings" : "Define a new promotional discount"}
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer flex items-center justify-center text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex border-b border-[color:var(--border-subtle)] px-6 shrink-0 overflow-x-auto">
          {FORM_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setFormTab(t.key)}
              className={`px-3.5 py-2.5 border-0 bg-transparent cursor-pointer text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px
                ${formTab === t.key ? "text-accent border-accent" : "text-[color:var(--text-muted)] border-transparent hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">

          {/* BASIC */}
          {formTab === "basic" && (
            <div className="flex flex-col gap-4">
              <SectionTitle>Campaign Identity</SectionTitle>
              <FieldInput
                label="Campaign Name *"
                placeholder="e.g. Summer Drop 2025"
                value={form.campaignName}
                onChange={e => set("campaignName", e.target.value)}
                error={errors.campaignName}
              />
              <div className="flex gap-2">
                <div className="flex-1">
                  <FieldInput
                    label="Coupon Code *"
                    placeholder="SUMMER25"
                    value={form.code}
                    onChange={e => set("code", e.target.value.toUpperCase())}
                    error={errors.code}
                  />
                </div>
                <div className="flex flex-col">
                  <Label>&nbsp;</Label>
                  <button
                    onClick={() => set("code", generateCode())}
                    title="Generate random code"
                    className="px-3 py-2.5 rounded-lg border border-[color:var(--border-subtle)] bg-elevated text-[color:var(--text-muted)] text-xs cursor-pointer hover:bg-[color:var(--bg-overlay)] hover:text-foreground transition-colors"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                  placeholder="Describe this promotion for internal reference..."
                  rows={3}
                  className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none transition-colors focus:border-accent resize-y leading-relaxed placeholder:text-[color:var(--text-muted)]"
                />
              </div>
              <FieldSelect label="Publishing Status" value={form.status} onChange={v => set("status", v as CouponStatus)}>
                {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value} className="bg-surface">{s.label}</option>)}
              </FieldSelect>
            </div>
          )}

          {/* DISCOUNT */}
          {formTab === "discount" && (
            <div className="flex flex-col gap-4">
              <SectionTitle>Discount Configuration</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                {(["percentage", "fixed"] as DiscountType[]).map(t => (
                  <button
                    key={t}
                    onClick={() => set("discountType", t)}
                    className={`py-3 rounded-xl border-0 cursor-pointer text-sm font-semibold transition-all
                      ${form.discountType === t
                        ? "bg-accent/15 text-accent outline outline-1 outline-accent/40"
                        : "bg-[color:var(--bg-input)] text-[color:var(--text-muted)] outline outline-1 outline-[color:var(--border-subtle)] hover:outline-[color:var(--border-default)]"
                      }`}
                  >
                    {t === "percentage" ? "Percentage %" : "Fixed Amount $"}
                  </button>
                ))}
              </div>

              <FieldInput
                label={`Discount Value (${form.discountType === "percentage" ? "%" : "$"}) *`}
                type="number"
                min="0"
                max={form.discountType === "percentage" ? "100" : undefined}
                step="0.01"
                placeholder={form.discountType === "percentage" ? "25" : "15.00"}
                value={form.discountValue}
                onChange={e => set("discountValue", e.target.value)}
                error={errors.discountValue}
              />

              <div className="grid grid-cols-2 gap-3">
                <FieldInput
                  label="Maximum Discount ($, optional)"
                  type="number" min="0" step="0.01" placeholder="50.00"
                  value={form.maximumDiscount}
                  onChange={e => set("maximumDiscount", e.target.value)}
                />
                <FieldInput
                  label="Minimum Purchase ($, optional)"
                  type="number" min="0" step="0.01" placeholder="20.00"
                  value={form.minimumPurchase}
                  onChange={e => set("minimumPurchase", e.target.value)}
                />
              </div>

              {/* Live preview */}
              {discountVal > 0 && (
                <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] mb-3">Live Preview — $99.99 order</p>
                  <div className={`flex items-center justify-between text-sm rounded-lg p-3 ${previewValid ? "bg-success/5 border border-success/20" : "bg-danger/5 border border-danger/20"}`}>
                    <span className="text-[color:var(--text-secondary)]">$99.99 order</span>
                    {previewValid
                      ? <span className="font-bold text-success">-${appliedDiscount.toFixed(2)} → ${(previewPrice - appliedDiscount).toFixed(2)}</span>
                      : <span className="text-danger text-xs">Below ${form.minimumPurchase} minimum</span>
                    }
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ELIGIBILITY */}
          {formTab === "eligibility" && (
            <div className="flex flex-col gap-4">
              <SectionTitle>Product Targeting</SectionTitle>
              <FieldSelect label="Applies To" value={form.entityTarget} onChange={v => set("entityTarget", v as EligibilityTarget)}>
                {ENTITY_TARGETS.map(t => <option key={t.value} value={t.value} className="bg-surface">{t.label}</option>)}
              </FieldSelect>

              <SectionTitle>Customer Targeting</SectionTitle>
              <FieldSelect label="Eligible Customers" value={form.customerTarget} onChange={v => set("customerTarget", v as CustomerTarget)}>
                {CUSTOMER_TARGETS.map(t => <option key={t.value} value={t.value} className="bg-surface">{t.label}</option>)}
              </FieldSelect>

              <SectionTitle>Geographic Restrictions</SectionTitle>
              <div>
                <Label>Country Restrictions (blank = all)</Label>
                <div className="flex flex-wrap gap-1.5">
                  {COUNTRIES.map(c => (
                    <button
                      key={c}
                      onClick={() => toggleCountry(c)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer transition-all
                        ${form.countries.includes(c)
                          ? "bg-accent/20 text-accent outline outline-1 outline-accent/40"
                          : "bg-[color:var(--bg-input)] text-[color:var(--text-muted)] outline outline-1 outline-[color:var(--border-subtle)] hover:outline-[color:var(--border-default)]"
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* USAGE */}
          {formTab === "usage" && (
            <div className="flex flex-col gap-4">
              <SectionTitle>Usage Limits</SectionTitle>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.unlimited}
                  onChange={e => set("unlimited", e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-accent"
                />
                <div>
                  <span className="text-sm font-semibold text-foreground">Unlimited Usage</span>
                  <p className="text-xs text-[color:var(--text-muted)]">No cap on total redemptions</p>
                </div>
              </label>

              {!form.unlimited && (
                <div className="grid grid-cols-2 gap-3">
                  <FieldInput
                    label="Max Redemptions"
                    type="number" min="1" placeholder="500"
                    value={form.usageLimit}
                    onChange={e => set("usageLimit", e.target.value)}
                  />
                  <FieldInput
                    label="Per Customer Limit"
                    type="number" min="1" placeholder="1"
                    value={form.usagePerCustomer}
                    onChange={e => set("usagePerCustomer", e.target.value)}
                  />
                </div>
              )}

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.stackable}
                  onChange={e => set("stackable", e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-accent"
                />
                <div>
                  <span className="text-sm font-semibold text-foreground">Stackable</span>
                  <p className="text-xs text-[color:var(--text-muted)]">Allow combining with other coupons</p>
                </div>
              </label>

              <SectionTitle>Scheduling</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                <FieldInput
                  label="Start Date"
                  type="date"
                  value={form.startsAt}
                  onChange={e => set("startsAt", e.target.value)}
                />
                <FieldInput
                  label="Expiration Date"
                  type="date"
                  value={form.expiresAt}
                  onChange={e => set("expiresAt", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[color:var(--border-subtle)] shrink-0">
          <Button onClick={onClose} variant="secondary" size="md">Cancel</Button>
          <Button onClick={handleSubmit} variant="primary" size="md" loading={saving}>
            {saving ? "Saving..." : coupon ? "Save Changes" : "Create Coupon"}
          </Button>
        </div>
      </div>
    </>
  );
}
