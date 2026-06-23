// components/customers/CustomersTable.tsx
"use client";

import { Eye, Pencil, Archive, User, Award, BadgeCheck } from "lucide-react";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";
import type { Customer, CustomerStatus } from "@/services/customers/types";

interface Props {
  customers: Customer[];
  loading?: boolean;
  onRowClick: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onArchive: (customer: Customer) => void;
}

const STATUS_VARIANT: Record<CustomerStatus, "success" | "warning" | "muted" | "danger"> = {
  ACTIVE: "success",
  INACTIVE: "muted",
  SUSPENDED: "danger",
  ARCHIVED: "muted",
};

const STATUS_LABEL: Record<CustomerStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPENDED: "Suspended",
  ARCHIVED: "Archived",
};

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function SkeletonRow() {
  return (
    <DataTable.Row>
      {[44, 200, 180, 80, 90, 80].map((w, i) => (
        <DataTable.Cell key={i}>
          <div className="h-3.5 bg-elevated rounded animate-pulse" style={{ width: w }} />
        </DataTable.Cell>
      ))}
      <DataTable.Cell />
    </DataTable.Row>
  );
}

export default function CustomersTable({ customers, loading, onRowClick, onEdit, onArchive }: Props) {
  const { hoveredId, setHoveredId } = useHoveredRow();

  return (
    <DataTable
      isEmpty={!loading && customers.length === 0}
      emptyState={
        <DataTable.EmptyState
          icon={<User size={22} className="text-accent" />}
          title="No customers found"
          message="Adjust your filters or create a new customer."
        />
      }
    >
      <DataTable.Header>
        <DataTable.Col>Customer</DataTable.Col>
        <DataTable.Col>Email</DataTable.Col>
        <DataTable.Col align="center">Orders</DataTable.Col>
        <DataTable.Col align="right">Total Spent</DataTable.Col>
        <DataTable.Col>Status</DataTable.Col>
        <DataTable.Col>Joined</DataTable.Col>
        <DataTable.ActionsCol />
      </DataTable.Header>

      <DataTable.Body>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
          : customers.map(customer => {
            const isHovered = hoveredId === customer.id;

            return (
              <DataTable.Row
                key={customer.id}
                onClick={() => onRowClick(customer)}
                isHovered={isHovered}
                onHoverChange={h => setHoveredId(h ? customer.id : null)}
              >
                {/* Customer — avatar + name + badges */}
                <DataTable.Cell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-elevated flex items-center justify-center flex-shrink-0 border border-[color:var(--border-subtle)]">
                      {customer.avatar
                        ? <img src={customer.avatar} alt={`${customer.firstName} ${customer.lastName}`} className="w-full h-full object-cover" />
                        : <span className="text-[11px] font-bold text-[color:var(--text-muted)]">{getInitials(customer.firstName, customer.lastName)}</span>
                      }
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-foreground truncate">
                          {customer.firstName} {customer.lastName}
                        </span>
                        {customer.isVip && (
                          <Award size={11} className="text-[color:var(--color-warning)] shrink-0" />
                        )}
                        {customer.isVerified && (
                          <BadgeCheck size={11} className="text-accent-cyan shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-[color:var(--text-muted)] truncate">
                        @{customer.username} · {customer.country}
                      </p>
                    </div>
                  </div>
                </DataTable.Cell>

                {/* Email */}
                <DataTable.Cell className="text-sm text-[color:var(--text-secondary)] truncate max-w-[220px]">
                  {customer.email}
                </DataTable.Cell>

                {/* Orders */}
                <DataTable.Cell align="center" className="text-sm font-semibold text-foreground">
                  {customer.totalOrders}
                </DataTable.Cell>

                {/* Spent */}
                <DataTable.Cell align="right" className="text-sm font-semibold text-success">
                  ${customer.totalSpent.toFixed(0)}
                </DataTable.Cell>

                {/* Status */}
                <DataTable.Cell>
                  <DataTable.StatusBadge
                    label={STATUS_LABEL[customer.status]}
                    variant={STATUS_VARIANT[customer.status]}
                  />
                </DataTable.Cell>

                {/* Joined */}
                <DataTable.Cell className="text-xs text-[color:var(--text-muted)] whitespace-nowrap">
                  {new Date(customer.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </DataTable.Cell>

                {/* Actions */}
                <DataTable.ActionsCell visible={isHovered}>
                  <DataTable.ActionBtn onClick={() => onRowClick(customer)} icon={<Eye size={13} />} title="View" />
                  <DataTable.ActionBtn onClick={() => onEdit(customer)} icon={<Pencil size={13} />} title="Edit" />
                  <DataTable.ActionBtn onClick={() => onArchive(customer)} icon={<Archive size={13} />} title="Archive" danger />
                </DataTable.ActionsCell>
              </DataTable.Row>
            );
          })
        }
      </DataTable.Body>
    </DataTable>
  );
}
