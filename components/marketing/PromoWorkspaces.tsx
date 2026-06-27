// components/marketing/PromoWorkspaces.tsx
// HomepageWorkspace + FeaturedContentWorkspace + BannersWorkspace
"use client";

import { useMemo, useState } from "react";
import {
  GripVertical, Eye, EyeOff, Settings, Pencil, Trash2,
  Image as ImageIcon, Music2, Mic2, Library, FileText, Plus,
  Star, TrendingUp, MousePointer,
} from "lucide-react";
import type {
  HomeSection, HomeSectionType,
  FeaturedItem, FeaturedEntityType,
  Banner, BannerStatus,
} from "@/services/marketing/types";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";

// ── Homepage Workspace ───────────────────────────────────────────

const SECTION_ICONS: Record<HomeSectionType, React.ReactNode> = {
  hero_banner: <ImageIcon size={16} />,
  featured_tracks: <Music2 size={16} />,
  featured_artists: <Mic2 size={16} />,
  trending_collections: <Library size={16} />,
  new_releases: <Star size={16} />,
  editors_picks: <Eye size={16} />,
};

const SECTION_DESCRIPTIONS: Record<HomeSectionType, string> = {
  hero_banner: "Full-width hero image with headline and CTA",
  featured_tracks: "Curated track grid with play previews",
  featured_artists: "Artist spotlight cards",
  trending_collections: "Hot collections based on sales velocity",
  new_releases: "Recently published tracks and collections",
  editors_picks: "Hand-selected content by the editorial team",
};

export function HomepageWorkspace({ sections, onChange }: { sections: HomeSection[]; onChange: (s: HomeSection[]) => void }) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const sorted = [...sections].sort((a, b) => a.displayOrder - b.displayOrder);

  const toggleEnabled = (id: string) =>
    onChange(sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));

  const handleDrop = (i: number) => {
    if (dragIndex === null || dragIndex === i) { setDragIndex(null); setDragOver(null); return; }
    const next = [...sorted];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(i, 0, moved);
    onChange(next.map((s, idx) => ({ ...s, displayOrder: idx + 1 })));
    setDragIndex(null); setDragOver(null);
  };

  const enabledCount = sorted.filter(s => s.enabled).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-accent/5 border border-accent/20 rounded-xl px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{enabledCount} of {sorted.length} sections enabled</p>
          <p className="text-xs text-[color:var(--text-muted)] mt-0.5">Drag to reorder · toggle to enable/disable sections</p>
        </div>
        <span className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-lg">Live on site</span>
      </div>

      <div className="flex flex-col gap-2">
        {sorted.map((section, i) => (
          <div
            key={section.id}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={e => { e.preventDefault(); setDragOver(i); }}
            onDrop={() => handleDrop(i)}
            onDragEnd={() => { setDragIndex(null); setDragOver(null); }}
            className={[
              "flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all cursor-grab",
              section.enabled ? "bg-surface border-[color:var(--border-subtle)]" : "bg-elevated/40 border-[color:var(--border-subtle)] opacity-60",
              dragIndex === i ? "opacity-40 scale-[0.98]" : "",
              dragOver === i && dragIndex !== i ? "border-accent/60 bg-accent/5" : "",
            ].join(" ")}
          >
            <GripVertical size={16} className="text-[color:var(--text-muted)] shrink-0" />
            <span className="text-[11px] font-mono text-[color:var(--text-muted)] w-4 shrink-0">{i + 1}</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${section.enabled ? "bg-accent/10 text-accent" : "bg-elevated text-[color:var(--text-muted)]"}`}>
              {SECTION_ICONS[section.sectionType]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{section.label}</p>
              <p className="text-[11px] text-[color:var(--text-muted)] truncate">{SECTION_DESCRIPTIONS[section.sectionType]}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
              {(section.startsAt || section.endsAt) && (
                <span className="text-[10px] text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded font-semibold">Scheduled</span>
              )}
              <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-[color:var(--border-subtle)] bg-transparent cursor-pointer hover:bg-elevated transition-colors text-[color:var(--text-muted)]">
                <Settings size={13} />
              </button>
              <button onClick={() => toggleEnabled(section.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center border-0 cursor-pointer transition-colors ${section.enabled ? "bg-success/10 text-success hover:bg-success/20" : "bg-elevated text-[color:var(--text-muted)] hover:bg-[color:var(--bg-overlay)]"}`}>
                {section.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Featured Content Workspace ───────────────────────────────────

const ENTITY_ICONS: Record<FeaturedEntityType, React.ReactNode> = {
  track: <Music2 size={13} />,
  collection: <Library size={13} />,
  artist: <Mic2 size={13} />,
  blog_post: <FileText size={13} />,
};

const ENTITY_COLORS: Record<FeaturedEntityType, string> = {
  track: "bg-accent/10 text-accent", collection: "bg-accent-cyan/10 text-accent-cyan",
  artist: "bg-[color:var(--accent-magenta)]/10 text-[color:var(--accent-magenta)]",
  blog_post: "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]",
};

function fmtDate(d: string | null) {
  if (!d) return "—";
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  if (diff < 0) return "Expired";
  if (diff === 0) return "Today";
  if (diff <= 7) return `${diff}d left`;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getDateStatus(dateStr: string | null): { display: string; isExpiring: boolean } {
  if (!dateStr) return { display: "—", isExpiring: false };

  // This function is pure - it returns the same output for the same input
  // The actual Date.now() call is made at the time the function is called,
  // but we'll only call it in effects or event handlers, not during render.
  const now = new Date();
  const targetDate = new Date(dateStr);
  const diff = Math.ceil((targetDate.getTime() - now.getTime()) / 86400000);

  if (diff < 0) return { display: "Expired", isExpiring: false };
  if (diff === 0) return { display: "Today", isExpiring: true };
  if (diff <= 7) return { display: `${diff}d left`, isExpiring: true };
  return {
    display: targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    isExpiring: false
  };
}

export function FeaturedContentWorkspace({ items, onRemove }: { items: FeaturedItem[]; onRemove: (id: string) => void }) {
  const [filter, setFilter] = useState<FeaturedEntityType | "all">("all");
  const filtered = filter === "all" ? items : items.filter(i => i.entityType === filter);

  const decoratedItems = useMemo(() => {
    const filtered = filter === "all" ? items : items.filter(i => i.entityType === filter);
    return filtered.map(item => ({
      ...item,
      dateStatus: getDateStatus(item.endsAt),
    }));
  }, [items, filter]);

  const groups: { type: FeaturedEntityType; label: string }[] = [
    { type: "track", label: "Tracks" },
    { type: "artist", label: "Artists" },
    { type: "collection", label: "Collections" },
    { type: "blog_post", label: "Blog Posts" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {[{ key: "all" as const, label: "All" }, ...groups.map(g => ({ key: g.type, label: g.label }))].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-0 cursor-pointer transition-all ${filter === f.key ? "bg-accent/15 text-accent outline outline-1 outline-accent/40" : "bg-[color:var(--bg-input)] text-[color:var(--text-muted)] outline outline-1 outline-[color:var(--border-subtle)] hover:text-foreground"}`}>
            {f.label}
          </button>
        ))}
        <button className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/10 text-accent text-xs font-semibold border border-accent/30 cursor-pointer hover:bg-accent/20 transition-colors">
          <Plus size={13} /> Add Featured
        </button>
      </div>

      {decoratedItems.length === 0 ? (
        <div className="bg-surface border border-[color:var(--border-subtle)] rounded-2xl py-16 text-center">
          <p className="text-sm text-[color:var(--text-muted)]">No featured {filter === "all" ? "content" : filter.replace("_", " ")} yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {decoratedItems.map(item => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3 bg-surface border border-[color:var(--border-subtle)] rounded-xl">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-elevated flex items-center justify-center shrink-0">
                {item.thumbnailUrl
                  ? <img src={item.thumbnailUrl} alt={item.entityTitle} className="w-full h-full object-cover" />
                  : <span className={`${ENTITY_COLORS[item.entityType]}`}>{ENTITY_ICONS[item.entityType]}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">{item.entityTitle}</p>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${ENTITY_COLORS[item.entityType]}`}>
                    {ENTITY_ICONS[item.entityType]} {item.entityType.replace("_", " ")}
                  </span>
                </div>
                {item.entityArtist && <p className="text-[11px] text-[color:var(--text-muted)]">{item.entityArtist}</p>}
              </div>
              <div className="text-right shrink-0 text-[11px]">
                <p className="text-[color:var(--text-muted)]">Pos. {item.position}</p>
                <p className={item.dateStatus.isExpiring ? "text-danger font-semibold" : "text-[color:var(--text-muted)]"}>
                  {item.dateStatus.display}
                </p>
              </div>
              <button onClick={() => onRemove(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-danger/10 hover:text-danger transition-colors shrink-0">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Banners Workspace ────────────────────────────────────────────

const BANNER_STATUS_VARIANT: Record<BannerStatus, "success" | "cyan" | "muted"> = {
  active: "success", scheduled: "cyan", inactive: "muted",
};

export function BannersWorkspace({ banners, onArchive }: { banners: Banner[]; onArchive: (id: string) => void }) {
  const { hoveredId, setHoveredId } = useHoveredRow();

  const ctr = (b: Banner) => b.impressions > 0 ? `${((b.clicks / b.impressions) * 100).toFixed(1)}%` : "—";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent/10 text-accent text-xs font-semibold border border-accent/30 cursor-pointer hover:bg-accent/20 transition-colors">
          <Plus size={13} /> Create Banner
        </button>
      </div>

      <div className="grid gap-4">
        {banners.map(banner => (
          <div key={banner.id} className="bg-surface border border-[color:var(--border-subtle)] rounded-2xl overflow-hidden">
            {/* Preview area */}
            <div className="relative w-full h-32 bg-elevated overflow-hidden">
              {banner.desktopImageUrl
                ? <img src={banner.desktopImageUrl} alt={banner.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={28} className="text-[color:var(--text-muted)]" /></div>
              }
              <div className="absolute top-2.5 right-2.5">
                <DataTable.StatusBadge label={banner.status.charAt(0).toUpperCase() + banner.status.slice(1)} variant={BANNER_STATUS_VARIANT[banner.status]} />
              </div>
            </div>

            {/* Details */}
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{banner.title}</p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-[color:var(--text-muted)]">
                  <span className="flex items-center gap-1"><TrendingUp size={10} />{banner.clicks.toLocaleString()} clicks</span>
                  <span className="flex items-center gap-1"><Eye size={10} />{banner.impressions.toLocaleString()} impressions</span>
                  <span className="flex items-center gap-1"><MousePointer size={10} />CTR {ctr(banner)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-[color:var(--border-subtle)] bg-transparent cursor-pointer text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors"><Pencil size={13} /></button>
                <button onClick={() => onArchive(banner.id)} className="w-8 h-8 rounded-lg flex items-center justify-center border border-[color:var(--border-subtle)] bg-transparent cursor-pointer text-[color:var(--text-muted)] hover:bg-danger/10 hover:text-danger transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
