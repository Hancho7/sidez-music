// components/offers/OffersHeader.tsx
import { Plus, Settings } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
  onCreateOffer: () => void;
  onOfferRules: () => void;
}

export default function OffersHeader({ onCreateOffer, onOfferRules }: Props) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
          Store
        </div>
        <h1 className="text-2xl font-bold text-foreground m-0 tracking-tight leading-tight">Offers</h1>
        <p className="mt-1.5 text-sm text-muted">Review, negotiate, and manage customer purchase offers.</p>
      </div>
      <div className="flex items-center gap-2.5">
        <Button variant="secondary" size="md" icon={<Settings size={14} />} onClick={onOfferRules}>
          Offer Rules
        </Button>
        <Button variant="primary" size="md" icon={<Plus size={15} />} onClick={onCreateOffer}>
          Create Offer
        </Button>
      </div>
    </div>
  );
}
