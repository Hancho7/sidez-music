// components/sound-kits/ProductsTable.tsx
"use client";

import { Eye, Pencil, Copy, Archive, Music2, Star } from "lucide-react";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";
import type { DigitalProduct, ProductStatus } from "@/services/sound-kits/types";
import { CATEGORY_LABELS } from "@/services/sound-kits/mock-data";

interface Props {
  products: DigitalProduct[];
  onRowClick: (p: DigitalProduct) => void;
  onEdit: (p: DigitalProduct) => void;
  onDuplicate: (p: DigitalProduct) => void;
  onArchive: (p: DigitalProduct) => void;
}

const STATUS_VARIANT: Record<ProductStatus, "success" | "warning" | "muted" | "cyan"> = {
  published: "success",
  draft: "warning",
  archived: "muted",
  scheduled: "cyan",
};

export default function ProductsTable({ products, onRowClick, onEdit, onDuplicate, onArchive }: Props) {
  const { hoveredId, setHoveredId } = useHoveredRow();

  return (
    <DataTable
      isEmpty={products.length === 0}
      emptyState={
        <DataTable.EmptyState
          icon={<Music2 size={22} className="text-accent" />}
          title="No digital products found"
          message="Create your first product to start selling."
        />
      }
    >
      <DataTable.Header>
        <DataTable.Col>Product</DataTable.Col>
        <DataTable.Col>Category</DataTable.Col>
        <DataTable.Col align="center">Version</DataTable.Col>
        <DataTable.Col align="right">Price</DataTable.Col>
        <DataTable.Col align="center">Downloads</DataTable.Col>
        <DataTable.Col align="right">Revenue</DataTable.Col>
        <DataTable.Col>Status</DataTable.Col>
        <DataTable.ActionsCol />
      </DataTable.Header>

      <DataTable.Body>
        {products.map(product => {
          const isHovered = hoveredId === product.id;
          const displayPrice = product.salePrice ?? product.price;

          return (
            <DataTable.Row
              key={product.id}
              onClick={() => onRowClick(product)}
              isHovered={isHovered}
              onHoverChange={h => setHoveredId(h ? product.id : null)}
            >
              {/* Product */}
              <DataTable.Cell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-elevated flex items-center justify-center shrink-0 border border-[color:var(--border-subtle)]">
                    {product.thumbnail
                      ? <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                      : <Music2 size={14} className="text-[color:var(--text-muted)]" />
                    }
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-foreground truncate max-w-[200px]">{product.name}</span>
                      {product.featured && <Star size={11} className="text-[color:var(--color-warning)] fill-current shrink-0" />}
                    </div>
                    <p className="text-[11px] font-mono text-[color:var(--text-muted)]">{product.sku}</p>
                  </div>
                </div>
              </DataTable.Cell>

              {/* Category */}
              <DataTable.Cell>
                <span className="text-xs text-[color:var(--text-secondary)]">{CATEGORY_LABELS[product.category]}</span>
              </DataTable.Cell>

              {/* Version */}
              <DataTable.Cell align="center">
                <span className="font-mono text-xs font-semibold text-[color:var(--text-secondary)] px-1.5 py-0.5 bg-elevated rounded">v{product.currentVersion}</span>
              </DataTable.Cell>

              {/* Price */}
              <DataTable.Cell align="right">
                {product.price === 0
                  ? <span className="text-sm font-bold text-success">FREE</span>
                  : <div className="flex items-center justify-end gap-1.5">
                    <span className="text-sm font-bold text-foreground">${displayPrice.toFixed(2)}</span>
                    {product.salePrice !== null && (
                      <span className="text-xs line-through text-[color:var(--text-muted)]">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                }
              </DataTable.Cell>

              {/* Downloads */}
              <DataTable.Cell align="center" className="text-sm font-semibold text-foreground">
                {(product.analytics?.totalDownloads ?? 0).toLocaleString()}
              </DataTable.Cell>

              {/* Revenue */}
              <DataTable.Cell align="right" className="text-sm font-semibold text-success">
                ${(product.analytics?.totalRevenue ?? 0).toLocaleString()}
              </DataTable.Cell>

              {/* Status */}
              <DataTable.Cell>
                <DataTable.StatusBadge
                  label={product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  variant={STATUS_VARIANT[product.status]}
                />
              </DataTable.Cell>

              {/* Actions */}
              <DataTable.ActionsCell visible={isHovered}>
                <DataTable.ActionBtn onClick={() => onRowClick(product)} icon={<Eye size={13} />} title="View" />
                <DataTable.ActionBtn onClick={() => onEdit(product)} icon={<Pencil size={13} />} title="Edit" />
                <DataTable.ActionBtn onClick={() => onDuplicate(product)} icon={<Copy size={13} />} title="Duplicate" />
                <DataTable.ActionBtn onClick={() => onArchive(product)} icon={<Archive size={13} />} title="Archive" danger />
              </DataTable.ActionsCell>
            </DataTable.Row>
          );
        })}
      </DataTable.Body>
    </DataTable>
  );
}
