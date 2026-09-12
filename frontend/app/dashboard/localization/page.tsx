"use client";

import { useState, useEffect } from "react";
import { Globe, Languages, Sparkles, CheckCircle2, RefreshCw } from "lucide-react";
import { API_URL } from "@/lib/api";

const AVAILABLE_LANGUAGES = [
  { code: "Hindi", label: "Hindi (हिन्दी)", flag: "🇮🇳" },
  { code: "Telugu", label: "Telugu (తెలుగు)", flag: "🇮🇳" },
  { code: "Tamil", label: "Tamil (தமிழ்)", flag: "🇮🇳" },
  { code: "Kannada", label: "Kannada (ಕನ್ನಡ)", flag: "🇮🇳" },
  { code: "Marathi", label: "Marathi (मराठी)", flag: "🇮🇳" },
  { code: "Bengali", label: "Bengali (বাংলা)", flag: "🇮🇳" },
  { code: "Malayalam", label: "Malayalam (മലയാളം)", flag: "🇮🇳" },
  { code: "Gujarati", label: "Gujarati (ગુજરાતી)", flag: "🇮🇳" },
  { code: "Spanish", label: "Spanish (Español)", flag: "🇪🇸" },
  { code: "French", label: "French (Français)", flag: "🇫🇷" },
];

export default function LocalizationDashboard() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedLangs, setSelectedLangs] = useState<string[]>(["Hindi", "Spanish"]);
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [translating, setTranslating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("Hindi");

  useEffect(() => {
    fetch(`${API_URL}/business`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setBusinesses(data);
        if (data.length > 0) {
          setSelectedId(data[0].id);
          fetchExistingTranslations(data[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchExistingTranslations = (bId: string) => {
    if (!bId) return;
    fetch(`${API_URL}/localization/translations/${bId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.translations) {
          setTranslations(data.translations);
          const keys = Object.keys(data.translations);
          if (keys.length > 0) setActiveTab(keys[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleToggleLang = (code: string) => {
    if (selectedLangs.includes(code)) {
      setSelectedLangs(selectedLangs.filter((l) => l !== code));
    } else {
      setSelectedLangs([...selectedLangs, code]);
    }
  };

  const handleRunTranslation = async () => {
    if (!selectedId || selectedLangs.length === 0 || translating) return;
    setTranslating(true);
    try {
      const res = await fetch(`${API_URL}/localization/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: selectedId,
          target_languages: selectedLangs,
        }),
      });
      const data = await res.json();
      if (data.translations) {
        setTranslations(data.translations);
        if (selectedLangs.length > 0) setActiveTab(selectedLangs[0]);
      }
    } catch (e) {
      console.error(e);
    }
    setTranslating(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm font-mono text-[#6a6a6a]">
        Loading Multi-Lingual AI Localizer...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#faf5e8] p-6 rounded-2xl border border-[#e5e5e5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#0a0a0a] mb-1">
            <Globe className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-serif font-bold tracking-tight">1-Click Multi-Lingual AI Localizer</h1>
          </div>
          <p className="text-xs text-[#6a6a6a]">
            Automatically translate your entire website, menu items, and copy into regional & global languages.
          </p>
        </div>

        {businesses.length > 0 && (
          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              fetchExistingTranslations(e.target.value);
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
        
        {/* Left 1 Column: Select Languages */}
        <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b pb-3">
            <Languages className="w-4 h-4 text-[#0a0a0a]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a]">
              Select Target Languages
            </h2>
          </div>

          <div className="space-y-2">
            {AVAILABLE_LANGUAGES.map((lang) => {
              const checked = selectedLangs.includes(lang.code);
              return (
                <div
                  key={lang.code}
                  onClick={() => handleToggleLang(lang.code)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    checked
                      ? "bg-[#faf5e8] border-[#0a0a0a] text-[#0a0a0a]"
                      : "bg-[#fffaf0] border-[#e5e5e5] text-[#3a3a3a] hover:border-gray-400"
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {}}
                    className="w-4 h-4 accent-[#0a0a0a]"
                  />
                </div>
              );
            })}
          </div>

          <button
            onClick={handleRunTranslation}
            disabled={translating || selectedLangs.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white rounded-xl font-semibold text-xs transition-all shadow-xs"
          >
            {translating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Translating with Groq...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" /> Translate Website Now
              </>
            )}
          </button>
        </div>

        {/* Right 2 Columns: Translation Output Desk */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a]">
              Generated Translation Dictionaries
            </h2>
            <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-bold">
              Floating Switcher Ready
            </span>
          </div>

          {Object.keys(translations).length === 0 ? (
            <div className="p-12 text-center text-xs text-[#6a6a6a] space-y-2">
              <Globe className="w-8 h-8 text-[#6a6a6a] mx-auto opacity-50" />
              <p>No translations generated yet. Select target languages on the left and click "Translate Website Now".</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Language Tabs */}
              <div className="flex items-center gap-2 border-b border-[#e5e5e5] pb-2 overflow-x-auto">
                {Object.keys(translations).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === lang
                        ? "bg-[#0a0a0a] text-white shadow-xs"
                        : "bg-[#fffaf0] text-[#3a3a3a] border border-[#e5e5e5] hover:bg-[#faf5e8]"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* Translation Content View */}
              {translations[activeTab] && (
                <div className="space-y-4 bg-[#fffaf0] p-4 rounded-xl border border-[#e5e5e5]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6a6a6a] block mb-1">
                      Translated Tagline
                    </span>
                    <p className="text-xs font-bold text-[#0a0a0a]">
                      {translations[activeTab].tagline || "N/A"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6a6a6a] block mb-1">
                      Translated Description
                    </span>
                    <p className="text-xs text-[#3a3a3a] leading-relaxed">
                      {translations[activeTab].description || "N/A"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6a6a6a] block mb-2">
                      Translated Items & Pricing ({translations[activeTab].items?.length || 0} items)
                    </span>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {translations[activeTab].items?.map((item: any, idx: number) => (
                        <div key={idx} className="p-3 bg-white rounded-xl border border-[#e5e5e5] flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-bold text-[#0a0a0a]">{item.name}</h4>
                            <p className="text-[11px] text-[#6a6a6a] mt-0.5">{item.description}</p>
                          </div>
                          <span className="text-xs font-mono font-bold text-[#0a0a0a]">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
