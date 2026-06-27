// components/content/HomepageWorkspace.tsx
"use client";

import { useState } from "react";
import {
  GripVertical, Eye, EyeOff, Settings,
  Rocket, Music2, Mic2, Library, Star, Mail, Zap, Building, Layers,
} from "lucide-react";
import type { HomepageSection, HomepageSectionType } from "@/services/content/types";

interface Props {
  sections: HomepageSection[];
  onChange: (sections: HomepageSection[]) => void;
}

const SECTION_ICONS: Record<HomepageSectionType, React.ReactNode> = {
  hero_banner: <Rocket size={16} />,
  featured_tracks: <Music2 size={16} />,
  featured_artists: <Mic2 size={16} />,
  trending_collections: <Library size={16} />,
  testimonials: <Star size={16} />,
  newsletter: <Mail size={16} />,
  call_to_action: <Zap size={16} />,
  sponsors: <Building size={16} />,
  footer_highlights: <Layers size={16} />,
};

const SECTION_DESCRIPTIONS: Record<HomepageSectionType, string> = {
  hero_banner: "Full-width banner with headline and CTA",
  featured_tracks: "Showcase handpicked tracks from your catalog",
  featured_artists: "Spotlight your top producers and artists",
  trending_collections: "Display trending and popular collections",
  testimonials: "Social proof from happy customers",
  newsletter: "Email signup form with incentive copy",
  call_to_action: "Conversion-focused CTA block",
  sponsors: "Partner logos and sponsor recognition",
  footer_highlights: "Key links and highlights above the footer",
};

export default function HomepageWorkspace({ sections, onChange }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const sorted = [...sections].sort((a, b) => a.displayOrder - b.displayOrder);

  const toggleEnabled = (id: string) => {
    onChange(sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleDragStart = (i: number) => setDragIndex(i);
  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    setDragOver(i);
  };
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
      {/* Info banner */}
      <div className="bg-accent/5 border border-accent/20 rounded-xl px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{enabledCount} of {sorted.length} sections enabled</p>
          <p className="text-xs text-[color:var(--text-muted)] mt-0.5">Drag rows to reorder · toggle visibility per section</p>
        </div>
        <span className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-lg">Live on website</span>
      </div>

      {/* Section list */}
      <div className="flex flex-col gap-2">
        {sorted.map((section, i) => {
          const isDragging = dragIndex === i;
          const isOver = dragOver === i && dragIndex !== i;

          return (
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={e => handleDragOver(e, i)}
              onDrop={() => handleDrop(i)}
              onDragEnd={() => { setDragIndex(null); setDragOver(null); }}
              className={[
                "flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-150 cursor-grab",
                section.enabled ? "bg-surface border-[color:var(--border-subtle)]" : "bg-elevated/50 border-[color:var(--border-subtle)] opacity-60",
                isDragging ? "opacity-40 scale-[0.98]" : "",
                isOver ? "border-accent/60 bg-accent/5" : "",
              ].join(" ")}
            >
              {/* Drag handle */}
              <GripVertical size={16} className="text-[color:var(--text-muted)] shrink-0" />

              {/* Order number */}
              <span className="text-[11px] font-mono text-[color:var(--text-muted)] w-5 text-center shrink-0">{i + 1}</span>

              {/* Icon */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${section.enabled ? "bg-accent/10 text-accent" : "bg-elevated text-[color:var(--text-muted)]"}`}>
                {SECTION_ICONS[section.sectionType]}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{section.title}</p>
                <p className="text-[11px] text-[color:var(--text-muted)] truncate">{SECTION_DESCRIPTIONS[section.sectionType]}</p>
                {(section.subtitle || section.ctaLabel) && (
                  <p className="text-[10px] text-accent mt-0.5 truncate">
                    {section.subtitle ? `"${section.subtitle}"` : ""}
                    {section.ctaLabel ? ` · CTA: ${section.ctaLabel}` : ""}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-[color:var(--border-subtle)] bg-transparent text-[color:var(--text-muted)] cursor-pointer hover:bg-elevated hover:text-foreground transition-colors">
                  <Settings size={13} />
                </button>
                <button
                  onClick={() => toggleEnabled(section.id)}
                  title={section.enabled ? "Disable section" : "Enable section"}
                  className={[
                    "w-8 h-8 rounded-lg flex items-center justify-center border-0 cursor-pointer transition-colors",
                    section.enabled
                      ? "bg-success/10 text-success hover:bg-success/20"
                      : "bg-elevated text-[color:var(--text-muted)] hover:bg-[color:var(--bg-overlay)] hover:text-foreground",
                  ].join(" ")}
                >
                  {section.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save notice */}
      <p className="text-[11px] text-[color:var(--text-muted)] text-center">Changes are saved automatically</p>
    </div>
  );
}
