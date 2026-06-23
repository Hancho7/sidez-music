// app/(dashboard)/store/customers/page.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import CustomersHeader from "@/components/customers/CustomersHeader";
import CustomersToolbar from "@/components/customers/CustomersToolbar";
import CustomersTable from "@/components/customers/CustomersTable";
import CustomerDrawer from "@/components/customers/CustomerDrawer";
import CustomerFormModal from "@/components/customers/CustomerFormModal";
import { MOCK_CUSTOMER_DETAILS, getMockCustomers } from "@/services/customers/mock-data";
import type { Customer, CustomerFilters, CustomerFormData } from "@/services/customers/types";

const DEFAULT_FILTERS: CustomerFilters = {
  search: "",
  status: "all",
  isVip: false,
  isVerified: false,
  highValue: false,
  newCustomers: false,
  sort: "joined",
  view: "table",
};

export default function CustomersPage() {
  const [filters, setFilters] = useState<CustomerFilters>(DEFAULT_FILTERS);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(
    () => getMockCustomers(filters),
    [filters]
  );

  const selectedCustomerDetail = useMemo(() => {
    if (!selectedCustomerId) return null;
    return MOCK_CUSTOMER_DETAILS[selectedCustomerId] ?? null;
  }, [selectedCustomerId]);

  const handleSelect = useCallback((customer: Customer) => {
    setSelectedCustomerId(customer.id);
  }, []);

  const openCreate = () => {
    setEditingCustomer(null);
    setModalOpen(true);
  };

  const openEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setSelectedCustomerId(null);
    setModalOpen(true);
  };

  const handleSave = async (_data: CustomerFormData, _id?: string) => {
    await new Promise(r => setTimeout(r, 500));
    // In production: call API, then refresh list
  };

  const handleArchive = useCallback((customer: Customer) => {
    if (selectedCustomerId === customer.id) {
      setSelectedCustomerId(null);
    }
    // In production: call API
  }, [selectedCustomerId]);

  const handleExport = useCallback(() => {
    alert(`Exporting ${filteredCustomers.length} customers to CSV...`);
  }, [filteredCustomers.length]);

  return (
    <div className="flex flex-col gap-6">
      <CustomersHeader
        total={filteredCustomers.length}
        onExport={handleExport}
        onCreate={openCreate}
      />

      <CustomersToolbar
        filters={filters}
        onChange={patch => setFilters(prev => ({ ...prev, ...patch }))}
        total={filteredCustomers.length}
      />

      <CustomersTable
        customers={filteredCustomers}
        loading={false}
        onRowClick={handleSelect}
        onEdit={openEdit}
        onArchive={handleArchive}
      />

      <CustomerDrawer
        customer={selectedCustomerDetail}
        onClose={() => setSelectedCustomerId(null)}
        onEdit={openEdit}
      />

      <CustomerFormModal
        open={modalOpen}
        customer={editingCustomer}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
