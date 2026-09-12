"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, Send, Save, Plus, Trash2, CheckCircle2, MessageSquare, Sparkles, Volume2, Globe, Copy, Check } from "lucide-react";
import { API_URL } from "@/lib/api";

interface FAQ {
  q: string;
  a: string;
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

export default function AIAgentDashboard() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Agent Config
  const [tone, setTone] = useState<string>("Multilingual Indian Executive Concierge");
  const [autoReply, setAutoReply] = useState<boolean>(true);
  const [greeting, setGreeting] = useState<string>(
    "नमस्ते / Hello! Welcome to our store. How may I assist you today? (आप हिंदी, తెలుగు, தமிழ் या किसी भी भाषा में पूछ सकते हैं!)"
  );
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  // Simulator State
  const [simMessages, setSimMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [inputMsg, setInputMsg] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/business`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setBusinesses(data);
          if (data.length > 0) {
            setSelectedId(data[0].id);
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
      setSimMessages((prev) => [...prev, { sender: "bot", text: "नमस्ते! I am having trouble connecting right now. Please try again." }]);
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
        Loading Multilingual AI Intelligent Assistant...
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
            <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">Multilingual AI Intelligent Master Agent</h1>
          </div>
          <p className="text-xs text-[#6a6a6a] leading-relaxed">
            Auto-detects and chats natively in all Indian languages (Hindi, Telugu, Tamil, Kannada, Marathi, Hinglish, etc.) to manage customer Q&A and bookings.
          </p>
        </div>

        {safeBizList.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#3a3a3a] hidden sm:inline">Active Business:</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
        
        {/* Left Column: Business Owner Training Desk */}
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

            {/* Persona Preset */}
            <div>
              <label className="block text-xs font-bold text-[#3a3a3a] mb-2 uppercase tracking-wider">
                Persona Style
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
              >
                <option value="Multilingual Indian Executive Concierge">Multilingual Indian Executive Concierge</option>
                <option value="Friendly Desi Shopkeeper (विदेशी & देशी)">Friendly Desi Hospitality (गर्मजोशी से स्वागत)</option>
                <option value="Luxury Hospitality Director">Luxury VIP Service Advisor</option>
              </select>
            </div>

            {/* Auto Responder Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#fffaf0] rounded-xl border border-[#e5e5e5]">
              <div>
                <span className="block text-xs font-bold text-[#0a0a0a]">Enable Web & WhatsApp Auto-Responder</span>
                <span className="text-[11px] text-[#6a6a6a]">AI replies automatically to visitor messages in their language</span>
              </div>
              <input
                type="checkbox"
                checked={autoReply}
                onChange={(e) => setAutoReply(e.target.checked)}
                className="w-4 h-4 accent-[#0a0a0a] cursor-pointer"
              />
            </div>

            {/* Greeting */}
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

            {/* Custom FAQs */}
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
                <p className="text-xs text-[#6a6a6a] italic">No custom FAQs added. Add questions about parking, specialty items, or booking rules.</p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {faqs.map((faq, i) => (
                    <div key={i} className="p-3 bg-[#fffaf0] rounded-xl border border-[#e5e5e5] space-y-2 relative">
                      <button
                        onClick={() => removeFaq(i)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="text"
                        placeholder="Question (e.g., क्या पार्किंग उपलब्ध है? / Is parking available?)"
                        value={faq.q}
                        onChange={(e) => updateFaq(i, "q", e.target.value)}
                        className="w-full bg-white border border-[#e5e5e5] rounded-lg px-2.5 py-1.5 text-xs font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Answer (e.g., हाँ, निःशुल्क पार्किंग उपलब्ध है / Yes, free valet parking)"
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

        {/* Right Column: Live Interactive Multilingual AI Simulator */}
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

          {/* Indian Language Suggestion Test Pills */}
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

          {/* Chat Messages Window */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto space-y-3 pr-2 bg-[#fffaf0] p-4 rounded-xl border border-[#e5e5e5]"
          >
            {/* Initial Welcome */}
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
                    {copiedIndex === i ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
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

          {/* Chat Input Bar */}
          <div className="flex items-center gap-2 mt-3">
            <input
              type="text"
              placeholder="Ask in Hindi, Telugu, Tamil, English... (उदा: आज का स्पेशल क्या है?)"
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
    </div>
  );
}
