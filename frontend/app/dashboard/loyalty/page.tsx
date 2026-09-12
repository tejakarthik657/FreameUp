"use client";

import { useState, useEffect } from "react";
import { Gift, Award, Share2, Plus, Sparkles, CheckCircle2, Phone, QrCode } from "lucide-react";
import { API_URL } from "@/lib/api";

interface Pass {
  id: string;
  business_id: string;
  customer_name: string;
  customer_phone: string;
  punches: number;
  rewards_earned: number;
  last_punch: string;
}

export default function LoyaltyDashboard() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [passes, setPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Punch modal state
  const [phoneInput, setPhoneInput] = useState<string>("");
  const [nameInput, setNameInput] = useState<string>("");
  const [punchMessage, setPunchMessage] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);

  // Referral state
  const [refPhone, setRefPhone] = useState<string>("");
  const [friendPhone, setFriendPhone] = useState<string>("");
  const [createdRefUrl, setCreatedRefUrl] = useState<string>("");

  useEffect(() => {
    fetch(`${API_URL}/business`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setBusinesses(data);
        if (data.length > 0) {
          setSelectedId(data[0].id);
          fetchPasses(data[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchPasses = (bId: string) => {
    if (!bId) return;
    fetch(`${API_URL}/loyalty/passes/${bId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setPasses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handlePunchCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || !selectedId || processing) return;
    setProcessing(true);
    try {
      const res = await fetch(`${API_URL}/loyalty/punch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: selectedId,
          customer_phone: phoneInput,
          customer_name: nameInput || "Valued Customer",
        }),
      });
      const data = await res.json();
      setPunchMessage(data.message);
      setPhoneInput("");
      setNameInput("");
      fetchPasses(selectedId);
    } catch (e) {
      console.error(e);
    }
    setProcessing(false);
  };

  const handleCreateReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refPhone || !friendPhone || !selectedId) return;
    try {
      const res = await fetch(`${API_URL}/loyalty/referral`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: selectedId,
          referrer_phone: refPhone,
          friend_phone: friendPhone,
        }),
      });
      const data = await res.json();
      if (data.whatsapp_share_url) {
        setCreatedRefUrl(data.whatsapp_share_url);
        window.open(data.whatsapp_share_url, "_blank");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm font-mono text-[#6a6a6a]">
        Loading Digital Loyalty Desk...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#faf5e8] p-6 rounded-2xl border border-[#e5e5e5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#0a0a0a] mb-1">
            <Gift className="w-6 h-6 text-amber-600" />
            <h1 className="text-2xl font-serif font-bold tracking-tight">Digital Loyalty & Referral Rewards Engine</h1>
          </div>
          <p className="text-xs text-[#6a6a6a]">
            Digital punch cards (phone & QR check-in) and referral reward passes to turn visitors into repeat regulars.
          </p>
        </div>

        {businesses.length > 0 && (
          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              fetchPasses(e.target.value);
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Punch Check-in & Referral Form */}
        <div className="space-y-6">
          
          {/* Quick Punch Terminal */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <QrCode className="w-4 h-4 text-[#0a0a0a]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a]">
                Customer Counter Check-in
              </h2>
            </div>

            <form onSubmit={handlePunchCheckin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Customer Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+91 9876543210"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Customer Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Roy"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-3 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                {processing ? "Recording Punch..." : "Record Digital Punch"}
              </button>

              {punchMessage && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 text-center animate-pulse">
                  {punchMessage}
                </div>
              )}
            </form>
          </div>

          {/* Referral Pass Dispatcher */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <Share2 className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a]">
                Dispatch WhatsApp Referral
              </h2>
            </div>

            <form onSubmit={handleCreateReferral} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Referrer Phone</label>
                <input
                  type="text"
                  required
                  placeholder="+91 9876543210"
                  value={refPhone}
                  onChange={(e) => setRefPhone(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-1">Friend Phone</label>
                <input
                  type="text"
                  required
                  placeholder="+91 9123456789"
                  value={friendPhone}
                  onChange={(e) => setFriendPhone(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Share Referral on WhatsApp
              </button>
            </form>
          </div>

        </div>

        {/* Right 2 Columns: Active Digital Loyalty Pass Tracker */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a]">
              Active Customer Passes ({passes.length})
            </h2>
            <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">
              5-Punch Goal
            </span>
          </div>

          {passes.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#6a6a6a] space-y-2">
              <Award className="w-8 h-8 text-[#6a6a6a] mx-auto opacity-50" />
              <p>No active customer passes yet. Record a check-in on the left to start issuing digital punch cards!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {passes.map((p) => (
                <div key={p.id} className="bg-[#fffaf0] p-5 rounded-2xl border border-[#e5e5e5] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-[#0a0a0a]">{p.customer_name}</h3>
                      <span className="text-[10px] font-mono text-[#6a6a6a]">{p.customer_phone}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-700 block">
                        🏆 {p.rewards_earned} Rewards Earned
                      </span>
                    </div>
                  </div>

                  {/* 5-Stamp Visual Tracker */}
                  <div className="flex items-center justify-between gap-1 pt-1">
                    {[1, 2, 3, 4, 5].map((stamp) => {
                      const isStamped = stamp <= p.punches;
                      return (
                        <div
                          key={stamp}
                          className={`flex-1 h-10 rounded-xl border flex items-center justify-center text-xs font-bold transition-all ${
                            isStamped
                              ? "bg-[#0a0a0a] text-white border-[#0a0a0a] shadow-xs"
                              : "bg-white text-[#6a6a6a] border-[#e5e5e5]"
                          }`}
                        >
                          {isStamped ? "✓" : stamp}
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-[10px] text-[#6a6a6a] font-mono flex justify-between pt-1">
                    <span>Punches: {p.punches}/5</span>
                    <span>Last check-in: {new Date(p.last_punch).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
