"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  Plus,
  Check,
  X,
  PackageCheck,
  IndianRupee,
  ShieldCheck,
  Phone,
  Sparkles,
  Download,
  MessageSquare,
  Clock,
  HandCoins,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { API_URL } from "@/lib/api";

interface GoodsItem {
  item: string;
  qty: number;
  serial?: string;
  status?: string; // 'Issued' | 'Returned' | 'Damaged/Lost'
  date?: string;
}

interface StaffMember {
  id: string;
  business_id: string;
  name: string;
  role: string;
  phone: string;
  daily_wage: number;
  status: string;
  advance_taken: number;
  overtime_hours: number;
  overtime_rate: number;
  allocated_goods: (GoodsItem | string)[];
  created_at: string;
}

export default function StaffDashboard() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
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
  const [goodsSerial, setGoodsSerial] = useState<string>("");
  const [allocating, setAllocating] = useState<boolean>(false);

  // Advance Salary Modal
  const [selectedStaffForAdvance, setSelectedStaffForAdvance] = useState<StaffMember | null>(null);
  const [advanceAmount, setAdvanceAmount] = useState<number>(500);

  // Overtime Modal
  const [selectedStaffForOT, setSelectedStaffForOT] = useState<StaffMember | null>(null);
  const [otHours, setOtHours] = useState<number>(2);
  const [otRate, setOtRate] = useState<number>(100);

  useEffect(() => {
    fetch(`${API_URL}/business`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setBusinesses(data);
          if (data.length > 0) {
            setSelectedId(data[0].id);
            setSelectedBusiness(data[0]);
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
          serial_no: goodsSerial,
        }),
      });
      setSelectedStaffForGoods(null);
      setGoodsName("");
      setGoodsSerial("");
      setGoodsQty(1);
      fetchStaff(selectedId);
    } catch (e) {
      console.error(e);
    } finally {
      setAllocating(false);
    }
  };

  const handleAdvanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffForAdvance || !advanceAmount) return;

    try {
      await fetch(`${API_URL}/staff/advance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staff_id: selectedStaffForAdvance.id,
          amount: advanceAmount,
        }),
      });
      setSelectedStaffForAdvance(null);
      fetchStaff(selectedId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOTSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffForOT || !otHours) return;

    try {
      await fetch(`${API_URL}/staff/overtime`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staff_id: selectedStaffForOT.id,
          hours: otHours,
          rate_per_hour: otRate,
        }),
      });
      setSelectedStaffForOT(null);
      fetchStaff(selectedId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateKitStatus = async (staffId: string, idx: number, newStatus: string) => {
    try {
      await fetch(`${API_URL}/staff/goods-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staff_id: staffId,
          item_index: idx,
          new_status: newStatus,
        }),
      });
      fetchStaff(selectedId);
    } catch (e) {
      console.error(e);
    }
  };

  // Export to Excel / CSV
  const exportToExcelCSV = () => {
    if (!staffList.length) return;

    const headers = [
      "Worker ID",
      "Worker Name",
      "Role / Designation",
      "Phone Number",
      "Attendance Status",
      "Daily Wage (INR)",
      "Overtime Hours",
      "Overtime Rate (INR/hr)",
      "Overtime Pay (INR)",
      "Advance Salary Taken (INR)",
      "Net Payable Balance (INR)",
      "Allocated Goods & Kits",
    ];

    const rows = staffList.map((w) => {
      const otPay = (w.overtime_hours || 0) * (w.overtime_rate || 100);
      const netPay = (w.status === "Present" ? w.daily_wage : w.status === "Half Day" ? w.daily_wage * 0.5 : 0) + otPay - (w.advance_taken || 0);

      const goodsFormatted = (w.allocated_goods || [])
        .map((g) => {
          if (typeof g === "string") return g;
          return `${g.qty}x ${g.item} (Serial: ${g.serial || "N/A"}) [${g.status || "Issued"}]`;
        })
        .join(" | ");

      return [
        `"${w.id}"`,
        `"${w.name.replace(/"/g, '""')}"`,
        `"${w.role.replace(/"/g, '""')}"`,
        `"${w.phone}"`,
        `"${w.status}"`,
        w.daily_wage,
        w.overtime_hours || 0,
        w.overtime_rate || 100,
        otPay,
        w.advance_taken || 0,
        netPay,
        `"${goodsFormatted.replace(/"/g, '""')}"`,
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    link.href = url;
    link.setAttribute("download", `Staff_And_Goods_Master_Report_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm font-mono text-[#6a6a6a]">
        Loading Workers & Goods Management Desk...
      </div>
    );
  }

  const presentCount = staffList.filter((s) => s.status === "Present").length;
  const totalDailyPayout = staffList.reduce((acc, s) => {
    const base = s.status === "Present" ? s.daily_wage : s.status === "Half Day" ? s.daily_wage * 0.5 : 0;
    const ot = (s.overtime_hours || 0) * (s.overtime_rate || 100);
    const advance = s.advance_taken || 0;
    return acc + (base + ot - advance);
  }, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-[18px] border border-[#e0e0e0] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#1d1d1f] mb-1">
            <Users className="w-6 h-6 text-[#0066cc]" />
            <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">Workers & Goods Management Desk</h1>
          </div>
          <p className="text-xs text-[#86868b]">
            Manage employee rosters, daily shift attendance, advance salary payouts, overtime pay, and allocated goods/kits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportToExcelCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-medium transition-all shadow-xs active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel (CSV)
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="apple-btn-primary text-xs py-2 px-4 font-medium flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Worker / Employee
          </button>

          {Array.isArray(businesses) && businesses.length > 0 && (
            <select
              value={selectedId}
              onChange={(e) => {
                const b = businesses.find((x) => x.id === e.target.value);
                setSelectedId(e.target.value);
                setSelectedBusiness(b);
                fetchStaff(e.target.value);
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

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="apple-card space-y-1">
          <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider block">Total Roster</span>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#0066cc]" />
            <span className="text-2xl font-bold font-mono text-[#1d1d1f]">{staffList.length}</span>
          </div>
          <span className="text-[11px] text-[#86868b] block">Active Workers Registered</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-[#6a6a6a] uppercase tracking-wider block">Present Today</span>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600" />
            <span className="text-2xl font-bold font-mono text-emerald-900">{presentCount} / {staffList.length}</span>
          </div>
          <span className="text-[11px] text-[#6a6a6a] block">Shift On-Site Attendance</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-[#6a6a6a] uppercase tracking-wider block">Daily Net Wage Payout</span>
          <div className="flex items-center gap-1">
            <IndianRupee className="w-5 h-5 text-amber-800" />
            <span className="text-2xl font-bold font-mono text-[#0a0a0a]">₹{totalDailyPayout.toLocaleString("en-IN")}</span>
          </div>
          <span className="text-[11px] text-[#6a6a6a] block">Base Pay + OT - Advance</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-[#6a6a6a] uppercase tracking-wider block">Allocated Equipment</span>
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-blue-600" />
            <span className="text-2xl font-bold font-mono text-blue-900">
              {staffList.reduce((acc, s) => acc + (s.allocated_goods || []).length, 0)}
            </span>
          </div>
          <span className="text-[11px] text-[#6a6a6a] block">Issued Goods / Tool Kits</span>
        </div>
      </div>

      {/* Staff Workers Roster Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a]">
            Active Worker Roster & Attendance Controls
          </h2>
          <span className="text-xs text-[#6a6a6a] font-mono">
            Click status pills to switch shift attendance instantly
          </span>
        </div>

        {staffList.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-[#e5e5e5] space-y-3">
            <Users className="w-12 h-12 text-[#6a6a6a] mx-auto opacity-40" />
            <h3 className="text-base font-bold text-[#0a0a0a]">No staff members registered</h3>
            <p className="text-xs text-[#6a6a6a] max-w-sm mx-auto">
              Add your master chefs, senior stylists, technicians, or daily wage workers to start tracking shift attendance and goods allocations.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#0a0a0a] text-white rounded-xl text-xs font-bold"
            >
              <Plus className="w-4 h-4" /> Add First Worker
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {staffList.map((worker) => {
              const otPay = (worker.overtime_hours || 0) * (worker.overtime_rate || 100);
              const baseWage = worker.status === "Present" ? worker.daily_wage : worker.status === "Half Day" ? worker.daily_wage * 0.5 : 0;
              const netPayable = baseWage + otPay - (worker.advance_taken || 0);

              const waMsg = `Hi ${worker.name}, your shift report from ${selectedBusiness?.name || "our company"}:\n• Attendance: ${worker.status}\n• Daily Base Wage: ₹${baseWage}\n• Overtime Pay: ₹${otPay} (${worker.overtime_hours || 0} hrs)\n• Advance Salary Deducted: ₹${worker.advance_taken || 0}\n👉 Net Balance Payable: ₹${netPayable}.\nThank you!`;

              return (
                <div key={worker.id} className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-5 flex flex-col justify-between">
                  
                  {/* Top: Name, Role, Phone */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold bg-[#faf5e8] text-amber-900 px-2 py-0.5 rounded-md uppercase block w-max mb-1">
                          {worker.role}
                        </span>
                        <h3 className="text-lg font-bold text-[#0a0a0a]">{worker.name}</h3>
                        <p className="text-xs text-[#6a6a6a] flex items-center gap-1 font-mono mt-0.5">
                          <Phone className="w-3 h-3 text-[#6a6a6a]" /> {worker.phone}
                        </p>
                      </div>

                      {/* WhatsApp Salary Slip Link */}
                      <a
                        href={`https://wa.me/${worker.phone.replace(/\D/g, "")}?text=${encodeURIComponent(waMsg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white rounded-xl text-xs font-bold transition-all border border-[#25D366]/30"
                        title="Send Pay Slip on WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Attendance Selector Buttons */}
                    <div className="flex items-center gap-1 bg-[#fffaf0] p-1.5 rounded-xl border border-[#e5e5e5]">
                      {["Present", "Half Day", "Absent"].map((st) => {
                        const active = worker.status === st;
                        return (
                          <button
                            key={st}
                            onClick={() => handleRecordAttendance(worker.id, st)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                              active
                                ? st === "Present"
                                  ? "bg-emerald-600 text-white shadow-xs"
                                  : st === "Half Day"
                                  ? "bg-amber-600 text-white shadow-xs"
                                  : "bg-red-600 text-white shadow-xs"
                                : "text-[#6a6a6a] hover:bg-gray-100"
                            }`}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Financial Breakdown Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-[#faf5e8] p-3.5 rounded-xl border border-[#e5e5e5] text-xs">
                    <div>
                      <span className="text-[10px] text-[#6a6a6a] block font-medium">Daily Wage</span>
                      <span className="font-bold font-mono text-[#0a0a0a]">₹{worker.daily_wage}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#6a6a6a] block font-medium">Advance Paid</span>
                      <span className="font-bold font-mono text-red-700">₹{worker.advance_taken || 0}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#6a6a6a] block font-medium">Net Payable</span>
                      <span className="font-bold font-mono text-emerald-900">₹{netPayable}</span>
                    </div>
                  </div>

                  {/* Action Bar: Overtime, Advance, Kit */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                    <button
                      onClick={() => setSelectedStaffForAdvance(worker)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[#fffaf0] hover:bg-[#faf5e8] border border-[#e5e5e5] rounded-xl text-[11px] font-bold text-[#0a0a0a]"
                    >
                      <HandCoins className="w-3.5 h-3.5 text-amber-800" /> Advance ₹
                    </button>

                    <button
                      onClick={() => setSelectedStaffForOT(worker)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[#fffaf0] hover:bg-[#faf5e8] border border-[#e5e5e5] rounded-xl text-[11px] font-bold text-[#0a0a0a]"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-800" /> OT ({worker.overtime_hours || 0}h)
                    </button>

                    <button
                      onClick={() => setSelectedStaffForGoods(worker)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white rounded-xl text-[11px] font-bold"
                    >
                      <PackageCheck className="w-3.5 h-3.5" /> Assign Kit
                    </button>
                  </div>

                  {/* Allocated Goods & Tool Kits List */}
                  <div className="space-y-2 pt-2 border-t">
                    <span className="text-[11px] font-bold text-[#3a3a3a] uppercase tracking-wider block">
                      Allocated Goods & Tool Kits ({(worker.allocated_goods || []).length})
                    </span>

                    {(!worker.allocated_goods || worker.allocated_goods.length === 0) ? (
                      <p className="text-[11px] text-[#6a6a6a] italic">No equipment allocated yet.</p>
                    ) : (
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {worker.allocated_goods.map((item, idx) => {
                          const isObj = typeof item !== "string";
                          const title = isObj ? `${item.qty}x ${item.item}` : item;
                          const serial = isObj && item.serial ? item.serial : null;
                          const status = isObj ? item.status || "Issued" : "Issued";

                          return (
                            <div key={idx} className="flex items-center justify-between bg-[#fffaf0] p-2 rounded-xl border border-[#e5e5e5] text-xs">
                              <div>
                                <span className="font-semibold text-[#0a0a0a] block">{title}</span>
                                {serial && <span className="text-[10px] font-mono text-[#6a6a6a] block">SN: {serial}</span>}
                              </div>

                              <div className="flex items-center gap-1">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    status === "Returned"
                                      ? "bg-blue-100 text-blue-800"
                                      : status === "Damaged/Lost"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-emerald-100 text-emerald-800"
                                  }`}
                                >
                                  {status}
                                </span>

                                <select
                                  value={status}
                                  onChange={(e) => handleUpdateKitStatus(worker.id, idx, e.target.value)}
                                  className="bg-white border border-[#e5e5e5] text-[10px] font-bold rounded p-0.5"
                                >
                                  <option value="Issued">Issued</option>
                                  <option value="Returned">Returned</option>
                                  <option value="Damaged/Lost">Damaged</option>
                                </select>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Add Worker */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-[#e5e5e5] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-[#0a0a0a]">Add New Staff / Worker</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddWorker} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar / Priya Sharma"
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
                  placeholder="e.g. Master Chef / Stylist / Technician"
                  value={workerRole}
                  onChange={(e) => setWorkerRole(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Phone Number (WhatsApp)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210"
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
                  min="0"
                  value={workerWage}
                  onChange={(e) => setWorkerWage(parseFloat(e.target.value) || 0)}
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
                  Save Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Allocate Goods */}
      {selectedStaffForGoods && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-[#e5e5e5] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-[#0a0a0a]">Allocate Goods / Tools to {selectedStaffForGoods.name}</h3>
              <button onClick={() => setSelectedStaffForGoods(null)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAllocateGoodsSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Item / Tool Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bosch Drill / Salon Hair Dryer Kit"
                  value={goodsName}
                  onChange={(e) => setGoodsName(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={goodsQty}
                    onChange={(e) => setGoodsQty(parseFloat(e.target.value) || 1)}
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Serial / Asset #</label>
                  <input
                    type="text"
                    placeholder="e.g. SN-998811"
                    value={goodsSerial}
                    onChange={(e) => setGoodsSerial(e.target.value)}
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStaffForGoods(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-[#0a0a0a] rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={allocating}
                  className="flex-1 py-2.5 bg-[#0a0a0a] text-white rounded-xl text-xs font-bold"
                >
                  {allocating ? "Assigning..." : "Assign Equipment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Advance Salary */}
      {selectedStaffForAdvance && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-[#e5e5e5] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-[#0a0a0a]">Record Advance Salary for {selectedStaffForAdvance.name}</h3>
              <button onClick={() => setSelectedStaffForAdvance(null)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdvanceSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Advance Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStaffForAdvance(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-[#0a0a0a] rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-800 text-white rounded-xl text-xs font-bold"
                >
                  Record Advance ₹
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Overtime */}
      {selectedStaffForOT && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-[#e5e5e5] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-[#0a0a0a]">Record Overtime (OT) for {selectedStaffForOT.name}</h3>
              <button onClick={() => setSelectedStaffForOT(null)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOTSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3a3a3a] mb-1">OT Hours</label>
                  <input
                    type="number"
                    required
                    step="0.5"
                    min="0.5"
                    value={otHours}
                    onChange={(e) => setOtHours(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Rate (₹/hr)</label>
                  <input
                    type="number"
                    required
                    value={otRate}
                    onChange={(e) => setOtRate(parseFloat(e.target.value) || 100)}
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStaffForOT(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-[#0a0a0a] rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0a0a0a] text-white rounded-xl text-xs font-bold"
                >
                  Log OT Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
