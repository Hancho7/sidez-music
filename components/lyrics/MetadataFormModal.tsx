// components/lyrics/MetadataFormModal.tsx

"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, ChevronDown } from "lucide-react";
import type { TrackMetadata, Language, CreditRole, LyricsStatus, CreditFormData, CopyrightFormData, PublishingFormData } from "@/services/lyrics/types";
import { LANGUAGES, CREDIT_ROLES, TERRITORIES } from "@/services/lyrics/mock-data";
import RichTextEditor from "./RichTextEditor";

// ── Local form shape ──────────────────────────────────────────────────────────

interface CreditDraft extends CreditFormData {
  id: string; // temporary client-side id for keying list items
}

interface FormState {
  trackId: string;
  trackName: string;
  artistName: string;
  language: Language;
  lyrics: string;
  status: LyricsStatus;
  credits: CreditDraft[];
  copyright: CopyrightFormData;
  publishing: PublishingFormData;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  metadata: TrackMetadata | null;
  onClose: () => void;
  onSave: (data: FormState, id?: string) => Promise<void>;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: LyricsStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "PARTIAL", label: "Partial" },
  { value: "COMPLETE", label: "Complete" },
];

const EMPTY_COPYRIGHT: CopyrightFormData = {
  copyrightOwner: "",
  copyrightNotice: "",
  publishingRights: "",
  mechanicalRights: "",
  territory: ["Worldwide"],
  publishingOrganization: "",
  isrc: "",
  upc: "",
};

const EMPTY_PUBLISHING: PublishingFormData = {
  releaseDate: new Date().toISOString().split("T")[0],
  originalReleaseDate: new Date().toISOString().split("T")[0],
  isVisible: true,
  isExplicit: false,
  isFeatured: false,
  editorialNotes: "",
  previewStartTime: 30,
  previewDuration: 30,
};

function buildForm(metadata: TrackMetadata | null): FormState {
  if (metadata) {
    return {
      trackId: metadata.trackId,
      trackName: metadata.trackName,
      artistName: metadata.artistName,
      language: metadata.lyrics.language,
      lyrics: metadata.lyrics.lyrics,
      status: metadata.status,
      credits: metadata.credits.map(c => ({ ...c })),
      copyright: { ...metadata.copyright },
      publishing: { ...metadata.publishing },
    };
  }
  return {
    trackId: "",
    trackName: "",
    artistName: "",
    language: "en",
    lyrics: "",
    status: "PENDING",
    credits: [],
    copyright: { ...EMPTY_COPYRIGHT },
    publishing: { ...EMPTY_PUBLISHING },
  };
}

// ── Small shared sub-components ───────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] border-b border-[color:var(--border-subtle)] pb-2.5 mb-4">
      {children}
    </div>
  );
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

// ── Main component ────────────────────────────────────────────────────────────

export default function MetadataFormModal({ open, metadata, onClose, onSave }: Props) {
  const [form, setForm] = useState<FormState>(() => buildForm(metadata));
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "credits" | "copyright" | "publishing">("basic");

  // Rebuild form whenever the modal opens or the editing target changes.
  useEffect(() => {
    if (open) {
      setForm(buildForm(metadata));
      setActiveTab("basic");
    }
  }, [open, metadata]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  // ── Typed field helpers ───────────────────────────────────────────────────

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  const addCredit = () => {
    const draft: CreditDraft = {
      id: `temp_${Date.now()}`,
      role: "WRITER",
      personName: "",
      isPrimary: false,
    };
    set("credits", [...form.credits, draft]);
  };

  const removeCredit = (id: string) => {
    set("credits", form.credits.filter(c => c.id !== id));
  };

  const updateCredit = (id: string, key: keyof CreditDraft, value: CreditDraft[keyof CreditDraft]) => {
    set("credits", form.credits.map(c => c.id === id ? { ...c, [key]: value } : c));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onSave(form, metadata?.id);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const tabs: { key: "basic" | "credits" | "copyright" | "publishing"; label: string }[] = [
    { key: "basic", label: "Basic" },
    { key: "credits", label: "Credits" },
    { key: "copyright", label: "Copyright" },
    { key: "publishing", label: "Publishing" },
  ];

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 z-[390] backdrop-blur-sm"
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(720px,95vw)] max-h-[92vh] bg-surface border border-[#31386d] rounded-[20px] z-[400] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border-subtle)] flex-shrink-0">
          <div>
            <div className="text-[17px] font-bold text-foreground">
              {metadata ? "Edit Metadata" : "Create Metadata"}
            </div>
            <div className="text-xs text-[color:var(--text-muted)] mt-0.5">
              {metadata ? `Editing "${metadata.trackName}"` : "Add metadata to a track"}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer flex items-center justify-center text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[color:var(--border-subtle)] px-6 flex-shrink-0 overflow-x-auto gap-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-0 bg-transparent cursor-pointer transition-colors border-b-2 -mb-px
                ${activeTab === t.key
                  ? "text-accent border-accent"
                  : "text-[color:var(--text-muted)] border-transparent hover:text-foreground"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">

            {/* BASIC TAB */}
            {activeTab === "basic" && (
              <>
                <SectionTitle>Track Information</SectionTitle>

                <FormInput
                  label="Track Name *"
                  placeholder="e.g. Midnight Bloom"
                  value={form.trackName}
                  onChange={e => set("trackName", e.target.value)}
                />

                <FormInput
                  label="Artist Name *"
                  placeholder="e.g. Aura Keys"
                  value={form.artistName}
                  onChange={e => set("artistName", e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormSelect label="Language" value={form.language} onChange={v => set("language", v as Language)}>
                    {LANGUAGES.map(l => <option key={l.value} value={l.value} className="bg-surface">{l.label}</option>)}
                  </FormSelect>
                  <FormSelect label="Status" value={form.status} onChange={v => set("status", v as LyricsStatus)}>
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value} className="bg-surface">{s.label}</option>)}
                  </FormSelect>
                </div>

                <SectionTitle>Lyrics</SectionTitle>

                <RichTextEditor
                  value={form.lyrics}
                  onChange={v => set("lyrics", v)}
                  placeholder="Paste or write lyrics here..."
                />
              </>
            )}

            {/* CREDITS TAB */}
            {activeTab === "credits" && (
              <>
                <SectionTitle>Credits</SectionTitle>

                {form.credits.map((credit) => (
                  <div key={credit.id} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg p-3 flex flex-col md:flex-row gap-3">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <FormSelect
                        label="Role"
                        value={credit.role}
                        onChange={v => updateCredit(credit.id, "role", v as CreditRole)}
                      >
                        {CREDIT_ROLES.map(r => <option key={r.value} value={r.value} className="bg-surface">{r.label}</option>)}
                      </FormSelect>
                      <FormInput
                        label="Person Name"
                        placeholder="e.g. John Doe"
                        value={credit.personName}
                        onChange={e => updateCredit(credit.id, "personName", e.target.value)}
                      />
                    </div>
                    <div className="flex items-end gap-2 pb-1">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={credit.isPrimary ?? false}
                          onChange={e => updateCredit(credit.id, "isPrimary", e.target.checked)}
                          className="accent-accent w-3.5 h-3.5 cursor-pointer"
                        />
                        <span className="text-[10px] text-[color:var(--text-secondary)]">Primary</span>
                      </label>
                      {form.credits.length > 1 && (
                        <button
                          onClick={() => removeCredit(credit.id)}
                          className="text-danger hover:text-danger/80 transition-colors p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  onClick={addCredit}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-[#31386d] bg-transparent text-[color:var(--text-muted)] text-sm font-semibold cursor-pointer transition-colors hover:border-accent hover:text-[color:var(--accent-magenta)]"
                >
                  <Plus size={14} />
                  Add Credit
                </button>
              </>
            )}

            {/* COPYRIGHT TAB */}
            {activeTab === "copyright" && (
              <>
                <SectionTitle>Copyright Information</SectionTitle>

                <FormInput
                  label="Copyright Owner *"
                  placeholder="e.g. KXNG Nova"
                  value={form.copyright?.copyrightOwner || ""}
                  onChange={e => set("copyright", { ...form.copyright, copyrightOwner: e.target.value })}
                />

                <FormInput
                  label="Copyright Notice *"
                  placeholder="e.g. © 2024 KXNG Nova. All Rights Reserved."
                  value={form.copyright?.copyrightNotice || ""}
                  onChange={e => set("copyright", { ...form.copyright, copyrightNotice: e.target.value })}
                />

                <FormInput
                  label="Publishing Rights"
                  placeholder="e.g. Worldwide, all media"
                  value={form.copyright?.publishingRights || ""}
                  onChange={e => set("copyright", { ...form.copyright, publishingRights: e.target.value })}
                />

                <FormInput
                  label="Mechanical Rights"
                  placeholder="e.g. Standard mechanical rights granted"
                  value={form.copyright?.mechanicalRights || ""}
                  onChange={e => set("copyright", { ...form.copyright, mechanicalRights: e.target.value })}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormInput
                    label="ISRC"
                    placeholder="e.g. US-01-0001-01"
                    value={form.copyright?.isrc || ""}
                    onChange={e => set("copyright", { ...form.copyright, isrc: e.target.value })}
                  />
                  <FormInput
                    label="UPC (optional)"
                    placeholder="e.g. 192641000101"
                    value={form.copyright?.upc || ""}
                    onChange={e => set("copyright", { ...form.copyright, upc: e.target.value })}
                  />
                </div>

                <FormInput
                  label="Publishing Organization"
                  placeholder="e.g. BMI / ASCAP"
                  value={form.copyright?.publishingOrganization || ""}
                  onChange={e => set("copyright", { ...form.copyright, publishingOrganization: e.target.value })}
                />

                <div>
                  <Label>Territory</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {TERRITORIES.map(t => (
                      <button
                        key={t}
                        onClick={() => {
                          const current = form.copyright?.territory || [];
                          const next = current.includes(t)
                            ? current.filter(x => x !== t)
                            : [...current, t];
                          set("copyright", { ...form.copyright, territory: next });
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer transition-all
                          ${(form.copyright?.territory || []).includes(t)
                            ? "bg-accent/20 text-accent outline outline-1 outline-accent/40"
                            : "bg-[color:var(--bg-input)] text-[color:var(--text-muted)] outline outline-1 outline-[color:var(--border-subtle)] hover:outline-[color:var(--border-default)]"
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* PUBLISHING TAB */}
            {activeTab === "publishing" && (
              <>
                <SectionTitle>Publishing Settings</SectionTitle>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormInput
                    label="Release Date"
                    type="date"
                    value={form.publishing?.releaseDate || ""}
                    onChange={e => set("publishing", { ...form.publishing, releaseDate: e.target.value })}
                  />
                  <FormInput
                    label="Original Release Date"
                    type="date"
                    value={form.publishing?.originalReleaseDate || ""}
                    onChange={e => set("publishing", { ...form.publishing, originalReleaseDate: e.target.value })}
                  />
                </div>

                <div className="flex flex-wrap gap-4 py-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.publishing?.isVisible || false}
                      onChange={e => set("publishing", { ...form.publishing, isVisible: e.target.checked })}
                      className="accent-accent w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-[color:var(--text-secondary)]">Visible</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.publishing?.isExplicit || false}
                      onChange={e => set("publishing", { ...form.publishing, isExplicit: e.target.checked })}
                      className="accent-accent w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-[color:var(--text-secondary)]">Explicit</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.publishing?.isFeatured || false}
                      onChange={e => set("publishing", { ...form.publishing, isFeatured: e.target.checked })}
                      className="accent-accent w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-[color:var(--text-secondary)]">Featured</span>
                  </label>
                </div>

                <div>
                  <Label>Editorial Notes</Label>
                  <textarea
                    value={form.publishing?.editorialNotes || ""}
                    onChange={e => set("publishing", { ...form.publishing, editorialNotes: e.target.value })}
                    placeholder="Add editorial notes about this track..."
                    rows={3}
                    className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none transition-colors focus:border-accent resize-y leading-relaxed placeholder:text-[color:var(--text-muted)]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormInput
                    label="Preview Start (seconds)"
                    type="number"
                    value={form.publishing?.previewStartTime || 30}
                    onChange={e => set("publishing", { ...form.publishing, previewStartTime: parseInt(e.target.value) || 0 })}
                  />
                  <FormInput
                    label="Preview Duration (seconds)"
                    type="number"
                    value={form.publishing?.previewDuration || 30}
                    onChange={e => set("publishing", { ...form.publishing, previewDuration: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </>
            )}

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
            className={`px-5 py-2.5 rounded-lg border-0 text-white text-sm font-semibold cursor-pointer transition-colors
              ${saving
                ? "bg-[#6d28d9] opacity-80 cursor-not-allowed"
                : "bg-accent hover:bg-[color:var(--accent-purple-hover)] hover:shadow-[var(--shadow-glow-purple)]"
              }`}
          >
            {saving ? "Saving..." : metadata ? "Save Changes" : "Create Metadata"}
          </button>
        </div>
      </div>
    </>
  );
}
