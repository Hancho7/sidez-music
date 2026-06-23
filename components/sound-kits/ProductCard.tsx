// components/sound-kits/ProductCard.tsx
"use client";

import { Eye, Pencil, Copy, Archive, Star, Music2, TrendingUp, Download, Package, Zap } from "lucide-react";
import type { DigitalProduct } from "@/services/sound-kits/types";
import { CATEGORY_LABELS } from "@/services/sound-kits/mock-data";
import Card from "@/components/ui/Card";
import type { AccentColor } from "@/components/ui/Card";

interface Props {
  product: DigitalProduct;
  onClick: (p: DigitalProduct) => void;
  onEdit: (p: DigitalProduct) => void;
  onDuplicate: (p: DigitalProduct) => void;
  onArchive: (p: DigitalProduct) => void;
}

const CATEGORY_COLORS: Record<string, AccentColor> = {
  drum_kit: "magenta",
  sample_pack: "purple",
  loop_pack: "cyan",
  midi_pack: "success",
  one_shots: "warning",
  fx_pack: "danger",
  vocal_pack: "purple",
  construction_kit: "magenta",
  preset_pack: "cyan",
  project_files: "success",
};

export default function ProductCard({ product, onClick, onEdit, onDuplicate, onArchive }: Props) {
  return (
    <Card onClick={() => onClick(product)} className="group">
      <Card.MediaBanner
        src={product.thumbnail}
        alt={product.name}
        aspectRatio="square"
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
              <Music2 size={24} className="text-accent" />
            </div>
            <span className="text-[11px] text-[color:var(--text-muted)]">No preview</span>
          </div>
        }
      >
        {product.featured && <Card.FeaturedBadge position="absolute-tl" />}
        <Card.StatusBadge status={product.status} position="absolute-tr" />
        {product.salePrice !== null && <Card.SaleBadge />}

        {/* Frosted overlay actions */}
        <Card.MediaOverlayActions
          buttons={[
            { icon: <Eye size={15} />, label: "View", onClick: () => onClick(product) },
            { icon: <Pencil size={15} />, label: "Edit", onClick: () => onEdit(product) },
            { icon: <Copy size={15} />, label: "Dupe", onClick: () => onDuplicate(product) },
            { icon: <Archive size={15} />, label: "Archive", onClick: () => onArchive(product) },
          ]}
        />
      </Card.MediaBanner>

      <Card.Body>
        <Card.CategoryPill
          label={CATEGORY_LABELS[product.category]}
          color={CATEGORY_COLORS[product.category] ?? "muted"}
        />

        <Card.Title>{product.name}</Card.Title>

        {/* SKU + version */}
        <div className="flex items-center justify-between text-[11px] text-[color:var(--text-muted)]">
          <span className="font-mono">{product.sku}</span>
          <span className="px-1.5 py-0.5 rounded bg-elevated font-semibold">v{product.currentVersion}</span>
        </div>

        <Card.Divider />

        <Card.StatRow>
          <Card.Stat icon={<Download size={11} />} value={(product.analytics?.totalDownloads ?? 0).toLocaleString()} />
          <Card.Stat icon={<TrendingUp size={11} />} value={`$${(product.analytics?.totalRevenue ?? 0).toLocaleString()}`} accent="success" />
          <div className="ml-auto flex items-center gap-1 text-xs">
            <Package size={11} className="text-[color:var(--text-muted)]" />
            <span className="text-[color:var(--text-muted)]">{product.files.length} file{product.files.length !== 1 ? "s" : ""}</span>
          </div>
        </Card.StatRow>

        <Card.PriceRow
          price={product.price}
          salePrice={product.salePrice}
          suffix={product.featured ? <Zap size={13} className="text-[color:var(--color-warning)]" /> : undefined}
        />
      </Card.Body>
    </Card>
  );
}
