"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Bot,
  Send,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Volume2,
  Globe,
  Copy,
  Check,
  MapPin,
  Search,
  TrendingUp,
  Award,
  Zap,
  Target,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { API_URL } from "@/lib/api";

// Dynamic import of Leaflet map component to prevent SSR window reference error
const CompetitorMap = dynamic(() => import("./CompetitorMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] bg-slate-100 rounded-2xl border border-[#e5e5e5] flex flex-col items-center justify-center text-xs font-mono text-gray-500 gap-2">
      <div className="w-6 h-6 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
      <span>Loading Watermark-Free Leaflet Indian Map...</span>
    </div>
  ),
});

interface FAQ {
  q: string;
  a: string;
}

interface Competitor {
  id: string;
  name: string;
  rating?: number;
  price_tier?: string;
  distance_km?: number;
  lat: number;
  lng: number;
  strengths?: string;
  weaknesses?: string;
  customer_hook?: string;
  is_user?: boolean;
}

const INDIAN_LANG_PILLS = [
  { label: "Hindi (हिन्दी)", sample: "आपकी दुकान कब खुलती है?" },
  { label: "Telugu (తెలుగు)", sample: "ఈ రోజు ప్రత్యేకతలు ఏమిటి?" },
  { label: "Tamil (தமிழ்)", sample: "முகவரி எங்கே உள்ளது?" },
  { label: "Kannada (ಕನ್ನಡ)", sample: "ಬುಕಿಂಗ್ ಮಾಡುವುದು ಹೇಗೆ?" },
  { label: "Marathi (मराठी)", sample: "तुमचे दर काय आहेत?" },
  { label: "Hinglish", sample: "Today kya discount hai bhai?" },
  { label: "English", sample: "Can I book a table for 2 people tonight?" },
];

const INDIAN_STATES_DISTRICTS: Record<string, string[]> = {
  Maharashtra: ["Mumbai Suburban", "Mumbai City", "Pune", "Thane", "Nagpur", "Nashik"],
  Telangana: ["Hyderabad", "Rangareddy", "Medchal", "Warangal"],
  Karnataka: ["Bengaluru Urban", "Mysuru", "Mangaluru", "Hubballi"],
  "Delhi NCR": ["New Delhi", "South Delhi", "Gurugram", "Noida"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  "West Bengal": ["Kolkata", "Howrah", "North 24 Parganas"],
  "Uttar Pradesh": ["Lucknow", "Noida", "Kanpur", "Varanasi"],
  Rajasthan: ["Jaipur", "Udaipur", "Jodhpur"],
  Punjab: ["Ludhiana", "Amritsar", "Chandigarh"],
};

export default function AIAgentDashboard() {
  const [activeTab, setActiveTab] = useState<"assistant" | "competitor_map">("assistant");

  // Businesses State
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Agent Config State
  const [tone, setTone] = useState<string>("Multilingual Indian Executive Concierge");
  const [autoReply, setAutoReply] = useState<boolean>(true);
  const [greeting, setGreeting] = useState<string>(
    "नमस्ते / Hello! Welcome to our store. How may I assist you today? (आप हिंदी, తెలుగు, தமிழ் या किसी भी भाषा में पूछ सकते हैं!)"
  );
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  // Chat Simulator State
  const [simMessages, setSimMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [inputMsg, setInputMsg] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Competitor Intelligence Map State
  const [selectedState, setSelectedState] = useState<string>("Maharashtra");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Mumbai Suburban");
  const [locality, setLocality] = useState<string>("Bandra West");
  const [category, setCategory] = useState<string>("restaurant");

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number; zoom: number }>({
    lat: 19.0596,
    lng: 72.8295,
    zoom: 15,
  });
  const [userPin, setUserPin] = useState<Competitor | undefined>(undefined);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [selectedComp, setSelectedComp] = useState<Competitor | null>(null);
  const [marketSummary, setMarketSummary] = useState<string>("");
  const [whyCompetitorsWin, setWhyCompetitorsWin] = useState<string>("");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [mapLoading, setMapLoading] = useState<boolean>(false);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/business`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setBusinesses(data);
          if (data.length > 0) {
            setSelectedId(data[0].id);
            if (data[0].category) setCategory(data[0].category);
          }
        } else {
          setBusinesses([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    fetch(`${API_URL}/ai-agent/config/${selectedId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((cfg) => {
        if (cfg) {
          setTone(cfg.tone || "Multilingual Indian Executive Concierge");
          setAutoReply(cfg.auto_responder_enabled ?? true);
          setGreeting(
            cfg.greeting_message ||
              "नमस्ते / Hello! Welcome to our store. How may I assist you today? (आप हिंदी, తెలుగు, தமிழ் या किसी भी भाषा में पूछ सकते हैं!)"
          );
          setFaqs(Array.isArray(cfg.custom_faqs) ? cfg.custom_faqs : []);
        }
      });
  }, [selectedId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [simMessages, chatLoading]);

  // Run AI Competitor Intelligence Analysis
  const fetchCompetitorIntelligence = async () => {
    setMapLoading(true);
    try {
      const res = await fetch(`${API_URL}/ai-agent/competitor-intelligence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: selectedId,
          state: selectedState,
          district: selectedDistrict,
          locality: locality,
          category: category,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMapCenter(data.center);
        setUserPin(data.user_pin);
        setCompetitors(data.competitors || []);
        if (data.competitors && data.competitors.length > 0) {
          setSelectedComp(data.competitors[0]);
        }
        setMarketSummary(data.market_summary || "");
        setWhyCompetitorsWin(data.why_competitors_win || "");
        setRecommendations(data.actionable_recommendations || []);
      }
    } catch (e) {
      console.error("Competitor intelligence fetch failed:", e);
    }
    setMapLoading(false);
  };

  useEffect(() => {
    fetchCompetitorIntelligence();
  }, [selectedId]);

  const handleSaveConfig = async () => {
    if (!selectedId) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/ai-agent/config/${selectedId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tone,
          auto_responder_enabled: autoReply,
          greeting_message: greeting,
          custom_faqs: faqs,
        }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleSendMessage = async (msgToSend?: string) => {
    const textToUse = msgToSend || inputMsg;
    if (!textToUse.trim() || !selectedId || chatLoading) return;

    setInputMsg("");
    setSimMessages((prev) => [...prev, { sender: "user", text: textToUse }]);
    setChatLoading(true);

    try {
      const res = await fetch(`${API_URL}/ai-agent/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: selectedId,
          message: textToUse,
        }),
      });
      const data = await res.json();
      setSimMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (e) {
      setSimMessages((prev) => [
        ...prev,
        { sender: "bot", text: "नमस्ते! I am having trouble connecting right now. Please try again." },
      ]);
    }
    setChatLoading(false);
  };

  const copyText = (txt: string, idx: number) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(txt);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  };

  const addFaq = () => setFaqs([...faqs, { q: "", a: "" }]);
  const removeFaq = (idx: number) => setFaqs(faqs.filter((_, i) => i !== idx));
  const updateFaq = (idx: number, field: "q" | "a", val: string) => {
    const updated = [...faqs];
    updated[idx][field] = val;
    setFaqs(updated);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm font-mono text-[#6a6a6a]">
        Loading Multilingual AI Intelligent Assistant & Map Agent...
      </div>
    );
  }

  const safeBizList = Array.isArray(businesses) ? businesses : [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 font-sans px-1 sm:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#faf5e8] p-5 sm:p-6 rounded-2xl border border-[#e5e5e5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#0a0a0a] mb-1">
            <Bot className="w-6 h-6 text-indigo-700" />
            <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
              AI Intelligent Operations & Market Master
            </h1>
          </div>
          <p className="text-xs text-[#6a6a6a] leading-relaxed">
            Native Indian language Auto-Responder + Watermark-Free Leaflet Competitor Intelligence Map for hyper-local business strategy.
          </p>
        </div>

        {safeBizList.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#3a3a3a] hidden sm:inline">Active Store:</span>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-[#fffaf0] border border-[#e5e5e5] rounded-xl px-3 py-2 text-xs font-semibold text-[#0a0a0a] focus:outline-none w-full sm:w-auto"
            >
              {safeBizList.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e5e5e5] pb-2">
        <button
          onClick={() => setActiveTab("assistant")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "assistant"
              ? "bg-[#0a0a0a] text-white shadow-xs"
              : "bg-[#faf5e8] text-[#3a3a3a] hover:bg-[#e5e5e5]"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Multilingual AI Assistant & Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab("competitor_map")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "competitor_map"
              ? "bg-[#0a0a0a] text-white shadow-xs"
              : "bg-[#faf5e8] text-[#3a3a3a] hover:bg-[#e5e5e5]"
          }`}
        >
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>🇮🇳 Hyper-Local Competitor Intelligence Map</span>
        </button>
      </div>

      {/* TAB 1: MULTILINGUAL AI ASSISTANT & SIMULATOR */}
      {activeTab === "assistant" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Left Column: Knowledge Base Settings */}
          <div className="space-y-6">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0a0a0a]">
                  AI Agent Knowledge & Language Settings
                </h2>
                <span className="text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  🇮🇳 All Indian Languages Supported
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-2 uppercase tracking-wider">
                  Persona Style
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                >
                  <option value="Multilingual Indian Executive Concierge">
                    Multilingual Indian Executive Concierge
                  </option>
                  <option value="Friendly Desi Shopkeeper (विदेशी & देशी)">
                    Friendly Desi Hospitality (गर्मजोशी से स्वागत)
                  </option>
                  <option value="Luxury Hospitality Director">Luxury VIP Service Advisor</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#fffaf0] rounded-xl border border-[#e5e5e5]">
                <div>
                  <span className="block text-xs font-bold text-[#0a0a0a]">
                    Enable Web & WhatsApp Auto-Responder
                  </span>
                  <span className="text-[11px] text-[#6a6a6a]">
                    AI replies automatically to visitor messages in their native language
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoReply}
                  onChange={(e) => setAutoReply(e.target.checked)}
                  className="w-4 h-4 accent-[#0a0a0a] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] mb-2 uppercase tracking-wider">
                  Welcome Message / स्वागत संदेश
                </label>
                <textarea
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  rows={2}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-3 text-xs font-medium focus:outline-none leading-relaxed"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#3a3a3a] uppercase tracking-wider">
                    Custom Brand FAQs (प्रश्न & उत्तर)
                  </label>
                  <button
                    onClick={addFaq}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#0a0a0a] bg-[#faf5e8] hover:bg-[#e5e5e5] px-2.5 py-1 rounded-lg transition-all"
                  >
                    <Plus className="w-3 h-3" /> Add FAQ
                  </button>
                </div>

                {faqs.length === 0 ? (
                  <p className="text-xs text-[#6a6a6a] italic">
                    No custom FAQs added. Add questions about parking, specialty items, or booking rules.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {faqs.map((faq, i) => (
                      <div
                        key={i}
                        className="p-3 bg-[#fffaf0] rounded-xl border border-[#e5e5e5] space-y-2 relative"
                      >
                        <button
                          onClick={() => removeFaq(i)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="text"
                          placeholder="Question (e.g., क्या पार्किंग उपलब्ध है?)"
                          value={faq.q}
                          onChange={(e) => updateFaq(i, "q", e.target.value)}
                          className="w-full bg-white border border-[#e5e5e5] rounded-lg px-2.5 py-1.5 text-xs font-medium"
                        />
                        <input
                          type="text"
                          placeholder="Answer (e.g., हाँ, निःशुल्क पार्किंग उपलब्ध है)"
                          value={faq.a}
                          onChange={(e) => updateFaq(i, "a", e.target.value)}
                          className="w-full bg-white border border-[#e5e5e5] rounded-lg px-2.5 py-1.5 text-xs font-medium"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSaveConfig}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white rounded-xl font-semibold text-xs transition-all shadow-xs"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-400" /> Saved Multilingual Knowledge Base!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save AI Configuration
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Native Chat Simulator */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e5e5e5] shadow-xs flex flex-col h-[580px]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e5e5] mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0a0a0a]">
                  Live Native Chat Simulator
                </h2>
              </div>
              <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
                Groq RAG + Multilingual Active
              </span>
            </div>

            <div className="mb-3 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {INDIAN_LANG_PILLS.map((pill, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(pill.sample)}
                  className="px-2.5 py-1 bg-[#fffaf0] hover:bg-[#faf5e8] border border-[#e5e5e5] rounded-full text-[10px] font-bold text-[#0a0a0a] shrink-0 transition-all"
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto space-y-3 pr-2 bg-[#fffaf0] p-4 rounded-xl border border-[#e5e5e5]"
            >
              <div className="bg-white p-3.5 rounded-2xl border border-[#e5e5e5] text-xs max-w-[90%] text-[#0a0a0a] space-y-1 shadow-2xs">
                <span className="font-bold block text-[10px] text-[#6a6a6a]">AI MASTER AGENT 🇮🇳</span>
                <p className="leading-relaxed">{greeting}</p>
              </div>

              {simMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col text-xs max-w-[88%] ${
                    msg.sender === "user" ? "ml-auto items-end" : "items-start"
                  }`}
                >
                  <span className="font-bold text-[9px] text-[#6a6a6a] mb-0.5 uppercase tracking-wider">
                    {msg.sender === "user" ? "VISITOR / ग्राहक" : "AI MASTER AGENT 🇮🇳"}
                  </span>
                  <div
                    className={`p-3.5 rounded-2xl border text-xs leading-relaxed relative group ${
                      msg.sender === "user"
                        ? "bg-[#0a0a0a] text-white border-[#0a0a0a] rounded-tr-none"
                        : "bg-white text-[#0a0a0a] border-[#e5e5e5] rounded-tl-none shadow-2xs"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <button
                      onClick={() => copyText(msg.text, i)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-black transition-opacity"
                      title="Copy message"
                    >
                      {copiedIndex === i ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="text-[11px] font-mono text-[#6a6a6a] italic flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
                  <span>AI Master Agent is generating native response...</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-3">
              <input
                type="text"
                placeholder="Ask in Hindi, Telugu, Tamil, English..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 bg-[#fffaf0] border border-[#e5e5e5] rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={chatLoading}
                className="p-2.5 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white rounded-xl transition-all shadow-xs shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HYPER-LOCAL COMPETITOR INTELLIGENCE LEAFLET MAP */}
      {activeTab === "competitor_map" && (
        <div className="space-y-6">
          {/* Top Indian Geographic Filter Toolbar */}
          <div className="bg-white p-5 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e5e5] pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a]">
                  Indian District & Market Locality Filter
                </h2>
              </div>

              <button
                onClick={fetchCompetitorIntelligence}
                disabled={mapLoading}
                className="inline-flex items-center gap-2 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs disabled:opacity-50"
              >
                {mapLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing Market...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Run AI Market Audit</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* State Filter */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6a6a6a] mb-1">
                  State / Territory
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    const districts = INDIAN_STATES_DISTRICTS[e.target.value] || [];
                    if (districts.length > 0) setSelectedDistrict(districts[0]);
                  }}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl px-3 py-2 text-xs font-semibold text-[#0a0a0a] focus:outline-none"
                >
                  {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Filter */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6a6a6a] mb-1">
                  Commercial District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl px-3 py-2 text-xs font-semibold text-[#0a0a0a] focus:outline-none"
                >
                  {(INDIAN_STATES_DISTRICTS[selectedState] || []).map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Locality Market Search Input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6a6a6a] mb-1">
                  Locality / Bazaar Market
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Bandra West, Jubilee Hills..."
                    className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl pl-8 pr-3 py-2 text-xs font-semibold text-[#0a0a0a] focus:outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6a6a6a] mb-1">
                  Industry Segment
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl px-3 py-2 text-xs font-semibold text-[#0a0a0a] focus:outline-none capitalize"
                >
                  <option value="restaurant">Restaurant & Food</option>
                  <option value="salon">Salon & Beauty Parlour</option>
                  <option value="local_services">Home & Local Services</option>
                </select>
              </div>
            </div>
          </div>

          {/* Leaflet Map + Competitor AI Strategy Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left 2 Columns: Watermark-Free Leaflet Map */}
            <div className="lg:col-span-2 space-y-4">
              <div className="h-[460px] w-full">
                <CompetitorMap
                  center={mapCenter}
                  userPin={userPin}
                  competitors={competitors}
                  selectedCompetitorId={selectedComp?.id}
                  onSelectCompetitor={(comp) => setSelectedComp(comp)}
                />
              </div>

              {/* Quick Competitor Badge Strip */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <span className="text-[10px] font-bold uppercase text-gray-400 shrink-0">Competitors Found:</span>
                {competitors.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedComp(comp)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                      selectedComp?.id === comp.id
                        ? "bg-[#0a0a0a] text-white border-[#0a0a0a] shadow-xs"
                        : "bg-white text-gray-700 border-[#e5e5e5] hover:bg-[#faf5e8]"
                    }`}
                  >
                    <span className="text-amber-500 font-extrabold">★ {comp.rating}</span>
                    <span>{comp.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Selected Competitor Profile & AI Strategic Recommendations */}
            <div className="space-y-5">
              {/* Selected Competitor Card */}
              {selectedComp ? (
                <div className="bg-white p-5 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-4">
                  <div className="flex items-start justify-between border-b border-[#e5e5e5] pb-3">
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                        Competitor Profile
                      </span>
                      <h3 className="text-base font-bold text-[#0a0a0a] mt-1">{selectedComp.name}</h3>
                      <p className="text-[11px] text-gray-500">{locality}, {selectedDistrict}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-amber-600 block">★ {selectedComp.rating || 4.5}</span>
                      <span className="text-[10px] font-mono text-gray-400">{selectedComp.price_tier || "₹₹"} &bull; {selectedComp.distance_km || 0.5}km away</span>
                    </div>
                  </div>

                  {/* Why they win */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-emerald-800 block text-[11px] uppercase tracking-wider">
                        Key Advantage ("Why Customers Choose Them"):
                      </span>
                      <p className="text-gray-700 bg-emerald-50/60 border border-emerald-100 p-2.5 rounded-xl leading-relaxed mt-1">
                        {selectedComp.strengths}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-rose-800 block text-[11px] uppercase tracking-wider">
                        Market Weakness ("Where They Lag"):
                      </span>
                      <p className="text-gray-700 bg-rose-50/60 border border-rose-100 p-2.5 rounded-xl leading-relaxed mt-1">
                        {selectedComp.weaknesses}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#faf5e8] p-6 rounded-2xl border border-[#e5e5e5] text-center text-xs text-gray-500 font-medium">
                  Click any competitor pin on the Leaflet map to view their strengths and customer hook.
                </div>
              )}

              {/* Actionable AI Counter-Strategy ("What to Make Us Better") */}
              <div className="bg-[#faf5e8] p-5 rounded-2xl border border-amber-300 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-amber-200 pb-3">
                  <Zap className="w-5 h-5 text-amber-700" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950">
                    Groq AI Counter-Play: What Makes Us Better
                  </h3>
                </div>

                {marketSummary && (
                  <p className="text-xs text-amber-900 leading-relaxed font-medium bg-amber-100/50 p-3 rounded-xl border border-amber-200">
                    {marketSummary}
                  </p>
                )}

                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                    Actionable Winning Moves for {locality}:
                  </span>

                  {recommendations.length === 0 ? (
                    <div className="text-xs text-amber-800 italic">Click "Run AI Market Audit" to generate winning recommendations.</div>
                  ) : (
                    recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded-xl border border-amber-200 text-xs font-medium text-[#0a0a0a] flex items-start gap-2 shadow-2xs"
                      >
                        <Target className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{rec}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
