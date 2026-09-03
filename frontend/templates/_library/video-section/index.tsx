"use client";
import type { ComponentType } from "react";
import { VideoSectionVariantProps } from "./types";
import V1 from "./v1"; import V2 from "./v2"; import V3 from "./v3";
export const VIDEO_SECTION_VARIANTS: Record<string, ComponentType<VideoSectionVariantProps>> = { v1: V1, v2: V2, v3: V3 };
export function getVideoSectionVariant(id: string) { return VIDEO_SECTION_VARIANTS[id]; }
export type { VideoSectionVariantProps } from "./types";