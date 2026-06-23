// components/ui/Button.tsx
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: [
    "bg-accent text-black border-0",
    "hover:bg-[color:var(--accent-purple-hover)] hover:shadow-[var(--shadow-glow-purple)]",
    "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none",
  ].join(" "),

  secondary: [
    "bg-transparent text-[color:var(--text-secondary)] border border-[color:var(--border-default)]",
    "hover:bg-elevated hover:text-foreground",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),

  ghost: [
    "bg-transparent text-[color:var(--text-muted)] border border-[color:var(--border-subtle)]",
    "hover:bg-elevated hover:text-foreground hover:border-[color:var(--border-default)]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),

  danger: [
    "bg-danger/10 text-danger border border-danger/30",
    "hover:bg-danger/20",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5 rounded-lg",
  md: "px-4 py-2.5 text-sm gap-2 rounded-[10px]",
  lg: "px-5 py-3 text-sm gap-2.5 rounded-xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={[
          "inline-flex items-center justify-center font-semibold cursor-pointer",
          "transition-all duration-150 active:scale-[0.97] whitespace-nowrap select-none",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className,
        ].join(" ")}
        {...props}
      >
        {loading ? (
          <Loader2 size={size === "sm" ? 12 : 14} className="animate-spin shrink-0" />
        ) : (
          icon && iconPosition === "left" && (
            <span className="shrink-0">{icon}</span>
          )
        )}
        {children}
        {!loading && icon && iconPosition === "right" && (
          <span className="shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
