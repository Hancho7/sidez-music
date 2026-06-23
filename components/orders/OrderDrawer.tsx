// components/orders/OrderDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import {
  X, ShoppingBag, CheckCircle2, XCircle, Download, CreditCard,
  Receipt, ScrollText, RotateCcw, Globe, Zap, Radio, Tv2, DollarSign,
  Clock, CheckCircle, AlertCircle, XOctagon,
} from "lucide-react";
import type { Order, PaymentStatus } from "@/services/orders/types";

interface Props {
  order: Order | null;
  onClose: () => void;
  onMarkPaid: (order: Order) => void;
  onRefund: (order: Order) => void;
}

type Tab = "overview" | "payment" | "licensing" | "refund";

const STATUS_STYLE: Record<PaymentStatus, { bg: string; color: string }> = {
  PAID: { bg: "bg-success/10", color: "text-success" },
  PENDING: { bg: "bg-[color:var(--color-warning)]/10", color: "text-[color:var(--color-warning)]" },
  FAILED: { bg: "bg-danger/10", color: "text-danger" },
  REFUNDED: { bg: "bg-[#a4abd0]/10", color: "text-[#a4abd0]" },
};

const STATUS_ICON: Record<PaymentStatus, React.ReactNode> = {
  PAID: <CheckCircle size={12} />,
  PENDING: <Clock size={12} />,
  FAILED: <XOctagon size={12} />,
  REFUNDED: <RotateCcw size={12} />,
};

const METHOD_LABEL: Record<string, string> = { stripe: "Stripe", paypal: "PayPal", manual: "Manual" };

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-3">
      {children}
    </div>
  );
}

function MetaChip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)]">{label}</span>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

function RightRow({ icon, label, ok }: { icon: React.ReactNode; label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#1a2038]">
      <div className="flex items-center gap-2.5">
        <div className="text-[color:var(--text-muted)] flex">{icon}</div>
        <span className="text-xs text-[color:var(--text-secondary)]">{label}</span>
      </div>
      {ok
        ? <div className="flex items-center gap-1.5 text-success text-[11px] font-semibold"><CheckCircle2 size={13} /> Yes</div>
        : <div className="flex items-center gap-1.5 text-[#3a4070] text-[11px] font-semibold"><XCircle size={13} /> No</div>}
    </div>
  );
}

function fmtLimit(n: number | null) {
  return n === null ? "Unlimited" : n.toLocaleString();
}

export default function OrderDrawer({ order, onClose, onMarkPaid, onRefund }: Props) {
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => { if (order) setTab("overview"); }, [order?.id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!order) return null;

  const totalRefunded = order.refunds.reduce((sum, r) => sum + r.amount, 0);
  const canRefund = order.paymentStatus === "PAID" && totalRefunded < order.totalAmount;
  const TABS: Tab[] = ["overview", "payment", "licensing", "refund"];
  const statusStyle = STATUS_STYLE[order.paymentStatus] || STATUS_STYLE.PAID;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/50 z-[350] backdrop-blur-sm" />

      <aside className="fixed top-0 right-0 bottom-0 w-[480px] bg-surface border-l border-[color:var(--border-subtle)] z-[360] flex flex-col overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4.5 border-b border-[color:var(--border-subtle)] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-lg bg-accent/12 flex items-center justify-center">
              <ShoppingBag size={16} className="text-accent" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground font-mono">{order.id}</div>
              <div className="text-xs text-[color:var(--text-muted)]">{order.customerName}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {order.paymentStatus === "PENDING" && (
              <button
                onClick={() => onMarkPaid(order)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-success/30 bg-success/10 text-success text-xs font-semibold cursor-pointer transition-all hover:bg-success/20"
              >
                <CheckCircle2 size={13} />
                Mark Paid
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer flex items-center justify-center text-[color:var(--text-muted)] transition-all hover:bg-elevated hover:text-foreground"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[color:var(--border-subtle)] px-5 flex-shrink-0 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 border-0 bg-transparent cursor-pointer text-sm font-semibold whitespace-nowrap capitalize transition-colors border-b-2 -mb-px
                ${tab === t
                  ? "text-accent border-accent"
                  : "text-[color:var(--text-muted)] border-transparent hover:text-foreground"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 px-5 py-5 overflow-y-auto">

          {/* ---- OVERVIEW ---- */}
          {tab === "overview" && (
            <div className="flex flex-col gap-5">
              {/* Status + total */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.color}`}>
                  {STATUS_ICON[order.paymentStatus]}
                  {order.paymentStatus.charAt(0) + order.paymentStatus.slice(1).toLowerCase()}
                </span>
                <span className="text-[22px] font-bold text-success tracking-[-0.02em]">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>

              {/* Customer info */}
              <div className="bg-input border border-[color:var(--border-subtle)] rounded-xl px-4 py-3.5">
                <div className="text-sm font-bold text-foreground mb-0.5">{order.customerName}</div>
                <div className="text-xs text-[color:var(--text-muted)]">{order.customerEmail}</div>
                <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">Customer ID: {order.customerId}</div>
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-3 gap-4 px-4 py-4 bg-input rounded-xl border border-[color:var(--border-subtle)]">
                <MetaChip label="Items" value={order.items.length} />
                <MetaChip label="Method" value={METHOD_LABEL[order.paymentMethod]} />
                <MetaChip label="Date" value={new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })} />
              </div>

              {/* Purchased items */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-bold text-foreground">Purchased Items</span>
                  <span className="text-xs text-[color:var(--text-muted)]">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {order.items.map(it => (
                    <div key={it.id} className="bg-input border border-[color:var(--border-subtle)] rounded-xl px-4 py-3.5">
                      <div className="flex items-start justify-between gap-2.5">
                        <div>
                          <div className="text-sm font-bold text-foreground">{it.trackName}</div>
                          <div className="text-xs text-[color:var(--text-muted)] mt-0.5">{it.artistName}</div>
                        </div>
                        <span className="text-sm font-bold text-success whitespace-nowrap">${it.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-[0.03em] bg-accent-cyan/10 text-accent-cyan">
                          {it.licenseType}
                        </span>
                        {it.downloadUrl && order.paymentStatus === "PAID" ? (
                          <a href={it.downloadUrl} className="inline-flex items-center gap-1.5 text-[11px] text-accent no-underline font-semibold">
                            <Download size={11} />
                            Download
                          </a>
                        ) : (
                          <span className="text-[11px] text-[color:var(--text-muted)]">Access locked</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---- PAYMENT ---- */}
          {tab === "payment" && (
            <div className="flex flex-col gap-5">
              <div>
                <SectionTitle>Payment Details</SectionTitle>
                <div className="bg-input border border-[color:var(--border-subtle)] rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a2038]">
                    <div className="flex items-center gap-2">
                      <CreditCard size={13} className="text-[color:var(--text-muted)]" />
                      <span className="text-xs text-[color:var(--text-secondary)]">Method</span>
                    </div>
                    <span className="text-xs font-semibold text-foreground">{METHOD_LABEL[order.payment.provider]}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a2038]">
                    <div className="flex items-center gap-2">
                      <Receipt size={13} className="text-[color:var(--text-muted)]" />
                      <span className="text-xs text-[color:var(--text-secondary)]">Transaction ID</span>
                    </div>
                    <span className="text-[11px] font-semibold text-foreground font-mono">{order.payment.transactionId}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      <DollarSign size={13} className="text-[color:var(--text-muted)]" />
                      <span className="text-xs text-[color:var(--text-secondary)]">Amount</span>
                    </div>
                    <span className="text-sm font-bold text-success">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status timeline */}
              <div>
                <SectionTitle>Status Timeline</SectionTitle>
                <div className="flex flex-col gap-0">
                  {order.payment.timeline.map((ev, i) => {
                    const evStatus = STATUS_STYLE[ev.status] || STATUS_STYLE.PAID;
                    return (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-5.5 h-5.5 rounded-full flex-shrink-0 flex items-center justify-center ${evStatus.bg} ${evStatus.color}`}>
                            {STATUS_ICON[ev.status]}
                          </div>
                          {i < order.payment.timeline.length - 1 && (
                            <div className="w-px flex-1 min-h-[24px] bg-[color:var(--border-subtle)]" />
                          )}
                        </div>
                        <div className="pb-4.5">
                          <div className="text-xs font-bold text-foreground">
                            {ev.status.charAt(0) + ev.status.slice(1).toLowerCase()}
                          </div>
                          <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">
                            {new Date(ev.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </div>
                          {ev.note && (
                            <div className="text-[11px] text-[color:var(--text-secondary)] mt-0.5">{ev.note}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ---- LICENSING ---- */}
          {tab === "licensing" && (
            <div className="flex flex-col gap-3.5">
              <SectionTitle>License Rights per Item</SectionTitle>
              {order.items.map(it => (
                <div key={it.id} className="bg-input border border-[color:var(--border-subtle)] rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a2038]">
                    <div className="flex items-center gap-2">
                      <ScrollText size={13} className="text-accent" />
                      <span className="text-sm font-bold text-foreground">{it.trackName}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-cyan/10 text-accent-cyan">
                      {it.licenseType}
                    </span>
                  </div>
                  <RightRow icon={<DollarSign size={12} />} label="Commercial use" ok={it.rights.commercialUse} />
                  <RightRow icon={<Zap size={12} />} label="Streaming allowed" ok={it.rights.streamingAllowed} />
                  <RightRow icon={<Radio size={12} />} label="Radio broadcasting" ok={it.rights.radioAllowed} />
                  <RightRow icon={<Tv2 size={12} />} label="TV / Sync licensing" ok={it.rights.tvAllowed} />
                  <div className="flex items-center justify-between px-3.5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <Globe size={12} className="text-[color:var(--text-muted)]" />
                      <span className="text-xs text-[color:var(--text-secondary)]">Distribution</span>
                    </div>
                    <span className="text-[11px] font-semibold text-foreground">
                      {fmtLimit(it.rights.maxStreams)} streams · {fmtLimit(it.rights.maxDistribution)} units · {it.rights.territory}
                    </span>
                  </div>
                </div>
              ))}
              <div className="text-[11px] text-[color:var(--text-muted)] leading-relaxed">
                These rights are a snapshot taken at the moment of purchase and won&apos;t change even if the underlying license plan is edited later.
              </div>
            </div>
          )}

          {/* ---- REFUND ---- */}
          {tab === "refund" && (
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center bg-input border border-[color:var(--border-subtle)] rounded-xl px-4 py-3.5">
                <div>
                  <div className="text-[11px] text-[color:var(--text-muted)] uppercase tracking-[0.06em] font-semibold">Total refunded</div>
                  <div className="text-lg font-bold text-foreground mt-0.5">${totalRefunded.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-[color:var(--text-muted)] uppercase tracking-[0.06em] font-semibold">Order total</div>
                  <div className="text-lg font-bold text-foreground mt-0.5">${order.totalAmount.toFixed(2)}</div>
                </div>
              </div>

              {canRefund ? (
                <button
                  onClick={() => onRefund(order)}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm font-semibold cursor-pointer transition-all hover:bg-danger/20"
                >
                  <RotateCcw size={14} />
                  Issue Refund
                </button>
              ) : (
                <div className="flex items-center gap-2 px-3.5 py-3 bg-input border border-[color:var(--border-subtle)] rounded-lg">
                  <AlertCircle size={14} className="text-[color:var(--text-muted)]" />
                  <span className="text-xs text-[color:var(--text-muted)]">
                    {order.paymentStatus !== "PAID" ? "Only paid orders are eligible for a refund." : "This order has already been fully refunded."}
                  </span>
                </div>
              )}

              <div>
                <SectionTitle>Refund History</SectionTitle>
                {order.refunds.length === 0 ? (
                  <div className="text-center py-6 text-[color:var(--text-muted)] text-xs">
                    No refunds have been issued for this order.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {order.refunds.map(r => (
                      <div key={r.id} className="bg-input border border-[color:var(--border-subtle)] rounded-xl px-4 py-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-bold text-foreground">${r.amount.toFixed(2)}</div>
                            <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">
                              {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#a4abd0]/10 text-[#a4abd0]">
                            {r.status}
                          </span>
                        </div>
                        <div className="text-xs text-[color:var(--text-secondary)] mt-2">{r.reason}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </aside>
    </>
  );
}
