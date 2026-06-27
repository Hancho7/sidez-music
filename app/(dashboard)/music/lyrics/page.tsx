// app/(dashboard)/music/lyrics/page.tsx

"use client";

import { useState, useMemo, useCallback } from "react";
import LyricsHeader from "@/components/lyrics/LyricsHeader";
import LyricsToolbar from "@/components/lyrics/LyricsToolbar";
import MetadataTable from "@/components/lyrics/MetadataTable";
import MetadataDrawer from "@/components/lyrics/MetadataDrawer";
import MetadataFormModal from "@/components/lyrics/MetadataFormModal";
import { MOCK_METADATA } from "@/services/lyrics/mock-data";
import type { TrackMetadata, MetadataFilters, LyricsStatus, CreditFormData, CopyrightFormData, PublishingFormData, Language } from "@/services/lyrics/types";

// ── Default Filters ──

const DEFAULT_FILTERS: MetadataFilters = {
  search: "",
  hasLyrics: "all",
  explicit: "all",
  status: "all",
  language: "all",
  sort: "recent",
};

// ── Helpers ──

function applyFilters(items: TrackMetadata[], filters: MetadataFilters): TrackMetadata[] {
  let result = [...items];

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      item =>
        item.trackName.toLowerCase().includes(q) ||
        item.artistName.toLowerCase().includes(q) ||
        item.lyrics.lyrics.toLowerCase().includes(q)
    );
  }

  if (filters.hasLyrics === "yes") {
    result = result.filter(item => item.lyrics.lyrics.trim().length > 0);
  } else if (filters.hasLyrics === "no") {
    result = result.filter(item => item.lyrics.lyrics.trim().length === 0);
  }

  if (filters.explicit === "yes") {
    result = result.filter(item => item.publishing.isExplicit);
  } else if (filters.explicit === "no") {
    result = result.filter(item => !item.publishing.isExplicit);
  }

  if (filters.status !== "all") {
    if (filters.status === "published") {
      result = result.filter(item => item.publishedAt !== null);
    } else if (filters.status === "archived") {
      result = result.filter(item => item.archivedAt !== null);
    } else {
      result = result.filter(item => item.publishedAt === null && item.archivedAt === null);
    }
  }

  if (filters.language !== "all") {
    result = result.filter(item => item.lyrics.language === filters.language);
  }

  switch (filters.sort) {
    case "alpha":
      result.sort((a, b) => a.trackName.localeCompare(b.trackName));
      break;
    case "popular":
      result.sort((a, b) => (a.credits.length || 0) - (b.credits.length || 0));
      break;
    case "recent":
    default:
      result.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
      break;
  }

  return result;
}

// ── Page ──

// Mirrors FormState in MetadataFormModal — kept in sync so the onSave
// signature is compatible without exporting FormState from the modal.
interface SaveData {
  trackId: string;
  trackName: string;
  artistName: string;
  language: Language;
  lyrics: string;
  status: LyricsStatus;
  credits: (CreditFormData & { id: string; trackId?: string })[];
  copyright: CopyrightFormData;
  publishing: PublishingFormData;
}

interface DrawerSaveData {
  lyrics?: string;
}

export default function LyricsPage() {
  const [metadata, setMetadata] = useState<TrackMetadata[]>(MOCK_METADATA);
  const [filters, setFilters] = useState<MetadataFilters>(DEFAULT_FILTERS);
  const [drawerItem, setDrawerItem] = useState<TrackMetadata | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TrackMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredMetadata = useMemo(
    () => applyFilters(metadata, filters),
    [metadata, filters]
  );

  // ── Handlers ──

  const openCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEdit = (item: TrackMetadata) => {
    setEditingItem(item);
    setDrawerItem(null);
    setModalOpen(true);
  };

  const handleSave = async (data: SaveData, id?: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));

    if (id) {
      setMetadata(prev =>
        prev.map(item =>
          item.id === id
            ? {
              ...item,
              trackName: data.trackName,
              artistName: data.artistName,
              // Reconstruct the nested lyrics object — never spread flat SaveData fields
              // directly onto TrackMetadata, since `data.lyrics` is a string but
              // `item.lyrics` is a TrackLyrics object.
              lyrics: {
                ...item.lyrics,
                lyrics: data.lyrics,
                language: data.language,
              },
              status: data.status,
              credits: data.credits.map(c => ({ ...c, trackId: c.trackId ?? item.trackId })),
              copyright: { ...item.copyright, ...data.copyright },
              publishing: { ...item.publishing, ...data.publishing },
              lastUpdated: new Date().toISOString(),
              updatedBy: "Current User",
            }
            : item
        )
      );
      if (drawerItem?.id === id) {
        setDrawerItem(prev =>
          prev
            ? {
              ...prev,
              trackName: data.trackName,
              artistName: data.artistName,
              lyrics: { ...prev.lyrics, lyrics: data.lyrics, language: data.language },
              status: data.status,
              credits: data.credits.map(c => ({ ...c, trackId: c.trackId ?? prev.trackId })),
              copyright: { ...prev.copyright, ...data.copyright },
              publishing: { ...prev.publishing, ...data.publishing },
            }
            : null
        );
      }
    } else {
      const now = new Date().toISOString();
      const newItem: TrackMetadata = {
        id: `meta_${Date.now()}`,
        trackId: data.trackId,
        trackName: data.trackName || "New Track",
        artistName: data.artistName || "Unknown Artist",
        artistId: `art_${Date.now()}`,
        coverImage: null,
        lyrics: {
          id: `lyr_${Date.now()}`,
          trackId: data.trackId,
          language: data.language ?? "en",
          lyrics: data.lyrics ?? "",
          translatedLyrics: {},
          wordCount: 0,
          readingTime: 0,
          isSynchronized: false,
        },
        credits: data.credits.map(c => ({ ...c, trackId: c.trackId ?? data.trackId })) ?? [],
        copyright: {
          id: `copy_${Date.now()}`,
          trackId: data.trackId,
          ...data.copyright,
        },
        publishing: {
          id: `pub_${Date.now()}`,
          trackId: data.trackId,
          ...data.publishing,
        },
        status: data.status ?? "PENDING",
        lastUpdated: now,
        updatedBy: "Current User",
        createdAt: now,
        updatedAt: now,
        publishedAt: null,
        archivedAt: null,
      };
      setMetadata(prev => [newItem, ...prev]);
    }
    setIsLoading(false);
  };

  const handleArchive = useCallback((item: TrackMetadata) => {
    const isArchived = item.archivedAt !== null;
    if (!isArchived && !window.confirm(`Archive metadata for "${item.trackName}"?`)) return;

    setMetadata(prev =>
      prev.map(m =>
        m.id === item.id
          ? {
            ...m,
            archivedAt: isArchived ? null : new Date().toISOString(),
            status: isArchived ? "PENDING" : m.status,
            lastUpdated: new Date().toISOString(),
          }
          : m
      )
    );
    if (drawerItem?.id === item.id) {
      setDrawerItem(prev =>
        prev ? { ...prev, archivedAt: isArchived ? null : new Date().toISOString() } : null
      );
    }
  }, [drawerItem]);

  const handleDrawerSave = useCallback((data: DrawerSaveData) => {
    if (drawerItem) {
      setMetadata(prev =>
        prev.map(m =>
          m.id === drawerItem.id
            ? {
              ...m,
              lyrics: { ...m.lyrics, lyrics: data.lyrics ?? m.lyrics.lyrics },
              lastUpdated: new Date().toISOString(),
            }
            : m
        )
      );
      setDrawerItem(prev =>
        prev
          ? { ...prev, lyrics: { ...prev.lyrics, lyrics: data.lyrics ?? prev.lyrics.lyrics } }
          : null
      );
    }
  }, [drawerItem]);

  // ── Render ──

  return (
    <div className="flex flex-col gap-6">

      <LyricsHeader
        onCreate={openCreate}
        totalCount={filteredMetadata.length}
      />

      <LyricsToolbar
        filters={filters}
        onChange={patch => setFilters(prev => ({ ...prev, ...patch }))}
      />

      <MetadataTable
        metadata={filteredMetadata}
        onRowClick={setDrawerItem}
        onEdit={openEdit}
        onArchive={handleArchive}
        isLoading={isLoading}
      />

      <MetadataDrawer
        metadata={drawerItem}
        onClose={() => setDrawerItem(null)}
        onEdit={openEdit}
        onSave={handleDrawerSave}
      />

      <MetadataFormModal
        open={modalOpen}
        metadata={editingItem}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

    </div>
  );
}
