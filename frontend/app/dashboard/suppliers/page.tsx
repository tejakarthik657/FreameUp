"use client";

import { useState, useEffect } from "react";
import { Truck, Plus, Phone, Mail, FileText, ShoppingBag, MessageSquare, Check, Clock, ShieldCheck } from "lucide-react";
import { API_URL } from "@/lib/api";

interface Supplier {
  id: string;
  business_id: string;
  name: string;
  category: string;
  phone: string;
  email?: string;
  address?: string;
  lead_time_days: number;
  payment_terms: string;
}

interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_name: string;
  supplier_phone: string;
  items: any[];
  total_amount: number;
  status: string;
  created_at: string;
}

export default function SuppliersDashboard() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Add Supplier Modal
  const [showAddSupplier, setShowAddSupplier] = useState<boolean>(false);
  const [suppName, setSuppName] = useState<string>("");
  const [suppCategory, setSuppCategory] = useState<string>("Raw Material Wholesale");
  const [suppPhone, setSuppPhone] = useState<string>("");
  const [suppEmail, setSuppEmail] = useState<string>("");

  // Create PO Modal
  const [showCreatePO, setShowCreatePO] = useState<boolean>(false);
  const [selectedSupplierForPO, setSelectedSupplierForPO] = useState<Supplier | null>(null);
  const [poItemName, setPoItemName] = useState<string>("Bulk Supply Material");
  const [poQty, setPoQty] = useState<number>(10);
  const [poPrice, setPoPrice] = useState<number>(500);

  useEffect(() => {
    fetch(`${API_URL}/business`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBusinesses(data);
          setSelectedId(data[0].id);
          setSelectedBusiness(data[0]);
          fetchSuppliers(data[0].id);
          fetchPOs(data[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchSuppliers = (bId: string) => {
    if (!bId) return;
    fetch(`${API_URL}/suppliers/${bId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setSuppliers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchPOs = (bId: string) => {
    if (!bId) return;
    fetch(`${API_URL}/suppliers/pos/${bId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPurchaseOrders(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suppName || !suppPhone || !selectedId) return;

    try {
      await fetch(`${API_URL}/suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: selectedId,
          name: suppName,
          category: suppCategory,
          phone: suppPhone,
          email: suppEmail,
        }),
      });
      setShowAddSupplier(false);
      setSuppName("");
      setSuppPhone("");
      fetchSuppliers(selectedId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreatePOSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierForPO || !selectedId) return;

    const itemsArr = [{ item_name: poItemName, qty: poQty, unit_price: poPrice }];
    const total = poQty * poPrice;

    try {
      await fetch(`${API_URL}/suppliers/pos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: selectedId,
          supplier_id: selectedSupplierForPO.id,
          supplier_name: selectedSupplierForPO.name,
          supplier_phone: selectedSupplierForPO.phone,
          items: itemsArr,
          total_amount: total,
        }),
      });
      setShowCreatePO(false);
      fetchPOs(selectedId);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm font-mono text-[#6a6a6a]">
        Loading B2B Supplier Directory & Purchase Order Desk...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-[18px] border border-[#e0e0e0] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#1d1d1f] mb-1">
            <Truck className="w-6 h-6 text-[#0066cc]" />
            <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">B2B Vendor & Purchase Order Desk</h1>
          </div>
          <p className="text-xs text-[#86868b]">
            Connect with raw material suppliers, generate Purchase Orders (POs), and dispatch WhatsApp restock orders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddSupplier(true)}
            className="apple-btn-primary text-xs py-2 px-4 font-medium flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Vendor / Supplier
          </button>

          {Array.isArray(businesses) && businesses.length > 0 && (
            <select
              value={selectedId}
              onChange={(e) => {
                const b = businesses.find((x) => x.id === e.target.value);
                setSelectedId(e.target.value);
                setSelectedBusiness(b);
                fetchSuppliers(e.target.value);
                fetchPOs(e.target.value);
              }}
              className="bg-white border border-[#e0e0e0] rounded-full px-4 py-2 text-xs font-medium text-[#1d1d1f] focus:outline-none"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Vendor Directory */}
        <div className="apple-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1d1d1f]">
              Vendor Directory ({suppliers.length})
            </h2>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
              B2B Connected
            </span>
          </div>

          {suppliers.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#86868b] space-y-2">
              <Truck className="w-8 h-8 mx-auto opacity-40 text-[#86868b]" />
              <p>No suppliers added yet. Click "+ Add Vendor / Supplier" to register your wholesale suppliers.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {suppliers.map((s) => (
                <div key={s.id} className="bg-[#f5f5f7] p-4 rounded-xl border border-[#e0e0e0] space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-semibold bg-white text-[#0066cc] px-2 py-0.5 rounded-full uppercase block w-max mb-1 border border-[#e0e0e0]">
                        {s.category}
                      </span>
                      <h3 className="font-semibold text-[#1d1d1f]">{s.name}</h3>
                      <p className="text-xs text-[#86868b] font-mono mt-0.5">Phone: {s.phone}</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedSupplierForPO(s);
                        setShowCreatePO(true);
                      }}
                      className="apple-btn-secondary text-[11px] py-1.5 px-3 font-medium"
                    >
                      + Generate PO
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Purchase Orders List */}
        <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a]">
              Purchase Orders ({purchaseOrders.length})
            </h2>
            <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
              Restock Pipeline
            </span>
          </div>

          {purchaseOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6a6a6a] space-y-2">
              <FileText className="w-8 h-8 mx-auto opacity-40" />
              <p>No purchase orders generated yet. Select a vendor on the left to issue a PO.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {purchaseOrders.map((po) => {
                const waMsg = `Hi ${po.supplier_name}, Purchase Order ${po.po_number} from ${selectedBusiness?.name || "us"}:\nTotal Value: ₹${po.total_amount}.\nPlease confirm stock dispatch. Thank you!`;
                return (
                  <div key={po.id} className="bg-[#fffaf0] p-4 rounded-xl border border-[#e5e5e5] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#0a0a0a] text-xs">{po.po_number}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 uppercase">
                        {po.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#0a0a0a] block">{po.supplier_name}</span>
                        <span className="text-[10px] text-[#6a6a6a] font-mono">Date: {po.created_at.split("T")[0]}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0a0a0a]">₹{po.total_amount}</span>

                        <a
                          href={`https://wa.me/${po.supplier_phone.replace(/\D/g, "")}?text=${encodeURIComponent(waMsg)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-[#25D366] text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" /> Send PO
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Add Supplier Modal */}
      {showAddSupplier && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-[#e5e5e5] shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[#0a0a0a]">Add New Vendor / Supplier</h3>
            <form onSubmit={handleAddSupplier} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Vendor / Firm Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Wholesale Agencies"
                  value={suppName}
                  onChange={(e) => setSuppName(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Phone Number (WhatsApp)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210"
                  value={suppPhone}
                  onChange={(e) => setSuppPhone(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Food / Salon / Electrical Wholesale"
                  value={suppCategory}
                  onChange={(e) => setSuppCategory(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSupplier(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-[#0a0a0a] rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0a0a0a] text-white rounded-xl text-xs font-bold"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create PO Modal */}
      {showCreatePO && selectedSupplierForPO && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-[#e5e5e5] shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[#0a0a0a]">Create PO for {selectedSupplierForPO.name}</h3>
            <form onSubmit={handleCreatePOSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Material / Product Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50kg Flour Bags / Salon Hair Dryer Kits"
                  value={poItemName}
                  onChange={(e) => setPoItemName(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    value={poQty}
                    onChange={(e) => setPoQty(parseFloat(e.target.value) || 1)}
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Estimated Rate (₹)</label>
                  <input
                    type="number"
                    required
                    value={poPrice}
                    onChange={(e) => setPoPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#faf5e8] rounded-xl border text-xs font-mono flex justify-between">
                <span>Total PO Order Value:</span>
                <span className="font-bold text-[#0a0a0a]">₹{(poQty * poPrice).toLocaleString("en-IN")}</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreatePO(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-[#0a0a0a] rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0a0a0a] text-white rounded-xl text-xs font-bold"
                >
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
