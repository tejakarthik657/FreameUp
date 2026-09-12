"use client";

import { useState, useEffect } from "react";
import { Users, Briefcase, Plus, Check, X, PackageCheck, IndianRupee, ShieldCheck, Phone, Sparkles } from "lucide-react";
import { API_URL } from "@/lib/api";

interface StaffMember {
  id: string;
  business_id: string;
  name: string;
  role: string;
  phone: string;
  daily_wage: number;
  status: string;
  allocated_goods: string[];
  created_at: string;
}

export default function StaffDashboard() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Add Worker Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [workerName, setWorkerName] = useState<string>("");
  const [workerRole, setWorkerRole] = useState<string>("Senior Specialist");
  const [workerPhone, setWorkerPhone] = useState<string>("");
  const [workerWage, setWorkerWage] = useState<number>(800);

  // Goods Allocation Modal
  const [selectedStaffForGoods, setSelectedStaffForGoods] = useState<StaffMember | null>(null);
  const [goodsName, setGoodsName] = useState<string>("");
  const [goodsQty, setGoodsQty] = useState<number>(1);
  const [allocating, setAllocating] = useState<boolean>(false);

  useEffect(() => {
    fetch(`${API_URL}/business`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setBusinesses(data);
          if (data.length > 0) {
            setSelectedId(data[0].id);
            fetchStaff(data[0].id);
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

  const fetchStaff = (bId: string) => {
    if (!bId) return;
    fetch(`${API_URL}/staff/${bId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setStaffList(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleAddWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName || !workerPhone || !selectedId) return;

    try {
      await fetch(`${API_URL}/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: selectedId,
          name: workerName,
          role: workerRole,
          phone: workerPhone,
          daily_wage: workerWage,
          status: "Present",
        }),
      });
      setShowAddModal(false);
      setWorkerName("");
      setWorkerPhone("");
      fetchStaff(selectedId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRecordAttendance = async (staffId: string, status: string) => {
    try {
      await fetch(`${API_URL}/staff/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staff_id: staffId,
          business_id: selectedId,
          status,
        }),
      });
      fetchStaff(selectedId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAllocateGoodsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffForGoods || !goodsName || !selectedId || allocating) return;
    setAllocating(true);

    try {
      await fetch(`${API_URL}/staff/allocate-goods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staff_id: selectedStaffForGoods.id,
          business_id: selectedId,
          item_name: goodsName,
          quantity: goodsQty,
        }),
      });
      setSelectedStaffForGoods(null);
      setGoodsName("");
      setGoodsQty(1);
      fetchStaff(selectedId);
    } catch (e) {
      console.error(e);
    }
    setAllocating(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm font-mono text-[#6a6a6a]">
        Loading Workers & Goods Management Desk...
      </div>
    );
  }

  const safeStaffList = Array.isArray(staffList) ? staffList : [];
  const totalWagesToday = safeStaffList
    .filter((s) => s.status === "Present")
    .reduce((acc, s) => acc + (s.daily_wage || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#faf5e8] p-6 rounded-2xl border border-[#e5e5e5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#0a0a0a] mb-1">
            <Users className="w-6 h-6 text-[#0a0a0a]" />
            <h1 className="text-2xl font-serif font-bold tracking-tight">Workers & Goods Management Desk</h1>
          </div>
          <p className="text-xs text-[#6a6a6a]">
            Manage employee shifts, daily attendance, wage payouts (₹), and allocate tools/goods per staff member.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add New Worker
          </button>

          {Array.isArray(businesses) && businesses.length > 0 && (
            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                fetchStaff(e.target.value);
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

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#a4d4c5] text-[#0a0a0a] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider opacity-80 font-mono">Active Staff Roster</span>
          <span className="text-4xl font-black mt-3">{safeStaffList.length}</span>
          <span className="text-xs font-semibold mt-2 opacity-90">Registered Workers</span>
        </div>

        <div className="bg-[#e8b94a] text-[#0a0a0a] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider opacity-80 font-mono">Present Today</span>
          <span className="text-4xl font-black mt-3">{safeStaffList.filter((s) => s.status === "Present").length}</span>
          <span className="text-xs font-semibold mt-2 opacity-90">On Shift</span>
        </div>

        <div className="bg-[#ffb084] text-[#0a0a0a] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider opacity-80 font-mono">Est. Daily Wage Payout</span>
          <span className="text-4xl font-black mt-3 font-mono">₹{totalWagesToday.toLocaleString("en-IN")}</span>
          <span className="text-xs font-semibold mt-2 opacity-90">Daily Payroll Total</span>
        </div>
      </div>

      {/* Worker Roster & Allocated Goods List */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a]">
            Staff Roster & Allocated Goods ({safeStaffList.length})
          </h2>
          <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
            Daily Shift Active
          </span>
        </div>

        {safeStaffList.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6a6a6a] space-y-2">
            <Users className="w-8 h-8 text-[#6a6a6a] mx-auto opacity-50" />
            <p>No staff members registered yet. Click "+ Add New Worker" to build your staff roster.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeStaffList.map((worker) => (
              <div key={worker.id} className="bg-[#fffaf0] p-5 rounded-2xl border border-[#e5e5e5] space-y-4 shadow-xs">
                
                {/* Header info */}
                <div className="flex items-start justify-between border-b border-[#e5e5e5] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#0a0a0a]">{worker.name}</h3>
                    <span className="text-xs font-medium text-amber-900 bg-amber-100/60 px-2 py-0.5 rounded inline-block mt-0.5">
                      {worker.role}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      worker.status === "Present"
                        ? "bg-green-100 text-green-800"
                        : worker.status === "Half Day"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {worker.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-[#3a3a3a]">
                  <div className="flex justify-between">
                    <span className="text-[#6a6a6a]">Phone Number:</span>
                    <span className="font-mono font-bold text-[#0a0a0a]">{worker.phone}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#6a6a6a]">Daily Wage Rate:</span>
                    <span className="font-mono font-bold text-emerald-800">₹{(worker.daily_wage || 0).toLocaleString("en-IN")} / day</span>
                  </div>
                </div>

                {/* Allocated Goods & Tools */}
                <div className="bg-white p-3 rounded-xl border border-[#e5e5e5] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6a6a6a]">
                      Allocated Goods / Tools ({worker.allocated_goods?.length || 0})
                    </span>
                    <button
                      onClick={() => setSelectedStaffForGoods(worker)}
                      className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded hover:bg-indigo-100"
                    >
                      + Allocate Kit
                    </button>
                  </div>

                  {Array.isArray(worker.allocated_goods) && worker.allocated_goods.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {worker.allocated_goods.map((item, idx) => (
                        <span key={idx} className="text-[10px] font-bold bg-[#faf5e8] text-[#0a0a0a] px-2 py-1 rounded-lg border border-[#e5e5e5]">
                          📦 {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#6a6a6a] italic">No goods/tools allocated to worker.</p>
                  )}
                </div>

                {/* Attendance Actions */}
                <div className="pt-2 border-t border-[#e5e5e5] flex gap-2">
                  <button
                    onClick={() => handleRecordAttendance(worker.id, "Present")}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                      worker.status === "Present" ? "bg-emerald-700 text-white" : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" /> Present
                  </button>
                  <button
                    onClick={() => handleRecordAttendance(worker.id, "Absent")}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                      worker.status === "Absent" ? "bg-red-700 text-white" : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    <X className="w-3.5 h-3.5" /> Absent
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Worker Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-[#e5e5e5] space-y-4 shadow-xl">
            <h2 className="text-base font-bold text-[#0a0a0a]">Register New Worker / Staff Member</h2>

            <form onSubmit={handleAddWorker} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Worker Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={workerName}
                  onChange={(e) => setWorkerName(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Role / Designation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Chef / Senior Stylist / Head Technician"
                  value={workerRole}
                  onChange={(e) => setWorkerRole(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 9876543210"
                  value={workerPhone}
                  onChange={(e) => setWorkerPhone(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Daily Wage Rate (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 800"
                  value={workerWage}
                  onChange={(e) => setWorkerWage(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#0a0a0a] rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white rounded-xl text-xs font-bold"
                >
                  Register Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goods Allocation Modal */}
      {selectedStaffForGoods && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-[#e5e5e5] space-y-4 shadow-xl">
            <h2 className="text-base font-bold text-[#0a0a0a]">
              Allocate Goods / Tools to {selectedStaffForGoods.name}
            </h2>

            <form onSubmit={handleAllocateGoodsSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Item / Goods Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Professional Scissors Kit / Spices Box / Tool Set"
                  value={goodsName}
                  onChange={(e) => setGoodsName(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={goodsQty}
                  onChange={(e) => setGoodsQty(parseFloat(e.target.value) || 1)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStaffForGoods(null)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#0a0a0a] rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={allocating}
                  className="flex-1 py-2.5 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white rounded-xl text-xs font-bold"
                >
                  {allocating ? "Allocating..." : "Allocate Goods"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
