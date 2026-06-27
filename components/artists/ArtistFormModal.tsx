// components/artists/ArtistFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Artist, ArtistFormValues, ArtistType, ArtistStatus, SocialPlatform } from "@/services/artists/types";
import { COUNTRIES, GENRES, ARTIST_TYPES } from "@/services/artists/mock-data";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/TextArea";
import { ModalClose, SectionTitle, ModalFooter } from "@/components/ui/ModalPrimitives";

interface Props {
  open: boolean;
  artist: Artist | null;
  onClose: () => void;
  onSave: (data: ArtistFormValues, id?: string) => Promise<void>;
}

// SocialInput is the local form-only type that carries a stable `id` for
// React keys and mutation ops.  It is NOT stored in ArtistSocial (no `id`).
interface SocialInput {
  id: string;
  platform: SocialPlatform;
  url: string;
}

// FormState is identical to ArtistFormValues except `socials` uses SocialInput
// so we have stable keys while editing. We strip the `id` before calling onSave.
interface FormState extends Omit<ArtistFormValues, "socials"> {
  socials: SocialInput[];
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

function newId() {
  return (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : `social-${Date.now()}-${Math.random()}`;
}

function emptyForm(): FormState {
  return {
    stageName: "", realName: "", biography: "", country: "",
    primaryGenre: "", genres: [], artistType: "producer",
    isVerified: false, isFeatured: false, status: "active",
    email: "", phone: "", website: "", managementCompany: "",
    bookingEmail: "", socials: [],
  };
}

function artistToForm(a: Artist): FormState {
  return {
    stageName: a.stageName, realName: a.realName || "",
    biography: a.biography, country: a.country,
    primaryGenre: a.primaryGenre, genres: [...a.genres],
    artistType: a.artistType, isVerified: a.isVerified,
    isFeatured: a.isFeatured, status: a.status,
    email: a.email, phone: a.phone || "",
    website: a.website || "", managementCompany: a.managementCompany || "",
    bookingEmail: a.bookingEmail || "",
    // Add a stable local id for each social — stripped again before save.
    socials: a.socials.map(s => ({ ...s, id: newId() })),
  };
}

// Convert FormState back to ArtistFormValues by dropping the local `id` field.
function formToValues(f: FormState): ArtistFormValues {
  return {
    ...f,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socials: f.socials.map(({ id: _id, ...rest }) => rest),
  };
}

export default function ArtistFormModal({ open, artist, onClose, onSave }: Props) {
  // Lazy-initialise from the prop so the first render is correct without
  // needing a setState-in-effect to "sync" afterward.
  const [form, setForm] = useState<FormState>(() => artist ? artistToForm(artist) : emptyForm());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ArtistFormValues, string>>>({});

  // Re-initialise when the modal is (re-)opened with a different artist.
  // Using `open` + `artist?.id` as the dependency instead of calling setState
  // inside the effect body avoids the "setState-in-effect" lint warning.
  // The `key` pattern on the parent would be cleaner, but resetting here is
  // acceptable because the condition (`open` flipping to true) is discrete.

  useEffect(() => {
    if (open) {
      setForm(artist ? artistToForm(artist) : emptyForm());
      setErrors({});
    }
    // We intentionally include `artist` (not just `artist?.id`) so the form
    // reflects updated artist data when the same artist is re-edited.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, artist?.id]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!open) return null;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const toggleGenre = (g: string) =>
    set("genres", form.genres.includes(g) ? form.genres.filter(x => x !== g) : [...form.genres, g]);

  const addSocial = () => {
    set("socials", [...form.socials, { id: newId(), platform: "instagram", url: "" }]);
  };

  const removeSocial = (id: string) =>
    set("socials", form.socials.filter(s => s.id !== id));

  const updateSocial = (id: string, key: keyof SocialInput, value: string) =>
    set("socials", form.socials.map(s => s.id === id ? { ...s, [key]: value } : s));

  const validate = (): boolean => {
    const e: Partial<Record<keyof ArtistFormValues, string>> = {};
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
    try { await onSave(formToValues(form), artist?.id); onClose(); }
    finally { setSaving(false); }
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/65 z-[390] backdrop-blur-sm" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(640px,95vw)] max-h-[92vh] bg-surface border border-[#31386d] rounded-[20px] z-[400] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.6)]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border-subtle)] shrink-0">
          <div>
            <p className="text-[17px] font-bold text-foreground">{artist ? "Edit Artist" : "Create Artist"}</p>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">{artist ? `Editing "${artist.stageName}"` : "Add a new artist to the catalog"}</p>
          </div>
          <ModalClose onClose={onClose} />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
          <SectionTitle>Basic Information</SectionTitle>

          <Input
            label="Stage Name *"
            placeholder="e.g. KXNG Nova"
            value={form.stageName}
            onChange={e => set("stageName", e.target.value)}
            error={errors.stageName}
          />

          <Input
            label="Real Name"
            placeholder="e.g. Marcus Williams"
            value={form.realName}
            onChange={e => set("realName", e.target.value)}
          />

          <Textarea
            label="Biography"
            placeholder="Tell the story of this artist..."
            value={form.biography}
            onChange={e => set("biography", e.target.value)}
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Email *"
              type="email"
              placeholder="artist@example.com"
              value={form.email}
              onChange={e => set("email", e.target.value)}
              error={errors.email}
            />
            <Input
              label="Phone"
              placeholder="+1 555 123 4567"
              value={form.phone}
              onChange={e => set("phone", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Select
              label="Country *"
              value={form.country}
              onChange={v => set("country", v)}
              error={errors.country}
            >
              <option value="" className="bg-surface">Select country</option>
              {COUNTRIES.map(c => <option key={c} value={c} className="bg-surface">{c}</option>)}
            </Select>
            <Select
              label="Artist Type"
              value={form.artistType}
              onChange={v => set("artistType", v as ArtistType)}
            >
              {ARTIST_TYPES.map(t => <option key={t.value} value={t.value} className="bg-surface">{t.label}</option>)}
            </Select>
          </div>

          <SectionTitle>Music Profile</SectionTitle>

          <Select
            label="Primary Genre *"
            value={form.primaryGenre}
            onChange={v => set("primaryGenre", v)}
            error={errors.primaryGenre}
          >
            <option value="" className="bg-surface">Select primary genre</option>
            {GENRES.map(g => <option key={g} value={g} className="bg-surface">{g}</option>)}
          </Select>

          <div>
            <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">Genres *</label>
            <div className="flex flex-wrap gap-1.5">
              {GENRES.map(g => (
                <button
                  key={g}
                  onClick={() => toggleGenre(g)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer transition-all ${form.genres.includes(g) ? "bg-[color:var(--accent-magenta)]/20 text-[color:var(--accent-magenta)] outline outline-1 outline-[color:var(--accent-magenta)]/40" : "bg-[color:var(--bg-input)] text-[color:var(--text-muted)] outline outline-1 outline-[color:var(--border-subtle)] hover:outline-[color:var(--border-default)]"}`}
                >
                  {g}
                </button>
              ))}
            </div>
            {errors.genres && <span className="text-[11px] text-danger block mt-1.5">{errors.genres}</span>}
          </div>

          <SectionTitle>Status & Visibility</SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Select
              label="Status"
              value={form.status}
              onChange={v => set("status", v as ArtistStatus)}
            >
              {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value} className="bg-surface">{s.label}</option>)}
            </Select>
            <div className="flex items-end gap-4 pb-1">
              {(["isVerified", "isFeatured"] as const).map(k => (
                <label key={k} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form[k]}
                    onChange={e => set(k, e.target.checked)}
                    className="accent-accent w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-[color:var(--text-secondary)]">
                    {k === "isVerified" ? "Verified" : "Featured"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <SectionTitle>Management</SectionTitle>

          <Input label="Management Company" placeholder="e.g. Nova Management Group" value={form.managementCompany} onChange={e => set("managementCompany", e.target.value)} />
          <Input label="Booking Email" type="email" placeholder="booking@artist.com" value={form.bookingEmail} onChange={e => set("bookingEmail", e.target.value)} />
          <Input label="Website" placeholder="https://artist.com" value={form.website} onChange={e => set("website", e.target.value)} />

          <SectionTitle>Social Profiles</SectionTitle>

          {form.socials.map(social => (
            <div key={social.id} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-3 flex flex-col md:flex-row gap-3 items-start md:items-end">
              <div className="w-full md:w-[150px] shrink-0">
                <Select
                  label="Platform"
                  value={social.platform}
                  onChange={v => updateSocial(social.id, "platform", v as SocialPlatform)}
                >
                  {SOCIAL_PLATFORMS.map(p => (
                    <option key={p} value={p} className="bg-surface">{p.charAt(0).toUpperCase() + p.slice(1).replace("_", " ")}</option>
                  ))}
                </Select>
              </div>
              <div className="flex-1 w-full">
                <Input label="URL" type="url" placeholder="https://..." value={social.url} onChange={e => updateSocial(social.id, "url", e.target.value)} />
              </div>
              {form.socials.length > 1 && (
                <button onClick={() => removeSocial(social.id)} className="mb-0.5 bg-transparent border-0 cursor-pointer text-danger hover:text-danger/80 transition-colors p-1 shrink-0">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}

          <Button variant="dashed" icon={<Plus size={14} />} onClick={addSocial}>Add Social Profile</Button>
        </div>

        <ModalFooter
          onClose={onClose}
          onSave={handleSubmit}
          saving={saving}
          saveLabel={artist ? "Save Changes" : "Create Artist"}
        />
      </div>
    </>
  );
}
