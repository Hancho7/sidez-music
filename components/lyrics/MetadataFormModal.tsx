// components/lyrics/MetadataFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import type {
  TrackMetadata, Language, CreditRole, LyricsStatus,
  CreditFormData, CopyrightFormData, PublishingFormData,
} from "@/services/lyrics/types";
import { LANGUAGES, CREDIT_ROLES, TERRITORIES } from "@/services/lyrics/mock-data";
import RichTextEditor from "./RichTextEditor";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/TextArea";
import { ModalClose, SectionTitle, ModalFooter } from "@/components/ui/ModalPrimitives";

interface CreditDraft extends CreditFormData {
  id: string;
  trackId?: string;
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

interface Props {
  open: boolean;
  metadata: TrackMetadata | null;
  onClose: () => void;
  onSave: (data: FormState, id?: string) => Promise<void>;
}

const STATUS_OPTIONS: { value: LyricsStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "PARTIAL", label: "Partial" },
  { value: "COMPLETE", label: "Complete" },
];

const EMPTY_COPYRIGHT: CopyrightFormData = {
  copyrightOwner: "", copyrightNotice: "", publishingRights: "", mechanicalRights: "",
  territory: ["Worldwide"], publishingOrganization: "", isrc: "", upc: "",
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

function buildForm(m: TrackMetadata | null): FormState {
  if (!m) {
    return {
      trackId: "", trackName: "", artistName: "", language: "en" as Language,
      lyrics: "", status: "PENDING", credits: [],
      copyright: { ...EMPTY_COPYRIGHT },
      publishing: { ...EMPTY_PUBLISHING },
    };
  }
  return {
    trackId: m.trackId, trackName: m.trackName, artistName: m.artistName,
    language: m.lyrics.language, lyrics: m.lyrics.lyrics || "", status: m.status,
    credits: m.credits.map(c => ({ ...c, id: c.id || `temp_${Date.now()}_${Math.random()}` })),
    copyright: { ...EMPTY_COPYRIGHT, ...m.copyright },
    publishing: { ...EMPTY_PUBLISHING, ...m.publishing },
  };
}

type TabKey = "basic" | "credits" | "copyright" | "publishing";

export default function MetadataFormModal({ open, metadata, onClose, onSave }: Props) {
  const [form, setForm] = useState<FormState>(() => buildForm(metadata));
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("basic");

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (open) { setForm(buildForm(metadata)); setActiveTab("basic"); } }, [open, metadata]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!open) return null;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  const addCredit = () => {
    set("credits", [...form.credits, { id: `temp_${Date.now()}`, role: "WRITER" as CreditRole, personName: "", isPrimary: false }]);
  };
  const removeCredit = (id: string) => set("credits", form.credits.filter(c => c.id !== id));
  const updateCredit = (id: string, key: keyof CreditDraft, value: CreditDraft[keyof CreditDraft]) =>
    set("credits", form.credits.map(c => c.id === id ? { ...c, [key]: value } : c));

  const handleSubmit = async () => {
    setSaving(true);
    try { await onSave(form, metadata?.id); onClose(); }
    finally { setSaving(false); }
  };

  const TABS: { key: TabKey; label: string }[] = [
    { key: "basic", label: "Basic" },
    { key: "credits", label: "Credits" },
    { key: "copyright", label: "Copyright" },
    { key: "publishing", label: "Publishing" },
  ];

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/65 z-[390] backdrop-blur-sm" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(720px,95vw)] max-h-[92vh] bg-surface border border-[#31386d] rounded-[20px] z-[400] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.6)]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border-subtle)] shrink-0">
          <div>
            <p className="text-[17px] font-bold text-foreground">{metadata ? "Edit Metadata" : "Create Metadata"}</p>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">{metadata ? `Editing "${metadata.trackName}"` : "Add metadata to a track"}</p>
          </div>
          <ModalClose onClose={onClose} />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[color:var(--border-subtle)] px-6 shrink-0 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap border-0 bg-transparent cursor-pointer transition-colors border-b-2 -mb-px ${activeTab === t.key ? "text-accent border-accent" : "text-[color:var(--text-muted)] border-transparent hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">

          {/* BASIC */}
          {activeTab === "basic" && (
            <>
              <SectionTitle>Track Information</SectionTitle>
              <Input label="Track Name *" placeholder="e.g. Midnight Bloom" value={form.trackName} onChange={e => set("trackName", e.target.value)} />
              <Input label="Artist Name *" placeholder="e.g. Aura Keys" value={form.artistName} onChange={e => set("artistName", e.target.value)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Select label="Language" value={form.language} onChange={v => set("language", v as Language)}>
                  {LANGUAGES.map(l => <option key={l.value} value={l.value} className="bg-surface">{l.label}</option>)}
                </Select>
                <Select label="Status" value={form.status} onChange={v => set("status", v as LyricsStatus)}>
                  {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value} className="bg-surface">{s.label}</option>)}
                </Select>
              </div>
              <SectionTitle>Lyrics</SectionTitle>
              <RichTextEditor value={form.lyrics} onChange={v => set("lyrics", v)} placeholder="Paste or write lyrics here..." />
            </>
          )}

          {/* CREDITS */}
          {activeTab === "credits" && (
            <>
              <SectionTitle>Credits</SectionTitle>
              {form.credits.map(credit => (
                <div key={credit.id} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-3 flex flex-col md:flex-row gap-3">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Select label="Role" value={credit.role} onChange={v => updateCredit(credit.id, "role", v as CreditRole)}>
                      {CREDIT_ROLES.map(r => <option key={r.value} value={r.value} className="bg-surface">{r.label}</option>)}
                    </Select>
                    <Input label="Person Name" placeholder="e.g. John Doe" value={credit.personName} onChange={e => updateCredit(credit.id, "personName", e.target.value)} />
                  </div>
                  <div className="flex items-end gap-2 pb-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={credit.isPrimary ?? false} onChange={e => updateCredit(credit.id, "isPrimary", e.target.checked)} className="accent-accent w-3.5 h-3.5 cursor-pointer" />
                      <span className="text-[10px] text-[color:var(--text-secondary)]">Primary</span>
                    </label>
                    {form.credits.length > 1 && (
                      <button onClick={() => removeCredit(credit.id)} className="text-danger hover:text-danger/80 transition-colors p-1 bg-transparent border-0 cursor-pointer">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <Button variant="dashed" icon={<Plus size={14} />} onClick={addCredit}>Add Credit</Button>
            </>
          )}

          {/* COPYRIGHT */}
          {activeTab === "copyright" && (
            <>
              <SectionTitle>Copyright Information</SectionTitle>
              <Input label="Copyright Owner *" placeholder="e.g. KXNG Nova" value={form.copyright?.copyrightOwner || ""} onChange={e => set("copyright", { ...form.copyright, copyrightOwner: e.target.value })} />
              <Input label="Copyright Notice *" placeholder="e.g. © 2024 KXNG Nova. All Rights Reserved." value={form.copyright?.copyrightNotice || ""} onChange={e => set("copyright", { ...form.copyright, copyrightNotice: e.target.value })} />
              <Input label="Publishing Rights" placeholder="e.g. Worldwide, all media" value={form.copyright?.publishingRights || ""} onChange={e => set("copyright", { ...form.copyright, publishingRights: e.target.value })} />
              <Input label="Mechanical Rights" placeholder="e.g. Standard mechanical rights granted" value={form.copyright?.mechanicalRights || ""} onChange={e => set("copyright", { ...form.copyright, mechanicalRights: e.target.value })} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="ISRC" placeholder="e.g. US-01-0001-01" value={form.copyright?.isrc || ""} onChange={e => set("copyright", { ...form.copyright, isrc: e.target.value })} />
                <Input label="UPC (optional)" placeholder="e.g. 192641000101" value={form.copyright?.upc || ""} onChange={e => set("copyright", { ...form.copyright, upc: e.target.value })} />
              </div>
              <Input label="Publishing Organization" placeholder="e.g. BMI / ASCAP" value={form.copyright?.publishingOrganization || ""} onChange={e => set("copyright", { ...form.copyright, publishingOrganization: e.target.value })} />
              <div>
                <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">Territory</label>
                <div className="flex flex-wrap gap-1.5">
                  {TERRITORIES.map(t => (
                    <button
                      key={t}
                      onClick={() => {
                        const current = form.copyright?.territory || [];
                        set("copyright", { ...form.copyright, territory: current.includes(t) ? current.filter(x => x !== t) : [...current, t] });
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer transition-all ${(form.copyright?.territory || []).includes(t) ? "bg-accent/20 text-accent outline outline-1 outline-accent/40" : "bg-[color:var(--bg-input)] text-[color:var(--text-muted)] outline outline-1 outline-[color:var(--border-subtle)] hover:outline-[color:var(--border-default)]"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* PUBLISHING */}
          {activeTab === "publishing" && (
            <>
              <SectionTitle>Publishing Settings</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Release Date" type="date" value={form.publishing?.releaseDate || ""} onChange={e => set("publishing", { ...form.publishing, releaseDate: e.target.value })} />
                <Input label="Original Release Date" type="date" value={form.publishing?.originalReleaseDate || ""} onChange={e => set("publishing", { ...form.publishing, originalReleaseDate: e.target.value })} />
              </div>
              <div className="flex flex-wrap gap-4 py-2">
                {(["isVisible", "isExplicit", "isFeatured"] as const satisfies readonly (keyof PublishingFormData)[]).map((k) => {
                  const labelMap: Record<typeof k, string> = { isVisible: "Visible", isExplicit: "Explicit", isFeatured: "Featured" };
                  return (
                    <label key={k} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={!!form.publishing?.[k]} onChange={e => set("publishing", { ...form.publishing, [k]: e.target.checked })} className="accent-accent w-4 h-4 cursor-pointer" />
                      <span className="text-sm text-[color:var(--text-secondary)]">{labelMap[k]}</span>
                    </label>
                  );
                })}
              </div>
              <Textarea label="Editorial Notes" placeholder="Add editorial notes about this track..." value={form.publishing?.editorialNotes || ""} onChange={e => set("publishing", { ...form.publishing, editorialNotes: e.target.value })} rows={3} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Preview Start (seconds)" type="number" value={String(form.publishing?.previewStartTime ?? 30)} onChange={e => set("publishing", { ...form.publishing, previewStartTime: parseInt(e.target.value) || 0 })} />
                <Input label="Preview Duration (seconds)" type="number" value={String(form.publishing?.previewDuration ?? 30)} onChange={e => set("publishing", { ...form.publishing, previewDuration: parseInt(e.target.value) || 0 })} />
              </div>
            </>
          )}
        </div>

        <ModalFooter
          onClose={onClose}
          onSave={handleSubmit}
          saving={saving}
          saveLabel={metadata ? "Save Changes" : "Create Metadata"}
        />
      </div>
    </>
  );
}
