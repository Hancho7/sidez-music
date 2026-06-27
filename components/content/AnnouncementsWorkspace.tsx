// components/content/AnnouncementsWorkspace.tsx
"use client";

import { useState } from "react";
import { Plus, Pencil, Archive, Eye, EyeOff, Megaphone, ChevronDown, X } from "lucide-react";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";
import type { Announcement, AnnouncementPriority, AnnouncementAudience } from "@/services/content/types";
import Button from "@/components/ui/Button";

interface Props {
  announcements: Announcement[];
  onChange: (announcements: Announcement[]) => void;
}

const PRIORITY_CLASSES: Record<AnnouncementPriority, string> = {
  high: "bg-danger/10 text-danger",
  medium: "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]",
  low: "bg-elevated text-[color:var(--text-muted)]",
};

const AUDIENCE_LABEL: Record<AnnouncementAudience, string> = {
  all: "All Users",
  logged_in: "Logged In",
  guests: "Guests",
  vip: "VIP",
};

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isActive(ann: Announcement) {
  if (!ann.published) return false;
  const now = Date.now();
  const start = ann.startsAt ? new Date(ann.startsAt).getTime() : 0;
  const end = ann.endsAt ? new Date(ann.endsAt).getTime() : Infinity;
  return now >= start && now <= end;
}

function emptyAnn(): Omit<Announcement, "id" | "createdAt"> {
  return { title: "", message: "", audience: "all", priority: "medium", bannerColor: "#7c3aed", ctaLabel: "", ctaUrl: "", published: false, startsAt: null, endsAt: null };
}

export default function AnnouncementsWorkspace({ announcements, onChange }: Props) {
  const { hoveredId, setHoveredId } = useHoveredRow();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyAnn());

  const openCreate = () => { setEditingId("new"); setForm(emptyAnn()); };
  const openEdit = (a: Announcement) => { setEditingId(a.id); setForm({ title: a.title, message: a.message, audience: a.audience, priority: a.priority, bannerColor: a.bannerColor, ctaLabel: a.ctaLabel, ctaUrl: a.ctaUrl, published: a.published, startsAt: a.startsAt, endsAt: a.endsAt }); };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editingId === "new") onChange([...announcements, { ...form, id: `ann-${Date.now()}`, createdAt: new Date().toISOString() }]);
    else onChange(announcements.map(a => a.id === editingId ? { ...a, ...form } : a));
    setEditingId(null);
  };

  const togglePublished = (id: string) => onChange(announcements.map(a => a.id === id ? { ...a, published: !a.published } : a));
  const handleArchive = (id: string) => onChange(announcements.filter(a => a.id !== id));

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[color:var(--text-muted)]">{announcements.length} announcement{announcements.length !== 1 ? "s" : ""} · {announcements.filter(a => isActive(a)).length} active</p>
        <Button variant="primary" size="md" icon={<Plus size={14} />} onClick={openCreate}>New Announcement</Button>
      </div>

      {/* Create/Edit form */}
      {editingId && (
        <div className="bg-[color:var(--bg-input)] border border-accent/30 rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-accent uppercase tracking-wide">{editingId === "new" ? "New Announcement" : "Edit Announcement"}</p>
            <button onClick={() => setEditingId(null)} className="w-7 h-7 flex items-center justify-center bg-transparent border-0 text-[color:var(--text-muted)] cursor-pointer hover:text-foreground"><X size={14} /></button>
          </div>
          <div>
            <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">Title *</label>
            <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Black Friday Sale — 40% Off" className="w-full bg-surface border border-[color:var(--border-subtle)] rounded-lg text-sm text-foreground font-inherit px-3 py-2.5 outline-none focus:border-accent placeholder:text-[color:var(--text-muted)]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">Message *</label>
            <textarea value={form.message} onChange={e => set("message", e.target.value)} rows={2} placeholder="Description shown to users..." className="w-full bg-surface border border-[color:var(--border-subtle)] rounded-lg text-sm text-foreground font-inherit px-3 py-2.5 outline-none focus:border-accent resize-none leading-relaxed placeholder:text-[color:var(--text-muted)]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Audience", field: "audience" as const, options: [["all", "All Users"], ["logged_in", "Logged In"], ["guests", "Guests"], ["vip", "VIP"]] },
              { label: "Priority", field: "priority" as const, options: [["high", "High"], ["medium", "Medium"], ["low", "Low"]] },
            ].map(({ label, field, options }) => (
              <div key={field}>
                <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">{label}</label>
                <div className="relative">
                  <select value={form[field] as string} onChange={e => set(field, e.target.value as never)} className="w-full bg-surface border border-[color:var(--border-subtle)] rounded-lg text-sm text-foreground font-inherit px-3 py-2.5 pr-8 outline-none focus:border-accent appearance-none cursor-pointer [&>option]:bg-surface">
                    {options.map(([v, l]) => <option key={v} value={v} className="bg-surface">{l}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">Banner Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.bannerColor} onChange={e => set("bannerColor", e.target.value)} className="w-9 h-9 rounded-lg cursor-pointer border border-[color:var(--border-subtle)] bg-surface p-0.5" />
                <span className="text-xs font-mono text-[color:var(--text-muted)]">{form.bannerColor}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">CTA Label</label>
              <input value={form.ctaLabel} onChange={e => set("ctaLabel", e.target.value)} placeholder="Shop Now" className="w-full bg-surface border border-[color:var(--border-subtle)] rounded-lg text-sm text-foreground font-inherit px-3 py-2.5 outline-none focus:border-accent placeholder:text-[color:var(--text-muted)]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">CTA URL</label>
              <input value={form.ctaUrl} onChange={e => set("ctaUrl", e.target.value)} placeholder="/tracks" className="w-full bg-surface border border-[color:var(--border-subtle)] rounded-lg text-sm text-foreground font-inherit px-3 py-2.5 outline-none focus:border-accent placeholder:text-[color:var(--text-muted)]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">Start Date</label>
              <input type="date" value={form.startsAt ? form.startsAt.split("T")[0] : ""} onChange={e => set("startsAt", e.target.value || null)} className="w-full bg-surface border border-[color:var(--border-subtle)] rounded-lg text-sm text-foreground font-inherit px-3 py-2.5 outline-none focus:border-accent [color-scheme:dark]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">End Date</label>
              <input type="date" value={form.endsAt ? form.endsAt.split("T")[0] : ""} onChange={e => set("endsAt", e.target.value || null)} className="w-full bg-surface border border-[color:var(--border-subtle)] rounded-lg text-sm text-foreground font-inherit px-3 py-2.5 outline-none focus:border-accent [color-scheme:dark]" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={e => set("published", e.target.checked)} className="w-4 h-4 accent-accent cursor-pointer" />
            <span className="text-sm text-[color:var(--text-secondary)]">Publish immediately</span>
          </label>
          <div className="flex gap-2">
            <Button onClick={handleSave} variant="primary" size="md" className="flex-1">Save Announcement</Button>
            <Button onClick={() => setEditingId(null)} variant="secondary" size="md">Cancel</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <DataTable
        isEmpty={announcements.length === 0}
        emptyState={
          <DataTable.EmptyState
            icon={<Megaphone size={22} className="text-accent" />}
            title="No announcements"
            message="Create announcements for sales, new releases, and platform updates."
          />
        }
      >
        <DataTable.Header>
          <DataTable.Col>Announcement</DataTable.Col>
          <DataTable.Col>Audience</DataTable.Col>
          <DataTable.Col align="center">Priority</DataTable.Col>
          <DataTable.Col>Status</DataTable.Col>
          <DataTable.Col>Starts</DataTable.Col>
          <DataTable.Col>Ends</DataTable.Col>
          <DataTable.ActionsCol />
        </DataTable.Header>

        <DataTable.Body>
          {announcements.map(ann => {
            const isHovered = hoveredId === ann.id;
            const active = isActive(ann);
            return (
              <DataTable.Row key={ann.id} isHovered={isHovered} onHoverChange={h => setHoveredId(h ? ann.id : null)}>
                <DataTable.Cell>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-9 rounded-full shrink-0" style={{ background: ann.bannerColor }} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate max-w-[200px]">{ann.title}</p>
                      <p className="text-[11px] text-[color:var(--text-muted)] truncate max-w-[200px]">{ann.message}</p>
                    </div>
                  </div>
                </DataTable.Cell>
                <DataTable.Cell>
                  <span className="text-xs text-[color:var(--text-secondary)]">{AUDIENCE_LABEL[ann.audience]}</span>
                </DataTable.Cell>
                <DataTable.Cell align="center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${PRIORITY_CLASSES[ann.priority]}`}>{ann.priority}</span>
                </DataTable.Cell>
                <DataTable.Cell>
                  <DataTable.StatusBadge
                    label={active ? "Active" : ann.published ? "Scheduled" : "Draft"}
                    variant={active ? "success" : ann.published ? "cyan" : "warning"}
                  />
                </DataTable.Cell>
                <DataTable.Cell className="text-xs text-[color:var(--text-muted)] whitespace-nowrap">{fmtDate(ann.startsAt)}</DataTable.Cell>
                <DataTable.Cell className="text-xs text-[color:var(--text-muted)] whitespace-nowrap">{fmtDate(ann.endsAt)}</DataTable.Cell>
                <DataTable.ActionsCell visible={isHovered}>
                  <DataTable.ActionBtn onClick={() => openEdit(ann)} icon={<Pencil size={13} />} title="Edit" />
                  <DataTable.ActionBtn onClick={() => togglePublished(ann.id)} icon={ann.published ? <EyeOff size={13} /> : <Eye size={13} />} title={ann.published ? "Unpublish" : "Publish"} />
                  <DataTable.ActionBtn onClick={() => handleArchive(ann.id)} icon={<Archive size={13} />} title="Archive" danger />
                </DataTable.ActionsCell>
              </DataTable.Row>
            );
          })}
        </DataTable.Body>
      </DataTable>
    </div>
  );
}
