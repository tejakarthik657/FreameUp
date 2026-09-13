"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

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

interface CompetitorMapProps {
  center: { lat: number; lng: number; zoom?: number };
  userPin?: Competitor;
  competitors: Competitor[];
  selectedCompetitorId?: string | null;
  onSelectCompetitor: (comp: Competitor) => void;
}

export default function CompetitorMap({
  center,
  userPin,
  competitors,
  selectedCompetitorId,
  onSelectCompetitor,
}: CompetitorMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    // Dynamically import Leaflet to avoid SSR window errors
    import("leaflet").then((L) => {
      const container = mapContainerRef.current;
      if (!container) return;

      // Fix default Leaflet icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      if (!mapInstanceRef.current) {
        // Initialize Leaflet Map
        const map = L.map(container, {
          center: [center.lat, center.lng],
          zoom: center.zoom || 15,
          zoomControl: true,
          attributionControl: false, // Clean watermark-free UI
        });

        // Watermark-Free Clean CartoDB Voyager Tile Layer
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
          {
            maxZoom: 19,
            subdomains: "abcd",
          }
        ).addTo(map);

        mapInstanceRef.current = map;
      } else {
        mapInstanceRef.current.setView([center.lat, center.lng], center.zoom || 15, {
          animate: true,
        });
      }

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const map = mapInstanceRef.current;

      // Add User Business Pin (Gold / Emerald Marker)
      if (userPin) {
        const userIcon = L.divIcon({
          className: "custom-leaflet-user-pin",
          html: `<div class="bg-gradient-to-r from-amber-500 to-emerald-600 text-white font-bold text-[11px] px-3 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 animate-bounce">
                  <span>🏪</span>
                  <span>${userPin.name}</span>
                </div>`,
          iconSize: [140, 36],
          iconAnchor: [70, 36],
        });

        const uMarker = L.marker([userPin.lat, userPin.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup(`<b>${userPin.name}</b><br/><span class="text-xs text-gray-500">Your Business Location</span>`);
        markersRef.current.push(uMarker);
      }

      // Add Competitor Pins (Purple/Indigo Badges)
      competitors.forEach((comp) => {
        const isSelected = comp.id === selectedCompetitorId;
        const compIcon = L.divIcon({
          className: `custom-leaflet-comp-pin ${isSelected ? "z-50" : ""}`,
          html: `<div class="cursor-pointer transition-transform hover:scale-110 ${
            isSelected
              ? "bg-[#0a0a0a] text-white border-amber-400 scale-110 shadow-2xl"
              : "bg-white text-gray-900 border-indigo-600 shadow-md"
          } font-bold text-[10px] px-2.5 py-1 rounded-xl border-2 flex items-center gap-1.5">
                  <span class="text-amber-500 font-extrabold">★ ${comp.rating || "4.5"}</span>
                  <span class="truncate max-w-[90px]">${comp.name}</span>
                </div>`,
          iconSize: [120, 32],
          iconAnchor: [60, 32],
        });

        const cMarker = L.marker([comp.lat, comp.lng], { icon: compIcon })
          .addTo(map)
          .on("click", () => {
            onSelectCompetitor(comp);
          });

        markersRef.current.push(cMarker);
      });
    });
  }, [center, userPin, competitors, selectedCompetitorId, onSelectCompetitor]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-[#e5e5e5] shadow-xs">
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px] bg-slate-100 z-10" />

      {/* Map Overlay Badge */}
      <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur border border-[#e5e5e5] px-3 py-1.5 rounded-xl shadow-xs text-[10px] font-bold text-[#0a0a0a] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>CartoDB Ultra-Clean Indian Map • Watermark Free</span>
      </div>
    </div>
  );
}
