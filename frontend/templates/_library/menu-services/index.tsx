"use client";
import type { ComponentType } from "react";
import { MenuServicesVariantProps } from "./types";
import V1 from "./v1"; import V2 from "./v2"; import V3 from "./v3";
export const MENU_SERVICES_VARIANTS: Record<string, ComponentType<MenuServicesVariantProps>> = { v1: V1, v2: V2, v3: V3 };
export function getMenuServicesVariant(id: string) { return MENU_SERVICES_VARIANTS[id]; }
export type { MenuServicesVariantProps } from "./types";