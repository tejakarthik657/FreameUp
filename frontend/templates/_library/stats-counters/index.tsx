"use client";
import type { ComponentType } from "react";
import { StatsCountersVariantProps } from "./types";
import V1 from "./v1"; import V2 from "./v2"; import V3 from "./v3";
export const STATS_COUNTERS_VARIANTS: Record<string, ComponentType<StatsCountersVariantProps>> = { v1: V1, v2: V2, v3: V3 };
export function getStatsCountersVariant(id: string) { return STATS_COUNTERS_VARIANTS[id]; }
export type { StatsCountersVariantProps } from "./types";