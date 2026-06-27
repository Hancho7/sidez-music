// app/(dashboard)/store/offers/page.tsx
"use client";

import { useState, useMemo } from "react";
import OffersHeader from "@/components/offers/OffersHeader";
import OffersToolbar from "@/components/offers/OffersToolbar";
import OffersTable from "@/components/offers/OffersTable";
import OfferCard from "@/components/offers/OfferCard";
import OfferDrawer from "@/components/offers/OfferDrawer";
import OfferFormModal from "@/components/offers/OfferFormModal";
import { MOCK_OFFERS } from "@/services/offers/mock-data";
import type { Offer, OfferFilters, OfferFormValues, OfferStatus, CounterOfferFormValues } from "@/services/offers/types";

const DEFAULT_FILTERS: OfferFilters = {
  search: "", status: "all", productType: "all", sort: "newest", view: "table",
};

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>(MOCK_OFFERS);
  const [filters, setFilters] = useState<OfferFilters>(DEFAULT_FILTERS);
  const [drawerOffer, setDrawerOffer] = useState<Offer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const displayed = useMemo(() => {
    let list = [...offers];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.productTitle.toLowerCase().includes(q) ||
        o.productArtist.toLowerCase().includes(q)
      );
    }

    if (filters.status !== "all") list = list.filter(o => o.status === filters.status);
    if (filters.productType !== "all") list = list.filter(o => o.productType === filters.productType);

    switch (filters.sort) {
      case "highest": list.sort((a, b) => b.currentOfferAmount - a.currentOfferAmount); break;
      case "lowest": list.sort((a, b) => a.currentOfferAmount - b.currentOfferAmount); break;
      case "closing_soon": list.sort((a, b) => {
        if (!a.expiresAt) return 1; if (!b.expiresAt) return -1;
        return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
      }); break;
      default: list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [offers, filters]);

  const updateStatus = (id: string, status: OfferStatus, extraRevision?: Offer["revisions"][0]) => {
    const now = new Date().toISOString();
    setOffers(prev => prev.map(o => o.id !== id ? o : {
      ...o, status, updatedAt: now,
      revisions: extraRevision ? [...o.revisions, extraRevision] : o.revisions,
      history: [...o.history, { id: `hist-${Date.now()}`, offerId: id, action: status.charAt(0).toUpperCase() + status.slice(1), actorId: "admin", actorName: "John Carter", actorType: "admin", notes: "", createdAt: now }],
    }));
    if (drawerOffer?.id === id) setDrawerOffer(prev => prev ? { ...prev, status, updatedAt: now } : prev);
  };

  const handleCounter = (o: Offer, data: CounterOfferFormValues) => {
    const now = new Date().toISOString();
    const newRevision: Offer["revisions"][0] = {
      id: `rev-${Date.now()}`, offerId: o.id, submittedBy: "John Carter",
      senderType: "admin", revisionType: "counter",
      amount: Number(data.amount), message: data.message || "Counter offer submitted.", createdAt: now,
    };
    setOffers(prev => prev.map(x => x.id !== o.id ? x : {
      ...x, status: "countered", currentOfferAmount: Number(data.amount), updatedAt: now,
      revisions: [...x.revisions, newRevision],
      history: [...x.history, { id: `hist-${Date.now()}`, offerId: o.id, action: "Admin countered", actorId: "admin", actorName: "John Carter", actorType: "admin", notes: `Counter at $${data.amount}`, createdAt: now }],
    }));
    if (drawerOffer?.id === o.id) setDrawerOffer(prev => prev ? { ...prev, status: "countered", currentOfferAmount: Number(data.amount), revisions: [...prev.revisions, newRevision] } : prev);
  };

  const handleAccept = (o: Offer) => updateStatus(o.id, "accepted");
  const handleReject = (o: Offer) => updateStatus(o.id, "rejected");
  const handleArchive = (o: Offer) => {
    setOffers(prev => prev.filter(x => x.id !== o.id));
    if (drawerOffer?.id === o.id) setDrawerOffer(null);
  };

  const handleCreate = async (data: OfferFormValues) => {
    await new Promise(r => setTimeout(r, 400));
    const now = new Date().toISOString();
    const newOffer: Offer = {
      id: `OFF-${String(Math.floor(Math.random() * 9000 + 1000))}`,
      customerId: data.customerId || "cus-new",
      customerName: data.customerName, customerEmail: `${data.customerName}@example.com`, customerAvatar: null,
      productType: data.productType, productId: "new", productTitle: data.productTitle,
      productArtist: "Unknown", productCover: null, licensePlan: data.licensePlan,
      originalPrice: Number(data.originalPrice), currentOfferAmount: Number(data.offerAmount),
      status: "pending",
      expiresAt: data.expiresAt || null, assignedAdmin: "John Carter",
      revisions: [{ id: `rev-${Date.now()}`, offerId: "new", submittedBy: "John Carter", senderType: "admin", revisionType: "offer", amount: Number(data.offerAmount), message: data.message || "Offer created by admin.", createdAt: now }],
      history: [{ id: `hist-${Date.now()}`, offerId: "new", action: "Offer created by admin", actorId: "admin", actorName: "John Carter", actorType: "admin", notes: data.internalNotes || "", createdAt: now }],
      createdAt: now, updatedAt: now,
    };
    setOffers(prev => [newOffer, ...prev]);
  };

  const pendingCount = offers.filter(o => o.status === "pending").length;
  const counteredCount = offers.filter(o => o.status === "countered").length;

  return (
    <div className="flex flex-col gap-6">
      <OffersHeader onCreateOffer={() => setModalOpen(true)} onOfferRules={() => alert("Offer Rules — coming soon")} />

      <OffersToolbar
        filters={filters}
        onChange={patch => setFilters(prev => ({ ...prev, ...patch }))}
        total={displayed.length}
        pendingCount={pendingCount}
        counteredCount={counteredCount}
      />

      {filters.view === "table" ? (
        <OffersTable
          offers={displayed}
          onRowClick={setDrawerOffer}
          onCounter={o => setDrawerOffer(o)}
          onAccept={handleAccept}
          onReject={handleReject}
          onArchive={handleArchive}
        />
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {displayed.map(o => (
            <OfferCard
              key={o.id}
              offer={o}
              onClick={setDrawerOffer}
              onCounter={o2 => setDrawerOffer(o2)}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
          {displayed.length === 0 && (
            <div className="col-span-full bg-surface border border-[color:var(--border-subtle)] rounded-2xl py-20 text-center">
              <p className="text-base font-bold text-foreground mb-1">No offers found</p>
              <p className="text-sm text-[color:var(--text-muted)]">
                Customer offers will appear here as they&apos;re submitted.
              </p>
            </div>
          )}
        </div>
      )}

      <OfferDrawer
        offer={drawerOffer}
        onClose={() => setDrawerOffer(null)}
        onCounter={handleCounter}
        onAccept={handleAccept}
        onReject={handleReject}
      />

      <OfferFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCreate}
      />
    </div>
  );
}
