// Real Geocoding (Nominatim API) and OSRM Routing Engine Service

export interface SearchResult {
  place_id: number;
  display_name: string;
  lat: number;
  lng: number;
  type: string;
  address?: Record<string, string>;
}

export interface RouteResponse {
  distance_km: number;
  duration_mins: number;
  geometry: [number, number][]; // Array of [lat, lng] coordinates for polyline
  mode: "driving" | "walking" | "cycling";
}

// Real Geocoding Search via OpenStreetMap Nominatim API
export async function searchAddressNominatim(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&countrycodes=in&limit=6&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
        },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data || []).map((item: any) => ({
      place_id: item.place_id,
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: item.type || item.class || "location",
      address: item.address,
    }));
  } catch (e) {
    console.error("Nominatim search error:", e);
    return [];
  }
}

// OSRM Routing API (Driving / Walking / Cycling Directions)
export async function getOSRMRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  mode: "driving" | "walking" | "cycling" = "driving"
): Promise<RouteResponse | null> {
  const profile = mode === "walking" ? "foot" : mode === "cycling" ? "bike" : "car";
  const url = `https://router.project-osrm.org/route/v1/${profile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.routes || data.routes.length === 0) return null;

    const route = data.routes[0];
    const coords: [number, number][] = route.geometry.coordinates.map((c: [number, number]) => [
      c[1],
      c[0],
    ]);

    return {
      distance_km: Math.round((route.distance / 1000) * 10) / 10,
      duration_mins: Math.round(route.duration / 60),
      geometry: coords,
      mode: mode,
    };
  } catch (e) {
    console.error("OSRM Route fetch error:", e);
    return null;
  }
}
