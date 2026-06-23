// components/coupons/CouponsHeader.tsx
import { Plus, Upload } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
  onCreateCoupon: () => void;
  onImport: () => void;
}

export default function CouponsHeader({ onCreateCoupon, onImport }: Props) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
          Store
        </div>
        <h1 className="text-2xl font-bold text-foreground m-0 tracking-tight leading-tight">
          Coupons
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Create and manage promotional discount campaigns.
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        <Button variant="secondary" size="md" icon={<Upload size={14} />} onClick={onImport}>
          Import Coupons
        </Button>
        <Button variant="primary" size="md" icon={<Plus size={15} />} onClick={onCreateCoupon}>
          Create Coupon
        </Button>
      </div>
    </div>
  );
}
