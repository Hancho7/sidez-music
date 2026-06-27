// components/media/MediaGrid.tsx
"use client";

import { useState } from "react";
import {
  Image as ImageIcon, Music2, Video, FileText, Archive,
  File, Eye, Copy, RefreshCw, Download, Trash2, Check,
  Link as LinkIcon,
} from "lucide-react";
import type { MediaAsset, AssetType } from "@/services/media/types";

interface GridProps {
  assets: MediaAsset[];
  view: "grid" | "list";
  selected: Set<string>;
  onSelect: (id: string, multi: boolean) => void;
  onRowClick: (asset: MediaAsset) => void;
  onCopyUrl: (asset: MediaAsset) => void;
  onArchive: (asset: MediaAsset) => void;
  onDelete: (asset: MediaAsset) => void;
}

// ── Shared helpers ────────────────────────────────────────────────

const TYPE_ICONS: Record<AssetType, React.ReactNode> = {
  image: <ImageIcon size={20} />,
  audio: <Music2 size={20} />,
  video: <Video size={20} />,
  document: <FileText size={20} />,
  zip: <Archive size={20} />,
  other: <File size={20} />,
};

const TYPE_COLORS: Record<AssetType, string> = {
  image: "text-accent",
  audio: "text-[color:var(--accent-magenta)]",
  video: "text-accent-cyan",
  document: "text-[color:var(--color-warning)]",
  zip: "text-success",
  other: "text-[color:var(--text-muted)]",
};

function fmtSize(bytes: number) {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(0)} KB`;
  return `${bytes} B`;
}

function fmtDuration(sec: number) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function CopyButton({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={e => { onClick(e); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      title="Copy URL"
      className="w-7 h-7 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors"
    >
      {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
    </button>
  );
}

// ── Grid card ─────────────────────────────────────────────────────

function MediaCard({
  asset, selected, onSelect, onRowClick, onCopyUrl, onArchive, onDelete,
}: {
  asset: MediaAsset;
  selected: boolean;
  onSelect: (multi: boolean) => void;
  onRowClick: () => void;
  onCopyUrl: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={e => { if (e.shiftKey || e.metaKey || e.ctrlKey) onSelect(true); else onRowClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        "relative bg-surface border rounded-[10px] overflow-hidden cursor-pointer flex flex-col transition-all duration-150",
        selected
          ? "border-accent ring-1 ring-accent/30"
          : hovered
            ? "border-[color:var(--border-default)] -translate-y-0.5 shadow-[var(--shadow-card)]"
            : "border-[color:var(--border-subtle)]",
      ].join(" ")}
    >
      {/* Checkbox */}
      <button
        onClick={e => { e.stopPropagation(); onSelect(e.shiftKey || e.metaKey || e.ctrlKey); }}
        className={[
          "absolute top-2 left-2 z-10 w-5 h-5 rounded-[10px] border-2 flex items-center justify-center transition-all",
          selected
            ? "bg-accent border-accent"
            : "bg-black/40 border-white/40 backdrop-blur-sm",
          hovered || selected ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        {selected && <Check size={10} className="text-white" />}
      </button>

      {/* Thumbnail / icon */}
      <div className="aspect-square bg-elevated overflow-hidden flex items-center justify-center relative">
        {asset.thumbnailUrl
          ? <img src={asset.thumbnailUrl} alt={asset.metadata.altText || asset.filename} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          : (
            <div className={`flex flex-col items-center gap-2 ${TYPE_COLORS[asset.assetType]}`}>
              {TYPE_ICONS[asset.assetType]}
              <span className="text-[10px] font-bold uppercase text-[color:var(--text-muted)]">{asset.extension}</span>
            </div>
          )
        }

        {/* Hover overlay */}
        <div className={[
          "absolute inset-0 bg-black/60 flex items-center justify-center gap-1.5 transition-opacity duration-200",
          hovered ? "opacity-100" : "opacity-0",
        ].join(" ")} onClick={e => e.stopPropagation()}>
          <button onClick={onRowClick} title="Preview" className="w-8 h-8 rounded-[10px] bg-white/10 border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white/25 transition-colors backdrop-blur-sm"><Eye size={14} /></button>
          <CopyButton onClick={e => { e.stopPropagation(); onCopyUrl(); }} />
          <button onClick={onArchive} title="Archive" className="w-8 h-8 rounded-[10px] bg-white/10 border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white/25 transition-colors backdrop-blur-sm"><Archive size={14} /></button>
        </div>

        {/* Duration badge */}
        {asset.duration !== null && (
          <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-[10px] bg-black/70 text-white text-[10px] font-bold">
            {fmtDuration(asset.duration)}
          </div>
        )}

        {/* Usage badge */}
        {asset.usageCount > 0 && (
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-[10px] bg-black/70 text-[10px] text-white">
            <LinkIcon size={9} /> {asset.usageCount}
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="p-3 flex flex-col gap-1">
        <p className="text-xs font-semibold text-foreground truncate">{asset.filename}</p>
        <div className="flex items-center justify-between text-[10px] text-[color:var(--text-muted)]">
          <span className="uppercase font-semibold">{asset.extension}</span>
          <span>{fmtSize(asset.size)}</span>
        </div>
        {asset.width && asset.height && (
          <p className="text-[10px] text-[color:var(--text-muted)]">{asset.width}×{asset.height}</p>
        )}
      </div>
    </div>
  );
}

// ── List row ──────────────────────────────────────────────────────

function MediaListRow({
  asset, selected, onSelect, onRowClick, onCopyUrl, onArchive, onDelete,
}: {
  asset: MediaAsset;
  selected: boolean;
  onSelect: (multi: boolean) => void;
  onRowClick: () => void;
  onCopyUrl: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onRowClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        "flex items-center gap-3 px-4 py-3 border-b border-[color:var(--border-subtle)] last:border-0 cursor-pointer transition-colors",
        selected ? "bg-accent/5" : hovered ? "bg-elevated/50" : "",
      ].join(" ")}
    >
      {/* Checkbox */}
      <button
        onClick={e => { e.stopPropagation(); onSelect(e.shiftKey || e.metaKey || e.ctrlKey); }}
        className={[
          "w-5 h-5 rounded-[10px] border-2 flex items-center justify-center transition-all shrink-0",
          selected ? "bg-accent border-accent" : "border-[color:var(--border-default)] bg-transparent",
        ].join(" ")}
      >
        {selected && <Check size={10} className="text-white" />}
      </button>

      {/* Thumbnail */}
      <div className="w-10 h-10 rounded-lg bg-elevated overflow-hidden flex items-center justify-center shrink-0 border border-[color:var(--border-subtle)]">
        {asset.thumbnailUrl
          ? <img src={asset.thumbnailUrl} alt={asset.filename} className="w-full h-full object-cover" />
          : <span className={`${TYPE_COLORS[asset.assetType]}`}>{TYPE_ICONS[asset.assetType]}</span>
        }
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{asset.filename}</p>
        <p className="text-[11px] text-[color:var(--text-muted)] truncate">{asset.originalFilename}</p>
      </div>

      {/* Type */}
      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-elevated text-[color:var(--text-muted)] w-16 text-center shrink-0">{asset.extension}</span>

      {/* Size */}
      <span className="text-xs text-[color:var(--text-secondary)] w-16 text-right shrink-0 tabular-nums">{fmtSize(asset.size)}</span>

      {/* Dimensions or duration */}
      <span className="text-xs text-[color:var(--text-muted)] w-24 text-right shrink-0">
        {asset.width && asset.height ? `${asset.width}×${asset.height}` : asset.duration ? fmtDuration(asset.duration) : "—"}
      </span>

      {/* Usage */}
      <div className="flex items-center gap-1 w-14 text-right shrink-0 justify-end">
        {asset.usageCount > 0 ? (
          <span className="text-xs font-semibold text-accent flex items-center gap-1">
            <LinkIcon size={10} /> {asset.usageCount}
          </span>
        ) : (
          <span className="text-xs text-[color:var(--text-muted)]">—</span>
        )}
      </div>

      {/* Date */}
      <span className="text-[11px] text-[color:var(--text-muted)] w-24 text-right shrink-0 whitespace-nowrap">
        {new Date(asset.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </span>

      {/* Actions */}
      <div
        className={[
          "flex items-center gap-1 shrink-0 transition-opacity",
          hovered || selected ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onRowClick} title="Preview" className="w-7 h-7 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors"><Eye size={13} /></button>
        <CopyButton onClick={e => { e.stopPropagation(); onCopyUrl(); }} />
        <button onClick={onArchive} title="Archive" className="w-7 h-7 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors"><Archive size={13} /></button>
        <button onClick={onDelete} title="Delete" className="w-7 h-7 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-danger/10 hover:text-danger transition-colors"><Trash2 size={13} /></button>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────

export default function MediaGrid({ assets, view, selected, onSelect, onRowClick, onCopyUrl, onArchive, onDelete }: GridProps) {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
          <ImageIcon size={28} className="text-accent" />
        </div>
        <p className="text-base font-bold text-foreground mb-1">No assets found</p>
        <p className="text-sm text-[color:var(--text-muted)]">Upload files or adjust your filters.</p>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="bg-surface border border-[color:var(--border-subtle)] rounded-xl overflow-hidden">
        {/* List header */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-[color:var(--border-subtle)] bg-elevated/30">
          <div className="w-5 shrink-0" />
          <div className="w-10 shrink-0" />
          <div className="flex-1 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">File</div>
          <div className="w-16 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--text-muted)] text-center">Type</div>
          <div className="w-16 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--text-muted)] text-right">Size</div>
          <div className="w-24 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--text-muted)] text-right">Dimensions</div>
          <div className="w-14 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--text-muted)] text-right">Usage</div>
          <div className="w-24 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--text-muted)] text-right">Uploaded</div>
          <div className="w-28 shrink-0" />
        </div>
        {assets.map(asset => (
          <MediaListRow
            key={asset.id}
            asset={asset}
            selected={selected.has(asset.id)}
            onSelect={multi => onSelect(asset.id, multi)}
            onRowClick={() => onRowClick(asset)}
            onCopyUrl={() => onCopyUrl(asset)}
            onArchive={() => onArchive(asset)}
            onDelete={() => onDelete(asset)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
      {assets.map(asset => (
        <MediaCard
          key={asset.id}
          asset={asset}
          selected={selected.has(asset.id)}
          onSelect={multi => onSelect(asset.id, multi)}
          onRowClick={() => onRowClick(asset)}
          onCopyUrl={() => onCopyUrl(asset)}
          onArchive={() => onArchive(asset)}
          onDelete={() => onDelete(asset)}
        />
      ))}
    </div>
  );
}
