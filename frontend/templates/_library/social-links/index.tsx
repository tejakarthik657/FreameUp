"use client";
import type { ComponentType } from "react";
import { SocialLinksVariantProps } from "./types";
import V1 from "./v1"; import V2 from "./v2"; import V3 from "./v3";
export const SOCIAL_LINKS_VARIANTS: Record<string, ComponentType<SocialLinksVariantProps>> = { v1: V1, v2: V2, v3: V3 };
export function getSocialLinksVariant(id: string) { return SOCIAL_LINKS_VARIANTS[id]; }
export type { SocialLinksVariantProps } from "./types";