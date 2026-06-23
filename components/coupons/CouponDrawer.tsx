// components/coupons/CouponDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Pencil, Copy, Check, Tag, TrendingUp, ShoppingCart, Users, RotateCcw, BarChart3 } from "lucide-react";
import type { Coupon, CouponStatus } from "@/services/coupons/types";

interface Props {
  coupon: Coupon | null;
  onClose: () => void;
  onEdit: (c: Coupon) => void;
  onToggleStatus: (c: Coupon) => void;
}

type Tab = "overview" | "discount" | "eligibility" | "usage" | "history" | "analytics";

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "discount", label: "Discount" },
  { key: "eligibility", label: "Eligibility" },
  { key: "usage", label: "Usage Rules" },
  { key: "history", label: "History" },
  { key: "analytics", label: "Analytics" },
];

const STATUS_CLASSES: Record<CouponStatus, string> = {
  active: "bg-success/10 text-success",
  scheduled: "bg-accent-cyan/10 text-accent-cyan",
  expired: "bg-white/10 text-white/40",
  disabled: "bg-danger/10 text-danger",
  draft: "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]",
};

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 border-b border-[color:var(--border-subtle)]/40">
      <span className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)]">{label}</span>
      <span className="text-sm text-[color:var(--text-secondary)]">{value}</span>
    </div>
  );
}

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[color:var(--text-secondary)]">{label}</span>
        <span className="font-semibold text-foreground">{value.toLocaleString()}</span>
      </div>
      <div className="h-1.5 rounded-full bg-elevated overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
      </div>
    </div>
  );
}

export default function CouponDrawer({ coupon, onClose, onEdit, onToggleStatus }: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const [copied, setCopied] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (coupon) setTab("overview"); }, [coupon?.id]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!coupon) return null;

  const copy = () => {
    navigator.clipboard.writeText(coupon.code).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const pct = coupon.usageLimit ? (coupon.usageCount / coupon.usageLimit) * 100 : null;
  const analytics = coupon.analytics;
  const maxRedemption = analytics ? Math.max(...analytics.redemptionsOverTime.map(p => p.count), 1) : 1;
  const maxRevenue = analytics ? Math.max(...analytics.revenueOverTime.map(p => p.amount), 1) : 1;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[350]" />

      <aside className="fixed top-0 right-0 bottom-0 w-[480px] bg-surface border-l border-[color:var(--border-subtle)] z-[360] flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border-subtle)] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Tag size={16} className="text-accent" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground truncate">{coupon.campaignName}</span>
              </div>
              <button onClick={copy} className="inline-flex items-center gap-1 font-mono text-xs text-accent hover:text-accent/80 transition-colors">
                {coupon.code}
                {copied ? <Check size={10} className="text-success" /> : <Copy size={10} />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleStatus(coupon)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-colors
                ${coupon.status === "active"
                  ? "bg-danger/10 text-danger hover:bg-danger/20"
                  : "bg-success/10 text-success hover:bg-success/20"
                }`}
            >
              {coupon.status === "active" ? "Disable" : "Enable"}
            </button>
            <button onClick={() => onEdit(coupon)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[color:var(--border-default)] bg-transparent text-[color:var(--text-secondary)] text-xs font-semibold cursor-pointer hover:bg-elevated hover:text-foreground transition-colors">
              <Pencil size={12} /> Edit
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[color:var(--border-subtle)] px-5 shrink-0 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-3 text-xs font-semibold whitespace-nowrap border-0 bg-transparent cursor-pointer transition-colors border-b-2 -mb-px
                ${tab === t.key ? "text-accent border-accent" : "text-[color:var(--text-muted)] border-transparent hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_CLASSES[coupon.status]}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                </span>
                {coupon.stackable && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/10 text-[color:var(--accent-magenta)]">Stackable</span>
                )}
              </div>

              {coupon.description && (
                <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">{coupon.description}</p>
              )}

              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <MetaRow label="Coupon Code" value={<span className="font-mono font-bold text-accent">{coupon.code}</span>} />
                <MetaRow label="Campaign" value={coupon.campaignName} />
                <MetaRow label="Created By" value={coupon.createdBy} />
                <MetaRow label="Created" value={fmtDate(coupon.createdAt)} />
                <MetaRow label="Last Updated" value={fmtDate(coupon.updatedAt)} />
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Redeemed", value: coupon.usageCount.toLocaleString(), color: "text-accent" },
                  { label: "Revenue Generated", value: `$${(analytics?.revenueGenerated ?? 0).toLocaleString()}`, color: "text-success" },
                  { label: "Avg. Discount", value: `$${analytics?.averageDiscount ?? 0}`, color: "text-[color:var(--accent-magenta)]" },
                  { label: "Conversion Rate", value: `${analytics?.conversionRate ?? 0}%`, color: "text-accent-cyan" },
                ].map(s => (
                  <div key={s.label} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                    <div className={`text-lg font-bold tracking-tight ${s.color}`}>{s.value}</div>
                    <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DISCOUNT RULES */}
          {tab === "discount" && (
            <div className="flex flex-col gap-4">
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-5 text-center">
                <div className="text-4xl font-black text-[color:var(--accent-magenta)] tracking-tight">
                  {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                </div>
                <div className="text-sm text-[color:var(--text-muted)] mt-1">
                  {coupon.discountType === "percentage" ? "Percentage discount" : "Fixed amount discount"}
                </div>
              </div>

              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <MetaRow label="Discount Type" value={coupon.discountType === "percentage" ? "Percentage (%)" : "Fixed Amount ($)"} />
                <MetaRow label="Discount Value" value={coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`} />
                <MetaRow label="Maximum Discount" value={coupon.maximumDiscount ? `$${coupon.maximumDiscount}` : "No cap"} />
                <MetaRow label="Minimum Purchase" value={coupon.minimumPurchase ? `$${coupon.minimumPurchase}` : "No minimum"} />
              </div>

              {/* Preview examples */}
              <div>
                <p className="text-[11px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] mb-3">Discount Preview</p>
                <div className="flex flex-col gap-2">
                  {[29.99, 79.99, 149.99, 299.99].map(price => {
                    let discount = coupon.discountType === "percentage"
                      ? price * (coupon.discountValue / 100)
                      : coupon.discountValue;
                    if (coupon.maximumDiscount) discount = Math.min(discount, coupon.maximumDiscount);
                    const valid = !coupon.minimumPurchase || price >= coupon.minimumPurchase;
                    return (
                      <div key={price} className={`flex items-center justify-between p-3 rounded-lg border text-xs ${valid ? "bg-[color:var(--bg-input)] border-[color:var(--border-subtle)]" : "bg-elevated border-[color:var(--border-subtle)] opacity-50"}`}>
                        <span className="text-[color:var(--text-secondary)]">Order of <span className="font-semibold text-foreground">${price}</span></span>
                        {valid
                          ? <span className="font-bold text-success">-${discount.toFixed(2)} → ${(price - discount).toFixed(2)}</span>
                          : <span className="text-danger">Below minimum</span>
                        }
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ELIGIBILITY */}
          {tab === "eligibility" && (
            <div className="flex flex-col gap-4">
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <MetaRow label="Applies To" value={
                  <span className="capitalize">{coupon.eligibility.entityTarget === "all" ? "Entire Store" : coupon.eligibility.entityTarget.replace("_", " ")}</span>
                } />
                <MetaRow label="Customer Targeting" value={
                  <span className="capitalize">{coupon.eligibility.customerTarget === "all" ? "All Customers" : coupon.eligibility.customerTarget.replace("_", " ")}</span>
                } />
                <MetaRow label="Country Restrictions" value={
                  coupon.eligibility.countries.length > 0
                    ? coupon.eligibility.countries.join(", ")
                    : "All countries"
                } />
                <MetaRow label="Currency Restrictions" value={
                  coupon.eligibility.currencies.length > 0
                    ? coupon.eligibility.currencies.join(", ")
                    : "All currencies"
                } />
              </div>

              {coupon.eligibility.entityIds.length > 0 && (
                <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] mb-2">Targeted IDs</p>
                  <div className="flex flex-wrap gap-1.5">
                    {coupon.eligibility.entityIds.map(id => (
                      <span key={id} className="px-2 py-0.5 rounded-full text-xs font-mono bg-elevated text-[color:var(--text-secondary)] border border-[color:var(--border-subtle)]">{id}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* USAGE RULES */}
          {tab === "usage" && (
            <div className="flex flex-col gap-4">
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <MetaRow label="Usage Limit" value={coupon.usageLimit === null ? "Unlimited" : coupon.usageLimit.toLocaleString()} />
                <MetaRow label="Per Customer Limit" value={coupon.usagePerCustomer === null ? "Unlimited" : `${coupon.usagePerCustomer}x per customer`} />
                <MetaRow label="Stackable" value={coupon.stackable ? "Yes — can be combined with other coupons" : "No — cannot be stacked"} />
                <MetaRow label="Starts" value={fmtDate(coupon.startsAt)} />
                <MetaRow label="Expires" value={fmtDate(coupon.expiresAt)} />
              </div>

              {/* Usage progress */}
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)]">Redemption Progress</p>
                  <span className="text-sm font-bold text-foreground">
                    {coupon.usageCount} / {coupon.usageLimit === null ? "∞" : coupon.usageLimit}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-elevated overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${pct !== null && pct >= 100 ? "bg-danger" : pct !== null && pct >= 80 ? "bg-[color:var(--color-warning)]" : "bg-success"}`}
                    style={{ width: pct !== null ? `${Math.min(pct, 100)}%` : "0%" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* HISTORY */}
          {tab === "history" && (
            <div className="flex flex-col gap-2.5">
              {!coupon.redemptions?.length ? (
                <div className="text-center py-12 text-[color:var(--text-muted)]">
                  <RotateCcw size={24} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No redemptions yet.</p>
                </div>
              ) : (
                coupon.redemptions.map(r => (
                  <div key={r.id} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{r.customerName}</p>
                        <p className="text-[11px] text-[color:var(--text-muted)]">{r.customerEmail}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-success">-${r.discountAmount.toFixed(2)}</p>
                        <p className="text-[10px] text-[color:var(--text-muted)]">${r.finalAmount.toFixed(2)} final</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[color:var(--border-subtle)]/40">
                      <span className="font-mono text-[10px] text-accent">{r.orderId}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${r.status === "refunded" ? "bg-danger/10 text-danger" : "bg-success/10 text-success"}`}>
                          {r.status}
                        </span>
                        <span className="text-[10px] text-[color:var(--text-muted)]">
                          {new Date(r.redeemedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ANALYTICS */}
          {tab === "analytics" && analytics && (
            <div className="flex flex-col gap-4">
              {/* KPI row */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Redemptions", value: analytics.redemptionCount.toLocaleString(), color: "text-accent", icon: <ShoppingCart size={13} /> },
                  { label: "Revenue", value: `$${analytics.revenueGenerated.toLocaleString()}`, color: "text-success", icon: <TrendingUp size={13} /> },
                  { label: "Avg. Discount", value: `$${analytics.averageDiscount}`, color: "text-[color:var(--accent-magenta)]", icon: <Tag size={13} /> },
                  { label: "Conversion", value: `${analytics.conversionRate}%`, color: "text-accent-cyan", icon: <BarChart3 size={13} /> },
                ].map(kpi => (
                  <div key={kpi.label} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4 flex flex-col gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-current/10 ${kpi.color}`}>{kpi.icon}</div>
                    <div className={`text-lg font-bold tracking-tight ${kpi.color}`}>{kpi.value}</div>
                    <div className="text-[11px] text-[color:var(--text-muted)]">{kpi.label}</div>
                  </div>
                ))}
              </div>

              {/* Redemptions over time */}
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] mb-3">Redemptions Over Time</p>
                <div className="flex flex-col gap-1.5">
                  {analytics.redemptionsOverTime.map(p => (
                    <MiniBar key={p.date} label={new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} value={p.count} max={maxRedemption} color="var(--accent-purple)" />
                  ))}
                </div>
              </div>

              {/* Top customers */}
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] mb-3">Top Customers</p>
                <div className="flex flex-col gap-2">
                  {analytics.topCustomers.map(c => (
                    <div key={c.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users size={12} className="text-[color:var(--text-muted)]" />
                        <span className="text-xs text-[color:var(--text-secondary)]">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-[color:var(--text-muted)]">{c.redemptions}x</span>
                        <span className="font-semibold text-success">${c.spent}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
