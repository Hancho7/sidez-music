// components/ui/Select.tsx

import { ChevronDown } from "lucide-react";
import { FIELD_CLASSES, LABEL_CLASSES, ERROR_CLASSES } from "./fieldStyles";

interface SelectProps {
  label?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

export default function Select({
  label,
  error,
  value,
  onChange,
  children,
}: SelectProps) {
  return (
    <div>
      {label && (
        <label className={LABEL_CLASSES}>
          {label}
        </label>
      )}

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={[
            FIELD_CLASSES,
            "px-3 py-2.5",
            "pr-9",
            "appearance-none",
            "cursor-pointer",
            "[&>option]:bg-surface",
          ].join(" ")}
        >
          {children}
        </select>

        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] pointer-events-none"
        />
      </div>

      {error && (
        <span className={ERROR_CLASSES}>
          {error}
        </span>
      )}
    </div>
  );
}
