"use client";
import type { ComponentType } from "react";
import { CtaBannerVariantProps } from "./types";
import V1 from "./v1"; import V2 from "./v2"; import V3 from "./v3"; import V4 from "./v4";
export const CTA_BANNER_VARIANTS: Record<string, ComponentType<CtaBannerVariantProps>> = { v1: V1, v2: V2, v3: V3, v4: V4 };
export function getCtaBannerVariant(id: string) { return CTA_BANNER_VARIANTS[id]; }
export type { CtaBannerVariantProps } from "./types";