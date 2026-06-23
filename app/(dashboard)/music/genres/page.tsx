// app/(dashboard)/music/genres/page.tsx

"use client";

import { useState, useMemo } from "react";
import type { Genre, GenreDetail, GenreFilters, GenreFormValues } from "@/services/genres/types";
import { MOCK_GENRES, MOCK_GENRE_DETAILS } from "@/services/genres/mock-data";
import GenresHeader from "@/components/genres/GenresHeader";
import GenresToolbar from "@/components/genres/GenresToolbar";
import GenreGrid from "@/components/genres/GenreGrid";
import GenreTableView from "@/components/genres/GenreTableView";
import GenreDrawer from "@/components/genres/GenreDrawer";
import GenreFormModal from "@/components/genres/GenreFormModal";

const DEFAULT_FILTERS: GenreFilters = {
  search: "",
  status: "ALL",
  sort: "tracks",
  view: "grid",
};

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>(MOCK_GENRES);
  const [filters, setFilters] = useState<GenreFilters>(DEFAULT_FILTERS);
  const [drawerGenre, setDrawerGenre] = useState<GenreDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);

  // ---- filtering + sorting ----
  const displayed = useMemo(() => {
    let list = [...genres];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(g =>
        g.name.toLowerCase().includes(q) ||
        g.slug.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
      );
    }

    if (filters.status === "ACTIVE") list = list.filter(g => g.isActive);
    if (filters.status === "ARCHIVED") list = list.filter(g => !g.isActive);

    if (filters.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (filters.sort === "tracks") list.sort((a, b) => b.trackCount - a.trackCount);
    else if (filters.sort === "createdAt") list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return list;
  }, [genres, filters]);

  // ---- handlers ----
  const openDrawer = (genre: Genre) => {
    const detail = MOCK_GENRE_DETAILS[genre.id] ?? { ...genre, subgenres: [] };
    setDrawerGenre(detail);
  };

  const openCreate = () => { setEditingGenre(null); setModalOpen(true); };
  const openEdit = (genre: Genre) => { setEditingGenre(genre); setModalOpen(true); };

  const handleArchive = (genre: Genre) => {
    setGenres(prev => prev.map(g => g.id === genre.id ? { ...g, isActive: !g.isActive } : g));
    if (drawerGenre?.id === genre.id) setDrawerGenre(null);
  };

  const handleSave = async (data: GenreFormValues, id?: string) => {
    await new Promise(res => setTimeout(res, 400));
    if (id) {
      setGenres(prev => prev.map(g => g.id === id ? {
        ...g,
        name: data.name, slug: data.slug, description: data.description,
        accentColor: data.accentColor, icon: data.icon, isActive: data.isActive,
        seoTitle: data.seoTitle, seoDescription: data.seoDescription,
        imageUrl: data.imageUrl, updatedAt: new Date().toISOString(),
      } : g));
    } else {
      const newGenre: Genre = {
        id: `g-${Date.now()}`,
        name: data.name, slug: data.slug, description: data.description,
        imageUrl: data.imageUrl, accentColor: data.accentColor, icon: data.icon,
        isActive: data.isActive, seoTitle: data.seoTitle, seoDescription: data.seoDescription,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        trackCount: 0, artistCount: 0, collectionCount: 0,
        totalSales: 0, totalRevenue: 0, totalDownloads: 0,
      };
      setGenres(prev => [newGenre, ...prev]);
    }
  };

  const handleAddSubgenre = (genreId: string, name: string) => {
    if (!drawerGenre) return;
    const newSub = {
      id: `sub-${Date.now()}`,
      genreId,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: "",
      orderIndex: drawerGenre.subgenres.length,
      isActive: true,
      trackCount: 0,
    };
    setDrawerGenre(prev => prev ? { ...prev, subgenres: [...prev.subgenres, newSub] } : prev);
  };

  const handleDeleteSubgenre = (subId: string) => {
    setDrawerGenre(prev => prev ? { ...prev, subgenres: prev.subgenres.filter(s => s.id !== subId) } : prev);
  };

  return (
    <div className="flex flex-col gap-6">
      <GenresHeader
        onCreateGenre={openCreate}
        onImport={() => alert("Import from CSV — coming soon")}
      />

      <GenresToolbar
        filters={filters}
        onChange={patch => setFilters(prev => ({ ...prev, ...patch }))}
        total={displayed.length}
      />

      {filters.view === "grid" ? (
        <GenreGrid
          genres={displayed}
          onCardClick={openDrawer}
          onEdit={openEdit}
          onArchive={handleArchive}
        />
      ) : (
        <GenreTableView
          genres={displayed}
          onRowClick={openDrawer}
          onEdit={openEdit}
          onArchive={handleArchive}
        />
      )}

      <GenreDrawer
        genre={drawerGenre}
        onClose={() => setDrawerGenre(null)}
        onEdit={g => { openEdit(g); setDrawerGenre(null); }}
        onAddSubgenre={handleAddSubgenre}
        onDeleteSubgenre={handleDeleteSubgenre}
      />

      <GenreFormModal
        open={modalOpen}
        genre={editingGenre}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
