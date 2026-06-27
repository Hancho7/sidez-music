// components/marketing/MarketingHeader.tsx
import { Plus, ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
  onCreateCampaign: () => void;
  onPreview: () => void;
}

export default function MarketingHeader({ onCreateCampaign, onPreview }: Props) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
          Growth
        </div>
        <h1 className="text-2xl font-bold text-foreground m-0 tracking-tight leading-tight">Marketing</h1>
        <p className="mt-1.5 text-sm text-muted">Manage campaigns, promotions, and customer engagement.</p>
      </div>
      <div className="flex items-center gap-2.5">
        <Button variant="secondary" size="md" icon={<ExternalLink size={14} />} onClick={onPreview}>Preview Homepage</Button>
        <Button variant="primary" size="md" icon={<Plus size={15} />} onClick={onCreateCampaign}>Create Campaign</Button>
      </div>
    </div>
  );
}
