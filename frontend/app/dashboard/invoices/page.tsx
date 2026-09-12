"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  Share2,
  CheckCircle2,
  MessageSquare,
  Building2,
  User,
  CreditCard,
  QrCode,
  Calendar,
  DollarSign,
  ShieldCheck,
  Check,
} from "lucide-react";
import { API_URL } from "@/lib/api";

interface LineItem {
  description: string;
  hsn_sac?: string;
  quantity: number;
  unit_price: number;
  discount?: number;
  tax_rate?: number;
  line_total?: number;
}

interface Invoice {
  id: string;
  business_id: string;
  business_name?: string;
  business_phone?: string;
  business_address?: string;
  business_gstin?: string;
  bank_name?: string;
  bank_account_no?: string;
  bank_ifsc?: string;
  upi_id?: string;

  customer_name: string;
  customer_company?: string;
  customer_gstin?: string;
  customer_phone: string;
  customer_email?: string;
  billing_address?: string;
  shipping_address?: string;

  invoice_number: string;
  po_number?: string;
  invoice_date: string;
  due_date: string;

  items: LineItem[];
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  tax_percent: number;
  tax_amount: number;
  shipping_fee: number;
  total_amount: number;
  amount_paid: number;
  balance_due: number;

  notes?: string;
  terms?: string;
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

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Seller Details Form Overrides
  const [bizGstin, setBizGstin] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [bankAccountNo, setBankAccountNo] = useState<string>("");
  const [bankIfsc, setBankIfsc] = useState<string>("");
  const [upiId, setUpiId] = useState<string>("");

  // Customer Details Form
  const [custName, setCustName] = useState<string>("");
  const [custCompany, setCustCompany] = useState<string>("");
  const [custGstin, setCustGstin] = useState<string>("");
  const [custPhone, setCustPhone] = useState<string>("");
  const [custEmail, setCustEmail] = useState<string>("");
  const [billingAddr, setBillingAddr] = useState<string>("");
  const [shippingAddr, setShippingAddr] = useState<string>("");

  // Invoice Metadata Form
  const [invNumOverride, setInvNumOverride] = useState<string>("");
  const [poNum, setPoNum] = useState<string>("");
  const [invDate, setInvDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0]
  );

  // Financial Form
  const [taxPct, setTaxPct] = useState<number>(18);
  const [discPct, setDiscPct] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [amountPaid, setAmountPaid] = useState<number>(0);

  // Terms & Status Form
  const [notes, setNotes] = useState<string>("Thank you for choosing us!");
  const [terms, setTerms] = useState<string>(
    "Payment due within 15 days of invoice date. Please mention invoice number in reference."
  );
  const [statusVal, setStatusVal] = useState<string>("Pending");

  // Line items
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "Consulting & Implementation Service", hsn_sac: "998311", quantity: 1, unit_price: 150.0, discount: 0, tax_rate: 18 },
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
    setLineItems([
      ...lineItems,
      { description: "", hsn_sac: "", quantity: 1, unit_price: 0.0, discount: 0, tax_rate: 0 },
    ]);
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
          business_gstin: bizGstin,
          bank_name: bankName,
          bank_account_no: bankAccountNo,
          bank_ifsc: bankIfsc,
          upi_id: upiId,

          customer_name: custName,
          customer_company: custCompany,
          customer_gstin: custGstin,
          customer_phone: custPhone,
          customer_email: custEmail,
          billing_address: billingAddr,
          shipping_address: shippingAddr,

          invoice_number_override: invNumOverride,
          po_number: poNum,
          invoice_date: invDate,
          due_date: dueDate,

          items: lineItems,
          tax_percent: taxPct,
          discount_percent: discPct,
          shipping_fee: shippingFee,
          amount_paid: amountPaid,

          notes,
          terms,
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
        Loading Enterprise GST & Commercial Invoice Desk...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#faf5e8] p-6 rounded-2xl border border-[#e5e5e5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#0a0a0a] mb-1">
            <FileText className="w-6 h-6 text-amber-800" />
            <h1 className="text-2xl font-serif font-bold tracking-tight">Enterprise Tax & Commercial Invoice Desk</h1>
          </div>
          <p className="text-xs text-[#6a6a6a]">
            Generate professional GST/Tax invoices, itemized HSN/SAC breakdowns, bank payment details, and instant WhatsApp receipts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" /> Create Tax Invoice
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
        
        {/* Left Column: Invoice List & History */}
        <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a]">
              Invoice Registry ({invoices.length})
            </h2>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              GST / Tax Compliant
            </span>
          </div>

          {invoices.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6a6a6a] space-y-2">
              <FileText className="w-8 h-8 text-[#6a6a6a] mx-auto opacity-50" />
              <p>No invoices created yet. Click "+ Create Tax Invoice" to issue your first commercial invoice.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
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
                            : inv.status === "Partially Paid"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-medium text-[#3a3a3a] block truncate max-w-[130px]">
                          {inv.customer_name}
                        </span>
                        {inv.customer_company && (
                          <span className="text-[10px] text-[#6a6a6a] font-mono block">
                            {inv.customer_company}
                          </span>
                        )}
                      </div>

                      <div className="text-right font-mono">
                        <span className="font-bold text-[#0a0a0a] block">${inv.total_amount.toFixed(2)}</span>
                        {inv.balance_due > 0 && (
                          <span className="text-[10px] text-amber-700 block">Due: ${inv.balance_due.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 2 Columns: Full Enterprise Printable Invoice View */}
        <div className="lg:col-span-2 space-y-4">
          
          {activeInvoice ? (
            <div className="bg-white rounded-2xl border border-[#e5e5e5] shadow-xs p-8 space-y-6 print:shadow-none print:border-none print:p-0">
              
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
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#faf5e8] hover:bg-[#e5e5e5] text-[#0a0a0a] rounded-xl text-xs font-bold transition-all border border-[#e5e5e5]"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print / PDF Export
                  </button>

                  {activeInvoice.customer_phone && (
                    <a
                      href={`https://wa.me/${activeInvoice.customer_phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                        `Hi ${activeInvoice.customer_name}, here is your Tax Invoice ${activeInvoice.invoice_number} from ${activeInvoice.business_name || selectedBusiness?.name || "us"}. Grand Total: $${activeInvoice.total_amount.toFixed(2)}, Balance Due: $${activeInvoice.balance_due.toFixed(2)} (${activeInvoice.status}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Send on WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {/* PRINTABLE ENTERPRISE TAX INVOICE CARD */}
              <div className="space-y-6 bg-[#fffaf0] p-8 rounded-2xl border border-[#e5e5e5]">
                
                {/* Header: Seller & Invoice Titles */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[#e5e5e5] pb-6">
                  <div className="space-y-1">
                    {selectedBusiness?.logo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={selectedBusiness.logo} alt="Logo" className="h-12 object-contain mb-2" />
                    ) : (
                      <h2 className="text-2xl font-serif font-bold text-[#0a0a0a]">
                        {activeInvoice.business_name || selectedBusiness?.name || "Business Name"}
                      </h2>
                    )}
                    <p className="text-xs text-[#3a3a3a] leading-relaxed">{activeInvoice.business_address || selectedBusiness?.address || "Business Address"}</p>
                    <p className="text-xs text-[#6a6a6a]">Phone: {activeInvoice.business_phone || selectedBusiness?.phone || "N/A"}</p>
                    {activeInvoice.business_gstin && (
                      <p className="text-xs font-mono font-bold text-amber-900">GSTIN / TAX ID: {activeInvoice.business_gstin}</p>
                    )}
                  </div>

                  <div className="text-left sm:text-right space-y-1">
                    <span className="text-xs font-mono font-bold text-amber-800 uppercase tracking-widest block">
                      TAX INVOICE
                    </span>
                    <h3 className="text-xl font-mono font-bold text-[#0a0a0a]">
                      {activeInvoice.invoice_number}
                    </h3>
                    <p className="text-xs text-[#6a6a6a] font-mono">Invoice Date: {activeInvoice.invoice_date}</p>
                    <p className="text-xs text-[#6a6a6a] font-mono">Due Date: {activeInvoice.due_date}</p>
                    {activeInvoice.po_number && (
                      <p className="text-xs font-mono text-[#3a3a3a]">P.O. Ref: {activeInvoice.po_number}</p>
                    )}
                  </div>
                </div>

                {/* B2B / Customer Bill To & Ship To Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-[#e5e5e5] space-y-1 text-xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6a6a6a] block">
                      BILLED TO:
                    </span>
                    <p className="font-bold text-sm text-[#0a0a0a]">{activeInvoice.customer_name}</p>
                    {activeInvoice.customer_company && <p className="font-semibold text-[#3a3a3a]">{activeInvoice.customer_company}</p>}
                    {activeInvoice.customer_gstin && <p className="font-mono text-amber-900 font-bold">GSTIN: {activeInvoice.customer_gstin}</p>}
                    <p className="text-[#6a6a6a]">Phone: {activeInvoice.customer_phone}</p>
                    {activeInvoice.customer_email && <p className="text-[#6a6a6a]">Email: {activeInvoice.customer_email}</p>}
                    {activeInvoice.billing_address && <p className="text-[#6a6a6a] leading-relaxed">{activeInvoice.billing_address}</p>}
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#e5e5e5] space-y-1 text-xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6a6a6a] block">
                      SHIPPED / SITE ADDRESS:
                    </span>
                    {activeInvoice.shipping_address ? (
                      <p className="text-[#3a3a3a] leading-relaxed">{activeInvoice.shipping_address}</p>
                    ) : (
                      <p className="text-[#6a6a6a] italic">Same as Billing Address</p>
                    )}
                  </div>
                </div>

                {/* Itemized HSN/SAC Line Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#e5e5e5] text-[10px] font-bold text-[#6a6a6a] uppercase">
                        <th className="py-2.5 px-3">Item Description</th>
                        <th className="py-2.5 px-2">HSN/SAC</th>
                        <th className="py-2.5 px-2 text-center">Qty</th>
                        <th className="py-2.5 px-2 text-right">Unit Price</th>
                        <th className="py-2.5 px-2 text-right">Discount</th>
                        <th className="py-2.5 px-2 text-right">Tax %</th>
                        <th className="py-2.5 px-3 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e5e5]">
                      {activeInvoice.items.map((item, idx) => (
                        <tr key={idx} className="bg-white">
                          <td className="py-3 px-3 font-medium text-[#0a0a0a]">{item.description}</td>
                          <td className="py-3 px-2 font-mono text-[11px] text-[#6a6a6a]">{item.hsn_sac || "—"}</td>
                          <td className="py-3 px-2 text-center font-mono">{item.quantity}</td>
                          <td className="py-3 px-2 text-right font-mono">${item.unit_price.toFixed(2)}</td>
                          <td className="py-3 px-2 text-right font-mono text-green-700">-${(item.discount || 0).toFixed(2)}</td>
                          <td className="py-3 px-2 text-right font-mono">{item.tax_rate || 0}%</td>
                          <td className="py-3 px-3 text-right font-mono font-bold">${(item.line_total || (item.quantity * item.unit_price)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bank / Payment QR & Financial Calculations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-[#e5e5e5] pt-4">
                  
                  {/* Bank & Payment Details Card */}
                  <div className="bg-white p-4 rounded-xl border border-[#e5e5e5] space-y-2 text-xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6a6a6a] block border-b pb-1">
                      BANK & REMITTANCE DETAILS
                    </span>

                    {activeInvoice.bank_name || activeInvoice.bank_account_no ? (
                      <div className="space-y-1 text-[#3a3a3a]">
                        <p><span className="font-bold">Bank:</span> {activeInvoice.bank_name || "N/A"}</p>
                        <p><span className="font-bold">Account No:</span> <span className="font-mono">{activeInvoice.bank_account_no || "N/A"}</span></p>
                        <p><span className="font-bold">IFSC / Code:</span> <span className="font-mono">{activeInvoice.bank_ifsc || "N/A"}</span></p>
                        {activeInvoice.upi_id && <p><span className="font-bold">UPI ID:</span> <span className="font-mono text-emerald-800 font-bold">{activeInvoice.upi_id}</span></p>}
                      </div>
                    ) : (
                      <p className="text-[#6a6a6a] italic">Contact merchant for direct wire / bank instructions.</p>
                    )}
                  </div>

                  {/* Financial Breakdown */}
                  <div className="space-y-1.5 text-xs bg-white p-4 rounded-xl border border-[#e5e5e5]">
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

                    {activeInvoice.shipping_fee > 0 && (
                      <div className="flex justify-between text-[#6a6a6a]">
                        <span>Shipping / Service Fee:</span>
                        <span className="font-mono">+${activeInvoice.shipping_fee.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm font-bold text-[#0a0a0a] border-t pt-2">
                      <span>Grand Total:</span>
                      <span className="font-mono text-base">${activeInvoice.total_amount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-xs text-[#6a6a6a] pt-1">
                      <span>Amount Paid:</span>
                      <span className="font-mono text-emerald-700 font-bold">${activeInvoice.amount_paid.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-xs text-amber-900 font-bold border-t pt-1">
                      <span>Balance Due:</span>
                      <span className="font-mono text-sm">${activeInvoice.balance_due.toFixed(2)}</span>
                    </div>
                  </div>

                </div>

                {/* Terms & Authorized Signature Block */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#e5e5e5] text-xs">
                  <div>
                    <span className="font-bold text-[#0a0a0a] block mb-1">Terms & Conditions:</span>
                    <p className="text-[#6a6a6a] leading-relaxed">{activeInvoice.terms || activeInvoice.notes}</p>
                  </div>

                  <div className="text-left sm:text-right flex flex-col justify-end items-start sm:items-end">
                    <div className="w-44 border-b border-[#0a0a0a] mb-1 pb-8 text-center text-[10px] text-[#6a6a6a] italic">
                      Authorized Signature & Stamp
                    </div>
                    <span className="text-[10px] font-bold text-[#0a0a0a] uppercase tracking-wider">
                      {activeInvoice.business_name || selectedBusiness?.name || "Business Name"}
                    </span>
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

      {/* Enterprise Full Invoice Builder Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-4xl w-full border border-[#e5e5e5] space-y-5 shadow-xl max-h-[92vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-[#0a0a0a]">Create Enterprise Commercial & Tax Invoice</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-xs text-gray-500 font-bold hover:text-black">
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-6">
              
              {/* Section 1: Business / Seller Details Overrides */}
              <div className="space-y-3 bg-[#fffaf0] p-4 rounded-xl border border-[#e5e5e5]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Seller & Bank Remittance Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">Seller GSTIN / Tax ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 29AAAAA0000A1Z5"
                      value={bizGstin}
                      onChange={(e) => setBizGstin(e.target.value)}
                      className="w-full bg-white border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">Bank Name</label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC / Chase Bank"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-white border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">Account Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 501002345678"
                      value={bankAccountNo}
                      onChange={(e) => setBankAccountNo(e.target.value)}
                      className="w-full bg-white border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">IFSC / SWIFT / Routing Code</label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC0001234"
                      value={bankIfsc}
                      onChange={(e) => setBankIfsc(e.target.value)}
                      className="w-full bg-white border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">UPI ID (VPA)</label>
                    <input
                      type="text"
                      placeholder="e.g. store@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-white border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Customer / B2B Client Details */}
              <div className="space-y-3 bg-[#fffaf0] p-4 rounded-xl border border-[#e5e5e5]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Client / Customer Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">Client Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Roy"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      className="w-full bg-white border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">Client Company (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Tech Solutions"
                      value={custCompany}
                      onChange={(e) => setCustCompany(e.target.value)}
                      className="w-full bg-white border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">Client GSTIN / Tax ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 33BBBBA1111B1Z9"
                      value={custGstin}
                      onChange={(e) => setCustGstin(e.target.value)}
                      className="w-full bg-white border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">Client Phone *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 9876543210"
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      className="w-full bg-white border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">Client Email</label>
                    <input
                      type="email"
                      placeholder="client@company.com"
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      className="w-full bg-white border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">Billing Address</label>
                    <textarea
                      rows={2}
                      placeholder="Full billing address..."
                      value={billingAddr}
                      onChange={(e) => setBillingAddr(e.target.value)}
                      className="w-full bg-white border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">Shipping / Service Site Address</label>
                    <textarea
                      rows={2}
                      placeholder="Full shipping address (or leave empty if same)..."
                      value={shippingAddr}
                      onChange={(e) => setShippingAddr(e.target.value)}
                      className="w-full bg-white border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Metadata & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">Invoice # Override</label>
                  <input
                    type="text"
                    placeholder="Auto (e.g. INV-2026-0001)"
                    value={invNumOverride}
                    onChange={(e) => setInvNumOverride(e.target.value)}
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">P.O. / Order Ref #</label>
                  <input
                    type="text"
                    placeholder="e.g. PO-998811"
                    value={poNum}
                    onChange={(e) => setPoNum(e.target.value)}
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={invDate}
                    onChange={(e) => setInvDate(e.target.value)}
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Section 4: Itemized Line Items Table Builder */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#3a3a3a] uppercase tracking-wider">
                    Itemized Products / Services List
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="text-[11px] font-bold text-[#0a0a0a] bg-[#faf5e8] px-3 py-1 rounded-lg hover:bg-[#e5e5e5]"
                  >
                    + Add Item Row
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {lineItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#fffaf0] p-2 rounded-xl border border-[#e5e5e5]">
                      <input
                        type="text"
                        placeholder="Description / Product Name"
                        value={item.description}
                        onChange={(e) => handleUpdateItem(idx, "description", e.target.value)}
                        className="flex-2 bg-white border border-[#e5e5e5] rounded-lg p-1.5 text-xs font-medium"
                      />
                      <input
                        type="text"
                        placeholder="HSN/SAC"
                        value={item.hsn_sac}
                        onChange={(e) => handleUpdateItem(idx, "hsn_sac", e.target.value)}
                        className="w-20 bg-white border border-[#e5e5e5] rounded-lg p-1.5 text-xs font-mono"
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        min="0.1"
                        step="any"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(idx, "quantity", parseFloat(e.target.value) || 1)}
                        className="w-16 bg-white border border-[#e5e5e5] rounded-lg p-1.5 text-xs font-medium text-center"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => handleUpdateItem(idx, "unit_price", parseFloat(e.target.value) || 0)}
                        className="w-24 bg-white border border-[#e5e5e5] rounded-lg p-1.5 text-xs font-medium text-right"
                      />
                      <input
                        type="number"
                        placeholder="Tax %"
                        value={item.tax_rate}
                        onChange={(e) => handleUpdateItem(idx, "tax_rate", parseFloat(e.target.value) || 0)}
                        className="w-16 bg-white border border-[#e5e5e5] rounded-lg p-1.5 text-xs font-medium text-center"
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
              </div>

              {/* Section 5: Financial Adjustments */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#faf5e8] p-4 rounded-xl border border-[#e5e5e5]">
                <div>
                  <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">Tax / GST Rate %</label>
                  <input
                    type="number"
                    value={taxPct}
                    onChange={(e) => setTaxPct(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">Global Discount %</label>
                  <input
                    type="number"
                    value={discPct}
                    onChange={(e) => setDiscPct(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">Shipping Fee ($)</label>
                  <input
                    type="number"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#3a3a3a] mb-1">Advance Paid ($)</label>
                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#e5e5e5] rounded-lg p-2 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-[#0a0a0a] rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Generate Tax Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
