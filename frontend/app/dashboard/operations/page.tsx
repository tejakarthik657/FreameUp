"use client";

import { useState, useEffect } from "react";
import { Activity, Clock, Check, X, Phone, MessageSquare, Volume2, Plus, Sparkles, RefreshCw } from "lucide-react";
import { API_URL } from "@/lib/api";

interface Order {
  id: string;
  business_id: string;
  customer_name: string;
  customer_phone: string;
  order_type: string;
  items_or_service: string;
  notes?: string;
  status: string;
  created_at: string;
}

export default function OperationsDesk() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Manual test order form state
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [custName, setCustName] = useState<string>("");
  const [custPhone, setCustPhone] = useState<string>("");
  const [itemsTxt, setItemsTxt] = useState<string>("");
  const [orderType, setOrderType] = useState<string>("order");

  const playChimeSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.log("Audio play blocked", e);
    }
  };

  const fetchOrders = (bId: string) => {
    if (!bId) return;
    fetch(`${API_URL}/operations/orders/${bId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetch(`${API_URL}/business`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setBusinesses(data);
          if (data.length > 0) {
            setSelectedId(data[0].id);
            fetchOrders(data[0].id);
          } else {
            setLoading(false);
          }
        } else {
          setBusinesses([]);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    fetchOrders(selectedId);
    const interval = setInterval(() => fetchOrders(selectedId), 8000);
    return () => clearInterval(interval);
  }, [selectedId]);

  const handleUpdateStatus = async (orderId: string, status: string, prepMins: number = 30) => {
    try {
      const res = await fetch(`${API_URL}/operations/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, prep_time_minutes: prepMins }),
      });
      const data = await res.json();
      if (data.whatsapp_url) {
        window.open(data.whatsapp_url, "_blank");
      }
      fetchOrders(selectedId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone || !itemsTxt || !selectedId) return;
    try {
      await fetch(`${API_URL}/operations/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: selectedId,
          customer_name: custName,
          customer_phone: custPhone,
          order_type: orderType,
          items_or_service: itemsTxt,
        }),
      });
      if (soundEnabled) playChimeSound();
      setShowManualModal(false);
      setCustName("");
      setCustPhone("");
      setItemsTxt("");
      fetchOrders(selectedId);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter((o) => (filterStatus === "all" ? true : o.status === filterStatus));

  if (loading) {
    return (
      <div className="p-8 text-center text-sm font-mono text-[#6a6a6a]">
        Initializing Operations Terminal...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#faf5e8] p-6 rounded-2xl border border-[#e5e5e5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#0a0a0a] mb-1">
            <Activity className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-serif font-bold tracking-tight">Live Operations Desk</h1>
          </div>
          <p className="text-xs text-[#6a6a6a]">
            Real-time terminal for active orders & booking requests with instant WhatsApp customer confirmation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={playChimeSound}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#e5e5e5] rounded-xl text-xs font-semibold border border-[#e5e5e5] transition-all"
          >
            <Volume2 className="w-4 h-4 text-amber-600" /> Test Chime Sound
          </button>

          <button
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white rounded-xl text-xs font-semibold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" /> Simulate New Order
          </button>

          {businesses.length > 0 && (
            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                fetchOrders(e.target.value);
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

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {["all", "pending", "accepted", "preparing", "completed", "declined"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                filterStatus === st
                  ? "bg-[#0a0a0a] text-white shadow-xs"
                  : "bg-white text-[#3a3a3a] border border-[#e5e5e5] hover:bg-[#faf5e8]"
              }`}
            >
              {st} ({orders.filter((o) => (st === "all" ? true : o.status === st)).length})
            </button>
          ))}
        </div>

        <button
          onClick={() => fetchOrders(selectedId)}
          className="flex items-center gap-1 text-xs text-[#6a6a6a] hover:text-[#0a0a0a]"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Orders Terminal List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-[#e5e5e5] text-center space-y-3">
          <Clock className="w-8 h-8 text-[#6a6a6a] mx-auto" />
          <h3 className="text-sm font-bold text-[#0a0a0a]">No Orders in standard queue</h3>
          <p className="text-xs text-[#6a6a6a]">Click "+ Simulate New Order" to test real-time order notifications and WhatsApp dispatching.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((ord) => {
            const isPending = ord.status === "pending";
            return (
              <div
                key={ord.id}
                className={`bg-white rounded-2xl border p-5 space-y-4 shadow-xs relative transition-all ${
                  isPending ? "border-amber-400 bg-amber-50/20 ring-2 ring-amber-400/30" : "border-[#e5e5e5]"
                }`}
              >
                <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6a6a6a] block">
                      {ord.order_type.toUpperCase()} · #{ord.id.slice(-6)}
                    </span>
                    <h3 className="text-sm font-bold text-[#0a0a0a]">{ord.customer_name}</h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      ord.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : ord.status === "accepted"
                        ? "bg-blue-100 text-blue-800"
                        : ord.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#3a3a3a]">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#6a6a6a]">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{ord.customer_phone}</span>
                  </div>

                  <div className="p-3 bg-[#fffaf0] rounded-xl border border-[#e5e5e5] text-xs font-medium text-[#0a0a0a]">
                    {ord.items_or_service}
                  </div>
                </div>

                {/* Dispatch Controls */}
                <div className="pt-2 border-t border-[#e5e5e5] flex flex-wrap gap-2">
                  {isPending && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(ord.id, "accepted", 30)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept (30m)
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(ord.id, "declined")}
                        className="py-2 px-3 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Decline
                      </button>
                    </>
                  )}

                  {ord.status === "accepted" && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, "completed")}
                      className="w-full py-2 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark Ready / Fulfill
                    </button>
                  )}

                  {ord.customer_phone && (
                    <a
                      href={`https://wa.me/${ord.customer_phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-[#25D366]/30"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Send Manual WhatsApp Message
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Order Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-[#e5e5e5] space-y-4 shadow-xl">
            <h2 className="text-base font-bold text-[#0a0a0a]">Simulate New Incoming Customer Order</h2>

            <form onSubmit={handleCreateManualOrder} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Customer Name</label>
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
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Customer Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 9876543210"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Type</label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                >
                  <option value="order">Food / Product Order</option>
                  <option value="booking">Appointment / Reservation Booking</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Items / Service Details</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g., 2x Butter Chicken, 4x Garlic Naan"
                  value={itemsTxt}
                  onChange={(e) => setItemsTxt(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#0a0a0a] rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white rounded-xl text-xs font-bold"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
