"use client";

import type { ComponentType } from "react";
import { HeroVariantProps } from "./types";

import V1 from "./v1";
import V2 from "./v2";
import V3 from "./v3";
import V4 from "./v4";
import V5 from "./v5";
import V6 from "./v6";

export const HERO_VARIANTS: Record<string, ComponentType<HeroVariantProps>> = {
  v1: V1,
  v2: V2,
  v3: V3,
  v4: V4,
  v5: V5,
  v6: V6,
};

export function getHeroVariant(id: string): ComponentType<HeroVariantProps> | undefined {
  return HERO_VARIANTS[id];
}

export type { HeroVariantProps } from "./types";