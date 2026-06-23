// components/sound-kits/ProductsHeader.tsx
import { Plus, Upload } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
  onCreate: () => void;
  onBulkImport: () => void;
}

export default function ProductsHeader({ onCreate, onBulkImport }: Props) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] mb-1.5">Products</p>
        <h1 className="text-2xl font-bold text-foreground m-0 tracking-tight leading-tight">Digital Products</h1>
        <p className="mt-1.5 text-sm text-muted">Manage downloadable music production products.</p>
      </div>
      <div className="flex items-center gap-2.5">
        <Button variant="secondary" size="md" icon={<Upload size={14} />} onClick={onBulkImport}>Bulk Import</Button>
        <Button variant="primary" size="md" icon={<Plus size={15} />} onClick={onCreate}>Create Product</Button>
      </div>
    </div>
  );
}
