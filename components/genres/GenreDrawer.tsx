// components/genres/GenreDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import {
  X, Pencil, Plus, Trash2, GripVertical,
  Music2, Users, Library, ShoppingCart, Download,
  Globe, Search, Tag, TrendingUp, BarChart3,
} from "lucide-react";
import type { GenreDetail, Subgenre } from "@/services/genres/types";
import IconResolver from "./IconResolver";

interface Props {
  genre: GenreDetail | null;
  onClose: () => void;
  onEdit: (genre: GenreDetail) => void;
  onAddSubgenre: (genreId: string, name: string) => void;
  onDeleteSubgenre: (subgenreId: string) => void;
}

type Tab = "overview" | "subgenres" | "usage" | "analytics";

function StatRow({ icon, label, value, color = "text-[color:var(--text-secondary)]" }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#1a2038]">
      <div className="flex items-center gap-2.5">
        <span className="text-[color:var(--text-muted)]">{icon}</span>
        <span className="text-sm text-[color:var(--text-secondary)]">{label}</span>
      </div>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)]">{label}</span>
      <span className="text-sm text-[color:var(--text-secondary)]">{value}</span>
    </div>
  );
}

function SubgenreRow({ sub, onDelete }: { sub: Subgenre; onDelete: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors duration-150
        ${hovered ? "bg-elevated" : "bg-input"}`}
    >
      <GripVertical size={13} className="text-[color:var(--text-muted)] flex-shrink-0 cursor-grab" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-foreground">{sub.name}</div>
        <div className="text-[11px] text-[color:var(--text-muted)]">{sub.trackCount} tracks</div>
      </div>
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold
        ${sub.isActive
          ? "bg-success/10 text-success"
          : "bg-[#6b7280]/12 text-[#9ca3af]"
        }`}>
        {sub.isActive ? "Active" : "Inactive"}
      </span>
      <button
        onClick={onDelete}
        className={`w-6.5 h-6.5 rounded-md border-0 bg-transparent cursor-pointer flex items-center justify-center text-[color:var(--text-muted)] transition-all duration-150
          ${hovered ? "opacity-100" : "opacity-0"}
          hover:bg-danger/10 hover:text-danger`}
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex flex-col gap-2">
      {data.map(d => (
        <div key={d.label}>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-[color:var(--text-secondary)]">{d.label}</span>
            <span className="text-xs font-semibold text-foreground">{d.value.toLocaleString()}</span>
          </div>
          <div className="h-1.5 bg-[#1a1f3a] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-[color:var(--accent-magenta)] rounded-full transition-all duration-500"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GenreDrawer({ genre, onClose, onEdit, onAddSubgenre, onDeleteSubgenre }: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const [newSubgenreName, setNewSubgenreName] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);

  useEffect(() => {
    if (genre) { setTab("overview"); setShowAddInput(false); setNewSubgenreName(""); }
  }, [genre?.id]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!genre) return null;

  const handleAddSubgenre = () => {
    if (!newSubgenreName.trim()) return;
    onAddSubgenre(genre.id, newSubgenreName.trim());
    setNewSubgenreName("");
    setShowAddInput(false);
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "subgenres", label: `Subgenres (${genre.subgenres.length})` },
    { key: "usage", label: "Usage" },
    { key: "analytics", label: "Analytics" },
  ];

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/50 z-[350] backdrop-blur-sm" />
      <aside className="fixed top-0 right-0 bottom-0 w-[480px] bg-surface border-l border-[color:var(--border-subtle)] z-[360] flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4.5 border-b border-[color:var(--border-subtle)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center border"
              style={{ background: `${genre.accentColor}18`, borderColor: `${genre.accentColor}30` }}
            >
              <IconResolver name={genre.icon} size={16} color={genre.accentColor} />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">{genre.name}</div>
              <div className="text-xs text-[color:var(--text-muted)]">/{genre.slug}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(genre)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#31386d] bg-transparent text-[color:var(--text-secondary)] text-xs font-semibold cursor-pointer transition-all hover:bg-elevated hover:text-foreground"
            >
              <Pencil size={12} /> Edit
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer flex items-center justify-center text-[color:var(--text-muted)] transition-colors hover:bg-elevated"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[color:var(--border-subtle)] px-5 flex-shrink-0 overflow-x-auto gap-0.5">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3.5 py-2.75 text-xs font-semibold whitespace-nowrap border-0 bg-transparent cursor-pointer transition-colors border-b-2 -mb-px
                ${tab === t.key
                  ? "text-accent border-accent"
                  : "text-[color:var(--text-muted)] border-transparent hover:text-foreground"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="flex flex-col gap-5">
              {/* Cover */}
              <div
                className="w-full aspect-[16/7] rounded-xl overflow-hidden flex items-center justify-center relative"
                style={{ background: `${genre.accentColor}12`, border: `1px solid ${genre.accentColor}30` }}
              >
                {genre.imageUrl
                  ? <img src={genre.imageUrl} alt={genre.name} className="w-full h-full object-cover" />
                  : <IconResolver name={genre.icon} size={42} color={genre.accentColor} />
                }
                <div
                  className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 rounded-full shadow-lg"
                  style={{ background: genre.accentColor, boxShadow: `0 0 12px ${genre.accentColor}` }}
                />
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                  ${genre.isActive
                    ? "bg-success/10 text-success"
                    : "bg-[#6b7280]/15 text-[#9ca3af]"
                  }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {genre.isActive ? "Active" : "Archived"}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed m-0">{genre.description}</p>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3.5 bg-input rounded-xl border border-[color:var(--border-subtle)] p-4">
                <MetaRow label="Slug" value={`/${genre.slug}`} />
                <MetaRow label="Created" value={new Date(genre.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
                <MetaRow label="SEO Title" value={genre.seoTitle || "—"} />
                <MetaRow label="Updated" value={new Date(genre.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
              </div>

              {/* SEO description */}
              {genre.seoDescription && (
                <div className="bg-input border border-[color:var(--border-subtle)] rounded-xl p-3.5">
                  <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
                    SEO Description
                  </div>
                  <p className="text-xs text-[color:var(--text-secondary)] m-0 leading-relaxed">{genre.seoDescription}</p>
                </div>
              )}
            </div>
          )}

          {/* SUBGENRES */}
          {tab === "subgenres" && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-foreground">Subgenres</span>
                <button
                  onClick={() => setShowAddInput(v => !v)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border-0 bg-accent/12 text-accent text-xs font-semibold cursor-pointer transition-colors hover:bg-accent/20"
                >
                  <Plus size={12} />
                  Add Subgenre
                </button>
              </div>

              {showAddInput && (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Subgenre name..."
                    value={newSubgenreName}
                    onChange={e => setNewSubgenreName(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleAddSubgenre(); if (e.key === "Escape") setShowAddInput(false); }}
                    className="flex-1 bg-input border border-accent rounded-lg text-foreground text-sm font-inherit px-3 py-2 outline-none"
                  />
                  <button
                    onClick={handleAddSubgenre}
                    className="px-3.5 py-2 rounded-lg border-0 bg-accent text-white text-xs font-semibold cursor-pointer hover:bg-[color:var(--accent-purple-hover)] transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}

              {genre.subgenres.length === 0 ? (
                <div className="text-center py-8 text-[color:var(--text-muted)]">
                  <Tag size={24} className="mx-auto mb-2.5" />
                  <p className="m-0 text-sm">No subgenres yet. Add one above.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {genre.subgenres.map(sub => (
                    <SubgenreRow key={sub.id} sub={sub} onDelete={() => onDeleteSubgenre(sub.id)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* USAGE */}
          {tab === "usage" && (
            <div className="flex flex-col gap-3.5">
              <div className="bg-input border border-[color:var(--border-subtle)] rounded-xl overflow-hidden">
                <StatRow icon={<Music2 size={13} />} label="Tracks using this genre" value={genre.trackCount.toLocaleString()} color="text-foreground" />
                <StatRow icon={<Library size={13} />} label="Collections" value={genre.collectionCount} color="text-foreground" />
                <StatRow icon={<Users size={13} />} label="Artists" value={genre.artistCount} color="text-foreground" />
                <div className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[color:var(--text-muted)]"><Search size={13} /></span>
                    <span className="text-sm text-[color:var(--text-secondary)]">Search popularity rank</span>
                  </div>
                  <span className="text-sm font-bold text-[color:var(--color-warning)]">#3</span>
                </div>
              </div>

              <div className="bg-input border border-[color:var(--border-subtle)] rounded-xl p-4">
                <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-3">
                  Platform Placement
                </div>
                {[
                  { label: "Homepage sections", value: "2", icon: <Globe size={13} /> },
                  { label: "Featured playlists", value: "4", icon: <Music2 size={13} /> },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-t border-[#1a2038]">
                    <div className="flex items-center gap-2">
                      <span className="text-[color:var(--text-muted)]">{row.icon}</span>
                      <span className="text-sm text-[color:var(--text-secondary)]">{row.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {tab === "analytics" && (
            <div className="flex flex-col gap-4">
              {/* KPI row */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Sales", value: genre.totalSales.toLocaleString(), color: "text-success", icon: <ShoppingCart size={13} />, bg: "bg-success/10" },
                  { label: "Revenue", value: genre.totalRevenue >= 1000 ? `$${(genre.totalRevenue / 1000).toFixed(1)}k` : `$${genre.totalRevenue}`, color: "text-accent", icon: <TrendingUp size={13} />, bg: "bg-accent/10" },
                  { label: "Downloads", value: genre.totalDownloads.toLocaleString(), color: "text-accent-cyan", icon: <Download size={13} />, bg: "bg-accent-cyan/10" },
                  { label: "Tracks", value: genre.trackCount.toLocaleString(), color: "text-[color:var(--color-warning)]", icon: <Music2 size={13} />, bg: "bg-[color:var(--color-warning)]/10" },
                ].map(card => (
                  <div key={card.label} className="bg-input border border-[color:var(--border-subtle)] rounded-xl p-4 flex flex-col gap-2.5">
                    <div className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center ${card.bg} ${card.color}`}>
                      {card.icon}
                    </div>
                    <div>
                      <div className={`text-lg font-bold tracking-[-0.02em] ${card.color}`}>{card.value}</div>
                      <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{card.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Top tracks bar chart */}
              <div className="bg-input border border-[color:var(--border-subtle)] rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-3.5">
                  <BarChart3 size={14} className="text-[color:var(--text-muted)]" />
                  <span className="text-xs font-bold text-foreground">Subgenre Distribution</span>
                </div>
                <BarChart data={genre.subgenres.slice(0, 5).map(s => ({ label: s.name, value: s.trackCount }))} />
              </div>

              {/* Revenue trend (static visualization) */}
              <div className="bg-input border border-[color:var(--border-subtle)] rounded-xl p-4">
                <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-2.5">
                  Avg. Revenue per Sale
                </div>
                <div className="text-2xl font-bold text-success tracking-[-0.03em]">
                  ${genre.totalSales > 0 ? (genre.totalRevenue / genre.totalSales).toFixed(2) : "0.00"}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
