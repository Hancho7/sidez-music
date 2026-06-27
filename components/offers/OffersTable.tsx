// components/offers/OffersTable.tsx
"use client";

import { useMemo } from "react";
import { Eye, MessageSquare, CheckCircle2, XCircle, Archive, Music2, Library, Package, Wrench } from "lucide-react";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";
import type { Offer, OfferStatus, ProductType } from "@/services/offers/types";

interface Props {
  offers: Offer[];
  onRowClick: (o: Offer) => void;
  onCounter: (o: Offer) => void;
  onAccept: (o: Offer) => void;
  onReject: (o: Offer) => void;
  onArchive: (o: Offer) => void;
}

// Extend the Offer type with computed metadata
interface OfferWithMetadata extends Offer {
  expiryStatus: {
    display: string;
    isExpiring: boolean;
  };
  diff: number;
}

const STATUS_VARIANT: Record<OfferStatus, "success" | "warning" | "cyan" | "danger" | "muted" | "purple"> = {
  pending: "warning",
  countered: "cyan",
  accepted: "success",
  rejected: "danger",
  expired: "muted",
  withdrawn: "muted",
};

const STATUS_LABEL: Record<OfferStatus, string> = {
  pending: "Pending",
  countered: "Countered",
  accepted: "Accepted",
  rejected: "Rejected",
  expired: "Expired",
  withdrawn: "Withdrawn",
};

const TYPE_ICON: Record<ProductType, React.ReactNode> = {
  track: <Music2 size={12} />,
  collection: <Library size={12} />,
  digital_product: <Package size={12} />,
  service: <Wrench size={12} />,
};

function pctDiff(original: number, offer: number) {
  const diff = ((offer - original) / original) * 100;
  return diff.toFixed(0);
}

// Pure function that computes expiry status - called from useMemo, not during render
function getExpiryStatus(expiresAt: string | null): { display: string; isExpiring: boolean } {
  if (!expiresAt) return { display: "—", isExpiring: false };

  const now = new Date();
  const expiryDate = new Date(expiresAt);
  const diff = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) return { display: "Expired", isExpiring: false };
  if (diff === 0) return { display: "Today", isExpiring: true };
  if (diff === 1) return { display: "Tomorrow", isExpiring: true };
  if (diff <= 7) return { display: `${diff}d left`, isExpiring: true };
  return {
    display: expiryDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    isExpiring: false
  };
}

function getInitials(name: string) {
  return name.split(/[._\s]/).map(p => p[0]).join("").toUpperCase().slice(0, 2);
}

export default function OffersTable({ offers, onRowClick, onCounter, onAccept, onReject, onArchive }: Props) {
  const { hoveredId, setHoveredId } = useHoveredRow();

  // Pre-compute expiry status and diff for all offers using useMemo
  // This ensures Date.now() is only called when offers change
  const offersWithMetadata = useMemo<OfferWithMetadata[]>(() => {
    return offers.map(offer => ({
      ...offer,
      expiryStatus: getExpiryStatus(offer.expiresAt),
      diff: Number(pctDiff(offer.originalPrice, offer.currentOfferAmount)),
    }));
  }, [offers]);

  return (
    <DataTable
      isEmpty={offers.length === 0}
      emptyState={
        <DataTable.EmptyState
          icon={<MessageSquare size={22} className="text-accent" />}
          title="No offers yet"
          message="Customer offers will appear here. Enable negotiations in Offer Rules."
        />
      }
    >
      <DataTable.Header>
        <DataTable.Col>Customer</DataTable.Col>
        <DataTable.Col>Item</DataTable.Col>
        <DataTable.Col align="right">Listed</DataTable.Col>
        <DataTable.Col align="right">Offer</DataTable.Col>
        <DataTable.Col align="center">Diff</DataTable.Col>
        <DataTable.Col>Status</DataTable.Col>
        <DataTable.Col>Expires</DataTable.Col>
        <DataTable.Col>Admin</DataTable.Col>
        <DataTable.ActionsCol />
      </DataTable.Header>

      <DataTable.Body>
        {offersWithMetadata.map((offer: OfferWithMetadata) => {
          const isHovered = hoveredId === offer.id;
          const canAct = offer.status === "pending" || offer.status === "countered";

          return (
            <DataTable.Row
              key={offer.id}
              onClick={() => onRowClick(offer)}
              isHovered={isHovered}
              onHoverChange={h => setHoveredId(h ? offer.id : null)}
            >
              {/* Customer */}
              <DataTable.Cell>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-elevated flex items-center justify-center shrink-0 border border-[color:var(--border-subtle)]">
                    {offer.customerAvatar
                      ? <img src={offer.customerAvatar} alt={offer.customerName} className="w-full h-full object-cover" />
                      : <span className="text-[11px] font-bold text-[color:var(--text-muted)]">{getInitials(offer.customerName)}</span>
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{offer.customerName}</p>
                    <p className="text-[10px] font-mono text-[color:var(--text-muted)]">{offer.id}</p>
                  </div>
                </div>
              </DataTable.Cell>

              {/* Item */}
              <DataTable.Cell>
                <div className="flex items-center gap-2">
                  <span className="text-[color:var(--text-muted)]">{TYPE_ICON[offer.productType]}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate max-w-[160px]">{offer.productTitle}</p>
                    <p className="text-[11px] text-[color:var(--text-muted)] truncate max-w-[160px]">{offer.productArtist} · {offer.licensePlan}</p>
                  </div>
                </div>
              </DataTable.Cell>

              {/* Listed price */}
              <DataTable.Cell align="right" className="text-sm text-[color:var(--text-secondary)] font-medium">
                ${offer.originalPrice.toFixed(2)}
              </DataTable.Cell>

              {/* Offer amount */}
              <DataTable.Cell align="right" className="text-sm font-bold text-foreground">
                ${offer.currentOfferAmount.toFixed(2)}
              </DataTable.Cell>

              {/* Diff - using pre-computed value */}
              <DataTable.Cell align="center">
                <span className={`text-xs font-bold ${offer.diff < 0 ? "text-danger" : offer.diff > 0 ? "text-success" : "text-[color:var(--text-muted)]"}`}>
                  {offer.diff > 0 ? "+" : ""}{offer.diff}%
                </span>
              </DataTable.Cell>

              {/* Status */}
              <DataTable.Cell>
                <DataTable.StatusBadge
                  label={STATUS_LABEL[offer.status]}
                  variant={STATUS_VARIANT[offer.status]}
                />
              </DataTable.Cell>

              {/* Expires - using pre-computed status */}
              <DataTable.Cell>
                <span className={`text-xs ${offer.expiryStatus.isExpiring ? "text-danger font-semibold" : "text-[color:var(--text-muted)]"}`}>
                  {offer.expiryStatus.display}
                </span>
              </DataTable.Cell>

              {/* Admin */}
              <DataTable.Cell className="text-xs text-[color:var(--text-muted)]">
                {offer.assignedAdmin}
              </DataTable.Cell>

              {/* Actions */}
              <DataTable.ActionsCell visible={isHovered}>
                <DataTable.ActionBtn onClick={() => onRowClick(offer)} icon={<Eye size={13} />} title="View" />
                {canAct && <DataTable.ActionBtn onClick={() => onCounter(offer)} icon={<MessageSquare size={13} />} title="Counter" />}
                {canAct && <DataTable.ActionBtn onClick={() => onAccept(offer)} icon={<CheckCircle2 size={13} />} title="Accept" />}
                {canAct && <DataTable.ActionBtn onClick={() => onReject(offer)} icon={<XCircle size={13} />} title="Reject" danger />}
                <DataTable.ActionBtn onClick={() => onArchive(offer)} icon={<Archive size={13} />} title="Archive" danger />
              </DataTable.ActionsCell>
            </DataTable.Row>
          );
        })}
      </DataTable.Body>
    </DataTable>
  );
}
