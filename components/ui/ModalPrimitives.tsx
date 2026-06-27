// components/ui/modalPrimitives.tsx
// Tiny shared helpers used inside every modal. NOT exported from the ui barrel —
// import directly: import { ModalHeader, SectionTitle } from "@/components/ui/modalPrimitives"

import { X } from "lucide-react";
import Button from "./Button";

// Consistent modal close button
export function ModalClose({ onClose }: { onClose: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClose}
      icon={<X size={15} />}
      className="!w-8 !h-8 !p-0"
      aria-label="Close"
    />
  );
}

// Section divider heading used inside modal scroll bodies
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold tracking-widest uppercase text-[color:var(--text-muted)] border-b border-[color:var(--border-subtle)] pb-2.5 mb-4">
      {children}
    </div>
  );
}

// Standard two-button modal footer
export function ModalFooter({
  onClose, onSave, saving,
  saveLabel, savingLabel, saveDisabled,
}: {
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
  saveLabel: string;
  savingLabel?: string;
  saveDisabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[color:var(--border-subtle)] shrink-0">
      <Button onClick={onClose} variant="secondary" size="md">Cancel</Button>
      <Button onClick={onSave} variant="primary" size="md" loading={saving} disabled={saveDisabled || saving}>
        {saving ? (savingLabel ?? "Saving…") : saveLabel}
      </Button>
    </div>
  );
}
