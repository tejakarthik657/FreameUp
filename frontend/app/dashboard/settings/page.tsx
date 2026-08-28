"use client";

import { useState } from "react";
import { Settings, Shield, Globe, Cpu, Check } from "lucide-react";

export default function SettingsPage() {
  const [model, setModel] = useState("qwen/qwen3.8-27b");
  const [baseDomain, setBaseDomain] = useState("localhost:3000");
  const [staticDeploy, setStaticDeploy] = useState("local-db");
  const [enableAI, setEnableAI] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  }

  return (
    <div className="max-w-xl space-y-8 font-sans antialiased text-gray-900">
      
      {/* Header */}
      <div className="border-b border-[#EAEAE8] pb-6">
        <h1 className="text-lg font-bold text-gray-900 tracking-tight">System Settings</h1>
        <p className="text-xs text-gray-500 mt-1">Configure global deployment attributes, domains, and AI configurations.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* API & AI Models */}
        <div className="bg-white border border-[#EAEAE8] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 font-mono">AI Model Engine</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono uppercase text-gray-400 tracking-wider block">Groq AI Inference Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full border border-[#E2E2DF] hover:border-gray-400 rounded-md px-3.5 py-2 text-xs bg-white text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all cursor-pointer"
            >
              <option value="qwen/qwen3.8-27b">Qwen 2.5 3.8-27B (JSON Mode)</option>
              <option value="qwen/qwen3.6-27b">Qwen 2.5 3.6-27B</option>
              <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Versatile)</option>
            </select>
            <p className="text-[10px] text-gray-400">Specifies the inference model used for field copy enhancement and menu structured parsing.</p>
          </div>

          {/* Toggle Autofill */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <h4 className="text-xs font-bold text-gray-800">Enable Field Autofill Buttons</h4>
              <p className="text-[10px] text-gray-400">Renders magic wand shortcuts next to form controls.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableAI}
                onChange={(e) => setEnableAI(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        {/* Domains & Hosting */}
        <div className="bg-white border border-[#EAEAE8] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 font-mono">Domains & Hosting</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono uppercase text-gray-400 tracking-wider block">Production Base Domain</label>
            <input
              type="text"
              value={baseDomain}
              onChange={(e) => setBaseDomain(e.target.value)}
              className="w-full border border-[#E2E2DF] hover:border-gray-400 rounded-md px-3.5 py-2 text-xs bg-white text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all"
            />
            <p className="text-[10px] text-gray-400">Configures the host suffix used for dynamic URL outputs and QR codes.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono uppercase text-gray-400 tracking-wider block">Static Export Target</label>
            <select
              value={staticDeploy}
              onChange={(e) => setStaticDeploy(e.target.value)}
              className="w-full border border-[#E2E2DF] hover:border-gray-400 rounded-md px-3.5 py-2 text-xs bg-white text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all cursor-pointer"
            >
              <option value="local-db">Local MongoDB Caching (Default)</option>
              <option value="cloudflare-r2">Cloudflare R2 Bucket</option>
              <option value="aws-s3">Amazon S3 Storage Bucket</option>
            </select>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between">
          <div>
            {saved && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold font-sans">
                <Check className="w-4 h-4" /> System settings updated!
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="text-xs font-semibold uppercase tracking-wider bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-md transition-all shadow-sm disabled:opacity-50"
          >
            {saving ? "Saving Configuration..." : "Save Settings"}
          </button>
        </div>

      </form>
    </div>
  );
}
