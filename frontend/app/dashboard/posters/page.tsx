"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Image as ImageIcon, Sparkles, Download, Trash2, Plus, 
  Loader2, AlertCircle, CheckCircle, Smartphone, FileText, Square 
} from "lucide-react";
import { api } from "@/lib/api";
import { getPosterTemplate } from "@/templates/posters/registry";
import type { BusinessOut, PosterResponse } from "@/lib/types";

// Dynamic import for html-to-image to bypass Next.js SSR build errors
let htmlToImage: any = null;
if (typeof window !== "undefined") {
  import("html-to-image").then((mod) => {
    htmlToImage = mod;
  });
}

export default function PostersPage() {
  const [businesses, setBusinesses] = useState<BusinessOut[]>([]);
  const [posters, setPosters] = useState<PosterResponse[]>([]);
  
  const [selectedBizId, setSelectedBizId] = useState("");
  const [goal, setGoal] = useState("Promotion");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "9:16" | "A4">("1:1");
  const [promoDetails, setPromoDetails] = useState("");
  
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // References to poster DOM nodes for html-to-image capture
  const posterRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const [bizList, posterList] = await Promise.all([
          api.listBusinesses(),
          api.listPosters()
        ]);
        setBusinesses(bizList);
        setPosters(posterList);
        if (bizList.length > 0) {
          setSelectedBizId(bizList[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploadingLogo(true);
    try {
      const res = await api.uploadImage(file);
      setCustomLogoUrl(res.url);
    } catch (err) {
      setError("Failed to upload custom logo.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploadingImage(true);
    try {
      const res = await api.uploadImage(file);
      setCustomImageUrl(res.url);
    } catch (err) {
      setError("Failed to upload custom featured image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBizId) {
      setError("Please select a business profile first");
      return;
    }

    setError(null);
    setSuccess(null);
    setGenerating(true);

    try {
      const newPoster = await api.createPoster({
        business_id: selectedBizId,
        goal,
        aspect_ratio: aspectRatio,
        promo_details: promoDetails || undefined,
        logo_url: customLogoUrl || undefined,
        image_url: customImageUrl || undefined
      });
      setPosters((prev) => [...prev, newPoster]);
      setPromoDetails("");
      setCustomLogoUrl(null);
      setCustomImageUrl(null);
      setSuccess("Poster generated successfully by AI!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate poster");
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    setSuccess(null);
    setDeletingId(id);

    try {
      await api.deletePoster(id);
      setPosters((prev) => prev.filter((p) => p.id !== id));
      setSuccess("Poster deleted successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete poster");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (poster: PosterResponse) => {
    if (!htmlToImage) {
      setError("Download library still loading. Please retry in a second.");
      return;
    }

    setError(null);
    setDownloadingId(poster.id);
    const node = posterRefs.current[poster.id];
    
    if (!node) {
      setError("Could not locate poster rendering element");
      setDownloadingId(null);
      return;
    }

    try {
      // Export as high-density PNG (pixelRatio = 2 doubling the size for print clarity)
      const dataUrl = await htmlToImage.toPng(node, { 
        quality: 0.98,
        pixelRatio: 2,
        cacheBust: true
      });
      
      const link = document.createElement("a");
      link.download = `${poster.goal.toLowerCase()}-${poster.template_id}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError("Failed to convert layout to image format. Check browser permissions.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const selectedBiz = businesses.find((b) => b.id === selectedBizId);

  return (
    <div className="space-y-8 font-sans antialiased text-gray-900">
      {/* Header */}
      <div className="border-b border-[#EAEAE8] pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">AI Poster Generator</h1>
          <p className="text-xs text-gray-500 mt-1">Design print-ready marketing posters matched to your business criteria.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600">
          <span>Usage: {posters.length} / 2 Posters Generated</span>
        </div>
      </div>

      {/* Error & Success Toasts */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {businesses.length === 0 ? (
        <div className="bg-white border border-[#EAEAE8] rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-800">No Business Profiles Found</h3>
          <p className="text-xs text-gray-500">You must create a business profile before you can generate ad posters.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Form settings - Clay style */}
          <form onSubmit={handleGenerate} className="lg:col-span-4 bg-[#faf5e8] border border-[#e5e5e5] p-6 rounded-3xl shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-[#0a0a0a] border-b border-[#e5e5e5] pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff4d8b]" />
              <span>Poster Specifications</span>
            </h3>

            {/* Select Business */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-[#6a6a6a] tracking-wider font-mono">Business Profile</label>
              <select
                value={selectedBizId}
                onChange={(e) => setSelectedBizId(e.target.value)}
                className="w-full border border-[#e5e5e5] rounded-xl px-3.5 py-2 text-xs bg-[#fffaf0] text-[#0a0a0a] font-medium focus:outline-none"
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Select Goal */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-[#6a6a6a] tracking-wider font-mono">Poster Objective</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full border border-[#e5e5e5] rounded-xl px-3.5 py-2 text-xs bg-[#fffaf0] text-[#0a0a0a] font-medium focus:outline-none"
              >
                <option value="Promotion">Sales / Special Offer</option>
                <option value="Hiring">Job Hiring / Open Roles</option>
                <option value="Grand Opening">Grand Opening Celebration</option>
                <option value="Special Event">Seasonal Event Announcement</option>
              </select>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-[#6a6a6a] tracking-wider block font-mono">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "1:1", label: "Square", icon: Square },
                  { id: "9:16", label: "Story", icon: Smartphone },
                  { id: "A4", label: "Print A4", icon: FileText }
                ].map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setAspectRatio(r.id as any)}
                      className={`flex flex-col items-center gap-1.5 py-2.5 border rounded-xl text-[10px] font-semibold transition-all ${
                        aspectRatio === r.id 
                          ? "border-[#0a0a0a] bg-[#0a0a0a] text-white shadow-xs" 
                          : "border-[#e5e5e5] hover:border-[#0a0a0a] text-[#3a3a3a] bg-[#fffaf0]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional details */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-[#6a6a6a] tracking-wider font-mono">Offer / Details Input</label>
              <textarea
                value={promoDetails}
                onChange={(e) => setPromoDetails(e.target.value)}
                placeholder="e.g. 20% off all styling products this Saturday, hiring experienced hair stylist for flat wage..."
                rows={4}
                className="w-full border border-[#e5e5e5] rounded-xl p-3 text-xs bg-[#fffaf0] text-[#0a0a0a] font-medium focus:outline-none placeholder-gray-400"
              />
            </div>

            {/* Custom Logo Upload */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-[#6a6a6a] tracking-wider font-mono">Custom Poster Logo (Optional)</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="poster-logo-upload"
                  disabled={uploadingLogo}
                />
                <label
                  htmlFor="poster-logo-upload"
                  className="cursor-pointer border border-[#e5e5e5] hover:border-[#0a0a0a] rounded-xl px-3.5 py-2 text-xs font-semibold bg-[#fffaf0] text-[#0a0a0a] select-none flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  {uploadingLogo ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Choose Logo</span>
                  )}
                </label>
                {customLogoUrl && (
                  <span className="text-[10px] text-[#22c55e] font-bold">Uploaded ✓</span>
                )}
              </div>
            </div>

            {/* Custom Featured Image Upload */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-[#6a6a6a] tracking-wider font-mono">Custom Poster Photo (Optional)</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="poster-image-upload"
                  disabled={uploadingImage}
                />
                <label
                  htmlFor="poster-image-upload"
                  className="cursor-pointer border border-[#e5e5e5] hover:border-[#0a0a0a] rounded-xl px-3.5 py-2 text-xs font-semibold bg-[#fffaf0] text-[#0a0a0a] select-none flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  {uploadingImage ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Choose Photo</span>
                  )}
                </label>
                {customImageUrl && (
                  <span className="text-[10px] text-[#22c55e] font-bold">Uploaded ✓</span>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={generating || posters.length >= 2}
              className="w-full text-xs font-semibold uppercase tracking-wider bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white py-3 rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI Selection & Copywriting...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Generate Poster</span>
                </>
              )}
            </button>
          </form>

          {/* Posters Grid */}
          <div className="lg:col-span-8 space-y-6">
            {posters.length === 0 ? (
              <div className="bg-white border border-[#EAEAE8] rounded-2xl p-12 text-center text-gray-400 flex flex-col justify-center items-center min-h-[400px]">
                <ImageIcon className="w-12 h-12 text-gray-200 mb-2" />
                <h4 className="font-bold text-sm text-gray-600">No Generated Posters Yet</h4>
                <p className="text-xs text-gray-400 mt-1">Specify layout criteria on the left form to generate your first design.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {posters.map((poster) => {
                  const PosterTemplate = getPosterTemplate(poster.template_id);
                  const isDownloading = downloadingId === poster.id;
                  const isDeleting = deletingId === poster.id;

                  return (
                    <div key={poster.id} className="bg-white border border-[#EAEAE8] rounded-2xl p-4 shadow-xs space-y-4">
                      {/* Action Bar */}
                      <div className="flex justify-between items-center border-b pb-3">
                        <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold">
                          {poster.goal} &middot; {poster.aspect_ratio}
                        </span>
                        <div className="flex gap-2">
                          <button
                            disabled={isDownloading}
                            onClick={() => handleDownload(poster)}
                            className="p-2 bg-gray-50 border hover:bg-gray-100 text-gray-700 rounded-lg transition-all shadow-2xs"
                            title="Download PNG"
                          >
                            {isDownloading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            disabled={isDeleting}
                            onClick={() => handleDelete(poster.id)}
                            className="p-2 bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 rounded-lg transition-all shadow-2xs"
                            title="Delete Poster"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Poster Render Wrapper (This Node is captured by html-to-image) */}
                      <div className="flex justify-center bg-gray-50 p-2 rounded-xl overflow-auto border border-black/[0.03]">
                        <div ref={(el) => { posterRefs.current[poster.id] = el; }}>
                          {selectedBiz && (
                            <PosterTemplate 
                              business={selectedBiz} 
                              content={poster.content as any} 
                              aspect_ratio={poster.aspect_ratio} 
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
