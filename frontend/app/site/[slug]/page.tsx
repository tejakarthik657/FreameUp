import { notFound } from "next/navigation";
import "@/templates";
import { getTemplate } from "@/templates/registry";
import { ThemeStyle } from "@/templates/_shared/ui/ThemeStyle";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getSiteData(slug: string) {
  const res = await fetch(`${API_URL}/sites/data/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error(`Failed to fetch site data: ${res.status}`);
  }

  return res.json();
}

export const dynamic = "force-dynamic";

export default async function SitePage({
  params,
}: {
  params: { slug: string };
}) {
  let data;
  try {
    data = await getSiteData(params.slug);
  } catch {
    notFound();
  }

  const TemplateComponent = getTemplate(data.manifest.template_id);

  return (
    <div className="min-h-screen relative pb-16">
      <ThemeStyle theme={data.manifest.theme} />
      {TemplateComponent ? (
        <TemplateComponent business={data.business} manifest={data.manifest} />
      ) : (
        <div className="p-20 text-center text-gray-500 font-sans">
          Template &quot;{data.manifest.template_id}&quot; not found or registered.
        </div>
      )}
      
      {/* Minimal, Floating Brand Watermark Badge */}
      <div className="fixed bottom-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-white/80 backdrop-blur-xs border border-gray-200/40 rounded-full shadow-xs text-[9px] font-sans text-gray-400 select-none z-50 hover:bg-white hover:text-gray-600 transition-all">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.jpeg" alt="DevFrames Logo" className="w-3.5 h-3.5 rounded-full object-cover opacity-60" />
        <span>Developed by <a href="https://devframes.vercel.app" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-indigo-600 hover:underline font-semibold">DevFrames</a></span>
      </div>
    </div>
  );
}
