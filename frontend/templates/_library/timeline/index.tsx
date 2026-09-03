"use client";
import type { ComponentType } from "react";
import { TimelineVariantProps } from "./types";
import V1 from "./v1"; import V2 from "./v2"; import V3 from "./v3";
export const TIMELINE_VARIANTS: Record<string, ComponentType<TimelineVariantProps>> = { v1: V1, v2: V2, v3: V3 };
export function getTimelineVariant(id: string) { return TIMELINE_VARIANTS[id]; }
export type { TimelineVariantProps } from "./types";