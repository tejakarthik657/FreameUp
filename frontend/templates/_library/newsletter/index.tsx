"use client";
import type { ComponentType } from "react";
import { NewsletterVariantProps } from "./types";
import V1 from "./v1"; import V2 from "./v2"; import V3 from "./v3";
export const NEWSLETTER_VARIANTS: Record<string, ComponentType<NewsletterVariantProps>> = { v1: V1, v2: V2, v3: V3 };
export function getNewsletterVariant(id: string) { return NEWSLETTER_VARIANTS[id]; }
export type { NewsletterVariantProps } from "./types";