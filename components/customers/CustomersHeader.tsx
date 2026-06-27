// components/customers/CustomersHeader.tsx

import { Download, Plus } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
  total: number;
  onExport: () => void;
  onCreate: () => void;
}

export default function CustomersHeader({ total, onExport, onCreate }: Props) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
          Store
        </div>
        <h1 className="text-2xl font-bold text-foreground m-0 tracking-[-0.03em] leading-tight">
          Customers
        </h1>
        <p className="mt-1.5 text-sm text-[color:var(--text-secondary)]">
          Manage buyers, purchase history, and customer relationships.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          onClick={onExport}
          variant="secondary"
          size="md"
          icon={<Download size={14} />}
        >
          Export Customers
        </Button>
        <Button
          onClick={onCreate}
          variant="primary"
          size="md"
          icon={<Plus size={15} />}
        >
          Create Customer
        </Button>
      </div>
    </div>
  );
}
