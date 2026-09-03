"use client";
import type { ComponentType } from "react";
import { AnnouncementBarVariantProps } from "./types";
import V1 from "./v1"; import V2 from "./v2"; import V3 from "./v3";
export const ANNOUNCEMENT_BAR_VARIANTS: Record<string, ComponentType<AnnouncementBarVariantProps>> = { v1: V1, v2: V2, v3: V3 };
export function getAnnouncementBarVariant(id: string) { return ANNOUNCEMENT_BAR_VARIANTS[id]; }
export type { AnnouncementBarVariantProps } from "./types";