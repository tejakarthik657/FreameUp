"use client";
import type { ComponentType } from "react";
import { OpeningHoursVariantProps } from "./types";
import V1 from "./v1"; import V2 from "./v2"; import V3 from "./v3";
export const OPENING_HOURS_VARIANTS: Record<string, ComponentType<OpeningHoursVariantProps>> = { v1: V1, v2: V2, v3: V3 };
export function getOpeningHoursVariant(id: string) { return OPENING_HOURS_VARIANTS[id]; }
export type { OpeningHoursVariantProps } from "./types";