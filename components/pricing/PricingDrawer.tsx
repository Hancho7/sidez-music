// components/pricing/PricingDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Info, DollarSign, Crown, Tag, Clock,
  CheckCircle2, XCircle, RotateCcw, TrendingUp, TrendingDown,
} from "lucide-react";
import type { TrackPricing, TrackLicensePricing, PricingHistoryEntry } from "@/services/pricing/types";
import { MOCK_TRACK_PRICING } from "@/services/pricing/mock-data";

type Tab = "overview" | "licenses" | "exclusive" | "discounts" | "history";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <Info size={13} /> },
  { id: "licenses", label: "Licenses", icon: <DollarSign size={13} /> },
  { id: "exclusive", label: "Exclusive", icon: <Crown size={13} /> },
  { id: "discounts", label: "Discounts", icon: <Tag size={13} /> },
  { id: "history", label: "History", icon: <Clock size={13} /> },
];

interface PricingDrawerProps {
  pricingId: string | null;
  onClose: () => void;
  onEdit: (id: string) => void;
}

export default function PricingDrawer({ pricingId, onClose, onEdit }: PricingDrawerProps) {
  const [detail, setDetail] = useState<TrackPricing | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [licenses, setLicenses] = useState<TrackLicensePricing[]>([]);

  useEffect(() => {
    if (!pricingId) { setDetail(null); return; }
    setLoading(true);
    setActiveTab("overview");
    setTimeout(() => {
      const data = MOCK_TRACK_PRICING[pricingId] ?? null;
      setDetail(data);
      setLicenses(data?.licenses ?? []);
      setLoading(false);
    }, 280);
  }, [pricingId]);

  const toggleLicense = (id: string) =>
    setLicenses(prev => prev.map(l => l.id === id ? { ...l, isEnabled: !l.isEnabled } : l));

  const updateOverride = (id: string, val: string) =>
    setLicenses(prev => prev.map(l => l.id === id ? { ...l, overridePrice: val === "" ? null : Number(val) } : l));

  const restoreDefault = (id: string) =>
    setLicenses(prev => prev.map(l => l.id === id ? { ...l, overridePrice: null } : l));

  return (
    <AnimatePresence>
      {pricingId && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[400]"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
          />

          <motion.aside
            key="drawer"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 right-0 bottom-0 flex flex-col overflow-hidden z-[401]"
            style={{ width: 520, background: "#111111", borderLeft: "1px solid #1f1f1f" }}
          >
            {loading || !detail ? (
              <DrawerSkeleton onClose={onClose} />
            ) : (
              <>
                {/* Header */}
                <div className="flex-shrink-0 px-6 pt-5 pb-0" style={{ borderBottom: "1px solid #1f1f1f" }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={detail.coverImage} alt={detail.trackTitle} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                      <div className="min-w-0">
                        <h2 className="text-base font-bold m-0 tracking-[-0.02em] truncate" style={{ color: "#f5f5f5" }}>{detail.trackTitle}</h2>
                        <p className="text-xs m-0 mt-0.5" style={{ color: "#525252" }}>{detail.artistName} · {detail.genre}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => onEdit(detail.id)}
                        className="px-3.5 py-1.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors"
                        style={{ background: "rgba(255,255,255,0.08)", color: "#f5f5f5", border: "1px solid rgba(255,255,255,0.12)" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.14)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"}
                      >
                        Edit
                      </button>
                      <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors"
                        style={{ background: "#1a1a1a", border: "1px solid #2e2e2e", color: "#525252" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#f5f5f5"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#525252"}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Tab bar — scrollable */}
                  <div className="flex overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                    {TABS.map(t => (
                      <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-[12.5px] font-medium bg-transparent border-0 cursor-pointer whitespace-nowrap transition-colors"
                        style={{
                          color: activeTab === t.id ? "#f5f5f5" : "#525252",
                          borderBottom: activeTab === t.id ? "2px solid #f5f5f5" : "2px solid transparent",
                        }}
                      >
                        {t.icon} {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>
                  {activeTab === "overview" && <OverviewTab detail={detail} />}
                  {activeTab === "licenses" && <LicensesTab licenses={licenses} onToggle={toggleLicense} onUpdate={updateOverride} onRestore={restoreDefault} />}
                  {activeTab === "exclusive" && <ExclusiveTab detail={detail} />}
                  {activeTab === "discounts" && <DiscountsTab detail={detail} />}
                  {activeTab === "history" && <HistoryTab history={detail.history} />}
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Overview Tab ── */
function OverviewTab({ detail }: { detail: TrackPricing }) {
  const completeLicenses = detail.licenses.filter(l => l.isEnabled).length;
  return (
    <div className="flex flex-col gap-5">
      <img src={detail.coverImage} alt={detail.trackTitle} style={{ width: "100%", borderRadius: 10, objectFit: "cover", aspectRatio: "16/9" }} />
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Active Licenses" value={`${completeLicenses} / ${detail.licenses.length}`} />
        <StatCard label="Pricing Status" value={detail.status} />
        <StatCard label="Created" value={new Date(detail.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
        <StatCard label="Last Updated" value={new Date(detail.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
      </div>
      <Field label="Artist" value={detail.artistName} />
      <Field label="Genre" value={detail.genre} />
    </div>
  );
}

/* ── Licenses Tab ── */
function LicensesTab({ licenses, onToggle, onUpdate, onRestore }: {
  licenses: TrackLicensePricing[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, val: string) => void;
  onRestore: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {licenses.map(l => {
        const effectivePrice = l.overridePrice ?? l.defaultPrice;
        const hasOverride = l.overridePrice !== null;
        const diff = hasOverride ? l.overridePrice! - l.defaultPrice : 0;

        return (
          <div key={l.id} className="rounded-xl p-4" style={{ background: "#1a1a1a", border: `1px solid ${l.isEnabled ? "#2e2e2e" : "#1f1f1f"}`, opacity: l.isEnabled ? 1 : 0.5 }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: "#f5f5f5" }}>{l.licenseName}</span>
                  {hasOverride && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "#a3a3a3" }}>Custom</span>
                  )}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: "#525252" }}>Default: ${l.defaultPrice}</div>
              </div>
              <Toggle checked={l.isEnabled} onChange={() => onToggle(l.id)} />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#525252" }}>$</span>
                <input
                  type="number"
                  value={l.overridePrice ?? l.defaultPrice}
                  disabled={!l.isEnabled}
                  onChange={e => onUpdate(l.id, e.target.value)}
                  className="w-full pl-7 pr-3 py-2 text-sm font-bold rounded-lg outline-none"
                  style={{ background: "#0d0d0d", border: "1px solid #2e2e2e", color: "#f5f5f5", fontFamily: "inherit" }}
                />
              </div>

              {hasOverride && (
                <>
                  <div className="flex items-center gap-1 text-xs" style={{ color: diff > 0 ? "#d4d4d4" : "#737373" }}>
                    {diff > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {diff > 0 ? "+" : ""}${diff}
                  </div>
                  <button
                    onClick={() => onRestore(l.id)}
                    title="Restore default"
                    className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-colors"
                    style={{ background: "#111111", border: "1px solid #2e2e2e", color: "#525252" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#f5f5f5"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#525252"}
                  >
                    <RotateCcw size={12} />
                  </button>
                </>
              )}
            </div>

            {/* Toggles row */}
            <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: "1px solid #222222" }}>
              <MiniToggle label="For Sale" checked={l.availableForSale} />
              <MiniToggle label="Discounts" checked={l.allowDiscounts} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Exclusive Tab ── */
function ExclusiveTab({ detail }: { detail: TrackPricing }) {
  const ex = detail.exclusive;
  if (!ex) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Crown size={32} style={{ color: "#2e2e2e", marginBottom: 12 }} />
      <p className="text-sm" style={{ color: "#525252" }}>No exclusive license configured for this track.</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Available" value={ex.available.toString()} />
        <StatCard label="Reserved" value={ex.reserved.toString()} />
        <StatCard label="Sold" value={ex.sold.toString()} />
      </div>

      <Field label="Exclusive Price" value={`$${ex.price.toLocaleString()}`} />
      <Field label="Instant Buy Price" value={ex.instantBuyPrice ? `$${ex.instantBuyPrice}` : "Not set"} />
      <Field label="Allow Offers" value={ex.allowOffers ? "Yes" : "No"} />
      {ex.allowOffers && ex.minimumOfferPrice && (
        <Field label="Minimum Offer" value={`$${ex.minimumOfferPrice}`} />
      )}
      <Field label="Auto-disable others" value={ex.autoDisableOthers ? "Yes — enabled after purchase" : "No"} />
      {ex.notes && <Field label="Notes" value={ex.notes} />}
    </div>
  );
}

/* ── Discounts Tab ── */
function DiscountsTab({ detail }: { detail: TrackPricing }) {
  const discounts = detail.discounts;
  if (!discounts.length) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Tag size={32} style={{ color: "#2e2e2e", marginBottom: 12 }} />
      <p className="text-sm" style={{ color: "#525252" }}>No discount rules configured.</p>
      <button className="mt-4 px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer"
        style={{ background: "#1a1a1a", border: "1px solid #2e2e2e", color: "#f5f5f5" }}>
        Add Discount Rule
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {discounts.map(d => (
        <div key={d.id} className="rounded-xl p-4" style={{ background: "#1a1a1a", border: "1px solid #2e2e2e" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold" style={{ color: "#f5f5f5" }}>{d.type === "PERCENTAGE" ? `${d.value}% off` : d.type === "FIXED" ? `$${d.value} off` : `Campaign: $${d.campaignPrice}`}</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: d.isActive ? "rgba(255,255,255,0.08)" : "transparent", color: d.isActive ? "#d4d4d4" : "#525252", border: "1px solid #2e2e2e" }}>
              {d.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="text-xs" style={{ color: "#525252" }}>
            {new Date(d.startDate).toLocaleDateString()} — {new Date(d.endDate).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── History Tab ── */
function HistoryTab({ history }: { history: PricingHistoryEntry[] }) {
  if (!history.length) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Clock size={32} style={{ color: "#2e2e2e", marginBottom: 12 }} />
      <p className="text-sm" style={{ color: "#525252" }}>No pricing changes recorded yet.</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-0 relative">
      {/* vertical line */}
      <div className="absolute left-[19px] top-4 bottom-4 w-px" style={{ background: "#2e2e2e" }} />
      {history.map((h, i) => {
        const increased = h.newPrice > h.oldPrice;
        return (
          <div key={h.id} className="flex gap-4 pb-6 relative">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10"
              style={{ background: "#1a1a1a", border: "1px solid #2e2e2e" }}>
              {increased ? <TrendingUp size={14} style={{ color: "#d4d4d4" }} /> : <TrendingDown size={14} style={{ color: "#737373" }} />}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="text-sm font-semibold" style={{ color: "#f5f5f5" }}>
                {h.licenseName} — ${h.oldPrice} → ${h.newPrice}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#525252" }}>
                {h.changedBy} · {new Date(h.changedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </div>
              {h.reason && <div className="text-xs mt-1 italic" style={{ color: "#737373" }}>{h.reason}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Shared sub-components ── */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.06em] mb-1" style={{ color: "#525252" }}>{label}</div>
      <div className="text-sm" style={{ color: "#f5f5f5" }}>{value}</div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl p-3 text-center" style={{ background: "#1a1a1a", border: "1px solid #2e2e2e" }}>
      <div className="text-base font-bold" style={{ color: "#f5f5f5" }}>{value}</div>
      <div className="text-[11px] mt-0.5" style={{ color: "#525252" }}>{label}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className="relative w-9 h-5 rounded-full border-0 cursor-pointer transition-colors duration-200 flex-shrink-0"
      style={{ background: checked ? "#ffffff" : "#2e2e2e" }}>
      <span className="absolute top-[3px] w-3.5 h-3.5 rounded-full transition-all duration-200"
        style={{ left: checked ? "18px" : "3px", background: checked ? "#080808" : "#525252" }} />
    </button>
  );
}

function MiniToggle({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-3.5 h-3.5 rounded flex items-center justify-center" style={{ background: checked ? "rgba(255,255,255,0.1)" : "transparent", border: "1px solid #2e2e2e" }}>
        {checked && <CheckCircle2 size={10} style={{ color: "#d4d4d4" }} />}
      </div>
      <span className="text-[11px]" style={{ color: "#737373" }}>{label}</span>
    </div>
  );
}

function DrawerSkeleton({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6">
      <div className="flex justify-end mb-5">
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer"
          style={{ background: "#1a1a1a", border: "1px solid #2e2e2e", color: "#525252" }}>
          <X size={15} />
        </button>
      </div>
      {[120, 24, 16, 16, 16, 16].map((h, i) => (
        <div key={i} className="animate-pulse" style={{ height: h, background: "#1a1a1a", borderRadius: 8, marginBottom: 14, width: i === 0 ? "100%" : `${85 - i * 8}%` }} />
      ))}
    </div>
  );
}
