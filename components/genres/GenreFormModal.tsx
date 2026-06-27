// components/genres/GenreFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Genre, GenreDetail, GenreFormValues } from "@/services/genres/types";
import { ACCENT_COLORS, ICON_OPTIONS } from "@/services/genres/mock-data";
import IconResolver from "./IconResolver";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/TextArea";
import { ModalClose, SectionTitle } from "@/components/ui/ModalPrimitives";

interface Props {
  open: boolean;
  genre: Genre | GenreDetail | null;
  onClose: () => void;
  onSave: (data: GenreFormValues, id?: string) => Promise<void>;
}

type FormTab = "basic" | "seo" | "subgenres";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function empty(): GenreFormValues {
  return {
    name: "", slug: "", description: "",
    imageUrl: null, accentColor: "#a855f7", icon: "Music2",
    isActive: true, seoTitle: "", seoDescription: "",
    subgenres: [],
  };
}

function genreToForm(g: Genre): GenreFormValues {
  return {
    name: g.name, slug: g.slug, description: g.description,
    imageUrl: g.imageUrl, accentColor: g.accentColor, icon: g.icon,
    isActive: g.isActive, seoTitle: g.seoTitle, seoDescription: g.seoDescription,
    subgenres: ("subgenres" in g)
      ? (g as GenreDetail).subgenres.map(s => ({ name: s.name, slug: s.slug, description: s.description }))
      : [],
  };
}

export default function GenreFormModal({ open, genre, onClose, onSave }: Props) {
  const [formTab, setFormTab] = useState<FormTab>("basic");
  const [form, setForm] = useState<GenreFormValues>(empty());
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);


  useEffect(() => {
    if (open) { setForm(genre ? genreToForm(genre as Genre) : empty()); setFormTab("basic"); setAutoSlug(!genre); }
  }, [open, genre]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!open) return null;

  const set = <K extends keyof GenreFormValues>(k: K, v: GenreFormValues[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleNameChange = (name: string) => {
    set("name", name);
    if (autoSlug) set("slug", slugify(name));
  };

  const addSubgenre = () =>
    set("subgenres", [...form.subgenres, { name: "", slug: "", description: "" }]);

  const updateSubgenre = (i: number, key: string, value: string) =>
    set("subgenres", form.subgenres.map((s, idx) =>
      idx === i ? { ...s, [key]: value, ...(key === "name" ? { slug: slugify(value) } : {}) } : s
    ));

  const removeSubgenre = (i: number) =>
    set("subgenres", form.subgenres.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    try { await onSave(form, genre?.id); onClose(); }
    finally { setSaving(false); }
  };

  const FORM_TABS: { key: FormTab; label: string }[] = [
    { key: "basic", label: "Basic Info" },
    { key: "seo", label: "SEO" },
    { key: "subgenres", label: `Subgenres (${form.subgenres.length})` },
  ];

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/65 z-[390] backdrop-blur-sm" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(600px,95vw)] max-h-[92vh] bg-surface border border-[#31386d] rounded-[20px] z-[400] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.6)]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border-subtle)] shrink-0">
          <div>
            <p className="text-[17px] font-bold text-foreground">{genre ? `Edit "${genre.name}"` : "Create Genre"}</p>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">{genre ? "Update genre details and metadata" : "Define a new music category"}</p>
          </div>
          <ModalClose onClose={onClose} />
        </div>

        {/* Sub-tabs */}
        <div className="flex border-b border-[color:var(--border-subtle)] px-6 shrink-0">
          {FORM_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setFormTab(t.key)}
              className={`px-3.5 py-2.5 border-0 bg-transparent cursor-pointer text-xs font-semibold transition-colors border-b-2 -mb-px ${formTab === t.key ? "text-accent border-accent" : "text-[color:var(--text-muted)] border-transparent hover:text-foreground"}`}
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
              <Input
                label="Genre Name *"
                placeholder="e.g. Hip Hop"
                value={form.name}
                onChange={e => handleNameChange(e.target.value)}
              />
              <Input
                label="Slug"
                placeholder="hip-hop"
                value={form.slug}
                onChange={e => { setAutoSlug(false); set("slug", e.target.value); }}
              />
              <Textarea
                label="Description"
                placeholder="Describe this genre..."
                value={form.description}
                onChange={e => set("description", e.target.value)}
                rows={3}
              />

              {/* Accent color picker — visual only, keep as-is */}
              <div>
                <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">Accent Color</label>
                <div className="flex gap-2 flex-wrap">
                  {ACCENT_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => set("accentColor", c)}
                      title={c}
                      className="w-7 h-7 rounded-full cursor-pointer transition-transform hover:scale-110"
                      style={{ background: c, outline: form.accentColor === c ? `3px solid ${c}` : "3px solid transparent", outlineOffset: 2 }}
                    />
                  ))}
                </div>
              </div>

              {/* Icon picker — visual only, keep as-is */}
              <div>
                <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">Icon</label>
                <div className="grid grid-cols-7 gap-1.5">
                  {ICON_OPTIONS.map(name => (
                    <button
                      key={name}
                      onClick={() => set("icon", name)}
                      title={name}
                      className="h-[38px] rounded-lg border-0 cursor-pointer flex items-center justify-center transition-all"
                      style={{
                        background: form.icon === name ? `${form.accentColor}22` : "#0f1120",
                        outline: form.icon === name ? `1px solid ${form.accentColor}60` : "1px solid #1f2547",
                      }}
                    >
                      <IconResolver name={name} size={16} color={form.icon === name ? form.accentColor : "#66709b"} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Visibility toggle */}
              <div>
                <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">Visibility</label>
                <div className="flex gap-2">
                  {[{ value: true, label: "Active", color: "#34d399", bg: "rgba(16,185,129,0.12)" }, { value: false, label: "Archived", color: "#9ca3af", bg: "rgba(107,114,128,0.12)" }].map(opt => (
                    <button
                      key={String(opt.value)}
                      onClick={() => set("isActive", opt.value)}
                      className="px-4 py-1.5 rounded-lg border-0 cursor-pointer text-xs font-semibold transition-all"
                      style={{ background: form.isActive === opt.value ? opt.bg : "transparent", color: form.isActive === opt.value ? opt.color : "#66709b", outline: form.isActive === opt.value ? `1px solid ${opt.color}40` : "1px solid #1f2547" }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEO */}
          {formTab === "seo" && (
            <div className="flex flex-col gap-4">
              <Input
                label="SEO Title"
                placeholder="Hip Hop Beats | Buy Rap Instrumentals"
                value={form.seoTitle}
                onChange={e => set("seoTitle", e.target.value)}
              />
              <div>
                <Textarea
                  label="SEO Description"
                  placeholder="Browse premium Hip Hop beats from top producers..."
                  value={form.seoDescription}
                  onChange={e => set("seoDescription", e.target.value)}
                  rows={4}
                />
                <p className={`text-[11px] mt-1 ${form.seoDescription.length > 160 ? "text-danger" : "text-[color:var(--text-muted)]"}`}>
                  {form.seoDescription.length}/160 characters
                </p>
              </div>

              {(form.seoTitle || form.seoDescription) && (
                <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                  <p className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-2.5">Search Preview</p>
                  <p className="text-sm text-[#60a5fa] font-semibold mb-0.5">{form.seoTitle || form.name}</p>
                  <p className="text-xs text-success mb-1">sidez.com/genre/{form.slug}</p>
                  <p className="text-xs text-[color:var(--text-secondary)] leading-relaxed">{form.seoDescription}</p>
                </div>
              )}
            </div>
          )}

          {/* SUBGENRES */}
          {formTab === "subgenres" && (
            <div className="flex flex-col gap-2.5">
              <p className="text-xs text-[color:var(--text-muted)] mb-1">Add subgenres to create a deeper music taxonomy.</p>
              {form.subgenres.map((sub, i) => (
                <div key={i} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-3.5 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[color:var(--text-secondary)]">Subgenre {i + 1}</span>
                    <button onClick={() => removeSubgenre(i)} className="bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:text-danger transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <Input label="Name" placeholder="e.g. Trap" value={sub.name} onChange={e => updateSubgenre(i, "name", e.target.value)} />
                    <Input label="Slug" placeholder="trap" value={sub.slug} onChange={e => updateSubgenre(i, "slug", e.target.value)} />
                  </div>
                  <Input label="Description" placeholder="Brief description..." value={sub.description} onChange={e => updateSubgenre(i, "description", e.target.value)} />
                </div>
              ))}
              <Button variant="dashed" icon={<Plus size={14} />} onClick={addSubgenre}>Add Subgenre</Button>
            </div>
          )}
        </div>

        {/* Footer — genre has a preview chip on the left */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[color:var(--border-subtle)] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${form.accentColor}18` }}>
              <IconResolver name={form.icon} size={13} color={form.accentColor} />
            </div>
            <span className="text-xs font-semibold text-[color:var(--text-secondary)]">{form.name || "Preview"}</span>
          </div>
          <div className="flex gap-2.5">
            <Button variant="secondary" size="md" onClick={onClose}>Cancel</Button>
            <Button variant="primary" size="md" onClick={handleSave} loading={saving}>
              {saving ? "Saving…" : genre ? "Save Changes" : "Create Genre"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
