// components/offers/OfferDrawer.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  X, Pencil, CheckCircle2, XCircle, MessageSquare, Clock,
  Music2, Library, Package, Wrench, User, Award, BadgeCheck,
  TrendingUp, ShoppingCart, Tag, BarChart3, Send, ChevronDown,
} from "lucide-react";
import type { Offer, OfferStatus, ProductType, OfferRevision, CounterOfferFormValues } from "@/services/offers/types";

interface Props {
  offer: Offer | null;
  onClose: () => void;
  onCounter: (o: Offer, data: CounterOfferFormValues) => void;
  onAccept: (o: Offer) => void;
  onReject: (o: Offer) => void;
}

type Tab = "overview" | "negotiation" | "customer" | "product" | "history" | "analytics";

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "negotiation", label: "Negotiation" },
  { key: "customer", label: "Customer" },
  { key: "product", label: "Product" },
  { key: "history", label: "History" },
  { key: "analytics", label: "Analytics" },
];

const STATUS_CLASSES: Record<OfferStatus, string> = {
  pending: "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]",
  countered: "bg-accent-cyan/10 text-accent-cyan",
  accepted: "bg-success/10 text-success",
  rejected: "bg-danger/10 text-danger",
  expired: "bg-white/10 text-white/40",
  withdrawn: "bg-white/10 text-white/40",
};

const TYPE_ICON: Record<ProductType, React.ReactNode> = {
  track: <Music2 size={13} />,
  collection: <Library size={13} />,
  digital_product: <Package size={13} />,
  service: <Wrench size={13} />,
};

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 border-b border-[color:var(--border-subtle)]/40 last:border-0">
      <span className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)]">{label}</span>
      <span className="text-sm text-[color:var(--text-secondary)]">{value}</span>
    </div>
  );
}

function fmtDate(d: string) {
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string) {
  return name.split(/[._\s]/).map(p => p[0]).join("").toUpperCase().slice(0, 2);
}

function RevisionBubble({ rev }: { rev: OfferRevision }) {
  const isAdmin = rev.senderType === "admin";
  const isSystem = rev.senderType === "system";

  const bubbleColor = isSystem
    ? "bg-elevated border border-[color:var(--border-subtle)]"
    : isAdmin
      ? "bg-accent/10 border border-accent/20"
      : "bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)]";

  const typeLabel: Record<string, string> = {
    offer: "Offer", counter: "Counter", accept: "Accepted",
    reject: "Rejected", expire: "Expired", withdraw: "Withdrawn", note: "Note",
  };

  const typeColor: Record<string, string> = {
    offer: "text-[color:var(--color-warning)]", counter: "text-accent-cyan",
    accept: "text-success", reject: "text-danger", expire: "text-[color:var(--text-muted)]",
    withdraw: "text-[color:var(--text-muted)]", note: "text-[color:var(--text-muted)]",
  };

  return (
    <div className={`flex flex-col gap-1 ${isAdmin ? "items-end" : isSystem ? "items-center" : "items-start"}`}>
      {!isSystem && (
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-semibold ${typeColor[rev.revisionType]}`}>{typeLabel[rev.revisionType]}</span>
          <span className="text-[10px] text-[color:var(--text-muted)]">· {rev.submittedBy}</span>
        </div>
      )}
      <div className={`px-3.5 py-2.5 rounded-2xl max-w-[85%] ${bubbleColor} ${isAdmin ? "rounded-tr-sm" : isSystem ? "rounded-lg" : "rounded-tl-sm"}`}>
        {rev.amount !== null && (
          <div className="text-lg font-black text-foreground tracking-tight mb-1">
            ${rev.amount.toFixed(2)}
          </div>
        )}
        <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">{rev.message}</p>
      </div>
      <span className="text-[10px] text-[color:var(--text-muted)] px-1">{fmtDate(rev.createdAt)}</span>
    </div>
  );
}

export default function OfferDrawer({ offer, onClose, onCounter, onAccept, onReject }: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const [counterAmount, setCounterAmount] = useState("");
  const [counterMessage, setCounterMessage] = useState("");
  const [counterExpiry, setCounterExpiry] = useState("");
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"accept" | "reject" | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (offer) { setTab("overview"); setShowCounterForm(false); setConfirmAction(null); } }, [offer?.id]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    if (tab === "negotiation") {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [tab, offer?.id]);

  if (!offer) return null;

  const canAct = offer.status === "pending" || offer.status === "countered";
  const diff = ((offer.currentOfferAmount - offer.originalPrice) / offer.originalPrice * 100).toFixed(1);
  const analytics = offer.analytics;

  const handleCounter = () => {
    if (!counterAmount.trim()) return;
    onCounter(offer, { amount: counterAmount, message: counterMessage, expiresAt: counterExpiry });
    setCounterAmount(""); setCounterMessage(""); setShowCounterForm(false);
  };

  const handleConfirm = () => {
    if (confirmAction === "accept") onAccept(offer);
    else if (confirmAction === "reject") onReject(offer);
    setConfirmAction(null);
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[350]" />

      <aside className="fixed top-0 right-0 bottom-0 w-[500px] bg-surface border-l border-[color:var(--border-subtle)] z-[360] flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border-subtle)] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-elevated flex items-center justify-center shrink-0 border border-[color:var(--border-subtle)]">
              {offer.customerAvatar
                ? <img src={offer.customerAvatar} alt={offer.customerName} className="w-full h-full object-cover" />
                : <span className="text-xs font-bold text-[color:var(--text-muted)]">{getInitials(offer.customerName)}</span>
              }
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">{offer.customerName}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_CLASSES[offer.status]}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </span>
              </div>
              <p className="text-[11px] font-mono text-[color:var(--text-muted)]">{offer.id} · {offer.productTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {canAct && (
              <>
                <button onClick={() => setConfirmAction("accept")} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-success/10 text-success border-0 cursor-pointer hover:bg-success/20 transition-colors">
                  Accept
                </button>
                <button onClick={() => setConfirmAction("reject")} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-danger/10 text-danger border-0 cursor-pointer hover:bg-danger/20 transition-colors">
                  Reject
                </button>
              </>
            )}
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Confirm dialog */}
        {confirmAction && (
          <div className={`mx-4 mt-3 p-3.5 rounded-xl border text-sm ${confirmAction === "accept" ? "bg-success/5 border-success/20" : "bg-danger/5 border-danger/20"}`}>
            <p className={`font-semibold mb-2 ${confirmAction === "accept" ? "text-success" : "text-danger"}`}>
              {confirmAction === "accept" ? "Accept this offer?" : "Reject this offer?"}
            </p>
            <p className="text-xs text-[color:var(--text-secondary)] mb-3">
              {confirmAction === "accept"
                ? `Accepting $${offer.currentOfferAmount.toFixed(2)} — an order will be created automatically.`
                : "This will permanently reject the offer. The customer will be notified."
              }
            </p>
            <div className="flex gap-2">
              <button onClick={handleConfirm} className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer border-0 ${confirmAction === "accept" ? "bg-success text-white hover:bg-success/90" : "bg-danger text-white hover:bg-danger/90"} transition-colors`}>
                Confirm
              </button>
              <button onClick={() => setConfirmAction(null)} className="flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer bg-elevated border border-[color:var(--border-subtle)] text-[color:var(--text-secondary)] hover:text-foreground transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-[color:var(--border-subtle)] px-5 shrink-0 overflow-x-auto mt-1">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-0 bg-transparent cursor-pointer transition-colors border-b-2 -mb-px
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
              {/* Price hero */}
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-2xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[10px] text-[color:var(--text-muted)] mb-1">Customer Offer</p>
                    <div className="text-3xl font-black text-foreground tracking-tight">${offer.currentOfferAmount.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[color:var(--text-muted)] mb-1">Listed Price</p>
                    <div className="text-lg font-semibold text-[color:var(--text-secondary)] line-through">${offer.originalPrice.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${Number(diff) < 0 ? "text-danger" : "text-success"}`}>
                    {Number(diff) > 0 ? "+" : ""}{diff}% ({Number(diff) < 0 ? "-" : "+"}${Math.abs(offer.currentOfferAmount - offer.originalPrice).toFixed(2)})
                  </span>
                  <span className="text-xs text-[color:var(--text-muted)]">from listed price</span>
                </div>
              </div>

              {/* Meta */}
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <MetaRow label="Item" value={
                  <span className="flex items-center gap-1.5">
                    {TYPE_ICON[offer.productType]}
                    {offer.productTitle} — {offer.licensePlan}
                  </span>
                } />
                <MetaRow label="Artist" value={offer.productArtist} />
                <MetaRow label="Assigned Admin" value={offer.assignedAdmin} />
                <MetaRow label="Created" value={fmtDate(offer.createdAt)} />
                <MetaRow label="Expires" value={offer.expiresAt ? fmtDate(offer.expiresAt) : "No expiry"} />
                <MetaRow label="Rounds" value={`${offer.revisions.length} revision${offer.revisions.length !== 1 ? "s" : ""}`} />
              </div>

              {/* Quick actions */}
              {canAct && (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setTab("negotiation"); setShowCounterForm(true); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan text-xs font-semibold cursor-pointer hover:bg-accent-cyan/20 transition-colors"
                  >
                    <MessageSquare size={13} /> Counter Offer
                  </button>
                  <button onClick={() => setConfirmAction("accept")} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-success/30 bg-success/10 text-success text-xs font-semibold cursor-pointer hover:bg-success/20 transition-colors">
                    <CheckCircle2 size={13} /> Accept
                  </button>
                  <button onClick={() => setConfirmAction("reject")} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-danger/30 bg-danger/10 text-danger text-xs font-semibold cursor-pointer hover:bg-danger/20 transition-colors">
                    <XCircle size={13} /> Reject
                  </button>
                </div>
              )}
            </div>
          )}

          {/* NEGOTIATION */}
          {tab === "negotiation" && (
            <div className="flex flex-col gap-3">
              <p className="text-[11px] text-[color:var(--text-muted)]">{offer.revisions.length} round{offer.revisions.length !== 1 ? "s" : ""} of negotiation</p>
              {offer.revisions.map(rev => (
                <RevisionBubble key={rev.id} rev={rev} />
              ))}
              <div ref={bottomRef} />

              {/* Counter form */}
              {canAct && (
                <div className="mt-2">
                  {!showCounterForm ? (
                    <button
                      onClick={() => setShowCounterForm(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-[color:var(--border-default)] bg-transparent text-[color:var(--text-muted)] text-sm font-semibold cursor-pointer hover:border-accent hover:text-accent transition-colors"
                    >
                      <MessageSquare size={14} /> Submit Counter Offer
                    </button>
                  ) : (
                    <div className="bg-[color:var(--bg-input)] border border-accent/30 rounded-xl p-4 flex flex-col gap-3">
                      <p className="text-xs font-semibold text-[color:var(--text-muted)] uppercase tracking-wide">Counter Offer</p>
                      <div>
                        <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">Counter Amount ($) *</label>
                        <input
                          autoFocus
                          type="number" min="0" step="0.01"
                          value={counterAmount}
                          onChange={e => setCounterAmount(e.target.value)}
                          placeholder={`${(offer.currentOfferAmount * 1.1).toFixed(2)}`}
                          className="w-full bg-surface border border-[color:var(--border-default)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none focus:border-accent transition-colors placeholder:text-[color:var(--text-muted)]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">Message</label>
                        <textarea
                          value={counterMessage}
                          onChange={e => setCounterMessage(e.target.value)}
                          rows={2}
                          placeholder="Explain your counter offer..."
                          className="w-full bg-surface border border-[color:var(--border-default)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none focus:border-accent resize-none leading-relaxed placeholder:text-[color:var(--text-muted)]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">New Expiry (optional)</label>
                        <input
                          type="date"
                          value={counterExpiry}
                          onChange={e => setCounterExpiry(e.target.value)}
                          className="w-full bg-surface border border-[color:var(--border-default)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none focus:border-accent transition-colors [color-scheme:dark]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleCounter} disabled={!counterAmount.trim()} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent text-white text-xs font-bold border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[color:var(--accent-purple-hover)] transition-colors">
                          <Send size={12} /> Send Counter
                        </button>
                        <button onClick={() => setShowCounterForm(false)} className="px-4 py-2.5 rounded-xl border border-[color:var(--border-subtle)] bg-transparent text-[color:var(--text-muted)] text-xs font-semibold cursor-pointer hover:bg-elevated hover:text-foreground transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CUSTOMER */}
          {tab === "customer" && offer.customer && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-elevated flex items-center justify-center border border-[color:var(--border-subtle)]">
                  {offer.customerAvatar
                    ? <img src={offer.customerAvatar} alt={offer.customerName} className="w-full h-full object-cover" />
                    : <span className="text-sm font-bold text-[color:var(--text-muted)]">{getInitials(offer.customerName)}</span>
                  }
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{offer.customer.name}</span>
                    {offer.customer.isVip && <Award size={13} className="text-[color:var(--color-warning)]" />}
                    <BadgeCheck size={13} className="text-accent-cyan" />
                  </div>
                  <p className="text-xs text-[color:var(--text-muted)]">{offer.customer.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Lifetime Value", value: `$${offer.customer.lifetimeValue.toLocaleString()}`, color: "text-success" },
                  { label: "Total Orders", value: offer.customer.totalOrders, color: "text-foreground" },
                  { label: "Owned Licenses", value: offer.customer.ownedLicenses, color: "text-foreground" },
                  { label: "Avg. Spend", value: `$${offer.customer.averageSpend}`, color: "text-accent" },
                  { label: "Previous Offers", value: offer.customer.previousOffers, color: "text-foreground" },
                  { label: "Accepted Offers", value: offer.customer.acceptedOffers, color: "text-success" },
                ].map(s => (
                  <div key={s.label} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-3.5">
                    <div className={`text-base font-bold tracking-tight ${s.color}`}>{s.value}</div>
                    <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCT */}
          {tab === "product" && offer.product && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-elevated flex items-center justify-center border border-[color:var(--border-subtle)]">
                  {TYPE_ICON[offer.productType]}
                </div>
                <div>
                  <p className="font-bold text-foreground">{offer.product.title}</p>
                  <p className="text-xs text-[color:var(--text-muted)]">{offer.product.artist}</p>
                </div>
              </div>

              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <MetaRow label="Current Price" value={<span className="font-bold text-foreground">${offer.product.currentPrice.toFixed(2)}</span>} />
                <MetaRow label="License Plan" value={offer.product.licensePlan} />
                <MetaRow label="Available Licenses" value={offer.product.availableLicenses === 999 ? "Unlimited" : offer.product.availableLicenses} />
                <MetaRow label="Exclusive" value={offer.product.isExclusive ? "Yes — removes from store on purchase" : "No"} />
                <MetaRow label="Active Coupons" value={offer.product.activeCoupons > 0 ? `${offer.product.activeCoupons} active` : "None"} />
              </div>
            </div>
          )}

          {/* HISTORY */}
          {tab === "history" && (
            <div className="flex flex-col gap-2.5">
              {offer.history.map((event, i) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                      ${event.actorType === "admin" ? "bg-accent/10 text-accent" : event.actorType === "customer" ? "bg-[color:var(--bg-input)]" : "bg-elevated text-[color:var(--text-muted)]"}`}>
                      {event.actorType === "admin" ? <Pencil size={12} /> : event.actorType === "customer" ? <User size={12} /> : <Clock size={12} />}
                    </div>
                    {i < offer.history.length - 1 && <div className="w-px flex-1 min-h-[16px] bg-[color:var(--border-subtle)] my-1" />}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="text-sm font-semibold text-foreground">{event.action}</p>
                    <p className="text-[11px] text-[color:var(--text-muted)] mt-0.5">
                      {event.actorName} · {fmtDate(event.createdAt)}
                    </p>
                    {event.notes && <p className="text-xs text-[color:var(--text-secondary)] mt-1 italic">{event.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ANALYTICS */}
          {tab === "analytics" && analytics && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Acceptance Rate", value: `${analytics.acceptanceRate}%`, color: "text-success", icon: <CheckCircle2 size={13} /> },
                  { label: "Counter Rate", value: `${analytics.counterRate}%`, color: "text-accent-cyan", icon: <MessageSquare size={13} /> },
                  { label: "Avg. Discount", value: `${analytics.averageDiscount}%`, color: "text-[color:var(--accent-magenta)]", icon: <Tag size={13} /> },
                  { label: "Recovered Revenue", value: `$${analytics.recoveredRevenue.toLocaleString()}`, color: "text-success", icon: <TrendingUp size={13} /> },
                  { label: "Avg. Duration", value: `${analytics.averageNegotiationLength}d`, color: "text-accent", icon: <Clock size={13} /> },
                  { label: "Rejection Rate", value: `${analytics.rejectionRate}%`, color: "text-danger", icon: <XCircle size={13} /> },
                ].map(kpi => (
                  <div key={kpi.label} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-3.5 flex flex-col gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-current/10 ${kpi.color}`}>{kpi.icon}</div>
                    <div className={`text-base font-bold ${kpi.color}`}>{kpi.value}</div>
                    <div className="text-[11px] text-[color:var(--text-muted)]">{kpi.label}</div>
                  </div>
                ))}
              </div>

              {/* Top products */}
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] mb-3">Most Negotiated Products</p>
                {analytics.topProducts.map((p, i) => {
                  const max = analytics.topProducts[0].offers;
                  return (
                    <div key={p.title} className="mb-2.5">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[color:var(--text-secondary)]">{p.title}</span>
                        <span className="font-semibold text-foreground">{p.offers}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-elevated overflow-hidden">
                        <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${(p.offers / max) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
