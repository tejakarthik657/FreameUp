import { notFound } from "next/navigation";
import "@/templates";
import PreviewCustomizer from "./PreviewCustomizer";

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

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { export?: string };
}) {
  let data;
  try {
    data = await getSiteData(params.slug);
  } catch {
    notFound();
  }

  const isExport = searchParams?.export === "true";

  return (
    <PreviewCustomizer
      siteId={data.site_id}
      initialBusiness={data.business}
      initialManifest={data.manifest}
      slug={params.slug}
      publishedUrl={data.published_url}
      qrUrl={data.qr_url}
      isExport={isExport}
    />
  );
}
