// components/offers/OfferCard.tsx
"use client";

import { MessageSquare, CheckCircle2, XCircle, Music2, Library, Package, Wrench, Clock } from "lucide-react";
import type { Offer, ProductType } from "@/services/offers/types";
import Card from "@/components/ui/Card";

interface Props {
  offer: Offer;
  onClick: (o: Offer) => void;
  onCounter: (o: Offer) => void;
  onAccept: (o: Offer) => void;
  onReject: (o: Offer) => void;
}

const TYPE_ICON: Record<ProductType, React.ReactNode> = {
  track: <Music2 size={13} />,
  collection: <Library size={13} />,
  digital_product: <Package size={13} />,
  service: <Wrench size={13} />,
};

function getInitials(name: string) {
  return name.split(/[._\s]/).map(p => p[0]).join("").toUpperCase().slice(0, 2);
}

function fmtExpiry(d: string | null) {
  if (!d) return null;
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: "Expired", urgent: true };
  if (diff === 0) return { label: "Expires today", urgent: true };
  if (diff <= 2) return { label: `${diff}d left`, urgent: true };
  if (diff <= 7) return { label: `${diff}d left`, urgent: false };
  return null;
}

// Map offer status to the AccentBand color class
const BAND_CLASS: Record<string, string> = {
  accepted: "bg-success",
  countered: "bg-accent-cyan",
  pending: "bg-[color:var(--color-warning)]",
};

export default function OfferCard({ offer, onClick, onCounter, onAccept, onReject }: Props) {
  const diff = ((offer.currentOfferAmount - offer.originalPrice) / offer.originalPrice * 100).toFixed(0);
  const canAct = offer.status === "pending" || offer.status === "countered";
  const expiry = fmtExpiry(offer.expiresAt);
  const roundCount = offer.revisions.filter(r => r.revisionType === "offer" || r.revisionType === "counter").length;

  return (
    <Card onClick={() => onClick(offer)}>
      <Card.AccentBand color={BAND_CLASS[offer.status] ?? "bg-elevated"} />

      <Card.Body>
        {/* Customer row + status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-elevated flex items-center justify-center shrink-0 border border-[color:var(--border-subtle)]">
              {offer.customerAvatar
                ? <img src={offer.customerAvatar} alt={offer.customerName} className="w-full h-full object-cover" />
                : <span className="text-[10px] font-bold text-[color:var(--text-muted)]">{getInitials(offer.customerName)}</span>
              }
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{offer.customerName}</p>
              <p className="text-[10px] font-mono text-[color:var(--text-muted)]">{offer.id}</p>
            </div>
          </div>
          <Card.StatusBadge status={offer.status} position="inline" />
        </div>

        {/* Product */}
        <div className="flex items-center gap-2">
          <span className="text-[color:var(--text-muted)]">{TYPE_ICON[offer.productType]}</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{offer.productTitle}</p>
            <Card.Meta>{offer.licensePlan}</Card.Meta>
          </div>
        </div>

        {/* Price comparison widget */}
        <div className="flex items-center justify-between bg-[color:var(--bg-input)] rounded-xl px-3 py-2.5 border border-[color:var(--border-subtle)]">
          <div>
            <p className="text-[10px] text-[color:var(--text-muted)]">Listed</p>
            <p className="text-sm font-semibold text-[color:var(--text-secondary)] line-through">${offer.originalPrice.toFixed(2)}</p>
          </div>
          <span className={`text-xs font-bold ${Number(diff) < 0 ? "text-danger" : "text-success"}`}>
            {Number(diff) > 0 ? "+" : ""}{diff}%
          </span>
          <div className="text-right">
            <p className="text-[10px] text-[color:var(--text-muted)]">Offered</p>
            <p className="text-base font-black text-foreground">${offer.currentOfferAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between text-[11px] text-[color:var(--text-muted)]">
          <span className="flex items-center gap-1">
            <MessageSquare size={10} />
            {roundCount} round{roundCount !== 1 ? "s" : ""}
          </span>
          {expiry && (
            <span className={`flex items-center gap-1 ${expiry.urgent ? "text-danger font-semibold" : ""}`}>
              <Clock size={10} /> {expiry.label}
            </span>
          )}
        </div>

        {/* Actions — only when negotiable */}
        {canAct && (
          <Card.Actions
            buttons={[
              { icon: <MessageSquare size={11} />, label: "Counter", onClick: e => { e.stopPropagation(); onCounter(offer); } },
              { icon: <CheckCircle2 size={11} />, label: "Accept", onClick: e => { e.stopPropagation(); onAccept(offer); }, variant: "default" as const },
              { icon: <XCircle size={11} />, label: "Reject", onClick: e => { e.stopPropagation(); onReject(offer); }, variant: "danger" as const, iconOnly: true },
            ]}
          />
        )}
      </Card.Body>
    </Card>
  );
}
