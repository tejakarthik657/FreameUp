"use client";

import { useState, useEffect } from "react";
import { Package, AlertTriangle, Plus, Minus, RefreshCw, ShoppingCart, IndianRupee, Truck, ShieldAlert } from "lucide-react";
import { API_URL } from "@/lib/api";

interface InventoryItem {
  id: string;
  business_id: string;
  item_name: string;
  category: string;
  stock_qty: number;
  unit: string;
  low_stock_threshold: number;
  unit_price: number;
  supplier_name: string;
  last_updated: string;
}

export default function InventoryDashboard() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Add Item Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [itemName, setItemName] = useState<string>("");
  const [category, setCategory] = useState<string>("Raw Materials");
  const [stockQty, setStockQty] = useState<number>(50);
  const [unit, setUnit] = useState<string>("kg");
  const [threshold, setThreshold] = useState<number>(10);
  const [unitPrice, setUnitPrice] = useState<number>(120);
  const [supplierName, setSupplierName] = useState<string>("Main Wholesale Vendor");

  useEffect(() => {
    fetch(`${API_URL}/business`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBusinesses(data);
          setSelectedId(data[0].id);
          fetchInventory(data[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchInventory = (bId: string) => {
    if (!bId) return;
    fetch(`${API_URL}/inventory/${bId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !selectedId) return;

    try {
      await fetch(`${API_URL}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: selectedId,
          item_name: itemName,
          category,
          stock_qty: stockQty,
          unit,
          low_stock_threshold: threshold,
          unit_price: unitPrice,
          supplier_name: supplierName,
        }),
      });
      setShowAddModal(false);
      setItemName("");
      fetchInventory(selectedId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdjustStock = async (itemId: string, change: number) => {
    try {
      await fetch(`${API_URL}/inventory/adjust`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId, qty_change: change }),
      });
      fetchInventory(selectedId);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm font-mono text-[#6a6a6a]">
        Loading Real-Time Stock & Inventory Manager...
      </div>
    );
  }

  const lowStockItems = items.filter((i) => i.stock_qty <= i.low_stock_threshold);
  const totalStockValue = items.reduce((acc, i) => acc + i.stock_qty * i.unit_price, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#faf5e8] p-6 rounded-2xl border border-[#e5e5e5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#0a0a0a] mb-1">
            <Package className="w-6 h-6 text-amber-800" />
            <h1 className="text-2xl font-serif font-bold tracking-tight">Real-Time Stock & Inventory Manager</h1>
          </div>
          <p className="text-xs text-[#6a6a6a]">
            Prevent overselling across POS counters, website orders, and WhatsApp. Automatic low-stock warnings & B2B reordering.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Stock Item
          </button>

          {Array.isArray(businesses) && businesses.length > 0 && (
            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                fetchInventory(e.target.value);
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

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-[#6a6a6a] uppercase tracking-wider block">Total Tracked Items</span>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-800" />
            <span className="text-2xl font-bold font-mono text-[#0a0a0a]">{items.length} SKUs</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-[#6a6a6a] uppercase tracking-wider block">Low Stock Warnings</span>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span className="text-2xl font-bold font-mono text-amber-700">{lowStockItems.length} Alerts</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-[#6a6a6a] uppercase tracking-wider block">Total Inventory Value</span>
          <div className="flex items-center gap-1">
            <IndianRupee className="w-5 h-5 text-emerald-800" />
            <span className="text-2xl font-bold font-mono text-emerald-900">₹{totalStockValue.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Inventory Items Table / Grid */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a]">
          Inventory Items & Quick Stock Adjustments
        </h2>

        {items.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6a6a6a] space-y-2">
            <Package className="w-8 h-8 mx-auto opacity-40" />
            <p>No inventory items created yet. Click "+ Add Stock Item" to start tracking inventory.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {items.map((item) => {
              const isLow = item.stock_qty <= item.low_stock_threshold;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isLow ? "bg-amber-50/60 border-amber-200" : "bg-[#fffaf0] border-[#e5e5e5]"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0a0a0a]">{item.item_name}</span>
                      <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#e5e5e5]">
                        {item.category}
                      </span>
                      {isLow && (
                        <span className="text-[10px] font-bold font-mono bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> Low Stock ({item.stock_qty} {item.unit})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6a6a6a]">
                      Supplier: <span className="font-semibold text-[#3a3a3a]">{item.supplier_name}</span> · Unit Price: ₹{item.unit_price} / {item.unit}
                    </p>
                  </div>

                  {/* Stock Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-[#0a0a0a] block">
                        {item.stock_qty} {item.unit}
                      </span>
                      <span className="text-[10px] text-[#6a6a6a] block">Safety Min: {item.low_stock_threshold}</span>
                    </div>

                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#e5e5e5]">
                      <button
                        onClick={() => handleAdjustStock(item.id, -1)}
                        className="p-1 hover:bg-gray-100 rounded text-red-600 font-bold"
                        title="Deduct 1"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAdjustStock(item.id, 5)}
                        className="p-1 hover:bg-gray-100 rounded text-emerald-600 font-bold"
                        title="Restock 5"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-[#e5e5e5] shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[#0a0a0a]">Add Inventory Item</h3>
            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Item / Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aashirvaad Atta / Shampoo Bottle 500ml"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={stockQty}
                    onChange={(e) => setStockQty(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="pcs / kg / ltr"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Low Stock Limit</label>
                  <input
                    type="number"
                    required
                    value={threshold}
                    onChange={(e) => setThreshold(parseFloat(e.target.value) || 5)}
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Supplier Name</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Wholesale Traders"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-[#0a0a0a] rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0a0a0a] text-white rounded-xl text-xs font-bold"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
