import { Business } from "@/lib/types";
import { RenderManifest } from "@/lib/types";

export interface TemplateProps {
  business: Business;
  manifest: RenderManifest;
}

export interface SectionProps {
  business: Business;
  data?: Record<string, unknown>;
  density?: string;
}
