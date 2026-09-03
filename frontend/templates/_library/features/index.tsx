"use client";
import type { ComponentType } from "react";
import { FeaturesVariantProps } from "./types";
import V1 from "./v1"; import V2 from "./v2"; import V3 from "./v3"; import V4 from "./v4";
export const FEATURES_VARIANTS: Record<string, ComponentType<FeaturesVariantProps>> = { v1: V1, v2: V2, v3: V3, v4: V4 };
export function getFeaturesVariant(id: string) { return FEATURES_VARIANTS[id]; }
export type { FeaturesVariantProps } from "./types";