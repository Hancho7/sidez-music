// components/sound-kits/ProductFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown, RefreshCw, Upload } from "lucide-react";
import type { DigitalProduct, ProductFormValues, ProductCategory, ProductStatus } from "@/services/sound-kits/types";
import Button from "@/components/ui/Button";

interface Props {
  open: boolean;
  product: DigitalProduct | null;
  onClose: () => void;
  onSave: (data: ProductFormValues, id?: string) => Promise<void>;
}

type FormTab = "basic" | "classification" | "media" | "files" | "pricing" | "publishing";

const FORM_TABS: { key: FormTab; label: string }[] = [
  { key: "basic", label: "Basic" },
  { key: "classification", label: "Classification" },
  { key: "media", label: "Media" },
  { key: "files", label: "Files" },
  { key: "pricing", label: "Pricing" },
  { key: "publishing", label: "Publishing" },
];

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "drum_kit", label: "Drum Kit" },
  { value: "sample_pack", label: "Sample Pack" },
  { value: "loop_pack", label: "Loop Pack" },
  { value: "midi_pack", label: "MIDI Pack" },
  { value: "one_shots", label: "One Shots" },
  { value: "fx_pack", label: "FX Pack" },
  { value: "vocal_pack", label: "Vocal Pack" },
  { value: "construction_kit", label: "Construction Kit" },
  { value: "preset_pack", label: "Preset Pack" },
  { value: "project_files", label: "Project Files" },
];

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD"];
const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
  { value: "archived", label: "Archived" },
];

function emptyForm(): ProductFormValues {
  return {
    name: "", slug: "", description: "", shortDescription: "",
    category: "drum_kit", tags: "", price: "", salePrice: "",
    currency: "USD", downloadLimit: "", unlimited: true,
    currentVersion: "1.0", couponsEnabled: true, licenseRequired: false,
    featured: false, status: "draft", scheduledAt: "",
    seoTitle: "", seoDescription: "",
  };
}

function productToForm(p: DigitalProduct): ProductFormValues {
  return {
    name: p.name, slug: p.slug, description: p.description, shortDescription: p.shortDescription,
    category: p.category, tags: p.tags.join(", "),
    price: String(p.price), salePrice: p.salePrice !== null ? String(p.salePrice) : "",
    currency: p.currency,
    downloadLimit: p.downloadLimit !== null ? String(p.downloadLimit) : "",
    unlimited: p.downloadLimit === null,
    currentVersion: p.currentVersion,
    couponsEnabled: p.couponsEnabled, licenseRequired: p.licenseRequired,
    featured: p.featured, status: p.status,
    scheduledAt: p.scheduledAt ? p.scheduledAt.split("T")[0] : "",
    seoTitle: p.seoTitle, seoDescription: p.seoDescription,
  };
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">{children}</label>;
}

function FieldInput({ label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input {...props} className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none transition-colors focus:border-accent placeholder:text-[color:var(--text-muted)]" />
      {error && <p className="text-[11px] text-danger mt-1">{error}</p>}
    </div>
  );
}

function FieldSelect({ label, children, value, onChange }: { label: string; children: React.ReactNode; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 pr-9 outline-none focus:border-accent appearance-none cursor-pointer [&>option]:bg-surface">
          {children}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] pointer-events-none" />
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-bold tracking-widest uppercase text-[color:var(--text-muted)] border-b border-[color:var(--border-subtle)] pb-2.5 mb-4">{children}</div>;
}

function Toggle({ label, sublabel, checked, onChange }: { label: string; sublabel?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="w-4 h-4 cursor-pointer accent-accent" />
      <div>
        <span className="text-sm font-semibold text-foreground">{label}</span>
        {sublabel && <p className="text-xs text-[color:var(--text-muted)]">{sublabel}</p>}
      </div>
    </label>
  );
}

function UploadZone({ label, accept, hint }: { label: string; accept: string; hint: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="border-2 border-dashed border-[color:var(--border-default)] rounded-xl py-6 flex flex-col items-center gap-2 text-center cursor-pointer hover:border-accent transition-colors bg-[color:var(--bg-input)]">
        <Upload size={18} className="text-[color:var(--text-muted)]" />
        <p className="text-xs font-semibold text-[color:var(--text-secondary)]">Drop file or click to upload</p>
        <p className="text-[11px] text-[color:var(--text-muted)]">{hint}</p>
      </div>
    </div>
  );
}

export default function ProductFormModal({ open, product, onClose, onSave }: Props) {
  const [formTab, setFormTab] = useState<FormTab>("basic");
  const [form, setForm] = useState<ProductFormValues>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});


  useEffect(() => {
    if (open) { setForm(product ? productToForm(product) : emptyForm()); setFormTab("basic"); setErrors({}); }
  }, [open, product]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!open) return null;

  const set = <K extends keyof ProductFormValues>(k: K, v: ProductFormValues[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.price && form.price !== "0") e.price = "Price is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) { setFormTab("basic"); return; }
    setSaving(true);
    try { await onSave(form, product?.id); onClose(); }
    finally { setSaving(false); }
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/65 z-[390] backdrop-blur-sm" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(640px,95vw)] max-h-[92vh] bg-surface border border-[#31386d] rounded-[20px] z-[400] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.6)]">

        <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border-subtle)] shrink-0">
          <div>
            <div className="text-[17px] font-bold text-foreground">{product ? `Edit "${product.name}"` : "Create Product"}</div>
            <div className="text-xs text-[color:var(--text-muted)] mt-0.5">{product ? "Update product details, files, and settings" : "Create a new downloadable digital product"}</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer flex items-center justify-center text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex border-b border-[color:var(--border-subtle)] px-6 shrink-0 overflow-x-auto">
          {FORM_TABS.map(t => (
            <button key={t.key} onClick={() => setFormTab(t.key)}
              className={`px-3.5 py-2.5 border-0 bg-transparent cursor-pointer text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px
                ${formTab === t.key ? "text-accent border-accent" : "text-[color:var(--text-muted)] border-transparent hover:text-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">

          {formTab === "basic" && (
            <div className="flex flex-col gap-4">
              <SectionTitle>Product Identity</SectionTitle>
              <FieldInput label="Product Name *" placeholder="e.g. KXNG Trap Essentials" value={form.name} onChange={e => { set("name", e.target.value); if (!product) set("slug", slugify(e.target.value)); }} error={errors.name} />
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <FieldInput label="Slug" placeholder="kxng-trap-essentials" value={form.slug} onChange={e => set("slug", e.target.value)} />
                </div>
                <button onClick={() => set("slug", slugify(form.name))} className="shrink-0 px-3 py-2.5 rounded-lg border border-[color:var(--border-subtle)] bg-elevated text-[color:var(--text-muted)] text-xs cursor-pointer hover:text-foreground transition-colors" title="Regenerate slug">
                  <RefreshCw size={13} />
                </button>
              </div>
              <div>
                <Label>Short Description</Label>
                <textarea value={form.shortDescription} onChange={e => set("shortDescription", e.target.value)} rows={2} placeholder="One-line product summary for cards and search results..." className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none focus:border-accent resize-none leading-relaxed placeholder:text-[color:var(--text-muted)]" />
              </div>
              <div>
                <Label>Full Description</Label>
                <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={5} placeholder="Detailed product description for the product page..." className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none focus:border-accent resize-y leading-relaxed placeholder:text-[color:var(--text-muted)]" />
              </div>
            </div>
          )}

          {formTab === "classification" && (
            <div className="flex flex-col gap-4">
              <SectionTitle>Category & Tags</SectionTitle>
              <FieldSelect label="Category *" value={form.category} onChange={v => set("category", v as ProductCategory)}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value} className="bg-surface">{c.label}</option>)}
              </FieldSelect>
              <FieldInput label="Tags (comma separated)" placeholder="trap, 808, drums, hip-hop" value={form.tags} onChange={e => set("tags", e.target.value)} />
              <Toggle label="Featured Product" sublabel="Show in featured sections and homepage" checked={form.featured} onChange={v => set("featured", v)} />
            </div>
          )}

          {formTab === "media" && (
            <div className="flex flex-col gap-4">
              <SectionTitle>Product Media</SectionTitle>
              <UploadZone label="Thumbnail *" accept="image/*" hint="PNG, JPG, WebP — 1:1 ratio, 800×800px recommended" />
              <UploadZone label="Gallery Images" accept="image/*" hint="Up to 8 images — shown in product page gallery" />
              <UploadZone label="Preview Audio" accept="audio/*" hint="MP3 or WAV — max 3 min, shown as audio player" />
              <UploadZone label="Preview Video" accept="video/*" hint="MP4 — max 2 min, auto-plays muted on hover" />
            </div>
          )}

          {formTab === "files" && (
            <div className="flex flex-col gap-4">
              <SectionTitle>Downloadable Assets</SectionTitle>
              <UploadZone label="Main ZIP (Primary Download) *" accept=".zip" hint="ZIP — the customer's primary download" />
              <UploadZone label="Additional Files" accept="*/*" hint="MIDI, WAV, PDF, FLP, ALS — bonus assets" />
              <FieldInput label="Version Number" placeholder="1.0" value={form.currentVersion} onChange={e => set("currentVersion", e.target.value)} />
              <div>
                <Label>Release Notes (for this version)</Label>
                <textarea rows={3} placeholder="What's new in this version..." className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none focus:border-accent resize-none leading-relaxed placeholder:text-[color:var(--text-muted)]" />
              </div>
            </div>
          )}

          {formTab === "pricing" && (
            <div className="flex flex-col gap-4">
              <SectionTitle>Price & Delivery</SectionTitle>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <FieldInput label="Price ($) *" type="number" min="0" step="0.01" placeholder="29.99" value={form.price} onChange={e => set("price", e.target.value)} error={errors.price} />
                </div>
                <FieldSelect label="Currency" value={form.currency} onChange={v => set("currency", v)}>
                  {CURRENCIES.map(c => <option key={c} value={c} className="bg-surface">{c}</option>)}
                </FieldSelect>
              </div>
              <FieldInput label="Sale Price (optional)" type="number" min="0" step="0.01" placeholder="19.99" value={form.salePrice} onChange={e => set("salePrice", e.target.value)} />

              <Toggle label="Unlimited Downloads" sublabel="Customers can download as many times as they want" checked={form.unlimited} onChange={v => set("unlimited", v)} />
              {!form.unlimited && (
                <FieldInput label="Download Limit Per Customer" type="number" min="1" placeholder="3" value={form.downloadLimit} onChange={e => set("downloadLimit", e.target.value)} />
              )}

              <Toggle label="Enable Coupons" sublabel="Allow coupon codes to be applied at checkout" checked={form.couponsEnabled} onChange={v => set("couponsEnabled", v)} />
              <Toggle label="License Required" sublabel="Customer must own a license to download" checked={form.licenseRequired} onChange={v => set("licenseRequired", v)} />
            </div>
          )}

          {formTab === "publishing" && (
            <div className="flex flex-col gap-4">
              <SectionTitle>Publishing Status</SectionTitle>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map(s => (
                  <button key={s.value} onClick={() => set("status", s.value)}
                    className={`py-3 rounded-xl text-sm font-semibold border-0 cursor-pointer transition-all
                      ${form.status === s.value ? "bg-accent/15 text-accent outline outline-1 outline-accent/40" : "bg-[color:var(--bg-input)] text-[color:var(--text-muted)] outline outline-1 outline-[color:var(--border-subtle)] hover:outline-[color:var(--border-default)]"}`}>
                    {s.label}
                  </button>
                ))}
              </div>

              {form.status === "scheduled" && (
                <FieldInput label="Scheduled Release Date" type="datetime-local" value={form.scheduledAt} onChange={e => set("scheduledAt", e.target.value)} />
              )}

              <SectionTitle>SEO</SectionTitle>
              <FieldInput label="SEO Title" placeholder="KXNG Trap Essentials — Drum Kit" value={form.seoTitle} onChange={e => set("seoTitle", e.target.value)} />
              <div>
                <Label>SEO Description</Label>
                <textarea value={form.seoDescription} onChange={e => set("seoDescription", e.target.value)} rows={2} placeholder="500+ professional trap samples..." maxLength={160} className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none focus:border-accent resize-none leading-relaxed placeholder:text-[color:var(--text-muted)]" />
                <p className="text-[11px] text-[color:var(--text-muted)] mt-1">{form.seoDescription.length}/160</p>
              </div>
            </div>
          )}

        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[color:var(--border-subtle)] shrink-0">
          <Button onClick={onClose} variant="secondary" size="md">Cancel</Button>
          <Button onClick={handleSubmit} variant="primary" size="md" loading={saving}>
            {saving ? "Saving..." : product ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </div>
    </>
  );
}
