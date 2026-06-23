// app/(dashboard)/music/tracks/page.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import TrackHeader from "@/components/tracks/TrackHeader";
import TrackToolbar from "@/components/tracks/TrackToolbar";
import TrackTable from "@/components/tracks/TrackTable";
import TrackDrawer from "@/components/tracks/TrackDrawer";
import TrackFormModal from "@/components/tracks/TrackFormModal";
import { MOCK_TRACKS } from "@/services/tracks/mock-data";
import type { Track, TrackFilters, TrackFormData } from "@/services/tracks/types";

// ── Helpers ──────────────────────────────────────────────────────────

function applyFilters(tracks: Track[], filters: TrackFilters): Track[] {
  let result = [...tracks];

  // Search
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      t =>
        t.title.toLowerCase().includes(q) ||
        t.artistName.toLowerCase().includes(q) ||
        t.genre.toLowerCase().includes(q) ||
        t.mood.some(m => m.toLowerCase().includes(q))
    );
  }

  // Genre
  if (filters.genre !== "all") {
    result = result.filter(t => t.genre === filters.genre);
  }

  // Status
  if (filters.status !== "all") {
    result = result.filter(t => t.status === filters.status);
  }

  // Sort
  switch (filters.sort) {
    case "oldest":
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case "most_sold":
      result.sort((a, b) => b.analytics.salesCount - a.analytics.salesCount);
      break;
    case "most_played":
      result.sort((a, b) => b.analytics.plays - a.analytics.plays);
      break;
    case "newest":
    default:
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return result;
}

const DEFAULT_FILTERS: TrackFilters = {
  search: "",
  genre: "all",
  status: "all",
  sort: "newest",
};

// ── Page ─────────────────────────────────────────────────────────────

export default function TracksPage() {
  // Data state — in production this would come from SWR / React Query
  const [tracks, setTracks] = useState<Track[]>(MOCK_TRACKS);

  // UI state
  const [filters, setFilters] = useState<TrackFilters>(DEFAULT_FILTERS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [drawerTrack, setDrawerTrack] = useState<Track | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);

  // Derived
  const filteredTracks = useMemo(() => applyFilters(tracks, filters), [tracks, filters]);

  // ── Selection handlers ──

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds(prev =>
      prev.size === filteredTracks.length
        ? new Set()
        : new Set(filteredTracks.map(t => t.id))
    );
  }, [filteredTracks]);

  // ── Action handlers ──

  const openCreate = () => {
    setEditingTrack(null);
    setModalOpen(true);
  };

  const openEdit = (track: Track) => {
    setEditingTrack(track);
    setDrawerTrack(null);
    setModalOpen(true);
  };

  const handleSave = async (data: TrackFormData, id?: string) => {
    // Simulate API call delay
    await new Promise(r => setTimeout(r, 600));

    if (id) {
      // Optimistic update — edit existing track
      setTracks(prev =>
        prev.map(t =>
          t.id === id
            ? {
              ...t,
              title: data.title,
              description: data.description,
              artistName: data.artistName,
              genre: data.genre as Track["genre"],
              mood: data.mood,
              bpm: Number(data.bpm) || t.bpm,
              key: data.key as Track["key"],
              duration: Number(data.duration) || t.duration,
              status: data.status,
              isFeatured: data.isFeatured,
              licenses: data.licenses.map((l, i) => ({
                id: l.id.startsWith("draft-") ? `lic_${id}_${i}` : l.id,
                trackId: id,
                name: l.name,
                price: parseFloat(l.price) || 0,
                streamLimit: l.streamLimit ? parseInt(l.streamLimit) : null,
                distributionLimit: l.distributionLimit ? parseInt(l.distributionLimit) : null,
                commercialUse: l.commercialUse,
              })),
            }
            : t
        )
      );
    } else {
      // Create new track
      const newTrack: Track = {
        id: `trk_${Date.now()}`,
        title: data.title,
        description: data.description,
        artistId: `art_${Date.now()}`,
        artistName: data.artistName,
        genre: data.genre as Track["genre"],
        mood: data.mood,
        bpm: Number(data.bpm) || 120,
        key: (data.key as Track["key"]) || "C",
        duration: Number(data.duration) || 180,
        coverImage: null,
        audioUrl: null,
        previewUrl: null,
        status: data.status,
        isFeatured: data.isFeatured,
        createdAt: new Date().toISOString(),
        licenses: data.licenses.map((l, i) => ({
          id: `lic_new_${i}`,
          trackId: `trk_${Date.now()}`,
          name: l.name,
          price: parseFloat(l.price) || 0,
          streamLimit: l.streamLimit ? parseInt(l.streamLimit) : null,
          distributionLimit: l.distributionLimit ? parseInt(l.distributionLimit) : null,
          commercialUse: l.commercialUse,
        })),
        analytics: { salesCount: 0, revenue: 0, plays: 0, downloads: 0 },
      };
      setTracks(prev => [newTrack, ...prev]);
    }
  };

  const handleStatusToggle = useCallback((track: Track) => {
    const next: Track["status"] =
      track.status === "published" ? "draft" :
        track.status === "draft" ? "published" :
          "published";
    setTracks(prev => prev.map(t => t.id === track.id ? { ...t, status: next } : t));
    // Keep drawer in sync
    if (drawerTrack?.id === track.id) setDrawerTrack(prev => prev ? { ...prev, status: next } : prev);
  }, [drawerTrack]);

  const handleDuplicate = useCallback((track: Track) => {
    const clone: Track = {
      ...track,
      id: `trk_${Date.now()}`,
      title: `${track.title} (Copy)`,
      status: "draft",
      isFeatured: false,
      createdAt: new Date().toISOString(),
      analytics: { salesCount: 0, revenue: 0, plays: 0, downloads: 0 },
      licenses: track.licenses.map((l, i) => ({ ...l, id: `lic_clone_${i}`, trackId: `trk_${Date.now()}` })),
    };
    setTracks(prev => [clone, ...prev]);
  }, []);

  const handleArchive = useCallback((track: Track) => {
    setTracks(prev => prev.map(t => t.id === track.id ? { ...t, status: "archived" } : t));
    if (drawerTrack?.id === track.id) setDrawerTrack(null);
  }, [drawerTrack]);

  const handleDelete = useCallback((track: Track) => {
    if (!window.confirm(`Delete "${track.title}"? This cannot be undone.`)) return;
    setTracks(prev => prev.filter(t => t.id !== track.id));
    setSelectedIds(prev => { const next = new Set(prev); next.delete(track.id); return next; });
    if (drawerTrack?.id === track.id) setDrawerTrack(null);
  }, [drawerTrack]);

  const handleBulkArchive = useCallback(() => {
    setTracks(prev => prev.map(t => selectedIds.has(t.id) ? { ...t, status: "archived" as const } : t));
    setSelectedIds(new Set());
  }, [selectedIds]);

  const handleBulkDelete = useCallback(() => {
    if (!window.confirm(`Delete ${selectedIds.size} track(s)? This cannot be undone.`)) return;
    setTracks(prev => prev.filter(t => !selectedIds.has(t.id)));
    setSelectedIds(new Set());
  }, [selectedIds]);

  const handleManageLicenses = useCallback((track: Track) => {
    // Open the drawer on the licensing tab — easiest UX is to open edit modal on licensing tab
    setEditingTrack(track);
    setModalOpen(true);
  }, []);

  // ── Render ──

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <TrackHeader
        onUpload={openCreate}
        selectedCount={selectedIds.size}
        onBulkArchive={handleBulkArchive}
        onBulkDelete={handleBulkDelete}
      />

      {/* Toolbar */}
      <TrackToolbar
        filters={filters}
        onChange={patch => setFilters(prev => ({ ...prev, ...patch }))}
        total={filteredTracks.length}
      />

      {/* Table */}
      <TrackTable
        tracks={filteredTracks}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        onRowClick={setDrawerTrack}
        onEdit={openEdit}
        onManageLicenses={handleManageLicenses}
        onDuplicate={handleDuplicate}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onStatusToggle={handleStatusToggle}
      />

      {/* Drawer */}
      <TrackDrawer
        track={drawerTrack}
        onClose={() => setDrawerTrack(null)}
        onEdit={openEdit}
      />

      {/* Create / Edit Modal */}
      <TrackFormModal
        open={modalOpen}
        track={editingTrack}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

    </div>
  );
}
