"use client";
import type { ComponentType } from "react";
import { BlogTeaserVariantProps } from "./types";
import V1 from "./v1"; import V2 from "./v2"; import V3 from "./v3";
export const BLOG_TEASER_VARIANTS: Record<string, ComponentType<BlogTeaserVariantProps>> = { v1: V1, v2: V2, v3: V3 };
export function getBlogTeaserVariant(id: string) { return BLOG_TEASER_VARIANTS[id]; }
export type { BlogTeaserVariantProps } from "./types";