// components/ui/TextArea.tsx

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { FIELD_CLASSES, LABEL_CLASSES, ERROR_CLASSES } from "./fieldStyles";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className={LABEL_CLASSES}>
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          {...props}
          className={[
            FIELD_CLASSES,
            "px-3 py-2.5",
            "resize-y",
            "leading-relaxed",
            className,
          ].join(" ")}
        />

        {error && (
          <span className={ERROR_CLASSES}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
