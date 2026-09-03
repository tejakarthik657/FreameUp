"use client";
import type { ComponentType } from "react";
import { MapLocationVariantProps } from "./types";
import V1 from "./v1"; import V2 from "./v2"; import V3 from "./v3";
export const MAP_LOCATION_VARIANTS: Record<string, ComponentType<MapLocationVariantProps>> = { v1: V1, v2: V2, v3: V3 };
export function getMapLocationVariant(id: string) { return MAP_LOCATION_VARIANTS[id]; }
export type { MapLocationVariantProps } from "./types";