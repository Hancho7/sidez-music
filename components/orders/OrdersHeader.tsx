// components/orders/OrdersHeader.tsx
import { Download, ShieldCheck, FileDown, Trash2 } from "lucide-react";
import Button from "../ui/Button";

interface Props {
  onExport: () => void;
  onRefundRules: () => void;
  selectedCount: number;
  onBulkExport: () => void;
  onBulkDelete: () => void;
}

export default function OrdersHeader({
  onExport, onRefundRules, selectedCount, onBulkExport, onBulkDelete,
}: Props) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
          Store
        </div>
        <h1 className="text-2xl font-bold text-foreground m-0 tracking-[-0.03em] leading-tight">
          Orders
        </h1>
        <p className="mt-1.5 text-sm text-[color:var(--text-secondary)]">
          Manage all customer purchases and transactions
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        {selectedCount > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-accent font-semibold">
              {selectedCount} selected
            </span>

            <Button
              onClick={onBulkExport}
              icon={<FileDown size={13} />}
              variant="ghost"
            >
              Export
            </Button>
            <Button
              variant="danger"
              onClick={onBulkDelete}
              icon={<Trash2 size={13} />}

            >
              Delete
            </Button>
          </div>
        )}

        <Button
          variant="secondary"
          onClick={onRefundRules}
          icon={<ShieldCheck size={15} />}

        >
          Refund Rules
        </Button>

        <Button
          variant="primary"
          onClick={onExport}
          icon={<Download size={15} />}

        >
          Export Orders
        </Button>
      </div>
    </div>
  );
}
