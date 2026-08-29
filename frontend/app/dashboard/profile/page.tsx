import { useState, useEffect } from "react";
import { User, Mail, Shield, Key, Check, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await api.getMe();
        setName(data.name || "Store Owner");
        setEmail(data.email || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSaving(true);
    try {
      await api.updateProfile({
        name,
        email,
        password: password || undefined,
      });
      setSaved(true);
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-8 font-sans antialiased text-gray-900">
      
      {/* Header */}
      <div className="border-b border-[#EAEAE8] pb-6">
        <h1 className="text-lg font-bold text-gray-900 tracking-tight">Account Profile</h1>
        <p className="text-xs text-gray-500 mt-1">Manage your administrator details and login credentials.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Profile Details Block */}
        <div className="bg-white border border-[#EAEAE8] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-4 border-b border-[#FAF9F6] pb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono uppercase text-gray-400 tracking-wider block">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[#E2E2DF] hover:border-gray-400 rounded-md pl-9 pr-3 py-2 text-xs bg-white text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono uppercase text-gray-400 tracking-wider block">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#E2E2DF] hover:border-gray-400 rounded-md pl-9 pr-3 py-2 text-xs bg-white text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

        </div>

        {/* Credentials / Password Block */}
        <div className="bg-white border border-[#EAEAE8] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 font-mono">Password Settings</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono uppercase text-gray-400 tracking-wider block">Change Password</label>
            <input
              type="password"
              placeholder="Enter new password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#E2E2DF] hover:border-gray-400 rounded-md px-3.5 py-2 text-xs bg-white text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono uppercase text-gray-400 tracking-wider block">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-[#E2E2DF] hover:border-gray-400 rounded-md px-3.5 py-2 text-xs bg-white text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between">
          <div>
            {error && (
              <span className="text-xs text-red-600 font-semibold font-sans">
                {error}
              </span>
            )}
            {saved && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold font-sans">
                <Check className="w-4 h-4" /> Changes saved successfully!
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="text-xs font-semibold uppercase tracking-wider bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-md transition-all shadow-sm disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Profile"}
          </button>
        </div>

      </form>
    </div>
  );
}
