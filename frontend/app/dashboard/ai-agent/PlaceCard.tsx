"use client";

import { useState } from "react";
import {
  Star,
  MapPin,
  Clock,
  Car,
  Footprints,
  Bike,
  Bookmark,
  Share2,
  Navigation,
  Check,
  X,
  Phone,
  Sparkles,
} from "lucide-react";
import type { RouteResponse } from "./mapServices";

interface PlaceCardProps {
  place: {
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
    category?: string;
    address?: string;
  };
  activeRoute: RouteResponse | null;
  onGetDirections: (mode: "driving" | "walking" | "cycling") => void;
  onClearDirections: () => void;
  onClose?: () => void;
}

export default function PlaceCard({
  place,
  activeRoute,
  onGetDirections,
  onClearDirections,
  onClose,
}: PlaceCardProps) {
  const [saved, setSaved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedMode, setSelectedMode] = useState<"driving" | "walking" | "cycling">("driving");

  const handleShare = () => {
    const text = `${place.name} - ★ ${place.rating || 4.5} | https://maps.google.com/?q=${place.lat},${place.lng}`;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDirectionsClick = (mode: "driving" | "walking" | "cycling") => {
    setSelectedMode(mode);
    onGetDirections(mode);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e5e5e5] shadow-lg p-5 space-y-4 font-sans animate-in fade-in duration-200">
      {/* Top Bar with Name & Close */}
      <div className="flex items-start justify-between border-b border-[#e5e5e5] pb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[9px] font-mono font-bold uppercase bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
              {place.category || "Commercial Place"}
            </span>
            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{place.rating || 4.5}</span>
            </span>
          </div>
          <h3 className="text-base font-bold text-[#0a0a0a] tracking-tight">{place.name}</h3>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
            <span>{place.address || "Local Commercial Area"} &bull; {place.price_tier || "₹₹"}</span>
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Opening Hours & Status */}
      <div className="flex items-center justify-between text-xs text-gray-600 bg-[#fffaf0] p-2.5 rounded-xl border border-[#e5e5e5]">
        <div className="flex items-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-700 font-bold">Open Now</span>
          <span className="text-gray-400">&bull; Closes 10:00 PM</span>
        </div>
        <span className="text-[10px] font-mono text-gray-400">{place.distance_km || 0.5} km away</span>
      </div>

      {/* Strengths / AI Hook */}
      {place.strengths && (
        <div className="text-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
            Why Customers Visit:
          </span>
          <p className="text-gray-700 bg-emerald-50/70 border border-emerald-100 p-2.5 rounded-xl leading-relaxed">
            {place.strengths}
          </p>
        </div>
      )}

      {/* Live OSRM Route Box if Active */}
      {activeRoute ? (
        <div className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-indigo-900">
                {activeRoute.mode === "walking" ? "Walking Route" : activeRoute.mode === "cycling" ? "Cycling Route" : "Driving Route"}
              </span>
            </div>
            <button
              onClick={onClearDirections}
              className="text-[10px] text-indigo-700 underline font-semibold"
            >
              Clear Route
            </button>
          </div>

          <div className="flex items-center justify-between text-indigo-950 font-bold pt-1">
            <span className="text-lg">{activeRoute.duration_mins} mins</span>
            <span className="text-sm font-mono">{activeRoute.distance_km} km</span>
          </div>
        </div>
      ) : null}

      {/* Directions Mode Buttons */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
          Get Live Directions (OSRM Engine):
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleDirectionsClick("driving")}
            className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
              selectedMode === "driving" && activeRoute
                ? "bg-[#0a0a0a] text-white shadow-xs"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-[#e5e5e5]"
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Drive</span>
          </button>

          <button
            onClick={() => handleDirectionsClick("walking")}
            className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
              selectedMode === "walking" && activeRoute
                ? "bg-[#0a0a0a] text-white shadow-xs"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-[#e5e5e5]"
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>Walk</span>
          </button>

          <button
            onClick={() => handleDirectionsClick("cycling")}
            className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
              selectedMode === "cycling" && activeRoute
                ? "bg-[#0a0a0a] text-white shadow-xs"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-[#e5e5e5]"
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Cycle</span>
          </button>
        </div>
      </div>

      {/* Save & Share Action Bar */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#e5e5e5]">
        <button
          onClick={() => setSaved(!saved)}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
            saved
              ? "bg-amber-500 text-white border-amber-500"
              : "bg-white text-gray-700 border-[#e5e5e5] hover:bg-gray-50"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>{saved ? "Saved" : "Save Place"}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#e5e5e5] bg-white text-gray-700 hover:bg-gray-50 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
