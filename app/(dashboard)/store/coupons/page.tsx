// app/(dashboard)/store/coupons/page.tsx
"use client";

import { useState, useMemo } from "react";
import CouponsHeader from "@/components/coupons/CouponsHeader";
import CouponsToolbar from "@/components/coupons/CouponsToolbar";
import CouponsTable from "@/components/coupons/CouponsTable";
import CouponCard from "@/components/coupons/CouponCard";
import CouponDrawer from "@/components/coupons/CouponDrawer";
import CouponFormModal from "@/components/coupons/CouponFormModal";
import { MOCK_COUPONS } from "@/services/coupons/mock-data";
import type { Coupon, CouponFilters, CouponFormValues, CouponStatus } from "@/services/coupons/types";

const DEFAULT_FILTERS: CouponFilters = {
  search: "",
  status: "all",
  sort: "recent",
  view: "table",
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [filters, setFilters] = useState<CouponFilters>(DEFAULT_FILTERS);
  const [drawerCoupon, setDrawerCoupon] = useState<Coupon | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const displayed = useMemo(() => {
    let list = [...coupons];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(c =>
        c.code.toLowerCase().includes(q) ||
        c.campaignName.toLowerCase().includes(q)
      );
    }

    if (filters.status !== "all") {
      list = list.filter(c => c.status === filters.status);
    }

    switch (filters.sort) {
      case "expiration":
        list.sort((a, b) => {
          if (!a.expiresAt) return 1;
          if (!b.expiresAt) return -1;
          return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
        });
        break;
      case "most_redeemed":
        list.sort((a, b) => b.usageCount - a.usageCount);
        break;
      case "highest_revenue":
        list.sort((a, b) => (b.analytics?.revenueGenerated ?? 0) - (a.analytics?.revenueGenerated ?? 0));
        break;
      case "recent":
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return list;
  }, [coupons, filters]);

  const openCreate = () => { setEditingCoupon(null); setModalOpen(true); };
  const openEdit = (c: Coupon) => { setEditingCoupon(c); setDrawerCoupon(null); setModalOpen(true); };

  const handleToggleStatus = (c: Coupon) => {
    const next: CouponStatus = c.status === "active" ? "disabled" : "active";
    setCoupons(prev => prev.map(x => x.id === c.id ? { ...x, status: next, updatedAt: new Date().toISOString() } : x));
    if (drawerCoupon?.id === c.id) setDrawerCoupon(prev => prev ? { ...prev, status: next } : prev);
  };

  const handleDuplicate = (c: Coupon) => {
    const dupe: Coupon = {
      ...c,
      id: `cpn-dupe-${Date.now()}`,
      campaignName: `${c.campaignName} (Copy)`,
      code: `${c.code}COPY`,
      status: "draft",
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      redemptions: [],
    };
    setCoupons(prev => [dupe, ...prev]);
  };

  const handleArchive = (c: Coupon) => {
    setCoupons(prev => prev.filter(x => x.id !== c.id));
    if (drawerCoupon?.id === c.id) setDrawerCoupon(null);
  };

  const handleSave = async (data: CouponFormValues, id?: string) => {
    await new Promise(r => setTimeout(r, 400));
    const now = new Date().toISOString();

    if (id) {
      setCoupons(prev => prev.map(c => c.id !== id ? c : {
        ...c,
        campaignName: data.campaignName, code: data.code, description: data.description,
        discountType: data.discountType, discountValue: Number(data.discountValue),
        maximumDiscount: data.maximumDiscount ? Number(data.maximumDiscount) : null,
        minimumPurchase: data.minimumPurchase ? Number(data.minimumPurchase) : null,
        status: data.status,
        startsAt: data.startsAt || null, expiresAt: data.expiresAt || null,
        usageLimit: data.unlimited ? null : (data.usageLimit ? Number(data.usageLimit) : null),
        usagePerCustomer: data.usagePerCustomer ? Number(data.usagePerCustomer) : null,
        stackable: data.stackable,
        eligibility: { ...c.eligibility, entityTarget: data.entityTarget, customerTarget: data.customerTarget, countries: data.countries },
        updatedAt: now,
      }));
    } else {
      const newCoupon: Coupon = {
        id: `cpn-${Date.now()}`,
        campaignName: data.campaignName, code: data.code, description: data.description,
        discountType: data.discountType, discountValue: Number(data.discountValue),
        maximumDiscount: data.maximumDiscount ? Number(data.maximumDiscount) : null,
        minimumPurchase: data.minimumPurchase ? Number(data.minimumPurchase) : null,
        status: data.status,
        startsAt: data.startsAt || null, expiresAt: data.expiresAt || null,
        usageLimit: data.unlimited ? null : (data.usageLimit ? Number(data.usageLimit) : null),
        usagePerCustomer: data.usagePerCustomer ? Number(data.usagePerCustomer) : null,
        usageCount: 0, stackable: data.stackable,
        eligibility: { entityTarget: data.entityTarget, entityIds: [], customerTarget: data.customerTarget, customerIds: [], countries: data.countries, currencies: [] },
        createdBy: "John Carter",
        createdAt: now, updatedAt: now,
        redemptions: [],
      };
      setCoupons(prev => [newCoupon, ...prev]);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <CouponsHeader
        onCreateCoupon={openCreate}
        onImport={() => alert("Import from CSV — coming soon")}
      />

      <CouponsToolbar
        filters={filters}
        onChange={patch => setFilters(prev => ({ ...prev, ...patch }))}
        total={displayed.length}
      />

      {filters.view === "table" ? (
        <CouponsTable
          coupons={displayed}
          onRowClick={setDrawerCoupon}
          onEdit={openEdit}
          onDuplicate={handleDuplicate}
          onToggleStatus={handleToggleStatus}
          onArchive={handleArchive}
        />
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {displayed.map(c => (
            <CouponCard
              key={c.id}
              coupon={c}
              onClick={setDrawerCoupon}
              onEdit={openEdit}
              onDuplicate={handleDuplicate}
              onToggleStatus={handleToggleStatus}
              onArchive={handleArchive}
            />
          ))}
          {displayed.length === 0 && (
            <div className="col-span-full bg-surface border border-[color:var(--border-subtle)] rounded-2xl py-20 text-center">
              <p className="text-base font-bold text-foreground mb-1">No coupons found</p>
              <p className="text-sm text-[color:var(--text-muted)]">Create your first coupon to start running promotions.</p>
            </div>
          )}
        </div>
      )}

      <CouponDrawer
        coupon={drawerCoupon}
        onClose={() => setDrawerCoupon(null)}
        onEdit={openEdit}
        onToggleStatus={handleToggleStatus}
      />

      <CouponFormModal
        open={modalOpen}
        coupon={editingCoupon}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
