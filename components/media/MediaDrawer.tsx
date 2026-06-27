// components/media/MediaDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import {
  X, Download, Copy, RefreshCw, Archive, Trash2,
  Image as ImageIcon, Music2, Video, FileText, File,
  Check, ExternalLink, Clock, Tag, Hash,
} from "lucide-react";
import type { MediaAsset, AssetType, MediaActivity } from "@/services/media/types";

interface Props {
  asset: MediaAsset | null;
  onClose: () => void;
  onReplace: (asset: MediaAsset) => void;
  onArchive: (asset: MediaAsset) => void;
}

type Tab = "overview" | "usage" | "metadata" | "versions" | "activity";

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "usage", label: "Usage" },
  { key: "metadata", label: "Metadata" },
  { key: "versions", label: "Versions" },
  { key: "activity", label: "Activity" },
];

const ENTITY_LABELS: Record<string, string> = {
  track: "Track", artist: "Artist", collection: "Collection",
  homepage: "Homepage", blog: "Blog", marketing: "Marketing", settings: "Settings", product: "Product",
};

const ENTITY_COLORS: Record<string, string> = {
  track: "text-accent", artist: "text-[color:var(--accent-magenta)]", collection: "text-accent-cyan",
  homepage: "text-success", blog: "text-[color:var(--color-warning)]", marketing: "text-danger",
  product: "text-accent", settings: "text-[color:var(--text-muted)]",
};

const ACTION_LABELS: Record<MediaActivity["action"], string> = {
  uploaded: "Uploaded", renamed: "Renamed", replaced: "Replaced",
  downloaded: "Downloaded", archived: "Archived", restored: "Restored",
  deleted: "Deleted", metadata_updated: "Metadata updated",
};

const ACTION_COLORS: Record<MediaActivity["action"], string> = {
  uploaded: "text-success", renamed: "text-accent", replaced: "text-accent-cyan",
  downloaded: "text-[color:var(--text-muted)]", archived: "text-[color:var(--color-warning)]",
  restored: "text-success", deleted: "text-danger", metadata_updated: "text-accent",
};

function fmtSize(bytes: number) {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(0)} KB`;
  return `${bytes} B`;
}

function fmtDate(d: string) {
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

const TYPE_ICONS: Record<AssetType, React.ReactNode> = {
  image: <ImageIcon size={16} />, audio: <Music2 size={16} />, video: <Video size={16} />,
  document: <FileText size={16} />, zip: <File size={16} />, other: <File size={16} />,
};

export default function MediaDrawer({ asset, onClose, onReplace, onArchive }: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [metaForm, setMetaForm] = useState({ altText: "", caption: "", description: "", tags: "", copyright: "", creator: "" });


  useEffect(() => {
    if (asset) {
      setTab("overview");
      setMetaForm({ altText: asset.metadata.altText, caption: asset.metadata.caption, description: asset.metadata.description, tags: asset.metadata.tags.join(", "), copyright: asset.metadata.copyright, creator: asset.metadata.creator });
    }
  }, [asset?.id]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!asset) return null;

  const copyUrl = () => {
    navigator.clipboard.writeText(asset.url || `https://cdn.sidez.com/${asset.id}`).catch(() => { });
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 1500);
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[350]" />

      <aside className="fixed top-0 right-0 bottom-0 w-[480px] bg-surface border-l border-[color:var(--border-subtle)] z-[360] flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border-subtle)] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 bg-accent/10 text-accent`}>
              {TYPE_ICONS[asset.assetType]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{asset.filename}</p>
              <p className="text-[11px] text-[color:var(--text-muted)]">{fmtSize(asset.size)} · {asset.extension.toUpperCase()}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={copyUrl} title="Copy URL" className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors">
              {copiedUrl ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            </button>
            <button onClick={() => onReplace(asset)} title="Replace" className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors">
              <RefreshCw size={14} />
            </button>
            <button title="Download" className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors">
              <Download size={14} />
            </button>
            <button onClick={() => onArchive(asset)} title="Archive" className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-[color:var(--color-warning)]/10 hover:text-[color:var(--color-warning)] transition-colors">
              <Archive size={14} />
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors">
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
              {t.key === "usage" && asset.references.length > 0 && (
                <span className="ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-accent/15 text-accent">{asset.references.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="flex flex-col gap-4">
              {/* Preview */}
              <div className="w-full rounded-[10px] overflow-hidden bg-elevated border border-[color:var(--border-subtle)] flex items-center justify-center" style={{ minHeight: 200 }}>
                {asset.assetType === "image" && asset.url ? (
                  <img src={asset.url} alt={asset.metadata.altText || asset.filename} className="max-w-full max-h-64 object-contain" />
                ) : asset.assetType === "audio" ? (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <div className="w-16 h-16 rounded-2xl bg-[color:var(--accent-magenta)]/10 flex items-center justify-center">
                      <Music2 size={28} className="text-[color:var(--accent-magenta)]" />
                    </div>
                    <p className="text-sm text-[color:var(--text-muted)]">Audio file</p>
                    <audio controls className="w-full max-w-[280px]" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-10">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                      {TYPE_ICONS[asset.assetType]}
                    </div>
                    <p className="text-sm text-[color:var(--text-muted)]">{asset.extension.toUpperCase()} file</p>
                  </div>
                )}
              </div>

              {/* CDN URL */}
              <div className="flex items-center gap-2 bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-[10px] px-3 py-2.5">
                <p className="text-[11px] font-mono text-[color:var(--text-secondary)] flex-1 truncate">{asset.url || `cdn.sidez.com/${asset.id}`}</p>
                <button onClick={copyUrl} className="w-7 h-7 rounded-[10px] flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:text-accent transition-colors shrink-0">
                  {copiedUrl ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                </button>
              </div>

              {/* Color palette (images) */}
              {asset.assetType === "image" && asset.metadata.colorPalette.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--text-muted)] mb-2">Color Palette</p>
                  <div className="flex gap-2">
                    {asset.metadata.colorPalette.map(color => (
                      <div key={color} title={color} className="w-8 h-8 rounded-[10px] border border-white/10" style={{ background: color }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Meta table */}
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-[10px] p-4">
                <MetaRow label="Filename" value={<span className="font-mono text-xs break-all">{asset.filename}</span>} />
                <MetaRow label="Original" value={<span className="font-mono text-xs break-all">{asset.originalFilename}</span>} />
                <MetaRow label="Type" value={`${asset.assetType.charAt(0).toUpperCase() + asset.assetType.slice(1)} · ${asset.mimeType}`} />
                <MetaRow label="Size" value={fmtSize(asset.size)} />
                {asset.width && asset.height && <MetaRow label="Dimensions" value={`${asset.width} × ${asset.height} px`} />}
                {asset.duration !== null && <MetaRow label="Duration" value={`${asset.duration}s`} />}
                <MetaRow label="Checksum" value={<span className="font-mono text-[11px] break-all">{asset.checksum}</span>} />
                <MetaRow label="Uploaded By" value={asset.uploadedBy} />
                <MetaRow label="Created" value={fmtDate(asset.createdAt)} />
                <MetaRow label="Updated" value={fmtDate(asset.updatedAt)} />
                <MetaRow label="Used In" value={asset.usageCount > 0 ? `${asset.usageCount} place${asset.usageCount > 1 ? "s" : ""}` : "Not used"} />
              </div>
            </div>
          )}

          {/* USAGE */}
          {tab === "usage" && (
            <div className="flex flex-col gap-3">
              {asset.references.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold text-foreground mb-1">Not used anywhere</p>
                  <p className="text-xs text-[color:var(--text-muted)]">This asset has not been referenced in any content yet.</p>
                </div>
              ) : (
                <>
                  <p className="text-[11px] text-[color:var(--text-muted)]">Referenced in {asset.references.length} location{asset.references.length > 1 ? "s" : ""}</p>
                  {asset.references.map(ref => (
                    <div key={ref.id} className="flex items-center justify-between gap-3 bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-[10px] p-3.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-elevated ${ENTITY_COLORS[ref.entityType]}`}>
                            {ENTITY_LABELS[ref.entityType]}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-foreground mt-1 truncate">{ref.entityTitle}</p>
                        <p className="text-[11px] text-[color:var(--text-muted)]">Field: <span className="font-mono">{ref.fieldName}</span></p>
                      </div>
                      <a href={ref.url} className="w-8 h-8 rounded-[10px] flex items-center justify-center border border-[color:var(--border-subtle)] bg-transparent text-[color:var(--text-muted)] cursor-pointer hover:bg-elevated hover:text-foreground transition-colors shrink-0">
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  ))}
                  <div className="bg-[color:var(--color-warning)]/5 border border-[color:var(--color-warning)]/20 rounded-[10px] px-4 py-3 mt-1">
                    <p className="text-xs text-[color:var(--color-warning)] font-semibold">Deletion blocked</p>
                    <p className="text-[11px] text-[color:var(--text-muted)] mt-0.5">Assets in use cannot be deleted. Replace the asset to update all references.</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* METADATA */}
          {tab === "metadata" && (
            <div className="flex flex-col gap-4">
              <p className="text-[11px] text-[color:var(--text-muted)]">Metadata is used for SEO, accessibility, and search.</p>
              {[
                { label: "Alt Text", field: "altText" as const, placeholder: "Descriptive alt text for screen readers" },
                { label: "Caption", field: "caption" as const, placeholder: "Short caption for display" },
                { label: "Copyright", field: "copyright" as const, placeholder: "© 2025 Your Name" },
                { label: "Creator", field: "creator" as const, placeholder: "Photographer or creator name" },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">{label}</label>
                  <input
                    value={metaForm[field]}
                    onChange={e => setMetaForm(p => ({ ...p, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-[10px] text-sm text-foreground font-inherit px-3 py-2.5 outline-none focus:border-accent transition-colors placeholder:text-[color:var(--text-muted)]"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">Description</label>
                <textarea
                  value={metaForm.description}
                  onChange={e => setMetaForm(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  placeholder="Longer description of the asset..."
                  className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-[10px] text-sm text-foreground font-inherit px-3 py-2.5 outline-none focus:border-accent resize-none leading-relaxed placeholder:text-[color:var(--text-muted)]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">Tags (comma separated)</label>
                <input
                  value={metaForm.tags}
                  onChange={e => setMetaForm(p => ({ ...p, tags: e.target.value }))}
                  placeholder="cover, track, r&b"
                  className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-[10px] text-sm text-foreground font-inherit px-3 py-2.5 outline-none focus:border-accent transition-colors placeholder:text-[color:var(--text-muted)]"
                />
                {asset.metadata.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {asset.metadata.tags.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[10px] bg-elevated border border-[color:var(--border-subtle)] text-[11px] text-[color:var(--text-secondary)]">
                        <Tag size={9} /> {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button className="w-full py-2.5 rounded-[10px] bg-accent/10 text-accent border border-accent/30 text-sm font-semibold cursor-pointer hover:bg-accent/20 transition-colors">
                Save Metadata
              </button>
            </div>
          )}

          {/* VERSIONS */}
          {tab === "versions" && (
            <div className="flex flex-col gap-3">
              <p className="text-[11px] text-[color:var(--text-muted)]">{asset.versions.length} version{asset.versions.length > 1 ? "s" : ""} · replacing an asset keeps all references intact</p>
              {asset.versions.map((v, i) => (
                <div key={v.id} className={`bg-[color:var(--bg-input)] border rounded-[10px] p-4 ${i === 0 ? "border-accent/30" : "border-[color:var(--border-subtle)]"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-foreground">v{v.version}</span>
                      {i === 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-[10px] bg-accent/10 text-accent uppercase">Current</span>}
                    </div>
                    {i > 0 && (
                      <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[10px] text-[11px] font-semibold bg-elevated border border-[color:var(--border-subtle)] text-[color:var(--text-muted)] cursor-pointer hover:bg-[color:var(--bg-overlay)] hover:text-foreground transition-colors">
                        <RefreshCw size={10} /> Restore
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-[color:var(--text-secondary)]">{v.changeNotes}</p>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-[color:var(--text-muted)]">
                    <span>{v.uploadedBy}</span>
                    <span>{fmtSize(v.size)}</span>
                    <span>{new Date(v.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
              ))}
              <button onClick={() => onReplace(asset)} className="w-full py-2.5 rounded-[10px] border-2 border-dashed border-[color:var(--border-default)] text-xs font-semibold text-[color:var(--text-muted)] cursor-pointer hover:border-accent hover:text-accent transition-colors bg-transparent flex items-center justify-center gap-2">
                <RefreshCw size={13} /> Upload new version
              </button>
            </div>
          )}

          {/* ACTIVITY */}
          {tab === "activity" && (
            <div className="flex flex-col gap-2.5">
              <p className="text-[11px] text-[color:var(--text-muted)]">{asset.activity.length} events</p>
              {asset.activity.map((event, i) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-[10px] bg-elevated flex items-center justify-center shrink-0">
                      <Clock size={12} className="text-[color:var(--text-muted)]" />
                    </div>
                    {i < asset.activity.length - 1 && <div className="w-px flex-1 min-h-[16px] bg-[color:var(--border-subtle)] my-1" />}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className={`text-sm font-semibold ${ACTION_COLORS[event.action]}`}>{ACTION_LABELS[event.action]}</p>
                    <p className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{event.performedBy} · {new Date(event.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    {event.notes && <p className="text-xs text-[color:var(--text-secondary)] mt-1 italic">{event.notes}</p>}
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
