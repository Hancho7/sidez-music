// components/ui/Input.tsx
import { forwardRef, type InputHTMLAttributes } from "react";
import { FIELD_CLASSES, LABEL_CLASSES, ERROR_CLASSES } from "./fieldStyles";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className={LABEL_CLASSES}>
            {label}
          </label>
        )}

        <input
          ref={ref}
          {...props}
          className={[
            FIELD_CLASSES,
            "px-3 py-2.5",
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

Input.displayName = "Input";

export default Input;
