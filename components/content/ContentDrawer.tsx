// components/content/ContentDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import {
  X, Pencil, Eye, RotateCcw, FileText, Globe, Image as ImageIcon,
  Calendar, Clock, Hash, AlignLeft, Heading, Quote, Code,
  Minus, Play, Square, Megaphone, Link,
} from "lucide-react";
import type { ContentItem, ContentStatus, ContentBlock, ContentVisibility } from "@/services/content/types";

interface Props {
  item: ContentItem | null;
  onClose: () => void;
  onEdit: (item: ContentItem) => void;
}

type Tab = "overview" | "editor" | "seo" | "media" | "publishing" | "revisions";

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "editor", label: "Content" },
  { key: "seo", label: "SEO" },
  { key: "media", label: "Media" },
  { key: "publishing", label: "Publishing" },
  { key: "revisions", label: "Revisions" },
];

const STATUS_CLASSES: Record<ContentStatus, string> = {
  published: "bg-success/10 text-success",
  draft: "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]",
  scheduled: "bg-accent-cyan/10 text-accent-cyan",
  archived: "bg-white/10 text-white/40",
};

const BLOCK_ICONS: Record<ContentBlock["type"], React.ReactNode> = {
  heading: <Heading size={13} />,
  paragraph: <AlignLeft size={13} />,
  image: <ImageIcon size={13} />,
  quote: <Quote size={13} />,
  gallery: <ImageIcon size={13} />,
  video: <Play size={13} />,
  code: <Code size={13} />,
  divider: <Minus size={13} />,
  button: <Square size={13} />,
  embed: <Globe size={13} />,
  callout: <Megaphone size={13} />,
};

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 border-b border-[color:var(--border-subtle)]/40 last:border-0">
      <span className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)]">{label}</span>
      <span className="text-sm text-[color:var(--text-secondary)]">{value}</span>
    </div>
  );
}

function seoColor(score: number) {
  if (score >= 80) return "text-success";
  if (score >= 50) return "text-[color:var(--color-warning)]";
  return "text-danger";
}

function SeoBar({ score }: { score: number }) {
  const color = score >= 80 ? "bg-success" : score >= 50 ? "bg-[color:var(--color-warning)]" : "bg-danger";
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-[color:var(--text-muted)]">SEO Score</span>
        <span className={`text-sm font-bold ${seoColor(score)}`}>{score > 0 ? score : "Not set"}</span>
      </div>
      <div className="h-2 rounded-full bg-elevated overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function ContentDrawer({ item, onClose, onEdit }: Props) {
  const [tab, setTab] = useState<Tab>("overview");

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (item) setTab("overview"); }, [item?.id]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!item) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[350]" />

      <aside className="fixed top-0 right-0 bottom-0 w-[500px] bg-surface border-l border-[color:var(--border-subtle)] z-[360] flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border-subtle)] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-elevated flex items-center justify-center shrink-0 border border-[color:var(--border-subtle)] overflow-hidden">
              {item.featuredImage
                ? <img src={item.featuredImage} alt={item.title} className="w-full h-full object-cover" />
                : <FileText size={14} className="text-[color:var(--text-muted)]" />
              }
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{item.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_CLASSES[item.status]}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
                <span className="text-[11px] font-mono text-[color:var(--text-muted)]">/{item.slug}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => onEdit(item)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[color:var(--border-default)] bg-transparent text-[color:var(--text-secondary)] text-xs font-semibold cursor-pointer hover:bg-elevated hover:text-foreground transition-colors">
              <Pencil size={11} /> Edit
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[color:var(--border-subtle)] px-5 shrink-0 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={[
                "px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-0 bg-transparent cursor-pointer transition-colors border-b-2 -mb-px",
                tab === t.key ? "text-accent border-accent" : "text-[color:var(--text-muted)] border-transparent hover:text-foreground",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="flex flex-col gap-4">
              {item.excerpt && <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">{item.excerpt}</p>}

              <SeoBar score={item.seoScore} />

              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <MetaRow label="Author" value={item.author} />
                <MetaRow label="Category" value={item.category} />
                <MetaRow label="Published" value={fmtDate(item.publishedAt)} />
                {item.scheduledAt && <MetaRow label="Scheduled" value={fmtDate(item.scheduledAt)} />}
                <MetaRow label="Views" value={item.views > 0 ? item.views.toLocaleString() : "Not published"} />
                <MetaRow label="Revisions" value={item.revisions.length.toString()} />
                <MetaRow label="Last Updated" value={fmtDate(item.updatedAt)} />
              </div>

              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-elevated border border-[color:var(--border-subtle)] text-[11px] text-[color:var(--text-secondary)]">
                      <Hash size={9} className="text-[color:var(--text-muted)]" /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CONTENT EDITOR — read-only block preview */}
          {tab === "editor" && (
            <div className="flex flex-col gap-3">
              <p className="text-[11px] text-[color:var(--text-muted)]">{item.blocks.length} block{item.blocks.length !== 1 ? "s" : ""}</p>
              {item.blocks.map(block => (
                <div key={block.id} className="flex items-start gap-3 p-3 bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-elevated flex items-center justify-center shrink-0 text-[color:var(--text-muted)]">
                    {BLOCK_ICONS[block.type] ?? <FileText size={13} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[color:var(--text-muted)] mb-1 capitalize">{block.type}</p>
                    <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed line-clamp-2">{block.content}</p>
                    {block.attrs && Object.keys(block.attrs).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(block.attrs).map(([k, v]) => (
                          <span key={k} className="text-[9px] font-mono bg-elevated px-1.5 py-0.5 rounded text-[color:var(--text-muted)]">{k}: {String(v)}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button onClick={() => onEdit(item)} className="w-full py-2.5 rounded-xl border-2 border-dashed border-[color:var(--border-default)] text-xs font-semibold text-[color:var(--text-muted)] cursor-pointer hover:border-accent hover:text-accent transition-colors bg-transparent">
                Open full editor to add or edit blocks
              </button>
            </div>
          )}

          {/* SEO */}
          {tab === "seo" && (
            <div className="flex flex-col gap-4">
              <SeoBar score={item.seoScore} />

              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <MetaRow label="SEO Title" value={item.seoTitle || <span className="text-[color:var(--text-muted)] italic">Not set</span>} />
                <MetaRow label="Meta Description" value={item.seoDescription || <span className="text-[color:var(--text-muted)] italic">Not set</span>} />
                <MetaRow label="Canonical URL" value={item.canonicalUrl || <span className="text-[color:var(--text-muted)] italic">Not set</span>} />
                <MetaRow label="Keywords" value={item.seoKeywords.length > 0 ? item.seoKeywords.join(", ") : <span className="text-[color:var(--text-muted)] italic">None</span>} />
              </div>

              {/* Search preview */}
              {item.seoTitle && (
                <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--text-muted)] mb-3">Search Preview</p>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-[13px] font-semibold text-[#1a0dab] truncate">{item.seoTitle}</p>
                    <p className="text-[11px] text-[#006621] mt-0.5">sidez.com/{item.slug}</p>
                    <p className="text-[12px] text-[#545454] mt-1 line-clamp-2">{item.seoDescription}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MEDIA */}
          {tab === "media" && (
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--text-muted)] mb-3">Featured Image</p>
                {item.featuredImage
                  ? <img src={item.featuredImage} alt={item.title} className="w-full rounded-xl object-cover aspect-video" />
                  : (
                    <div className="aspect-video rounded-xl border-2 border-dashed border-[color:var(--border-default)] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-accent transition-colors">
                      <ImageIcon size={24} className="text-[color:var(--text-muted)]" />
                      <p className="text-sm text-[color:var(--text-muted)]">No featured image</p>
                      <p className="text-xs text-[color:var(--text-muted)]">Click to upload</p>
                    </div>
                  )
                }
              </div>
              <p className="text-xs text-[color:var(--text-muted)] text-center">Gallery and media management available in full editor</p>
            </div>
          )}

          {/* PUBLISHING */}
          {tab === "publishing" && (
            <div className="flex flex-col gap-4">
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <MetaRow label="Status" value={
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_CLASSES[item.status]}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                } />
                <MetaRow label="Visibility" value={
                  <span className="flex items-center gap-1.5">
                    <Globe size={12} className="text-[color:var(--text-muted)]" />
                    {item.visibility.charAt(0).toUpperCase() + item.visibility.slice(1)}
                  </span>
                } />
                <MetaRow label="Published" value={fmtDate(item.publishedAt)} />
                {item.scheduledAt && (
                  <MetaRow label="Scheduled" value={
                    <span className="flex items-center gap-1.5 text-accent-cyan">
                      <Calendar size={12} /> {fmtDate(item.scheduledAt)}
                    </span>
                  } />
                )}
                <MetaRow label="Created" value={fmtDate(item.createdAt)} />
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2.5 rounded-xl border border-success/30 bg-success/10 text-success text-xs font-semibold cursor-pointer hover:bg-success/20 transition-colors">
                  Publish Now
                </button>
                <button className="flex-1 py-2.5 rounded-xl border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan text-xs font-semibold cursor-pointer hover:bg-accent-cyan/20 transition-colors">
                  Schedule
                </button>
                <button className="flex-1 py-2.5 rounded-xl border border-[color:var(--border-subtle)] bg-elevated text-[color:var(--text-secondary)] text-xs font-semibold cursor-pointer hover:bg-[color:var(--bg-overlay)] hover:text-foreground transition-colors">
                  Unpublish
                </button>
              </div>
            </div>
          )}

          {/* REVISIONS */}
          {tab === "revisions" && (
            <div className="flex flex-col gap-2.5">
              <p className="text-[11px] text-[color:var(--text-muted)]">{item.revisions.length} revision{item.revisions.length !== 1 ? "s" : ""}</p>
              {item.revisions.map((rev, i) => (
                <div key={rev.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${i === 0 ? "bg-accent/10 text-accent" : "bg-elevated text-[color:var(--text-muted)]"}`}>
                      <Clock size={12} />
                    </div>
                    {i < item.revisions.length - 1 && <div className="w-px flex-1 min-h-[16px] bg-[color:var(--border-subtle)] my-1" />}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        v{rev.revisionNumber}
                        {i === 0 && <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-accent/10 text-accent uppercase">Current</span>}
                      </p>
                      {i > 0 && (
                        <button className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold bg-elevated text-[color:var(--text-muted)] cursor-pointer hover:bg-[color:var(--bg-overlay)] hover:text-foreground transition-colors border border-[color:var(--border-subtle)]">
                          <RotateCcw size={9} /> Restore
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-[color:var(--text-secondary)] mt-0.5">{rev.summary}</p>
                    <p className="text-[10px] text-[color:var(--text-muted)] mt-1">
                      {rev.changedBy} · {new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
