"use client";

import { useState, useEffect } from "react";
import { Bot, Send, Save, Plus, Trash2, CheckCircle2, MessageSquare, Sparkles } from "lucide-react";
import { API_URL } from "@/lib/api";

interface FAQ {
  q: string;
  a: string;
}

export default function AIAgentDashboard() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Agent Config
  const [tone, setTone] = useState<string>("friendly & professional");
  const [autoReply, setAutoReply] = useState<boolean>(true);
  const [greeting, setGreeting] = useState<string>("Hello! Welcome to our store. How can I help you today?");
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  // Simulator State
  const [simMessages, setSimMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [inputMsg, setInputMsg] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  useEffect(() => {
    fetch(`${API_URL}/business`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setBusinesses(data);
        if (data.length > 0) {
          setSelectedId(data[0].id);
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
          setTone(cfg.tone || "friendly & professional");
          setAutoReply(cfg.auto_responder_enabled ?? true);
          setGreeting(cfg.greeting_message || "Hello! Welcome to our store. How can I help you today?");
          setFaqs(cfg.custom_faqs || []);
        }
      });
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

  const handleSendMessage = async () => {
    if (!inputMsg.trim() || !selectedId || chatLoading) return;
    const userTxt = inputMsg;
    setInputMsg("");
    setSimMessages((prev) => [...prev, { sender: "user", text: userTxt }]);
    setChatLoading(true);

    try {
      const res = await fetch(`${API_URL}/ai-agent/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: selectedId,
          message: userTxt,
        }),
      });
      const data = await res.json();
      setSimMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (e) {
      setSimMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I am having trouble connecting right now." }]);
    }
    setChatLoading(false);
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
        Loading AI Assistant Desk...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#faf5e8] p-6 rounded-2xl border border-[#e5e5e5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#0a0a0a] mb-1">
            <Bot className="w-6 h-6" />
            <h1 className="text-2xl font-serif font-bold tracking-tight">24/7 AI Support & Booking Desk</h1>
          </div>
          <p className="text-xs text-[#6a6a6a]">
            Train your AI agent with menu, pricing, and custom FAQs to handle instant web & WhatsApp Q&A.
          </p>
        </div>

        {businesses.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#3a3a3a]">Active Business:</span>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-[#fffaf0] border border-[#e5e5e5] rounded-xl px-3 py-2 text-xs font-semibold text-[#0a0a0a] focus:outline-none"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Configuration */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a] border-b pb-3">
              Agent Knowledge & Behavior Settings
            </h2>

            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-bold text-[#3a3a3a] mb-2 uppercase tracking-wider">
                Conversation Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none"
              >
                <option value="friendly & professional">Friendly & Professional</option>
                <option value="luxury & elegant">Luxury & Elegant</option>
                <option value="casual & witty">Casual & Witty</option>
                <option value="direct & technical">Direct & Technical</option>
              </select>
            </div>

            {/* Auto Responder Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#fffaf0] rounded-xl border border-[#e5e5e5]">
              <div>
                <span className="block text-xs font-bold text-[#0a0a0a]">Enable Web & WhatsApp Auto-Responder</span>
                <span className="text-[11px] text-[#6a6a6a]">Allows AI to automatically reply to incoming visitor queries</span>
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
                Initial Welcome Greeting
              </label>
              <textarea
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                rows={2}
                className="w-full bg-[#fffaf0] border border-[#e5e5e5] rounded-xl p-3 text-xs font-medium focus:outline-none"
              />
            </div>

            {/* Custom FAQs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#3a3a3a] uppercase tracking-wider">
                  Custom FAQ Knowledge Base
                </label>
                <button
                  onClick={addFaq}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#0a0a0a] bg-[#faf5e8] hover:bg-[#e5e5e5] px-2.5 py-1 rounded-lg transition-all"
                >
                  <Plus className="w-3 h-3" /> Add FAQ
                </button>
              </div>

              {faqs.length === 0 ? (
                <p className="text-xs text-[#6a6a6a] italic">No custom FAQs added. Add questions like parking, reservations, or specialty items.</p>
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
                        placeholder="Question (e.g., Do you have parking?)"
                        value={faq.q}
                        onChange={(e) => updateFaq(i, "q", e.target.value)}
                        className="w-full bg-white border border-[#e5e5e5] rounded-lg px-2.5 py-1.5 text-xs font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Answer (e.g., Yes, free valet parking available behind building)"
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
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white rounded-xl font-semibold text-xs transition-all shadow-xs"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-400" /> Saved Knowledge Base!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save AI Configuration
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Live Interactive AI Simulator */}
        <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs flex flex-col h-[560px]">
          <div className="flex items-center justify-between pb-3 border-b border-[#e5e5e5] mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a]">
                Live Agent Simulator
              </h2>
            </div>
            <span className="text-[10px] font-mono bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">
              RAG Active
            </span>
          </div>

          {/* Chat Messages Window */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 bg-[#fffaf0] p-4 rounded-xl border border-[#e5e5e5]">
            <div className="bg-white p-3 rounded-xl border border-[#e5e5e5] text-xs max-w-[85%] text-[#0a0a0a]">
              <span className="font-bold block text-[10px] text-[#6a6a6a] mb-1">AI AGENT</span>
              {greeting}
            </div>

            {simMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col text-xs max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto items-end" : "items-start"
                }`}
              >
                <span className="font-bold text-[10px] text-[#6a6a6a] mb-0.5">
                  {msg.sender === "user" ? "YOU (VISITOR)" : "AI AGENT"}
                </span>
                <div
                  className={`p-3 rounded-xl border text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#0a0a0a] text-white border-[#0a0a0a]"
                      : "bg-white text-[#0a0a0a] border-[#e5e5e5]"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="text-[11px] font-mono text-[#6a6a6a] italic">
                AI Agent is thinking...
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="flex items-center gap-2 mt-4">
            <input
              type="text"
              placeholder="Ask a question (e.g. Do you have vegan pizza? Or I want to book a table)..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 bg-[#fffaf0] border border-[#e5e5e5] rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={chatLoading}
              className="p-2.5 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white rounded-xl transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
