// app/(dashboard)/store/orders/page.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import OrdersHeader from "@/components/orders/OrdersHeader";
import OrdersFilters from "@/components/orders/OrdersFilters";
import OrdersTable from "@/components/orders/OrdersTable";
import OrderDrawer from "@/components/orders/OrderDrawer";
import RefundModal from "@/components/orders/RefundModal";
import { MOCK_ORDERS } from "@/services/orders/mock-data";
import type { Order, OrderFilters, RefundFormData } from "@/services/orders/types";

// ── Helpers ──────────────────────────────────────────────────────────

function applyFilters(orders: Order[], filters: OrderFilters): Order[] {
  let result = orders.filter(o => !o.deletedAt);

  // Search
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      o =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
    );
  }

  // Status
  if (filters.status !== "all") {
    result = result.filter(o => o.paymentStatus === filters.status);
  }

  // License type — match if any item in the order has this license
  if (filters.licenseType !== "all") {
    result = result.filter(o => o.items.some(i => i.licenseType === filters.licenseType));
  }

  // Date range
  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom).getTime();
    result = result.filter(o => new Date(o.createdAt).getTime() >= from);
  }
  if (filters.dateTo) {
    const to = new Date(filters.dateTo).getTime() + 24 * 60 * 60 * 1000 - 1;
    result = result.filter(o => new Date(o.createdAt).getTime() <= to);
  }

  // Sort
  switch (filters.sort) {
    case "oldest":
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case "highest":
      result.sort((a, b) => b.totalAmount - a.totalAmount);
      break;
    case "lowest":
      result.sort((a, b) => a.totalAmount - b.totalAmount);
      break;
    case "newest":
    default:
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return result;
}

const DEFAULT_FILTERS: OrderFilters = {
  search: "",
  status: "all",
  licenseType: "all",
  dateFrom: "",
  dateTo: "",
  sort: "newest",
};

// ── Page ─────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [filters, setFilters] = useState<OrderFilters>(DEFAULT_FILTERS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [drawerOrder, setDrawerOrder] = useState<Order | null>(null);
  const [refundTarget, setRefundTarget] = useState<Order | null>(null);

  // Derived
  const filteredOrders = useMemo(() => applyFilters(orders, filters), [orders, filters]);

  // ── Selection handlers ──

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds(prev =>
      prev.size === filteredOrders.length ? new Set() : new Set(filteredOrders.map(o => o.id))
    );
  }, [filteredOrders]);

  // ── Action handlers ──

  const handleRowClick = useCallback((order: Order) => {
    setDrawerOrder(order);
  }, []);

  const handleMarkPaid = useCallback((order: Order) => {
    const now = new Date().toISOString();
    setOrders(prev => prev.map(o => o.id === order.id
      ? {
        ...o,
        paymentStatus: "PAID",
        payment: {
          ...o.payment,
          status: "PAID",
          paidAt: now,
          timeline: [...o.payment.timeline, { status: "PAID", timestamp: now, note: "Manually marked as paid by admin" }],
        },
      }
      : o
    ));
    setDrawerOrder(prev => prev && prev.id === order.id
      ? { ...prev, paymentStatus: "PAID", payment: { ...prev.payment, status: "PAID", paidAt: now } }
      : prev
    );
  }, []);

  const openRefund = useCallback((order: Order) => {
    setRefundTarget(order);
  }, []);

  const handleConfirmRefund = useCallback(async (orderId: string, data: RefundFormData) => {
    await new Promise(r => setTimeout(r, 600));

    const amount = parseFloat(data.amount);
    const now = new Date().toISOString();

    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const alreadyRefunded = o.refunds.reduce((sum, r) => sum + r.amount, 0);
      const isFullRefund = alreadyRefunded + amount >= o.totalAmount - 0.005;
      const newRefund = {
        id: `ref_${Date.now()}`,
        orderId,
        amount,
        reason: data.reason,
        status: "COMPLETED" as const,
        createdAt: now,
      };
      const nextStatus = isFullRefund ? "REFUNDED" as const : o.paymentStatus;
      return {
        ...o,
        paymentStatus: nextStatus,
        refunds: [...o.refunds, newRefund],
        payment: {
          ...o.payment,
          status: nextStatus,
          timeline: isFullRefund
            ? [...o.payment.timeline, { status: "REFUNDED" as const, timestamp: now, note: data.reason }]
            : o.payment.timeline,
        },
      };
    }));

    setDrawerOrder(prev => {
      if (!prev || prev.id !== orderId) return prev;
      const alreadyRefunded = prev.refunds.reduce((sum, r) => sum + r.amount, 0);
      const isFullRefund = alreadyRefunded + amount >= prev.totalAmount - 0.005;
      const newRefund = { id: `ref_${Date.now()}`, orderId, amount, reason: data.reason, status: "COMPLETED" as const, createdAt: now };
      return {
        ...prev,
        paymentStatus: isFullRefund ? "REFUNDED" : prev.paymentStatus,
        refunds: [...prev.refunds, newRefund],
      };
    });
  }, []);

  const handleDelete = useCallback((order: Order) => {
    if (!window.confirm(`Delete order ${order.id}? This is a soft delete and can be reversed by support.`)) return;
    const now = new Date().toISOString();
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, deletedAt: now } : o));
    setSelectedIds(prev => { const next = new Set(prev); next.delete(order.id); return next; });
    if (drawerOrder?.id === order.id) setDrawerOrder(null);
  }, [drawerOrder]);

  const handleBulkDelete = useCallback(() => {
    if (!window.confirm(`Delete ${selectedIds.size} order(s)? This is a soft delete and can be reversed by support.`)) return;
    const now = new Date().toISOString();
    setOrders(prev => prev.map(o => selectedIds.has(o.id) ? { ...o, deletedAt: now } : o));
    setSelectedIds(new Set());
  }, [selectedIds]);

  const handleExport = useCallback(() => {
    window.alert(`Exporting ${filteredOrders.length} order(s) to CSV…`);
  }, [filteredOrders]);

  const handleBulkExport = useCallback(() => {
    window.alert(`Exporting ${selectedIds.size} selected order(s) to CSV…`);
  }, [selectedIds]);

  const handleRefundRules = useCallback(() => {
    window.alert("Refund rules configuration is managed under Settings.");
  }, []);

  // ── Render ──

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <OrdersHeader
        onExport={handleExport}
        onRefundRules={handleRefundRules}
        selectedCount={selectedIds.size}
        onBulkExport={handleBulkExport}
        onBulkDelete={handleBulkDelete}
      />

      {/* Filters toolbar */}
      <OrdersFilters
        filters={filters}
        onChange={patch => setFilters(prev => ({ ...prev, ...patch }))}
        total={filteredOrders.length}
      />

      {/* Table */}
      <OrdersTable
        orders={filteredOrders}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        onRowClick={handleRowClick}
        onMarkPaid={handleMarkPaid}
        onRefund={openRefund}
        onDelete={handleDelete}
      />

      {/* Detail drawer */}
      <OrderDrawer
        order={drawerOrder}
        onClose={() => setDrawerOrder(null)}
        onMarkPaid={handleMarkPaid}
        onRefund={openRefund}
      />

      {/* Refund modal */}
      <RefundModal
        order={refundTarget}
        onClose={() => setRefundTarget(null)}
        onConfirm={handleConfirmRefund}
      />

    </div>
  );
}
