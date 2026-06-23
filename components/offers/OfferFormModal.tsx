// components/offers/OfferFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import type { OfferFormValues, ProductType } from "@/services/offers/types";
import Button from "@/components/ui/Button";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: OfferFormValues) => Promise<void>;
}

const MOCK_CUSTOMERS = ["alex.carter", "maya.osei", "daniel.wu", "sara.m", "kevin.j"];
const MOCK_PRODUCTS = [
  { id: "trk-001", title: "Midnight Bloom", type: "track" as ProductType, price: 79.99, plan: "Premium License" },
  { id: "trk-002", title: "Solar Drift", type: "track" as ProductType, price: 299.99, plan: "Exclusive License" },
  { id: "trk-003", title: "Chrome Waves", type: "track" as ProductType, price: 49.99, plan: "Basic License" },
  { id: "col-001", title: "Nova Essentials Vol. 1", type: "collection" as ProductType, price: 149.99, plan: "Bundle License" },
  { id: "svc-001", title: "Custom Beat Production", type: "service" as ProductType, price: 499.99, plan: "Service Package" },
];

function emptyForm(): OfferFormValues {
  return { customerId: "", customerName: "", productType: "track", productTitle: "", licensePlan: "", originalPrice: "", offerAmount: "", expiresAt: "", message: "", internalNotes: "", status: "pending" };
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">{children}</label>;
}

function FieldInput({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input {...props} className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none transition-colors focus:border-accent placeholder:text-[color:var(--text-muted)]" />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-bold tracking-widest uppercase text-[color:var(--text-muted)] border-b border-[color:var(--border-subtle)] pb-2.5 mb-4">{children}</div>;
}

export default function OfferFormModal({ open, onClose, onSave }: Props) {
  const [form, setForm] = useState<OfferFormValues>(emptyForm());
  const [saving, setSaving] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (open) { setForm(emptyForm()); } }, [open]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!open) return null;

  const set = <K extends keyof OfferFormValues>(k: K, v: OfferFormValues[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const selectProduct = (id: string) => {
    const p = MOCK_PRODUCTS.find(x => x.id === id);
    if (!p) return;
    set("productTitle", p.title);
    set("productType", p.type);
    set("licensePlan", p.plan);
    set("originalPrice", String(p.price));
  };

  const handleSubmit = async () => {
    if (!form.customerName || !form.productTitle || !form.offerAmount) return;
    setSaving(true);
    try { await onSave(form); onClose(); }
    finally { setSaving(false); }
  };

  const discount = form.originalPrice && form.offerAmount
    ? ((Number(form.offerAmount) - Number(form.originalPrice)) / Number(form.originalPrice) * 100).toFixed(1)
    : null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/65 z-[390] backdrop-blur-sm" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(560px,95vw)] max-h-[92vh] bg-surface border border-[#31386d] rounded-[20px] z-[400] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.6)]">

        <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border-subtle)] shrink-0">
          <div>
            <div className="text-[17px] font-bold text-foreground">Create Offer</div>
            <div className="text-xs text-[color:var(--text-muted)] mt-0.5">Manually initiate a negotiation on behalf of a customer</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer flex items-center justify-center text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <SectionTitle>Customer</SectionTitle>
            <div>
              <Label>Select Customer *</Label>
              <div className="relative">
                <select
                  value={form.customerName}
                  onChange={e => { set("customerName", e.target.value); set("customerId", `cus-${e.target.selectedIndex}`); }}
                  className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 pr-9 outline-none focus:border-accent appearance-none cursor-pointer [&>option]:bg-surface"
                >
                  <option value="" className="bg-surface">Select a customer...</option>
                  {MOCK_CUSTOMERS.map(c => <option key={c} value={c} className="bg-surface">{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] pointer-events-none" />
              </div>
            </div>

            <SectionTitle>Product</SectionTitle>
            <div>
              <Label>Select Product *</Label>
              <div className="relative">
                <select
                  onChange={e => selectProduct(e.target.value)}
                  className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 pr-9 outline-none focus:border-accent appearance-none cursor-pointer [&>option]:bg-surface"
                >
                  <option value="" className="bg-surface">Select a product...</option>
                  {MOCK_PRODUCTS.map(p => <option key={p.id} value={p.id} className="bg-surface">{p.title} — {p.plan} (${p.price})</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] pointer-events-none" />
              </div>
            </div>
            {form.originalPrice && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg">
                <span className="text-xs text-[color:var(--text-muted)]">Listed price:</span>
                <span className="text-sm font-bold text-foreground">${form.originalPrice}</span>
                <span className="text-xs text-[color:var(--text-muted)] ml-2">{form.licensePlan}</span>
              </div>
            )}

            <SectionTitle>Offer Terms</SectionTitle>
            <FieldInput
              label="Offer Amount ($) *"
              type="number" min="0" step="0.01"
              placeholder="e.g. 65.00"
              value={form.offerAmount}
              onChange={e => set("offerAmount", e.target.value)}
            />
            {discount !== null && (
              <div className={`text-xs font-semibold px-2 py-1 rounded ${Number(discount) < 0 ? "text-danger bg-danger/10" : "text-success bg-success/10"}`}>
                {Number(discount) > 0 ? "+" : ""}{discount}% from listed price
              </div>
            )}
            <FieldInput
              label="Expiration Date"
              type="date"
              value={form.expiresAt}
              onChange={e => set("expiresAt", e.target.value)}
            />
            <div>
              <Label>Message to Customer</Label>
              <textarea
                value={form.message}
                onChange={e => set("message", e.target.value)}
                rows={3}
                placeholder="This message will be visible to the customer..."
                className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none focus:border-accent resize-y leading-relaxed placeholder:text-[color:var(--text-muted)]"
              />
            </div>
            <div>
              <Label>Internal Notes</Label>
              <textarea
                value={form.internalNotes}
                onChange={e => set("internalNotes", e.target.value)}
                rows={2}
                placeholder="Internal context visible to admins only..."
                className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none focus:border-accent resize-y leading-relaxed placeholder:text-[color:var(--text-muted)]"
              />
            </div>

            <SectionTitle>Publishing</SectionTitle>
            <div className="flex gap-2">
              {(["draft", "pending"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => set("status", s)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-0 cursor-pointer transition-all capitalize
                    ${form.status === s
                      ? "bg-accent/15 text-accent outline outline-1 outline-accent/40"
                      : "bg-[color:var(--bg-input)] text-[color:var(--text-muted)] outline outline-1 outline-[color:var(--border-subtle)] hover:outline-[color:var(--border-default)]"
                    }`}
                >
                  {s === "pending" ? "Send Immediately" : "Save as Draft"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[color:var(--border-subtle)] shrink-0">
          <Button onClick={onClose} variant="secondary" size="md">Cancel</Button>
          <Button onClick={handleSubmit} variant="primary" size="md" loading={saving}>
            {saving ? "Creating..." : "Create Offer"}
          </Button>
        </div>
      </div>
    </>
  );
}
