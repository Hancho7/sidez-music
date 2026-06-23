// components/tracks/TrackFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Upload, Star, ChevronDown } from "lucide-react";
import type { Track, TrackFormData, LicenseDraft, TrackGenre, MusicalKey } from "@/services/tracks/types";

interface Props {
  open: boolean;
  track: Track | null;
  onClose: () => void;
  onSave: (data: TrackFormData, id?: string) => Promise<void>;
}

const GENRES: TrackGenre[] = [
  "Hip-Hop", "Trap", "R&B", "Pop", "Drill",
  "Afrobeats", "Electronic", "Soul", "Gospel", "Jazz", "Reggae", "Other",
];
const KEYS: MusicalKey[] = ["C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B"];
const MOOD_OPTIONS = ["Dark", "Melodic", "Energetic", "Chill", "Aggressive", "Romantic", "Uplifting", "Haunting", "Cinematic", "Raw"];

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">{children}</label>;
}

function FormInput({ label, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        {...props}
        className={`w-full bg-input border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none transition-colors focus:border-accent placeholder:text-[color:var(--text-muted)] ${className || ""}`}
      />
    </div>
  );
}

function FormSelect({ label, children, value, onChange }: {
  label: string;
  children: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-input border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 pr-9 outline-none transition-colors focus:border-accent appearance-none cursor-pointer [&>option]:bg-surface"
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
    <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] border-b border-[color:var(--border-subtle)] pb-2.5 mb-4">
      {children}
    </div>
  );
}

function newLicense(): LicenseDraft {
  return {
    id: `draft-${Date.now()}-${Math.random()}`,
    name: "",
    price: "",
    streamLimit: "",
    distributionLimit: "",
    commercialUse: false,
  };
}

function emptyForm(): TrackFormData {
  return {
    title: "", description: "", artistName: "", genre: "",
    mood: [], bpm: "", key: "", duration: "",
    status: "draft", isFeatured: false,
    licenses: [newLicense()],
  };
}

function trackToForm(t: Track): TrackFormData {
  return {
    title: t.title,
    description: t.description,
    artistName: t.artistName,
    genre: t.genre,
    mood: [...t.mood],
    bpm: String(t.bpm),
    key: t.key,
    duration: String(t.duration),
    status: t.status,
    isFeatured: t.isFeatured,
    licenses: t.licenses.map(l => ({
      id: l.id,
      name: l.name,
      price: String(l.price),
      streamLimit: l.streamLimit ? String(l.streamLimit) : "",
      distributionLimit: l.distributionLimit ? String(l.distributionLimit) : "",
      commercialUse: l.commercialUse,
    })),
  };
}

type FormTab = "basic" | "media" | "publishing" | "licensing";

export default function TrackFormModal({ open, track, onClose, onSave }: Props) {
  const [formTab, setFormTab] = useState<FormTab>("basic");
  const [form, setForm] = useState<TrackFormData>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof TrackFormData, string>>>({});

  useEffect(() => {
    if (open) {
      setForm(track ? trackToForm(track) : emptyForm());
      setFormTab("basic");
      setErrors({});
    }
  }, [open, track]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  const set = (key: keyof TrackFormData, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const toggleMood = (m: string) =>
    set("mood", form.mood.includes(m) ? form.mood.filter(x => x !== m) : [...form.mood, m]);

  const updateLicense = (id: string, key: keyof LicenseDraft, value: string | boolean) =>
    set("licenses", form.licenses.map(l => l.id === id ? { ...l, [key]: value } : l));

  const addLicense = () => set("licenses", [...form.licenses, newLicense()]);
  const removeLicense = (id: string) => set("licenses", form.licenses.filter(l => l.id !== id));

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.artistName.trim()) e.artistName = "Artist is required";
    if (!form.genre) e.genre = "Genre is required";
    if (!form.bpm || isNaN(Number(form.bpm))) e.bpm = "Valid BPM required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) { setFormTab("basic"); return; }
    setSaving(true);
    try {
      await onSave(form, track?.id);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const FORM_TABS: { key: FormTab; label: string }[] = [
    { key: "basic", label: "Basic Info" },
    { key: "media", label: "Media" },
    { key: "publishing", label: "Publishing" },
    { key: "licensing", label: "Licensing" },
  ];

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 z-[390] backdrop-blur-sm"
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(640px,95vw)] max-h-[92vh] bg-surface border border-[#31386d] rounded-[20px] z-[400] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border-subtle)] flex-shrink-0">
          <div>
            <div className="text-[17px] font-bold text-foreground">
              {track ? "Edit Track" : "Upload New Track"}
            </div>
            <div className="text-xs text-[color:var(--text-muted)] mt-0.5">
              {track ? `Editing "${track.title}"` : "Add a new beat to your catalog"}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer flex items-center justify-center text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex border-b border-[color:var(--border-subtle)] px-6 flex-shrink-0 overflow-x-auto">
          {FORM_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setFormTab(t.key)}
              className={`px-3.5 py-2.5 border-0 bg-transparent cursor-pointer text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px
                ${formTab === t.key
                  ? "text-accent border-accent"
                  : "text-[color:var(--text-muted)] border-transparent hover:text-foreground"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">

          {formTab === "basic" && (
            <div className="flex flex-col gap-4">
              <SectionTitle>Track Information</SectionTitle>
              <FormInput
                label="Title *"
                placeholder="e.g. Midnight Bloom"
                value={form.title}
                onChange={e => set("title", e.target.value)}
              />
              {errors.title && <span className="text-[11px] text-danger -mt-2">{errors.title}</span>}
              <FormInput
                label="Artist *"
                placeholder="e.g. KXNG Nova"
                value={form.artistName}
                onChange={e => set("artistName", e.target.value)}
              />
              {errors.artistName && <span className="text-[11px] text-danger -mt-2">{errors.artistName}</span>}
              <div>
                <Label>Description</Label>
                <textarea
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                  placeholder="Describe the vibe and production style..."
                  rows={3}
                  className="w-full bg-input border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none transition-colors focus:border-accent resize-y leading-relaxed placeholder:text-[color:var(--text-muted)]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormSelect label="Genre *" value={form.genre} onChange={v => set("genre", v)}>
                  <option value="" className="bg-surface">Select genre</option>
                  {GENRES.map(g => <option key={g} value={g} className="bg-surface">{g}</option>)}
                </FormSelect>
                <FormInput label="BPM *" type="number" placeholder="140" value={form.bpm} onChange={e => set("bpm", e.target.value)} />
                <FormSelect label="Key" value={form.key} onChange={v => set("key", v)}>
                  <option value="" className="bg-surface">Key</option>
                  {KEYS.map(k => <option key={k} value={k} className="bg-surface">{k}</option>)}
                </FormSelect>
              </div>
              <div>
                <Label>Mood Tags</Label>
                <div className="flex flex-wrap gap-1.5">
                  {MOOD_OPTIONS.map(m => (
                    <button
                      key={m}
                      onClick={() => toggleMood(m)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer transition-all
                        ${form.mood.includes(m)
                          ? "bg-accent/20 text-accent outline outline-1 outline-accent/40"
                          : "bg-input text-[color:var(--text-muted)] outline outline-1 outline-[color:var(--border-subtle)] hover:outline-[color:var(--border-default)]"
                        }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {formTab === "media" && (
            <div className="flex flex-col gap-4">
              <SectionTitle>Media Assets</SectionTitle>
              {[
                { label: "Audio File (.mp3, .wav)", accept: "audio/*", desc: "Full quality master track" },
                { label: "Preview Clip (30s)", accept: "audio/*", desc: "Short playable preview" },
                { label: "Cover Image (.jpg, .png)", accept: "image/*", desc: "1:1 ratio, minimum 1000×1000px" },
              ].map(field => (
                <div key={field.label}>
                  <Label>{field.label}</Label>
                  <div className="border-2 border-dashed border-[color:var(--border-subtle)] rounded-xl p-7 text-center cursor-pointer transition-colors duration-150 hover:border-accent bg-input">
                    <Upload size={20} className="text-[color:var(--text-muted)] mx-auto mb-2" />
                    <div className="text-sm text-[color:var(--text-secondary)] mb-1">Drop file here or click to browse</div>
                    <div className="text-[11px] text-[color:var(--text-muted)]">{field.desc}</div>
                    <input type="file" accept={field.accept} className="hidden" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {formTab === "publishing" && (
            <div className="flex flex-col gap-4">
              <SectionTitle>Publishing Settings</SectionTitle>
              <div className="bg-input border border-[color:var(--border-subtle)] rounded-xl overflow-hidden">
                {[
                  {
                    label: "Status", desc: "Control track visibility",
                    control: (
                      <div className="flex gap-1.5">
                        {(["draft", "published"] as const).map(s => (
                          <button
                            key={s}
                            onClick={() => set("status", s)}
                            className={`px-3.5 py-1.5 rounded-lg border-0 cursor-pointer text-xs font-semibold transition-all
                              ${form.status === s
                                ? (s === "published"
                                  ? "bg-success/15 text-success border border-success/30"
                                  : "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)] border border-[color:var(--color-warning)]/30"
                                )
                                : "bg-transparent text-[color:var(--text-muted)] border border-transparent hover:border-[color:var(--border-subtle)]"
                              }`}
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      </div>
                    ),
                  },
                  {
                    label: "Featured", desc: "Highlight on storefront",
                    control: (
                      <button
                        onClick={() => set("isFeatured", !form.isFeatured)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border-0 cursor-pointer text-xs font-semibold transition-all
                          ${form.isFeatured
                            ? "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)] border border-[color:var(--color-warning)]/30"
                            : "bg-transparent text-[color:var(--text-muted)] border border-[color:var(--border-subtle)] hover:border-[color:var(--border-default)]"
                          }`}
                      >
                        <Star size={12} fill={form.isFeatured ? "currentColor" : "none"} />
                        {form.isFeatured ? "Featured" : "Not Featured"}
                      </button>
                    ),
                  },
                ].map((row, i, arr) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between px-4 py-4
                      ${i < arr.length - 1 ? "border-b border-[#1a2038]" : ""}`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-foreground">{row.label}</div>
                      <div className="text-xs text-[color:var(--text-muted)]">{row.desc}</div>
                    </div>
                    {row.control}
                  </div>
                ))}
              </div>
            </div>
          )}

          {formTab === "licensing" && (
            <div className="flex flex-col gap-3">
              <SectionTitle>License Tiers</SectionTitle>
              {form.licenses.map((lic, i) => (
                <div key={lic.id} className="bg-input border border-[color:var(--border-subtle)] rounded-xl px-4 py-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[color:var(--text-secondary)]">Tier {i + 1}</span>
                    {form.licenses.length > 1 && (
                      <button
                        onClick={() => removeLicense(lic.id)}
                        className="bg-none border-0 cursor-pointer text-danger flex hover:text-danger/80 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <FormInput
                      label="License Name"
                      placeholder="e.g. Basic, Premium"
                      value={lic.name}
                      onChange={e => updateLicense(lic.id, "name", e.target.value)}
                    />
                    <FormInput
                      label="Price ($)"
                      type="number"
                      placeholder="29.99"
                      value={lic.price}
                      onChange={e => updateLicense(lic.id, "price", e.target.value)}
                    />
                    <FormInput
                      label="Stream Limit (blank = unlimited)"
                      type="number"
                      placeholder="5000"
                      value={lic.streamLimit}
                      onChange={e => updateLicense(lic.id, "streamLimit", e.target.value)}
                    />
                    <FormInput
                      label="Distribution Limit"
                      type="number"
                      placeholder="2500"
                      value={lic.distributionLimit}
                      onChange={e => updateLicense(lic.id, "distributionLimit", e.target.value)}
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lic.commercialUse}
                      onChange={e => updateLicense(lic.id, "commercialUse", e.target.checked)}
                      className="accent-accent w-3.5 h-3.5 cursor-pointer"
                    />
                    <span className="text-xs text-[color:var(--text-secondary)]">Allow commercial use</span>
                  </label>
                </div>
              ))}

              <button
                onClick={addLicense}
                className="flex items-center justify-center gap-2 py-2.75 rounded-lg border border-dashed border-[#31386d] bg-transparent text-[color:var(--text-muted)] text-sm font-semibold cursor-pointer transition-colors hover:border-accent hover:text-accent"
              >
                <Plus size={14} />
                Add License Tier
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[color:var(--border-subtle)] flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-[#31386d] bg-transparent text-[color:var(--text-secondary)] text-sm font-semibold cursor-pointer hover:bg-elevated hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`px-5.5 py-2.5 rounded-lg border-0 text-white text-sm font-semibold cursor-pointer transition-colors
              ${saving
                ? "bg-[#6d28d9] opacity-80 cursor-not-allowed"
                : "bg-accent hover:bg-[color:var(--accent-purple-hover)] hover:shadow-[var(--shadow-glow-purple)]"
              }`}
          >
            {saving ? "Saving..." : track ? "Save Changes" : "Upload Track"}
          </button>
        </div>
      </div>
    </>
  );
}
