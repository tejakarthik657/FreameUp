"use client";
import type { ComponentType } from "react";
import { FaqVariantProps } from "./types";
import V1 from "./v1"; import V2 from "./v2"; import V3 from "./v3";
export const FAQ_VARIANTS: Record<string, ComponentType<FaqVariantProps>> = { v1: V1, v2: V2, v3: V3 };
export function getFaqVariant(id: string) { return FAQ_VARIANTS[id]; }
export type { FaqVariantProps } from "./types";