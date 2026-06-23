// app/(dashboard)/music/collections/page.tsx
"use client";

import { useState, useMemo } from "react";
import CollectionsHeader from "@/components/collections/CollectionsHeader";
import CollectionsToolbar, {
  type CollectionFilters,
} from "@/components/collections/CollectionsToolbar";
import CollectionsGrid from "@/components/collections/CollectionsGrid";
import CollectionTableView from "@/components/collections/CollectionTableView";
import CollectionDrawer from "@/components/collections/CollectionDrawer";
import CollectionFormModal from "@/components/collections/CollectionFormModal";
import { MOCK_COLLECTIONS } from "@/services/collections/mock-data";
import type { Collection } from "@/services/collections/types";
import type { CollectionFormValues } from "@/services/collections/types";

const DEFAULT_FILTERS: CollectionFilters = {
  search: "",
  status: "all",
  sort: "recent",
  view: "grid",
};

function applyFilters(items: Collection[], f: CollectionFilters): Collection[] {
  let result = [...items];

  if (f.search.trim()) {
    const q = f.search.toLowerCase();
    result = result.filter(
      c => c.title.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)
    );
  }

  if (f.status !== "all") {
    result = result.filter(c =>
      f.status === "published" ? c.status === "PUBLISHED" : c.status !== "PUBLISHED"
    );
  }

  switch (f.sort) {
    case "alpha":
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "popular":
      result.sort((a, b) => b.totalTracks - a.totalTracks);
      break;
    case "revenue":
      result.sort((a, b) => b.totalRevenue - a.totalRevenue);
      break;
    case "recent":
    default:
      result.sort((a, b) => new Date(b.updatedAt ?? b.createdAt).getTime() - new Date(a.updatedAt ?? a.createdAt).getTime());
      break;
  }

  return result;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>(MOCK_COLLECTIONS);
  const [filters, setFilters] = useState<CollectionFilters>(DEFAULT_FILTERS);
  const [selectedDrawerId, setSelectedDrawerId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading] = useState(false);

  const filtered = useMemo(() => applyFilters(collections, filters), [collections, filters]);

  const openCreate = () => { setEditingId(null); setModalOpen(true); };
  const openEdit = (id: string) => { setEditingId(id); setModalOpen(true); setSelectedDrawerId(null); };

  const handleSave = (values: CollectionFormValues, id?: string) => {
    if (id) {
      setCollections(prev =>
        prev.map(c => c.id === id ? { ...c, ...values, updatedAt: new Date().toISOString() } : c)
      );
    } else {
      const newCollection: Collection = {
        id: `col_${Date.now()}`,
        title: values.title,
        description: values.description,
        coverImage: values.coverImage,
        status: values.status,
        isFeatured: values.isFeatured,
        totalTracks: values.trackIds.length,
        totalSales: 0,
        totalRevenue: 0,
        totalPlays: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCollections(prev => [newCollection, ...prev]);
    }
  };

  const handleArchive = (col: Collection) => {
    setCollections(prev =>
      prev.map(c =>
        c.id === col.id
          ? { ...c, status: c.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" }
          : c
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <CollectionsHeader
        total={filtered.length}
        onCreateClick={openCreate}
      />

      <CollectionsToolbar
        filters={filters}
        onChange={patch => setFilters(prev => ({ ...prev, ...patch }))}
      />

      {filters.view === "grid" ? (
        <CollectionsGrid
          collections={filtered}
          loading={isLoading}
          onSelect={setSelectedDrawerId}
          onCreateClick={openCreate}
        />
      ) : (
        <CollectionTableView
          collections={filtered}
          onRowClick={setSelectedDrawerId}
          onEdit={openEdit}
          onArchive={handleArchive}
          isLoading={isLoading}
        />
      )}

      <CollectionDrawer
        collectionId={selectedDrawerId}
        onClose={() => setSelectedDrawerId(null)}
        onEdit={openEdit}
      />

      <CollectionFormModal
        open={modalOpen}
        editingId={editingId}
        collections={collections}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
