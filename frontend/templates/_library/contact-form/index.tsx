"use client";
import type { ComponentType } from "react";
import { ContactFormVariantProps } from "./types";
import V1 from "./v1"; import V2 from "./v2"; import V3 from "./v3"; import V4 from "./v4";
export const CONTACT_FORM_VARIANTS: Record<string, ComponentType<ContactFormVariantProps>> = { v1: V1, v2: V2, v3: V3, v4: V4 };
export function getContactFormVariant(id: string) { return CONTACT_FORM_VARIANTS[id]; }
export type { ContactFormVariantProps } from "./types";