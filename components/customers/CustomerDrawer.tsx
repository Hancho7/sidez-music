// components/customers/CustomerDrawer.tsx

"use client";

import { useState, useEffect } from "react";
import {
  X, Pencil, User, Mail, Phone, MapPin, Calendar, Globe, Clock,
  Award, Shield, CheckCircle, ShoppingBag, DollarSign, Download,
  FileText, Tag, TrendingUp, Activity, RefreshCw, ExternalLink,
  CreditCard, Music2, Users, BarChart3, PieChart, Zap,
} from "lucide-react";
import type { CustomerDetail } from "@/services/customers/types";
import Button from "@/components/ui/Button";

interface Props {
  customer: CustomerDetail | null;
  onClose: () => void;
  onEdit: (customer: CustomerDetail) => void;
}

type Tab = "profile" | "orders" | "licenses" | "downloads" | "coupons" | "analytics" | "activity";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "profile", label: "Profile", icon: <User size={13} /> },
  { key: "orders", label: "Orders", icon: <ShoppingBag size={13} /> },
  { key: "licenses", label: "Licenses", icon: <Music2 size={13} /> },
  { key: "downloads", label: "Downloads", icon: <Download size={13} /> },
  { key: "coupons", label: "Coupons", icon: <Tag size={13} /> },
  { key: "analytics", label: "Analytics", icon: <BarChart3 size={13} /> },
  { key: "activity", label: "Activity", icon: <Activity size={13} /> },
];

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPENDED: "Suspended",
  ARCHIVED: "Archived",
};

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "text-success",
  INACTIVE: "text-[color:var(--text-muted)]",
  SUSPENDED: "text-danger",
  ARCHIVED: "text-[color:var(--text-muted)]",
};

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-3">
      {children}
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-[color:var(--border-subtle)]/30">
      {icon && <span className="text-[color:var(--text-muted)] mt-0.5">{icon}</span>}
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)]">
          {label}
        </div>
        <div className="text-sm text-foreground mt-0.5 break-words">
          {value || "—"}
        </div>
      </div>
    </div>
  );
}

export default function CustomerDrawer({ customer, onClose, onEdit }: Props) {
  const [tab, setTab] = useState<Tab>("profile");

  // Reset tab to "profile" when customer changes
  useEffect(() => {
    if (customer) {
      setTab("profile");
    }
  }, [customer?.id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!customer) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/50 z-[350] backdrop-blur-sm" />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 bottom-0 w-[520px] max-w-[95vw] bg-surface border-l border-[color:var(--border-subtle)] z-[360] flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border-subtle)] flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-elevated flex items-center justify-center flex-shrink-0 border border-[color:var(--border-subtle)]">
              {customer.avatar ? (
                <img src={customer.avatar} alt={`${customer.firstName} ${customer.lastName}`} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-[color:var(--text-muted)]">
                  {getInitials(customer.firstName, customer.lastName)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground truncate">
                  {customer.firstName} {customer.lastName}
                </span>
                {customer.isVip && <Award size={12} className="text-[color:var(--color-warning)]" />}
                {customer.isVerified && <CheckCircle size={12} className="text-accent-cyan" />}
              </div>
              <p className="text-xs text-[color:var(--text-muted)] truncate">@{customer.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              onClick={() => onEdit(customer)}
              variant="secondary"
              size="sm"
              icon={<Pencil size={12} />}
            >
              Edit
            </Button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] transition-colors hover:bg-elevated hover:text-foreground"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[color:var(--border-subtle)] px-5 flex-shrink-0 overflow-x-auto gap-0.5">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-3 text-xs font-semibold whitespace-nowrap border-0 bg-transparent cursor-pointer transition-colors border-b-2 -mb-px
                ${tab === t.key
                  ? "text-accent border-accent"
                  : "text-[color:var(--text-muted)] border-transparent hover:text-foreground"
                }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* PROFILE TAB */}
          {tab === "profile" && (
            <div className="flex flex-col gap-5">
              {/* Status badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[customer.status]} bg-${customer.status === "ACTIVE" ? "success" : "muted"}/10`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {STATUS_LABEL[customer.status]}
                </span>
                {customer.isVip && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]">
                    <Award size={11} /> VIP
                  </span>
                )}
                {customer.isVerified && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-cyan/10 text-accent-cyan">
                    <CheckCircle size={11} /> Verified
                  </span>
                )}
                {customer.marketingConsent && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent">
                    <Mail size={11} /> Marketing Opt-in
                  </span>
                )}
              </div>

              {/* Basic info */}
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <SectionTitle>Customer Information</SectionTitle>
                <InfoRow label="Customer ID" value={customer.id} />
                <InfoRow label="Name" value={`${customer.firstName} ${customer.lastName}`} icon={<User size={13} />} />
                <InfoRow label="Username" value={`@${customer.username}`} />
                <InfoRow label="Email" value={customer.email} icon={<Mail size={13} />} />
                <InfoRow label="Phone" value={customer.phone || "—"} icon={<Phone size={13} />} />
                <InfoRow label="Country" value={customer.country} icon={<MapPin size={13} />} />
                <InfoRow label="Language" value={customer.language} icon={<Globe size={13} />} />
                <InfoRow label="Currency" value={customer.currency} icon={<DollarSign size={13} />} />
                <InfoRow label="Timezone" value={customer.timezone} icon={<Clock size={13} />} />
                <InfoRow label="Joined" value={new Date(customer.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} icon={<Calendar size={13} />} />
              </div>

              {/* Stats summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                  <div className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)]">Total Orders</div>
                  <div className="text-xl font-bold text-foreground mt-1">{customer.totalOrders}</div>
                </div>
                <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                  <div className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)]">Total Spent</div>
                  <div className="text-xl font-bold text-success mt-1">{formatCurrency(customer.totalSpent)}</div>
                </div>
                <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                  <div className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)]">Owned Licenses</div>
                  <div className="text-xl font-bold text-foreground mt-1">{customer.ownedLicenses}</div>
                </div>
                <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                  <div className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)]">Downloads</div>
                  <div className="text-xl font-bold text-foreground mt-1">{customer.totalDownloads}</div>
                </div>
              </div>

              {/* Notes */}
              {customer.notes.length > 0 && (
                <div>
                  <SectionTitle>Internal Notes</SectionTitle>
                  {customer.notes.map(note => (
                    <div key={note.id} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg p-3 mb-2">
                      <div className="text-xs text-[color:var(--text-secondary)]">{note.note}</div>
                      <div className="text-[10px] text-[color:var(--text-muted)] mt-1">by {note.createdBy} · {new Date(note.createdAt).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {tab === "orders" && (
            <div className="flex flex-col gap-3">
              {customer.orders.length === 0 ? (
                <div className="text-center py-10 text-[color:var(--text-muted)]">
                  <ShoppingBag size={24} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No orders yet.</p>
                </div>
              ) : (
                customer.orders.map(order => (
                  <div key={order.id} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-mono text-xs font-bold text-accent">{order.orderId}</div>
                        <div className="text-xs text-[color:var(--text-muted)] mt-1">{new Date(order.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-success">{formatCurrency(order.amount)}</div>
                        <div className="text-[10px] text-[color:var(--text-muted)]">{order.items} items</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold
                        ${order.status === "PAID" ? "bg-success/10 text-success" :
                          order.status === "PENDING" ? "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]" :
                            "bg-muted/10 text-muted"}`}>
                        {order.status}
                      </span>
                      <button className="text-[10px] text-accent hover:text-accent/80 transition-colors flex items-center gap-1">
                        <ExternalLink size={10} /> View
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* LICENSES TAB */}
          {tab === "licenses" && (
            <div className="flex flex-col gap-3">
              {customer.licenses.length === 0 ? (
                <div className="text-center py-10 text-[color:var(--text-muted)]">
                  <Music2 size={24} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No licenses owned.</p>
                </div>
              ) : (
                customer.licenses.map(license => (
                  <div key={license.id} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-foreground">{license.trackName}</div>
                        <div className="text-xs text-[color:var(--text-muted)]">{license.artistName}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-cyan/10 text-accent-cyan">
                        {license.licenseType}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-[color:var(--text-muted)]">
                      <span>Purchased: {new Date(license.purchaseDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Downloads: {license.downloadCount}</span>
                      {license.expiresAt && (
                        <>
                          <span>•</span>
                          <span>Expires: {new Date(license.expiresAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold
                        ${license.status === "ACTIVE" ? "bg-success/10 text-success" :
                          license.status === "EXPIRED" ? "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]" :
                            "bg-danger/10 text-danger"}`}>
                        {license.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* DOWNLOADS TAB */}
          {tab === "downloads" && (
            <div className="flex flex-col gap-3">
              {customer.downloads.length === 0 ? (
                <div className="text-center py-10 text-[color:var(--text-muted)]">
                  <Download size={24} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No downloads yet.</p>
                </div>
              ) : (
                customer.downloads.map(download => (
                  <div key={download.id} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-foreground">{download.trackName}</div>
                        <div className="text-xs text-[color:var(--text-muted)]">{new Date(download.downloadDate).toLocaleString()}</div>
                      </div>
                      <span className="text-xs text-[color:var(--text-muted)]">{download.downloadCount} downloads</span>
                    </div>
                    <div className="text-xs text-[color:var(--text-muted)] mt-2">
                      <span>Device: {download.device}</span>
                      {download.remainingDownloads !== null && (
                        <span className="ml-3">{download.remainingDownloads} remaining</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* COUPONS & OFFERS TAB */}
          {tab === "coupons" && (
            <div className="flex flex-col gap-4">
              {/* Coupons */}
              <div>
                <SectionTitle>Redeemed Coupons</SectionTitle>
                {customer.coupons.length === 0 ? (
                  <div className="text-center py-6 text-[color:var(--text-muted)] text-sm">No coupons redeemed.</div>
                ) : (
                  customer.coupons.map(coupon => (
                    <div key={coupon.id} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg p-3 mb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-xs font-semibold text-accent">{coupon.code}</span>
                          <span className="text-xs text-[color:var(--text-muted)] ml-2">{new Date(coupon.redeemedAt).toLocaleDateString()}</span>
                        </div>
                        <span className="text-sm font-semibold text-success">
                          {coupon.type === "PERCENTAGE" ? `${coupon.discount}%` : `$${coupon.discount}`}
                        </span>
                      </div>
                      <div className="text-xs text-[color:var(--text-muted)] mt-1">Order: {coupon.orderId}</div>
                    </div>
                  ))
                )}
              </div>

              {/* Offers */}
              <div>
                <SectionTitle>Offers</SectionTitle>
                {customer.offers.length === 0 ? (
                  <div className="text-center py-6 text-[color:var(--text-muted)] text-sm">No offers submitted.</div>
                ) : (
                  customer.offers.map(offer => (
                    <div key={offer.id} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg p-3 mb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-foreground">{offer.trackName}</div>
                          <div className="text-xs text-[color:var(--text-muted)]">{new Date(offer.date).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-accent">{formatCurrency(offer.amount)}</div>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold
                            ${offer.type === "ACCEPTED" ? "bg-success/10 text-success" :
                              offer.type === "SUBMITTED" ? "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]" :
                                "bg-danger/10 text-danger"}`}>
                            {offer.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {tab === "analytics" && (
            <div className="flex flex-col gap-4">
              {/* KPI cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                  <div className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)]">Lifetime Value</div>
                  <div className="text-lg font-bold text-accent mt-1">{formatCurrency(customer.analytics.customerLifetimeValue)}</div>
                </div>
                <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                  <div className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)]">Avg. Order Value</div>
                  <div className="text-lg font-bold text-foreground mt-1">{formatCurrency(customer.analytics.averageOrderValue)}</div>
                </div>
                <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                  <div className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)]">Purchase Frequency</div>
                  <div className="text-lg font-bold text-foreground mt-1">Every {Math.round(customer.analytics.purchaseFrequency)} days</div>
                </div>
                <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                  <div className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)]">Total Spent</div>
                  <div className="text-lg font-bold text-success mt-1">{formatCurrency(customer.analytics.lifetimeSpending)}</div>
                </div>
              </div>

              {/* Favorite Genres */}
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <SectionTitle>Favorite Genres</SectionTitle>
                <div className="flex flex-wrap gap-1.5">
                  {customer.analytics.favoriteGenres.map(g => (
                    <span key={g.genre} className="px-2.5 py-1 rounded-full text-xs font-medium bg-elevated text-[color:var(--text-secondary)] border border-[color:var(--border-subtle)]">
                      {g.genre} <span className="text-[color:var(--text-muted)]">({g.count})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Favorite Artists */}
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <SectionTitle>Favorite Artists</SectionTitle>
                <div className="flex flex-wrap gap-1.5">
                  {customer.analytics.favoriteArtists.map(a => (
                    <span key={a.artist} className="px-2.5 py-1 rounded-full text-xs font-medium bg-elevated text-[color:var(--text-secondary)] border border-[color:var(--border-subtle)]">
                      {a.artist} <span className="text-[color:var(--text-muted)]">({a.count})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Orders over time chart (simplified) */}
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <SectionTitle>Orders Over Time</SectionTitle>
                <div className="flex items-end gap-2 h-24">
                  {customer.analytics.ordersOverTime.map((point, i) => {
                    const max = Math.max(...customer.analytics.ordersOverTime.map(p => p.count), 1);
                    const height = (point.count / max) * 80;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-sm bg-accent/60" style={{ height: Math.max(height, 4) }} />
                        <span className="text-[8px] text-[color:var(--text-muted)]">{new Date(point.date).toLocaleDateString("en-US", { month: "short" })}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ACTIVITY TAB */}
          {tab === "activity" && (
            <div className="flex flex-col gap-3">
              {customer.activities.length === 0 ? (
                <div className="text-center py-10 text-[color:var(--text-muted)]">
                  <Activity size={24} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No activity recorded.</p>
                </div>
              ) : (
                customer.activities.map((activity, i) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                        ${activity.type === "REGISTRATION" ? "bg-accent/10 text-accent" :
                          activity.type === "PURCHASE" ? "bg-success/10 text-success" :
                            activity.type === "DOWNLOAD" ? "bg-accent-cyan/10 text-accent-cyan" :
                              activity.type === "COUPON" ? "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]" :
                                "bg-muted/10 text-muted"}`}>
                        {activity.type === "REGISTRATION" && <User size={13} />}
                        {activity.type === "PURCHASE" && <ShoppingBag size={13} />}
                        {activity.type === "DOWNLOAD" && <Download size={13} />}
                        {activity.type === "COUPON" && <Tag size={13} />}
                        {activity.type === "OFFER" && <Zap size={13} />}
                        {activity.type === "REFUND" && <RefreshCw size={13} />}
                        {activity.type === "PROFILE_UPDATE" && <Pencil size={13} />}
                        {activity.type === "NOTE" && <FileText size={13} />}
                      </div>
                      {i < customer.activities.length - 1 && (
                        <div className="w-px flex-1 min-h-[12px] bg-[color:var(--border-subtle)]" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="text-sm text-[color:var(--text-secondary)]">{activity.description}</div>
                      <div className="text-[10px] text-[color:var(--text-muted)] mt-0.5">
                        {new Date(activity.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </aside>
    </>
  );
}
