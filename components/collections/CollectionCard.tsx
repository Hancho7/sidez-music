// components/collections/CollectionCard.tsx
"use client";

import { TrendingUp } from "lucide-react";
import type { Collection } from "@/services/collections/types";
import Card from "@/components/ui/Card";

interface Props {
  collection: Collection;
  onClick: () => void;
}

export default function CollectionCard({ collection, onClick }: Props) {
  return (
    <Card onClick={onClick}>
      <Card.MediaBanner src={collection.coverImage} alt={collection.title} aspectRatio="video">
        <Card.StatusBadge
          status={collection.status === "PUBLISHED" ? "published" : "draft"}
          position="absolute-tl"
        />
        {collection.isFeatured && <Card.FeaturedBadge position="absolute-tr" />}
      </Card.MediaBanner>

      <Card.Body>
        <Card.Title>{collection.title}</Card.Title>
        <Card.Meta>{collection.description}</Card.Meta>

        <Card.Divider className="mt-1" />

        {/* 3-column stats */}
        <div className="flex items-center gap-0">
          <div className="flex-1 text-center">
            <div className="text-sm font-bold text-foreground">{collection.totalTracks}</div>
            <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">Tracks</div>
          </div>
          <div className="w-px h-7 bg-[color:var(--border-subtle)]" />
          <div className="flex-1 text-center">
            <div className="text-sm font-bold text-foreground">{collection.totalSales}</div>
            <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">Sales</div>
          </div>
          <div className="w-px h-7 bg-[color:var(--border-subtle)]" />
          <div className="flex-1 text-center">
            <div className="text-sm font-bold text-accent">${collection.totalRevenue.toLocaleString()}</div>
            <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">Revenue</div>
          </div>
        </div>

        {collection.totalPlays > 0 && (
          <Card.StatRow>
            <Card.Stat icon={<TrendingUp size={11} />} value={`${collection.totalPlays.toLocaleString()} plays`} />
          </Card.StatRow>
        )}
      </Card.Body>
    </Card>
  );
}
