"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, Trash2, Printer, Share2, CheckCircle2, MessageSquare, Download, DollarSign, Clock, AlertCircle } from "lucide-react";
import { API_URL } from "@/lib/api";

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

interface Invoice {
  id: string;
  business_id: string;
  invoice_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  items: LineItem[];
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  tax_percent: number;
  tax_amount: number;
  total_amount: number;
  notes: string;
  status: string;
  created_at: string;
  whatsapp_url?: string;
}

export default function InvoicesDashboard() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Active Invoice preview
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

  // Invoice creation form state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [custName, setCustName] = useState<string>("");
  const [custPhone, setCustPhone] = useState<string>("");
  const [custEmail, setCustEmail] = useState<string>("");
  const [custAddress, setCustAddress] = useState<string>("");
  const [taxPct, setTaxPct] = useState<number>(5);
  const [discPct, setDiscPct] = useState<number>(0);
  const [notes, setNotes] = useState<string>("Thank you for doing business with us!");
  const [statusVal, setStatusVal] = useState<string>("Pending");

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "Specialty Service / Product Item", quantity: 1, unit_price: 50.0 },
  ]);

  useEffect(() => {
    fetch(`${API_URL}/business`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setBusinesses(data);
        if (data.length > 0) {
          setSelectedId(data[0].id);
          setSelectedBusiness(data[0]);
          fetchInvoices(data[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchInvoices = (bId: string) => {
    if (!bId) return;
    fetch(`${API_URL}/invoices/${bId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setInvoices(data);
        if (data.length > 0) {
          setActiveInvoice(data[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, unit_price: 0.0 }]);
  };

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof LineItem, val: any) => {
    const updated = [...lineItems];
    (updated[index] as any)[field] = val;
    setLineItems(updated);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone || !selectedId) return;

    try {
      const res = await fetch(`${API_URL}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: selectedId,
          customer_name: custName,
          customer_phone: custPhone,
          customer_email: custEmail,
          customer_address: custAddress,
          items: lineItems,
          tax_percent: taxPct,
          discount_percent: discPct,
          notes,
          status: statusVal,
        }),
      });
      const data = await res.json();
      setActiveInvoice(data);
      setShowCreateModal(false);
      fetchInvoices(selectedId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (invId: string, newStatus: string) => {
    try {
      await fetch(`${API_URL}/invoices/${invId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchInvoices(selectedId);
      if (activeInvoice && activeInvoice.id === invId) {
        setActiveInvoice({ ...activeInvoice, status: newStatus });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm font-mono text-[#6a6a6a]">
        Loading Enterprise Invoice Engine...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#faf5e8] p-6 rounded-2xl border border-[#e5e5e5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#0a0a0a] mb-1">
            <FileText className="w-6 h-6 text-amber-700" />
            <h1 className="text-2xl font-serif font-bold tracking-tight">Enterprise Invoice Generation Engine</h1>
          </div>
          <p className="text-xs text-[#6a6a6a]">
            Create itemized GST/tax invoices, print/export PDF billing cards, and send 1-click WhatsApp customer receipts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" /> Generate New Invoice
          </button>

          {businesses.length > 0 && (
            <select
              value={selectedId}
              onChange={(e) => {
                const b = businesses.find((x) => x.id === e.target.value);
                setSelectedId(e.target.value);
                setSelectedBusiness(b);
                fetchInvoices(e.target.value);
              }}
              className="bg-[#fffaf0] border border-[#e5e5e5] rounded-xl px-3 py-2 text-xs font-semibold text-[#0a0a0a] focus:outline-none"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Invoice History & Filters */}
        <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a]">
              Generated Invoices ({invoices.length})
            </h2>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              Auto-Numbered
            </span>
          </div>

          {invoices.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6a6a6a] space-y-2">
              <FileText className="w-8 h-8 text-[#6a6a6a] mx-auto opacity-50" />
              <p>No invoices created yet. Click "+ Generate New Invoice" to issue your first customer invoice.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {invoices.map((inv) => {
                const isSelected = activeInvoice?.id === inv.id;
                return (
                  <div
                    key={inv.id}
                    onClick={() => setActiveInvoice(inv)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#faf5e8] border-[#0a0a0a] ring-1 ring-[#0a0a0a]"
                        : "bg-[#fffaf0] border-[#e5e5e5] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#0a0a0a]">
                        {inv.invoice_number}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          inv.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : inv.status === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="font-medium text-[#3a3a3a] truncate max-w-[140px]">
                        {inv.customer_name}
                      </span>
                      <span className="font-mono font-bold text-[#0a0a0a]">
                        ${inv.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 2 Columns: Printable / Exportable Clay Invoice Card */}
        <div className="lg:col-span-2 space-y-4">
          
          {activeInvoice ? (
            <div className="bg-white rounded-2xl border border-[#e5e5e5] shadow-xs p-8 space-y-6 print:shadow-none print:border-none">
              
              {/* Top Action Bar (Hidden on Print) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#e5e5e5] print:hidden">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#6a6a6a]">Status:</span>
                  <select
                    value={activeInvoice.status}
                    onChange={(e) => handleStatusChange(activeInvoice.id, e.target.value)}
                    className="bg-[#fffaf0] border border-[#e5e5e5] rounded-lg px-2.5 py-1 text-xs font-bold text-[#0a0a0a]"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#faf5e8] hover:bg-[#e5e5e5] text-[#0a0a0a] rounded-xl text-xs font-bold transition-all border border-[#e5e5e5]"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                  </button>

                  {activeInvoice.customer_phone && (
                    <a
                      href={`https://wa.me/${activeInvoice.customer_phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                        `Hi ${activeInvoice.customer_name}, here is your invoice ${activeInvoice.invoice_number} from ${selectedBusiness?.name || "us"}. Total: $${activeInvoice.total_amount.toFixed(2)} (${activeInvoice.status}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Send on WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {/* PRINTABLE INVOICE CARD */}
              <div className="space-y-8 bg-[#fffaf0] p-8 rounded-2xl border border-[#e5e5e5]">
                
                {/* Invoice Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e5e5] pb-6">
                  <div>
                    {selectedBusiness?.logo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={selectedBusiness.logo} alt="Logo" className="h-10 object-contain mb-2" />
                    ) : (
                      <h2 className="text-2xl font-serif font-bold text-[#0a0a0a]">
                        {selectedBusiness?.name || "Business Name"}
                      </h2>
                    )}
                    <p className="text-xs text-[#6a6a6a]">{selectedBusiness?.address || "Registered Business Address"}</p>
                    <p className="text-xs text-[#6a6a6a]">Contact: {selectedBusiness?.phone || selectedBusiness?.whatsapp || "N/A"}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs font-mono font-bold text-amber-800 uppercase tracking-widest block mb-1">
                      TAX INVOICE
                    </span>
                    <h3 className="text-lg font-mono font-bold text-[#0a0a0a]">
                      {activeInvoice.invoice_number}
                    </h3>
                    <p className="text-xs text-[#6a6a6a] font-mono mt-1">
                      Date: {new Date(activeInvoice.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Bill To */}
                <div className="bg-white p-4 rounded-xl border border-[#e5e5e5] space-y-1 text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6a6a6a] block">
                    BILL TO:
                  </span>
                  <p className="font-bold text-sm text-[#0a0a0a]">{activeInvoice.customer_name}</p>
                  <p className="text-[#6a6a6a]">Phone: {activeInvoice.customer_phone}</p>
                  {activeInvoice.customer_email && <p className="text-[#6a6a6a]">Email: {activeInvoice.customer_email}</p>}
                  {activeInvoice.customer_address && <p className="text-[#6a6a6a]">Address: {activeInvoice.customer_address}</p>}
                </div>

                {/* Line Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#e5e5e5] text-[11px] font-bold text-[#6a6a6a] uppercase">
                        <th className="py-2.5 px-3">Item Description</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Unit Price</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e5e5]">
                      {activeInvoice.items.map((item, idx) => (
                        <tr key={idx} className="bg-white">
                          <td className="py-3 px-3 font-medium text-[#0a0a0a]">{item.description}</td>
                          <td className="py-3 px-3 text-center font-mono">{item.quantity}</td>
                          <td className="py-3 px-3 text-right font-mono">${item.unit_price.toFixed(2)}</td>
                          <td className="py-3 px-3 text-right font-mono font-bold">${(item.quantity * item.unit_price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Invoice Totals */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-t border-[#e5e5e5] pt-4">
                  <div className="text-xs text-[#6a6a6a] space-y-1 max-w-xs">
                    <span className="font-bold text-[#0a0a0a] block">Notes / Terms:</span>
                    <p>{activeInvoice.notes}</p>
                  </div>

                  <div className="w-full sm:w-64 space-y-1.5 text-xs bg-white p-4 rounded-xl border border-[#e5e5e5]">
                    <div className="flex justify-between text-[#6a6a6a]">
                      <span>Subtotal:</span>
                      <span className="font-mono">${activeInvoice.subtotal.toFixed(2)}</span>
                    </div>

                    {activeInvoice.discount_amount > 0 && (
                      <div className="flex justify-between text-green-700">
                        <span>Discount ({activeInvoice.discount_percent}%):</span>
                        <span className="font-mono">-${activeInvoice.discount_amount.toFixed(2)}</span>
                      </div>
                    )}

                    {activeInvoice.tax_amount > 0 && (
                      <div className="flex justify-between text-[#6a6a6a]">
                        <span>Tax / GST ({activeInvoice.tax_percent}%):</span>
                        <span className="font-mono">+${activeInvoice.tax_amount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm font-bold text-[#0a0a0a] border-t pt-2">
                      <span>Total Amount:</span>
                      <span className="font-mono text-base">${activeInvoice.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#e5e5e5] p-12 text-center text-xs text-[#6a6a6a]">
              Select an invoice on the left to preview, print, or dispatch.
            </div>
          )}

        </div>

      </div>

      {/* Invoice Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-2xl w-full border border-[#e5e5e5] space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-[#0a0a0a]">Generate Itemized Customer Invoice</h2>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Customer Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 9876543210"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Line Items Table Builder */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#3a3a3a] uppercase tracking-wider">
                    Line Items
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="text-[11px] font-bold text-[#0a0a0a] bg-[#faf5e8] px-2.5 py-1 rounded-lg hover:bg-[#e5e5e5]"
                  >
                    + Add Item
                  </button>
                </div>

                {lineItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(idx, "description", e.target.value)}
                      className="flex-2 bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2 text-xs font-medium"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(idx, "quantity", parseInt(e.target.value) || 1)}
                      className="w-16 bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2 text-xs font-medium text-center"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => handleUpdateItem(idx, "unit_price", parseFloat(e.target.value) || 0)}
                      className="w-24 bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2 text-xs font-medium text-right"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveLineItem(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Tax / GST %</label>
                  <input
                    type="number"
                    value={taxPct}
                    onChange={(e) => setTaxPct(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Discount %</label>
                  <input
                    type="number"
                    value={discPct}
                    onChange={(e) => setDiscPct(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Initial Status</label>
                  <select
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value)}
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#0a0a0a] rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white rounded-xl text-xs font-bold"
                >
                  Generate Invoice Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
