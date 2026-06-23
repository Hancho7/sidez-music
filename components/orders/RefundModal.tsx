// components/orders/RefundModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, RotateCcw, AlertTriangle } from "lucide-react";
import type { Order, RefundFormData } from "@/services/orders/types";

interface Props {
  order: Order | null;
  onClose: () => void;
  onConfirm: (orderId: string, data: RefundFormData) => Promise<void>;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">
      {children}
    </label>
  );
}

function refundableAmount(order: Order): number {
  const alreadyRefunded = order.refunds.reduce((sum, r) => sum + r.amount, 0);
  return Math.max(order.totalAmount - alreadyRefunded, 0);
}

export default function RefundModal({ order, onClose, onConfirm }: Props) {
  const [form, setForm] = useState<RefundFormData>({ type: "full", amount: "", reason: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (order) {
      setForm({ type: "full", amount: refundableAmount(order).toFixed(2), reason: "" });
      setError(null);
    }
  }, [order?.id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!order) return null;

  const maxRefundable = refundableAmount(order);
  const set = (key: keyof RefundFormData, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const selectType = (type: RefundFormData["type"]) => {
    setForm(prev => ({
      ...prev,
      type,
      amount: type === "full" ? maxRefundable.toFixed(2) : prev.amount === maxRefundable.toFixed(2) ? "" : prev.amount,
    }));
  };

  const handleSubmit = async () => {
    const amountNum = parseFloat(form.amount);
    if (!amountNum || amountNum <= 0) { setError("Enter a valid refund amount."); return; }
    if (amountNum > maxRefundable) { setError(`Amount cannot exceed $${maxRefundable.toFixed(2)} remaining.`); return; }
    if (!form.reason.trim()) { setError("A refund reason is required."); return; }

    setError(null);
    setSubmitting(true);
    try {
      await onConfirm(order.id, form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 z-[390] backdrop-blur-sm"
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(440px,92vw)] bg-surface border border-[#31386d] rounded-[20px] z-[400] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border-subtle)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-danger/12 flex items-center justify-center">
              <RotateCcw size={16} className="text-danger" />
            </div>
            <div>
              <div className="text-[16px] font-bold text-foreground">Issue Refund</div>
              <div className="text-xs text-[color:var(--text-muted)] mt-0.5">Order {order.id} · {order.customerName}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer flex items-center justify-center text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5.5 flex flex-col gap-4.5">

          <div className="flex justify-between items-center bg-input border border-[color:var(--border-subtle)] rounded-xl px-4 py-3">
            <span className="text-xs text-[color:var(--text-muted)]">Available to refund</span>
            <span className="text-[16px] font-bold text-success">${maxRefundable.toFixed(2)}</span>
          </div>

          {/* Refund type */}
          <div>
            <Label>Refund Type</Label>
            <div className="flex gap-2">
              {(["full", "partial"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => selectType(t)}
                  className={`flex-1 py-2.5 rounded-lg cursor-pointer text-sm font-semibold transition-all
                    ${form.type === t
                      ? "bg-accent/15 text-accent border border-accent/40"
                      : "bg-transparent text-[color:var(--text-muted)] border border-[color:var(--border-subtle)] hover:bg-elevated"
                    }`}
                >
                  {t === "full" ? "Full Refund" : "Partial Refund"}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <Label>Refund Amount ($)</Label>
            <input
              type="number"
              min={0}
              max={maxRefundable}
              step="0.01"
              value={form.amount}
              disabled={form.type === "full"}
              onChange={e => set("amount", e.target.value)}
              className={`w-full bg-input border rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none transition-colors focus:border-accent placeholder:text-[color:var(--text-muted)]
                ${form.type === "full" ? "opacity-60 cursor-not-allowed border-[color:var(--border-subtle)]" : "border-[color:var(--border-subtle)]"}`}
            />
          </div>

          {/* Reason */}
          <div>
            <Label>Refund Reason</Label>
            <textarea
              value={form.reason}
              onChange={e => set("reason", e.target.value)}
              placeholder="e.g. Customer request, duplicate purchase, license dispute…"
              rows={3}
              className="w-full bg-input border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none transition-colors focus:border-accent resize-y leading-relaxed placeholder:text-[color:var(--text-muted)]"
            />
          </div>

          {/* Warning */}
          <div className="flex gap-2.5 px-3.5 py-3 bg-[rgba(245,158,11,0.07)] border border-[rgba(245,158,11,0.2)] rounded-lg">
            <AlertTriangle size={14} className="text-[color:var(--color-warning)] flex-shrink-0 mt-0.5" />
            <span className="text-xs text-[color:var(--text-secondary)] leading-relaxed">
              This action notifies the customer and revokes download access for a full refund. It cannot be undone.
            </span>
          </div>

          {error && (
            <div className="text-xs text-danger font-semibold">{error}</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[color:var(--border-subtle)] flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-[#31386d] bg-transparent text-[color:var(--text-secondary)] text-sm font-semibold cursor-pointer hover:bg-elevated hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`inline-flex items-center gap-1.5 px-5.5 py-2.5 rounded-lg border-0 text-white text-sm font-semibold cursor-pointer transition-colors
              ${submitting
                ? "bg-[#b91c1c] opacity-85 cursor-not-allowed"
                : "bg-danger hover:bg-[#dc2626]"
              }`}
          >
            <RotateCcw size={13} />
            {submitting ? "Processing…" : "Issue Refund"}
          </button>
        </div>
      </div>
    </>
  );
}
