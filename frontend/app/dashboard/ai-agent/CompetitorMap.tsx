"use client";

import { useEffect, useRef, useState } from "react";
import { Navigation, ZoomIn, ZoomOut, Maximize2, Layers, Compass } from "lucide-react";
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

type LayerOption = "voyager" | "positron" | "dark" | "osm";

export default function CompetitorMap({
  center,
  userPin,
  competitors,
  selectedCompetitorId,
  onSelectCompetitor,
}: CompetitorMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userGpsMarkerRef = useRef<any>(null);

  const [activeLayer, setActiveLayer] = useState<LayerOption>("voyager");
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY || "cb1_3kfc_1_768d5315273affdf9aea07d2";

  const LAYER_URLS: Record<LayerOption, { url: string; subdomains: string; maxZoom: number }> = {
    voyager: {
      url: `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${cartoKey}`,
      subdomains: "abcd",
      maxZoom: 20,
    },
    positron: {
      url: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key=${cartoKey}`,
      subdomains: "abcd",
      maxZoom: 20,
    },
    dark: {
      url: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${cartoKey}`,
      subdomains: "abcd",
      maxZoom: 20,
    },
    osm: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      subdomains: "abc",
      maxZoom: 19,
    },
  };

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

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
        // Initialize Leaflet Map with smooth interaction & no default zoom control
        const map = L.map(container, {
          center: [center.lat, center.lng],
          zoom: center.zoom || 15,
          zoomControl: false,
          attributionControl: false,
        });

        // Add Initial Tile Layer
        const lConfig = LAYER_URLS[activeLayer];
        const tLayer = L.tileLayer(lConfig.url, {
          maxZoom: lConfig.maxZoom,
          subdomains: lConfig.subdomains,
          attribution: '&copy; OpenStreetMap &copy; CARTO',
        }).addTo(map);

        tileLayerRef.current = tLayer;
        mapInstanceRef.current = map;
      } else {
        mapInstanceRef.current.flyTo([center.lat, center.lng], center.zoom || 15, {
          duration: 1.2,
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

  // Update Tile Layer when user changes activeLayer
  useEffect(() => {
    if (typeof window === "undefined" || !mapInstanceRef.current) return;
    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }
      const lConfig = LAYER_URLS[activeLayer];
      const newLayer = L.tileLayer(lConfig.url, {
        maxZoom: lConfig.maxZoom,
        subdomains: lConfig.subdomains,
      }).addTo(map);
      tileLayerRef.current = newLayer;
    });
  }, [activeLayer]);

  // Handle GPS Current Location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setGpsLoading(false);
        if (mapInstanceRef.current) {
          import("leaflet").then((L) => {
            const map = mapInstanceRef.current;
            map.flyTo([latitude, longitude], 16, { duration: 1.5 });

            if (userGpsMarkerRef.current) {
              userGpsMarkerRef.current.remove();
            }

            const gpsIcon = L.divIcon({
              className: "custom-leaflet-gps-pin",
              html: `<div class="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center animate-ping">
                      <div class="w-3 h-3 bg-white rounded-full"></div>
                    </div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            });

            userGpsMarkerRef.current = L.marker([latitude, longitude], { icon: gpsIcon })
              .addTo(map)
              .bindPopup("<b>Your GPS Location</b>")
              .openPopup();
          });
        }
      },
      (err) => {
        setGpsLoading(false);
        alert("Could not access location: " + err.message);
      }
    );
  };

  // Handle Zoom In / Zoom Out
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  // Handle Fullscreen Toggle
  const handleToggleFullscreen = () => {
    const el = mapContainerRef.current?.parentElement;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[440px] rounded-2xl overflow-hidden border border-[#e5e5e5] shadow-xs group">
      <div ref={mapContainerRef} className="w-full h-full min-h-[440px] bg-slate-100 z-10" />

      {/* Map Header Overlay Badge */}
      <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur border border-[#e5e5e5] px-3.5 py-2 rounded-xl shadow-xs text-[11px] font-bold text-[#0a0a0a] flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>CARTO Authorized Map Engine • Watermark Free</span>
      </div>

      {/* Floating Control Panel (Google Maps Style Right-Side Toolbar) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        
        {/* Layer Switcher Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="w-9 h-9 bg-white hover:bg-gray-100 text-gray-800 rounded-xl border border-[#e5e5e5] shadow-md flex items-center justify-center transition-all"
            title="Switch Map Layers"
          >
            <Layers className="w-4 h-4 text-indigo-600" />
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 top-11 bg-white/95 backdrop-blur border border-[#e5e5e5] rounded-xl p-2 shadow-2xl w-44 space-y-1 text-xs font-bold text-[#0a0a0a] animate-in fade-in duration-150">
              <span className="block text-[9px] uppercase tracking-wider text-gray-400 px-2 py-1">
                Basemap Layers
              </span>
              {[
                { id: "voyager", label: "🗺️ Voyager Street" },
                { id: "positron", label: "☀️ Positron Light" },
                { id: "dark", label: "🌙 Dark Matter" },
                { id: "osm", label: "🌐 OpenStreetMap" },
              ].map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => {
                    setActiveLayer(layer.id as LayerOption);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-all ${
                    activeLayer === layer.id
                      ? "bg-[#0a0a0a] text-white shadow-2xs"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {layer.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* GPS Current Location Button */}
        <button
          onClick={handleGetCurrentLocation}
          disabled={gpsLoading}
          className="w-9 h-9 bg-white hover:bg-gray-100 text-gray-800 rounded-xl border border-[#e5e5e5] shadow-md flex items-center justify-center transition-all"
          title="Pan to My Location (GPS)"
        >
          {gpsLoading ? (
            <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
          ) : (
            <Compass className="w-4.5 h-4.5 text-blue-600" />
          )}
        </button>

        {/* Zoom In Button */}
        <button
          onClick={handleZoomIn}
          className="w-9 h-9 bg-white hover:bg-gray-100 text-gray-800 rounded-xl border border-[#e5e5e5] shadow-md flex items-center justify-center transition-all font-bold text-base"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Zoom Out Button */}
        <button
          onClick={handleZoomOut}
          className="w-9 h-9 bg-white hover:bg-gray-100 text-gray-800 rounded-xl border border-[#e5e5e5] shadow-md flex items-center justify-center transition-all font-bold text-base"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={handleToggleFullscreen}
          className="w-9 h-9 bg-white hover:bg-gray-100 text-gray-800 rounded-xl border border-[#e5e5e5] shadow-md flex items-center justify-center transition-all"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4 text-gray-700" />
        </button>

      </div>
    </div>
  );
}
