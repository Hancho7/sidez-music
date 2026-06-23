// components/collections/CollectionFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { X, Search, GripVertical, Plus, Minus, ImagePlus, Star } from "lucide-react";
import type { CollectionFormValues, AvailableTrack, CollectionStatus } from "@/services/collections/types";
import { MOCK_AVAILABLE_TRACKS, MOCK_COLLECTION_DETAILS } from "@/services/collections/mock-data";
import type { Collection } from "@/services/collections/types";
import Button from "@/components/ui/Button";

interface CollectionFormModalProps {
  open: boolean;
  editingId: string | null;
  collections: Collection[];
  onClose: () => void;
  onSave: (values: CollectionFormValues, id?: string) => void;
}

const EMPTY: CollectionFormValues = {
  title: "", description: "", coverImage: null,
  status: "DRAFT", isFeatured: false, trackIds: [],
};

export default function CollectionFormModal({ open, editingId, collections, onClose, onSave }: CollectionFormModalProps) {
  const [form, setForm] = useState<CollectionFormValues>(EMPTY);
  const [search, setSearch] = useState("");
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const isEdit = !!editingId;

  useEffect(() => {
    if (!open) return;
    if (editingId) {
      const detail = MOCK_COLLECTION_DETAILS[editingId];
      if (detail) {
        const ids = detail.tracks.map(t => t.trackId);
        setForm({
          title: detail.title, description: detail.description,
          coverImage: detail.coverImage, status: detail.status,
          isFeatured: detail.isFeatured, trackIds: ids,
        });
        setOrderedIds(ids);
      }
    } else {
      setForm(EMPTY);
      setOrderedIds([]);
    }
    setSearch("");
  }, [open, editingId]);

  const set = <K extends keyof CollectionFormValues>(k: K, v: CollectionFormValues[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const toggleTrack = (id: string) => {
    const next = orderedIds.includes(id) ? orderedIds.filter(x => x !== id) : [...orderedIds, id];
    setOrderedIds(next);
    set("trackIds", next);
  };

  const filteredTracks = MOCK_AVAILABLE_TRACKS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.artist.toLowerCase().includes(search.toLowerCase()) ||
    t.genre.toLowerCase().includes(search.toLowerCase())
  );

  const selectedTracks = orderedIds
    .map(id => MOCK_AVAILABLE_TRACKS.find(t => t.id === id))
    .filter(Boolean) as AvailableTrack[];

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    onSave({ ...form, trackIds: orderedIds }, editingId ?? undefined);
    setSaving(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="modal-bg"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[500] backdrop-blur-sm"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(680px,95vw)] max-h-[90vh] bg-surface border border-[color:var(--border-subtle)] rounded-[16px] z-[501] flex flex-col overflow-hidden"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border-subtle)] flex-shrink-0">
              <h2 className="text-[17px] font-bold text-foreground m-0 tracking-[-0.02em]">
                {isEdit ? "Edit Collection" : "Create Collection"}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center bg-elevated border border-[color:var(--border-subtle)] rounded-lg cursor-pointer text-[color:var(--text-muted)] hover:text-foreground transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">

              {/* ── Basic Info ── */}
              <Section label="Basic Info">
                <Label>Collection Title *</Label>
                <Input
                  placeholder="e.g. Summer Trap Pack"
                  value={form.title}
                  onChange={v => set("title", v)}
                />

                <Label className="mt-3.5">Description</Label>
                <textarea
                  placeholder="Describe this collection..."
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                  rows={3}
                  className="w-full bg-input border border-[color:var(--border-subtle)] rounded-lg px-3.5 py-2.5 text-sm text-foreground outline-none resize-y font-inherit leading-relaxed focus:border-accent transition-colors placeholder:text-[color:var(--text-muted)]"
                />

                {/* Cover image placeholder */}
                <Label className="mt-3.5">Cover Image</Label>
                <div className="w-full aspect-[16/7] bg-input border-2 border-dashed border-[color:var(--border-subtle)] rounded-lg flex flex-col items-center justify-center cursor-pointer gap-2 transition-colors duration-150 hover:border-accent">
                  {form.coverImage ? (
                    <img src={form.coverImage} alt="cover" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <>
                      <ImagePlus size={24} className="text-[#31386d]" />
                      <span className="text-xs text-[color:var(--text-muted)]">Click to upload cover image</span>
                    </>
                  )}
                </div>
              </Section>

              {/* ── Track Selector ── */}
              <Section label="Tracks" className="mt-6">
                <Input
                  placeholder="Search tracks by title, artist, genre..."
                  value={search}
                  onChange={setSearch}
                  icon={<Search size={14} className="text-[color:var(--text-muted)]" />}
                />

                {/* Available tracks list */}
                <div className="mt-2.5 max-h-[220px] overflow-y-auto flex flex-col gap-1 scrollbar-thin scrollbar-thumb-accent/20">
                  {filteredTracks.map(t => {
                    const selected = orderedIds.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        onClick={() => toggleTrack(t.id)}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-left transition-all duration-150
                          ${selected
                            ? "bg-accent/12 border border-accent/30"
                            : "border border-transparent hover:bg-elevated"
                          }`}
                      >
                        <img src={t.coverImage} alt={t.title} className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-foreground truncate">{t.title}</div>
                          <div className="text-[11px] text-[color:var(--text-muted)]">{t.artist} · {t.genre} · {t.duration}</div>
                        </div>
                        <div className={`w-5.5 h-5.5 rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-150
                          ${selected
                            ? "bg-accent border border-accent text-white"
                            : "bg-elevated border border-[#31386d] text-[color:var(--text-muted)]"
                          }`}>
                          {selected ? <Minus size={11} /> : <Plus size={11} />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected / reorder zone */}
                {selectedTracks.length > 0 && (
                  <div className="mt-4">
                    <div className="text-[11px] font-semibold text-[color:var(--text-muted)] uppercase tracking-[0.06em] mb-2">
                      Order ({selectedTracks.length} selected — drag to reorder)
                    </div>
                    <Reorder.Group
                      axis="y"
                      values={orderedIds}
                      onReorder={ids => { setOrderedIds(ids); set("trackIds", ids); }}
                      className="flex flex-col gap-1 list-none p-0"
                    >
                      {selectedTracks.map((t, i) => (
                        <Reorder.Item
                          key={t.id}
                          value={t.id}
                          className="flex items-center gap-2 px-2.5 py-2 bg-elevated border border-[color:var(--border-subtle)] rounded-lg cursor-grab select-none"
                        >
                          <GripVertical size={14} className="text-[#31386d] flex-shrink-0" />
                          <span className="text-[11px] text-[#31386d] w-[18px] text-center">{i + 1}</span>
                          <img src={t.coverImage} alt={t.title} className="w-7 h-7 rounded-md object-cover" />
                          <span className="text-sm text-foreground font-medium flex-1">{t.title}</span>
                          <span className="text-[11px] text-[color:var(--text-muted)]">{t.duration}</span>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </div>
                )}
              </Section>

              {/* ── Publishing ── */}
              <Section label="Publishing" className="mt-6">
                <div className="flex flex-col gap-3">
                  <Toggle
                    label="Status"
                    description="Make this collection visible to customers"
                    checked={form.status === "PUBLISHED"}
                    onChange={v => set("status", v ? "PUBLISHED" : "DRAFT")}
                    activeLabel="Published"
                    inactiveLabel="Draft"
                  />
                  <Toggle
                    label="Featured"
                    description="Show this collection on marketing pages"
                    checked={form.isFeatured}
                    onChange={v => set("isFeatured", v)}
                    icon={<Star size={12} fill={form.isFeatured ? "#a855f7" : "none"} className="text-accent" />}
                  />
                </div>
              </Section>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[color:var(--border-subtle)] flex-shrink-0">
              <Button
                onClick={onClose}
                variant="secondary"
                size="md"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!form.title.trim() || saving}
                variant="primary"
                size="md"
                loading={saving}
              >
                {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Collection"}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Shared sub-components ── */
function Section({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="text-[11px] font-bold text-[color:var(--text-muted)] uppercase tracking-[0.07em] mb-3">{label}</div>
      <div className="bg-[#0d0f1c] border border-[color:var(--border-subtle)] rounded-xl p-4">
        {children}
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-xs font-semibold text-[color:var(--text-secondary)] mb-1.5 ${className || ""}`}>{children}</div>;
}

function Input({ placeholder, value, onChange, icon }: { placeholder: string; value: string; onChange: (v: string) => void; icon?: React.ReactNode }) {
  return (
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</div>}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full bg-input border border-[color:var(--border-subtle)] rounded-lg text-sm text-foreground outline-none font-inherit transition-colors duration-150 focus:border-accent placeholder:text-[color:var(--text-muted)]
          ${icon ? "pl-8 pr-3 py-2.5" : "px-3 py-2.5"}`}
      />
    </div>
  );
}

function Toggle({ label, description, checked, onChange, activeLabel, inactiveLabel, icon }: {
  label: string; description: string; checked: boolean;
  onChange: (v: boolean) => void;
  activeLabel?: string; inactiveLabel?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          {icon} {label}
        </div>
        <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{description}</div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {(activeLabel || inactiveLabel) && (
          <span className={`text-xs ${checked ? "text-success" : "text-[color:var(--color-warning)]"}`}>
            {checked ? activeLabel : inactiveLabel}
          </span>
        )}
        <button
          onClick={() => onChange(!checked)}
          className={`w-10 h-5.5 rounded-full border-0 cursor-pointer relative transition-colors duration-200
            ${checked ? "bg-accent" : "bg-[color:var(--border-subtle)]"}`}
        >
          <span className={`absolute top-[3px] w-4 h-4 rounded-full bg-white transition-all duration-200
            ${checked ? "left-[20px]" : "left-[3px]"}`} />
        </button>
      </div>
    </div>
  );
}
