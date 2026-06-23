// components/artists/ArtistFormModal.tsx

"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, ChevronDown } from "lucide-react";
import type { Artist, ArtistFormValues, ArtistType, ArtistStatus, SocialPlatform } from "@/services/artists/types";
import { COUNTRIES, GENRES, ARTIST_TYPES } from "@/services/artists/mock-data";

interface Props {
  open: boolean;
  artist: Artist | null;
  onClose: () => void;
  onSave: (data: ArtistFormValues, id?: string) => Promise<void>;
}

interface SocialInput {
  id: string;
  platform: SocialPlatform;
  url: string;
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  "instagram", "tiktok", "spotify", "apple_music",
  "youtube", "facebook", "soundcloud", "twitter", "website",
];

const STATUS_OPTIONS: Array<{ value: ArtistStatus; label: string }> = [
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
  { value: "hidden", label: "Hidden" },
];

function emptyForm(): ArtistFormValues {
  return {
    stageName: "",
    realName: "",
    biography: "",
    country: "",
    primaryGenre: "",
    genres: [],
    artistType: "producer",
    isVerified: false,
    isFeatured: false,
    status: "active",
    email: "",
    phone: "",
    website: "",
    managementCompany: "",
    bookingEmail: "",
    socials: [],
  };
}

function artistToForm(a: Artist): ArtistFormValues {
  return {
    stageName: a.stageName,
    realName: a.realName || "",
    biography: a.biography,
    country: a.country,
    primaryGenre: a.primaryGenre,
    genres: [...a.genres],
    artistType: a.artistType,
    isVerified: a.isVerified,
    isFeatured: a.isFeatured,
    status: a.status,
    email: a.email,
    phone: a.phone || "",
    website: a.website || "",
    managementCompany: a.managementCompany || "",
    bookingEmail: a.bookingEmail || "",
    socials: a.socials.map(s => ({ ...s, id: crypto.randomUUID?.() || `social-${Date.now()}-${Math.random()}` })),
  };
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">
      {children}
    </label>
  );
}

function FormInput({ label, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        {...props}
        className={`w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none transition-colors focus:border-accent placeholder:text-[color:var(--text-muted)] ${className || ""}`}
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
    <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] border-b border-[color:var(--border-subtle)] pb-2.5 mb-4">
      {children}
    </div>
  );
}

export default function ArtistFormModal({ open, artist, onClose, onSave }: Props) {
  const [form, setForm] = useState<ArtistFormValues>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ArtistFormValues, string>>>({});

  useEffect(() => {
    if (open) {
      setForm(artist ? artistToForm(artist) : emptyForm());
      setErrors({});
    }
  }, [open, artist]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  const set = (key: keyof ArtistFormValues, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const toggleGenre = (g: string) =>
    set("genres", form.genres.includes(g) ? form.genres.filter(x => x !== g) : [...form.genres, g]);

  const addSocial = () => {
    const newSocial: SocialInput = {
      id: crypto.randomUUID?.() || `social-${Date.now()}-${Math.random()}`,
      platform: "instagram" as SocialPlatform,
      url: "",
    };
    set("socials", [...form.socials, newSocial]);
  };

  const removeSocial = (id: string) =>
    set("socials", form.socials.filter((s: SocialInput) => s.id !== id));

  const updateSocial = (id: string, key: keyof SocialInput, value: string) =>
    set("socials", form.socials.map((s: SocialInput) => s.id === id ? { ...s, [key]: value } : s));

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.stageName.trim()) e.stageName = "Stage name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.country) e.country = "Country is required";
    if (!form.primaryGenre) e.primaryGenre = "Primary genre is required";
    if (form.genres.length === 0) e.genres = "At least one genre is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form, artist?.id);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 z-[390] backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(640px,95vw)] max-h-[92vh] bg-surface border border-[#31386d] rounded-[20px] z-[400] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border-subtle)] flex-shrink-0">
          <div>
            <div className="text-[17px] font-bold text-foreground">
              {artist ? "Edit Artist" : "Create Artist"}
            </div>
            <div className="text-xs text-[color:var(--text-muted)] mt-0.5">
              {artist ? `Editing "${artist.stageName}"` : "Add a new artist to the catalog"}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer flex items-center justify-center text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-4">

            <SectionTitle>Basic Information</SectionTitle>

            <FormInput
              label="Stage Name *"
              placeholder="e.g. KXNG Nova"
              value={form.stageName}
              onChange={e => set("stageName", e.target.value)}
            />
            {errors.stageName && (
              <span className="text-[11px] text-danger -mt-2">{errors.stageName}</span>
            )}

            <FormInput
              label="Real Name"
              placeholder="e.g. Marcus Williams"
              value={form.realName}
              onChange={e => set("realName", e.target.value)}
            />

            <div>
              <Label>Biography</Label>
              <textarea
                value={form.biography}
                onChange={e => set("biography", e.target.value)}
                placeholder="Tell the story of this artist..."
                rows={3}
                className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none transition-colors focus:border-accent resize-y leading-relaxed placeholder:text-[color:var(--text-muted)]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <FormInput
                  label="Email *"
                  type="email"
                  placeholder="artist@example.com"
                  value={form.email}
                  onChange={e => set("email", e.target.value)}
                />
                {errors.email && (
                  <span className="text-[11px] text-danger -mt-2 block">{errors.email}</span>
                )}
              </div>
              <FormInput
                label="Phone"
                placeholder="+1 555 123 4567"
                value={form.phone}
                onChange={e => set("phone", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <FormSelect label="Country *" value={form.country} onChange={v => set("country", v)}>
                  <option value="" className="bg-surface">Select country</option>
                  {COUNTRIES.map(c => <option key={c} value={c} className="bg-surface">{c}</option>)}
                </FormSelect>
                {errors.country && (
                  <span className="text-[11px] text-danger -mt-2 block">{errors.country}</span>
                )}
              </div>
              <FormSelect label="Artist Type" value={form.artistType} onChange={v => set("artistType", v as ArtistType)}>
                {ARTIST_TYPES.map(t => <option key={t.value} value={t.value} className="bg-surface">{t.label}</option>)}
              </FormSelect>
            </div>

            <SectionTitle>Music Profile</SectionTitle>

            <div>
              <FormSelect label="Primary Genre *" value={form.primaryGenre} onChange={v => set("primaryGenre", v)}>
                <option value="" className="bg-surface">Select primary genre</option>
                {GENRES.map(g => <option key={g} value={g} className="bg-surface">{g}</option>)}
              </FormSelect>
              {errors.primaryGenre && (
                <span className="text-[11px] text-danger -mt-2 block">{errors.primaryGenre}</span>
              )}
            </div>

            <div>
              <Label>Genres *</Label>
              <div className="flex flex-wrap gap-1.5">
                {GENRES.map(g => (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer transition-all
                      ${form.genres.includes(g)
                        ? "bg-[color:var(--accent-magenta)]/20 text-[color:var(--accent-magenta)] outline outline-1 outline-[color:var(--accent-magenta)]/40"
                        : "bg-[color:var(--bg-input)] text-[color:var(--text-muted)] outline outline-1 outline-[color:var(--border-subtle)] hover:outline-[color:var(--border-default)]"
                      }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {errors.genres && (
                <span className="text-[11px] text-danger block mt-1.5">{errors.genres}</span>
              )}
            </div>

            <SectionTitle>Status & Visibility</SectionTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormSelect label="Status" value={form.status} onChange={v => set("status", v as ArtistStatus)}>
                {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value} className="bg-surface">{s.label}</option>)}
              </FormSelect>
              <div className="flex items-end gap-3 pb-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isVerified}
                    onChange={e => set("isVerified", e.target.checked)}
                    className="accent-accent w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-[color:var(--text-secondary)]">Verified</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={e => set("isFeatured", e.target.checked)}
                    className="accent-accent w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-[color:var(--text-secondary)]">Featured</span>
                </label>
              </div>
            </div>

            <SectionTitle>Management</SectionTitle>

            <FormInput
              label="Management Company"
              placeholder="e.g. Nova Management Group"
              value={form.managementCompany}
              onChange={e => set("managementCompany", e.target.value)}
            />

            <FormInput
              label="Booking Email"
              type="email"
              placeholder="booking@artist.com"
              value={form.bookingEmail}
              onChange={e => set("bookingEmail", e.target.value)}
            />

            <FormInput
              label="Website"
              placeholder="https://artist.com"
              value={form.website}
              onChange={e => set("website", e.target.value)}
            />

            <SectionTitle>Social Profiles</SectionTitle>

            {form.socials.map((social: SocialInput) => (
              <div key={social.id} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg p-3 flex flex-col md:flex-row gap-3 items-start md:items-center">
                <div className="w-full md:w-[140px] flex-shrink-0">
                  <FormSelect
                    label="Platform"
                    value={social.platform}
                    onChange={v => updateSocial(social.id, "platform", v as SocialPlatform)}
                  >
                    {SOCIAL_PLATFORMS.map(p => (
                      <option key={p} value={p} className="bg-surface">
                        {p.charAt(0).toUpperCase() + p.slice(1).replace("_", " ")}
                      </option>
                    ))}
                  </FormSelect>
                </div>
                <div className="flex-1 w-full">
                  <Label>URL</Label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={social.url}
                    onChange={e => updateSocial(social.id, "url", e.target.value)}
                    className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none transition-colors focus:border-accent placeholder:text-[color:var(--text-muted)]"
                  />
                </div>
                {form.socials.length > 1 && (
                  <button
                    onClick={() => removeSocial(social.id)}
                    className="mt-6 md:mt-0 bg-none border-0 cursor-pointer text-danger hover:text-danger/80 transition-colors p-1 flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addSocial}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-[#31386d] bg-transparent text-[color:var(--text-muted)] text-sm font-semibold cursor-pointer transition-colors hover:border-accent hover:text-[color:var(--accent-magenta)]"
            >
              <Plus size={14} />
              Add Social Profile
            </button>

          </div>
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
            className={`px-5 py-2.5 rounded-lg border-0 text-black text-sm font-semibold cursor-pointer transition-colors
              ${saving
                ? "bg-[#6d28d9] opacity-80 cursor-not-allowed"
                : "bg-accent hover:bg-[color:var(--accent-purple-hover)] hover:shadow-[var(--shadow-glow-purple)]"
              }`}
          >
            {saving ? "Saving..." : artist ? "Save Changes" : "Create Artist"}
          </button>
        </div>
      </div>
    </>
  );
}
