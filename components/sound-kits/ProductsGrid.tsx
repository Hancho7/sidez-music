// components/sound-kits/ProductsGrid.tsx
"use client";

import { Music2 } from "lucide-react";
import ProductCard from "./ProductCard";
import type { DigitalProduct } from "@/services/sound-kits/types";
import Button from "@/components/ui/Button";

interface Props {
  products: DigitalProduct[];
  loading: boolean;
  onSelect: (p: DigitalProduct) => void;
  onEdit: (p: DigitalProduct) => void;
  onDuplicate: (p: DigitalProduct) => void;
  onArchive: (p: DigitalProduct) => void;
  onCreateClick: () => void;
}

export default function ProductsGrid({ products, loading, onSelect, onEdit, onDuplicate, onArchive, onCreateClick }: Props) {
  if (loading) return <SkeletonGrid />;
  if (products.length === 0) return <EmptyState onCreateClick={onCreateClick} />;

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
      {products.map(p => (
        <ProductCard
          key={p.id}
          product={p}
          onClick={onSelect}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-surface border border-[color:var(--border-subtle)] rounded-2xl overflow-hidden">
          {/* Square thumbnail area */}
          <div className="aspect-square bg-elevated animate-pulse" />
          <div className="p-4 flex flex-col gap-3">
            <div className="h-3 w-[40%] bg-elevated rounded-full animate-pulse" />
            <div className="h-4 w-[80%] bg-elevated rounded-md animate-pulse" />
            <div className="h-3 w-[60%] bg-elevated rounded-md animate-pulse" />
            <div className="h-px bg-[color:var(--border-subtle)]" />
            <div className="flex gap-3">
              <div className="h-3 w-16 bg-elevated rounded animate-pulse" />
              <div className="h-3 w-16 bg-elevated rounded animate-pulse" />
            </div>
            <div className="h-4 w-[30%] bg-elevated rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
      <div className="w-[72px] h-[72px] rounded-[20px] mb-5 bg-gradient-to-br from-accent/15 to-accent-cyan/10 border border-[color:var(--border-subtle)] flex items-center justify-center">
        <Music2 size={32} className="text-[#31386d]" />
      </div>
      <h3 className="text-lg font-bold text-foreground m-0">No products yet</h3>
      <p className="text-sm text-[color:var(--text-muted)] mt-2 max-w-[320px]">
        Create your first digital product to start selling drum kits, sample packs, and more.
      </p>
      <Button onClick={onCreateClick} variant="primary" className="mt-5">
        Create first product
      </Button>
    </div>
  );
}
