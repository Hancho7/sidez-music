// components/ui/Card.tsx
//
// Composable card primitives for the Sidez admin dashboard.
//
// Every card in the app shares these behaviours:
//   - Hover lift + border brighten + shadow
//   - Consistent border-radius (rounded-2xl)
//   - Consistent bg-surface baseline
//   - Status badge anatomy
//   - Action row that fades in on hover
//
// Usage patterns:
//
//   <Card onClick={...}>
//     <Card.MediaBanner src={...} aspectRatio="square">
//       <Card.StatusBadge status="active" />
//       <Card.FeaturedBadge />
//     </Card.MediaBanner>
//     <Card.Body>
//       <Card.CategoryPill label="Drum Kit" color="magenta" />
//       <Card.Title>KXNG Trap Essentials</Card.Title>
//       <Card.Meta>SKU-001 · v1.2</Card.Meta>
//       <Card.StatRow>
//         <Card.Stat icon={<Download />} value="2.8k" />
//         <Card.Stat icon={<TrendingUp />} value="$78k" accent="success" />
//       </Card.StatRow>
//       <Card.Actions onEdit={...} onArchive={...} />
//     </Card.Body>
//   </Card>
//
//   <Card.AccentBand status="active" />   ← thin top stripe used by CouponCard / OfferCard
//   <Card.BannerWithAvatar ...>           ← ArtistCard-style banner + overlapping avatar

"use client";

import { useState, createContext, useContext } from "react";
import { Eye, Pencil, Archive, Copy, Star } from "lucide-react";

// ---------------------------------------------------------------------------
// Hover context — lets sub-components react to parent hover
// ---------------------------------------------------------------------------

const HoverCtx = createContext(false);

// ---------------------------------------------------------------------------
// Colour helpers
// ---------------------------------------------------------------------------

type StatusVariant = "active" | "published" | "draft" | "scheduled" | "archived" | "disabled"
  | "expired" | "pending" | "countered" | "accepted" | "rejected" | "withdrawn"
  | "hidden" | "inactive" | string;

const STATUS_MAP: Record<string, { dot: string; text: string; bg: string }> = {
  active: { dot: "bg-success", text: "text-success", bg: "bg-success/10" },
  published: { dot: "bg-success", text: "text-success", bg: "bg-success/10" },
  draft: { dot: "bg-[color:var(--color-warning)]", text: "text-[color:var(--color-warning)]", bg: "bg-[color:var(--color-warning)]/10" },
  scheduled: { dot: "bg-accent-cyan", text: "text-accent-cyan", bg: "bg-accent-cyan/10" },
  archived: { dot: "bg-white/40", text: "text-white/40", bg: "bg-white/10" },
  disabled: { dot: "bg-danger", text: "text-danger", bg: "bg-danger/10" },
  expired: { dot: "bg-white/40", text: "text-white/40", bg: "bg-white/10" },
  pending: { dot: "bg-[color:var(--color-warning)]", text: "text-[color:var(--color-warning)]", bg: "bg-[color:var(--color-warning)]/10" },
  countered: { dot: "bg-accent-cyan", text: "text-accent-cyan", bg: "bg-accent-cyan/10" },
  accepted: { dot: "bg-success", text: "text-success", bg: "bg-success/10" },
  rejected: { dot: "bg-danger", text: "text-danger", bg: "bg-danger/10" },
  withdrawn: { dot: "bg-white/40", text: "text-white/40", bg: "bg-white/10" },
  hidden: { dot: "bg-[color:var(--color-warning)]", text: "text-[color:var(--color-warning)]", bg: "bg-[color:var(--color-warning)]/10" },
  inactive: { dot: "bg-white/40", text: "text-white/40", bg: "bg-white/10" },
};

function resolveStatus(status: string) {
  return STATUS_MAP[status] ?? { dot: "bg-elevated", text: "text-[color:var(--text-muted)]", bg: "bg-elevated" };
}

type AccentColor = "magenta" | "purple" | "cyan" | "success" | "warning" | "danger" | "muted";

const ACCENT_MAP: Record<AccentColor, string> = {
  magenta: "bg-[color:var(--accent-magenta)]/10 text-[color:var(--accent-magenta)]",
  purple: "bg-accent/10 text-accent",
  cyan: "bg-accent-cyan/10 text-accent-cyan",
  success: "bg-success/10 text-success",
  warning: "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]",
  danger: "bg-danger/10 text-danger",
  muted: "bg-elevated text-[color:var(--text-muted)]",
};

// ---------------------------------------------------------------------------
// Root <Card>
// ---------------------------------------------------------------------------

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  /** Disable the default hover lift — useful when Card wraps a fully custom layout */
  noHoverLift?: boolean;
}

function Card({ children, onClick, className = "", noHoverLift = false }: CardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <HoverCtx.Provider value={hovered}>
      <div
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={[
          "bg-surface border rounded-2xl overflow-hidden flex flex-col transition-all duration-200",
          onClick ? "cursor-pointer" : "",
          hovered && !noHoverLift
            ? "border-[color:var(--border-default)] -translate-y-0.5 shadow-[var(--shadow-card)]"
            : "border-[color:var(--border-subtle)]",
          className,
        ].join(" ")}
      >
        {children}
      </div>
    </HoverCtx.Provider>
  );
}

// ---------------------------------------------------------------------------
// AccentBand — thin top stripe (CouponCard, OfferCard pattern)
// ---------------------------------------------------------------------------

interface AccentBandProps {
  /** Pass a Tailwind bg class or "auto" to derive from status */
  color?: string;
  status?: StatusVariant;
  gradient?: boolean;
}

function AccentBand({ color, status, gradient = false }: AccentBandProps) {
  const cls = color
    ? color
    : status
      ? resolveStatus(status).dot
      : "bg-elevated";

  return (
    <div
      className={[
        "h-1 w-full shrink-0",
        gradient ? `bg-gradient-to-r from-accent to-[color:var(--accent-magenta)]` : cls,
      ].join(" ")}
    />
  );
}

// ---------------------------------------------------------------------------
// MediaBanner — image/placeholder hero area
// ---------------------------------------------------------------------------

interface MediaBannerProps {
  src?: string | null;
  alt?: string;
  aspectRatio?: "square" | "video" | "banner";
  /** Fallback content when no src — defaults to a generic icon placeholder */
  fallback?: React.ReactNode;
  children?: React.ReactNode; // overlaid badges, etc.
  className?: string;
}

const ASPECT: Record<string, string> = {
  square: "aspect-square",
  video: "aspect-video",
  banner: "h-24",
};

function MediaBanner({ src, alt = "", aspectRatio = "square", fallback, children, className = "" }: MediaBannerProps) {
  return (
    <div className={["relative bg-elevated overflow-hidden shrink-0", ASPECT[aspectRatio], className].join(" ")}>
      {src
        ? <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        : (fallback ?? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
              </svg>
            </div>
          </div>
        ))
      }
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// BannerWithAvatar — ArtistCard-style stacked layout
// ---------------------------------------------------------------------------

interface BannerWithAvatarProps {
  bannerSrc?: string | null;
  avatarSrc?: string | null;
  avatarFallback?: string;   // initials
  badge?: React.ReactNode;   // e.g. verified checkmark
  children?: React.ReactNode; // banner overlays
}

function BannerWithAvatar({ bannerSrc, avatarSrc, avatarFallback, badge, children }: BannerWithAvatarProps) {
  return (
    <>
      {/* Banner */}
      <div className="relative h-20 bg-elevated overflow-hidden shrink-0">
        {bannerSrc
          ? <img src={bannerSrc} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent-cyan/10" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
        {children}
      </div>

      {/* Overlapping avatar */}
      <div className="px-4 -mt-8 mb-1 shrink-0">
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-surface bg-elevated flex items-center justify-center">
            {avatarSrc
              ? <img src={avatarSrc} alt={avatarFallback ?? ""} className="w-full h-full object-cover" />
              : <span className="text-lg font-bold text-[color:var(--text-muted)]">{avatarFallback ?? "?"}</span>
            }
          </div>
          {badge && (
            <div className="absolute -bottom-1 -right-1">{badge}</div>
          )}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Body — padded content area
// ---------------------------------------------------------------------------

interface BodyProps {
  children: React.ReactNode;
  className?: string;
}

function Body({ children, className = "" }: BodyProps) {
  return (
    <div className={["px-4 pb-4 pt-3 flex flex-col gap-2.5 flex-1", className].join(" ")}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// StatusBadge — positioned or inline
// ---------------------------------------------------------------------------

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  /** "absolute" renders top-right overlay; "inline" renders in flow */
  position?: "absolute-tr" | "absolute-tl" | "inline";
  className?: string;
}

function StatusBadge({ status, label, position = "absolute-tr", className = "" }: StatusBadgeProps) {
  const s = resolveStatus(status);
  const posClass = position === "absolute-tr"
    ? "absolute top-2.5 right-2.5"
    : position === "absolute-tl"
      ? "absolute top-2.5 left-2.5"
      : "";

  const displayLabel = label ?? (status.charAt(0).toUpperCase() + status.slice(1));

  return (
    <span className={[
      posClass,
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-sm",
      s.bg, s.text, className,
    ].join(" ")}>
      <span className={["w-1.5 h-1.5 rounded-full", s.dot].join(" ")} />
      {displayLabel}
    </span>
  );
}

// ---------------------------------------------------------------------------
// FeaturedBadge
// ---------------------------------------------------------------------------

interface FeaturedBadgeProps {
  position?: "absolute-tr" | "absolute-tl" | "inline";
  label?: string;
}

function FeaturedBadge({ position = "absolute-tl", label = "Featured" }: FeaturedBadgeProps) {
  const posClass = position === "absolute-tr"
    ? "absolute top-2.5 right-2.5"
    : position === "absolute-tl"
      ? "absolute top-2.5 left-2.5"
      : "";

  return (
    <span className={[
      posClass,
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
      "bg-[color:var(--color-warning)]/20 border border-[color:var(--color-warning)]/40 text-[color:var(--color-warning)]",
    ].join(" ")}>
      <Star size={9} className="fill-current" />
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// CategoryPill — coloured label
// ---------------------------------------------------------------------------

interface CategoryPillProps {
  label: string;
  color?: AccentColor;
  className?: string;
}

function CategoryPill({ label, color = "purple", className = "" }: CategoryPillProps) {
  return (
    <span className={[
      "self-start inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full",
      ACCENT_MAP[color],
      className,
    ].join(" ")}>
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Title
// ---------------------------------------------------------------------------

function Title({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={["text-sm font-bold text-foreground leading-snug line-clamp-2 m-0", className].join(" ")}>
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Meta — secondary caption line
// ---------------------------------------------------------------------------

function Meta({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={["text-[11px] text-[color:var(--text-muted)] m-0", className].join(" ")}>
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------

function Divider({ className = "" }: { className?: string }) {
  return <div className={["w-full h-px bg-[color:var(--border-subtle)]", className].join(" ")} />;
}

// ---------------------------------------------------------------------------
// StatRow + Stat
// ---------------------------------------------------------------------------

function StatRow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={["flex items-center gap-3 pt-0.5", className].join(" ")}>
      {children}
    </div>
  );
}

interface StatProps {
  icon?: React.ReactNode;
  value: React.ReactNode;
  label?: string;
  accent?: "success" | "danger" | "accent" | "muted";
  align?: "left" | "center";
  className?: string;
}

const STAT_ACCENT: Record<string, string> = {
  success: "text-success",
  danger: "text-danger",
  accent: "text-accent",
  muted: "text-[color:var(--text-muted)]",
};

function Stat({ icon, value, label, accent, align = "left", className = "" }: StatProps) {
  const valueColor = accent ? STAT_ACCENT[accent] : "text-foreground";
  const alignClass = align === "center" ? "items-center" : "items-start";
  return (
    <div className={["flex flex-col gap-0.5", alignClass, className].join(" ")}>
      {icon && <span className="text-[color:var(--text-muted)]">{icon}</span>}
      <span className={["text-xs font-bold", valueColor].join(" ")}>{value}</span>
      {label && <span className="text-[10px] text-[color:var(--text-muted)]">{label}</span>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// StatGrid — 3-column centered stats (ArtistCard pattern)
// ---------------------------------------------------------------------------

function StatGrid({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={["grid grid-cols-3 gap-2 py-2 border-t border-[color:var(--border-subtle)]", className].join(" ")}>
      {children}
    </div>
  );
}

function StatGridItem({ icon, value, label, accent }: StatProps) {
  const valueColor = accent ? STAT_ACCENT[accent] : "text-foreground";
  return (
    <div className="flex flex-col items-center gap-0.5">
      {icon && <span className="text-[color:var(--text-muted)]">{icon}</span>}
      <span className={["text-xs font-bold", valueColor].join(" ")}>{value}</span>
      {label && <span className="text-[10px] text-[color:var(--text-muted)]">{label}</span>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PriceRow — price display with optional strikethrough
// ---------------------------------------------------------------------------

interface PriceRowProps {
  price: number;
  salePrice?: number | null;
  free?: boolean;
  suffix?: React.ReactNode; // e.g. a Zap icon
}

function PriceRow({ price, salePrice, free, suffix }: PriceRowProps) {
  const display = salePrice ?? price;
  return (
    <div className="flex items-center justify-between mt-auto pt-1">
      <div className="flex items-center gap-2">
        {free || price === 0
          ? <span className="text-base font-black text-success">FREE</span>
          : <>
            <span className="text-base font-black text-foreground">${display.toFixed(2)}</span>
            {salePrice !== null && salePrice !== undefined && (
              <span className="text-xs line-through text-[color:var(--text-muted)]">${price.toFixed(2)}</span>
            )}
          </>
        }
      </div>
      {suffix}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SaleBadge — "SALE" chip for media area
// ---------------------------------------------------------------------------

function SaleBadge({ position = "bottom-left" }: { position?: "bottom-left" | "bottom-right" }) {
  const posClass = position === "bottom-left" ? "absolute bottom-2.5 left-2.5" : "absolute bottom-2.5 right-2.5";
  return (
    <div className={["px-1.5 py-0.5 rounded bg-danger text-white text-[9px] font-black tracking-wide", posClass].join(" ")}>
      SALE
    </div>
  );
}

// ---------------------------------------------------------------------------
// Actions — hover-reveal row of icon buttons
// ---------------------------------------------------------------------------

interface ActionButton {
  icon: React.ReactNode;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  variant?: "default" | "danger";
  /** If true, takes a fixed width instead of flex-1 */
  iconOnly?: boolean;
}

interface ActionsProps {
  buttons: ActionButton[];
  className?: string;
}

function Actions({ buttons, className = "" }: ActionsProps) {
  const hovered = useContext(HoverCtx);

  return (
    <div
      className={[
        "flex gap-1.5 transition-opacity duration-150 mt-auto",
        hovered ? "opacity-100" : "opacity-0",
        className,
      ].join(" ")}
      onClick={e => e.stopPropagation()}
    >
      {buttons.map(btn => {
        if (btn.iconOnly) {
          return (
            <button
              key={btn.label}
              onClick={btn.onClick}
              title={btn.label}
              className={[
                "w-8 flex items-center justify-center rounded-lg border bg-transparent cursor-pointer transition-colors",
                btn.variant === "danger"
                  ? "border-[color:var(--border-subtle)] text-[color:var(--text-muted)] hover:bg-danger/10 hover:text-danger hover:border-danger/30"
                  : "border-[color:var(--border-subtle)] text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground",
              ].join(" ")}
            >
              {btn.icon}
            </button>
          );
        }
        return (
          <button
            key={btn.label}
            onClick={btn.onClick}
            className={[
              "flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border bg-transparent text-[11px] font-semibold cursor-pointer transition-colors",
              btn.variant === "danger"
                ? "border-danger/30 bg-danger/10 text-danger hover:bg-danger/20"
                : "border-[color:var(--border-subtle)] text-[color:var(--text-secondary)] hover:bg-elevated hover:text-foreground",
            ].join(" ")}
          >
            {btn.icon}
            {btn.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Convenience preset: standard View / Edit / Archive actions
// ---------------------------------------------------------------------------

interface StandardActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onArchive?: () => void;
  className?: string;
}

function StandardActions({ onView, onEdit, onDuplicate, onArchive, className }: StandardActionsProps) {
  const buttons: ActionButton[] = [
    ...(onView ? [{ icon: <Eye size={11} />, label: "View", onClick: (e: React.MouseEvent) => { e.stopPropagation(); onView(); } }] : []),
    ...(onEdit ? [{ icon: <Pencil size={11} />, label: "Edit", onClick: (e: React.MouseEvent) => { e.stopPropagation(); onEdit(); } }] : []),
    ...(onDuplicate ? [{ icon: <Copy size={11} />, label: "Duplicate", onClick: (e: React.MouseEvent) => { e.stopPropagation(); onDuplicate(); } }] : []),
    ...(onArchive ? [{ icon: <Archive size={11} />, label: "Archive", onClick: (e: React.MouseEvent) => { e.stopPropagation(); onArchive(); }, variant: "danger" as const, iconOnly: true }] : []),
  ];
  return <Actions buttons={buttons} className={className} />;
}

// ---------------------------------------------------------------------------
// MediaOverlayActions — frosted glass buttons overlaid on image (ProductCard)
// ---------------------------------------------------------------------------

interface MediaOverlayActionsProps {
  buttons: Array<{ icon: React.ReactNode; label: string; onClick: () => void }>;
}

function MediaOverlayActions({ buttons }: MediaOverlayActionsProps) {
  const hovered = useContext(HoverCtx);
  return (
    <div
      className={["absolute inset-0 bg-black/60 flex items-center justify-center gap-2 transition-opacity duration-200", hovered ? "opacity-100" : "opacity-0"].join(" ")}
      onClick={e => e.stopPropagation()}
    >
      {buttons.map(btn => (
        <button
          key={btn.label}
          onClick={btn.onClick}
          title={btn.label}
          className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-sm cursor-pointer hover:bg-white/25 transition-colors"
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exports — attach sub-components as static properties
// ---------------------------------------------------------------------------

Card.AccentBand = AccentBand;
Card.MediaBanner = MediaBanner;
Card.BannerWithAvatar = BannerWithAvatar;
Card.Body = Body;
Card.StatusBadge = StatusBadge;
Card.FeaturedBadge = FeaturedBadge;
Card.CategoryPill = CategoryPill;
Card.Title = Title;
Card.Meta = Meta;
Card.Divider = Divider;
Card.StatRow = StatRow;
Card.Stat = Stat;
Card.StatGrid = StatGrid;
Card.StatGridItem = StatGridItem;
Card.PriceRow = PriceRow;
Card.SaleBadge = SaleBadge;
Card.Actions = Actions;
Card.StandardActions = StandardActions;
Card.MediaOverlayActions = MediaOverlayActions;

export default Card;
export type { StatusVariant, AccentColor, ActionButton };
