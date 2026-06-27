// app/(dashboard)/music/artists/page.tsx

"use client";

import { useState, useMemo, useCallback } from "react";
import ArtistsHeader from "@/components/artists/ArtistsHeader";
import ArtistsToolbar from "@/components/artists/ArtistsToolbar";
import ArtistGrid from "@/components/artists/ArtistGrid";
import ArtistTableView from "@/components/artists/ArtistTableView";
import ArtistDrawer from "@/components/artists/ArtistDrawer";
import ArtistFormModal from "@/components/artists/ArtistFormModal";
import { MOCK_ARTISTS } from "@/services/artists/mock-data";
import type { Artist, ArtistFilters, ArtistFormValues } from "@/services/artists/types";

// ── Default Filters ──

const DEFAULT_FILTERS: ArtistFilters = {
  search: "",
  status: "all",
  sort: "recent",
  view: "card",
};

// ── Helpers ──

function applyFilters(artists: Artist[], filters: ArtistFilters): Artist[] {
  let result = [...artists];

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      a =>
        a.stageName.toLowerCase().includes(q) ||
        (a.realName?.toLowerCase().includes(q) ?? false) ||
        a.email.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q) ||
        a.genres.some(g => g.toLowerCase().includes(q))
    );
  }

  switch (filters.status) {
    case "active": result = result.filter(a => a.status === "active"); break;
    case "archived": result = result.filter(a => a.status === "archived"); break;
    case "verified": result = result.filter(a => a.isVerified); break;
    default: break;
  }

  switch (filters.sort) {
    case "alpha": result.sort((a, b) => a.stageName.localeCompare(b.stageName)); break;
    case "tracks": result.sort((a, b) => b.totalTracks - a.totalTracks); break;
    case "revenue": result.sort((a, b) => b.totalRevenue - a.totalRevenue); break;
    default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
  }

  return result;
}

// ── Page ──

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>(MOCK_ARTISTS);
  const [filters, setFilters] = useState<ArtistFilters>(DEFAULT_FILTERS);
  const [drawerArtist, setDrawerArtist] = useState<Artist | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);

  const filteredArtists = useMemo(() => applyFilters(artists, filters), [artists, filters]);

  const openCreate = () => { setEditingArtist(null); setModalOpen(true); };
  const openEdit = (artist: Artist) => { setEditingArtist(artist); setDrawerArtist(null); setModalOpen(true); };

  const handleSave = async (data: ArtistFormValues, id?: string) => {
    await new Promise(r => setTimeout(r, 500));

    const patch: Partial<Artist> = {
      stageName: data.stageName,
      realName: data.realName || null,
      biography: data.biography,
      country: data.country,
      primaryGenre: data.primaryGenre,
      genres: data.genres,
      artistType: data.artistType,
      isVerified: data.isVerified,
      isFeatured: data.isFeatured,
      status: data.status,
      email: data.email,
      phone: data.phone || null,
      website: data.website || null,
      managementCompany: data.managementCompany || null,
      bookingEmail: data.bookingEmail || null,
      socials: data.socials,
      updatedAt: new Date().toISOString(),
    };

    if (id) {
      setArtists(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
      if (drawerArtist?.id === id) {
        setDrawerArtist(prev => prev ? { ...prev, ...patch } : null);
      }
    } else {
      const newArtist: Artist = {
        id: `art_${Date.now()}`,
        profileImage: null,
        bannerImage: null,
        totalTracks: 0,
        totalCollections: 0,
        totalSales: 0,
        totalRevenue: 0,
        totalDownloads: 0,
        totalStreams: 0,
        createdAt: new Date().toISOString(),
        tracks: [],
        collections: [],
        ...patch,
        // patch.updatedAt already set above; these fields are required on Artist
        stageName: data.stageName,
        realName: data.realName || null,
        biography: data.biography,
        country: data.country,
        primaryGenre: data.primaryGenre,
        genres: data.genres,
        artistType: data.artistType,
        isVerified: data.isVerified,
        isFeatured: data.isFeatured,
        status: data.status,
        email: data.email,
        phone: data.phone || null,
        website: data.website || null,
        managementCompany: data.managementCompany || null,
        bookingEmail: data.bookingEmail || null,
        socials: data.socials,
        updatedAt: new Date().toISOString(),
      };
      setArtists(prev => [newArtist, ...prev]);
    }
  };

  const handleArchive = useCallback((artist: Artist) => {
    const nextStatus = artist.status === "archived" ? "active" : "archived";
    const patch = { status: nextStatus, updatedAt: new Date().toISOString() } as const;
    setArtists(prev => prev.map(a => a.id === artist.id ? { ...a, ...patch } : a));
    if (drawerArtist?.id === artist.id) {
      setDrawerArtist(prev => prev ? { ...prev, ...patch } : null);
    }
  }, [drawerArtist]);

  const handleImport = useCallback(() => { alert("Artist import dialog would open here."); }, []);

  return (
    <div className="flex flex-col gap-6">
      <ArtistsHeader onCreateArtist={openCreate} onImport={handleImport} />
      <ArtistsToolbar filters={filters} onChange={patch => setFilters(prev => ({ ...prev, ...patch }))} total={filteredArtists.length} />

      {filters.view === "card" ? (
        <ArtistGrid artists={filteredArtists} onCardClick={setDrawerArtist} onEdit={openEdit} onArchive={handleArchive} />
      ) : (
        <ArtistTableView artists={filteredArtists} onRowClick={setDrawerArtist} onEdit={openEdit} onArchive={handleArchive} />
      )}

      <ArtistDrawer artist={drawerArtist} onClose={() => setDrawerArtist(null)} onEdit={openEdit} />
      <ArtistFormModal open={modalOpen} artist={editingArtist} onClose={() => setModalOpen(false)} onSave={handleSave} />
    </div>
  );
}
