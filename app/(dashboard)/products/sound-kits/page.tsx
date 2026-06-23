// app/(dashboard)/products/sound-kits/page.tsx
"use client";

import { useState, useMemo } from "react";
import ProductsHeader from "@/components/sound-kits/ProductsHeader";
import ProductsToolbar from "@/components/sound-kits/ProductsToolbar";
import ProductsGrid from "@/components/sound-kits/ProductsGrid";
import ProductsTable from "@/components/sound-kits/ProductsTable";
import ProductDrawer from "@/components/sound-kits/ProductDrawer";
import ProductFormModal from "@/components/sound-kits/ProductFormModal";
import { MOCK_PRODUCTS } from "@/services/sound-kits/mock-data";
import type { DigitalProduct, ProductFilters, ProductFormValues } from "@/services/sound-kits/types";

const DEFAULT_FILTERS: ProductFilters = {
  search: "", category: "all", status: "all", priceType: "all",
  featured: false, sort: "newest", view: "cards",
};

export default function SoundKitsPage() {
  const [products, setProducts] = useState<DigitalProduct[]>(MOCK_PRODUCTS);
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [drawerProduct, setDrawerProduct] = useState<DigitalProduct | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DigitalProduct | null>(null);
  const [isLoading] = useState(false);

  const displayed = useMemo(() => {
    let list = [...products];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (filters.category !== "all") list = list.filter(p => p.category === filters.category);
    if (filters.status !== "all") list = list.filter(p => p.status === filters.status);
    if (filters.priceType === "free") list = list.filter(p => p.price === 0);
    if (filters.priceType === "paid") list = list.filter(p => p.price > 0);
    if (filters.featured) list = list.filter(p => p.featured);

    switch (filters.sort) {
      case "revenue": list.sort((a, b) => (b.analytics?.totalRevenue ?? 0) - (a.analytics?.totalRevenue ?? 0)); break;
      case "downloads": list.sort((a, b) => (b.analytics?.totalDownloads ?? 0) - (a.analytics?.totalDownloads ?? 0)); break;
      case "alpha": list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [products, filters]);

  const openCreate = () => { setEditingProduct(null); setModalOpen(true); };
  const openEdit = (p: DigitalProduct) => { setEditingProduct(p); setDrawerProduct(null); setModalOpen(true); };

  const handleDuplicate = (p: DigitalProduct) => {
    const now = new Date().toISOString();
    setProducts(prev => [{
      ...p,
      id: `prod-dupe-${Date.now()}`,
      name: `${p.name} (Copy)`,
      sku: `${p.sku}-COPY`,
      slug: `${p.slug}-copy`,
      status: "draft",
      featured: false,
      analytics: undefined,
      createdAt: now,
      updatedAt: now,
    }, ...prev]);
  };

  const handleArchive = (p: DigitalProduct) => {
    setProducts(prev => prev.map(x =>
      x.id !== p.id ? x : { ...x, status: "archived", updatedAt: new Date().toISOString() }
    ));
    if (drawerProduct?.id === p.id)
      setDrawerProduct(prev => prev ? { ...prev, status: "archived" } : prev);
  };

  const handleSave = async (data: ProductFormValues, id?: string) => {
    await new Promise(r => setTimeout(r, 400));
    const now = new Date().toISOString();
    const tags = data.tags.split(",").map(t => t.trim()).filter(Boolean);

    if (id) {
      setProducts(prev => prev.map(p => p.id !== id ? p : {
        ...p,
        name: data.name, slug: data.slug, description: data.description,
        shortDescription: data.shortDescription, category: data.category, tags,
        price: Number(data.price),
        salePrice: data.salePrice ? Number(data.salePrice) : null,
        currency: data.currency,
        downloadLimit: data.unlimited ? null : (data.downloadLimit ? Number(data.downloadLimit) : null),
        currentVersion: data.currentVersion,
        couponsEnabled: data.couponsEnabled, licenseRequired: data.licenseRequired,
        featured: data.featured, status: data.status,
        scheduledAt: data.scheduledAt || null,
        seoTitle: data.seoTitle, seoDescription: data.seoDescription,
        updatedAt: now,
      }));
    } else {
      setProducts(prev => [{
        id: `prod-${Date.now()}`,
        name: data.name, slug: data.slug, description: data.description,
        shortDescription: data.shortDescription,
        sku: `SKU-${Date.now().toString(36).toUpperCase()}`,
        category: data.category, tags,
        price: Number(data.price),
        salePrice: data.salePrice ? Number(data.salePrice) : null,
        currency: data.currency, status: data.status, featured: data.featured,
        thumbnail: null, gallery: [], previewAudio: null, previewVideo: null,
        currentVersion: data.currentVersion,
        downloadLimit: data.unlimited ? null : (data.downloadLimit ? Number(data.downloadLimit) : null),
        couponsEnabled: data.couponsEnabled, licenseRequired: data.licenseRequired,
        seoTitle: data.seoTitle, seoDescription: data.seoDescription,
        files: [], versions: [],
        scheduledAt: data.scheduledAt || null,
        createdAt: now, updatedAt: now,
      }, ...prev]);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <ProductsHeader
        onCreate={openCreate}
        onBulkImport={() => alert("Bulk import — coming soon")}
      />

      <ProductsToolbar
        filters={filters}
        onChange={patch => setFilters(prev => ({ ...prev, ...patch }))}
        total={displayed.length}
      />

      {filters.view === "cards" ? (
        <ProductsGrid
          products={displayed}
          loading={isLoading}
          onSelect={setDrawerProduct}
          onEdit={openEdit}
          onDuplicate={handleDuplicate}
          onArchive={handleArchive}
          onCreateClick={openCreate}
        />
      ) : (
        <ProductsTable
          products={displayed}
          onRowClick={setDrawerProduct}
          onEdit={openEdit}
          onDuplicate={handleDuplicate}
          onArchive={handleArchive}
        />
      )}

      <ProductDrawer
        product={drawerProduct}
        onClose={() => setDrawerProduct(null)}
        onEdit={openEdit}
      />

      <ProductFormModal
        open={modalOpen}
        product={editingProduct}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
