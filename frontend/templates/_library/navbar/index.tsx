"use client";

import type { ComponentType } from "react";
import { NavbarVariantProps } from "./types";

import V1 from "./v1";
import V2 from "./v2";
import V3 from "./v3";
import V4 from "./v4";
import V5 from "./v5";
import V6 from "./v6";
import V7 from "./v7";
import V8 from "./v8";
import V9 from "./v9";
import V10 from "./v10";

export const NAVBAR_VARIANTS: Record<string, ComponentType<NavbarVariantProps>> = {
  v1: V1,
  v2: V2,
  v3: V3,
  v4: V4,
  v5: V5,
  v6: V6,
  v7: V7,
  v8: V8,
  v9: V9,
  v10: V10,
};

export function getNavbarVariant(id: string): ComponentType<NavbarVariantProps> | undefined {
  return NAVBAR_VARIANTS[id];
}

export { DEFAULT_LINKS } from "./types";
export type { NavbarVariantProps } from "./types";