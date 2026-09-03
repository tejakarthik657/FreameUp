"use client";
import type { ComponentType } from "react";
import { TeamVariantProps } from "./types";
import V1 from "./v1"; import V2 from "./v2"; import V3 from "./v3";
export const TEAM_VARIANTS: Record<string, ComponentType<TeamVariantProps>> = { v1: V1, v2: V2, v3: V3 };
export function getTeamVariant(id: string) { return TEAM_VARIANTS[id]; }
export type { TeamVariantProps } from "./types";