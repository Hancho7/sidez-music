// app/(dashboard)/media/page.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import MediaHeader from "@/components/media/MediaHeader";
import MediaToolbar from "@/components/media/MediaToolbar";
import MediaGrid from "@/components/media/MediaGrid";
import MediaDrawer from "@/components/media/MediaDrawer";
import UploadModal from "@/components/media/UploadModal";
import { MOCK_ASSETS } from "@/services/media/mock-data";
import type { MediaAsset, MediaFilters, AssetType } from "@/services/media/types";

const DEFAULT_FILTERS: MediaFilters = {
  search: "", type: "all", sort: "newest", view: "grid",
};

export default function MediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>(MOCK_ASSETS);
  const [filters, setFilters] = useState<MediaFilters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawerAsset, setDrawerAsset] = useState<MediaAsset | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  // ── Filtering ────────────────────────────────────────────────

  const displayed = useMemo(() => {
    let list = [...assets];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(a =>
        a.filename.toLowerCase().includes(q) ||
        a.originalFilename.toLowerCase().includes(q) ||
        a.metadata.tags.some(t => t.toLowerCase().includes(q)) ||
        a.uploadedBy.toLowerCase().includes(q)
      );
    }

    if (filters.type !== "all") list = list.filter(a => a.assetType === filters.type);

    switch (filters.sort) {
      case "largest": list.sort((a, b) => b.size - a.size); break;
      case "smallest": list.sort((a, b) => a.size - b.size); break;
      case "most_used": list.sort((a, b) => b.usageCount - a.usageCount); break;
      case "alpha": list.sort((a, b) => a.filename.localeCompare(b.filename)); break;
      default: list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [assets, filters]);

  // Counts per type — always computed from the full unfiltered asset list
  const typeCounts = useMemo(() => {
    const counts: Partial<Record<AssetType | "all", number>> = { all: assets.length };
    assets.forEach(a => { counts[a.assetType] = (counts[a.assetType] ?? 0) + 1; });
    return counts;
  }, [assets]);

  // ── Selection ────────────────────────────────────────────────

  const handleSelect = useCallback((id: string, _multi: boolean) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  // ── Actions ──────────────────────────────────────────────────

  const handleArchive = useCallback((asset: MediaAsset) => {
    setAssets(prev => prev.map(a =>
      a.id === asset.id ? { ...a, status: "archived", updatedAt: new Date().toISOString() } : a
    ));
    if (drawerAsset?.id === asset.id) setDrawerAsset(prev => prev ? { ...prev, status: "archived" } : prev);
  }, [drawerAsset]);

  const handleDelete = useCallback((asset: MediaAsset) => {
    if (asset.usageCount > 0) {
      alert(`Cannot delete "${asset.filename}" — it is used in ${asset.usageCount} location${asset.usageCount > 1 ? "s" : ""}. Remove all references first.`);
      return;
    }
    if (!window.confirm(`Permanently delete "${asset.filename}"?`)) return;
    setAssets(prev => prev.filter(a => a.id !== asset.id));
    if (drawerAsset?.id === asset.id) setDrawerAsset(null);
  }, [drawerAsset]);

  const handleCopyUrl = useCallback((asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url || `https://cdn.sidez.com/${asset.id}`).catch(() => { });
  }, []);

  const handleBulkArchive = useCallback(() => {
    setAssets(prev => prev.map(a =>
      selected.has(a.id) ? { ...a, status: "archived", updatedAt: new Date().toISOString() } : a
    ));
    setSelected(new Set());
  }, [selected]);

  const handleBulkDelete = useCallback(() => {
    const blocked = assets.filter(a => selected.has(a.id) && a.usageCount > 0);
    if (blocked.length > 0) {
      alert(`${blocked.length} asset${blocked.length > 1 ? "s" : ""} cannot be deleted because they are in use.`);
      return;
    }
    if (!window.confirm(`Permanently delete ${selected.size} asset${selected.size > 1 ? "s" : ""}?`)) return;
    setAssets(prev => prev.filter(a => !selected.has(a.id)));
    setSelected(new Set());
  }, [assets, selected]);

  const handleUploaded = useCallback((_files: File[]) => {
    // In production: parse server response and prepend new assets
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <MediaHeader onUpload={() => setUploadOpen(true)} onCreateFolder={() => alert("Folder creation coming soon")} />

      <MediaToolbar
        filters={filters}
        onChange={patch => { setFilters(prev => ({ ...prev, ...patch })); setSelected(new Set()); }}
        total={displayed.length}
        selected={selected.size}
        onBulkArchive={handleBulkArchive}
        onBulkDelete={handleBulkDelete}
        typeCounts={typeCounts}
      />

      <MediaGrid
        assets={displayed}
        view={filters.view}
        selected={selected}
        onSelect={handleSelect}
        onRowClick={setDrawerAsset}
        onCopyUrl={handleCopyUrl}
        onArchive={handleArchive}
        onDelete={handleDelete}
      />

      <MediaDrawer
        asset={drawerAsset}
        onClose={() => setDrawerAsset(null)}
        onReplace={() => { setDrawerAsset(null); setUploadOpen(true); }}
        onArchive={handleArchive}
      />

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={handleUploaded}
      />
    </div>
  );
}
