// components/content/FAQWorkspace.tsx
"use client";

import { useState } from "react";
import { GripVertical, Plus, Pencil, Trash2, Eye, EyeOff, ChevronDown } from "lucide-react";
import type { FAQ } from "@/services/content/types";
import Button from "@/components/ui/Button";

interface Props {
  faqs: FAQ[];
  onChange: (faqs: FAQ[]) => void;
}

const CATEGORIES = ["Licensing", "Downloads", "Payments", "Accounts", "General"];

function emptyFaq(): Omit<FAQ, "id" | "createdAt"> {
  return { question: "", answer: "", category: "General", displayOrder: 0, published: false };
}

export default function FAQWorkspace({ faqs, onChange }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyFaq());
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...faqs].sort((a, b) => a.displayOrder - b.displayOrder);

  const openEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setForm({ question: faq.question, answer: faq.answer, category: faq.category, displayOrder: faq.displayOrder, published: faq.published });
  };

  const openCreate = () => {
    setEditingId("new");
    setForm({ ...emptyFaq(), displayOrder: faqs.length + 1 });
  };

  const handleSave = () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    if (editingId === "new") {
      const newFaq: FAQ = { ...form, id: `faq-${Date.now()}`, createdAt: new Date().toISOString() };
      onChange([...faqs, newFaq]);
    } else {
      onChange(faqs.map(f => f.id === editingId ? { ...f, ...form } : f));
    }
    setEditingId(null);
  };

  const handleDelete = (id: string) => onChange(faqs.filter(f => f.id !== id));
  const togglePublished = (id: string) => onChange(faqs.map(f => f.id === id ? { ...f, published: !f.published } : f));

  const handleDrop = (i: number) => {
    if (dragIndex === null || dragIndex === i) { setDragIndex(null); setDragOver(null); return; }
    const next = [...sorted];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(i, 0, moved);
    onChange(next.map((f, idx) => ({ ...f, displayOrder: idx + 1 })));
    setDragIndex(null); setDragOver(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[color:var(--text-muted)]">{faqs.length} FAQ{faqs.length !== 1 ? "s" : ""} · {faqs.filter(f => f.published).length} published</p>
        <Button variant="primary" size="md" icon={<Plus size={14} />} onClick={openCreate}>Add FAQ</Button>
      </div>

      {/* Create / Edit form */}
      {editingId && (
        <div className="bg-[color:var(--bg-input)] border border-accent/30 rounded-xl p-5 flex flex-col gap-3">
          <p className="text-xs font-semibold text-accent uppercase tracking-wide">{editingId === "new" ? "New FAQ" : "Edit FAQ"}</p>
          <div>
            <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">Question *</label>
            <input
              value={form.question}
              onChange={e => setForm(p => ({ ...p, question: e.target.value }))}
              placeholder="What is a non-exclusive license?"
              className="w-full bg-surface border border-[color:var(--border-subtle)] rounded-lg text-sm text-foreground font-inherit px-3 py-2.5 outline-none focus:border-accent transition-colors placeholder:text-[color:var(--text-muted)]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">Answer *</label>
            <textarea
              value={form.answer}
              onChange={e => setForm(p => ({ ...p, answer: e.target.value }))}
              rows={3}
              placeholder="A non-exclusive license allows..."
              className="w-full bg-surface border border-[color:var(--border-subtle)] rounded-lg text-sm text-foreground font-inherit px-3 py-2.5 outline-none focus:border-accent resize-y leading-relaxed placeholder:text-[color:var(--text-muted)]"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">Category</label>
              <div className="relative">
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-surface border border-[color:var(--border-subtle)] rounded-lg text-sm text-foreground font-inherit px-3 py-2.5 pr-8 outline-none focus:border-accent appearance-none cursor-pointer [&>option]:bg-surface">
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-surface">{c}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] pointer-events-none" />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-auto mb-0.5">
              <input type="checkbox" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} className="w-4 h-4 accent-accent cursor-pointer" />
              <span className="text-sm text-[color:var(--text-secondary)]">Published</span>
            </label>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} variant="primary" size="md" className="flex-1">Save FAQ</Button>
            <Button onClick={() => setEditingId(null)} variant="secondary" size="md">Cancel</Button>
          </div>
        </div>
      )}

      {/* FAQ list */}
      {sorted.length === 0 ? (
        <div className="bg-surface border border-[color:var(--border-subtle)] rounded-2xl py-16 text-center">
          <p className="text-base font-bold text-foreground mb-1">No FAQs yet</p>
          <p className="text-sm text-[color:var(--text-muted)]">Add your first frequently asked question.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sorted.map((faq, i) => (
            <div
              key={faq.id}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={e => { e.preventDefault(); setDragOver(i); }}
              onDrop={() => handleDrop(i)}
              onDragEnd={() => { setDragIndex(null); setDragOver(null); }}
              className={[
                "bg-surface border rounded-xl transition-all",
                dragIndex === i ? "opacity-40" : "",
                dragOver === i && dragIndex !== i ? "border-accent/60" : "border-[color:var(--border-subtle)]",
              ].join(" ")}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <GripVertical size={14} className="text-[color:var(--text-muted)] shrink-0 cursor-grab" />
                <span className="text-[11px] font-mono text-[color:var(--text-muted)] w-5 text-center shrink-0">{i + 1}</span>
                <button onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)} className="flex-1 text-left">
                  <p className="text-sm font-semibold text-foreground">{faq.question}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-semibold text-[color:var(--text-muted)] bg-elevated px-1.5 py-0.5 rounded">{faq.category}</span>
                    <span className={`text-[10px] font-semibold ${faq.published ? "text-success" : "text-[color:var(--text-muted)]"}`}>{faq.published ? "Published" : "Hidden"}</span>
                  </div>
                </button>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => togglePublished(faq.id)} className={`w-7 h-7 rounded-lg flex items-center justify-center border-0 cursor-pointer transition-colors ${faq.published ? "bg-success/10 text-success" : "bg-elevated text-[color:var(--text-muted)] hover:text-foreground"}`}>
                    {faq.published ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                  <button onClick={() => openEdit(faq)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-elevated border-0 text-[color:var(--text-muted)] cursor-pointer hover:bg-[color:var(--bg-overlay)] hover:text-foreground transition-colors">
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => handleDelete(faq.id)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-transparent border-0 text-[color:var(--text-muted)] cursor-pointer hover:bg-danger/10 hover:text-danger transition-colors">
                    <Trash2 size={12} />
                  </button>
                  <ChevronDown size={13} className={`text-[color:var(--text-muted)] transition-transform ${expandedId === faq.id ? "rotate-180" : ""}`} />
                </div>
              </div>
              {expandedId === faq.id && (
                <div className="px-4 pb-4 pt-0 border-t border-[color:var(--border-subtle)]">
                  <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed mt-3">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
