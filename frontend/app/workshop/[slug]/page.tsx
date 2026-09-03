import WorkshopClient from "../WorkshopClient";

export const dynamic = "force-dynamic";

export default function SiteWorkshopPage({ params }: { params: { slug: string } }) {
  return <WorkshopClient slug={params.slug} />;
}