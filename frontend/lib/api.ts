const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  signup: (email: string, password: string) =>
    request("/auth/signup", { method: "POST", body: JSON.stringify({ email, password }) }),
  login: (email: string, password: string) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: async () => {
    if (typeof document !== "undefined") {
      // Clear token from client cookie across all path variations
      document.cookie = "devframes_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    try {
      await request("/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors on logout if backend is unreachable
    }
  },
  getMe: () => request<import("./types").UserProfileResponse>("/auth/me"),
  updateProfile: (payload: { name: string; email: string; password?: string }) =>
    request("/auth/profile", { method: "PUT", body: JSON.stringify(payload) }),
  updateSettings: (payload: { model: string; base_domain: string; static_deploy: string; enable_ai: boolean }) =>
    request("/auth/settings", { method: "PUT", body: JSON.stringify(payload) }),

  // Business
  createBusiness: (payload: unknown) =>
    request("/business", { method: "POST", body: JSON.stringify(payload) }),
  getBusiness: (id: string) => request(`/business/${id}`),
  listBusinesses: () => request<import("./types").BusinessOut[]>("/business"),

  // Image upload
  uploadImage: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_URL}/business/upload-image`, {
      method: "POST",
      credentials: "include",
      body: form,
    });
    if (!res.ok) throw new Error("Image upload failed");
    return res.json() as Promise<{ url: string }>;
  },

  // Sites
  listTemplates: () => request<{ templates: string[] }>("/sites/templates"),
  listSites: () => request<import("./types").WebsiteOut[]>("/sites"),
  createWebsite: (payload: {
    business_id: string;
    template: string;
    style_choice_image_id: string;
    palette_id?: string;
    font_id?: string;
  }) => request("/sites", { method: "POST", body: JSON.stringify(payload) }),
  getSiteData: (slug: string) =>
    request<import("./types").SiteDataResponse>(`/sites/data/${slug}`),
  updateSiteManifest: (siteId: string, renderManifest: import("./types").RenderManifest) =>
    request<import("./types").WebsiteOut>(`/sites/${siteId}/manifest`, {
      method: "PUT",
      body: JSON.stringify({ render_manifest: renderManifest }),
    }),
  generateStatic: (siteId: string) =>
    request<{ ok: boolean; slug: string; bytes: number; generated_at: string }>(
      `/sites/${siteId}/generate-static`,
      { method: "POST" }
    ),
  regenerateSite: (siteId: string, payload: { scope: string; palette_id?: string; font_id?: string }) =>
    request<import("./types").WebsiteOut>(`/sites/${siteId}/regenerate`, { method: "POST", body: JSON.stringify(payload) }),

  // Marketplace
  listPalettes: () => request<{ palettes: import("./types").Palette[] }>("/marketplace/palettes"),
  listFonts: () => request<{ fonts: import("./types").FontPairing[] }>("/marketplace/fonts"),
  listStockImages: (category: string) =>
    request<{ images: import("./types").StockImage[] }>(`/marketplace/stock-images?category=${category}`),

  // AI Helpers
  enhanceField: (payload: { field_name: string; current_value: string; category: string; context: Record<string, unknown> }) =>
    request<{ enhanced_value: string }>("/ai/enhance-field", { method: "POST", body: JSON.stringify(payload) }),
  parseOfferings: (payload: { raw_text: string; category: string }) =>
    request<{ items: any[] }>("/ai/parse-offerings", { method: "POST", body: JSON.stringify(payload) }),
  getGlobalStats: () =>
    request<{ total_sites: number; total_businesses: number; total_users: number; total_images: number }>("/sites/stats/global"),
  listLeads: (businessId: string) =>
    request<import("./types").LeadResponse[]>(`/leads/business/${businessId}`),

  // Posters API
  listPosters: () =>
    request<import("./types").PosterResponse[]>("/posters"),
  createPoster: (payload: { 
    business_id: string; 
    goal: string; 
    aspect_ratio: string; 
    promo_details?: string;
    logo_url?: string;
    image_url?: string;
  }) =>
    request<import("./types").PosterResponse>("/posters", { method: "POST", body: JSON.stringify(payload) }),
  deletePoster: (posterId: string) =>
    request<{ ok: boolean }>(`/posters/${posterId}`, { method: "DELETE" }),
};

export { API_URL };
