// components/orders/OrdersTable.tsx
"use client";

import { Eye, CheckCircle, RotateCcw, FileText, Trash2, ShoppingBag } from "lucide-react";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";
import type { Order, PaymentStatus } from "@/services/orders/types";

interface Props {
  orders: Order[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onRowClick: (order: Order) => void;
  onMarkPaid: (order: Order) => void;
  onRefund: (order: Order) => void;
  onDelete: (order: Order) => void;
  isLoading?: boolean;
}

const STATUS_VARIANT: Record<PaymentStatus, "success" | "warning" | "danger" | "muted"> = {
  PAID: "success",
  PENDING: "warning",
  FAILED: "danger",
  REFUNDED: "muted",
};

const METHOD_LABEL: Record<string, string> = {
  stripe: "Stripe",
  paypal: "PayPal",
  manual: "Manual",
};

function SkeletonRow() {
  return (
    <DataTable.Row>
      <DataTable.CheckboxCell checked={false} onChange={() => { }} />
      {[80, 140, 30, 60, 70, 100, 70, 80].map((w, i) => (
        <DataTable.Cell key={i}>
          <div className="h-3.5 bg-elevated rounded animate-pulse" style={{ width: w }} />
        </DataTable.Cell>
      ))}
      <DataTable.Cell />
    </DataTable.Row>
  );
}

export default function OrdersTable({
  orders, selectedIds, onToggleSelect, onToggleSelectAll,
  onRowClick, onMarkPaid, onRefund, onDelete, isLoading,
}: Props) {
  const { hoveredId, setHoveredId } = useHoveredRow();
  const allSelected = orders.length > 0 && selectedIds.size === orders.length;

  return (
    <DataTable
      minWidth={900}
      isEmpty={!isLoading && orders.length === 0}
      emptyState={
        <DataTable.EmptyState
          icon={<ShoppingBag size={22} className="text-accent" />}
          title="No orders found"
          message="Orders will appear here when customers purchase tracks."
        />
      }
    >
      <DataTable.Header>
        <DataTable.CheckboxCol checked={allSelected} onChange={onToggleSelectAll} />
        <DataTable.Col>Order</DataTable.Col>
        <DataTable.Col>Customer</DataTable.Col>
        <DataTable.Col align="center">Items</DataTable.Col>
        <DataTable.Col align="right">Total</DataTable.Col>
        <DataTable.Col>Status</DataTable.Col>
        <DataTable.Col>License(s)</DataTable.Col>
        <DataTable.Col>Method</DataTable.Col>
        <DataTable.Col>Date</DataTable.Col>
        <DataTable.ActionsCol />
      </DataTable.Header>

      <DataTable.Body>
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
          : orders.map(order => {
            const isSelected = selectedIds.has(order.id);
            const isHovered = hoveredId === order.id;
            const uniqueLicenses = [...new Set(order.items.map(i => i.licenseType))];

            return (
              <DataTable.Row
                key={order.id}
                onClick={() => onRowClick(order)}
                selected={isSelected}
                isHovered={isHovered}
                onHoverChange={h => setHoveredId(h ? order.id : null)}
              >
                <DataTable.CheckboxCell
                  checked={isSelected}
                  onChange={() => onToggleSelect(order.id)}
                />

                {/* Order ID */}
                <DataTable.Cell className="font-mono text-xs font-bold text-accent tracking-[0.02em] whitespace-nowrap">
                  {order.id}
                </DataTable.Cell>

                {/* Customer */}
                <DataTable.Cell>
                  <div className="font-semibold text-foreground text-sm">{order.customerName}</div>
                  <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{order.customerEmail}</div>
                </DataTable.Cell>

                {/* Items count */}
                <DataTable.Cell align="center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/15 text-accent text-[11px] font-bold">
                    {order.items.length}
                  </span>
                </DataTable.Cell>

                {/* Total */}
                <DataTable.Cell align="right" className="font-bold text-success">
                  ${order.totalAmount.toFixed(2)}
                </DataTable.Cell>

                {/* Status */}
                <DataTable.Cell>
                  <DataTable.StatusBadge
                    label={order.paymentStatus.charAt(0) + order.paymentStatus.slice(1).toLowerCase()}
                    variant={STATUS_VARIANT[order.paymentStatus] ?? "muted"}
                  />
                </DataTable.Cell>

                {/* Licenses */}
                <DataTable.Cell>
                  <div className="flex gap-1 flex-wrap">
                    {uniqueLicenses.map(l => (
                      <span
                        key={l}
                        className="px-1.5 py-0.5 rounded-[5px] bg-accent-cyan/10 text-accent-cyan text-[10px] font-bold"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </DataTable.Cell>

                {/* Method */}
                <DataTable.Cell>
                  {METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod}
                </DataTable.Cell>

                {/* Date */}
                <DataTable.Cell className="whitespace-nowrap text-xs">
                  <div>
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </div>
                  <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">
                    {new Date(order.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </div>
                </DataTable.Cell>

                {/* Actions */}
                <DataTable.ActionsCell visible={isHovered || isSelected}>
                  <DataTable.ActionBtn
                    onClick={() => onRowClick(order)}
                    icon={<Eye size={13} />}
                    title="View order"
                  />
                  {order.paymentStatus === "PENDING" && (
                    <DataTable.ActionBtn
                      onClick={() => onMarkPaid(order)}
                      icon={<CheckCircle size={13} />}
                      title="Mark as paid"
                    />
                  )}
                  {order.paymentStatus === "PAID" && (
                    <DataTable.ActionBtn
                      onClick={() => onRefund(order)}
                      icon={<RotateCcw size={13} />}
                      title="Refund"
                    />
                  )}
                  <DataTable.ActionBtn
                    onClick={() => { }}
                    icon={<FileText size={13} />}
                    title="Download invoice"
                  />
                  <DataTable.ActionBtn
                    onClick={() => onDelete(order)}
                    icon={<Trash2 size={13} />}
                    title="Delete"
                    danger
                  />
                </DataTable.ActionsCell>
              </DataTable.Row>
            );
          })
        }
      </DataTable.Body>
    </DataTable>
  );
}
