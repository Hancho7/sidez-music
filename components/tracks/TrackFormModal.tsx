// components/tracks/TrackFormModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, Upload, Star, ChevronDown, Tag, Music2, FileAudio, FileArchive, ScrollText, ShieldCheck } from "lucide-react";
import type { Track, TrackFormData, LicenseDraft, TrackGenre, MusicalKey } from "@/services/tracks/types";
import Button from "../ui/Button";

interface Props {
  open: boolean;
  track: Track | null;
  onClose: () => void;
  onSave: (data: TrackFormData, id?: string) => Promise<void>;
}

// ── Constants ─────────────────────────────────────────────────────

const GENRES: TrackGenre[] = [
  "Hip-Hop", "Trap", "R&B", "Pop", "Drill",
  "Afrobeats", "Electronic", "Soul", "Gospel", "Jazz", "Reggae", "Other",
];
const KEYS: MusicalKey[] = [
  "C", "C#", "Db", "D", "D#", "Eb", "E",
  "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B",
];

// File deliverables available per track
export type TrackFile = "mp3" | "wav" | "stems" | "midi" | "project_file" | "artwork";
const ALL_FILES: { key: TrackFile; label: string; description: string; icon: React.ReactNode }[] = [
  { key: "mp3", label: "MP3", description: "Compressed, universal playback", icon: <Music2 size={13} /> },
  { key: "wav", label: "WAV", description: "Lossless, studio quality", icon: <FileAudio size={13} /> },
  { key: "stems", label: "Stems / Trackout", description: "Individual instrument tracks", icon: <FileArchive size={13} /> },
  { key: "midi", label: "MIDI", description: "Note data for re-instrumentation", icon: <FileAudio size={13} /> },
  { key: "project_file", label: "Project File", description: "DAW session (FL, Logic, Ableton…)", icon: <FileArchive size={13} /> },
  { key: "artwork", label: "Cover Artwork", description: "High-res cover art file", icon: <FileArchive size={13} /> },
];

// Rights / usage toggles per license
export type TrackRight =
  | "commercial_use"
  | "broadcast_rights"
  | "sync_rights"
  | "master_rights"
  | "publishing_rights"
  | "unlimited_distribution"
  | "exclusive_ownership";

const ALL_RIGHTS: { key: TrackRight; label: string; description: string; tier: "basic" | "advanced" | "exclusive" }[] = [
  { key: "commercial_use", label: "Commercial Use", description: "Use in monetised content", tier: "basic" },
  { key: "broadcast_rights", label: "Broadcast Rights", description: "TV, radio & paid streaming channels", tier: "advanced" },
  { key: "sync_rights", label: "Sync Rights", description: "Film, TV & ad synchronisation", tier: "advanced" },
  { key: "unlimited_distribution", label: "Unlimited Distribution", description: "No limit on copies or platforms", tier: "advanced" },
  { key: "master_rights", label: "Master Rights", description: "Ownership of the master recording", tier: "exclusive" },
  { key: "publishing_rights", label: "Publishing Rights", description: "Copyright ownership of composition", tier: "exclusive" },
  { key: "exclusive_ownership", label: "Exclusive Ownership", description: "Beat is removed from sale after purchase", tier: "exclusive" },
];

const TIER_DEFAULTS: Record<string, { files: TrackFile[]; rights: TrackRight[] }> = {
  "Basic": { files: ["mp3"], rights: [] },
  "Standard": { files: ["mp3"], rights: ["commercial_use"] },
  "Premium": { files: ["mp3", "wav"], rights: ["commercial_use", "broadcast_rights"] },
  "Unlimited": { files: ["mp3", "wav", "stems"], rights: ["commercial_use", "broadcast_rights", "sync_rights", "unlimited_distribution"] },
  "Exclusive": { files: ["mp3", "wav", "stems", "midi", "project_file", "artwork"], rights: ALL_RIGHTS.map(r => r.key) },
};

// ── Types extension on LicenseDraft ──────────────────────────────
// LicenseDraft in types.ts needs these — they're optional so existing code won't break
type LicenseDraftExtended = LicenseDraft & {
  includedFiles: TrackFile[];
  grantedRights: TrackRight[];
};

function newLicense(): LicenseDraftExtended {
  return {
    id: `draft-${Date.now()}-${Math.random()}`,
    name: "",
    price: "",
    streamLimit: "",
    distributionLimit: "",
    commercialUse: false,
    includedFiles: ["mp3"],
    grantedRights: [],
  };
}

type ExtendedFormData = Omit<TrackFormData, "licenses"> & {
  licenses: LicenseDraftExtended[];
};

function emptyForm(): ExtendedFormData {
  return {
    title: "", description: "", artistName: "", genre: "",
    mood: [], bpm: "", key: "", duration: "",
    status: "draft", isFeatured: false,
    licenses: [newLicense()],
  };
}

// components/tracks/TrackFormModal.tsx
// ... (imports remain the same)

function trackToForm(t: Track): ExtendedFormData {
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
    licenses: t.licenses.map(l => {
      // Create a base license with the correct types
      const base: LicenseDraftExtended = {
        id: l.id,
        name: l.name,
        price: String(l.price), // Convert number to string
        streamLimit: l.streamLimit ? String(l.streamLimit) : "",
        distributionLimit: l.distributionLimit ? String(l.distributionLimit) : "",
        commercialUse: l.commercialUse,
        includedFiles: ["mp3"], // Default
        grantedRights: [], // Default
      };

      // Try to get extended properties if they exist on the license
      // Use type assertion with 'unknown' as the intermediate type
      const extended = l as unknown as Partial<LicenseDraftExtended>;

      return {
        ...base,
        includedFiles: extended.includedFiles ?? ["mp3"],
        grantedRights: extended.grantedRights ?? (l.commercialUse ? ["commercial_use"] : []),
      };
    }),
  };
}

// ── Sub-components ────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">{children}</label>;
}

function FormInput({ label, error, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        {...props}
        className={`w-full bg-input border rounded-[10px] text-foreground text-sm font-inherit px-3 py-2.5 outline-none transition-colors focus:border-accent placeholder:text-[color:var(--text-muted)] ${error ? "border-danger" : "border-[color:var(--border-subtle)]"} ${className ?? ""}`}
      />
      {error && <p className="text-[11px] text-danger mt-1">{error}</p>}
    </div>
  );
}

function FormSelect({ label, children, value, onChange }: {
  label: string; children: React.ReactNode; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-input border border-[color:var(--border-subtle)] rounded-[10px] text-foreground text-sm font-inherit px-3 py-2.5 pr-9 outline-none transition-colors focus:border-accent appearance-none cursor-pointer [&>option]:bg-surface"
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

// ── Mood tag input ────────────────────────────────────────────────

function MoodTagInput({ moods, onChange }: { moods: string[]; onChange: (moods: string[]) => void }) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addMood = (raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, "-");
    if (!tag || moods.includes(tag)) { setInput(""); return; }
    onChange([...moods, tag]);
    setInput("");
  };

  const removeMood = (m: string) => onChange(moods.filter(x => x !== m));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addMood(input); }
    if (e.key === "Backspace" && !input && moods.length > 0) removeMood(moods[moods.length - 1]);
  };

  return (
    <div>
      <Label>Mood Tags</Label>
      <div
        onClick={() => inputRef.current?.focus()}
        className="min-h-[42px] flex flex-wrap gap-1.5 items-center px-3 py-2 bg-input border border-[color:var(--border-subtle)] rounded-[10px] focus-within:border-accent transition-colors cursor-text"
      >
        {moods.map(m => (
          <span key={m} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[10px] bg-accent/15 text-accent text-[11px] font-semibold">
            {m}
            <button
              type="button"
              onClick={e => { e.stopPropagation(); removeMood(m); }}
              className="w-3 h-3 rounded-[10px] flex items-center justify-center bg-transparent border-0 cursor-pointer text-accent hover:bg-accent/30 transition-colors"
            >
              <X size={8} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (input.trim()) addMood(input); }}
          placeholder={moods.length === 0 ? "Type a mood and press Enter…" : ""}
          className="flex-1 min-w-[120px] bg-transparent border-0 outline-none text-sm text-foreground placeholder:text-[color:var(--text-muted)] font-inherit"
        />
      </div>
      <p className="text-[10px] text-[color:var(--text-muted)] mt-1">Press Enter or comma to add. E.g. dark, melodic, aggressive, cinematic</p>
    </div>
  );
}

// ── License file / rights builder ────────────────────────────────

function LicenseCard({
  lic, index, total,
  onUpdate, onRemove,
}: {
  lic: LicenseDraftExtended;
  index: number;
  total: number;
  onUpdate: (patch: Partial<LicenseDraftExtended>) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  const toggleFile = (key: TrackFile) =>
    onUpdate({ includedFiles: lic.includedFiles.includes(key) ? lic.includedFiles.filter(f => f !== key) : [...lic.includedFiles, key] });

  const toggleRight = (key: TrackRight) =>
    onUpdate({ grantedRights: lic.grantedRights.includes(key) ? lic.grantedRights.filter(r => r !== key) : [...lic.grantedRights, key] });

  const applyPreset = (name: string) => {
    const preset = TIER_DEFAULTS[name];
    if (!preset) return;
    onUpdate({
      name,
      includedFiles: preset.files,
      grantedRights: preset.rights,
      commercialUse: preset.rights.includes("commercial_use"),
    });
  };

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${expanded ? "border-accent/30" : "border-[color:var(--border-subtle)]"}`}>
      {/* Tier header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-input cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--text-muted)]">Tier {index + 1}</span>
          {lic.name && <span className="text-sm font-bold text-foreground">{lic.name}</span>}
          {lic.price && <span className="text-sm font-semibold text-success">${lic.price}</span>}
          <div className="flex gap-1">
            {lic.includedFiles.slice(0, 3).map(f => (
              <span key={f} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-accent/10 text-accent uppercase">{f}</span>
            ))}
            {lic.includedFiles.length > 3 && <span className="text-[9px] text-[color:var(--text-muted)]">+{lic.includedFiles.length - 3}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          {total > 1 && (
            <button onClick={onRemove} className="w-7 h-7 rounded-[10px] flex items-center justify-center bg-transparent border-0 cursor-pointer text-danger hover:bg-danger/10 transition-colors">
              <Trash2 size={13} />
            </button>
          )}
          <ChevronDown size={14} className={`text-[color:var(--text-muted)] transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </div>

      {expanded && (
        <div className="px-4 py-4 flex flex-col gap-4 bg-surface">
          {/* Quick presets */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--text-muted)] mb-2">Quick Presets</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(TIER_DEFAULTS).map(name => (
                <button
                  key={name}
                  onClick={() => applyPreset(name)}
                  className={`px-2.5 py-1 rounded-[10px] text-[11px] font-semibold border-0 cursor-pointer transition-all ${lic.name === name ? "bg-accent/15 text-accent outline outline-1 outline-accent/30" : "bg-elevated text-[color:var(--text-muted)] hover:text-foreground hover:bg-[color:var(--bg-overlay)]"}`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Name + Price */}
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="License Name"
              placeholder="e.g. Basic, Premium, Exclusive"
              value={lic.name}
              onChange={e => onUpdate({ name: e.target.value })}
            />
            <FormInput
              label="Price (USD)"
              type="number"
              placeholder="29.99"
              value={lic.price}
              onChange={e => onUpdate({ price: e.target.value })}
            />
          </div>

          {/* Usage limits */}
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Stream Limit (blank = unlimited)"
              type="number"
              placeholder="500,000"
              value={lic.streamLimit}
              onChange={e => onUpdate({ streamLimit: e.target.value })}
            />
            <FormInput
              label="Distribution Limit"
              type="number"
              placeholder="2,500"
              value={lic.distributionLimit}
              onChange={e => onUpdate({ distributionLimit: e.target.value })}
            />
          </div>

          {/* Included file formats */}
          <div>
            <p className="text-xs font-semibold text-[color:var(--text-secondary)] mb-2 flex items-center gap-1.5">
              <FileAudio size={12} /> Included File Formats
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {ALL_FILES.map(f => {
                const checked = lic.includedFiles.includes(f.key);
                return (
                  <label
                    key={f.key}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] border cursor-pointer transition-all ${checked ? "border-accent/40 bg-accent/5" : "border-[color:var(--border-subtle)] bg-input hover:border-[color:var(--border-default)]"}`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${checked ? "bg-accent border-accent" : "border-[color:var(--border-default)]"}`}>
                      {checked && <div className="w-2 h-2 bg-white rounded-[10px]" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground">{f.label}</p>
                      <p className="text-[10px] text-[color:var(--text-muted)] truncate">{f.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Rights */}
          <div>
            <p className="text-xs font-semibold text-[color:var(--text-secondary)] mb-2 flex items-center gap-1.5">
              <ShieldCheck size={12} /> Rights Granted
            </p>
            <div className="flex flex-col gap-1.5">
              {ALL_RIGHTS.map(r => {
                const checked = lic.grantedRights.includes(r.key);
                const tierColor = r.tier === "exclusive" ? "text-[color:var(--color-warning)]" : r.tier === "advanced" ? "text-accent-cyan" : "text-success";
                const tierBg = r.tier === "exclusive" ? "bg-[color:var(--color-warning)]/10" : r.tier === "advanced" ? "bg-accent-cyan/10" : "bg-success/10";
                return (
                  <label
                    key={r.key}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] border cursor-pointer transition-all ${checked ? "border-accent/30 bg-accent/5" : "border-[color:var(--border-subtle)] bg-input hover:border-[color:var(--border-default)]"}`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${checked ? "bg-accent border-accent" : "border-[color:var(--border-default)]"}`}>
                      {checked && <div className="w-2 h-2 bg-white rounded-sm" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground">{r.label}</p>
                      <p className="text-[10px] text-[color:var(--text-muted)]">{r.description}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[10px] capitalize shrink-0 ${tierBg} ${tierColor}`}>{r.tier}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        toggleRight(r.key);
                        if (r.key === "commercial_use") onUpdate({ commercialUse: !checked });
                      }}
                      className="hidden"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────

type FormTab = "basic" | "media" | "publishing" | "licensing";

export default function TrackFormModal({ open, track, onClose, onSave }: Props) {
  const [formTab, setFormTab] = useState<FormTab>("basic");
  const [form, setForm] = useState<ExtendedFormData>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof TrackFormData, string>>>({});


  useEffect(() => {
    if (open) { setForm(track ? trackToForm(track) : emptyForm()); setFormTab("basic"); setErrors({}); }
  }, [open, track?.id]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!open) return null;

  const set = <K extends keyof ExtendedFormData>(key: K, value: ExtendedFormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const updateLicense = (id: string, patch: Partial<LicenseDraftExtended>) =>
    set("licenses", form.licenses.map(l => l.id === id ? { ...l, ...patch } : l));

  const addLicense = () => set("licenses", [...form.licenses, newLicense()]);
  const removeLicense = (id: string) => set("licenses", form.licenses.filter(l => l.id !== id));

  const validate = () => {
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
    try { await onSave(form as unknown as TrackFormData, track?.id); onClose(); }
    finally { setSaving(false); }
  };

  const FORM_TABS: { key: FormTab; label: string }[] = [
    { key: "basic", label: "Basic Info" },
    { key: "media", label: "Media" },
    { key: "publishing", label: "Publishing" },
    { key: "licensing", label: `Licensing (${form.licenses.length})` },
  ];

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/65 z-[390] backdrop-blur-sm" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(680px,95vw)] max-h-[92vh] bg-surface border border-[#31386d] rounded-[20px] z-[400] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.6)]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border-subtle)] shrink-0">
          <div>
            <p className="text-[17px] font-bold text-foreground">{track ? "Edit Track" : "Upload New Track"}</p>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">{track ? `Editing: ${track.title}` : "Fill in the details then add license tiers"}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-[10px] border-0 bg-transparent cursor-pointer flex items-center justify-center text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Tab nav */}
        <div className="flex border-b border-[color:var(--border-subtle)] px-6 shrink-0">
          {FORM_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setFormTab(t.key)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-0 bg-transparent cursor-pointer transition-colors border-b-2 -mb-px ${formTab === t.key ? "text-accent border-accent" : "text-[color:var(--text-muted)] border-transparent hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* BASIC INFO */}
          {formTab === "basic" && (
            <div className="flex flex-col gap-4">
              <SectionTitle>Track Details</SectionTitle>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormInput
                  label="Track Title *"
                  placeholder="e.g. Midnight Bloom"
                  value={form.title}
                  onChange={e => set("title", e.target.value)}
                  error={errors.title}
                />
                <FormInput
                  label="Artist Name *"
                  placeholder="e.g. KXNG Nova"
                  value={form.artistName}
                  onChange={e => set("artistName", e.target.value)}
                  error={errors.artistName}
                />
              </div>

              <div>
                <Label>Description</Label>
                <textarea
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                  placeholder="Describe the vibe, energy, or intended use…"
                  rows={3}
                  className="w-full bg-input border border-[color:var(--border-subtle)] rounded-[10px] text-foreground text-sm font-inherit px-3 py-2.5 outline-none transition-colors focus:border-accent resize-none placeholder:text-[color:var(--text-muted)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <FormSelect label="Genre *" value={form.genre} onChange={v => set("genre", v as TrackGenre)}>
                  <option value="">Select genre</option>
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </FormSelect>
                <FormInput
                  label="BPM *"
                  type="number"
                  placeholder="140"
                  value={form.bpm}
                  onChange={e => set("bpm", e.target.value)}
                  error={errors.bpm}
                />
                <FormSelect label="Key" value={form.key} onChange={v => set("key", v as MusicalKey)}>
                  <option value="">Select key</option>
                  {KEYS.map(k => <option key={k} value={k}>{k}</option>)}
                </FormSelect>
                <FormInput
                  label="Duration (secs)"
                  type="number"
                  placeholder="180"
                  value={form.duration}
                  onChange={e => set("duration", e.target.value)}
                />
              </div>

              {/* Free-form mood tags */}
              <MoodTagInput moods={form.mood} onChange={v => set("mood", v)} />
            </div>
          )}

          {/* MEDIA */}
          {formTab === "media" && (
            <div className="flex flex-col gap-4">
              <SectionTitle>Media Assets</SectionTitle>
              {[
                { label: "MP3 File", accept: "audio/mpeg", desc: "Standard compressed audio, required for all licenses" },
                { label: "WAV File", accept: "audio/wav", desc: "Lossless master — included in Premium and above" },
                { label: "Stems / Trackout", accept: ".zip,.rar", desc: "ZIP of individual track layers — included in Unlimited and above" },
                { label: "MIDI File", accept: ".mid,.midi", desc: "Note data — typically bundled with Exclusive" },
                { label: "Project File (.flp, .als, etc.)", accept: ".flp,.als,.logic", desc: "DAW session — optional Exclusive add-on" },
                { label: "Preview Clip (30s)", accept: "audio/*", desc: "Short playable watermarked preview" },
                { label: "Cover Image", accept: "image/*", desc: "1:1 ratio, minimum 1000×1000px" },
              ].map(field => (
                <div key={field.label}>
                  <Label>{field.label}</Label>
                  <div className="border-2 border-dashed border-[color:var(--border-subtle)] rounded-[10px] p-6 text-center cursor-pointer transition-colors hover:border-accent hover:bg-accent/5 bg-input">
                    <Upload size={18} className="text-[color:var(--text-muted)] mx-auto mb-2" />
                    <p className="text-sm text-[color:var(--text-secondary)] mb-1">Drop file here or click to browse</p>
                    <p className="text-[11px] text-[color:var(--text-muted)]">{field.desc}</p>
                    <input type="file" accept={field.accept} className="hidden" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PUBLISHING */}
          {formTab === "publishing" && (
            <div className="flex flex-col gap-4">
              <SectionTitle>Publishing Settings</SectionTitle>
              <div className="bg-input border border-[color:var(--border-subtle)] rounded-[10px] overflow-hidden">
                {[
                  {
                    label: "Status", desc: "Control track visibility on the storefront",
                    control: (
                      <div className="flex gap-1.5">
                        {(["draft", "published"] as const).map(s => (
                          <button
                            key={s}
                            onClick={() => set("status", s)}
                            className={`px-3.5 py-1.5 rounded-[10px] border-0 cursor-pointer text-xs font-semibold transition-all ${form.status === s ? (s === "published" ? "bg-success/15 text-success border border-success/30" : "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)] border border-[color:var(--color-warning)]/30") : "bg-transparent text-[color:var(--text-muted)] border border-transparent hover:border-[color:var(--border-subtle)]"}`}
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      </div>
                    ),
                  },
                  {
                    label: "Featured", desc: "Highlight this track on the storefront homepage",
                    control: (
                      <button
                        onClick={() => set("isFeatured", !form.isFeatured)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] border-0 cursor-pointer text-xs font-semibold transition-all ${form.isFeatured ? "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)] border border-[color:var(--color-warning)]/30" : "bg-transparent text-[color:var(--text-muted)] border border-[color:var(--border-subtle)] hover:border-[color:var(--border-default)]"}`}
                      >
                        <Star size={12} fill={form.isFeatured ? "currentColor" : "none"} />
                        {form.isFeatured ? "Featured" : "Not Featured"}
                      </button>
                    ),
                  },
                ].map((row, i, arr) => (
                  <div key={row.label} className={`flex items-center justify-between px-4 py-4 ${i < arr.length - 1 ? "border-b border-[#1a2038]" : ""}`}>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{row.label}</p>
                      <p className="text-xs text-[color:var(--text-muted)]">{row.desc}</p>
                    </div>
                    {row.control}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LICENSING */}
          {formTab === "licensing" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <SectionTitle>License Tiers</SectionTitle>
              </div>

              <div className="bg-accent/5 border border-accent/20 rounded-[10px] px-4 py-3 text-xs text-[color:var(--text-secondary)] leading-relaxed">
                Each tier defines what the buyer receives (file formats) and what theyre allowed to do (rights). Use presets to start fast, then customise.
              </div>

              <div className="flex flex-col gap-3">
                {form.licenses.map((lic, i) => (
                  <LicenseCard
                    key={lic.id}
                    lic={lic}
                    index={i}
                    total={form.licenses.length}
                    onUpdate={patch => updateLicense(lic.id, patch)}
                    onRemove={() => removeLicense(lic.id)}
                  />
                ))}
              </div>

              <button
                onClick={addLicense}
                className="flex items-center justify-center gap-2 py-3 rounded-[10px] border-2 border-dashed border-[#31386d] bg-transparent text-[color:var(--text-muted)] text-sm font-semibold cursor-pointer transition-colors hover:border-accent hover:text-accent"
              >
                <Plus size={14} /> Add License Tier
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[color:var(--border-subtle)] shrink-0">
          <div className="flex gap-1">
            {FORM_TABS.map((t, i) => (
              <button
                key={t.key}
                onClick={() => setFormTab(t.key)}
                className={`w-1.5 h-1.5 rounded-[10px] transition-all cursor-pointer border-0 ${formTab === t.key ? "bg-accent w-4" : "bg-[color:var(--border-default)]"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              onClick={onClose}
              variant="secondary"
            >

              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              variant="primary"
              disabled={saving}
            >

              {saving ? "Saving…" : track ? "Save Changes" : "Upload Track"}
            </Button>

          </div>
        </div>
      </div>
    </>
  );
}
